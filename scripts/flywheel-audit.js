#!/usr/bin/env node
/**
 * 孝心帮五帮飞轮覆盖审计脚本
 *
 * 职责: 扫描项目结构，输出五帮五维页面覆盖矩阵
 * 运行: node scripts/flywheel-audit.js [project-path]
 *
 * 输出: flywheel-coverage.yaml 格式的覆盖报告
 */

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = process.argv[2] || 'D:/xiaoxinbang';
const PAGES_DIR = path.join(PROJECT_DIR, 'src/pages');

// 五帮页面映射（基于架构文档）
const WUBA_PAGES = {
  '帮长辈': {
    code: 'elderly',
    pages: [
      { name: '健康数据', path: '健康数据/健康数据', stage: 'retain' },
      { name: '健康百科', path: '健康百科/健康百科', stage: 'retain' },
      { name: '健康咨询', path: '健康咨询/健康咨询', stage: 'retain' },
      { name: '用药提醒', path: '用药提醒/用药提醒', stage: 'retain' },
      { name: '天气查询', path: '天气查询/天气查询', stage: 'inflow' },
      { name: '日历黄历', path: '日历黄历/日历黄历', stage: 'retain' },
      { name: '老照片修复', path: '老照片修复/老照片修复', stage: 'retain' },
      { name: '语音导诊', path: '语音导诊/语音导诊', stage: 'retain' },
      { name: '睡眠助手', path: '睡眠助手/睡眠助手', stage: 'retain' },
      { name: '闹钟提醒', path: '闹钟提醒/闹钟提醒', stage: 'retain' },
      { name: '防骗指南', path: '防骗指南/防骗指南', stage: 'retain' },
      { name: '紧急求助', path: '紧急求助/紧急求助', stage: 'lockin' },
      { name: '远程看护', path: '远程看护/远程看护', stage: 'lockin' },
      { name: '智能聊天', path: '智能聊天/智能聊天', stage: 'retain' },
      { name: '语音注册', path: '语音注册/语音注册', stage: 'inflow' },
    ]
  },
  '帮家属': {
    code: 'family',
    pages: [
      { name: '家属助手', path: '家属助手/家属助手', stage: 'retain' },
      { name: '远程看护', path: '远程看护/远程看护', stage: 'lockin' },
      { name: '生日祝福', path: '生日祝福/生日首页', stage: 'virality' },
      { name: '相册照片', path: '相册照片/相册照片', stage: 'retain' },
      { name: '通话引导', path: '通话引导/通话引导', stage: 'retain' },
      { name: '邀请好友', path: '邀请好友/邀请好友', stage: 'virality' },
    ]
  },
  '帮社区': {
    code: 'community',
    pages: [
      { name: '社区入驻', path: '社区入驻/社区入驻', stage: 'attract' },
      { name: '社区公告', path: '社区公告/社区公告', stage: 'retain' },
      { name: '通知公告', path: '通知公告/通知公告', stage: 'retain' },
      { name: '帮助中心', path: '帮助中心/帮助首页', stage: 'retain' },
      { name: '每日签到', path: '每日签到/每日签到', stage: 'retain' },
      { name: '公会', path: '公会/公会首页', stage: 'retain' },
      { name: '新闻早报', path: '新闻早报/新闻早报', stage: 'retain' },
      { name: '影音娱乐中心', path: '影音娱乐中心/影音娱乐中心', stage: 'retain' },
      { name: '小游戏', path: '小游戏/小游戏', stage: 'retain' },
    ]
  },
  '帮商家': {
    code: 'merchant',
    pages: [
      { name: '商家入驻', path: '商家入驻/商家入驻', stage: 'attract' },
      { name: '商城首页', path: '商城/商城首页', stage: 'lockin' },
      { name: '商家详情', path: '商城/商家详情', stage: 'lockin' },
      { name: '会员支付', path: '会员中心/会员支付', stage: 'lockin' },
      { name: '花积分', path: '花积分/花积分', stage: 'lockin' },
      { name: 'APP权益预告', path: 'APP权益预告/APP权益预告', stage: 'attract' },
    ]
  },
  '帮创业': {
    code: 'entrepreneur',
    pages: [
      { name: '创业首页', path: '创业中心/创业首页', stage: 'attract' },
      { name: '我的收入', path: '创业中心/我的收入', stage: 'lockin' },
      { name: '邀请商家', path: '创业中心/邀请商家', stage: 'virality' },
      { name: '推广用户', path: '创业中心/推广用户', stage: 'virality' },
      { name: '我的团队', path: '创业中心/我的团队', stage: 'retain' },
      { name: '招募中心', path: '招募中心/招募中心', stage: 'attract' },
      { name: '赚零花钱', path: '赚零花钱/赚零花钱', stage: 'retain' },
      { name: '荣誉榜', path: '荣誉榜/荣誉榜', stage: 'retain' },
    ]
  }
};

const STAGES = ['attract', 'inflow', 'retain', 'lockin', 'virality'];
const STAGE_NAMES = { attract: '引流', inflow: '流入', retain: '留住', lockin: '锁住', virality: '裂变' };

function audit() {
  console.log('========================================');
  console.log('  孝心帮五帮飞轮覆盖审计');
  console.log('========================================\n');

  // 检查页面目录是否存在
  const pagesExist = fs.existsSync(PAGES_DIR);
  console.log(`项目路径: ${PROJECT_DIR}`);
  console.log(`页面目录: ${PAGES_DIR} ${pagesExist ? '✓' : '✗ 不存在'}\n`);

  let totalPages = 0;
  let stageCounts = { attract: 0, inflow: 0, retain: 0, lockin: 0, virality: 0 };

  for (const [wubaName, wuba] of Object.entries(WUBA_PAGES)) {
    console.log(`\n--- ${wubaName} (${wuba.code}) ---`);
    let found = 0, missing = 0;

    for (const page of wuba.pages) {
      const fullPath = path.join(PROJECT_DIR, 'src/pages', page.path + '.vue');
      const exists = fs.existsSync(fullPath);
      if (exists) {
        found++;
        stageCounts[page.stage]++;
        totalPages++;
      } else {
        missing++;
      }
      const status = exists ? '✓' : '✗';
      console.log(`  ${status} [${STAGE_NAMES[page.stage]}] ${page.name} (${page.path})`);
    }

    console.log(`  小计: ${found} 已发现, ${missing} 缺失`);
  }

  // 飞轮阶段覆盖统计
  console.log('\n========================================');
  console.log('  飞轮阶段覆盖矩阵');
  console.log('========================================\n');
  for (const stage of STAGES) {
    const count = stageCounts[stage];
    const bar = '█'.repeat(Math.ceil(count / 2));
    console.log(`  [${STAGE_NAMES[stage]}] ${bar} ${count}页`);
  }

  // 五帮各阶段分布
  console.log('\n========================================');
  console.log('  五帮 × 五维 覆盖矩阵');
  console.log('========================================\n');
  console.log('  '.padEnd(12), ...STAGES.map(s => STAGE_NAMES[s].padEnd(8)));

  for (const [wubaName, wuba] of Object.entries(WUBA_PAGES)) {
    const row = STAGES.map(stage => {
      const count = wuba.pages.filter(p => p.stage === stage).length;
      return count > 0 ? `${count}页`.padEnd(8) : '--'.padEnd(8);
    });
    console.log(`  ${wubaName.padEnd(10)}`, ...row);
  }

  // 总体评估
  console.log('\n========================================');
  console.log('  审计总结');
  console.log('========================================\n');
  console.log(`  总计映射页面: ${totalPages} 页`);
  console.log(`  五帮覆盖: ${Object.keys(WUBA_PAGES).length}/5`);

  const coveredStages = STAGES.filter(s => stageCounts[s] > 0).length;
  console.log(`  飞轮阶段覆盖: ${coveredStages}/5`);

  if (coveredStages === 5) {
    console.log('\n  ✓ 飞轮全阶段覆盖! 五帮五维架构完整。');
  } else {
    const missingStages = STAGES.filter(s => stageCounts[s] === 0);
    console.log(`\n  ⚠ 缺失阶段: ${missingStages.map(s => STAGE_NAMES[s]).join(', ')}`);
  }

  // 输出YAML格式
  console.log('\n--- flywheel-coverage.yaml ---');
  console.log(JSON.stringify({
    audit_date: new Date().toISOString(),
    total_pages: totalPages,
    wuba_coverage: Object.keys(WUBA_PAGES).length,
    stage_coverage: coveredStages,
    stage_distribution: stageCounts,
    details: WUBA_PAGES
  }, null, 2));

  // ==========================================
  // 推广团长体系审计
  // ==========================================
  console.log('\n========================================');
  console.log('  推广团长体系审计');
  console.log('========================================\n');

  const promoterChecks = [
    { name: '邀请码系统', file: 'src/utils/inviteInviterLedger.js', keyword: 'inviter' },
    { name: '邀请奖励', file: 'src/utils/inviteRefereeReward.js', keyword: 'referee' },
    { name: '推广用户页', file: 'src/pages/创业中心/推广用户.vue', keyword: '推广' },
    { name: '邀请商家页', file: 'src/pages/创业中心/邀请商家.vue', keyword: '邀请' },
    { name: '我的团队页', file: 'src/pages/创业中心/我的团队.vue', keyword: '团队' },
    { name: '分润配置', file: 'src/config.js', keyword: 'profitSharing' },
    { name: '二维码推广', file: 'src/pages/邀请好友/邀请好友.vue', keyword: '邀请码' },
  ];

  let promoterFound = 0;
  for (const check of promoterChecks) {
    const fullPath = path.join(PROJECT_DIR, check.file);
    const exists = fs.existsSync(fullPath);
    let hasKeyword = false;
    if (exists) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      hasKeyword = content.includes(check.keyword);
    }
    const status = exists && hasKeyword ? '✓' : '✗';
    if (exists && hasKeyword) promoterFound++;
    console.log(`  ${status} ${check.name} (${check.file})`);
  }

  console.log(`\n  团长体系覆盖: ${promoterFound}/${promoterChecks.length}`);
  if (promoterFound === promoterChecks.length) {
    console.log('  ✓ 推广团长体系完整！做一件事收益叠加的飞轮已就绪。\n');
  } else {
    console.log(`  ⚠ ${promoterChecks.length - promoterFound} 项缺失，需补充\n`);
  }
}

audit();
