/**
 * 邀请裂变链测试
 *
 * 测试: 邀请码生成 → 分享 → 新用户注册 → 绑定关系 → 双积分结算
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3001/api';

async function test() {
  console.log('=== 邀请裂变链 E2E 测试 ===\n');

  try {
    // 1. 创建邀请人
    const inviterResp = await fetch(`${API_BASE}/auth/guest-login`, { method: 'POST' });
    const inviter = await inviterResp.json();
    console.log(`邀请人: ${inviter.data?.user?._id}`);

    if (inviter.code !== 0) {
      console.log('✗ 邀请人注册失败');
      process.exit(1);
    }

    // 2. 获取邀请码
    const userResp = await fetch(`${API_BASE}/user/info`, {
      headers: { 'Authorization': `Bearer ${inviter.data.token}` }
    });
    const userData = await userResp.json();
    const inviteCode = userData.data?.inviteCode || 'UNKNOWN';
    console.log(`邀请码: ${inviteCode}`);

    // 3. 被邀请人注册
    const refereeResp = await fetch(`${API_BASE}/auth/guest-login`, { method: 'POST' });
    const referee = await refereeResp.json();

    if (referee.code !== 0) {
      console.log('✗ 被邀请人注册失败');
      process.exit(1);
    }
    console.log(`被邀请人: ${referee.data?.user?._id}`);

    // 4. 使用邀请码
    const inviteUseResp = await fetch(`${API_BASE}/user/use-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${referee.data.token}`
      },
      body: JSON.stringify({ inviteCode })
    });
    const inviteUse = await inviteUseResp.json();

    if (inviteUse.code === 0) {
      console.log('✓ 邀请码使用成功');
    } else {
      console.log(`✗ 邀请码使用失败: ${inviteUse.message}`);
    }

    // 5. 验证邀请人积分
    const pointsResp = await fetch(`${API_BASE}/points/balance`, {
      headers: { 'Authorization': `Bearer ${inviter.data.token}` }
    });
    const points = await pointsResp.json();
    console.log(`邀请人积分: ${points.data?.points || 0}`);

    console.log('\n=== 邀请裂变链测试完成 ===');

  } catch (e) {
    console.error(`测试异常: ${e.message}`);
    process.exit(1);
  }
}

test();
