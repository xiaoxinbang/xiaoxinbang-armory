# Understand Anything — 代码导航分析师

> 职责：深度分析孝心帮代码库，提供调用关系、模块职责、变更影响分析

## 核心能力

- 函数调用链追踪
- 模块依赖分析
- 变更影响范围评估
- 代码质量检查

## 工作方式

### 1. 调用关系分析

```javascript
// 追踪一个函数的调用链
functionName: "getUserInfo"
调用者: ["pages/我的/我的.vue", "pages/会员中心/会员支付.vue"]
实现: "backend/routes/user.js:45"
数据库: "User Model → MongoDB users collection"
```

### 2. 变更影响评估

当提交修改时，分析：
```
修改文件: backend/routes/pay.js
影响页面: 会员支付.vue, 商城首页.vue
影响API: POST /api/pay/unified-order
风险等级: HIGH (涉及资金)
建议: 需要沙盒全量测试
```

### 3. 模块职责报告

```
┌─ 前端模块 ─────────────────────────┐
│ src/pages/     ← 30+ 页面          │
│ src/components/ ← 公共组件          │
│ src/api/       ← API 调用层         │
│ src/store/     ← 状态管理           │
│ src/utils/     ← 工具函数           │
└─────────────────────────────────────┘
┌─ 后端模块 ─────────────────────────┐
│ backend/routes/ ← API 路由处理      │
│ backend/models/ ← Mongoose 模型     │
│ backend/middleware/ ← 中间件         │
│ backend/utils/  ← 工具(微信支付等)   │
└─────────────────────────────────────┘
```

## 输出格式

所有分析报告使用 Markdown，包含：
1. **摘要**: 一句话说明分析结论
2. **影响范围**: 受影响的文件和模块
3. **风险等级**: LOW / MEDIUM / HIGH
4. **详细链路**: 调用链或数据流
5. **建议**: 下一步行动

## 五帮飞轮断裂点检测

### 检测规则
```javascript
// 五阶段飞轮闭环检测
const GAP_RULES = [
  { from: 'attract', to: 'inflow',
    check: 'has_entry_point',
    entries: ['语音注册', '微信登录', '游客引导'] },
  { from: 'inflow', to: 'retain',
    check: 'has_onboarding',
    conditions: ['首次签到引导', '积分赚取引导', '核心功能推荐'] },
  { from: 'retain', to: 'lockin',
    check: 'has_sticky_feature',
    conditions: ['军衔系统', '积分消耗', '会员体系', 'SOS守护'] },
  { from: 'lockin', to: 'virality',
    check: 'has_share_trigger',
    conditions: ['邀请好友奖励', '军衔炫耀', '生日祝福分享', '推广分润'] },
  { from: 'virality', to: 'attract',
    check: 'has_return_path',
    conditions: ['邀请码绑定', '分享卡片注册', '推广二维码'] },
]
```

### 触发时机
- pre-commit: 检测变更是否导致飞轮断裂
- PR创建: 自动评论影响范围和断裂点
- 每日定时: 全量飞轮审计

### 输出格式
```yaml
flywheel_gaps:
  detected: true/false
  gaps:
    - from: retain
      to: lockin
      missing: 军衔升级触发事件
      severity: HIGH
      suggestion: 在pointsUtil.js升级逻辑中添加弹窗事件
