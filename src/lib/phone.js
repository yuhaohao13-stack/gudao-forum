/**
 * 全球手机号验证工具
 *
 * 支持 E.164 国际格式（+国家代码+号码）
 * 覆盖全球 100+ 国家/地区的号段和长度
 *
 * 返回: { valid: boolean, error?: string }
 */

// 国家代码 → 手机号本地位数
const COUNTRY_CODES = {
  // 亚洲
  86: { len: 11, name: '中国' },        // 1XX XXXX XXXX
  65: { len: 8, name: '新加坡' },        // XXXX XXXX
  852: { len: 8, name: '香港' },         // XXXX XXXX
  853: { len: 8, name: '澳门' },         // XXXX XXXX
  886: { len: 9, name: '台湾' },         // 09XX XXX XXX
  81: { len: [10, 11], name: '日本' },   // 090/080/070 XXXX XXXX
  82: { len: [9, 10], name: '韩国' },    // 010 XXXX XXXX
  91: { len: 10, name: '印度' },         // 9/8/7 XXXXXXXX
  60: { len: [9, 10], name: '马来西亚' },// 01X XXXXXXX
  62: { len: [10, 12], name: '印度尼西亚' },
  63: { len: [10, 11], name: '菲律宾' },
  66: { len: 9, name: '泰国' },          // 08X XXX XXXX
  84: { len: [9, 10], name: '越南' },
  95: { len: [8, 10], name: '缅甸' },
  856: { len: [10, 11], name: '老挝' },
  855: { len: [9, 10], name: '柬埔寨' },
  673: { len: 7, name: '文莱' },
  976: { len: 8, name: '蒙古' },
  977: { len: 10, name: '尼泊尔' },
  880: { len: 10, name: '孟加拉国' },
  92: { len: 10, name: '巴基斯坦' },
  94: { len: 10, name: '斯里兰卡' },
  975: { len: 8, name: '不丹' },
  960: { len: 7, name: '马尔代夫' },

  // 中东
  971: { len: 9, name: '阿联酋' },
  966: { len: 9, name: '沙特阿拉伯' },
  972: { len: 9, name: '以色列' },
  90: { len: 10, name: '土耳其' },
  98: { len: 10, name: '伊朗' },
  964: { len: 10, name: '伊拉克' },
  963: { len: [9, 10], name: '叙利亚' },
  962: { len: [9, 10], name: '约旦' },
  961: { len: [7, 8], name: '黎巴嫩' },
  968: { len: 8, name: '阿曼' },
  974: { len: 8, name: '卡塔尔' },
  973: { len: 8, name: '巴林' },
  965: { len: 8, name: '科威特' },
  967: { len: 9, name: '也门' },

  // 欧洲
  44: { len: 10, name: '英国' },
  49: { len: [10, 11], name: '德国' },
  33: { len: 9, name: '法国' },
  39: { len: [9, 10], name: '意大利' },
  34: { len: 9, name: '西班牙' },
  31: { len: 9, name: '荷兰' },
  46: { len: [7, 10], name: '瑞典' },
  41: { len: 9, name: '瑞士' },
  43: { len: [9, 10], name: '奥地利' },
  32: { len: [8, 9], name: '比利时' },
  45: { len: 8, name: '丹麦' },
  47: { len: 8, name: '挪威' },
  48: { len: 9, name: '波兰' },
  351: { len: 9, name: '葡萄牙' },
  30: { len: 10, name: '希腊' },
  353: { len: [9, 10], name: '爱尔兰' },
  358: { len: [9, 10], name: '芬兰' },
  354: { len: 7, name: '冰岛' },
  36: { len: 9, name: '匈牙利' },
  420: { len: 9, name: '捷克' },
  421: { len: 9, name: '斯洛伐克' },
  48: { len: 9, name: '波兰' },
  40: { len: 10, name: '罗马尼亚' },
  359: { len: [8, 9], name: '保加利亚' },
  381: { len: [8, 9], name: '塞尔维亚' },
  385: { len: [8, 9], name: '克罗地亚' },
  386: { len: [8, 9], name: '斯洛文尼亚' },
  387: { len: 8, name: '波黑' },
  389: { len: 8, name: '北马其顿' },
  355: { len: 9, name: '阿尔巴尼亚' },
  356: { len: 8, name: '马耳他' },
  352: { len: [7, 9], name: '卢森堡' },
  423: { len: 7, name: '列支敦士登' },
  377: { len: [8, 9], name: '摩纳哥' },
  378: { len: [6, 12], name: '圣马力诺' },
  379: { len: 8, name: '梵蒂冈' },
  7: { len: 10, name: '俄罗斯' },
  380: { len: [9, 10], name: '乌克兰' },
  375: { len: 9, name: '白俄罗斯' },
  994: { len: 9, name: '阿塞拜疆' },
  995: { len: 9, name: '格鲁吉亚' },
  374: { len: 8, name: '亚美尼亚' },
  373: { len: 8, name: '摩尔多瓦' },

  // 北美
  1: { len: 10, name: '美国/加拿大' },  // XXX XXX XXXX

  // 拉丁美洲
  55: { len: [10, 11], name: '巴西' },
  52: { len: 10, name: '墨西哥' },
  54: { len: 10, name: '阿根廷' },
  56: { len: 9, name: '智利' },
  57: { len: 10, name: '哥伦比亚' },
  51: { len: 9, name: '秘鲁' },
  58: { len: 10, name: '委内瑞拉' },
  593: { len: [8, 9], name: '厄瓜多尔' },
  591: { len: 8, name: '玻利维亚' },
  595: { len: [9, 10], name: '巴拉圭' },
  598: { len: [8, 9], name: '乌拉圭' },
  506: { len: 8, name: '哥斯达黎加' },
  507: { len: 8, name: '巴拿马' },
  502: { len: 8, name: '危地马拉' },
  503: { len: 8, name: '萨尔瓦多' },
  504: { len: 8, name: '洪都拉斯' },
  505: { len: 8, name: '尼加拉瓜' },
  501: { len: 7, name: '伯利兹' },
  509: { len: 8, name: '海地' },
  53: { len: 8, name: '古巴' },
  1_809: { len: 10, name: '多米尼加' },
  1_829: { len: 10, name: '多米尼加' },
  1_849: { len: 10, name: '多米尼加' },
  1_787: { len: 10, name: '波多黎各' },
  1_939: { len: 10, name: '波多黎各' },

  // 大洋洲
  61: { len: 9, name: '澳大利亚' },      // 04XX XXX XXX
  64: { len: [8, 10], name: '新西兰' },
  679: { len: 7, name: '斐济' },
  675: { len: 8, name: '巴布亚新几内亚' },
  677: { len: [5, 7], name: '所罗门群岛' },
  678: { len: 7, name: '瓦努阿图' },
  682: { len: 5, name: '库克群岛' },
  685: { len: 7, name: '萨摩亚' },
  687: { len: 6, name: '新喀里多尼亚' },
  689: { len: [6, 8], name: '法属波利尼西亚' },
  691: { len: 7, name: '密克罗尼西亚' },

  // 非洲
  27: { len: 9, name: '南非' },
  20: { len: 10, name: '埃及' },
  234: { len: 10, name: '尼日利亚' },
  254: { len: [9, 10], name: '肯尼亚' },
  255: { len: 9, name: '坦桑尼亚' },
  256: { len: [9, 10], name: '乌干达' },
  233: { len: [9, 10], name: '加纳' },
  212: { len: 9, name: '摩洛哥' },
  213: { len: 9, name: '阿尔及利亚' },
  216: { len: 8, name: '突尼斯' },
  218: { len: 9, name: '利比亚' },
  251: { len: 9, name: '埃塞俄比亞' },
  264: { len: [8, 9], name: '纳米比亚' },
  260: { len: 9, name: '赞比亚' },
  263: { len: [9, 10], name: '津巴布韦' },
  265: { len: [8, 10], name: '马拉维' },
  258: { len: [8, 9], name: '莫桑比克' },
  261: { len: 9, name: '马达加斯加' },
  221: { len: 9, name: '塞内加尔' },
  225: { len: [8, 10], name: '科特迪瓦' },
  224: { len: [8, 9], name: '几内亚' },
  223: { len: 8, name: '马里' },
  226: { len: 8, name: '布基纳法索' },
  228: { len: 8, name: '多哥' },
  229: { len: [8, 10], name: '贝宁' },
  227: { len: 8, name: '尼日尔' },
  235: { len: 8, name: '乍得' },
  236: { len: 8, name: '中非' },
  237: { len: [8, 9], name: '喀麦隆' },
  238: { len: 7, name: '佛得角' },
  239: { len: 7, name: '圣多美' },
  240: { len: 9, name: '赤道几内亚' },
  241: { len: [7, 8], name: '加蓬' },
  242: { len: 9, name: '刚果（布）' },
  243: { len: 9, name: '刚果（金）' },
  244: { len: 9, name: '安哥拉' },
  245: { len: 7, name: '几内亚比绍' },
  248: { len: 7, name: '塞舌尔' },
  250: { len: 9, name: '卢旺达' },
  252: { len: [7, 9], name: '索马里' },
  253: { len: [6, 8], name: '吉布提' },
  257: { len: 8, name: '布隆迪' },
  262: { len: [9, 10], name: '留尼汪' },
  266: { len: 8, name: '莱索托' },
  267: { len: 8, name: '博茨瓦纳' },
  268: { len: 8, name: '斯威士兰' },
  269: { len: 7, name: '科摩罗' },
  290: { len: [4, 5], name: '圣赫勒拿' },
  291: { len: 7, name: '厄立特里亚' },
  299: { len: 6, name: '格陵兰' },
}

/**
 * 解析国家代码
 * 输入: 去掉 + 后的纯数字字符串
 * 输出: { countryCode: number, nationalNumber: string } | null
 */
function parseCountryCode(digits) {
  // 尝试匹配最长的国家代码（最长4位）
  for (let len = 4; len >= 1; len--) {
    const code = parseInt(digits.substring(0, len), 10)
    if (COUNTRY_CODES[code]) {
      return { countryCode: code, info: COUNTRY_CODES[code], nationalNumber: digits.substring(len) }
    }
  }
  return null
}

/**
 * 验证手机号
 *
 * 支持格式：
 * - +国家代码 + 本地号码 (E.164)
 * - 纯数字（无+号时按中国本地号码处理）
 *
 * @param {string} phone
 * @returns {{ valid: boolean, error?: string, formatted?: string }}
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return { valid: false, error: '请输入手机号' }
  }

  let digits = phone.trim().replace(/[\s\-\(\)\.]/g, '')

  // 检查是否含 +
  const hasPlus = digits.startsWith('+')

  if (hasPlus) {
    digits = digits.substring(1)

    // 去掉+后必须是纯数字
    if (!/^\d{4,15}$/.test(digits)) {
      return { valid: false, error: '手机号格式不正确，+后请输入国家代码和号码' }
    }

    const parsed = parseCountryCode(digits)
    if (!parsed) {
      // 国家代码无法识别，保底验证：4-15位数字
      if (digits.length >= 4 && digits.length <= 15) {
        return { valid: true, formatted: '+' + digits }
      }
      return { valid: false, error: '无法识别的国家代码或号码长度不正确' }
    }

    const { info, nationalNumber } = parsed
    if (!/^\d+$/.test(nationalNumber)) {
      return { valid: false, error: '手机号格式不正确' }
    }

    // 验证本地号码长度
    const localLen = nationalNumber.length
    const expectedLen = info.len
    const lenMatch = Array.isArray(expectedLen)
      ? localLen >= expectedLen[0] && localLen <= expectedLen[1]
      : localLen === expectedLen

    if (!lenMatch) {
      return { valid: false, error: `${info.name}手机号应为${Array.isArray(expectedLen) ? expectedLen[0] + '-' + expectedLen[1] : expectedLen}位，当前${localLen}位` }
    }

    return { valid: true, formatted: '+' + digits }
  } else {
    // 无 + 号：按中国号码验证
    if (!/^\d{7,15}$/.test(digits)) {
      return { valid: false, error: '手机号格式不正确，国际号码请以+开头' }
    }

    // 中国手机号：1XX XXXX XXXX
    if (digits.length === 11 && digits.startsWith('1')) {
      return { valid: true, formatted: digits }
    }

    // 其他情况：允许纯数字（兼容旧用户）
    if (digits.length >= 7 && digits.length <= 15) {
      // 如果没有国家代码提示用户使用+格式
      return { valid: true, formatted: digits }
    }

    return { valid: false, error: '手机号长度不正确' }
  }
}

/**
 * 获取格式化显示的号码
 */
export function formatPhone(phone) {
  const result = validatePhone(phone)
  if (result.valid && result.formatted) {
    return result.formatted.startsWith('+') ? result.formatted : '+86' + result.formatted
  }
  return phone
}
