# 孝心帮"五帮五维"全自动飞轮架构设计

> 版本: v1.0 | 日期: 2026-05-27 | 规划人: 智能体指挥官

---

## 目录

1. [五帮全角色地图](#1)
2. [飞轮引擎设计](#2)
3. [6 Agent分工](#3)
4. [工作流编排](#4)
5. [数据闭环](#5)
6. [沙盒验证方案](#6)

---

<a name="1"></a>
## 1. 五帮全角色地图

### 1.1 帮长辈 (Help Elderly) - 老有所依、老有所为、老有所得

| 编号 | 页面路径 | 核心功能 | 飞轮阶段 |
|------|---------|---------|---------|
| E01 | pages/健康数据/健康数据 | 健康指标记录查看 | 留住(Retain) |
| E02 | pages/健康百科/健康百科 | 健康知识科普 | 留住(Retain) |
| E03 | pages/健康咨询/健康咨询 | AI健康问答 | 留住(Retain) |
| E04 | pages/用药提醒/* | 用药提醒(3子页) | 留住(Retain) |
| E05 | pages/天气查询/天气查询 | 天气查询 | 流入(Inflow) |
| E06 | pages/日历黄历/日历黄历 | 日历黄历宜忌 | 留住(Retain) |
| E07 | pages/老照片修复/老照片修复 | AI老照片修复 | 留住(Retain) |
| E08 | pages/照片修复/照片修复 | 照片修复增强 | 留住(Retain) |
| E09 | pages/语音导诊/语音导诊 | 语音导诊挂号 | 留住(Retain) |
| E10 | pages/睡眠助手/睡眠助手 | 睡眠监测建议 | 留住(Retain) |
| E11 | pages/闹钟提醒/闹钟提醒 | 闹钟提醒 | 留住(Retain) |
| E12 | pages/防骗指南/防骗指南 | 反诈知识 | 留住(Retain) |
| E13 | pages/紧急求助/* | SOS呼救(6子页) | 锁住(Lock-in) |
| E14 | pages/远程看护/远程看护 | 远程看护 | 锁住(Lock-in) |
| E15 | pages/智能聊天/智能聊天 | AI智能聊天 | 留住(Retain) |
| E16 | pages/语音注册/语音注册 | 语音注册登录 | 流入(Inflow) |
| E17 | pages/求助引导/求助引导 | 求助引导页 | 流入(Inflow) |

**后端支撑文件:**
- backend/routes/health.js - 健康数据API
- backend/routes/aiHealth.js - AI健康咨询API (豆包API代理)
- backend/routes/sosMonitor.js - SOS三色状态监控
- backend/models/HealthRecord.js - 健康记录模型
- src/utils/aiHealth.js - AI健康助手
- src/utils/sosService.js - SOS呼救服务
- src/utils/sosEnhanced.js - SOS增强版v2.0
- src/utils/weatherUtil.js - 天气工具
- src/utils/lunarUtil.js - 农历黄历工具

### 1.2 帮家属 (Help Families) - 远程尽孝、安心无忧、孝心常伴

| 编号 | 页面路径 | 核心功能 | 飞轮阶段 |
|------|---------|---------|---------|
| F01 | pages/家属助手/家属助手 | 家属端综合面板 | 留住(Retain) |
| F02 | pages/远程看护/远程看护 | 远程监控长辈 | 锁住(Lock-in) |
| F03 | pages/生日祝福/* | 生日祝福(2子页) | 裂变(Virality) |
| F04 | pages/相册照片/相册照片 | 照片共享 | 留住(Retain) |
| F05 | pages/通话引导/通话引导 | 亲情通话引导 | 留住(Retain) |
| F06 | pages/邀请好友/邀请好友 | 邀请家人注册 | 裂变(Virality) |
| F07 | pages/个人资料/个人资料 | 编辑资料 | 流入(Inflow) |

**后端支撑文件:**
- backend/routes/user.js - 用户信息管理
- backend/routes/auth.js - 微信登录/游客登录
- src/utils/birthdayUtil.js - 生日工具
- src/utils/userMemory.js - 用户记忆系统
- src/utils/videoGuide.js - 视频引导

### 1.3 帮社区 (Help Community) - AI便民、暖心服务、共建美好家园

| 编号 | 页面路径 | 核心功能 | 飞轮阶段 |
|------|---------|---------|---------|
| C01 | pages/社区入驻/社区入驻 | 社区入驻申请 | 引流(Attract) |
| C02 | pages/社区公告/社区公告 | 社区公告查看 | 留住(Retain) |
| C03 | pages/通知公告/通知公告 | 通知公告 | 留住(Retain) |
| C04 | pages/帮助中心/* | 帮助中心(12子页) | 留住(Retain) |
| C05 | pages/全部功能/全部功能 | 全部功能列表 | 留住(Retain) |
| C06 | pages/求助引导/求助引导 | SOS互助引导 | 锁住(Lock-in) |
| C07 | pages/每日签到/每日签到 | 每日签到打卡 | 留住(Retain) |
| C08 | pages/公会/公会首页 | 公会/社区 | 留住(Retain) |
| C09 | pages/新闻早报/新闻早报 | 新闻播报(Tab) | 留住(Retain) |
| C10 | pages/影音娱乐中心/影音娱乐中心 | 影音娱乐 | 留住(Retain) |
| C11 | pages/小游戏/小游戏 | 小游戏(Tab) | 留住(Retain) |

**后端支撑文件:**
- backend/routes/notice.js - 社区公告+反诈文章
- backend/routes/behavior.js - 行为画像
- backend/routes/newsProxy.js - 新闻早报代理
- src/utils/newsApi.js - 新闻API
- src/utils/newsBehavior.js - 新闻行为
- src/utils/newsTTSBackground.js - 新闻TTS
- src/utils/gameDDA.js - DDA游戏引擎
- src/utils/guild.js - 公会系统
- src/utils/honorBoard.js - 荣誉榜

### 1.4 帮商家 (Help Businesses) - 智能引流、轻松长效盈利

| 编号 | 页面路径 | 核心功能 | 飞轮阶段 |
|------|---------|---------|---------|
| B01 | pages/商家入驻/商家入驻 | 商家入驻 | 引流(Attract) |
| B02 | pages/商城/商城首页 | 商城首页 | 锁住(Lock-in) |
| B03 | pages/商城/商家详情 | 商家详情页 | 锁住(Lock-in) |
| B04 | pages/商城/商家入驻申请 | 商家入驻申请 | 引流(Attract) |
| B05 | pages/会员中心/会员支付 | 会员支付 | 锁住(Lock-in) |
| B06 | pages/花积分/花积分 | 积分消费商城 | 锁住(Lock-in) |
| B07 | pages/APP权益预告/APP权益预告 | APP权益预告 | 引流(Attract) |

**后端支撑文件:**
- backend/routes/pointsShop.js - 积分商城路由
- backend/routes/pay.js - 微信支付路由
- backend/routes/cosProxy.js - COS签名代理
- backend/routes/cosUpload.js - COS文件上传
- backend/utils/wx-pay.js - 微信支付工具
- backend/models/Order.js - 订单模型
- src/utils/payUtil.js - 支付前端工具
- src/utils/orderPayUtil.js - 订单支付工具
- src/utils/cosAuth.js - COS前端鉴权

### 1.5 帮创业 (Help Entrepreneurs) - 孝心蓝海、零风险、轻松创业

| 编号 | 页面路径 | 核心功能 | 飞轮阶段 |
|------|---------|---------|---------|
| P01 | pages/创业中心/创业首页 | 创业中心首页 | 引流(Attract) |
| P02 | pages/创业中心/我的收入 | 收入明细 | 锁住(Lock-in) |
| P03 | pages/创业中心/邀请商家 | 邀请商家入驻 | 裂变(Virality) |
| P04 | pages/创业中心/推广用户 | 推广用户 | 裂变(Virality) |
| P05 | pages/创业中心/我的团队 | 团队管理 | 留住(Retain) |
| P06 | pages/招募中心/招募中心 | 招募合伙人 | 引流(Attract) |
| P07 | pages/赚零花钱/赚零花钱 | 零钱任务 | 留住(Retain) |
| P08 | pages/邀请好友/邀请好友 | 推广邀请 | 裂变(Virality) |
| P09 | pages/荣誉榜/荣誉榜 | 创业者荣誉榜 | 留住(Retain) |
| P10 | pages/排行榜/排行榜 | 综合排行 | 留住(Retain) |

**后端支撑文件:**
- backend/routes/points.js - 积分路由(分润计算)
- backend/models/User.js - 用户模型(邀请码)
- backend/models/PointsFlow.js - 积分流水
- src/utils/pointsUtil.js - 积分核心模块(分润比例)
- src/utils/inviteInviterLedger.js - 邀请人分账
- src/utils/inviteRefereeReward.js - 被邀请人奖励
- src/utils/recruitGame.js - 招募游戏化
- src/utils/recommendEngine.js - 推荐引擎


<a name="2"></a>
## 2. 飞轮引擎设计

### 2.1 五阶段飞轮链路

```
                    +-------------------------+
                    |  1. 引流 (Attract)      |
                    |  社区入驻 + 商家入驻     |
                    |  招募中心 + APP权益预告  |
                    |  邀请好友 + 推广用户     |
                    +-----------+-------------+
                                | 新用户注册/扫码
                                v
                    +-------------------------+
                    |  2. 流入 (Inflow)       |
                    |  微信登录 + 语音注册     |
                    |  游客引导 + 个人资料     |
                    |  求助引导 + 字体设置     |
                    +-----------+-------------+
                                | 完成 onboarding
                                v
                    +-------------------------+
          +-------+  3. 留住 (Retain)        |
          |       |  每日签到 + 赚积分        |
          |       |  游戏 + 娱乐 + 健康       |
          |       |  新闻 + 社区 + 防骗       |
          |       |  实用工具 + 全部功能      |
          |       +-----------+-------------+
          |                   | 达到活跃阈值
          |                   v
          |       +-------------------------+
          |       |  4. 锁住 (Lock-in)      |
          |       |  会员体系 + 军衔系统     |
          |       |  积分沉淀 + 成就勋章     |
          |       |  SOS守护 + 远程看护      |
          |       |  商城 + 花积分 + 会员    |
          |       +-----------+-------------+
          |                   | 自传播触发
          |                   v
          |       +-------------------------+
          |       |  5. 裂变 (Virality)     |
          |       |  邀请奖励 + 推广返佣     |
          |       |  生日祝福 + 社区扩散     |
          |       |  商家邀请 + 内容分享     |
          |       +-----------+-------------+
          |                   | 回流新用户
          +-------------------+
```

### 2.2 阶段触发规则

#### 阶段1-2 引流->流入 触发条件

| 触发源 | 触发条件 | 自动化动作 | 涉及的文件 |
|--------|---------|-----------|-----------|
| 邀请好友分享 | 微信分享卡片被打开 | 自动识别邀请码,预填推荐关系 | inviteRefereeReward.js |
| 社区入驻审核通过 | 后台审核状态变更 | 发送入驻成功通知,引导个人资料 | backend/routes/notice.js |
| 商家入驻审核通过 | 后台审核状态变更 | 发送商家后台入口,引导上架商品 | pages/商家入驻/ |
| APP权益预告页 | 点击立即体验 | 跳转下载/注册页 | pages/APP权益预告/ |
| SOS互助触达 | 陌生人通过互助联系 | 引导注册账户 | sosEnhanced.js |

#### 阶段2-3 流入->留住 触发条件

| 触发源 | 触发条件 | 自动化动作 |
|--------|---------|-----------|
| 微信登录成功 | 首次获取到openid | 创建用户,分配初始积分,跳转首页 |
| 游客注册 | 点击游客体验 | 创建匿名用户,引导完成个人资料 |
| 语音注册完成 | 语音识别成功 | 自动填写昵称,完成Onboarding |
| 个人资料填写 | 完成昵称+头像+年龄 | 发放30分一次性奖励(profile_done) |
| 求助引导完成 | 浏览完引导页 | 跳转核心功能页 |

#### 阶段3-4 留住->锁住 触发条件

| 触发源 | 触发条件 | 自动化动作 | 积分规则 |
|--------|---------|-----------|---------|
| 每日签到(morning/noon/evening) | 在时段内点击签到 | 发放30分+连续签到奖励 | DAILY_TASKS.sign_*: 30分 |
| 吃药打卡 | 点击已吃药 | 发放20分 | DAILY_TASKS.medication: 20分 |
| 健康运动 | 步数>=2000 | 发放20分 | DAILY_TASKS.walk: 20分 |
| 反诈学习 | 阅读一篇防骗文章 | 发放20分 | DAILY_TASKS.antiscam: 20分 |
| 军衔升级 | totalPoints达到阈值 | 全站广播+成就勋章 | 18级军衔自动计算 |
| 商城浏览>30秒 | 页面停留超30s | 发放30分 | MallBrowseRewardBar.vue |

**关键代码**: src/utils/pointsUtil.js (全部积分规则唯一定义)
**后端API**: backend/routes/points.js (积分增/减/流水)

#### 阶段4-5 锁住->裂变 触发条件

| 触发源 | 触发条件 | 自动化动作 |
|--------|---------|-----------|
| 首次商城下单 | 订单状态->paid | 发放100分 + 弹窗引导邀请好友 |
| 军衔达到上士 | 军衔自动升级 | 弹窗解锁邀请资格 |
| SOS开通VIP | 完成VIP支付 | 引导分享给家人 |
| 积分消耗 | 兑换商城优惠券 | 弹窗引导分享给好友 |
| 生日祝福 | 到设定日期 | 自动推送祝福卡片可分享 |

#### 阶段5-1 裂变->引流 完整回路

| 裂变方式 | 执行机制 | 奖励规则 | 涉及文件 |
|---------|---------|---------|---------|
| 邀请好友注册 | 分享邀请码/卡片 | 双方各得200分 | first_share任务 |
| 推广用户(创业) | 创业者推广二维码 | 新人消费30%分润 | config.js分润比 |
| 邀请商家入驻 | 创业者邀请商家 | 商家流水5%分润 | config.js分润比 |
| 社区扩散 | 内容分享到微信群 | 阅读奖励积分 | recommendEngine.js |
| 生日祝福传播 | 祝福卡片转发 | 情感驱动自然裂变 | birthdayUtil.js |

### 2.3 用户角色双轨制

系统支持两种用户角色，两条并行轨道的飞轮：

```
用户角色:
  +- user(赚积分) ------ 积分体系 + 军衔系统 + 消耗闭环
  |   适用: 长辈、家属、普通用户
  |   飞轮: 签到->积分->军衔->成就->炫耀->邀请->回流
  |
  +- entrepreneur(赚钱) - 分润体系 + 团队管理 + 现金收益
      适用: 创业者、推广者、社区KOL
      飞轮: 推广->邀请->分润->团队->升级->更多推广->回流

角色切换: pages/我的/我的.vue 中的 role-switch 组件
```



<a name="3"></a>
## 3. 6 Agent分工

### 3.1 智能体-飞轮职责矩阵

| Agent | 飞轮阶段 | 核心职责 | Armory文件 |
|-------|---------|---------|-----------|
| CodeGraph | 全阶段(分析层) | 构建五帮页面知识图谱、API依赖分析、数据流追踪 | agents/codegraph/CLAUDE.md |
| Understand Anything | 1->2->3(导航层) | 变更影响分析、调用链追踪、新增页面依赖检查 | agents/understand-anything/CLAUDE.md |
| Karpathy Skills | 2->3(规范层) | 编写CLAUDE.md规则、积分规则校验、分润计算规范 | agents/karpathy-skills/CLAUDE.md |
| Claude Plugins | 4->5(自动化层) | 飞轮触发插件、质量门禁、自动部署链 | agents/claude-plugins/CLAUDE.md |
| Presenton | 5(内容层) | 裂变内容PPT生成、社区公告文档、帮助中心PDF | agents/presenton/CLAUDE.md |
| LongLive | 1->5(视频层) | 长辈使用教程视频、功能宣传视频、更新日志视频 | agents/longlive/CLAUDE.md |

### 3.2 各Agent详细职责

#### CodeGraph - 飞轮地图构建者

负责输出:
- 五帮页面关系图 (帮长辈/家属/社区/商家/创业)
- 飞轮阶段覆盖仪表盘 (每个页面属于哪个阶段)
- API与页面依赖矩阵 (哪些API被哪些页面调用)
- 积分/分润流转图 (积分从产生到消耗的完整路径)
- 数据模型关系图 (User->PointsFlow->Order->...)

触发时机:
- 每次项目结构变更后自动扫描
- 每次新页面/路由添加后增量更新

输出格式: knowledge-graph.yaml

#### Understand Anything - 飞轮变更分析师

负责输出:
- 变更影响报告 (新增/修改页面影响哪些飞轮阶段)
- 调用链追踪 (一个功能从UI到数据库的完整链路)
- 飞轮断裂检测 (检测哪个阶段缺少到下一阶段的触发)
- 角色覆盖检查 (新功能是否遗漏了user/entrepreneur双角色)

触发时机:
- git提交前(pre-commit hook检测断裂点)
- PR创建时(自动评论影响范围)

风险等级:
- HIGH: 涉及支付/积分/SOS (需沙盒全量测试)
- MEDIUM: 涉及用户数据/页面路由
- LOW: 纯UI/文案变更

#### Karpathy Skills - 飞轮规则制定者

负责制定:
- 积分规则规范 (每个taskId的积分值、频次、上限)
- 分润计算规范 (五级分润比例、触发条件、结算周期)
- 飞轮触发规则 (每个阶段转换的条件和自动化动作)
- API响应规范 (success/code/data/message 四字段标准)
- 适老化规范 (字体、语音、三步完成、语音引导)

已有规则校验:
- pointsUtil.js 中的 DAILY_TASKS 和 BONUS_TASKS 完整度
- config.js 中的 profitSharing 分润比例数学正确性
- 每个页面是否包含 WarmHeader 组件

#### Claude Plugins - 飞轮自动化引擎

负责开发/维护:
- 飞轮触发插件 (自动检测阶段转换条件并执行动作)
- 积分结算插件 (每日240分上限、首次奖励频次控制)
- 裂变追踪插件 (邀请链关系、推广返佣自动结算)
- 沙盒测试插件 (自动运行集成测试、生成报告)
- 质量门禁插件 (测试覆盖率>=80%、无高危漏洞)

飞轮自动化触发点(需实现):
1. 用户完成签到 -> 自动发放积分 -> 检查军衔升级
2. 军衔升级 -> 自动弹窗 -> 引导邀请好友
3. 邀请好友注册 -> 双积分自动结算 -> 通知邀请人
4. 创业者推广 -> 自动绑定关系 -> 订单分润自动到账

#### Presenton - 飞轮内容引擎

负责生成:
- 社区公告PPT (社区入驻指南、活动通知)
- 商家入驻指南 (入驻流程、分润说明)
- 创业者培训 (推广技巧、团队管理)
- 更新日志 (每次版本迭代)
- 帮助中心文档 (适老化图文教程)

API对接:
- backend/routes/pptMaster.js 已实现DeepSeek 4.5接口

#### LongLive - 飞轮视频引擎

负责生成:
- 长辈使用教程 (每个功能3分钟以内视频)
- SOS呼救教程 (适老化SOS使用指南)
- 每日签到引导 (语音+动画打卡引导)
- 商城导购 (适老商品推荐)
- 创业推广视频 (创业者可分享的推广素材)

已有脚本:
- 短视频脚本_孝心帮.md (27支视频全新制作方案)
- 孝心帮27支视频全新制作方案.md

目标受众: 中老年用户
风格: 温暖、亲切、大字幕
时长: 30秒-3分钟

### 3.3 Agent协作模式

#### 日常开发模式 (新功能/新页面)

CodeGraph -> (扫描全项目 -> 生成依赖图)
     |
     v
Understand Anything -> (分析新页面归属的"帮"+飞轮阶段)
     |
     v
Karpathy Skills -> (生成CLAUDE.md开发规范)
     |
     v
Developer/Claude -> (按照规范开发实现)
     |
     v
Claude Plugins -> (沙盒测试 + 质量门禁)
     |
     v
Presenton + LongLive -> (生成配套文档+视频)

#### 飞轮优化模式 (现有功能增强)

Understand Anything -> (检测飞轮断裂点：某阶段缺少触发)
     |
     v
CodeGraph -> (追踪断裂点相关的数据和API链路)
     |
     v
Karpathy Skills -> (设计触发规则和积分方案)
     |
     v
Claude Plugins -> (实现触发自动化插件)
     |
     v
Sandbox -> (验证飞轮完整闭环)



<a name="4"></a>
## 4. 工作流编排

### 4.1 飞轮全自动工作流

```yaml
name: 五帮飞轮全自动工作流
version: 2.0.0

stages:
  # 阶段0: 飞轮审计
  flywheel-audit:
    name: 飞轮链路审计
    agents: [codegraph, understand-anything]
    schedule: daily
    
    steps:
      - agent: codegraph
        task: 扫描五帮页面覆盖度，输出飞轮阶段覆盖矩阵
        output: flywheel-coverage.yaml
        
      - agent: understand-anything
        task: 检测飞轮断裂点(检查每个阶段是否有到下一阶段的触发)
        output: flywheel-gaps.md
        
      - condition: gaps_found
        action: 自动创建Issue标记断裂点

  # 阶段1: 引流功能开发
  attract:
    name: 引流(Attract)功能开发
    agents: [karpathy-skills, claude-plugins]
    
    triggers:
      - 新商家入驻入口
      - 社区入驻流程优化
      - 招募中心页面新增
    
    steps:
      - agent: karpathy-skills
        task: 编写引流页CLAUDE.md规则(SEO友好、分享卡片设计)
      - agent: claude-plugins
        task: 实现邀请码生成、分享SDK集成、渠道追踪

  # 阶段2: 流入转化优化
  inflow:
    name: 流入(Inflow)转化优化
    agents: [claude-plugins, karpathy-skills]
    
    triggers:
      - 注册转化率<50%
      - 游客->注册转化低
    
    steps:
      - agent: claude-plugins
        task: 优化微信登录+语音注册流程
      - agent: karpathy-skills
        task: 指定Onboarding引导规范(三步完成)
      - agent: understand-anything
        task: 追踪注册漏斗各环节流失率

  # 阶段3: 留存增强
  retain:
    name: 留住(Retain)日活增强
    agents: [claude-plugins, karpathy-skills]
    
    metrics:
      - DAU/MAU
      - 每日签到完成率
      - 日均积分赚取
    
    steps:
      - agent: karpathy-skills
        task: 优化积分任务体系(任务频率、奖励值、趣味性)
      - agent: claude-plugins
        task: 实现连续签到奖励加倍、积分到期提醒
      - agent: presenton
        task: 生成每周积分排行榜海报

  # 阶段4: 锁住机制实现
  lockin:
    name: 锁住(Lock-in)体系实现
    agents: [claude-plugins, codegraph]
    
    features:
      - 军衔系统(18级)
      - 积分商城
      - SOS守护
      - 会员体系
    
    steps:
      - agent: codegraph
        task: 扫描积分流转全链路(赚->花->锁闭环)
      - agent: claude-plugins
        task: 实现军衔升级自动触发、积分沉淀机制

  # 阶段5: 裂变回路实现
  virality:
    name: 裂变(Virality)回路实现
    agents: [claude-plugins, longlive]
    
    features:
      - 邀请奖励(双方200分)
      - 商家邀请分润
      - 生日祝福传播
      - 推广视频素材
    
    steps:
      - agent: claude-plugins
        task: 实现邀请关系绑定、分润自动结算
      - agent: longlive
        task: 生成可分享的推广视频(创业/生日/功能)
      - agent: presenton
        task: 生成分享海报和裂变文案

  # 阶段6: 飞轮验证
  verify:
    name: 飞轮闭环验证
    agents: [understand-anything, claude-plugins]
    
    steps:
      - agent: understand-anything
        task: 验证每个飞轮阶段是否闭环(从触发到下一阶段入口)
      - agent: claude-plugins
        task: 运行沙盒集成测试(模拟完整用户生命周期)
      - agent: presenton
        task: 输出飞轮验证报告
```

### 4.2 关键流水线节点

| 节点 | 触发 | 动作 | 工具 |
|------|------|------|------|
| pre-commit | git commit | 运行lint+飞轮断裂点检测 | husky + understand-anything |
| PR创建 | github pr | 代码审查+变更影响分析 | code-review.yml |
| 合并到main | git merge | 沙盒全量测试+自动部署 | full-automation.yml |
| 每日6:00 | cron | 飞轮审计+断裂点检测 | flywheel-daily.yml |
| 每周一 | cron | 生成周报PPT+视频更新 | presenton + longlive |

### 4.3 需要新增的自动化脚本

以下脚本需要在 armory/scripts/ 目录创建:

```
armory/scripts/
  flywheel-audit.js      # 飞轮覆盖审计 (P0)
  detect-gaps.js          # 断裂点检测 (P0)
  run-e2e-flywheel.js     # 飞轮E2E测试 (P1)
  generate-flywheel-report.js  # 飞轮报告生成 (P2)
```



<a name="5"></a>
## 5. 数据闭环

### 5.1 数据流全景

```
+-------------------------------------------------------------+
|                     数据采集层                                |
|  behaviorAnalytics.js -> Storage Queue -> POST /api/behavior |
|  pointsUtil.js -> Storage -> 双账本(累积分/可用分)           |
|  userMemory.js -> Storage -> xb_user_memory_v2_$principal    |
|  newsBehavior.js -> Storage -> 阅读喜好画像                   |
+--------------------------+----------------------------------+
                           |
                           v
+-------------------------------------------------------------+
|                     数据处理层                                |
|  +----------------+  +----------------+  +----------------+  |
|  | 积分结算引擎    |  | 分润计算引擎    |  | 推荐引擎       |  |
|  | points.js      |  | user.js        |  | recommend.js   |  |
|  +-------+--------+  +-------+--------+  +-------+--------+  |
|          |                    |                    |          |
|          v                    v                    v          |
|  +----------------+  +----------------+  +----------------+  |
|  | PointsFlow     |  | ProfitShare    |  | UserTag        |  |
|  | (流水表)        |  | (分润表)       |  | (用户标签)     |  |
|  +----------------+  +----------------+  +----------------+  |
+--------------------------+----------------------------------+
                           |
                           v
+-------------------------------------------------------------+
|                     数据应用层                                |
|  +----------+ +----------+ +----------+ +----------+         |
|  |五帮仪表盘 | |飞轮仪表盘| |积分仪表盘| |用户画像   |         |
|  +----------+ +----------+ +----------+ +----------+         |
+-------------------------------------------------------------+
```

### 5.2 核心数据模型

#### 用户模型 (backend/models/User.js)

```
User {
  _id, openId, nickName, avatarUrl, phone,
  role: 'user' | 'entrepreneur' | 'elder',   // 用户角色
  inviteCode: String,                          // 我的邀请码
  invitedBy: String,                           // 谁邀请的我
  points: Number,                              // 可用积分
  totalPoints: Number,                         // 累计积分(军衔经验)
  income: Number,                              // 收益(创业者)
  teamCount: Number,                           // 团队人数(创业者)
  agentLevel: Number,                          // 代理等级(创业者)
  tags: [String],                              // 用户标签
  lastSignDate: Date,                          // 最后签到日期
  consecutiveSignDays: Number,                 // 连续签到天数
  createdAt, updatedAt
}
```

#### 积分流水 (backend/models/PointsFlow.js)

```
PointsFlow {
  _id, userId,
  type: 'earn' | 'spend' | 'expire',
  amount: Number,
  balanceBefore: Number,
  balanceAfter: Number,
  taskId: String,            // 关联任务
  taskName: String,
  orderId: String,           // 关联订单(消费)
  description: String,
  createdAt
}
```

#### 行为画像 (backend/models/Behavior.js)

```
Behavior {
  _id, userId,
  event: String,             // 事件名
  page: String,              // 页面路径
  duration: Number,          // 停留时长(ms)
  metadata: Object,          // 额外数据
  sessionId: String,         // 会话ID
  channel: String,           // 渠道
  createdAt
}

索引: { userId: 1, createdAt: -1 }
     { event: 1, createdAt: -1 }
```

### 5.3 飞轮关键指标(KPI)

| 指标 | 定义 | 计算方式 | 飞轮阶段 |
|------|------|---------|---------|
| 日新增用户 | 当日首次注册用户数 | count(where createdAt=today) | 引流->流入 |
| 注册转化率 | 从访问到完成注册比例 | 注册数/访问数*100% | 流入 |
| 次日留存率 | 注册第2天再次使用 | day1活跃/当天新增*100% | 留住 |
| 7日留存率 | 注册第7天再次使用 | day7活跃/day0新增*100% | 留住 |
| 日活(DAU) | 当日打开APP用户数 | count(distinct userId) | 留住 |
| 签到完成率 | 完成签到数/可签到用户数 | sign_count/eligible*100% | 留住 |
| 人均积分赚取 | 日人均赚取积分 | total_earned/total_users | 留住 |
| 军衔升级率 | 达到下士及以上比例 | rank>=下士/total*100% | 锁住 |
| 积分消耗率 | 日消耗积分/日赚取积分 | spent/earned*100% | 锁住 |
| K因子 | 平均每个用户邀请多少人 | invited_users/total_users | 裂变 |
| 邀请转化率 | 收到邀请->注册的比例 | 注册数/邀请发出数*100% | 裂变->引流 |

### 5.4 飞轮断裂点检测规则

```javascript
// 检测规则定义 (需在 flywheel-audit 脚本中实现)
const FLYWHEEL_RULES = [
  // 引流->流入: 必须有注册入口
  { from: 'attract', to: 'inflow', 
    check: 'has_entry_point',
    entries: ['语音注册', '微信登录', '游客引导'] },
  
  // 流入->留住: 首次使用必须有引导
  { from: 'inflow', to: 'retain',
    check: 'has_onboarding',
    conditions: ['首次签到引导', '积分赚取引导', '核心功能推荐'] },
  
  // 留住->锁住: 必须有深层次绑定
  { from: 'retain', to: 'lockin',
    check: 'has_sticky_feature',
    conditions: ['军衔系统', '积分消耗', '会员体系', 'SOS守护'] },
  
  // 锁住->裂变: 必须有分享冲动
  { from: 'lockin', to: 'virality',
    check: 'has_share_trigger',
    conditions: ['邀请好友奖励', '军衔炫耀', '生日祝福分享', '推广分润'] },
  
  // 裂变->引流: 必须有回流入口
  { from: 'virality', to: 'attract',
    check: 'has_return_path',
    conditions: ['邀请码绑定', '分享卡片注册', '推广二维码'] },
]
```



<a name="6"></a>
## 6. 沙盒验证方案

### 6.1 现有沙盒架构

基于 sandbox/docker-compose.yml 的隔离环境:

| 服务 | 沙盒端口 | 生产端口 | 说明 |
|------|---------|---------|------|
| MongoDB | 27018 | 27017 | 独立数据库 |
| Backend | 3001 | 3000 | 独立端口运行 |
| Frontend | 8081 | 8080 | 独立构建验证 |

### 6.2 飞轮验证场景

#### 场景A: 完整用户生命周期 (E2E测试)

```
测试步骤:
  1. 引流->流入: 新用户通过邀请注册
     action: 生成邀请链接, 新设备打开
     check: 邀请码正确绑定, 返回token
  
  2. 留住: 每日签到
     action: POST /api/points/earn { taskId: 'sign_morning' }
     check: 积分+30, 流水记录正确
  
  3. 连续签到
     action: 连续3天签到
     check: consecutiveSignDays=3, 额外奖励
  
  4. 留住->锁住: 军衔升级
     action: 累计积分达到200(下士)
     check: rankName=下士, star计算正确
  
  5. 锁住: 积分消耗
     action: POST /api/points-shop/exchange { itemId: 'coupon_5' }
     check: 积分扣除80, 可用积分减少, 累计积分不变
  
  6. 锁住->裂变: 邀请好友
     action: 获取邀请码, 新用户注册时使用
     check: 邀请双方各得200分
  
  7. 裂变->引流: 新用户回流
     action: 被邀请的新用户次日登录
     check: 次日留存标记, 继续飞轮
```

#### 场景B: 飞轮断裂点检测

```
检测步骤:
  1. 扫描所有页面和API, 检查各阶段触发条件
  2. check: attract_to_inflow
     - 每个引流入口都有对应的登录/注册处理
  3. check: inflow_to_retain
     - 首次登录后引导用户完成至少1个每日任务
  4. check: retain_to_lockin
     - 累计积分达到阈值时触发军衔升级事件
  5. check: lockin_to_virality
     - 军衔升级/积分消耗/商城下单后弹出邀请引导
  6. check: virality_to_attract
     - 邀请链接正确打开注册页并绑定邀请关系
```

#### 场景C: 分润计算验证

```
配置验证:
  直接推广: 30% (config.js profitSharing.direct)
  间接推广: 5%  (config.js profitSharing.indirect)
  商家分成: 5%  (config.js profitSharing.merchant)
  区级代理: 12%
  市级代理: 8%
  省级代理: 5%
  平台: 13%
  积分池: 20%
  总计: 100%

测试步骤:
  1. 验证总计=100%
  2. 验证分润发放: 创业者A推广用户B, B消费100元, A分润=30元
  3. 验证积分池: 消费金额的20%注入积分池
```

### 6.3 沙盒测试目录结构

需要新增的测试文件:

```
sandbox/tests/
  e2e/
    flywheel-full-cycle.test.js    # 完整用户生命周期飞轮
    registration-flow.test.js      # 注册登录流程
    invite-chain.test.js           # 邀请裂变链
  integration/
    points-earn-spend.test.js      # 积分赚取消耗
    rank-calculation.test.js       # 军衔计算
    profit-sharing.test.js         # 分润计算
    sos-emergency.test.js          # SOS呼救流程
  security/
    token-auth.test.js             # JWT鉴权
    rate-limiting.test.js          # 限流测试
    points-fraud.test.js           # 积分防刷
  unit/
    pointsUtil.test.js             # pointsUtil核心逻辑
    fontUtil.test.js               # 字体工具
    lunarUtil.test.js              # 农历计算
    weatherUtil.test.js            # 天气工具
```

### 6.4 沙盒验证流程

```
代码变更
   |
   v
{Understand Anything检测变更影响范围}
   |
   +-> HIGH风险: 沙盒全量测试
   +-> MEDIUM风险: 沙盒增量测试
   +-> LOW风险: 快速lint检查
   |
   v
启动沙盒环境 (docker-compose up)
   |
   v
运行E2E飞轮测试 + 集成测试 + 安全测试
   |
   v
{所有测试通过?}
   +-> 是: 生成测试报告, 质量门禁检查
   |       +-> 通过: 允许合并/部署
   |       +-> 拒绝: 生成修复建议
   +-> 否: 标记断裂点, 回滚变更
```

---

## 实施优先级

### P0 - 立即实施 (核心飞轮基础)
1. 编写飞轮断裂点检测脚本 (armory/scripts/flywheel-audit.js)
2. 基于现有 backend/models/ 完善积分流水可追溯性
3. 在 src/utils/pointsUtil.js 中确认所有DAILY_TASKS和BONUS_TASKS完整
4. 在首页添加飞轮状态指示器 (当前阶段、下一步引导)

### P1 - 短期实施 (1-2周)
1. 实现飞轮E2E沙盒测试脚本
2. 为每个飞轮阶段间的过渡添加自动化触发
3. 完善邀请裂变的完整链路 (邀请->注册->积分->通知)
4. 为创业者角色添加推广仪表盘

### P2 - 中期实施 (3-4周)
1. 整合Presenton生成每周飞轮报告
2. 整合LongLive生成飞轮各阶段视频教程
3. 开发飞轮看板 (在管理后台可视化五帮覆盖度)
4. 实现自动分润结算流水线

### P3 - 长期迭代
1. AI驱动的飞轮优化建议 (基于用户行为数据)
2. 跨社区飞轮协同 (社区间互相引流)
3. 多端飞轮同步 (小程序+APP+H5统一用户旅程)

---

## 文件引用索引

### 前端核心文件
- D:\xiaoxinbang\src\pages.json - 全部47+页面路由定义
- D:\xiaoxinbang\src\App.vue - 应用入口, 初始化session/积分/记忆/行为
- D:\xiaoxinbang\src\config.js - 全局配置, 分润比例
- D:\xiaoxinbang\src\store\global.js - Pinia状态管理
- D:\xiaoxinbang\src\utils\pointsUtil.js - 积分核心(全部积分规则唯一定义)
- D:\xiaoxinbang\src\utils\api.js - API封装层
- D:\xiaoxinbang\src\utils\serverSession.js - 后端会话登录
- D:\xiaoxinbang\src\utils\fontUtil.js - 适老化字体系统
- D:\xiaoxinbang\src\utils\behaviorAnalytics.js - 行为埋点
- D:\xiaoxinbang\src\utils\inviteInviterLedger.js - 邀请人分账
- D:\xiaoxinbang\src\utils\inviteRefereeReward.js - 被邀请人奖励
- D:\xiaoxinbang\src\components\WarmHeader.vue - 通用页面头部

### 后端核心文件
- D:\xiaoxinbang\backend\server.js - 服务入口, 路由注册
- D:\xiaoxinbang\backend\routes\auth.js - 登录认证
- D:\xiaoxinbang\backend\routes\user.js - 用户管理
- D:\xiaoxinbang\backend\routes\points.js - 积分路由
- D:\xiaoxinbang\backend\routes\pay.js - 微信支付
- D:\xiaoxinbang\backend\routes\sosMonitor.js - SOS远程看护
- D:\xiaoxinbang\backend\routes\pointsShop.js - 积分商城
- D:\xiaoxinbang\backend\routes\health.js - 健康数据
- D:\xiaoxinbang\backend\models\User.js - 用户模型
- D:\xiaoxinbang\backend\models\PointsFlow.js - 积分流水
- D:\xiaoxinbang\backend\models\Task.js - 任务模型
- D:\xiaoxinbang\backend\models\Order.js - 订单模型
- D:\xiaoxinbang\backend\models\HealthRecord.js - 健康记录
- D:\xiaoxinbang\backend\utils\wx-pay.js - 微信支付工具

### Armory核心文件
- D:\xiaoxinbang\armory\CLAUDE.md - 智能体指挥官总纲
- D:\xiaoxinbang\armory\agents\codegraph\CLAUDE.md - CodeGraph知识图谱
- D:\xiaoxinbang\armory\agents\understand-anything\CLAUDE.md - 代码导航分析
- D:\xiaoxinbang\armory\agents\karpathy-skills\CLAUDE.md - 规则制定
- D:\xiaoxinbang\armory\agents\claude-plugins\CLAUDE.md - 工作流自动化
- D:\xiaoxinbang\armory\agents\presenton\CLAUDE.md - PPT生成
- D:\xiaoxinbang\armory\agents\longlive\CLAUDE.md - 视频生成
- D:\xiaoxinbang\armory\workflows\full-automation.yml - 全自动工作流
- D:\xiaoxinbang\armory\workflows\backend-ci.yml - 后端CI
- D:\xiaoxinbang\armory\workflows\frontend-ci.yml - 前端CI
- D:\xiaoxinbang\armory\workflows\code-review.yml - 代码审查
- D:\xiaoxinbang\armory\workflows\deploy.yml - 部署流程
- D:\xiaoxinbang\armory\sandbox\docker-compose.yml - 沙盒环境

### 项目根目录关键文件
- D:\xiaoxinbang\Rules.md - 全局执行铁则+五帮核心价值
- D:\xiaoxinbang\.claude\skills\ARCHITECT.md - 架构师角色定义
- D:\xiaoxinbang\.claude\skills\FULLSTACK-DEV.md - 全栈开发者角色定义
- D:\xiaoxinbang\.claude\skills\DATA-MODELER.md - 数据建模师角色定义
- D:\xiaoxinbang\.claude\skills\QA-ENGINEER.md - QA工程师角色定义
- D:\xiaoxinbang\.claude\skills\DEVOPS.md - DevOps角色定义
- D:\xiaoxinbang\.claude\skills\SECURITY-AUDITOR.md - 安全审计师角色定义

---

*文档结束 - 基于实际代码探索生成, 映射到具体文件路径和代码结构*
