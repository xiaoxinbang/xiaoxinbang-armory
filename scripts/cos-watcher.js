#!/usr/bin/env node
/**
 * 孝心帮 COS 自动上传监控
 *
 * 监控导出文件夹，检测到新 MP4 自动上传到腾讯云COS
 * 并更新 video_url_mapping.json 和 videoMap.js
 *
 * 用法:
 *   node armory/scripts/cos-watcher.js [--watch-dir=<导出路径>]
 *
 * 默认监控 generated_videos/exports/
 * 从剪映导出时选择此文件夹即可自动触发上传
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const PROJECT_DIR = path.resolve(__dirname, '../..')
const VIDEO_MAP_PATH = path.join(PROJECT_DIR, 'generated_videos/video_url_mapping.json')
const VIDEO_JS_PATH = path.join(PROJECT_DIR, 'src/config/videoMap.js')

// 解析命令行参数
const args = process.argv.slice(2)
const watchArg = args.find(a => a.startsWith('--watch-dir='))
const WATCH_DIR = watchArg
  ? path.resolve(watchArg.split('=')[1])
  : path.join(PROJECT_DIR, 'generated_videos/exports')

// 视频ID ↔ 文件名映射
const FILENAME_MAP = {
  '01_平台总介绍': 'platform_intro',
  '02_每日签到': 'daily_sign',
  '03_用药提醒': 'medication',
  '04_健康数据记录': 'health_data',
  '05_健康百科': 'health_encyclopedia',
  '06_SOS紧急呼救': 'sos',
  '07_影音娱乐': 'entertainment',
  '08_小游戏': 'games',
  '09_新闻早报': 'news',
  '10_万年历黄历': 'calendar',
  '11_邻里广场': 'community',
  '12_老有所为': 'elder_achievement',
  '13_邻里来帮我': 'neighbor_help',
  '14_家庭相册': 'family_album',
  '15_赚零花钱': 'earn_money',
  '16_推广赚分润': 'promote_share',
  '17_共创共建共享': 'co_create',
  '18_生日祝福': 'birthday',
  '19_实用工具': 'tools',
  '20_智能聊天': 'chat',
  '21_给爸妈': 'for_parents',
  '22_给子女': 'for_children',
  '23_给创业者': 'for_entrepreneur',
  '24_给商家': 'for_merchant',
  '25_说实话': 'honest_talk',
  '26_安全承诺': 'safety_promise',
  '27_一起来做孝心帮': 'join_us',
}

function detectVideoId(filename) {
  const base = path.basename(filename, '.mp4')
  // Try exact match first
  if (FILENAME_MAP[base]) return FILENAME_MAP[base]
  // Try prefix match (e.g., "02_每日签到_final" → "02_每日签到")
  for (const [key, id] of Object.entries(FILENAME_MAP)) {
    if (base.startsWith(key)) return id
  }
  return null
}

function uploadToCos(localPath, cosKey) {
  const cmd = `coscmd upload "${localPath}" "video/${cosKey}"`
  console.log(`  ⬆ 上传中... video/${cosKey}`)
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 120000 })
    console.log(`  ✓ 上传成功: video/${cosKey}`)
    return true
  } catch (e) {
    console.error(`  ✗ 上传失败: ${e.stderr?.toString().trim() || e.message}`)
    return false
  }
}

function getCosUrl(videoId) {
  return `https://xiaoxinbang-1425796052.cos.ap-guangzhou.myqcloud.com/video/${videoId}.mp4`
}

function updateMapping(videoId, url) {
  // Update video_url_mapping.json
  try {
    const mapping = JSON.parse(fs.readFileSync(VIDEO_MAP_PATH, 'utf-8'))
    if (mapping.videos[videoId]) {
      mapping.videos[videoId].url = url
      mapping.videos[videoId].status = 'done'
      mapping.updated = new Date().toISOString()
    }
    fs.writeFileSync(VIDEO_MAP_PATH, JSON.stringify(mapping, null, 2) + '\n')
    console.log(`  ✓ video_url_mapping.json 已更新`)
  } catch (e) {
    console.error(`  ✗ 更新 mapping 失败: ${e.message}`)
  }

  // Update src/config/videoMap.js
  try {
    let jsContent = fs.readFileSync(VIDEO_JS_PATH, 'utf-8')
    const regex = new RegExp(`(${videoId}:\\s*\\{[\\s\\S]*?url:\\s*)'[^']*'`)
    if (regex.test(jsContent)) {
      jsContent = jsContent.replace(regex, `$1'${url}'`)
      fs.writeFileSync(VIDEO_JS_PATH, jsContent)
      console.log(`  ✓ videoMap.js 已更新`)
    }
  } catch (e) {
    console.error(`  ✗ 更新 videoMap.js 失败: ${e.message}`)
  }
}

function processFile(filePath) {
  const stat = fs.statSync(filePath)
  if (!stat.isFile()) return
  if (!filePath.endsWith('.mp4')) return

  const videoId = detectVideoId(filePath)
  if (!videoId) {
    console.log(`  ? 无法识别视频: ${path.basename(filePath)}，跳过`)
    return
  }

  const url = getCosUrl(videoId)
  console.log(`\n  识别到: ${path.basename(filePath)} → ${videoId}`)

  if (uploadToCos(filePath, `${videoId}.mp4`)) {
    updateMapping(videoId, url)
    console.log(`  ✓ ${videoId} 已上线！`)
    console.log(`  ▶ 播放地址: ${url}`)
  }
}

function startWatching() {
  // Ensure watch dir exists
  if (!fs.existsSync(WATCH_DIR)) {
    fs.mkdirSync(WATCH_DIR, { recursive: true })
  }

  console.log('╔══════════════════════════════════════════════╗')
  console.log('║      孝心帮 COS 自动上传监控已启动          ║')
  console.log('╚══════════════════════════════════════════════╝')
  console.log()
  console.log(`  监控目录: ${WATCH_DIR}`)
  console.log(`  操作: 剪映导出视频到上述目录，自动上传 COS`)
  console.log()
  console.log('  按 Ctrl+C 停止监控')
  console.log()

  // Process any existing files
  const existing = fs.readdirSync(WATCH_DIR).filter(f => f.endsWith('.mp4'))
  if (existing.length > 0) {
    console.log(`  发现 ${existing.length} 个待上传文件：`)
    for (const file of existing) {
      processFile(path.join(WATCH_DIR, file))
    }
  }

  // Watch for new files
  fs.watch(WATCH_DIR, (eventType, fileName) => {
    if (!fileName || !fileName.endsWith('.mp4')) return
    // Debounce — wait for file to finish writing
    const fullPath = path.join(WATCH_DIR, fileName)
    const waitForFile = (attempt = 0) => {
      try {
        const stat = fs.statSync(fullPath)
        if (stat.size > 0 && attempt < 30) {
          // Check if still growing
          const size1 = stat.size
          setTimeout(() => {
            try {
              const size2 = fs.statSync(fullPath).size
              if (size2 === size1) {
                processFile(fullPath)
              } else {
                waitForFile(attempt + 1)
              }
            } catch { /* ignore */ }
          }, 1000)
        }
      } catch { /* ignore */ }
    }
    setTimeout(() => waitForFile(), 2000)
  })
}

startWatching()
