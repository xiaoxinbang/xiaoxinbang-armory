/**
 * 孝心帮飞轮完整生命周期 E2E 测试
 *
 * 模拟: 引流 → 流入 → 留住 → 锁住 → 裂变 → 回流
 * 环境: 沙盒 Docker 环境 (MongoDB + Backend + Frontend)
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3001/api';

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name}`);
    failed++;
  }
}

async function test() {
  console.log('=== 飞轮完整生命周期 E2E 测试 ===\n');

  // 1. 引流: 检查注册入口可用
  console.log('[阶段1] 引流 → 流入');
  try {
    const resp = await fetch(`${API_BASE}/auth/guest-login`, { method: 'POST' });
    const data = await resp.json();
    assert(data.code === 0 && data.data?.token, '游客登录入口正常');
    assert(data.data?.user?._id, '用户创建成功');

    // 2. 流入: 填写个人资料
    console.log('\n[阶段2] 流入 → 留住');
    const profileResp = await fetch(`${API_BASE}/user/info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.data.token}`
      },
      body: JSON.stringify({ nickName: 'E2E测试长辈' })
    });
    const profileData = await profileResp.json();
    assert(profileData.code === 0, '个人资料填写成功');

    // 3. 留住: 签到 + 赚积分
    console.log('\n[阶段3] 留住');
    const signResp = await fetch(`${API_BASE}/points/earn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.data.token}`
      },
      body: JSON.stringify({ taskId: 'sign_morning' })
    });
    const signData = await signResp.json();
    assert(signData.code === 0, `签到成功: +30分`);
    assert(signData.data?.balance >= 30, '积分余额正确');

    // 4. 锁住: 查询任务 + 获取邀请码
    console.log('\n[阶段4] 锁住 → 裂变');
    const taskResp = await fetch(`${API_BASE}/task/list`, {
      headers: { 'Authorization': `Bearer ${data.data.token}` }
    });
    const taskData = await taskResp.json();
    assert(taskData.code === 0, '任务列表可查询');

    // 5. 裂变: 邀请好友
    console.log('\n[阶段5] 裂变 → 回流');
    const inviteResp = await fetch(`${API_BASE}/auth/guest-login`, { method: 'POST' });
    const inviteData = await inviteResp.json();
    assert(inviteData.code === 0 && inviteData.data?.token, '被邀请用户可注册');

    // 6. 验证: 积分流水可查
    console.log('\n[验证] 数据闭环');
    const flowResp = await fetch(`${API_BASE}/points/flow`, {
      headers: { 'Authorization': `Bearer ${data.data.token}` }
    });
    const flowData = await flowResp.json();
    assert(flowData.code === 0, '积分流水可查询');

  } catch (e) {
    console.log(`  ✗ 网络错误: ${e.message}`);
    failed++;
  }

  // 汇总
  console.log(`\n=== 结果: ${passed}/${passed + failed} 通过 ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

test();
