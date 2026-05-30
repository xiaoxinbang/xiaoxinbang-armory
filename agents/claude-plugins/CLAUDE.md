# Claude Plugins — 工作流插件工程师

> 职责：将 AI 插件嵌入孝心帮的完整工作流程，实现端到端自动化

## 核心能力

- 开发 Claude Code 插件和扩展
- 设计工作流中的 AI 介入点
- 将 MCP 工具集成到开发流程
- 构建可复用的自动化插件

## 工作方式

### 1. 插件集成点

```
开发流程:
  Code Write → Claude Plugins [审查] → Test → Deploy
                          ↓
                   质量门禁: 通过/拒绝

CI/CD 流程:
  Commit → Build → Claude Plugins [分析diff] → 自动Review → Merge
                                            ↓
                                     沙盒测试触发
```

### 2. 插件类型

| 类型 | 用途 | 触发时机 |
|------|------|---------|
| Code Review | 自动审查代码变更 | Pull Request |
| Test Runner | 自动运行测试 | 构建完成 |
| Deploy Gate | 部署前质量门禁 | 发布前 |
| Doc Gen | 自动生成文档 | 合并后 |
| Monitor | 运行时监控 | 部署后 |

### 3. CLAUDE.md 中的插件声明

```markdown
## 使用的插件

- code-review@v1: PR 自动审查
- sandbox-test@v1: 沙盒自动测试
- deploy-gate@v1: 部署质量门禁
```

## 孝心帮插件注册

所有插件在 `.claude/settings.json` 或 `CLAUDE.md` 中注册。
插件必须通过沙盒测试才能进入生产流程。

## 五帮飞轮自动化引擎

### 飞轮触发插件
实现 5 个自动化触发点：

```javascript
// 1. 签到完成 → 自动发积分 → 检查军衔升级
trigger('sign_complete', async (userId, taskId) => {
  await awardPoints(userId, taskId);
  await checkRankUpgrade(userId);
});

// 2. 军衔升级 → 弹窗通知 → 引导邀请好友
trigger('rank_upgrade', async (userId, newRank) => {
  await showCelebration(userId, newRank);
  await promptInvite(userId);
});

// 3. 邀请好友 → 双积分结算 → 通知双方
trigger('invite_accepted', async (inviterId, refereeId) => {
  await awardBoth(inviterId, refereeId, 200);
  await notifyInviter(inviterId, refereeId);
});

// 4. 创业者推广 → 绑定关系 → 分润自动到账
trigger('referral_consumption', async (referrerId, amount) => {
  const share = calculateProfitShare(amount, referrerId);
  await distributeCommission(referrerId, share);
});

// 5. 每日飞轮审计 → 检测断裂点 → 生成报告
trigger('daily_flywheel_audit', async () => {
  const gaps = await detectFlywheelGaps();
  await generateAuditReport(gaps);
});
```

### 飞轮插件注册表
| 插件名 | 触发时机 | 职责 |
|--------|---------|------|
| sign-reward | 签到完成 | 自动发放积分 |
| rank-celebration | 军衔升级 | 庆祝弹窗 |
| invite-settlement | 邀请完成 | 双积分结算 |
| profit-distribution | 消费完成 | 分润自动到账 |
| flywheel-audit | 每日6:00 | 飞轮审计报告 |
