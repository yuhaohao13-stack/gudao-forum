// 从真实词汇文件加载数据
// 中考英语词汇表.txt → JUNIOR_VOCAB
// 台灣高中英文參考詞彙表.txt → SENIOR_VOCAB

const fs = require('fs')
const path = require('path')

// 解析中考词汇行: "ability [əˈbɪlɪtɪ] n. 能力;才能"
function parseJuniorLine(line) {
  line = line.trim()
  if (!line) return null
  // 跳过单字母标题行
  if (/^[A-Z]$/.test(line)) return null
  
  // 提取单词 (第一个空格前)
  const match = line.match(/^([a-zA-Z]+)\s+/)
  if (!match) return null
  const word = match[1]
  
  // 提取音标 [xxx]
  const phonMatch = line.match(/\[([^\]]+)\]/)
  const phonetic = phonMatch ? '/' + phonMatch[1] + '/' : ''
  
  // 提取释义 (去掉单词和音标后的剩余)
  let rest = line.slice(word.length).trim()
  if (phonMatch) rest = rest.slice(rest.indexOf(']') + 1).trim()
  
  // 提取词性 (第一个点前面)
  const posMatch = rest.match(/^([a-z.]+)\s/)
  const category = posMatch ? posMatch[1].trim() : ''
  
  // 提取中文释义 (词性后面的)
  const meaning = rest.replace(/^[a-z.]+\s+/, '').trim()
  
  return { word, phonetic, meaning, example: null, category }
}

// 解析台湾高中词汇行: "abandon v. 遺棄；中止" 或 "*abbey n.修道院"
function parseSeniorLine(line) {
  line = line.trim()
  if (!line) return null
  // 跳过标题行
  if (/^大學|^指考|^學測/.test(line)) return null
  if (/^[A-Z]$/.test(line)) return null
  
  const isAdvanced = line.startsWith('*')
  const cleanLine = line.replace(/^\*/, '')
  
  // 提取单词
  const match = cleanLine.match(/^([a-zA-Z]+)\s+/)
  if (!match) return null
  const word = match[1]
  
  // 提取剩余 (去掉单词)
  const rest = cleanLine.slice(word.length).trim()
  
  // 提取词性 (如果有)
  const posMatch = rest.match(/^(adj\.|adv\.|v\.|n\.|prep\.|pron\.|conj\.|int\.|prep\.\/adv\.|prep\.\/adv\.\/adj\.|adj\.\/adv\.)/)
  const category = posMatch ? posMatch[1].trim() : ''
  const meaning = rest.replace(/^[a-z./]+\s+/, '').trim()
  
  return { word, phonetic: '', meaning, example: null, category, isAdvanced }
}

function loadVocab() {
  try {
    const juniorRaw = fs.readFileSync(path.join(__dirname, '中考英语词汇表.txt'), 'utf8')
    const seniorRaw = fs.readFileSync(path.join(__dirname, '台灣高中英文參考詞彙表.txt'), 'utf8')
    
    const JUNIOR_VOCAB = juniorRaw.split('\n')
      .map(parseJuniorLine)
      .filter(Boolean)
      .map((item, i) => ({ ...item, id: i + 1 }))
    
    const SENIOR_VOCAB = seniorRaw.split('\n')
      .map(parseSeniorLine)
      .filter(Boolean)
      .filter(item => !item.isAdvanced) // 只取基础词（非*号）
      .map((item, i) => ({ ...item, id: i + 1 }))
    
    return { JUNIOR_VOCAB, SENIOR_VOCAB }
  } catch (e) {
    console.error('Error loading vocab:', e.message)
    return { JUNIOR_VOCAB: [], SENIOR_VOCAB: [] }
  }
}

const vocab = loadVocab()
module.exports = vocab
