#!/usr/bin/env node
/**
 * 孝心帮飞轮断裂点检测脚本
 *
 * 职责: 检测飞轮各阶段间的断裂点
 * 运行: node scripts/detect-gaps.js [project-path]
 *
 * 输出: flywheel-gaps.md 格式的断裂点报告
 */

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = process.argv[2] || 'D:/xiaoxinbang';

// 飞轮断裂点检测规则
const FLYWHEEL_RULES = [
  {
    id: 'attract_to_inflow',
    from: 'attract',
    to: 'inflow',
    name: '引流 → 流入',
    description: '每个引流入口都必须有对应的注册/登录处理',
    severity: 'HIGH',
    checks: [
      {
        name: '邀请注册入口',
        files: [
          'src/pages/邀请好友/邀请好友.vue',
          'src/utils/inviteRefereeReward.js',
          'src/utils/inviteInviterLedger.js'
        ],
        keywords: ['邀请码', 'inviteCode', 'share']
      },
      {
        name: '微信登录入口',
        files: [
          'backend/routes/auth.js',
          'src/utils/serverSession.js'
        ],
        keywords: ['wx.login', 'openid', 'guest-login']
      },
      {
        name: '语音注册入口',
        files: [
          'src/pages/语音注册/语音注册.vue'
        ],
        keywords: ['语音注册', 'voiceRegister']
      }
    ]
  },
  {
    id: 'inflow_to_retain',
    from: 'inflow',
    to: 'retain',
    name: '流入 → 留住',
    description: '新用户首次进入后必须有引导完成首个任务',
    severity: 'HIGH',
    checks: [
      {
        name: '首次签到引导',
        files: [
          'src/pages/每日签到/每日签到.vue',
          'src/utils/pointsUtil.js'
        ],
        keywords: ['sign', '签到', 'first_sign']
      },
      {
        name: '积分赚取引导',
        files: [
          'src/pages/赚积分/赚积分.vue',
          'src/utils/pointsUtil.js'
        ],
        keywords: ['earn', 'task', 'DAILY_TASKS']
      },
      {
        name: '核心功能推荐',
        files: [
          'src/pages/全部功能/全部功能.vue'
        ],
        keywords: ['全部功能', 'allFeatures']
      }
    ]
  },
  {
    id: 'retain_to_lockin',
    from: 'retain',
    to: 'lockin',
    name: '留住 → 锁住',
    description: '活跃用户必须有深度绑定机制',
    severity: 'MEDIUM',
    checks: [
      {
        name: '军衔系统',
        files: [
          'src/utils/pointsUtil.js',
          'src/store/global.js'
        ],
        keywords: ['rank', '军衔', 'star', 'totalPoints']
      },
      {
        name: '积分消耗闭环',
        files: [
          'src/pages/花积分/花积分.vue',
          'backend/routes/pointsShop.js'
        ],
        keywords: ['spend', 'exchange', 'shop', '兑换', 'payPoints', '积分']
      },
      {
        name: '会员体系',
        files: [
          'src/pages/会员中心/会员支付.vue',
          'backend/routes/pay.js'
        ],
        keywords: ['会员', 'vip', 'pay']
      },
      {
        name: 'SOS守护',
        files: [
          'src/pages/紧急求助/紧急求助.vue',
          'src/utils/sosService.js',
          'backend/routes/sosMonitor.js'
        ],
        keywords: ['SOS', 'sos', 'emergency']
      }
    ]
  },
  {
    id: 'lockin_to_virality',
    from: 'lockin',
    to: 'virality',
    name: '锁住 → 裂变',
    description: '深度用户必须有分享/邀请的触发点',
    severity: 'MEDIUM',
    checks: [
      {
        name: '邀请好友奖励',
        files: [
          'src/utils/inviteInviterLedger.js',
          'src/utils/inviteRefereeReward.js'
        ],
        keywords: ['invite', 'reward', '邀请奖励']
      },
      {
        name: '军衔炫耀',
        files: [
          'src/store/global.js',
          'src/pages/荣誉榜/荣誉榜.vue'
        ],
        keywords: ['rank', 'honor', '荣誉']
      },
      {
        name: '推广分润',
        files: [
          'src/pages/创业中心/推广用户.vue',
          'src/config.js'
        ],
        keywords: ['profitSharing', '分润', 'commission']
      }
    ]
  },
  {
    id: 'virality_to_attract',
    from: 'virality',
    to: 'attract',
    name: '裂变 → 引流',
    description: '裂变传播必须有回流入口',
    severity: 'HIGH',
    checks: [
      {
        name: '邀请码绑定',
        files: [
          'src/utils/api.js',
          'backend/routes/user.js'
        ],
        keywords: ['inviteCode', 'use-invite']
      },
      {
        name: '分享卡片注册',
        files: [
          'src/pages/邀请好友/邀请好友.vue',
          'manifest.json'
        ],
        keywords: ['share', '分享']
      },
      {
        name: '推广二维码',
        files: [
          'src/pages/创业中心/推广用户.vue'
        ],
        keywords: ['qrcode', '二维码', '推广']
      }
    ]
  }
];

function detectGaps() {
  console.log('========================================');
  console.log('  孝心帮飞轮断裂点检测');
  console.log('========================================\n');

  const gaps = [];
  const passed = [];

  for (const rule of FLYWHEEL_RULES) {
    console.log(`[${rule.name}] ${rule.description}`);
    console.log(`  风险等级: ${rule.severity}\n`);

    let rulePassed = true;
    const ruleChecks = [];

    for (const check of rule.checks) {
      let allExist = true;
      let allHaveKeywords = true;

      // 检查文件存在性
      for (const file of check.files) {
        const fullPath = path.join(PROJECT_DIR, file);
        const exists = fs.existsSync(fullPath);
        if (!exists) {
          allExist = false;
          console.log(`  ✗ 文件缺失: ${file}`);
        }
      }

      // 检查关键词
      if (allExist) {
        for (const file of check.files) {
          const fullPath = path.join(PROJECT_DIR, file);
          if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const hasKeyword = check.keywords.some(kw => content.includes(kw));
            if (!hasKeyword) {
              allHaveKeywords = false;
              console.log(`  ✗ 关键词缺失 ${check.keywords.join('|')}: ${file}`);
            }
          }
        }
      }

      const checkPassed = allExist && allHaveKeywords;
      if (checkPassed) {
        console.log(`  ✓ ${check.name}`);
      } else {
        rulePassed = false;
      }
      ruleChecks.push({ name: check.name, passed: checkPassed });
    }

    if (rulePassed) {
      passed.push(rule.id);
      console.log(`  → ✓ ${rule.name} 链路完整\n`);
    } else {
      gaps.push({
        id: rule.id,
        name: rule.name,
        severity: rule.severity,
        checks: ruleChecks.filter(c => !c.passed).map(c => c.name)
      });
      console.log(`  → ✗ ${rule.name} 存在断裂点!\n`);
    }
  }

  // 汇总报告
  console.log('========================================');
  console.log('  飞轮断裂点检测报告');
  console.log('========================================\n');

  if (gaps.length === 0) {
    console.log('  ✓ 恭喜! 飞轮全链路完整，无断裂点!\n');
  } else {
    console.log(`  ⚠ 发现 ${gaps.length} 处断裂点:\n`);
    for (const gap of gaps) {
      console.log(`  [${gap.severity}] ${gap.name}`);
      for (const check of gap.checks) {
        console.log(`    - ${check}`);
      }
      console.log('');
    }
  }

  console.log(`  完整链路: ${passed.length}/${FLYWHEEL_RULES.length}`);
  console.log(`  检测时间: ${new Date().toLocaleString()}\n`);

  // 输出总结
  const report = {
    detect_date: new Date().toISOString(),
    total_rules: FLYWHEEL_RULES.length,
    passed: passed.length,
    gaps: gaps.length,
    gap_details: gaps,
    passed_details: passed
  };

  console.log('--- flywheel-gaps.md ---');
  console.log(JSON.stringify(report, null, 2));

  return gaps.length === 0;
}

const isHealthy = detectGaps();
process.exit(isHealthy ? 0 : 1);
