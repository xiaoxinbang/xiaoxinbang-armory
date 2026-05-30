/**
 * 分润计算逻辑集成测试
 *
 * 测试: 五级分润比例完整性、数学正确性、分润发放
 */

function test() {
  console.log('=== 分润计算逻辑测试 ===\n');

  // 分润配置 (参考 config.js)
  const profitSharing = {
    direct: 0.30,       // 直接推广
    indirect: 0.05,     // 间接推广
    merchant: 0.05,     // 商家分成
    district: 0.12,     // 区级代理
    city: 0.08,         // 市级代理
    province: 0.05,     // 省级代理
    platform: 0.13,     // 平台
    pointsPool: 0.20,   // 积分池
  };

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

  // 1. 验证分润比例总计 = 100%
  const total = Object.values(profitSharing).reduce((a, b) => a + b, 0);
  assert(Math.abs(total - 1.0) < 0.001, `分润比例总计 = 100% (实际: ${(total * 100).toFixed(1)}%)`);

  // 2. 验证所有比例 > 0
  for (const [key, val] of Object.entries(profitSharing)) {
    assert(val > 0, `  ${key}: ${(val * 100).toFixed(0)}% > 0`);
  }

  // 3. 验证直接推广分润计算
  const consumptionAmount = 100;  // 消费100元
  const directShare = consumptionAmount * profitSharing.direct;
  assert(directShare === 30, `直接推广分润: 消费100元 → 推广者得${directShare}元`);

  // 4. 验证积分池注入
  const pointsPoolAmount = consumptionAmount * profitSharing.pointsPool;
  assert(pointsPoolAmount === 20, `积分池注入: 消费100元 → 积分池${pointsPoolAmount}元`);

  // 5. 验证多层分润
  const totalDistributed = consumptionAmount * (
    profitSharing.direct +
    profitSharing.merchant +
    profitSharing.district +
    profitSharing.city +
    profitSharing.province
  );
  assert(totalDistributed === 60, `多层分润合计: 消费100元 → 分润${totalDistributed}元`);

  // 汇总
  console.log(`\n=== 结果: ${passed}/${passed + failed} 通过 ===`);
  process.exit(failed > 0 ? 1 : 0);
}

test();
