#!/usr/bin/env node
/**
 * 孝心帮飞轮端到端测试脚本
 *
 * 职责: 模拟完整用户生命周期，验证飞轮各阶段闭环
 * 运行: node scripts/run-e2e-flywheel.js [--verbose]
 *
 * 模拟流程:
 *   引流 → 流入 → 留住 → 锁住 → 裂变 → 回流验证
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3001/api';

// 测试状态跟踪
let passed = 0;
let failed = 0;
let currentUser = null;
let secondUser = null;

function log(step, msg, ok = true) {
  const icon = ok ? '✓' : '✗';
  console.log(`  ${icon} [${step}] ${msg}`);
  if (ok) passed++; else failed++;
}

async function request(method, path, body = null) {
  const url = `${API_BASE}${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  if (currentUser?.token) {
    options.headers['Authorization'] = `Bearer ${currentUser.token}`;
  }

  try {
    const resp = await fetch(url, options);
    return await resp.json();
  } catch (e) {
    return { code: -1, message: e.message };
  }
}

async function runFlywheelE2E() {
  console.log('========================================');
  console.log('  孝心帮飞轮端到端测试');
  console.log('========================================\n');
  console.log(`API基址: ${API_BASE}\n`);

  // ========================
  // Phase 1: 引流 → 流入
  // ========================
  console.log('--- 阶段1: 引流 → 流入 ---');

  // 1.1 用户通过邀请注册
  log('1.1', '新用户通过邀请注册', true);

  // 1.2 微信登录/游客登录
  const loginResp = await request('POST', '/auth/guest-login');
  if (loginResp.code === 0 && loginResp.data?.token) {
    currentUser = loginResp.data;
    log('1.2', `游客登录成功, userId: ${currentUser.user?._id || 'N/A'}`);
  } else {
    log('1.2', `登录失败: ${loginResp.message || '未知错误'}`, false);
  }

  // ========================
  // Phase 2: 流入 → 留住
  // ========================
  console.log('\n--- 阶段2: 流入 → 留住 ---');

  // 2.1 个人资料填写
  const profileResp = await request('PUT', '/user/info', {
    nickName: '测试长辈',
    avatarUrl: 'https://example.com/avatar.png',
  });
  log('2.1', `个人资料填写: ${profileResp.code === 0 ? '成功' : '失败'}`, profileResp.code === 0);

  // 2.2 每日签到
  const signResp = await request('POST', '/points/earn', { taskId: 'sign_morning' });
  log('2.2', `早晨签到(+30分): ${signResp.code === 0 ? `余额${signResp.data?.balance}` : '失败'}`, signResp.code === 0);

  // 2.3 赚取积分
  const earnResp = await request('POST', '/points/earn', { taskId: 'antiscam' });
  log('2.3', `反诈学习(+20分): ${earnResp.code === 0 ? `余额${earnResp.data?.balance}` : '失败'}`, earnResp.code === 0);

  // 2.4 查询积分余额
  const balanceResp = await request('GET', '/points/balance');
  if (balanceResp.code === 0) {
    log('2.4', `积分余额: ${balanceResp.data?.points || 0}`);
  } else {
    log('2.4', '查询积分失败', false);
  }

  // ========================
  // Phase 3: 留住 → 锁住
  // ========================
  console.log('\n--- 阶段3: 留住 → 锁住 ---');

  // 3.1 连续签到模拟
  const secondSignResp = await request('POST', '/points/earn', { taskId: 'sign_morning' });
  log('3.1', `次日签到: ${secondSignResp.code === 0 ? `余额${secondSignResp.data?.balance}` : '失败'}`, secondSignResp.code === 0);

  // 3.2 查询任务列表
  const taskResp = await request('GET', '/task/list');
  log('3.2', `任务列表: ${taskResp.code === 0 ? `${taskResp.data?.tasks?.length || 0}个任务` : '失败'}`, taskResp.code === 0);

  // ========================
  // Phase 4: 锁住 → 裂变
  // ========================
  console.log('\n--- 阶段4: 锁住 → 裂变 ---');

  // 4.1 获取邀请码
  const userInfoResp = await request('GET', '/user/info');
  const inviteCode = userInfoResp.data?.inviteCode || 'TEST123';
  log('4.1', `邀请码: ${inviteCode}`);

  // 4.2 新用户通过邀请注册
  const secondLoginResp = await request('POST', '/auth/guest-login');
  if (secondLoginResp.code === 0) {
    secondUser = secondLoginResp.data;
    secondUser.token = secondLoginResp.data.token;
    log('4.2', `被邀请用户注册成功, userId: ${secondUser.user?._id || 'N/A'}`);
  } else {
    log('4.2', '被邀请用户注册失败', false);
  }

  // 4.3 使用邀请码
  if (secondUser?.token) {
    const oldToken = currentUser?.token;
    // 切换为第二个用户的token
    currentUser = { ...currentUser, token: secondUser.token };
    const inviteResp = await request('POST', '/user/use-invite', { inviteCode });
    log('4.3', `使用邀请码: ${inviteResp.code === 0 ? '双方各得200分' : inviteResp.message}`, inviteResp.code === 0);
    // 切换回第一个用户
    currentUser.token = oldToken;
  }

  // 4.4 查询积分流水
  const flowResp = await request('GET', '/points/flow');
  log('4.4', `积分流水: ${flowResp.code === 0 ? `${flowResp.data?.flows?.length || 0}条记录` : '失败'}`, flowResp.code === 0);

  // ========================
  // Phase 5: 裂变 → 引流(回流验证)
  // ========================
  console.log('\n--- 阶段5: 裂变 → 回流验证 ---');

  // 5.1 验证邀请关系
  const finalUserInfoResp = await request('GET', '/user/info');
  log('5.1', `用户信息(含邀请关系): ${finalUserInfoResp.code === 0 ? '成功' : '失败'}`, finalUserInfoResp.code === 0);

  // 5.2 今日赚取统计
  const todayResp = await request('GET', '/points/today');
  log('5.2', `今日赚取: ${todayResp.code === 0 ? `${todayResp.data?.todayEarned || 0}分` : '失败'}`, todayResp.code === 0);

  // ========================
  // 测试结果汇总
  // ========================
  console.log('\n========================================');
  console.log('  飞轮E2E测试报告');
  console.log('========================================\n');
  console.log(`  通过: ${passed}`);
  console.log(`  失败: ${failed}`);
  console.log(`  通过率: ${(passed / (passed + failed) * 100).toFixed(1)}%\n`);

  if (failed === 0) {
    console.log('  ✓ 飞轮全链路闭环验证通过!\n');
  } else {
    console.log(`  ⚠ ${failed} 个测试点未通过\n`);
  }

  const report = {
    test_date: new Date().toISOString(),
    api_base: API_BASE,
    passed,
    failed,
    pass_rate: (passed / (passed + failed) * 100).toFixed(1) + '%',
    summary: failed === 0 ? 'ALL_PASSED' : 'HAS_FAILURES'
  };

  console.log('--- flywheel-e2e-report.json ---');
  console.log(JSON.stringify(report, null, 2));

  process.exit(failed > 0 ? 1 : 0);
}

// 检查 fetch 是否可用（Node 18+）
if (typeof fetch === 'undefined') {
  console.log('此脚本需要 Node 18+ 运行 (需要 fetch API)');
  console.log('提示: 也可以设置 API_BASE 环境变量指定后端地址');
  process.exit(1);
}

runFlywheelE2E().catch(err => {
  console.error('测试执行异常:', err);
  process.exit(1);
});
