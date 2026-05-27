#!/usr/bin/env node
/**
 * 孝心帮27支视频批量生成助手
 *
 * 职责: 指导用户通过剪映"图文成片"批量生成27支功能讲解视频
 * 运行: node armory/scripts/generate-videos.js
 *
 * 输出: 剪映制作进度表 + 每支视频的素材清单 + 导出/上传指引
 */
const fs = require('fs')
const path = require('path')

const SCRIPT_DIR = 'D:/桌面/孝心帮全新27支视频_剪映贴入版'
const SCREENSHOT_DIR = 'D:/桌面/录屏素材'
const OUTPUT_DIR = path.resolve(__dirname, '../../generated_videos')
const MAPPING_FILE = path.join(OUTPUT_DIR, 'video_url_mapping.json')

// 27支视频的生成参数
const VIDEOS = [
  { id: 'platform_intro',    name: '平台总介绍',     batch: 1, script: '01_平台总介绍_剪映贴入版.txt',        screen: '小程序首页全功能页面浏览演示.mp4',        bpm: '步步高',             difficulty: '★★☆' },
  { id: 'daily_sign',        name: '每日签到',       batch: 1, script: '02_每日签到_剪映贴入版.txt',            screen: '每日签到.mp4',                             bpm: '喜洋洋',             difficulty: '★☆☆' },
  { id: 'medication',        name: '用药提醒',       batch: 1, script: '03_用药提醒_剪映贴入版.txt',            screen: '吃药提醒.mp4',                             bpm: '夜的钢琴曲五',       difficulty: '★☆☆' },
  { id: 'sos',               name: 'SOS紧急呼救',    batch: 1, script: '06_SOS紧急呼救_剪映贴入版.txt',         screen: 'SOS紧急呼救.mp4',                          bpm: '紧张→温情',          difficulty: '★☆☆' },
  { id: 'for_parents',       name: '给爸妈',         batch: 1, script: '21_给爸妈_剪映贴入版.txt',              screen: '真人出镜（无需录屏）',                     bpm: '儿女温情',           difficulty: '★★☆' },
  { id: 'for_children',      name: '给子女',         batch: 1, script: '22_给子女_剪映贴入版.txt',             screen: '场景叙事（无需录屏）',                     bpm: '温暖→坚定',          difficulty: '★★★' },
  { id: 'health_data',       name: '健康数据记录',   batch: 2, script: '04_健康数据记录_剪映贴入版.txt',         screen: '需补录健康数据页操作',                     bpm: '茉莉花(钢琴)',       difficulty: '★★☆' },
  { id: 'health_encyclopedia', name: '健康百科',     batch: 2, script: '05_健康百科_剪映贴入版.txt',             screen: '需补录健康百科搜索',                       bpm: '彩云追月',           difficulty: '★★☆' },
  { id: 'entertainment',     name: '影音娱乐',       batch: 2, script: '07_影音娱乐_剪映贴入版.txt',             screen: '需补录娱乐中心操作',                       bpm: '步步高',             difficulty: '★★☆' },
  { id: 'games',             name: '小游戏',         batch: 2, script: '08_小游戏_剪映贴入版.txt',               screen: '需补录游戏操作',                           bpm: '喜洋洋',             difficulty: '★★☆' },
  { id: 'news',              name: '新闻早报',       batch: 2, script: '09_新闻早报_剪映贴入版.txt',            screen: '需补录新闻+语音播报',                     bpm: '舒缓早晨',           difficulty: '★★☆' },
  { id: 'calendar',          name: '万年历黄历',     batch: 2, script: '10_万年历黄历_剪映贴入版.txt',           screen: '需补录签到页黄历',                        bpm: '传统民乐',           difficulty: '★★☆' },
  { id: 'earn_money',        name: '赚零花钱',       batch: 2, script: '15_赚零花钱_剪映贴入版.txt',             screen: '军衔积分明细.mp4',                         bpm: '轻快节奏',           difficulty: '★★☆' },
  { id: 'co_create',         name: '共创共建共享',   batch: 2, script: '17_共创共建共享_剪映贴入版.txt',         screen: '小程序个人中心全功能操作演示.mp4',          bpm: '激昂→温情',          difficulty: '★★☆' },
  { id: 'tools',             name: '实用工具',       batch: 2, script: '19_实用工具_剪映贴入版.txt',             screen: '长辈字体大小调节便民操作演示.mp4',          bpm: '轻快',               difficulty: '★★☆' },
  { id: 'community',         name: '邻里广场',       batch: 3, script: '11_邻里广场_剪映贴入版.txt',            screen: '需补录社区广场操作',                       bpm: '让世界充满爱',       difficulty: '★★★' },
  { id: 'elder_achievement', name: '老有所为',       batch: 3, script: '12_老有所为_剪映贴入版.txt',            screen: '需补录技能发布操作',                       bpm: '在希望的田野上',     difficulty: '★★★' },
  { id: 'neighbor_help',     name: '邻里来帮我',     batch: 3, script: '13_邻里来帮我_剪映贴入版.txt',           screen: '需补录发需求操作',                         bpm: '温情感人',           difficulty: '★★★' },
  { id: 'family_album',      name: '家庭相册',       batch: 3, script: '14_家庭相册_剪映贴入版.txt',            screen: '需补录相册上传',                           bpm: '时间都去哪儿了',     difficulty: '★★★' },
  { id: 'promote_share',     name: '推广赚分润',     batch: 3, script: '16_推广赚分润_剪映贴入版.txt',           screen: '需补录推广中心操作',                       bpm: '真诚叙事',           difficulty: '★★★' },
  { id: 'birthday',          name: '生日祝福',       batch: 3, script: '18_生日祝福_剪映贴入版.txt',            screen: '需补录添加家人操作',                       bpm: '生日快乐(温情版)',   difficulty: '★★☆' },
  { id: 'chat',              name: '智能聊天',       batch: 3, script: '20_智能聊天_剪映贴入版.txt',             screen: '需补录聊天交互',                           bpm: '温和科技感',         difficulty: '★★☆' },
  { id: 'for_entrepreneur',  name: '给创业者',       batch: 3, script: '23_给创业者_剪映贴入版.txt',             screen: '数据图表+招募画面',                        bpm: '有力量有希望',       difficulty: '★★★' },
  { id: 'for_merchant',      name: '给商家',         batch: 3, script: '24_给商家_剪映贴入版.txt',               screen: '商家入驻流程+动画',                        bpm: '商务自信',           difficulty: '★★★' },
  { id: 'honest_talk',       name: '说实话',         batch: 3, script: '25_说实话_剪映贴入版.txt',               screen: '团队工作画面+用户反馈',                    bpm: '真诚坦白',           difficulty: '★★★' },
  { id: 'safety_promise',    name: '安全承诺',       batch: 3, script: '26_安全承诺_剪映贴入版.txt',             screen: '隐私设置页面+说明动画',                    bpm: '踏实稳重',           difficulty: '★★★' },
  { id: 'join_us',           name: '一起来做孝心帮', batch: 3, script: '27_一起来做孝心帮_剪映贴入版.txt',       screen: '所有素材混剪',                             bpm: '明天会更好',         difficulty: '★★★★' },
]

function loadMapping() {
  try {
    return JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'))
  } catch {
    return { version: '1.0', updated: '', videos: {} }
  }
}

function getStatus(mapping, id) {
  const entry = mapping.videos[id]
  if (!entry) return 'unknown'
  if (entry.url) return 'done'
  return entry.status || 'pending'
}

function main() {
  const mapping = loadMapping()

  console.log('╔══════════════════════════════════════════╗')
  console.log('║    孝心帮 27支视频 · 剪映批量生成助手    ║')
  console.log('╚══════════════════════════════════════════╝')
  console.log()

  // 检查素材目录
  const scriptsExist = fs.existsSync(SCRIPT_DIR)
  const screenshotsExist = fs.existsSync(SCREENSHOT_DIR)
  console.log(`脚本目录: ${SCRIPT_DIR}  ${scriptsExist ? '✓' : '✗'}`)
  console.log(`录屏目录: ${SCREENSHOT_DIR}  ${screenshotsExist ? '✓' : '✗'}`)

  // 检查已有录屏文件
  let availableScreens = []
  if (screenshotsExist) {
    availableScreens = fs.readdirSync(SCREENSHOT_DIR)
      .filter(f => f.endsWith('.mp4'))
    console.log(`录屏文件: ${availableScreens.length} 个可用`)
  }
  console.log()

  // 按批次显示进度
  const batches = [1, 2, 3]
  let totalDone = 0
  let totalPending = 0

  for (const batch of batches) {
    const batchVideos = VIDEOS.filter(v => v.batch === batch)
    const done = batchVideos.filter(v => getStatus(mapping, v.id) === 'done').length
    totalDone += done
    totalPending += batchVideos.length - done

    console.log(`────────────────────────────────────────`)
    console.log(`  第${batch}批 (${batch === 1 ? '★★★★★ 裂变核心' : batch === 2 ? '★★★★  功能覆盖' : '★★★   完善生态'})`)
    console.log(`  进度: ${done}/${batchVideos.length}`)
    console.log()

    for (const video of batchVideos) {
      const status = getStatus(mapping, video.id)
      const icon = status === 'done' ? '✓' : status === 'unknown' ? '?' : '○'
      const screenOk = availableScreens.some(s => video.screen.includes(s.replace('.mp4','')))

      console.log(`  ${icon} [${video.difficulty}] ${video.name}`)
      console.log(`     脚本: ${video.script}`)
      console.log(`     素材: ${video.screen} ${screenOk ? '●' : '○'}`)
      console.log(`     BGM:  ${video.bpm}`)
    }
    console.log()
  }

  console.log('────────────────────────────────────────')
  console.log(`  总进度: ${totalDone}/${VIDEOS.length}`)
  if (totalDone === VIDEOS.length) {
    console.log('  ✓ 全部视频已生成！可以上传到 COS 并更新 video_url_mapping.json')
  } else {
    console.log(`  ⚠ 剩余 ${totalPending} 支待生成`)
  }
  console.log()

  // ===== 剪映制作指引 =====
  console.log('╔══════════════════════════════════════════╗')
  console.log('║          剪映制作操作指引                ║')
  console.log('╚══════════════════════════════════════════╝')
  console.log()
  console.log('每支视频制作步骤（约10分钟/支）:')
  console.log()
  console.log('  Step 1 打开剪映 → 图文成片')
  console.log('         粘贴对应的 .txt 文件内容')
  console.log()
  console.log('  Step 2 AI自动生成配音+画面')
  console.log('         剪映自动匹配画面、生成配音')
  console.log('         配音速度调至 0.85x（比正常慢15%）')
  console.log()
  console.log('  Step 3 替换为真实录屏素材')
  console.log('         点击AI生成的每个画面 → 替换')
  console.log('         从「录屏素材」文件夹选择对应的.mp4片段')
  console.log()
  console.log('  Step 4 添加BGM')
  console.log('         搜索上方推荐的BGM曲目')
  console.log('         音量调至人声的30%')
  console.log()
  console.log('  Step 5 添加操作标注')
  console.log('         关键操作步骤添加红色圆圈/箭头标注')
  console.log()
  console.log('  Step 6 检查字幕')
  console.log('         字号 ≥ 40号，白字+黑色描边')
  console.log('         关键按钮名红色/橙色加粗')
  console.log('         每屏不超过15个字')
  console.log()
  console.log('  Step 7 导出设置')
  console.log('         分辨率: 1080p (16:9)')
  console.log('         帧率: 30fps')
  console.log('         码率: 8Mbps 或 "推荐"')
  console.log()

  // ===== 导出/上传指引 =====
  console.log('╔══════════════════════════════════════════╗')
  console.log('║          导出视频上传指引                 ║')
  console.log('╚══════════════════════════════════════════╝')
  console.log()
  console.log('  1) 导出后 MP4 文件放入:')
  console.log(`     ${OUTPUT_DIR}`)
  console.log()
  console.log('  2) 上传至腾讯云COS')
  console.log('     上传路径: /videos/{videoId}.mp4')
  console.log()
  console.log('  3) 更新 video_url_mapping.json 中的 url 字段')
  console.log(`     文件路径: ${MAPPING_FILE}`)
  console.log()
  console.log('  4) 或更新 src/config/videoMap.js 中的 url 字段')
  console.log('     两个文件同步更新即可')
  console.log()
  console.log('  5) 视频上线后自动生效，无需修改任何页面代码')
  console.log()
}

main()
