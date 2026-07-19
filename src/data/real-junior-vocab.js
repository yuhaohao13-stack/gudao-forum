// 中考英语词汇表 - 真实数据
const JUNIOR_VOCAB = [
  {
    "word": "a",
    "phonetic": "/ə, eɪ(ən)/",
    "meaning": "一（个、件……）",
    "example": null,
    "category": "art.",
    "id": 1
  },
  {
    "word": "ability",
    "phonetic": "/əˈbɪlɪtɪ/",
    "meaning": "能力;才能",
    "example": null,
    "category": "n.",
    "id": 2
  },
  {
    "word": "able",
    "phonetic": "/ˈeɪb(ə)l/",
    "meaning": "能够;有能力的",
    "example": null,
    "category": "a.",
    "id": 3
  },
  {
    "word": "about",
    "phonetic": "/əˈbaʊt/",
    "meaning": "大约;到处;四处 prep. 关于;在各处;四处",
    "example": null,
    "category": "ad.",
    "id": 4
  },
  {
    "word": "above",
    "phonetic": "/əˈbʌv/",
    "meaning": "在…上面 a. 上面的 ad. 在…之上",
    "example": null,
    "category": "prep.",
    "id": 5
  },
  {
    "word": "abroad",
    "phonetic": "/əˈbrɔːd/",
    "meaning": "到（在）国外",
    "example": null,
    "category": "ad.",
    "id": 6
  },
  {
    "word": "accept",
    "phonetic": "/əkˈsept/",
    "meaning": "接受",
    "example": null,
    "category": "vt.",
    "id": 7
  },
  {
    "word": "accident",
    "phonetic": "/ˈæksɪdənt/",
    "meaning": "事故,意外",
    "example": null,
    "category": "n.",
    "id": 8
  },
  {
    "word": "across",
    "phonetic": "/əˈkrɔs/",
    "meaning": "prep./ad. 横过;穿过;另一边,在对面",
    "example": null,
    "category": "",
    "id": 9
  },
  {
    "word": "act",
    "phonetic": "/ækt/",
    "meaning": "法令，条例 v. 行动,（戏）表演,扮演（角色）",
    "example": null,
    "category": "n.",
    "id": 10
  },
  {
    "word": "action",
    "phonetic": "/ˈækʃ(ə)n/",
    "meaning": "行动,行为,举动",
    "example": null,
    "category": "n.",
    "id": 11
  },
  {
    "word": "active",
    "phonetic": "/ˈæktɪv/",
    "meaning": "积极的，主动的",
    "example": null,
    "category": "a.",
    "id": 12
  },
  {
    "word": "activity",
    "phonetic": "/ækˈtɪvɪtɪ/",
    "meaning": "活动",
    "example": null,
    "category": "n.",
    "id": 13
  },
  {
    "word": "advantage",
    "phonetic": "/ədˈvɑːntɪdʒ/",
    "meaning": "优点；好处,有利条件",
    "example": null,
    "category": "n.",
    "id": 14
  },
  {
    "word": "advertisement",
    "phonetic": "/ədˈvɜːtɪsmənt/",
    "meaning": "广告",
    "example": null,
    "category": "n.",
    "id": 15
  },
  {
    "word": "advice",
    "phonetic": "/ədˈvaɪs/",
    "meaning": "忠告，劝告，建议",
    "example": null,
    "category": "n.",
    "id": 16
  },
  {
    "word": "afford",
    "phonetic": "/əˈfɔːd/",
    "meaning": "负担得起（…的费用）；抽得出（时间）；提供",
    "example": null,
    "category": "vt.",
    "id": 17
  },
  {
    "word": "afraid",
    "phonetic": "/əˈfreɪd/",
    "meaning": "害怕的；担心",
    "example": null,
    "category": "a.",
    "id": 18
  },
  {
    "word": "Africa",
    "phonetic": "/ˈæfrɪkə/",
    "meaning": "非洲",
    "example": null,
    "category": "n.",
    "id": 19
  },
  {
    "word": "after",
    "phonetic": "/ˈɑːftə(r)/",
    "meaning": "在后；后来 prep. 在…之后 conj. 在…以后",
    "example": null,
    "category": "ad.",
    "id": 20
  },
  {
    "word": "afternoon",
    "phonetic": "/ɑːftəˈnuːn/",
    "meaning": "下午，午后",
    "example": null,
    "category": "n.",
    "id": 21
  },
  {
    "word": "again",
    "phonetic": "/əˈɡeɪn/",
    "meaning": "再一次；再，又",
    "example": null,
    "category": "ad.",
    "id": 22
  },
  {
    "word": "against",
    "phonetic": "/əˈɡeɪnst/",
    "meaning": "对着,反对,倚靠",
    "example": null,
    "category": "prep.",
    "id": 23
  },
  {
    "word": "age",
    "phonetic": "/eɪdʒ/",
    "meaning": "年龄；时代",
    "example": null,
    "category": "n.",
    "id": 24
  },
  {
    "word": "ago",
    "phonetic": "/əˈɡəʊ/",
    "meaning": "以前",
    "example": null,
    "category": "ad.",
    "id": 25
  },
  {
    "word": "agree",
    "phonetic": "/əˈɡriː/",
    "meaning": "同意",
    "example": null,
    "category": "v.",
    "id": 26
  },
  {
    "word": "air",
    "phonetic": "/eə(r)/",
    "meaning": "空气；大气",
    "example": null,
    "category": "n.",
    "id": 27
  },
  {
    "word": "aircraft",
    "phonetic": "/ˈeəkrɑːft/",
    "meaning": "飞机 (单复数同)",
    "example": null,
    "category": "n.",
    "id": 28
  },
  {
    "word": "airline",
    "phonetic": "/ ˈeəlain/",
    "meaning": "航空公司;航空系统;航线",
    "example": null,
    "category": "n.",
    "id": 29
  },
  {
    "word": "airplane",
    "phonetic": "/ˈeəpleɪn/",
    "meaning": "（美）飞机",
    "example": null,
    "category": "n.",
    "id": 30
  },
  {
    "word": "airport",
    "phonetic": "/ˈeəpɔːt/",
    "meaning": "航空站,飞机场",
    "example": null,
    "category": "n.",
    "id": 31
  },
  {
    "word": "alike",
    "phonetic": "/əˈlaɪk/",
    "meaning": "很相似地，同样地",
    "example": null,
    "category": "ad.",
    "id": 32
  },
  {
    "word": "alive",
    "phonetic": "/əˈlaɪv/",
    "meaning": "活着的，存在的",
    "example": null,
    "category": "a.",
    "id": 33
  },
  {
    "word": "all",
    "phonetic": "/ɔːl/",
    "meaning": "全部地 a. 全（部）;所有的;总;整 pron. 全部;全体",
    "example": null,
    "category": "ad.",
    "id": 34
  },
  {
    "word": "allow",
    "phonetic": "/əˈlaʊ/",
    "meaning": "允许，准许",
    "example": null,
    "category": "vt.",
    "id": 35
  },
  {
    "word": "almost",
    "phonetic": "/ˈɔːlməʊst/",
    "meaning": "几乎，差不多",
    "example": null,
    "category": "ad.",
    "id": 36
  },
  {
    "word": "alone",
    "phonetic": "/əˈləʊn/",
    "meaning": "单独的，孤独的",
    "example": null,
    "category": "a.",
    "id": 37
  },
  {
    "word": "along",
    "phonetic": "/əˈlɔŋ; (US) əˈlɔŋ/",
    "meaning": "向前；和…一起；一同 prep. 沿着；顺着",
    "example": null,
    "category": "ad.",
    "id": 38
  },
  {
    "word": "already",
    "phonetic": "/ɔːlˈredɪ/",
    "meaning": "已经",
    "example": null,
    "category": "ad.",
    "id": 39
  },
  {
    "word": "also",
    "phonetic": "/ˈɔːlsəʊ/",
    "meaning": "也",
    "example": null,
    "category": "ad.",
    "id": 40
  },
  {
    "word": "although",
    "phonetic": "/ɔːlˈðəʊ/",
    "meaning": "虽然，尽管",
    "example": null,
    "category": "conj.",
    "id": 41
  },
  {
    "word": "always",
    "phonetic": "/ˈɔːlweɪz/",
    "meaning": "总是；一直；永远",
    "example": null,
    "category": "ad.",
    "id": 42
  },
  {
    "word": "amaze",
    "phonetic": "/əˈmeɪz/",
    "meaning": "惊奇，惊叹；震惊",
    "example": null,
    "category": "v.",
    "id": 43
  },
  {
    "word": "amazing",
    "phonetic": "/əˈmeɪzɪŋ/",
    "meaning": "惊叹的;震惊的;令人惊讶的",
    "example": null,
    "category": "a.",
    "id": 44
  },
  {
    "word": "America",
    "phonetic": "/əˈmerɪkə/",
    "meaning": "美国；美洲",
    "example": null,
    "category": "n.",
    "id": 45
  },
  {
    "word": "American",
    "phonetic": "/əˈmerɪkən/",
    "meaning": "美国的；美国人的 n. 美国人",
    "example": null,
    "category": "a.",
    "id": 46
  },
  {
    "word": "among",
    "phonetic": "/əˈmʌŋ/",
    "meaning": "在…中间；在（三个以上）之间",
    "example": null,
    "category": "prep.",
    "id": 47
  },
  {
    "word": "and",
    "phonetic": "/ənd, ænd/",
    "meaning": "和；又",
    "example": null,
    "category": "conj.",
    "id": 48
  },
  {
    "word": "angel",
    "phonetic": "/ˈeindʒəl/",
    "meaning": "天使,守护神",
    "example": null,
    "category": "n.",
    "id": 49
  },
  {
    "word": "angry",
    "phonetic": "/ˈænɡrɪ/",
    "meaning": "生气的，愤怒的",
    "example": null,
    "category": "a.",
    "id": 50
  },
  {
    "word": "animal",
    "phonetic": "/ˈænɪm(ə)l/",
    "meaning": "动物",
    "example": null,
    "category": "n.",
    "id": 51
  },
  {
    "word": "another",
    "phonetic": "/əˈnʌðə(r)/",
    "meaning": "再一；另一；别的 pron. 另一个",
    "example": null,
    "category": "a.",
    "id": 52
  },
  {
    "word": "answer",
    "phonetic": "/ˈɑːnsə(r); (US) ˈænsər/",
    "meaning": "回答,答复;答案 v. 回答,答复;（作出）答案",
    "example": null,
    "category": "n.",
    "id": 53
  },
  {
    "word": "any",
    "phonetic": "/ˈenɪ/",
    "meaning": "任何的;（用于疑问句、否定句）一些；什么",
    "example": null,
    "category": "pron.",
    "id": 54
  },
  {
    "word": "anyhow",
    "phonetic": "/ˈenɪhaʊ/",
    "meaning": "不管怎样",
    "example": null,
    "category": "ad.",
    "id": 55
  },
  {
    "word": "anyone",
    "phonetic": "/ˈenɪwʌn/",
    "meaning": "任何人，无论谁",
    "example": null,
    "category": "pron.",
    "id": 56
  },
  {
    "word": "anything",
    "phonetic": "/ˈenɪθɪŋ/",
    "meaning": "什么事（物）；任何事（物）",
    "example": null,
    "category": "pron.",
    "id": 57
  },
  {
    "word": "anywhere",
    "phonetic": "/ˈenɪweə(r)/",
    "meaning": "任何地方",
    "example": null,
    "category": "ad.",
    "id": 58
  },
  {
    "word": "apologize",
    "phonetic": "/əˈpɔlədʒaɪz/",
    "meaning": "道歉，谢罪",
    "example": null,
    "category": "vi.",
    "id": 59
  },
  {
    "word": "apology",
    "phonetic": "/əˈpɔlədʒɪ/",
    "meaning": "道歉；歉意",
    "example": null,
    "category": "n.",
    "id": 60
  },
  {
    "word": "apple",
    "phonetic": "/ˈæp(ə)l/",
    "meaning": "苹果",
    "example": null,
    "category": "n.",
    "id": 61
  },
  {
    "word": "April",
    "phonetic": "/ˈeɪpr(ə)l/",
    "meaning": "4月",
    "example": null,
    "category": "n.",
    "id": 62
  },
  {
    "word": "Arab",
    "phonetic": "/ˈærəb/",
    "meaning": "阿拉伯的 n. 阿拉伯人",
    "example": null,
    "category": "a.",
    "id": 63
  },
  {
    "word": "area",
    "phonetic": "/ˈeərɪə/",
    "meaning": "面积；地域，区域；范围，领域",
    "example": null,
    "category": "n.",
    "id": 64
  },
  {
    "word": "arm",
    "phonetic": "/ɑːm/",
    "meaning": "臂,支架,（美）武器,武力",
    "example": null,
    "category": "n.",
    "id": 65
  },
  {
    "word": "army",
    "phonetic": "/ˈɑːmɪ/",
    "meaning": "军队",
    "example": null,
    "category": "n.",
    "id": 66
  },
  {
    "word": "around",
    "phonetic": "/əˈraʊnd/",
    "meaning": "在周围；在附近 prep. 在…周围；大约",
    "example": null,
    "category": "ad.",
    "id": 67
  },
  {
    "word": "arrive",
    "phonetic": "/əˈraɪv/",
    "meaning": "到达；达到",
    "example": null,
    "category": "vi.",
    "id": 68
  },
  {
    "word": "arrow",
    "phonetic": "/ˈærəʊ/",
    "meaning": "箭；箭头",
    "example": null,
    "category": "n.",
    "id": 69
  },
  {
    "word": "art",
    "phonetic": "/ɑːt/",
    "meaning": "艺术，美术；技艺",
    "example": null,
    "category": "n.",
    "id": 70
  },
  {
    "word": "artist",
    "phonetic": "/ˈɑːtɪst/",
    "meaning": "艺术家,美术家",
    "example": null,
    "category": "n.",
    "id": 71
  },
  {
    "word": "article",
    "phonetic": "/ˈɑːtɪk(ə)l/",
    "meaning": "文章;物品;冠词",
    "example": null,
    "category": "n.",
    "id": 72
  },
  {
    "word": "as",
    "phonetic": "/əz, æz/",
    "meaning": "ad.& conj. 像…一样;当…时；如同；因为 prep. 作为，当做",
    "example": null,
    "category": "",
    "id": 73
  },
  {
    "word": "Asia",
    "phonetic": "/ˈeɪʃə/",
    "meaning": "亚洲",
    "example": null,
    "category": "n.",
    "id": 74
  },
  {
    "word": "Asian",
    "phonetic": "/ˈeɪʃ(ə)n, ˈeɪʒ(ə)n/",
    "meaning": "亚洲（人）的 n. 亚洲人",
    "example": null,
    "category": "a.",
    "id": 75
  },
  {
    "word": "ask",
    "phonetic": "/ɑːsk/",
    "meaning": "问；请求，要求；邀请",
    "example": null,
    "category": "v.",
    "id": 76
  },
  {
    "word": "asleep",
    "phonetic": "/əˈsliːp/",
    "meaning": "睡着的，熟睡",
    "example": null,
    "category": "a.",
    "id": 77
  },
  {
    "word": "assistant",
    "phonetic": "/əˈsɪst(ə)nt/",
    "meaning": "助手，助理",
    "example": null,
    "category": "n.",
    "id": 78
  },
  {
    "word": "at",
    "phonetic": "/æt/",
    "meaning": "在（几点钟）;在（某处）",
    "example": null,
    "category": "prep.",
    "id": 79
  },
  {
    "word": "attack",
    "phonetic": "/əˈtæk/",
    "meaning": "/ n. 攻击，袭击",
    "example": null,
    "category": "vt.",
    "id": 80
  },
  {
    "word": "attend",
    "phonetic": "/əˈtend/",
    "meaning": "看护，照料，服侍；出席，参加",
    "example": null,
    "category": "v.",
    "id": 81
  },
  {
    "word": "attention",
    "phonetic": "/əˈtenʃ(ə)n/",
    "meaning": "注意，关心",
    "example": null,
    "category": "n.",
    "id": 82
  },
  {
    "word": "attract",
    "phonetic": "/əˈtrækt/",
    "meaning": "吸引，引起",
    "example": null,
    "category": "v.",
    "id": 83
  },
  {
    "word": "August",
    "phonetic": "/ˈɔːɡəst/",
    "meaning": "8月",
    "example": null,
    "category": "n.",
    "id": 84
  },
  {
    "word": "aunt",
    "phonetic": "/ɑːnt; (US) ænt/",
    "meaning": "伯母；舅母；婶；姑；姨",
    "example": null,
    "category": "n.",
    "id": 85
  },
  {
    "word": "Australia",
    "phonetic": "/ɔˈstreɪljə/",
    "meaning": "澳洲；澳大利亚",
    "example": null,
    "category": "n.",
    "id": 86
  },
  {
    "word": "Australian",
    "phonetic": "/ɔˈstreɪlɪən/",
    "meaning": "澳洲的，澳大利亚人的 n. 澳大利亚人",
    "example": null,
    "category": "a.",
    "id": 87
  },
  {
    "word": "autumn",
    "phonetic": "/ˈɔːtəm/",
    "meaning": "秋天，秋季",
    "example": null,
    "category": "n.",
    "id": 88
  },
  {
    "word": "awake",
    "phonetic": "/əˈweɪk/",
    "meaning": "唤醒 a. 醒着的",
    "example": null,
    "category": "v.",
    "id": 89
  },
  {
    "word": "away",
    "phonetic": "/əˈweɪ/",
    "meaning": "离开；远离",
    "example": null,
    "category": "ad.",
    "id": 90
  },
  {
    "word": "awful",
    "phonetic": "/ɔːfu:l/",
    "meaning": "adj.极坏的、极讨厌的、糟糕的、可怕的",
    "example": null,
    "category": "",
    "id": 91
  },
  {
    "word": "baby",
    "phonetic": "/ˈbeɪbɪ/",
    "meaning": "婴儿",
    "example": null,
    "category": "n.",
    "id": 92
  },
  {
    "word": "back",
    "phonetic": "/bæk/",
    "meaning": "回（原处）；向后 a. 后面的 n. 背后，后部；背",
    "example": null,
    "category": "ad.",
    "id": 93
  },
  {
    "word": "bad",
    "phonetic": "/bæd/",
    "meaning": "坏的；有害的，不利的；严重的",
    "example": null,
    "category": "a.",
    "id": 94
  },
  {
    "word": "badly",
    "phonetic": "/ˈbædlɪ/",
    "meaning": "坏，恶劣地",
    "example": null,
    "category": "ad.",
    "id": 95
  },
  {
    "word": "bake",
    "phonetic": "/beɪk/",
    "meaning": "烤； 烘（面包）",
    "example": null,
    "category": "v.",
    "id": 96
  },
  {
    "word": "ball",
    "phonetic": "/bɔːl/",
    "meaning": "球 n. 舞会",
    "example": null,
    "category": "n.",
    "id": 97
  },
  {
    "word": "balloon",
    "phonetic": "/bəˈluːn/",
    "meaning": "气球",
    "example": null,
    "category": "n.",
    "id": 98
  },
  {
    "word": "bamboo",
    "phonetic": "/bæmˈbuː/",
    "meaning": "竹子",
    "example": null,
    "category": "n.",
    "id": 99
  },
  {
    "word": "banana",
    "phonetic": "/bəˈnɑːnə; (US) bəˈnænə/",
    "meaning": "香蕉",
    "example": null,
    "category": "n.",
    "id": 100
  },
  {
    "word": "band",
    "phonetic": "/bænd/",
    "meaning": "乐队,波段,一伙,一帮,带(状物)",
    "example": null,
    "category": "n.",
    "id": 101
  },
  {
    "word": "bang",
    "phonetic": "/bæŋ/",
    "meaning": "砰",
    "example": null,
    "category": "int.",
    "id": 102
  },
  {
    "word": "bank",
    "phonetic": "/bæŋk/",
    "meaning": "n.（河海湖的）岸，堤, 银行",
    "example": null,
    "category": "",
    "id": 103
  },
  {
    "word": "base",
    "phonetic": "/beɪs/",
    "meaning": "根据地,基地,（棒球）垒",
    "example": null,
    "category": "n.",
    "id": 104
  },
  {
    "word": "baseball",
    "phonetic": "/ˈbeɪsbɔːl/",
    "meaning": "棒球",
    "example": null,
    "category": "n.",
    "id": 105
  },
  {
    "word": "basket",
    "phonetic": "/ˈbɑːskɪt; (US) ˈbæskɪt/",
    "meaning": "篮子",
    "example": null,
    "category": "n.",
    "id": 106
  },
  {
    "word": "basketball",
    "phonetic": "/ˈbɑːskɪtbɔːl/",
    "meaning": "篮球",
    "example": null,
    "category": "n.",
    "id": 107
  },
  {
    "word": "bath",
    "phonetic": "/bɑːθ; (US) bæθ/",
    "meaning": "洗澡；浴室；澡盆",
    "example": null,
    "category": "n.",
    "id": 108
  },
  {
    "word": "be",
    "phonetic": "/biː/",
    "meaning": "是 (am, is, are, was, were, being, been)；成为",
    "example": null,
    "category": "v.",
    "id": 109
  },
  {
    "word": "beach",
    "phonetic": "/biːtʃ/",
    "meaning": "海滨，海滩",
    "example": null,
    "category": "n.",
    "id": 110
  },
  {
    "word": "bear",
    "phonetic": "/beə(r)/",
    "meaning": "承受，负担，承担；忍受；容忍 n. 熊",
    "example": null,
    "category": "v.",
    "id": 111
  },
  {
    "word": "beat",
    "phonetic": "/biːt/",
    "meaning": "敲打；跳动；打赢 n.（音乐）节拍",
    "example": null,
    "category": "v.",
    "id": 112
  },
  {
    "word": "beautiful",
    "phonetic": "/ˈbjuːtɪf(ə)l/",
    "meaning": "美，美丽，美观的",
    "example": null,
    "category": "a.",
    "id": 113
  },
  {
    "word": "because",
    "phonetic": "/bɪˈkɔz; (US) bɪˈkɔːz/",
    "meaning": "因为",
    "example": null,
    "category": "conj.",
    "id": 114
  },
  {
    "word": "become",
    "phonetic": "/bɪˈkʌm/",
    "meaning": "变得；成为",
    "example": null,
    "category": "v.",
    "id": 115
  },
  {
    "word": "bed",
    "phonetic": "/bed/",
    "meaning": "床",
    "example": null,
    "category": "n.",
    "id": 116
  },
  {
    "word": "bedroom",
    "phonetic": "/ˈbedruːm/",
    "meaning": "寝室，卧室",
    "example": null,
    "category": "n.",
    "id": 117
  },
  {
    "word": "bee",
    "phonetic": "/biː/",
    "meaning": "蜜蜂",
    "example": null,
    "category": "n.",
    "id": 118
  },
  {
    "word": "beef",
    "phonetic": "/biːf/",
    "meaning": "牛肉",
    "example": null,
    "category": "n.",
    "id": 119
  },
  {
    "word": "beer",
    "phonetic": "/bɪə(r)/",
    "meaning": "啤酒",
    "example": null,
    "category": "n.",
    "id": 120
  },
  {
    "word": "before",
    "phonetic": "/bɪˈfɔː(r)/",
    "meaning": "在…以前；在…前面 ad. 以前 conj. 在…之前",
    "example": null,
    "category": "prep.",
    "id": 121
  },
  {
    "word": "beg",
    "phonetic": "/beɡ/",
    "meaning": "请求，乞求，乞讨 ",
    "example": null,
    "category": "v.",
    "id": 122
  },
  {
    "word": "beginning",
    "phonetic": "/bɪˈɡɪnɪŋ/",
    "meaning": "开始，开端",
    "example": null,
    "category": "n.",
    "id": 123
  },
  {
    "word": "behind",
    "phonetic": "/bɪˈhaɪnd/",
    "meaning": "(表示位置)在…后面 ad. 在后面；向后",
    "example": null,
    "category": "prep.",
    "id": 124
  },
  {
    "word": "believe",
    "phonetic": "/bɪˈliːv/",
    "meaning": "相信，认为",
    "example": null,
    "category": "v.",
    "id": 125
  },
  {
    "word": "bell",
    "phonetic": "/bel/",
    "meaning": "钟,铃;钟(铃)声;钟形物",
    "example": null,
    "category": "n.",
    "id": 126
  },
  {
    "word": "below",
    "phonetic": "/bɪˈləʊ/",
    "meaning": "在…下面",
    "example": null,
    "category": "prep.",
    "id": 127
  },
  {
    "word": "beside",
    "phonetic": "/bɪˈsaɪd/",
    "meaning": "在…旁边；靠近",
    "example": null,
    "category": "prep.",
    "id": 128
  },
  {
    "word": "besides",
    "phonetic": "/bɪˈsaɪdz/",
    "meaning": "除…以外（还有） ad. 还有，此外",
    "example": null,
    "category": "prep.",
    "id": 129
  },
  {
    "word": "better",
    "phonetic": "/ˈbetə(r)/",
    "meaning": "a.& ad. 更好的,更好地；更,更多 n. 较好的事物between [bɪˈtwiːn] prep. 在（两者）之间；在…中间",
    "example": null,
    "category": "",
    "id": 130
  },
  {
    "word": "bicycle",
    "phonetic": "/ˈbaɪsɪk(ə)l/",
    "meaning": "自行车",
    "example": null,
    "category": "n.",
    "id": 131
  },
  {
    "word": "big",
    "phonetic": "/bɪɡ/",
    "meaning": "大的",
    "example": null,
    "category": "a.",
    "id": 132
  },
  {
    "word": "bike",
    "phonetic": "/baɪk/",
    "meaning": "自行车",
    "example": null,
    "category": "n.",
    "id": 133
  },
  {
    "word": "bill",
    "phonetic": "/bɪl/",
    "meaning": "n.账单；法案，议案；（美）钞票，纸币",
    "example": null,
    "category": "",
    "id": 134
  },
  {
    "word": "billion",
    "phonetic": "/ˈbɪljən/",
    "meaning": "十亿",
    "example": null,
    "category": "num.",
    "id": 135
  },
  {
    "word": "biology",
    "phonetic": "/baiɔlədʒɪ/",
    "meaning": "生物（学）",
    "example": null,
    "category": "n.",
    "id": 136
  },
  {
    "word": "bird",
    "phonetic": "/bəːd/",
    "meaning": "鸟",
    "example": null,
    "category": "n.",
    "id": 137
  },
  {
    "word": "birth",
    "phonetic": "/bəːθ/",
    "meaning": "出生；诞生",
    "example": null,
    "category": "n.",
    "id": 138
  },
  {
    "word": "birthday",
    "phonetic": "/ˈbəːθdeɪ/",
    "meaning": "生日",
    "example": null,
    "category": "n.",
    "id": 139
  },
  {
    "word": "bit",
    "phonetic": "/bɪt/",
    "meaning": "一点，一些，少量的",
    "example": null,
    "category": "n.",
    "id": 140
  },
  {
    "word": "black",
    "phonetic": "/blæk/",
    "meaning": "黑色 a. 黑色的",
    "example": null,
    "category": "n.",
    "id": 141
  },
  {
    "word": "blackboard",
    "phonetic": "/ˈblækbɔːd/",
    "meaning": "黑板",
    "example": null,
    "category": "n.",
    "id": 142
  },
  {
    "word": "blank",
    "phonetic": "/blæŋk/",
    "meaning": "n.& a. 空格，空白（处）；空的；茫然无表情的",
    "example": null,
    "category": "",
    "id": 143
  },
  {
    "word": "blind",
    "phonetic": "/blaɪnd/",
    "meaning": "瞎的",
    "example": null,
    "category": "a.",
    "id": 144
  },
  {
    "word": "blouse",
    "phonetic": "/blaʊz; U.S. blaʊs/",
    "meaning": "宽罩衫；（妇女、儿童穿的）短上衣",
    "example": null,
    "category": "n.",
    "id": 145
  },
  {
    "word": "blow",
    "phonetic": "/bləʊ/",
    "meaning": "吹；刮风；吹气 n. 击；打击",
    "example": null,
    "category": "v.",
    "id": 146
  },
  {
    "word": "blue",
    "phonetic": "/bluː/",
    "meaning": "蓝色 a. 蓝色的 a. 悲伤的；沮丧的",
    "example": null,
    "category": "n.",
    "id": 147
  },
  {
    "word": "board",
    "phonetic": "/bɔːd/",
    "meaning": "木板；布告牌;（政府的）部 v. 上（船、火车、飞机）",
    "example": null,
    "category": "n.",
    "id": 148
  },
  {
    "word": "boat",
    "phonetic": "/bəʊt/",
    "meaning": "小船，小舟",
    "example": null,
    "category": "n.",
    "id": 149
  },
  {
    "word": "boating",
    "phonetic": "/ˈbəʊtɪŋ/",
    "meaning": "划船（游玩），泛舟",
    "example": null,
    "category": "n.",
    "id": 150
  },
  {
    "word": "book",
    "phonetic": "/bʊk/",
    "meaning": "书；本子 v. 预定，定（房间、车票等）",
    "example": null,
    "category": "n.",
    "id": 151
  },
  {
    "word": "bookmark",
    "phonetic": "/ˈbʊkmɑːk/",
    "meaning": "书签",
    "example": null,
    "category": "n.",
    "id": 152
  },
  {
    "word": "bookshop",
    "phonetic": "/ˈbʊkʃɔp/",
    "meaning": "n.书店",
    "example": null,
    "category": "",
    "id": 153
  },
  {
    "word": "bookstore",
    "phonetic": "/ˈbʊkstɔː(r)/",
    "meaning": "书店",
    "example": null,
    "category": "n.",
    "id": 154
  },
  {
    "word": "boom",
    "phonetic": "/buːm/",
    "meaning": "/ v. 繁荣，轰鸣，激增",
    "example": null,
    "category": "n.",
    "id": 155
  },
  {
    "word": "boot",
    "phonetic": "/buːt/",
    "meaning": "长筒靴；靴",
    "example": null,
    "category": "n.",
    "id": 156
  },
  {
    "word": "born",
    "phonetic": "/bɔːn/",
    "meaning": "出生的",
    "example": null,
    "category": "a.",
    "id": 157
  },
  {
    "word": "borrow",
    "phonetic": "/ˈbɔrəʊ/",
    "meaning": "v.（向别人）借用；借",
    "example": null,
    "category": "",
    "id": 158
  },
  {
    "word": "both",
    "phonetic": "/bəʊθ/",
    "meaning": "两；双 pron. 两者；双方",
    "example": null,
    "category": "a.",
    "id": 159
  },
  {
    "word": "bottle",
    "phonetic": "/ˈbɔt(ə)l/",
    "meaning": "瓶子",
    "example": null,
    "category": "n.",
    "id": 160
  },
  {
    "word": "bottom",
    "phonetic": "/ˈbɔtəm/",
    "meaning": "底部；底",
    "example": null,
    "category": "n.",
    "id": 161
  },
  {
    "word": "bowl",
    "phonetic": "/bəʊl/",
    "meaning": "碗",
    "example": null,
    "category": "n.",
    "id": 162
  },
  {
    "word": "box",
    "phonetic": "/bɔks/",
    "meaning": "盒子，箱子",
    "example": null,
    "category": "n.",
    "id": 163
  },
  {
    "word": "boy",
    "phonetic": "/bɔɪ/",
    "meaning": "男孩",
    "example": null,
    "category": "n.",
    "id": 164
  },
  {
    "word": "brain",
    "phonetic": "/breɪn/",
    "meaning": "脑（子）",
    "example": null,
    "category": "n.",
    "id": 165
  },
  {
    "word": "bread",
    "phonetic": "/bred/",
    "meaning": "面包",
    "example": null,
    "category": "n.",
    "id": 166
  },
  {
    "word": "break",
    "phonetic": "/breɪk/",
    "meaning": "间隙,中断,暂停 v. 打破（断，碎）",
    "example": null,
    "category": "n.",
    "id": 167
  },
  {
    "word": "breakfast",
    "phonetic": "/ˈbrekfəst/",
    "meaning": "早餐",
    "example": null,
    "category": "n.",
    "id": 168
  },
  {
    "word": "breathe",
    "phonetic": "/briːð/",
    "meaning": "呼吸",
    "example": null,
    "category": "vi.",
    "id": 169
  },
  {
    "word": "bridge",
    "phonetic": "/brɪdʒ/",
    "meaning": "桥",
    "example": null,
    "category": "n.",
    "id": 170
  },
  {
    "word": "bright",
    "phonetic": "/braɪt/",
    "meaning": "明亮的；聪明的",
    "example": null,
    "category": "a.",
    "id": 171
  },
  {
    "word": "bring",
    "phonetic": "/brɪŋ/",
    "meaning": "拿来，带来，取来",
    "example": null,
    "category": "vt.",
    "id": 172
  },
  {
    "word": "Britain",
    "phonetic": "/ˈbrɪtən/",
    "meaning": "英国；不列颠",
    "example": null,
    "category": "n.",
    "id": 173
  },
  {
    "word": "British",
    "phonetic": "/ˈbrɪtɪʃ/",
    "meaning": "英国的；大不列颠的；英国人的",
    "example": null,
    "category": "a.",
    "id": 174
  },
  {
    "word": "broadcast",
    "phonetic": "/ˈbrɔːdkɑːst/",
    "meaning": "/v. 广播",
    "example": null,
    "category": "n.",
    "id": 175
  },
  {
    "word": "broken",
    "phonetic": "/ˈbrəʊkən/",
    "meaning": "弄坏了的",
    "example": null,
    "category": "a.",
    "id": 176
  },
  {
    "word": "broom",
    "phonetic": "/bruːm/",
    "meaning": "扫帚",
    "example": null,
    "category": "n.",
    "id": 177
  },
  {
    "word": "brother",
    "phonetic": "/ˈbrʌðə(r)/",
    "meaning": "兄；弟",
    "example": null,
    "category": "n.",
    "id": 178
  },
  {
    "word": "brotherhood",
    "phonetic": "/ˈbrʌðəhʊd/",
    "meaning": "兄弟般的关系",
    "example": null,
    "category": "n.",
    "id": 179
  },
  {
    "word": "brown",
    "phonetic": "/braʊn/",
    "meaning": "褐色，棕色 a. 褐色的，棕色的",
    "example": null,
    "category": "n.",
    "id": 180
  },
  {
    "word": "brush",
    "phonetic": "/brʌʃ/",
    "meaning": "刷；擦 n. 刷子",
    "example": null,
    "category": "v.",
    "id": 181
  },
  {
    "word": "build",
    "phonetic": "/bɪld/",
    "meaning": "建筑；造",
    "example": null,
    "category": "v.",
    "id": 182
  },
  {
    "word": "building",
    "phonetic": "/ˈbɪldɪŋ/",
    "meaning": "建筑物；房屋；大楼",
    "example": null,
    "category": "n.",
    "id": 183
  },
  {
    "word": "burn",
    "phonetic": "/bɜːn/",
    "meaning": "燃烧,着火;使烧焦;使晒黑 n. 烧伤;晒伤",
    "example": null,
    "category": "v.",
    "id": 184
  },
  {
    "word": "bury",
    "phonetic": "/ˈberɪ/",
    "meaning": "埋；葬",
    "example": null,
    "category": "vt.",
    "id": 185
  },
  {
    "word": "bus",
    "phonetic": "/bʌs/",
    "meaning": "公共汽车",
    "example": null,
    "category": "n.",
    "id": 186
  },
  {
    "word": "business",
    "phonetic": "/ˈbɪznɪs/",
    "meaning": "n.（本分）工作，职业；职责；生意，交易；事业",
    "example": null,
    "category": "",
    "id": 187
  },
  {
    "word": "businessman",
    "phonetic": "/ˈbɪznɪsmæn/",
    "meaning": "商人（男）；男企业家",
    "example": null,
    "category": "n.",
    "id": 188
  },
  {
    "word": "busy",
    "phonetic": "/ˈbɪzɪ/",
    "meaning": "忙（碌）的",
    "example": null,
    "category": "a.",
    "id": 189
  },
  {
    "word": "but",
    "phonetic": "/bət, bʌt/",
    "meaning": "但是，可是 prep. 除了, 除……外",
    "example": null,
    "category": "conj.",
    "id": 190
  },
  {
    "word": "butter",
    "phonetic": "/ˈbʌtə(r)/",
    "meaning": "黄油，奶油",
    "example": null,
    "category": "n.",
    "id": 191
  },
  {
    "word": "butterfly",
    "phonetic": "/ˈbʌtəflaɪ/",
    "meaning": "蝴蝶",
    "example": null,
    "category": "n.",
    "id": 192
  },
  {
    "word": "button",
    "phonetic": "/ˈbʌt(ə)n/",
    "meaning": "纽扣；（电铃等的）按钮 v. 扣（纽扣） ",
    "example": null,
    "category": "n.",
    "id": 193
  },
  {
    "word": "buy",
    "phonetic": "/baɪ/",
    "meaning": "买",
    "example": null,
    "category": "vt.",
    "id": 194
  },
  {
    "word": "by",
    "phonetic": "/baɪ/",
    "meaning": "在…旁；不迟于；被；用；乘（车）",
    "example": null,
    "category": "prep.",
    "id": 195
  },
  {
    "word": "bye",
    "phonetic": "/ˈbaɪbaɪ/",
    "meaning": "再见",
    "example": null,
    "category": "int.",
    "id": 196
  },
  {
    "word": "cabbage",
    "phonetic": "/ˈkæbɪdʒ/",
    "meaning": "卷心菜，洋白菜",
    "example": null,
    "category": "n.",
    "id": 197
  },
  {
    "word": "cage",
    "phonetic": "/keɪdʒ/",
    "meaning": "笼；鸟笼",
    "example": null,
    "category": "n",
    "id": 198
  },
  {
    "word": "cake",
    "phonetic": "/keɪk/",
    "meaning": "蛋糕，糕点；饼",
    "example": null,
    "category": "n.",
    "id": 199
  },
  {
    "word": "call",
    "phonetic": "/kɔːl/",
    "meaning": "喊，叫；电话，通话 v. 称呼；呼唤；喊，叫",
    "example": null,
    "category": "n.",
    "id": 200
  },
  {
    "word": "camel",
    "phonetic": "/ˈkæm(ə)l/",
    "meaning": "骆驼",
    "example": null,
    "category": "n.",
    "id": 201
  },
  {
    "word": "camera",
    "phonetic": "/ˈkæmərə/",
    "meaning": "照相机；摄像机",
    "example": null,
    "category": "n.",
    "id": 202
  },
  {
    "word": "camp",
    "phonetic": "/kæmp/",
    "meaning": "n.（夏令）营 vi. 野营,宿营",
    "example": null,
    "category": "",
    "id": 203
  },
  {
    "word": "can",
    "phonetic": "/ken, kæn/",
    "meaning": "可能；能够；可以 n.（美）罐头；罐子",
    "example": null,
    "category": "v.",
    "id": 204
  },
  {
    "word": "Canada",
    "phonetic": "/ˈkænədə/",
    "meaning": "加拿大",
    "example": null,
    "category": "n.",
    "id": 205
  },
  {
    "word": "Canadian",
    "phonetic": "/kəˈneɪdɪən/",
    "meaning": "加拿大的；加拿大人的 n. 加拿大人",
    "example": null,
    "category": "a.",
    "id": 206
  },
  {
    "word": "cancer",
    "phonetic": "/ˈkænsə/",
    "meaning": "癌,癌症,弊端,社会恶习",
    "example": null,
    "category": "n.",
    "id": 207
  },
  {
    "word": "candle",
    "phonetic": "/ˈkænd(ə)l/",
    "meaning": "蜡烛",
    "example": null,
    "category": "n.",
    "id": 208
  },
  {
    "word": "candy",
    "phonetic": "/ˈkændɪ/",
    "meaning": "糖果",
    "example": null,
    "category": "n.",
    "id": 209
  },
  {
    "word": "cannon",
    "phonetic": "/kænən/",
    "meaning": "大炮",
    "example": null,
    "category": "n.",
    "id": 210
  },
  {
    "word": "canoe",
    "phonetic": "/kəˈnuː/",
    "meaning": "独木舟 v. 乘独木舟",
    "example": null,
    "category": "n.",
    "id": 211
  },
  {
    "word": "cap",
    "phonetic": "/kæp/",
    "meaning": "帽子；（瓶子的）盖",
    "example": null,
    "category": "n.",
    "id": 212
  },
  {
    "word": "capital",
    "phonetic": "/ˈkæpɪt(ə)l/",
    "meaning": "n.首都,省会,大写；资本",
    "example": null,
    "category": "",
    "id": 213
  },
  {
    "word": "captain",
    "phonetic": "/ˈkæptɪn/",
    "meaning": "n.（海军）上校；船长，舰长；队长",
    "example": null,
    "category": "",
    "id": 214
  },
  {
    "word": "caption",
    "phonetic": "/ˈkæpʃ(ə)n/",
    "meaning": "n.（图片，漫画等的）说明文字",
    "example": null,
    "category": "",
    "id": 215
  },
  {
    "word": "car",
    "phonetic": "/kɑː(r)/",
    "meaning": "汽车，小卧车",
    "example": null,
    "category": "n.",
    "id": 216
  },
  {
    "word": "card",
    "phonetic": "/kɑːd/",
    "meaning": "n.卡片；名片；纸牌",
    "example": null,
    "category": "",
    "id": 217
  },
  {
    "word": "care",
    "phonetic": "/keə(r)/",
    "meaning": "照料，保护；小心 v. 介意…，在乎；关心",
    "example": null,
    "category": "n.",
    "id": 218
  },
  {
    "word": "careful",
    "phonetic": "/ˈkeəfʊl/",
    "meaning": "小心，仔细，谨慎的",
    "example": null,
    "category": "a.",
    "id": 219
  },
  {
    "word": "careless",
    "phonetic": "/ˈkeəlɪs/",
    "meaning": "粗心的，漫不经心的",
    "example": null,
    "category": "a.",
    "id": 220
  },
  {
    "word": "carrot",
    "phonetic": "/ˈkærət/",
    "meaning": "胡萝卜",
    "example": null,
    "category": "n.",
    "id": 221
  },
  {
    "word": "carry",
    "phonetic": "/ˈkærɪ/",
    "meaning": "拿，搬，带，提，抬，背，抱，运等",
    "example": null,
    "category": "vt.",
    "id": 222
  },
  {
    "word": "cat",
    "phonetic": "/kæt/",
    "meaning": "猫",
    "example": null,
    "category": "n.",
    "id": 223
  },
  {
    "word": "cause",
    "phonetic": "/kɔːz/",
    "meaning": "原因，起因 vt. 促使，引起，使发生",
    "example": null,
    "category": "n.",
    "id": 224
  },
  {
    "word": "CD",
    "phonetic": "/ˌsi:'di:/",
    "meaning": "光盘 (compact disk的缩写)",
    "example": null,
    "category": "",
    "id": 225
  },
  {
    "word": "ceiling",
    "phonetic": "/ˈsiːlɪŋ/",
    "meaning": "天花板，顶棚",
    "example": null,
    "category": "n.",
    "id": 226
  },
  {
    "word": "celebrate",
    "phonetic": "/ˈselɪbreɪt/",
    "meaning": "庆祝",
    "example": null,
    "category": "v.",
    "id": 227
  },
  {
    "word": "celebration",
    "phonetic": "/selɪˈbreɪʃ(ə)n/",
    "meaning": "庆祝；庆祝会",
    "example": null,
    "category": "n.",
    "id": 228
  },
  {
    "word": "cent",
    "phonetic": "/sent/",
    "meaning": "美分（100 cents = 1 dollar）",
    "example": null,
    "category": "n.",
    "id": 229
  },
  {
    "word": "centre",
    "phonetic": "/ˈsentə/",
    "meaning": "中心，中央",
    "example": null,
    "category": "n.",
    "id": 230
  },
  {
    "word": "century",
    "phonetic": "/ˈsentʃurɪ/",
    "meaning": "世纪，百年",
    "example": null,
    "category": "n.",
    "id": 231
  },
  {
    "word": "certain",
    "phonetic": "/ˈsɜːt(ə)n/",
    "meaning": "（未指明真实名称的）某…；确定的，无疑的；一定会…",
    "example": null,
    "category": "a.",
    "id": 232
  },
  {
    "word": "certainly",
    "phonetic": "/ˈsɜːtənlɪ/",
    "meaning": "当然；一定，无疑",
    "example": null,
    "category": "ad.",
    "id": 233
  },
  {
    "word": "chair",
    "phonetic": "/tʃeə(r)/",
    "meaning": "椅子",
    "example": null,
    "category": "n.",
    "id": 234
  },
  {
    "word": "chalk",
    "phonetic": "/tʃɔːk/",
    "meaning": "粉笔",
    "example": null,
    "category": "n.",
    "id": 235
  },
  {
    "word": "challenge",
    "phonetic": "/ˈtʃælɪndʒ/",
    "meaning": "n.挑战(性)",
    "example": null,
    "category": "",
    "id": 236
  },
  {
    "word": "chance",
    "phonetic": "/tʃɑːns; (US) tʃæns/",
    "meaning": "机会，可能性",
    "example": null,
    "category": "n.",
    "id": 237
  },
  {
    "word": "change",
    "phonetic": "/tʃeɪndʒ/",
    "meaning": "零钱；找头 v. 改变，变化；更换；兑换",
    "example": null,
    "category": "n.",
    "id": 238
  },
  {
    "word": "channel",
    "phonetic": "/ˈtʃæn(ə)l/",
    "meaning": "n.频道；通道；水渠",
    "example": null,
    "category": "",
    "id": 239
  },
  {
    "word": "chart",
    "phonetic": "/tʃɑːt/",
    "meaning": "图表；航海图",
    "example": null,
    "category": "n.",
    "id": 240
  },
  {
    "word": "cheap",
    "phonetic": "/tʃiːp/",
    "meaning": "便宜的，贱",
    "example": null,
    "category": "a.",
    "id": 241
  },
  {
    "word": "check",
    "phonetic": "/tʃek/",
    "meaning": "检查；批改 vt. 校对，核对；检查；批改",
    "example": null,
    "category": "n.",
    "id": 242
  },
  {
    "word": "cheese",
    "phonetic": "/tʃiːz/",
    "meaning": "奶酪",
    "example": null,
    "category": "n.",
    "id": 243
  },
  {
    "word": "chemistry",
    "phonetic": "/ˈkemistri/",
    "meaning": "化学",
    "example": null,
    "category": "n.",
    "id": 244
  },
  {
    "word": "cheque",
    "phonetic": "/tʃek/",
    "meaning": "(美check) n. 支票",
    "example": null,
    "category": "",
    "id": 245
  },
  {
    "word": "chess",
    "phonetic": "/tʃes/",
    "meaning": "国际象棋,棋",
    "example": null,
    "category": "n.",
    "id": 246
  },
  {
    "word": "chick",
    "phonetic": "/tʃɪk/",
    "meaning": "小鸡",
    "example": null,
    "category": "n.",
    "id": 247
  },
  {
    "word": "chicken",
    "phonetic": "/ˈtʃɪkən/",
    "meaning": "鸡；鸡肉",
    "example": null,
    "category": "n.",
    "id": 248
  },
  {
    "word": "child",
    "phonetic": "/tʃaɪld/",
    "meaning": "孩子，儿童",
    "example": null,
    "category": "n.",
    "id": 249
  },
  {
    "word": "chimney",
    "phonetic": "/ˈtʃɪmnɪ/",
    "meaning": "烟囱，烟筒",
    "example": null,
    "category": "n.",
    "id": 250
  },
  {
    "word": "China",
    "phonetic": "/ˈtʃaɪnə/",
    "meaning": "中国",
    "example": null,
    "category": "n.",
    "id": 251
  },
  {
    "word": "Chinese",
    "phonetic": "/tʃaɪˈniːz/",
    "meaning": "中国的；中国人的；汉语的 n. 中国人；汉语，",
    "example": null,
    "category": "a.",
    "id": 252
  },
  {
    "word": "chocolate",
    "phonetic": "/ˈtʃɔklit/",
    "meaning": "巧克力",
    "example": null,
    "category": "n.",
    "id": 253
  },
  {
    "word": "choose",
    "phonetic": "/tʃuːz/",
    "meaning": "选择",
    "example": null,
    "category": "vt.",
    "id": 254
  },
  {
    "word": "Christmas",
    "phonetic": "/ˈkrɪsməs/",
    "meaning": "圣诞节",
    "example": null,
    "category": "n.",
    "id": 255
  },
  {
    "word": "church",
    "phonetic": "/tʃɜːtʃ/",
    "meaning": "教堂；教会",
    "example": null,
    "category": "n.",
    "id": 256
  },
  {
    "word": "cinema",
    "phonetic": "/ˈsɪnimə/",
    "meaning": "电影院；电影",
    "example": null,
    "category": "n.",
    "id": 257
  },
  {
    "word": "circle",
    "phonetic": "/ˈsɜːk(ə)l/",
    "meaning": "/vt. 圆,环绕",
    "example": null,
    "category": "n.",
    "id": 258
  },
  {
    "word": "city",
    "phonetic": "/ˈsɪtɪ/",
    "meaning": "市，城市，都市",
    "example": null,
    "category": "n.",
    "id": 259
  },
  {
    "word": "class",
    "phonetic": "/klɑːs; (US) klæs/",
    "meaning": "n.（学校的）班；年级；课",
    "example": null,
    "category": "",
    "id": 260
  },
  {
    "word": "classmate",
    "phonetic": "/ˈklɑːsmeɪt/",
    "meaning": "同班同学",
    "example": null,
    "category": "n.",
    "id": 261
  },
  {
    "word": "classroom",
    "phonetic": "/ˈklɑːsruːm/",
    "meaning": "教室",
    "example": null,
    "category": "n.",
    "id": 262
  },
  {
    "word": "clean",
    "phonetic": "/kliːn/",
    "meaning": "弄干净，擦干净 a. 清洁的，干净的",
    "example": null,
    "category": "vt.",
    "id": 263
  },
  {
    "word": "clear",
    "phonetic": "/klɪə(r)/",
    "meaning": "清晰；明亮的；清楚的",
    "example": null,
    "category": "a.",
    "id": 264
  },
  {
    "word": "clearly",
    "phonetic": "/ˈklɪəlɪ/",
    "meaning": "清楚地，无疑地",
    "example": null,
    "category": "ad.",
    "id": 265
  },
  {
    "word": "clever",
    "phonetic": "/ˈklevə(r)/",
    "meaning": "聪明的，伶俐的",
    "example": null,
    "category": "a.",
    "id": 266
  },
  {
    "word": "climb",
    "phonetic": "/klaɪm/",
    "meaning": "爬，攀登",
    "example": null,
    "category": "v.",
    "id": 267
  },
  {
    "word": "clock",
    "phonetic": "/klɔk/",
    "meaning": "钟",
    "example": null,
    "category": "n.",
    "id": 268
  },
  {
    "word": "close",
    "phonetic": "/kləʊz/",
    "meaning": "亲密的；近，靠近 ad. 近，靠近 vt. 关，关闭",
    "example": null,
    "category": "a.",
    "id": 269
  },
  {
    "word": "cloth",
    "phonetic": "/klɔθ; (US) klɔθ/",
    "meaning": "布",
    "example": null,
    "category": "n.",
    "id": 270
  },
  {
    "word": "clothes",
    "phonetic": "/klɔðz; (US) kləʊz/",
    "meaning": "衣服；各种衣物",
    "example": null,
    "category": "n.",
    "id": 271
  },
  {
    "word": "cloud",
    "phonetic": "/ˈklaʊd/",
    "meaning": "云；云状物；阴影",
    "example": null,
    "category": "n.",
    "id": 272
  },
  {
    "word": "cloudy",
    "phonetic": "/ˈklaʊdɪ/",
    "meaning": "多云的，阴天的",
    "example": null,
    "category": "a.",
    "id": 273
  },
  {
    "word": "club",
    "phonetic": "/klʌb/",
    "meaning": "俱乐部；纸牌中的梅花",
    "example": null,
    "category": "n.",
    "id": 274
  },
  {
    "word": "coal",
    "phonetic": "/kəʊl/",
    "meaning": "煤；煤块",
    "example": null,
    "category": "n.",
    "id": 275
  },
  {
    "word": "coat",
    "phonetic": "/kəʊt/",
    "meaning": "外套；涂层；表皮；皮毛",
    "example": null,
    "category": "n.",
    "id": 276
  },
  {
    "word": "cock",
    "phonetic": "/kɔk/",
    "meaning": "公鸡",
    "example": null,
    "category": "n.",
    "id": 277
  },
  {
    "word": "code",
    "phonetic": "/kəʊd/",
    "meaning": "密码,符号,准则",
    "example": null,
    "category": "n.",
    "id": 278
  },
  {
    "word": "cocoa",
    "phonetic": "/ˈkəʊkəʊ/",
    "meaning": "可可粉",
    "example": null,
    "category": "n.",
    "id": 279
  },
  {
    "word": "coffee",
    "phonetic": "/ˈkɔfɪ; (US) ˈkɔːfɪ/",
    "meaning": "咖啡",
    "example": null,
    "category": "n.",
    "id": 280
  },
  {
    "word": "coin",
    "phonetic": "/kɔɪn/",
    "meaning": "硬币",
    "example": null,
    "category": "n.",
    "id": 281
  },
  {
    "word": "coke",
    "phonetic": "/kəʊk/",
    "meaning": "可口可乐",
    "example": null,
    "category": "n.",
    "id": 282
  },
  {
    "word": "cold",
    "phonetic": "/kəʊld/",
    "meaning": "冷的，寒的 n. 寒冷；感冒，伤风",
    "example": null,
    "category": "a.",
    "id": 283
  },
  {
    "word": "collect",
    "phonetic": "/kəˈlekt/",
    "meaning": "收集，搜集",
    "example": null,
    "category": "vt.",
    "id": 284
  },
  {
    "word": "college",
    "phonetic": "/ˈkɔlɪdʒ/",
    "meaning": "学院；专科学校",
    "example": null,
    "category": "n.",
    "id": 285
  },
  {
    "word": "colour",
    "phonetic": "/'kʌlə/",
    "meaning": "颜色 vt. 给…着色，涂色",
    "example": null,
    "category": "n.",
    "id": 286
  },
  {
    "word": "come",
    "phonetic": "/kʌm/",
    "meaning": "来，来到",
    "example": null,
    "category": "vi.",
    "id": 287
  },
  {
    "word": "comfort",
    "phonetic": "/ˈkʌmfət/",
    "meaning": "安慰；慰问",
    "example": null,
    "category": "n.",
    "id": 288
  },
  {
    "word": "comfortable",
    "phonetic": "/ˈkʌmfətəb(ə)l; (US) ˈkʌmfərtəbl/",
    "meaning": "舒服的；安逸的；舒服自在的",
    "example": null,
    "category": "a.",
    "id": 289
  },
  {
    "word": "common",
    "phonetic": "/ˈkɔmən/",
    "meaning": "普通，一般；共有的",
    "example": null,
    "category": "a.",
    "id": 290
  },
  {
    "word": "company",
    "phonetic": "/ˈkʌmpənɪ/",
    "meaning": "公司",
    "example": null,
    "category": "n.",
    "id": 291
  },
  {
    "word": "competition",
    "phonetic": "/kɔmpəˈtɪʃ(ə)n/",
    "meaning": "比赛，竞赛",
    "example": null,
    "category": "n.",
    "id": 292
  },
  {
    "word": "complain",
    "phonetic": "/kəmˈplein/",
    "meaning": "抱怨,投诉",
    "example": null,
    "category": "v.",
    "id": 293
  },
  {
    "word": "composition",
    "phonetic": "/kɔmpəːziʃ(ə)n/",
    "meaning": "作文；作曲",
    "example": null,
    "category": "n.",
    "id": 294
  },
  {
    "word": "computer",
    "phonetic": "/kəmˈpjuːtə(r)/",
    "meaning": "电子计算机",
    "example": null,
    "category": "n.",
    "id": 295
  },
  {
    "word": "computer",
    "phonetic": "/kəmˈpjuːtə(r) ɡeim/",
    "meaning": "电子游戏",
    "example": null,
    "category": "",
    "id": 296
  },
  {
    "word": "comrade",
    "phonetic": "/ˈkɔmrid; (US) ˈkɑmræd/",
    "meaning": "同志",
    "example": null,
    "category": "n.",
    "id": 297
  },
  {
    "word": "concert",
    "phonetic": "/ˈkɔnsət/",
    "meaning": "音乐会；演奏会",
    "example": null,
    "category": "n.",
    "id": 298
  },
  {
    "word": "conductor",
    "phonetic": "/kənˈdʌktə(r)/",
    "meaning": "指导者;（车上的）售票员，列车员;乐队指挥",
    "example": null,
    "category": "n.",
    "id": 299
  },
  {
    "word": "confident",
    "phonetic": "/ˈkɔnfɪdənt/",
    "meaning": "自信的",
    "example": null,
    "category": "a.",
    "id": 300
  },
  {
    "word": "congratulate",
    "phonetic": "/kənˈɡrætjʊleɪt/",
    "meaning": "祝贺",
    "example": null,
    "category": "vt.",
    "id": 301
  },
  {
    "word": "congratulation",
    "phonetic": "/kənɡrætjʊˈleɪʃ(ə)n/",
    "meaning": "祝贺，庆贺",
    "example": null,
    "category": "n.",
    "id": 302
  },
  {
    "word": "connect",
    "phonetic": "/kəˈnekt/",
    "meaning": "连接，把…联系起来",
    "example": null,
    "category": "v.",
    "id": 303
  },
  {
    "word": "continue",
    "phonetic": "/kənˈtɪnjuː/",
    "meaning": "继续",
    "example": null,
    "category": "vi.",
    "id": 304
  },
  {
    "word": "conversation",
    "phonetic": "/kɔnvəˈseɪʃ(ə)n/",
    "meaning": "谈话，交谈",
    "example": null,
    "category": "n.",
    "id": 305
  },
  {
    "word": "cook",
    "phonetic": "/kʊk/",
    "meaning": "炊事员,厨师 v. 烹调,做饭",
    "example": null,
    "category": "n.",
    "id": 306
  },
  {
    "word": "cookie",
    "phonetic": "/ˈkʊkɪ/",
    "meaning": "小甜饼",
    "example": null,
    "category": "n.",
    "id": 307
  },
  {
    "word": "cool",
    "phonetic": "/kuːl/",
    "meaning": "凉的，凉爽的；酷",
    "example": null,
    "category": "a.",
    "id": 308
  },
  {
    "word": "copy",
    "phonetic": "/ˈkɔpɪ/",
    "meaning": "抄本，副本；一本（份，册…） v. 抄写,复印,拷贝",
    "example": null,
    "category": "n.",
    "id": 309
  },
  {
    "word": "corn",
    "phonetic": "/kɔːn/",
    "meaning": "玉米，谷物",
    "example": null,
    "category": "n.",
    "id": 310
  },
  {
    "word": "corner",
    "phonetic": "/ˈkɔːnə(r)/",
    "meaning": "角；角落；拐角",
    "example": null,
    "category": "n.",
    "id": 311
  },
  {
    "word": "correct",
    "phonetic": "/kəˈrekt/",
    "meaning": "改正；纠正 a. 正确的，对的；恰当的",
    "example": null,
    "category": "v.",
    "id": 312
  },
  {
    "word": "cost",
    "phonetic": "/kɔst; (US) kɔːst/",
    "meaning": "v.值（钱），花费 n. 价格",
    "example": null,
    "category": "",
    "id": 313
  },
  {
    "word": "cotton",
    "phonetic": "/ˈkɔt(ə)n/",
    "meaning": "棉花 a. 棉花的",
    "example": null,
    "category": "n.",
    "id": 314
  },
  {
    "word": "cough",
    "phonetic": "/kɔf; (US) kɔːf/",
    "meaning": "n.& vi. 咳嗽",
    "example": null,
    "category": "",
    "id": 315
  },
  {
    "word": "could",
    "phonetic": "/kʊdˈ/",
    "meaning": "v.（can的过去式）可以…；（表示许可或请求）可以…，行",
    "example": null,
    "category": "",
    "id": 316
  },
  {
    "word": "count",
    "phonetic": "/kaʊnt/",
    "meaning": "数，点数",
    "example": null,
    "category": "vt.",
    "id": 317
  },
  {
    "word": "country",
    "phonetic": "/ˈkʌntrɪ/",
    "meaning": "国家；农村，乡下",
    "example": null,
    "category": "n.",
    "id": 318
  },
  {
    "word": "countryside",
    "phonetic": "/ˈkʌntrɪsaɪd/",
    "meaning": "乡下，农村",
    "example": null,
    "category": "n.",
    "id": 319
  },
  {
    "word": "couple",
    "phonetic": "/ˈkʌp(ə)l/",
    "meaning": "夫妇，一对",
    "example": null,
    "category": "n.",
    "id": 320
  },
  {
    "word": "course",
    "phonetic": "/kɔːs/",
    "meaning": "过程；经过；课程",
    "example": null,
    "category": "n.",
    "id": 321
  },
  {
    "word": "cousin",
    "phonetic": "/ˈkʌz(ə)n/",
    "meaning": "堂（表）兄弟，堂（表）姐妹",
    "example": null,
    "category": "n.",
    "id": 322
  },
  {
    "word": "cover",
    "phonetic": "/ˈkʌvə(r)/",
    "meaning": "盖子；罩 v. 覆盖，遮盖；掩盖",
    "example": null,
    "category": "n.",
    "id": 323
  },
  {
    "word": "cow",
    "phonetic": "/kaʊ/",
    "meaning": "母牛，奶牛",
    "example": null,
    "category": "n.",
    "id": 324
  },
  {
    "word": "crash",
    "phonetic": "/kræʃ/",
    "meaning": "/ n. 碰撞，撞击",
    "example": null,
    "category": "v.",
    "id": 325
  },
  {
    "word": "cream",
    "phonetic": "/kriːm/",
    "meaning": "奶油，乳脂",
    "example": null,
    "category": "n.",
    "id": 326
  },
  {
    "word": "crop",
    "phonetic": "/krɔp/",
    "meaning": "庄稼；收成",
    "example": null,
    "category": "n.",
    "id": 327
  },
  {
    "word": "cross",
    "phonetic": "/krɔs/",
    "meaning": "脾气不好的，易怒的 n. 十字形的东西 vt. 越过；穿过",
    "example": null,
    "category": "a.",
    "id": 328
  },
  {
    "word": "crossing",
    "phonetic": "/ˈkrɔsɪŋ/",
    "meaning": "十字路口，人行横道",
    "example": null,
    "category": "n.",
    "id": 329
  },
  {
    "word": "crowd",
    "phonetic": "/kraʊd/",
    "meaning": "人群 vt. 拥挤，群聚",
    "example": null,
    "category": "n.",
    "id": 330
  },
  {
    "word": "cry",
    "phonetic": "/kraɪ/",
    "meaning": "叫喊；哭声 v. 喊叫；哭",
    "example": null,
    "category": "n.",
    "id": 331
  },
  {
    "word": "culture",
    "phonetic": "/ˈkʌltʃə(r)/",
    "meaning": "文化",
    "example": null,
    "category": "n.",
    "id": 332
  },
  {
    "word": "cup",
    "phonetic": "/kʌp/",
    "meaning": "茶杯",
    "example": null,
    "category": "n.",
    "id": 333
  },
  {
    "word": "cupboard",
    "phonetic": "/ˈkʌbəd/",
    "meaning": "碗柜；橱柜",
    "example": null,
    "category": "n.",
    "id": 334
  },
  {
    "word": "curtain",
    "phonetic": "/ˈkɜːt(ə)n/",
    "meaning": "窗帘",
    "example": null,
    "category": "n.",
    "id": 335
  },
  {
    "word": "cushion",
    "phonetic": "/ˈkʊʃ(ə)n/",
    "meaning": "垫子",
    "example": null,
    "category": "n.",
    "id": 336
  },
  {
    "word": "customer",
    "phonetic": "/ˈkʌstəmə(r)/",
    "meaning": "n.（商店）顾客，主顾",
    "example": null,
    "category": "",
    "id": 337
  },
  {
    "word": "cut",
    "phonetic": "/kʌt/",
    "meaning": "切，剪，削，割",
    "example": null,
    "category": "v.",
    "id": 338
  },
  {
    "word": "dad",
    "phonetic": "/dæd/",
    "meaning": "n.（口）爸爸，爹爹",
    "example": null,
    "category": "",
    "id": 339
  },
  {
    "word": "daily",
    "phonetic": "/ˈdeɪlɪ/",
    "meaning": "每日的；日常的 ad. 每天 n. 日报",
    "example": null,
    "category": "a.",
    "id": 340
  },
  {
    "word": "dance",
    "phonetic": "/dɑːns; (US) dæns/",
    "meaning": "n.& vi. 跳舞",
    "example": null,
    "category": "",
    "id": 341
  },
  {
    "word": "dangerous",
    "phonetic": "/ˈdeɪndʒərəs/",
    "meaning": "危险的",
    "example": null,
    "category": "a.",
    "id": 342
  },
  {
    "word": "dare",
    "phonetic": "/deə(r)/",
    "meaning": "v.& aux. 敢，敢于",
    "example": null,
    "category": "",
    "id": 343
  },
  {
    "word": "dark",
    "phonetic": "/dɑːk/",
    "meaning": "黑暗；暗处；日暮 a. 黑暗的；暗淡的；深色的",
    "example": null,
    "category": "n.",
    "id": 344
  },
  {
    "word": "date",
    "phonetic": "/deɪt/",
    "meaning": "日期；约会 n.枣",
    "example": null,
    "category": "n.",
    "id": 345
  },
  {
    "word": "daughter",
    "phonetic": "/ˈdɔːtə(r)/",
    "meaning": "女儿",
    "example": null,
    "category": "n.",
    "id": 346
  },
  {
    "word": "day",
    "phonetic": "/deɪ/",
    "meaning": "n.（一）天，（一）日；白天",
    "example": null,
    "category": "",
    "id": 347
  },
  {
    "word": "daytime",
    "phonetic": "/ˈdeɪtaɪm/",
    "meaning": "白天，白昼",
    "example": null,
    "category": "n.",
    "id": 348
  },
  {
    "word": "dead",
    "phonetic": "/ded/",
    "meaning": "死的；无生命的",
    "example": null,
    "category": "a.",
    "id": 349
  },
  {
    "word": "deaf",
    "phonetic": "/def/",
    "meaning": "聋的",
    "example": null,
    "category": "a.",
    "id": 350
  },
  {
    "word": "deal",
    "phonetic": "/diːl/",
    "meaning": "量，数额；交易",
    "example": null,
    "category": "n.",
    "id": 351
  },
  {
    "word": "dear",
    "phonetic": "/dɪə(r)/",
    "meaning": "int.（表示惊愕）哎呀！唷！a. 亲爱的；贵的",
    "example": null,
    "category": "",
    "id": 352
  },
  {
    "word": "death",
    "phonetic": "/deθ/",
    "meaning": "死",
    "example": null,
    "category": "n.",
    "id": 353
  },
  {
    "word": "December",
    "phonetic": "/dɪˈsembə(r)/",
    "meaning": "12月",
    "example": null,
    "category": "n.",
    "id": 354
  },
  {
    "word": "decide",
    "phonetic": "/dɪˈsaɪd/",
    "meaning": "决定；下决心",
    "example": null,
    "category": "v.",
    "id": 355
  },
  {
    "word": "decision",
    "phonetic": "/dɪˈsɪʒ(ə)n/",
    "meaning": "决定；决心",
    "example": null,
    "category": "n.",
    "id": 356
  },
  {
    "word": "decorate",
    "phonetic": "/ˈdekəreɪt/",
    "meaning": "装饰，修饰",
    "example": null,
    "category": "vt.",
    "id": 357
  },
  {
    "word": "deep",
    "phonetic": "/diːp/",
    "meaning": "深 ad. 深；深厚",
    "example": null,
    "category": "a.",
    "id": 358
  },
  {
    "word": "deeply",
    "phonetic": "/ˈdiːplɪ/",
    "meaning": "深深地",
    "example": null,
    "category": "ad.",
    "id": 359
  },
  {
    "word": "deer",
    "phonetic": "/dɪə(r)/",
    "meaning": "鹿",
    "example": null,
    "category": "n.",
    "id": 360
  },
  {
    "word": "delicious",
    "phonetic": "/dɪˈlɪʃəs/",
    "meaning": "美味的，可口的",
    "example": null,
    "category": "a.",
    "id": 361
  },
  {
    "word": "delight",
    "phonetic": "/dɪˈlaɪt/",
    "meaning": "快乐；乐事",
    "example": null,
    "category": "n.",
    "id": 362
  },
  {
    "word": "demand",
    "phonetic": "/dɪˈmɑːnd; (US) dɪˈmænd/",
    "meaning": "要求",
    "example": null,
    "category": "vt.",
    "id": 363
  },
  {
    "word": "depend",
    "phonetic": "/dɪˈpend/",
    "meaning": "依靠，依赖，指望；取决于",
    "example": null,
    "category": "vi.",
    "id": 364
  },
  {
    "word": "describe",
    "phonetic": "/dɪˈskraɪb/",
    "meaning": "描写，叙述",
    "example": null,
    "category": "vt.",
    "id": 365
  },
  {
    "word": "description",
    "phonetic": "/dɪˈskrɪpʃ(ə)n/",
    "meaning": "描述，描写",
    "example": null,
    "category": "n.",
    "id": 366
  },
  {
    "word": "desert",
    "phonetic": "/dɪˈzɜːt/",
    "meaning": "沙漠 vt. 舍弃；遗弃",
    "example": null,
    "category": "n.",
    "id": 367
  },
  {
    "word": "deserve",
    "phonetic": "/dɪˈzɜːv/",
    "meaning": "v.（不用于进行时态）应得，应受",
    "example": null,
    "category": "",
    "id": 368
  },
  {
    "word": "desk",
    "phonetic": "/desk/",
    "meaning": "书桌，写字台",
    "example": null,
    "category": "n.",
    "id": 369
  },
  {
    "word": "destroy",
    "phonetic": "/dɪˈstrɔɪ/",
    "meaning": "破坏，毁坏",
    "example": null,
    "category": "vt.",
    "id": 370
  },
  {
    "word": "detective",
    "phonetic": "/dɪˈtektɪv/",
    "meaning": "侦探",
    "example": null,
    "category": "n.",
    "id": 371
  },
  {
    "word": "develop",
    "phonetic": "/dɪˈveləp/",
    "meaning": "v.（使）发展；开发 vt. 冲洗（照片）",
    "example": null,
    "category": "",
    "id": 372
  },
  {
    "word": "diagram",
    "phonetic": "/ˈdaɪəɡræm/",
    "meaning": "图表，图样",
    "example": null,
    "category": "n.",
    "id": 373
  },
  {
    "word": "dial",
    "phonetic": "/ˈdaɪ(ə)l/",
    "meaning": "拨（电话号码）",
    "example": null,
    "category": "vt.",
    "id": 374
  },
  {
    "word": "dialogue",
    "phonetic": "/ˈdaɪəlɔɡ; (US) ˈdaɪəlɔːɡ/",
    "meaning": "对话",
    "example": null,
    "category": "n.",
    "id": 375
  },
  {
    "word": "diary",
    "phonetic": "/ˈdaɪərɪ/",
    "meaning": "日记；日记簿",
    "example": null,
    "category": "n.",
    "id": 376
  },
  {
    "word": "dictation",
    "phonetic": "/dɪkˈteɪʃ(ə)n/",
    "meaning": "听写",
    "example": null,
    "category": "n.",
    "id": 377
  },
  {
    "word": "dictionary",
    "phonetic": "/ˈdɪkʃənərɪ; (US) ˈdɪkʃənerɪ/",
    "meaning": "词典，字典",
    "example": null,
    "category": "n.",
    "id": 378
  },
  {
    "word": "die",
    "phonetic": "/daɪ/",
    "meaning": "死",
    "example": null,
    "category": "v.",
    "id": 379
  },
  {
    "word": "difference",
    "phonetic": "/ˈdɪfərəns/",
    "meaning": "不同",
    "example": null,
    "category": "n.",
    "id": 380
  },
  {
    "word": "different",
    "phonetic": "/ˈdɪfərənt/",
    "meaning": "不同的，有差异的",
    "example": null,
    "category": "a.",
    "id": 381
  },
  {
    "word": "difficult",
    "phonetic": "/ˈdɪfɪkəlt/",
    "meaning": "难；艰难；不易相处的",
    "example": null,
    "category": "a.",
    "id": 382
  },
  {
    "word": "difficulty",
    "phonetic": "/ˈdɪfɪkəltɪ/",
    "meaning": "困难，费力",
    "example": null,
    "category": "n.",
    "id": 383
  },
  {
    "word": "dig",
    "phonetic": "/dɪɡ/",
    "meaning": "挖（洞沟）,掘",
    "example": null,
    "category": "v.",
    "id": 384
  },
  {
    "word": "digital",
    "phonetic": "/ˈdɪdʒɪt(ə)l/",
    "meaning": ".数字的，数码的",
    "example": null,
    "category": "a.",
    "id": 385
  },
  {
    "word": "dim",
    "phonetic": "/dɪm/",
    "meaning": "昏暗的,暗淡的",
    "example": null,
    "category": "a.",
    "id": 386
  },
  {
    "word": "dinner",
    "phonetic": "/ˈdɪnə(r)/",
    "meaning": "正餐，宴会",
    "example": null,
    "category": "n.",
    "id": 387
  },
  {
    "word": "dip",
    "phonetic": "/dɪp/",
    "meaning": "浸，蘸；把…放入又取出",
    "example": null,
    "category": "vt.",
    "id": 388
  },
  {
    "word": "direct",
    "phonetic": "/dɪˈrekt, daɪˈrekt/",
    "meaning": "直接的；直截了当的 vt. 指挥；指导；导演（电影）",
    "example": null,
    "category": "a.",
    "id": 389
  },
  {
    "word": "direction",
    "phonetic": "/dɪˈrekʃ(ə)n, daɪˈrekʃ(ə)n/",
    "meaning": "方向；方位",
    "example": null,
    "category": "n.",
    "id": 390
  },
  {
    "word": "director",
    "phonetic": "/dɪˈrektə(r)/",
    "meaning": "所长，处长，主任；董事；导演",
    "example": null,
    "category": "n.",
    "id": 391
  },
  {
    "word": "directory",
    "phonetic": "/dɪˈrektərɪ/",
    "meaning": "姓名地址录",
    "example": null,
    "category": "n.",
    "id": 392
  },
  {
    "word": "dirt",
    "phonetic": "/dɜːt/",
    "meaning": "污物；脏物",
    "example": null,
    "category": "n.",
    "id": 393
  },
  {
    "word": "dirty",
    "phonetic": "/ˈdɜːtɪ/",
    "meaning": "脏的",
    "example": null,
    "category": "a.",
    "id": 394
  },
  {
    "word": "disappear",
    "phonetic": "/dɪsəˈpɪə(r)/",
    "meaning": "消失",
    "example": null,
    "category": "vi.",
    "id": 395
  },
  {
    "word": "discover",
    "phonetic": "/dɪˈskʌvə(r)/",
    "meaning": "发现",
    "example": null,
    "category": "vt.",
    "id": 396
  },
  {
    "word": "discovery",
    "phonetic": "/dɪˈskʌvərɪ/",
    "meaning": "发现",
    "example": null,
    "category": "n.",
    "id": 397
  },
  {
    "word": "discuss",
    "phonetic": "/dɪsˈkʌs/",
    "meaning": "讨论，议论",
    "example": null,
    "category": "vt.",
    "id": 398
  },
  {
    "word": "discussion",
    "phonetic": "/dɪsˈkʌʃ(ə)n/",
    "meaning": "讨论，辩论",
    "example": null,
    "category": "n.",
    "id": 399
  },
  {
    "word": "disease",
    "phonetic": "/dɪˈziːz/",
    "meaning": "病，疾病",
    "example": null,
    "category": "n.",
    "id": 400
  },
  {
    "word": "dish",
    "phonetic": "/dɪʃ/",
    "meaning": "盘，碟；盘装菜；盘形物",
    "example": null,
    "category": "n.",
    "id": 401
  },
  {
    "word": "display",
    "phonetic": "/dɪsˈplei/",
    "meaning": "陈列,展览;显露,表现  n. 陈列,展览;展览品,展览品",
    "example": null,
    "category": "vt.",
    "id": 402
  },
  {
    "word": "disturb",
    "phonetic": "/dɪˈstɜːb/",
    "meaning": "扰乱；打扰",
    "example": null,
    "category": "vt.",
    "id": 403
  },
  {
    "word": "dive",
    "phonetic": "/daɪv/",
    "meaning": "跳水",
    "example": null,
    "category": "vi.",
    "id": 404
  },
  {
    "word": "divide",
    "phonetic": "/dɪˈvaɪd/",
    "meaning": "分，划分",
    "example": null,
    "category": "vt.",
    "id": 405
  },
  {
    "word": "do",
    "phonetic": "/dʊ, duː/",
    "meaning": "& aux. 做，干",
    "example": null,
    "category": "v.",
    "id": 406
  },
  {
    "word": "doctor",
    "phonetic": "/ˈdɔktə(r)/",
    "meaning": "医生，大夫；博士",
    "example": null,
    "category": "n.",
    "id": 407
  },
  {
    "word": "dog",
    "phonetic": "/dɔɡ; (US) dɔːɡ/",
    "meaning": "狗",
    "example": null,
    "category": "n.",
    "id": 408
  },
  {
    "word": "doll",
    "phonetic": "/dɔl; (US) dɔːl/",
    "meaning": "玩偶，玩具娃娃",
    "example": null,
    "category": "n.",
    "id": 409
  },
  {
    "word": "dollar",
    "phonetic": "/dɔlə/",
    "meaning": "元（美国、加拿大、澳大利亚等国货币单位）",
    "example": null,
    "category": "n.",
    "id": 410
  },
  {
    "word": "door",
    "phonetic": "/dɔː(r)/",
    "meaning": "门",
    "example": null,
    "category": "n.",
    "id": 411
  },
  {
    "word": "double",
    "phonetic": "/ˈdʌb(ə)l/",
    "meaning": "两倍.双的 n. 两个.双",
    "example": null,
    "category": "a.",
    "id": 412
  },
  {
    "word": "down",
    "phonetic": "/daʊn/",
    "meaning": "沿着，沿…而下 ad. 向下",
    "example": null,
    "category": "prep.",
    "id": 413
  },
  {
    "word": "download",
    "phonetic": "/'daunləud/",
    "meaning": "n.& v. 下载",
    "example": null,
    "category": "",
    "id": 414
  },
  {
    "word": "downstairs",
    "phonetic": "/ˈdaʊnsteəz/",
    "meaning": "在楼下；到楼下",
    "example": null,
    "category": "ad.",
    "id": 415
  },
  {
    "word": "downtown",
    "phonetic": "/ˈdaʊntaʊn/",
    "meaning": "城市的商业区，中心区，闹市区 a. 商业区的,闹市区的",
    "example": null,
    "category": "n.",
    "id": 416
  },
  {
    "word": "dozen",
    "phonetic": "/ˈdʌzn/",
    "meaning": "十二个；几十，许多",
    "example": null,
    "category": "n.",
    "id": 417
  },
  {
    "word": "drag",
    "phonetic": "/dræɡ/",
    "meaning": "拖；拽",
    "example": null,
    "category": "v.",
    "id": 418
  },
  {
    "word": "dragon",
    "phonetic": "/ˈdræɡən/",
    "meaning": "n.龙",
    "example": null,
    "category": "",
    "id": 419
  },
  {
    "word": "draw",
    "phonetic": "/drɔː/",
    "meaning": "绘画；绘制；拉，拖；提取（金钱）",
    "example": null,
    "category": "v.",
    "id": 420
  },
  {
    "word": "drawer",
    "phonetic": "/drɔ:ə/",
    "meaning": "抽屉",
    "example": null,
    "category": "n.",
    "id": 421
  },
  {
    "word": "drawing",
    "phonetic": "/ˈdrɔːɪŋ/",
    "meaning": "图画，素描,绘画",
    "example": null,
    "category": "n.",
    "id": 422
  },
  {
    "word": "dream",
    "phonetic": "/driːm/",
    "meaning": "n.& vt. 梦，梦想",
    "example": null,
    "category": "",
    "id": 423
  },
  {
    "word": "dress",
    "phonetic": "/dres/",
    "meaning": "女服，连衣裙；(统指)服装；童装 v. 穿衣",
    "example": null,
    "category": "n.",
    "id": 424
  },
  {
    "word": "drink",
    "phonetic": "/drɪŋk/",
    "meaning": "饮料；喝酒 ",
    "example": null,
    "category": "n.",
    "id": 425
  },
  {
    "word": "drop",
    "phonetic": "/drɔp/",
    "meaning": "n.滴 v.掉下,落下,投递,放弃",
    "example": null,
    "category": "",
    "id": 426
  },
  {
    "word": "drought",
    "phonetic": "/draut/",
    "meaning": "干旱",
    "example": null,
    "category": "n.",
    "id": 427
  },
  {
    "word": "drunk",
    "phonetic": "/drʌŋk/",
    "meaning": "醉的",
    "example": null,
    "category": "a.",
    "id": 428
  },
  {
    "word": "dry",
    "phonetic": "/draɪ/",
    "meaning": "使…干；弄干；擦干 a. 干的；干燥的",
    "example": null,
    "category": "v.",
    "id": 429
  },
  {
    "word": "duck",
    "phonetic": "/dʌk/",
    "meaning": "鸭子",
    "example": null,
    "category": "n.",
    "id": 430
  },
  {
    "word": "dumpling",
    "phonetic": "/ˈdʌmplɪŋ/",
    "meaning": "饺子",
    "example": null,
    "category": "n.",
    "id": 431
  },
  {
    "word": "during",
    "phonetic": "/ˈdjuərɪŋ; (US) ˈdɪərɪŋ/",
    "meaning": "在…期间；在…过程中",
    "example": null,
    "category": "prep.",
    "id": 432
  },
  {
    "word": "dusk",
    "phonetic": "/dʌsk/",
    "meaning": "黄昏",
    "example": null,
    "category": "n.",
    "id": 433
  },
  {
    "word": "dust",
    "phonetic": "/dʌst/",
    "meaning": "灰尘，尘土",
    "example": null,
    "category": "n.",
    "id": 434
  },
  {
    "word": "dustbin",
    "phonetic": "/ˈdʌstbɪn/",
    "meaning": "垃圾箱",
    "example": null,
    "category": "n.",
    "id": 435
  },
  {
    "word": "duty",
    "phonetic": "/ˈdjuːtɪ/",
    "meaning": "责任，义务",
    "example": null,
    "category": "n.",
    "id": 436
  },
  {
    "word": "each",
    "phonetic": "/iːtʃ/",
    "meaning": "a.& pron. 每人,每个,每件",
    "example": null,
    "category": "",
    "id": 437
  },
  {
    "word": "ear",
    "phonetic": "/ɪə(r)/",
    "meaning": "n.耳朵.耳状物；听力，听觉",
    "example": null,
    "category": "",
    "id": 438
  },
  {
    "word": "early",
    "phonetic": "/ɜːlɪ/",
    "meaning": "早的 ad. 早地",
    "example": null,
    "category": "a.",
    "id": 439
  },
  {
    "word": "earth",
    "phonetic": "/ɜːθ/",
    "meaning": "地球；土，泥；大地",
    "example": null,
    "category": "n.",
    "id": 440
  },
  {
    "word": "earthquake",
    "phonetic": "/ˈɜːθkweɪk/",
    "meaning": "地震",
    "example": null,
    "category": "n.",
    "id": 441
  },
  {
    "word": "east",
    "phonetic": "/iːst/",
    "meaning": "东方；东部的；ad. 在东方；向东方； n. 东，东方；",
    "example": null,
    "category": "a.",
    "id": 442
  },
  {
    "word": "easy",
    "phonetic": "/ˈiːzɪ/",
    "meaning": "容易的，不费力的",
    "example": null,
    "category": "a.",
    "id": 443
  },
  {
    "word": "eat",
    "phonetic": "/iːt/",
    "meaning": "吃",
    "example": null,
    "category": "v.",
    "id": 444
  },
  {
    "word": "edge",
    "phonetic": "/edʒ/",
    "meaning": "边缘",
    "example": null,
    "category": "n.",
    "id": 445
  },
  {
    "word": "education",
    "phonetic": "/edjʊːkeɪʃ (ə)n/",
    "meaning": "教育，培养",
    "example": null,
    "category": "n.",
    "id": 446
  },
  {
    "word": "egg",
    "phonetic": "/eɡ/",
    "meaning": "蛋；卵",
    "example": null,
    "category": "n.",
    "id": 447
  },
  {
    "word": "Egypt",
    "phonetic": "/ˈiːdʒɪpt/",
    "meaning": "埃及",
    "example": null,
    "category": "n.",
    "id": 448
  },
  {
    "word": "Egyptian",
    "phonetic": "/ɪˈdʒɪpʃ(ə)n/",
    "meaning": "埃及的；埃及人的；埃及语的 n. 埃及人",
    "example": null,
    "category": "a.",
    "id": 449
  },
  {
    "word": "eight",
    "phonetic": "/eɪt/",
    "meaning": "八",
    "example": null,
    "category": "num.",
    "id": 450
  },
  {
    "word": "eighteen",
    "phonetic": "/ˈeɪˈtiːn/",
    "meaning": "十八",
    "example": null,
    "category": "num.",
    "id": 451
  },
  {
    "word": "eighth",
    "phonetic": "/eɪθ/",
    "meaning": "第八",
    "example": null,
    "category": "num.",
    "id": 452
  },
  {
    "word": "eighty",
    "phonetic": "/ˈeɪtɪ/",
    "meaning": "八十",
    "example": null,
    "category": "num.",
    "id": 453
  },
  {
    "word": "either",
    "phonetic": "/ˈaɪðə(r)/",
    "meaning": "两方任一方的；二者之一 conj. 二者之一；要么 ad. 也",
    "example": null,
    "category": "a.",
    "id": 454
  },
  {
    "word": "elder",
    "phonetic": "/ˈeldə(r)/",
    "meaning": "长者；前辈",
    "example": null,
    "category": "n.",
    "id": 455
  },
  {
    "word": "electricity",
    "phonetic": "/ɪlekˈtrɪsɪtɪ/",
    "meaning": "电；电流",
    "example": null,
    "category": "n.",
    "id": 456
  },
  {
    "word": "elephant",
    "phonetic": "/ˈelɪfənt/",
    "meaning": "象",
    "example": null,
    "category": "n.",
    "id": 457
  },
  {
    "word": "elevator",
    "phonetic": "/ˈelɪveitə/",
    "meaning": "电梯,升降梯",
    "example": null,
    "category": "n.",
    "id": 458
  },
  {
    "word": "eleven",
    "phonetic": "/ɪˈlev(ə)n/",
    "meaning": "十一",
    "example": null,
    "category": "num.",
    "id": 459
  },
  {
    "word": "else",
    "phonetic": "/els/",
    "meaning": "别的，其他的",
    "example": null,
    "category": "ad.",
    "id": 460
  },
  {
    "word": "empty",
    "phonetic": "/ˈemptɪ/",
    "meaning": "空的",
    "example": null,
    "category": "a.",
    "id": 461
  },
  {
    "word": "encourage",
    "phonetic": "/ɪnˈkʌrɪdʒ/",
    "meaning": "鼓励",
    "example": null,
    "category": "vt.",
    "id": 462
  },
  {
    "word": "end",
    "phonetic": "/end/",
    "meaning": "末尾；终点；结束 v. 结束，终止",
    "example": null,
    "category": "n.",
    "id": 463
  },
  {
    "word": "enemy",
    "phonetic": "/ˈenɪmɪ/",
    "meaning": "敌人；敌军",
    "example": null,
    "category": "n.",
    "id": 464
  },
  {
    "word": "engineer",
    "phonetic": "/endʒɪˈnɪə(r)/",
    "meaning": "工程师；技师",
    "example": null,
    "category": "n.",
    "id": 465
  },
  {
    "word": "England",
    "phonetic": "/ˈɪŋɡlənd/",
    "meaning": "英格兰",
    "example": null,
    "category": "n.",
    "id": 466
  },
  {
    "word": "English",
    "phonetic": "/ˈɪŋɡlɪʃ/",
    "meaning": "英国的，英国人的，英语的 n. 英语",
    "example": null,
    "category": "a.",
    "id": 467
  },
  {
    "word": "enjoy",
    "phonetic": "/ɪnˈdʒɔɪ/",
    "meaning": "欣赏；享受乐趣；喜欢",
    "example": null,
    "category": "vt.",
    "id": 468
  },
  {
    "word": "enjoyable",
    "phonetic": "/ɪnˈdʒɔɪəb(ə)l/",
    "meaning": "愉快的；有趣的",
    "example": null,
    "category": "a.",
    "id": 469
  },
  {
    "word": "enough",
    "phonetic": "/ɪˈnʌf/",
    "meaning": "足够；充足 a. 足够；充分的 ad. 足够地；充分地",
    "example": null,
    "category": "n.",
    "id": 470
  },
  {
    "word": "enter",
    "phonetic": "/ˈentə(r)/",
    "meaning": "进入",
    "example": null,
    "category": "vt.",
    "id": 471
  },
  {
    "word": "entrance",
    "phonetic": "/ˈentrəns/",
    "meaning": "入口;入场;进入的权利;入学许可",
    "example": null,
    "category": "n.",
    "id": 472
  },
  {
    "word": "entry",
    "phonetic": "/ˈentrɪ/",
    "meaning": "进入",
    "example": null,
    "category": "n.",
    "id": 473
  },
  {
    "word": "envelope",
    "phonetic": "/ˈenvələʊp/",
    "meaning": "信封",
    "example": null,
    "category": "n.",
    "id": 474
  },
  {
    "word": "environment",
    "phonetic": "/ɪnˈvaɪərənmənt/",
    "meaning": "n.环境",
    "example": null,
    "category": "",
    "id": 475
  },
  {
    "word": "envy",
    "phonetic": "/ˈenvɪ/",
    "meaning": "vt.& n. 忌妒； 羡慕",
    "example": null,
    "category": "",
    "id": 476
  },
  {
    "word": "equal",
    "phonetic": "/ˈiːkw(ə)l/",
    "meaning": "平等的 vt. 等于，使等于",
    "example": null,
    "category": "a.",
    "id": 477
  },
  {
    "word": "equality",
    "phonetic": "/iːˈkwɔlətɪ/",
    "meaning": "平等",
    "example": null,
    "category": "n.",
    "id": 478
  },
  {
    "word": "equip",
    "phonetic": "/ɪˈkwɪp/",
    "meaning": "提供设备；装备；配备",
    "example": null,
    "category": "vt.",
    "id": 479
  },
  {
    "word": "equipment",
    "phonetic": "/ɪˈkwɪpmənt/",
    "meaning": "装备，设备",
    "example": null,
    "category": "n.",
    "id": 480
  },
  {
    "word": "eraser",
    "phonetic": "/ɪˈreɪzə(r)/",
    "meaning": "橡皮擦；黑板擦",
    "example": null,
    "category": "n.",
    "id": 481
  },
  {
    "word": "error",
    "phonetic": "/ˈerə(r)/",
    "meaning": "错误；差错",
    "example": null,
    "category": "n.",
    "id": 482
  },
  {
    "word": "escape",
    "phonetic": "/ɪˈskeɪp/",
    "meaning": "n.& vi. 逃跑；逃脱",
    "example": null,
    "category": "",
    "id": 483
  },
  {
    "word": "especially",
    "phonetic": "/ɪˈspeʃəlɪ/",
    "meaning": "特别，尤其",
    "example": null,
    "category": "ad.",
    "id": 484
  },
  {
    "word": "essay",
    "phonetic": "/ˈeseɪ/",
    "meaning": "散文；文章；随笔",
    "example": null,
    "category": "n.",
    "id": 485
  },
  {
    "word": "Europe",
    "phonetic": "/ˈjʊərəp/",
    "meaning": "欧洲",
    "example": null,
    "category": "n.",
    "id": 486
  },
  {
    "word": "European",
    "phonetic": "/jʊərəˈpiːən/",
    "meaning": "欧洲的，欧洲人的 n. 欧洲人",
    "example": null,
    "category": "a.",
    "id": 487
  },
  {
    "word": "Eve",
    "phonetic": "/i:v/",
    "meaning": "n.前夕",
    "example": null,
    "category": "",
    "id": 488
  },
  {
    "word": "even",
    "phonetic": "/ˈiːv(ə)n/",
    "meaning": "甚至，连（…都）；更",
    "example": null,
    "category": "ad.",
    "id": 489
  },
  {
    "word": "evening",
    "phonetic": "/ˈiːvnɪŋ/",
    "meaning": "傍晚，晚上",
    "example": null,
    "category": "n.",
    "id": 490
  },
  {
    "word": "event",
    "phonetic": "/ɪ'vent/",
    "meaning": "事件，大事",
    "example": null,
    "category": "n.",
    "id": 491
  },
  {
    "word": "ever",
    "phonetic": "/ˈevə(r)/",
    "meaning": "曾经；无论何时",
    "example": null,
    "category": "ad.",
    "id": 492
  },
  {
    "word": "every",
    "phonetic": "/ˈevrɪ/",
    "meaning": "每一，每个的",
    "example": null,
    "category": "a.",
    "id": 493
  },
  {
    "word": "everybody",
    "phonetic": "/ˈevrɪbɔdɪ/",
    "meaning": "每人，人人",
    "example": null,
    "category": "pron.",
    "id": 494
  },
  {
    "word": "everyday",
    "phonetic": "/ˈevrɪdeɪ/",
    "meaning": "每日的；日常的",
    "example": null,
    "category": "a.",
    "id": 495
  },
  {
    "word": "everyone",
    "phonetic": "/ˈevrɪwʌn/",
    "meaning": "每人，人人",
    "example": null,
    "category": "pron.",
    "id": 496
  },
  {
    "word": "everything",
    "phonetic": "/ˈevrɪθɪŋ/",
    "meaning": "每件事，事事",
    "example": null,
    "category": "pron.",
    "id": 497
  },
  {
    "word": "everywhere",
    "phonetic": "/ˈevrɪweə(r)/",
    "meaning": "到处",
    "example": null,
    "category": "ad.",
    "id": 498
  },
  {
    "word": "exact",
    "phonetic": "/ɪɡˈzækt/",
    "meaning": "精确的；确切的",
    "example": null,
    "category": "a.",
    "id": 499
  },
  {
    "word": "exactly",
    "phonetic": "/ɪɡˈzæktlɪ/",
    "meaning": "精确地；确切地",
    "example": null,
    "category": "ad.",
    "id": 500
  },
  {
    "word": "exam",
    "phonetic": "/ɪɡzæmɪˈneɪʃ(ə)n/",
    "meaning": "考试，测试；检查；审查",
    "example": null,
    "category": "n.",
    "id": 501
  },
  {
    "word": "examine",
    "phonetic": "/ɪɡˈzæmɪn/",
    "meaning": "检查；诊察",
    "example": null,
    "category": "vt.",
    "id": 502
  },
  {
    "word": "example",
    "phonetic": "/ɪɡˈzɑːmp(ə)l; (US) ɪɡˈzæmpl/",
    "meaning": "例子；榜样",
    "example": null,
    "category": "n.",
    "id": 503
  },
  {
    "word": "excellent",
    "phonetic": "/ˈeksələnt/",
    "meaning": "极好的，优秀的",
    "example": null,
    "category": "a.",
    "id": 504
  },
  {
    "word": "except",
    "phonetic": "/ɪkˈsept/",
    "meaning": "除…之外",
    "example": null,
    "category": "prep.",
    "id": 505
  },
  {
    "word": "excite",
    "phonetic": "/ɪkˈsaɪt/",
    "meaning": "使兴奋，使激动",
    "example": null,
    "category": "vt.",
    "id": 506
  },
  {
    "word": "excuse",
    "phonetic": "/ɪkˈskjuːz/",
    "meaning": "借口,辩解 vt. 原谅,宽恕",
    "example": null,
    "category": "n.",
    "id": 507
  },
  {
    "word": "exercise",
    "phonetic": "/ˈeksəsaɪz/",
    "meaning": "锻炼，做操；练习，习题 vi. 锻炼",
    "example": null,
    "category": "n.",
    "id": 508
  },
  {
    "word": "exhibition",
    "phonetic": "/eksɪˈbɪʃ(ə)n/",
    "meaning": "展览；展览会",
    "example": null,
    "category": "n.",
    "id": 509
  },
  {
    "word": "exist",
    "phonetic": "/ɪg'zɪst/",
    "meaning": "存在",
    "example": null,
    "category": "vi.",
    "id": 510
  },
  {
    "word": "expect",
    "phonetic": "/ɪkˈspekt/",
    "meaning": "预料；盼望；认为",
    "example": null,
    "category": "vt.",
    "id": 511
  },
  {
    "word": "expensive",
    "phonetic": "/ɪkˈspensɪv/",
    "meaning": "昂贵的",
    "example": null,
    "category": "a.",
    "id": 512
  },
  {
    "word": "experience",
    "phonetic": "/ɪkˈspɪərɪəns/",
    "meaning": "经验；经历",
    "example": null,
    "category": "n.",
    "id": 513
  },
  {
    "word": "experiment",
    "phonetic": "/ɪkˈsperɪmənt/",
    "meaning": "实验",
    "example": null,
    "category": "n.",
    "id": 514
  },
  {
    "word": "expert",
    "phonetic": "/ˈekspɜːt/",
    "meaning": "专家，能手",
    "example": null,
    "category": "n.",
    "id": 515
  },
  {
    "word": "explain",
    "phonetic": "/ɪksˈpleɪn/",
    "meaning": "解释，说明",
    "example": null,
    "category": "vt.",
    "id": 516
  },
  {
    "word": "express",
    "phonetic": "/ɪkˈspres/",
    "meaning": "表达；表示；表情 n. 快车，特快专递",
    "example": null,
    "category": "vt.",
    "id": 517
  },
  {
    "word": "eye",
    "phonetic": "/aɪ/",
    "meaning": "眼睛",
    "example": null,
    "category": "n.",
    "id": 518
  },
  {
    "word": "face",
    "phonetic": "/feɪs/",
    "meaning": "脸 vt. 面向；面对",
    "example": null,
    "category": "n.",
    "id": 519
  },
  {
    "word": "fact",
    "phonetic": "/fækt/",
    "meaning": "事实，现实",
    "example": null,
    "category": "n.",
    "id": 520
  },
  {
    "word": "factory",
    "phonetic": "/ˈfæktəri/",
    "meaning": "工厂",
    "example": null,
    "category": "n.",
    "id": 521
  },
  {
    "word": "fail",
    "phonetic": "/feɪl/",
    "meaning": "失败；不及格；衰退",
    "example": null,
    "category": "v.",
    "id": 522
  },
  {
    "word": "fame",
    "phonetic": "/feɪm/",
    "meaning": "名声,名望,名誉",
    "example": null,
    "category": "n.",
    "id": 523
  },
  {
    "word": "family",
    "phonetic": "/ˈfæmɪlɪ/",
    "meaning": "家庭；家族；子女",
    "example": null,
    "category": "n.",
    "id": 524
  },
  {
    "word": "fan",
    "phonetic": "/fæn/",
    "meaning": "n.（电影、运动等的）迷；热心的爱好者（支持者） n. 风扇",
    "example": null,
    "category": "",
    "id": 525
  },
  {
    "word": "far",
    "phonetic": "/fɑː(r)/",
    "meaning": "(farther, farthest 或further , furthest) a.& ad. 远的；远地",
    "example": null,
    "category": "",
    "id": 526
  },
  {
    "word": "farm",
    "phonetic": "/fɑːm/",
    "meaning": "农场；农庄",
    "example": null,
    "category": "n.",
    "id": 527
  },
  {
    "word": "farmer",
    "phonetic": "/ˈfɑːmə(r)/",
    "meaning": "农民",
    "example": null,
    "category": "n.",
    "id": 528
  },
  {
    "word": "farming",
    "phonetic": "/ˈfɑːmiŋ/",
    "meaning": "农业,务农",
    "example": null,
    "category": "n.",
    "id": 529
  },
  {
    "word": "farmland",
    "phonetic": "/fɑːmlænd/",
    "meaning": "农田",
    "example": null,
    "category": "n.",
    "id": 530
  },
  {
    "word": "farther",
    "phonetic": "/ˈfɑːðə/",
    "meaning": "a./ad. (far的比较级形式之一)较远,更远",
    "example": null,
    "category": "",
    "id": 531
  },
  {
    "word": "farthest",
    "phonetic": "/ˈfɑːðist/",
    "meaning": "a./ad. (far的最高级形式之一)最远",
    "example": null,
    "category": "",
    "id": 532
  },
  {
    "word": "fast",
    "phonetic": "/ˈfɑːst/",
    "meaning": "快的，迅速的；紧密的 ad. 快地，迅速地；紧密地",
    "example": null,
    "category": "a.",
    "id": 533
  },
  {
    "word": "fasten",
    "phonetic": "/ˈfɑːs(ə)n; (US) fæsn/",
    "meaning": "扎牢；扣住",
    "example": null,
    "category": "vt.",
    "id": 534
  },
  {
    "word": "fat",
    "phonetic": "/fæt/",
    "meaning": "脂肪 a. 胖的；肥的",
    "example": null,
    "category": "n.",
    "id": 535
  },
  {
    "word": "father",
    "phonetic": "/ˈfɑːðə(r)/",
    "meaning": "父亲",
    "example": null,
    "category": "n.",
    "id": 536
  },
  {
    "word": "favour",
    "phonetic": "/'feivə/",
    "meaning": "(美favor) n. 恩惠；好意；帮助",
    "example": null,
    "category": "",
    "id": 537
  },
  {
    "word": "favourite",
    "phonetic": "/'feivərit/",
    "meaning": "(美 favorite) a. 喜爱的 n. 特别喜爱的人（或物）",
    "example": null,
    "category": "",
    "id": 538
  },
  {
    "word": "fax",
    "phonetic": "/fæks/",
    "meaning": "传真",
    "example": null,
    "category": "n.",
    "id": 539
  },
  {
    "word": "fear",
    "phonetic": "/fiə(r)/",
    "meaning": "害怕；恐惧； 担忧",
    "example": null,
    "category": "n.",
    "id": 540
  },
  {
    "word": "feather",
    "phonetic": "/'feðə(r)/",
    "meaning": "羽毛",
    "example": null,
    "category": "n.",
    "id": 541
  },
  {
    "word": "February",
    "phonetic": "/'februəri/",
    "meaning": "2月",
    "example": null,
    "category": "n.",
    "id": 542
  },
  {
    "word": "federal",
    "phonetic": "/'fedər(ə)l/",
    "meaning": "中央的,（政府）联邦的",
    "example": null,
    "category": "a.",
    "id": 543
  },
  {
    "word": "fee",
    "phonetic": "/fiː/",
    "meaning": "费，费用",
    "example": null,
    "category": "n.",
    "id": 544
  },
  {
    "word": "feed",
    "phonetic": "/fiːd/",
    "meaning": "喂（养）；饲（养）",
    "example": null,
    "category": "vt.",
    "id": 545
  },
  {
    "word": "feel",
    "phonetic": "/fiːl/",
    "meaning": "v.& link 感觉，觉得；摸，触",
    "example": null,
    "category": "",
    "id": 546
  },
  {
    "word": "feeling",
    "phonetic": "/ˈfiːlɪŋ/",
    "meaning": "感情；感觉",
    "example": null,
    "category": "n.",
    "id": 547
  },
  {
    "word": "fence",
    "phonetic": "/fens/",
    "meaning": "栅栏；围栏；篱笆",
    "example": null,
    "category": "n.",
    "id": 548
  },
  {
    "word": "festival",
    "phonetic": "/ˈfestɪvəl/",
    "meaning": "节日",
    "example": null,
    "category": "n.",
    "id": 549
  },
  {
    "word": "fetch",
    "phonetic": "/fetʃ/",
    "meaning": "vt.（去）取（物）来，（去）带（人）来",
    "example": null,
    "category": "",
    "id": 550
  },
  {
    "word": "fever",
    "phonetic": "/ˈfiːvə(r)/",
    "meaning": "发烧；发热",
    "example": null,
    "category": "n.",
    "id": 551
  },
  {
    "word": "few",
    "phonetic": "/fjuː/",
    "meaning": "不多;少数;不多的;少数的",
    "example": null,
    "category": "pron.",
    "id": 552
  },
  {
    "word": "field",
    "phonetic": "/fiːld/",
    "meaning": "田地;牧场;场地",
    "example": null,
    "category": "n.",
    "id": 553
  },
  {
    "word": "fifteen",
    "phonetic": "/fɪfˈtiːn/",
    "meaning": "十五",
    "example": null,
    "category": "num.",
    "id": 554
  },
  {
    "word": "fifth",
    "phonetic": "/fɪfθ/",
    "meaning": "第五",
    "example": null,
    "category": "num.",
    "id": 555
  },
  {
    "word": "fifty",
    "phonetic": "/ˈfɪftɪ/",
    "meaning": "五十",
    "example": null,
    "category": "num.",
    "id": 556
  },
  {
    "word": "fight",
    "phonetic": "/faɪt/",
    "meaning": "打仗（架），争论",
    "example": null,
    "category": "n.",
    "id": 557
  },
  {
    "word": "fight",
    "phonetic": "/faɪt/",
    "meaning": "(fought, fought) n./v. 打仗（架），与…打仗（架）",
    "example": null,
    "category": "",
    "id": 558
  },
  {
    "word": "fill",
    "phonetic": "/fɪl/",
    "meaning": "填空，装满",
    "example": null,
    "category": "vt.",
    "id": 559
  },
  {
    "word": "film",
    "phonetic": "/fɪlm/",
    "meaning": "电影；影片；胶卷",
    "example": null,
    "category": "n.",
    "id": 560
  },
  {
    "word": "final",
    "phonetic": "/ˈfaɪn(ə)l/",
    "meaning": "最后的；终极的",
    "example": null,
    "category": "a.",
    "id": 561
  },
  {
    "word": "find",
    "phonetic": "/faɪnd/",
    "meaning": "(found, found) vt. 找到，发现，感到",
    "example": null,
    "category": "",
    "id": 562
  },
  {
    "word": "fine",
    "phonetic": "/faɪn/",
    "meaning": "晴朗的；美好的；（身体）健康的",
    "example": null,
    "category": "a.",
    "id": 563
  },
  {
    "word": "finger",
    "phonetic": "/ˈfɪŋɡə(r)/",
    "meaning": "手指",
    "example": null,
    "category": "n.",
    "id": 564
  },
  {
    "word": "finish",
    "phonetic": "/ˈfɪnɪʃ/",
    "meaning": "结束；做完",
    "example": null,
    "category": "v.",
    "id": 565
  },
  {
    "word": "fire",
    "phonetic": "/ˈfaɪə(r)/",
    "meaning": "火；火炉；火灾 vi. 开火,射击,解雇",
    "example": null,
    "category": "n.",
    "id": 566
  },
  {
    "word": "fireplace",
    "phonetic": "/ˈfaɪəpleɪs/",
    "meaning": "壁炉",
    "example": null,
    "category": "n.",
    "id": 567
  },
  {
    "word": "first",
    "phonetic": "/fɜːst/",
    "meaning": "第一 a.& ad. 第一；首次；最初 n. 开始；开端",
    "example": null,
    "category": "num.",
    "id": 568
  },
  {
    "word": "fish",
    "phonetic": "/fɪʃ/",
    "meaning": "鱼；鱼肉 vi. 钓鱼；捕鱼",
    "example": null,
    "category": "n.",
    "id": 569
  },
  {
    "word": "fisherman",
    "phonetic": "/ˈfɪʃəmən/",
    "meaning": "渔民；钓鱼健身者",
    "example": null,
    "category": "n.",
    "id": 570
  },
  {
    "word": "fit",
    "phonetic": "/fɪt/",
    "meaning": "健康的,适合的 v.（使）适合,安装",
    "example": null,
    "category": "a.",
    "id": 571
  },
  {
    "word": "five",
    "phonetic": "/faɪv/",
    "meaning": "五",
    "example": null,
    "category": "num.",
    "id": 572
  },
  {
    "word": "fix",
    "phonetic": "/fɪks/",
    "meaning": "修理；安装；确定，决定",
    "example": null,
    "category": "vt.",
    "id": 573
  },
  {
    "word": "flag",
    "phonetic": "/flæɡ/",
    "meaning": "旗；标志；旗舰",
    "example": null,
    "category": "n.",
    "id": 574
  },
  {
    "word": "flight",
    "phonetic": "/flait/",
    "meaning": "航班,飞行",
    "example": null,
    "category": "n.",
    "id": 575
  },
  {
    "word": "flood",
    "phonetic": "/flʌd/",
    "meaning": "洪水 vt. 淹没，使泛滥",
    "example": null,
    "category": "n.",
    "id": 576
  },
  {
    "word": "floor",
    "phonetic": "/flɔː(r)/",
    "meaning": "地面，地板.（楼房的）层",
    "example": null,
    "category": "n.",
    "id": 577
  },
  {
    "word": "flower",
    "phonetic": "/ˈflaʊə(r)/",
    "meaning": "花",
    "example": null,
    "category": "n.",
    "id": 578
  },
  {
    "word": "fly",
    "phonetic": "/flaɪ/",
    "meaning": "飞；飞行；飘动 vt. 放（风筝、飞机模型等）n. 苍蝇",
    "example": null,
    "category": "vi.",
    "id": 579
  },
  {
    "word": "focus",
    "phonetic": "/ˈfəʊkəs/",
    "meaning": "/ n. 集中（注意力，精力）于，焦点，中心点",
    "example": null,
    "category": "v.",
    "id": 580
  },
  {
    "word": "fog",
    "phonetic": "/fɔɡ/",
    "meaning": "雾",
    "example": null,
    "category": "n.",
    "id": 581
  },
  {
    "word": "foggy",
    "phonetic": "/ˈfɔɡɪ/",
    "meaning": "多雾的",
    "example": null,
    "category": "a.",
    "id": 582
  },
  {
    "word": "follow",
    "phonetic": "/ˈfɔləʊ/",
    "meaning": "跟随；仿效；跟得上",
    "example": null,
    "category": "vt.",
    "id": 583
  },
  {
    "word": "following",
    "phonetic": "/ˈfɔləʊɪŋ/",
    "meaning": "接着的；以下的",
    "example": null,
    "category": "a.",
    "id": 584
  },
  {
    "word": "fond",
    "phonetic": "/fɔnd/",
    "meaning": "喜爱的，爱好的",
    "example": null,
    "category": "a.",
    "id": 585
  },
  {
    "word": "food",
    "phonetic": "/fuːd/",
    "meaning": "食物，食品",
    "example": null,
    "category": "n.",
    "id": 586
  },
  {
    "word": "fool",
    "phonetic": "/fuːl/",
    "meaning": "傻子，蠢人",
    "example": null,
    "category": "n.",
    "id": 587
  },
  {
    "word": "foolish",
    "phonetic": "/ˈfuːlɪʃ/",
    "meaning": "愚蠢的，傻的",
    "example": null,
    "category": "a.",
    "id": 588
  },
  {
    "word": "foot",
    "phonetic": "/fʊt/",
    "meaning": "足，脚；英尺",
    "example": null,
    "category": "n.",
    "id": 589
  },
  {
    "word": "football",
    "phonetic": "/ˈfutbɔːl/",
    "meaning": "n.（英式）足球；（美式）橄榄球",
    "example": null,
    "category": "",
    "id": 590
  },
  {
    "word": "for",
    "phonetic": "/fə(r), f ɔː (r)/",
    "meaning": "为了…；因为…；对于…；对…来说 conj. 因为，由于",
    "example": null,
    "category": "prep.",
    "id": 591
  },
  {
    "word": "foreign",
    "phonetic": "/ˈfɔrən; (US) ˈfɔrɪn/",
    "meaning": "外国的",
    "example": null,
    "category": "a.",
    "id": 592
  },
  {
    "word": "foreigner",
    "phonetic": "/ˈfɔrənə(r)/",
    "meaning": "外国人",
    "example": null,
    "category": "n.",
    "id": 593
  },
  {
    "word": "forest",
    "phonetic": "/ˈfɔrɪst/",
    "meaning": "森林",
    "example": null,
    "category": "n.",
    "id": 594
  },
  {
    "word": "forever",
    "phonetic": "/fəˈrevə(r)/",
    "meaning": "永远；永恒的",
    "example": null,
    "category": "ad.",
    "id": 595
  },
  {
    "word": "forget",
    "phonetic": "/fəˈɡet/",
    "meaning": "忘记；忘掉",
    "example": null,
    "category": "v.",
    "id": 596
  },
  {
    "word": "forgetful",
    "phonetic": "/fəˈɡetfʊl/",
    "meaning": "健忘的，不留心的",
    "example": null,
    "category": "a.",
    "id": 597
  },
  {
    "word": "fork",
    "phonetic": "/fɔːk/",
    "meaning": "叉，餐叉",
    "example": null,
    "category": "n.",
    "id": 598
  },
  {
    "word": "form",
    "phonetic": "/fɔːm/",
    "meaning": "表格；形式；结构",
    "example": null,
    "category": "n.",
    "id": 599
  },
  {
    "word": "forth",
    "phonetic": "/fɔːθ/",
    "meaning": "向前,往外",
    "example": null,
    "category": "n.",
    "id": 600
  },
  {
    "word": "forty",
    "phonetic": "/ˈfɔːtɪ/",
    "meaning": "四十",
    "example": null,
    "category": "num.",
    "id": 601
  },
  {
    "word": "found",
    "phonetic": "/faʊnd/",
    "meaning": "成立，建立",
    "example": null,
    "category": "vt.",
    "id": 602
  },
  {
    "word": "foundation",
    "phonetic": "/faʊnˈdeiʃən/",
    "meaning": "基础;基本原理,根据,基金会;建立,创办",
    "example": null,
    "category": "n.",
    "id": 603
  },
  {
    "word": "fountain",
    "phonetic": "/ˈfaʊntɪn; (US) ˈfaʊntn/",
    "meaning": "喷泉",
    "example": null,
    "category": "n.",
    "id": 604
  },
  {
    "word": "four",
    "phonetic": "/fɔː(r)/",
    "meaning": "四",
    "example": null,
    "category": "num.",
    "id": 605
  },
  {
    "word": "fourteen",
    "phonetic": "/ˈfɔːˈtiːn/",
    "meaning": "十四",
    "example": null,
    "category": "num.",
    "id": 606
  },
  {
    "word": "fourth",
    "phonetic": "/ˈfɔːθ/",
    "meaning": "第四",
    "example": null,
    "category": "num.",
    "id": 607
  },
  {
    "word": "fox",
    "phonetic": "/fɔks/",
    "meaning": "狐狸",
    "example": null,
    "category": "n.",
    "id": 608
  },
  {
    "word": "France",
    "phonetic": "/fræns/",
    "meaning": "法国",
    "example": null,
    "category": "n.",
    "id": 609
  },
  {
    "word": "free",
    "phonetic": "/friː/",
    "meaning": "自由，空闲的；免费的",
    "example": null,
    "category": "a.",
    "id": 610
  },
  {
    "word": "freeze",
    "phonetic": "/friːz/",
    "meaning": "(froze, frozen) vi. 结冰",
    "example": null,
    "category": "",
    "id": 611
  },
  {
    "word": "French",
    "phonetic": "/frentʃ/",
    "meaning": "法语 a. 法国的；法国人的；法语的",
    "example": null,
    "category": "n.",
    "id": 612
  },
  {
    "word": "Frenchman",
    "phonetic": "/ˈfrentʃmən/",
    "meaning": "(复 Frenchmen) n. 法国人（男）",
    "example": null,
    "category": "",
    "id": 613
  },
  {
    "word": "fresh",
    "phonetic": "/freʃ/",
    "meaning": "新鲜的",
    "example": null,
    "category": "a.",
    "id": 614
  },
  {
    "word": "Friday",
    "phonetic": "/ˈfraɪdɪ/",
    "meaning": "星期五",
    "example": null,
    "category": "n.",
    "id": 615
  },
  {
    "word": "fridge",
    "phonetic": "/rɪˈfrɪdʒəreɪtə(r)/",
    "meaning": "冰箱",
    "example": null,
    "category": "n.",
    "id": 616
  },
  {
    "word": "friend",
    "phonetic": "/frend/",
    "meaning": "朋友",
    "example": null,
    "category": "n.",
    "id": 617
  },
  {
    "word": "friendly",
    "phonetic": "/ˈfrendlɪ/",
    "meaning": "友好的",
    "example": null,
    "category": "a.",
    "id": 618
  },
  {
    "word": "friendship",
    "phonetic": "/ˈfrendʃɪp/",
    "meaning": "友谊，友情",
    "example": null,
    "category": "n.",
    "id": 619
  },
  {
    "word": "frighten",
    "phonetic": "/ˈfraɪt(ə)n/",
    "meaning": "使惊恐，吓唬",
    "example": null,
    "category": "vt.",
    "id": 620
  },
  {
    "word": "from",
    "phonetic": "/frəm, frɔm/",
    "meaning": "从,从…起,来自",
    "example": null,
    "category": "prep.",
    "id": 621
  },
  {
    "word": "front",
    "phonetic": "/frʌnt/",
    "meaning": "前面的；前部的 n. 前面；前部；前线",
    "example": null,
    "category": "a.",
    "id": 622
  },
  {
    "word": "fruit",
    "phonetic": "/fruːt/",
    "meaning": "水果；果实",
    "example": null,
    "category": "n.",
    "id": 623
  },
  {
    "word": "fruit",
    "phonetic": "/fruːt dʒuːs/",
    "meaning": "果汁",
    "example": null,
    "category": "n.",
    "id": 624
  },
  {
    "word": "fry",
    "phonetic": "/fraɪ/",
    "meaning": "用油煎；用油炸",
    "example": null,
    "category": "vt.",
    "id": 625
  },
  {
    "word": "full",
    "phonetic": "/fʊl/",
    "meaning": "满的，充满的；完全的",
    "example": null,
    "category": "a.",
    "id": 626
  },
  {
    "word": "fun",
    "phonetic": "/fʌn/",
    "meaning": "有趣的事，娱乐，玩笑",
    "example": null,
    "category": "n.",
    "id": 627
  },
  {
    "word": "funny",
    "phonetic": "/ˈfʌnɪ/",
    "meaning": "有趣的，滑稽可笑的",
    "example": null,
    "category": "a.",
    "id": 628
  },
  {
    "word": "fur",
    "phonetic": "/fɜː(r)/",
    "meaning": "毛皮；皮子",
    "example": null,
    "category": "n.",
    "id": 629
  },
  {
    "word": "further",
    "phonetic": "/ˈfəðə/",
    "meaning": "a./ad. (far的比较级形式之一)较远,更远",
    "example": null,
    "category": "",
    "id": 630
  },
  {
    "word": "future",
    "phonetic": "/ˈfjuːtʃə(r)/",
    "meaning": "将来、未来",
    "example": null,
    "category": "n.",
    "id": 631
  },
  {
    "word": "game",
    "phonetic": "/ɡeɪm/",
    "meaning": "游戏；运动；比赛",
    "example": null,
    "category": "n.",
    "id": 632
  },
  {
    "word": "garden",
    "phonetic": "/ˈɡɑːd(ə)n/",
    "meaning": "花园，果园，菜园",
    "example": null,
    "category": "n.",
    "id": 633
  },
  {
    "word": "gate",
    "phonetic": "/ɡeɪt/",
    "meaning": "大门",
    "example": null,
    "category": "n.",
    "id": 634
  },
  {
    "word": "general",
    "phonetic": "/ˈdʒenər(ə)l/",
    "meaning": "大体，笼统的，总的",
    "example": null,
    "category": "a.",
    "id": 635
  },
  {
    "word": "generation",
    "phonetic": "/dʒenəˈreɪʃ(ə)n/",
    "meaning": "代，一代",
    "example": null,
    "category": "n.",
    "id": 636
  },
  {
    "word": "generous",
    "phonetic": "/ˈdʒenərəs/",
    "meaning": "慷慨大方的",
    "example": null,
    "category": "a.",
    "id": 637
  },
  {
    "word": "geography",
    "phonetic": "/dʒɪˈɔɡrəfɪ/",
    "meaning": "地理学",
    "example": null,
    "category": "n.",
    "id": 638
  },
  {
    "word": "geometry",
    "phonetic": "/dʒɪ'ɑmɪtrɪ/",
    "meaning": "几何学",
    "example": null,
    "category": "n.",
    "id": 639
  },
  {
    "word": "German",
    "phonetic": "/ˈdʒɜːmən/",
    "meaning": "德国的，德国人的，德语的 n. 德国人，德语",
    "example": null,
    "category": "a.",
    "id": 640
  },
  {
    "word": "Germany",
    "phonetic": "/ˈdʒɜːmənɪ/",
    "meaning": "德国",
    "example": null,
    "category": "n.",
    "id": 641
  },
  {
    "word": "get",
    "phonetic": "/ɡet/",
    "meaning": "成为；得到；具有；到达",
    "example": null,
    "category": "vt.",
    "id": 642
  },
  {
    "word": "gift",
    "phonetic": "/ɡɪft/",
    "meaning": "赠品；礼物",
    "example": null,
    "category": "n.",
    "id": 643
  },
  {
    "word": "girl",
    "phonetic": "/ɡɜːl/",
    "meaning": "女孩",
    "example": null,
    "category": "n.",
    "id": 644
  },
  {
    "word": "give",
    "phonetic": "/ɡɪv/",
    "meaning": "给,递给,付出,给予",
    "example": null,
    "category": "vt.",
    "id": 645
  },
  {
    "word": "glad",
    "phonetic": "/ɡlæd/",
    "meaning": "高兴的；乐意的",
    "example": null,
    "category": "a.",
    "id": 646
  },
  {
    "word": "glass",
    "phonetic": "/ɡlɑːs; (US) ɡlæs/",
    "meaning": "玻璃杯,玻璃；(复)眼镜",
    "example": null,
    "category": "n.",
    "id": 647
  },
  {
    "word": "glove",
    "phonetic": "/ɡlʌv/",
    "meaning": "手套",
    "example": null,
    "category": "n.",
    "id": 648
  },
  {
    "word": "go",
    "phonetic": "/ɡəʊ/",
    "meaning": "去；走；驶；通到；到达 n. 尝试（做某事）",
    "example": null,
    "category": "vi.",
    "id": 649
  },
  {
    "word": "goal",
    "phonetic": "/ɡəʊl/",
    "meaning": "n.（足球）球门，目标",
    "example": null,
    "category": "",
    "id": 650
  },
  {
    "word": "goat",
    "phonetic": "/ɡəʊt/",
    "meaning": "山羊",
    "example": null,
    "category": "n.",
    "id": 651
  },
  {
    "word": "gold",
    "phonetic": "/ɡəʊld/",
    "meaning": "黄金 a 金的，黄金的",
    "example": null,
    "category": "n.",
    "id": 652
  },
  {
    "word": "golf",
    "phonetic": "/ɡɔlf/",
    "meaning": "高尔夫球",
    "example": null,
    "category": "n.",
    "id": 653
  },
  {
    "word": "good",
    "phonetic": "/ɡʊd/",
    "meaning": "好；良好",
    "example": null,
    "category": "a.",
    "id": 654
  },
  {
    "word": "goodness",
    "phonetic": "/ˈɡʊdnɪs/",
    "meaning": "善良，美德",
    "example": null,
    "category": "n.",
    "id": 655
  },
  {
    "word": "goose",
    "phonetic": "/ɡuːs/",
    "meaning": "鹅",
    "example": null,
    "category": "n.",
    "id": 656
  },
  {
    "word": "government",
    "phonetic": "/ˈɡʌvənmənt/",
    "meaning": "政府",
    "example": null,
    "category": "n.",
    "id": 657
  },
  {
    "word": "grade",
    "phonetic": "/ɡreɪd/",
    "meaning": "等级（中小学的）；学年；成绩，分数",
    "example": null,
    "category": "n.",
    "id": 658
  },
  {
    "word": "gradually",
    "phonetic": "/ˈɡrædjʊəlɪ/",
    "meaning": "逐渐地",
    "example": null,
    "category": "ad.",
    "id": 659
  },
  {
    "word": "graduate",
    "phonetic": "/ˈɡrædjʊeit ˈɡrædʒueit /",
    "meaning": "毕业",
    "example": null,
    "category": "v.",
    "id": 660
  },
  {
    "word": "grammar",
    "phonetic": "/ˈɡræmə(r)/",
    "meaning": "语法",
    "example": null,
    "category": "n.",
    "id": 661
  },
  {
    "word": "grand",
    "phonetic": "/ɡrænd/",
    "meaning": "宏伟的",
    "example": null,
    "category": "a.",
    "id": 662
  },
  {
    "word": "grandchild",
    "phonetic": "/'græntʃaɪld/",
    "meaning": "(外)孙或孙女,孙辈",
    "example": null,
    "category": "n.",
    "id": 663
  },
  {
    "word": "granddaughter",
    "phonetic": "/ˈɡrændɔːtə(r)/",
    "meaning": "n.（外）孙女",
    "example": null,
    "category": "",
    "id": 664
  },
  {
    "word": "grandma",
    "phonetic": "/ˈɡrænmɑː, ˈɡrændmʌðə(r)/",
    "meaning": "奶奶；外婆",
    "example": null,
    "category": "n.",
    "id": 665
  },
  {
    "word": "grandpa",
    "phonetic": "/ˈɡrænpɑː, ˈɡrændfɑːðə(r)/",
    "meaning": "爷爷,外公",
    "example": null,
    "category": "n.",
    "id": 666
  },
  {
    "word": "grandparents",
    "phonetic": "/ˈɡrændpeərənts/",
    "meaning": "祖父母,外祖父母",
    "example": null,
    "category": "n.",
    "id": 667
  },
  {
    "word": "grandson",
    "phonetic": "/ˈɡrændsʌn/",
    "meaning": "n.（外）孙子",
    "example": null,
    "category": "",
    "id": 668
  },
  {
    "word": "granny",
    "phonetic": "/ˈɡrænɪ/",
    "meaning": "老奶奶；祖母；外婆",
    "example": null,
    "category": "n.",
    "id": 669
  },
  {
    "word": "grape",
    "phonetic": "/ɡreɪp/",
    "meaning": "葡萄",
    "example": null,
    "category": "n.",
    "id": 670
  },
  {
    "word": "grass",
    "phonetic": "/ɡrɑːs; (US) ɡræs/",
    "meaning": "草；草场；牧草",
    "example": null,
    "category": "n.",
    "id": 671
  },
  {
    "word": "grateful",
    "phonetic": "/ˈɡreɪtfʊl/",
    "meaning": "感激的，感谢的",
    "example": null,
    "category": "a.",
    "id": 672
  },
  {
    "word": "great",
    "phonetic": "/ɡreɪt/",
    "meaning": "伟大的,重要的,好极了 ad.（口语）好极了，很好",
    "example": null,
    "category": "a.",
    "id": 673
  },
  {
    "word": "Greece",
    "phonetic": "/ɡriːs/",
    "meaning": "希腊",
    "example": null,
    "category": "n.",
    "id": 674
  },
  {
    "word": "green",
    "phonetic": "/ɡriːn/",
    "meaning": "绿色的；青的 n. 绿色",
    "example": null,
    "category": "a.",
    "id": 675
  },
  {
    "word": "greet",
    "phonetic": "/ɡriːt/",
    "meaning": "问候；向…致敬",
    "example": null,
    "category": "vt.",
    "id": 676
  },
  {
    "word": "grey",
    "phonetic": "/ɡreɪ/",
    "meaning": "灰色的；灰白的",
    "example": null,
    "category": "a.",
    "id": 677
  },
  {
    "word": "group",
    "phonetic": "/ɡruːp/",
    "meaning": "组，群",
    "example": null,
    "category": "n.",
    "id": 678
  },
  {
    "word": "grow",
    "phonetic": "/ɡrəʊ/",
    "meaning": "生长；发育；种植；变成",
    "example": null,
    "category": "v.",
    "id": 679
  },
  {
    "word": "growth",
    "phonetic": "/ɡrəʊθ/",
    "meaning": "生长，增长",
    "example": null,
    "category": "n.",
    "id": 680
  },
  {
    "word": "guess",
    "phonetic": "/ɡes/",
    "meaning": "猜",
    "example": null,
    "category": "vi.",
    "id": 681
  },
  {
    "word": "guest",
    "phonetic": "/ɡest/",
    "meaning": "客人，宾客",
    "example": null,
    "category": "n.",
    "id": 682
  },
  {
    "word": "guide",
    "phonetic": "/ɡaɪd/",
    "meaning": "向导，导游者",
    "example": null,
    "category": "n.",
    "id": 683
  },
  {
    "word": "guitar",
    "phonetic": "/ɡɪˈtɑː(r)/",
    "meaning": "吉他，六弦琴",
    "example": null,
    "category": "n.",
    "id": 684
  },
  {
    "word": "habit",
    "phonetic": "/ˈhæbɪt/",
    "meaning": "习惯，习性",
    "example": null,
    "category": "n.",
    "id": 685
  },
  {
    "word": "hair",
    "phonetic": "/heə(r)/",
    "meaning": "头发",
    "example": null,
    "category": "n.",
    "id": 686
  },
  {
    "word": "haircut",
    "phonetic": "/ˈheəkʌt/",
    "meaning": "n.（男子）理发",
    "example": null,
    "category": "",
    "id": 687
  },
  {
    "word": "half",
    "phonetic": "/hɑːf; (US) hæf/",
    "meaning": "a.& n. 半，一半，半个",
    "example": null,
    "category": "",
    "id": 688
  },
  {
    "word": "hall",
    "phonetic": "/hɔːl/",
    "meaning": "大厅,会堂,礼堂;过道",
    "example": null,
    "category": "n.",
    "id": 689
  },
  {
    "word": "ham",
    "phonetic": "/hæm/",
    "meaning": "火腿",
    "example": null,
    "category": "n.",
    "id": 690
  },
  {
    "word": "hamburger",
    "phonetic": "/ˈhæmbɜːɡə(r)/",
    "meaning": "汉堡包",
    "example": null,
    "category": "n.",
    "id": 691
  },
  {
    "word": "hand",
    "phonetic": "/hænd/",
    "meaning": "手；指针 v. 递;给;交付;交上",
    "example": null,
    "category": "n.",
    "id": 692
  },
  {
    "word": "handbag",
    "phonetic": "/ˈhændbæɡ/",
    "meaning": "女用皮包，手提包",
    "example": null,
    "category": "n.",
    "id": 693
  },
  {
    "word": "handwriting",
    "phonetic": "/ˈhændraɪtɪŋ/",
    "meaning": "书法",
    "example": null,
    "category": "n.",
    "id": 694
  },
  {
    "word": "hang",
    "phonetic": "/hæŋ/",
    "meaning": "悬挂，吊着；把…吊起  hang (hung, hung) 绞死",
    "example": null,
    "category": "v.",
    "id": 695
  },
  {
    "word": "happen",
    "phonetic": "/ˈhæpən/",
    "meaning": "vi.（偶然）发生,碰巧",
    "example": null,
    "category": "",
    "id": 696
  },
  {
    "word": "happily",
    "phonetic": "/'hæpɪlɪ/",
    "meaning": "幸福地，快乐地",
    "example": null,
    "category": "ad.",
    "id": 697
  },
  {
    "word": "happy",
    "phonetic": "/ˈhæpɪ/",
    "meaning": "幸福；快乐的，高兴的",
    "example": null,
    "category": "a.",
    "id": 698
  },
  {
    "word": "hard",
    "phonetic": "/hɑːd/",
    "meaning": "努力地；猛烈地 a. 硬的；困难的；艰难的",
    "example": null,
    "category": "ad.",
    "id": 699
  },
  {
    "word": "hardly",
    "phonetic": "/ˈhɑːdlɪ/",
    "meaning": "几乎不",
    "example": null,
    "category": "ad.",
    "id": 700
  },
  {
    "word": "hardworking",
    "phonetic": "/'ha:d'wə:kiŋ/",
    "meaning": "努力工作的",
    "example": null,
    "category": "a.",
    "id": 701
  },
  {
    "word": "harm",
    "phonetic": "/hɑːm/",
    "meaning": "n.&v. 伤害；损伤",
    "example": null,
    "category": "",
    "id": 702
  },
  {
    "word": "harvest",
    "phonetic": "/ˈhɑːvɪst/",
    "meaning": "n.& vt. 收割，收获（物）",
    "example": null,
    "category": "",
    "id": 703
  },
  {
    "word": "hat",
    "phonetic": "/hæt/",
    "meaning": "帽子(一般指有边的)；礼帽",
    "example": null,
    "category": "n.",
    "id": 704
  },
  {
    "word": "hate",
    "phonetic": "/heɪt/",
    "meaning": "vt.& n. 恨，讨厌",
    "example": null,
    "category": "",
    "id": 705
  },
  {
    "word": "have",
    "phonetic": "/hæv/",
    "meaning": "有；吃；喝；进行；经受",
    "example": null,
    "category": "vt.",
    "id": 706
  },
  {
    "word": "he",
    "phonetic": "/heɪ/",
    "meaning": "他",
    "example": null,
    "category": "pron.",
    "id": 707
  },
  {
    "word": "head",
    "phonetic": "/hed/",
    "meaning": "头；头脑；首脑；标题 a. 头部的；主要的 v. 率领；驶向",
    "example": null,
    "category": "n.",
    "id": 708
  },
  {
    "word": "headache",
    "phonetic": "/ˈhedeɪk/",
    "meaning": "头疼",
    "example": null,
    "category": "n.",
    "id": 709
  },
  {
    "word": "headmaster",
    "phonetic": "/hedˈmɑːstə(r)/",
    "meaning": "n.（英）中小学校长",
    "example": null,
    "category": "",
    "id": 710
  },
  {
    "word": "headmistress",
    "phonetic": "/'hed'mistrɪs/",
    "meaning": "女校长",
    "example": null,
    "category": "n.",
    "id": 711
  },
  {
    "word": "health",
    "phonetic": "/helθ/",
    "meaning": "健康，卫生",
    "example": null,
    "category": "n.",
    "id": 712
  },
  {
    "word": "healthy",
    "phonetic": "/ˈhelθɪ/",
    "meaning": "健康的，健壮的",
    "example": null,
    "category": "a.",
    "id": 713
  },
  {
    "word": "hear",
    "phonetic": "/hɪə(r)/",
    "meaning": "听见；听说",
    "example": null,
    "category": "v.",
    "id": 714
  },
  {
    "word": "hearing",
    "phonetic": "/ˈhɪərɪŋ/",
    "meaning": "听力",
    "example": null,
    "category": "n.",
    "id": 715
  },
  {
    "word": "heart",
    "phonetic": "/hɑːt/",
    "meaning": "心,心脏,纸牌中的红桃",
    "example": null,
    "category": "n.",
    "id": 716
  },
  {
    "word": "heat",
    "phonetic": "/hiːt/",
    "meaning": "热 vt. 把…加热",
    "example": null,
    "category": "n.",
    "id": 717
  },
  {
    "word": "heaven",
    "phonetic": "/ˈhev(ə)n/",
    "meaning": "天，天空",
    "example": null,
    "category": "n.",
    "id": 718
  },
  {
    "word": "heavy",
    "phonetic": "/ˈhevɪ/",
    "meaning": "重的",
    "example": null,
    "category": "a.",
    "id": 719
  },
  {
    "word": "heavily",
    "phonetic": "/ˈhevɪlɪ/",
    "meaning": "重地，大量地",
    "example": null,
    "category": "ad.",
    "id": 720
  },
  {
    "word": "hello",
    "phonetic": "/həˈləʊ/",
    "meaning": "喂；你好（表示打招呼，问候或唤起注意）",
    "example": null,
    "category": "int.",
    "id": 721
  },
  {
    "word": "help",
    "phonetic": "/help/",
    "meaning": "& vt. 帮助，帮忙",
    "example": null,
    "category": "n.",
    "id": 722
  },
  {
    "word": "helpful",
    "phonetic": "/ˈhelpfʊl/",
    "meaning": "有帮助的，有益的",
    "example": null,
    "category": "a.",
    "id": 723
  },
  {
    "word": "hen",
    "phonetic": "/hen/",
    "meaning": "母鸡",
    "example": null,
    "category": "n.",
    "id": 724
  },
  {
    "word": "her",
    "phonetic": "/hɜː(r)/",
    "meaning": "她(宾格),她的",
    "example": null,
    "category": "pron.",
    "id": 725
  },
  {
    "word": "here",
    "phonetic": "/hɪə(r)/",
    "meaning": "这里，在这里；向这里",
    "example": null,
    "category": "ad.",
    "id": 726
  },
  {
    "word": "hero",
    "phonetic": "/ˈhɪərəʊ/",
    "meaning": "英雄，勇士，男主角",
    "example": null,
    "category": "n.",
    "id": 727
  },
  {
    "word": "hers",
    "phonetic": "/hɜːz/",
    "meaning": "她的",
    "example": null,
    "category": "pron.",
    "id": 728
  },
  {
    "word": "herself",
    "phonetic": "/hɜːˈself/",
    "meaning": "她自己",
    "example": null,
    "category": "pron.",
    "id": 729
  },
  {
    "word": "hey",
    "phonetic": "/heɪ/",
    "meaning": "嘿！",
    "example": null,
    "category": "int.",
    "id": 730
  },
  {
    "word": "hi",
    "phonetic": "/haɪ/",
    "meaning": "你好（表示打招呼、问候或唤起注意）",
    "example": null,
    "category": "int.",
    "id": 731
  },
  {
    "word": "hide",
    "phonetic": "/haɪd/",
    "meaning": "把…藏起来，隐藏",
    "example": null,
    "category": "v.",
    "id": 732
  },
  {
    "word": "high",
    "phonetic": "/haɪ/",
    "meaning": "高的;高度的 ad. 高地",
    "example": null,
    "category": "a.",
    "id": 733
  },
  {
    "word": "highway",
    "phonetic": "/ˈhaɪweɪ/",
    "meaning": "公路,主要交通道路",
    "example": null,
    "category": "n.",
    "id": 734
  },
  {
    "word": "hill",
    "phonetic": "/hɪl/",
    "meaning": "小山;丘陵;土堆;斜坡",
    "example": null,
    "category": "n.",
    "id": 735
  },
  {
    "word": "him",
    "phonetic": "/hɪm/",
    "meaning": "他（宾格）",
    "example": null,
    "category": "pron.",
    "id": 736
  },
  {
    "word": "himself",
    "phonetic": "/hɪmˈself/",
    "meaning": "他自己",
    "example": null,
    "category": "pron.",
    "id": 737
  },
  {
    "word": "his",
    "phonetic": "/hɪz/",
    "meaning": "他的",
    "example": null,
    "category": "pron.",
    "id": 738
  },
  {
    "word": "history",
    "phonetic": "/ˈhɪstərɪ/",
    "meaning": "历史，历史学",
    "example": null,
    "category": "n.",
    "id": 739
  },
  {
    "word": "hit",
    "phonetic": "/hɪt/",
    "meaning": "n.& vt. 打,撞,击中",
    "example": null,
    "category": "",
    "id": 740
  },
  {
    "word": "hobby",
    "phonetic": "/ˈhɔbi/",
    "meaning": "业余爱好，嗜好",
    "example": null,
    "category": "n.",
    "id": 741
  },
  {
    "word": "hold",
    "phonetic": "/həʊld/",
    "meaning": "拿；抱；握住；举行；进行",
    "example": null,
    "category": "vt.",
    "id": 742
  },
  {
    "word": "hole",
    "phonetic": "/həʊl/",
    "meaning": "洞，坑",
    "example": null,
    "category": "n.",
    "id": 743
  },
  {
    "word": "holiday",
    "phonetic": "/ˈhɔlədi/",
    "meaning": "假日；假期",
    "example": null,
    "category": "n.",
    "id": 744
  },
  {
    "word": "home",
    "phonetic": "/həʊm/",
    "meaning": "家 ad. 到家；回家",
    "example": null,
    "category": "n.",
    "id": 745
  },
  {
    "word": "homeland",
    "phonetic": "/ˈhəʊmlænd/",
    "meaning": "祖国",
    "example": null,
    "category": "n.",
    "id": 746
  },
  {
    "word": "hometown",
    "phonetic": "/ˈhəʊmtaʊn/",
    "meaning": "故乡",
    "example": null,
    "category": "n.",
    "id": 747
  },
  {
    "word": "homework",
    "phonetic": "/ˈhəʊmwɜːk/",
    "meaning": "家庭作业",
    "example": null,
    "category": "n.",
    "id": 748
  },
  {
    "word": "honest",
    "phonetic": "/ˈɔnɪst/",
    "meaning": "诚实的，正直的",
    "example": null,
    "category": "a.",
    "id": 749
  },
  {
    "word": "hope",
    "phonetic": "/həʊp/",
    "meaning": "n.& v. 希望",
    "example": null,
    "category": "",
    "id": 750
  },
  {
    "word": "hopeful",
    "phonetic": "/ˈhəʊpfʊl/",
    "meaning": "有希望的；有前途的",
    "example": null,
    "category": "a.",
    "id": 751
  },
  {
    "word": "horrible",
    "phonetic": "/ˈhɔrɪb(ə)l/",
    "meaning": "令人恐惧；恐怖的",
    "example": null,
    "category": "a.",
    "id": 752
  },
  {
    "word": "horse",
    "phonetic": "/hɔːs/",
    "meaning": "马",
    "example": null,
    "category": "n.",
    "id": 753
  },
  {
    "word": "hospital",
    "phonetic": "/ˈhɔspɪt(ə)l/",
    "meaning": "医院",
    "example": null,
    "category": "n.",
    "id": 754
  },
  {
    "word": "hot",
    "phonetic": "/hɔt,hʌt/",
    "meaning": "热的",
    "example": null,
    "category": "a.",
    "id": 755
  },
  {
    "word": "hotel",
    "phonetic": "/həʊˈtel/",
    "meaning": "旅馆，饭店，宾馆",
    "example": null,
    "category": "n.",
    "id": 756
  },
  {
    "word": "hour",
    "phonetic": "/ˈaʊə(r)/",
    "meaning": "小时",
    "example": null,
    "category": "n.",
    "id": 757
  },
  {
    "word": "house",
    "phonetic": "/haʊs/",
    "meaning": "房子；住宅",
    "example": null,
    "category": "n.",
    "id": 758
  },
  {
    "word": "housewife",
    "phonetic": "/ˈhaʊswaɪf/",
    "meaning": "家庭主妇",
    "example": null,
    "category": "n.",
    "id": 759
  },
  {
    "word": "housework",
    "phonetic": "/ˈhaʊswɜːk/",
    "meaning": "家务劳动",
    "example": null,
    "category": "n.",
    "id": 760
  },
  {
    "word": "how",
    "phonetic": "/haʊ/",
    "meaning": "怎样,如何；多么",
    "example": null,
    "category": "ad.",
    "id": 761
  },
  {
    "word": "however",
    "phonetic": "/haʊˈevə(r)/",
    "meaning": "可是 conj. 然而，可是，尽管如此",
    "example": null,
    "category": "ad.",
    "id": 762
  },
  {
    "word": "hug",
    "phonetic": "/hʌɡ/",
    "meaning": "拥抱",
    "example": null,
    "category": "v.",
    "id": 763
  },
  {
    "word": "huge",
    "phonetic": "/hjuːdʒ/",
    "meaning": "巨大的，庞大的",
    "example": null,
    "category": "a.",
    "id": 764
  },
  {
    "word": "human",
    "phonetic": "/ˈhjuːmən/",
    "meaning": "人的，人类的",
    "example": null,
    "category": "a.",
    "id": 765
  },
  {
    "word": "hundred",
    "phonetic": "/ˈhʌndrəd/",
    "meaning": "百",
    "example": null,
    "category": "num.",
    "id": 766
  },
  {
    "word": "hunger",
    "phonetic": "/ˈhʌŋɡə(r)/",
    "meaning": "饥饿",
    "example": null,
    "category": "n.",
    "id": 767
  },
  {
    "word": "hungry",
    "phonetic": "/ˈhʌŋɡrɪ/",
    "meaning": "a.（饥）饿的",
    "example": null,
    "category": "",
    "id": 768
  },
  {
    "word": "hurry",
    "phonetic": "/ˈhʌrɪ/",
    "meaning": "赶快；急忙",
    "example": null,
    "category": "vi.",
    "id": 769
  },
  {
    "word": "hurt",
    "phonetic": "/hɜːt/",
    "meaning": "伤害，受伤；伤人感情",
    "example": null,
    "category": "vt.",
    "id": 770
  },
  {
    "word": "husband",
    "phonetic": "/ˈhʌzbənd/",
    "meaning": "丈夫",
    "example": null,
    "category": "n.",
    "id": 771
  },
  {
    "word": "I",
    "phonetic": "/aɪ/",
    "meaning": "我",
    "example": null,
    "category": "pron.",
    "id": 772
  },
  {
    "word": "ice",
    "phonetic": "/aɪs/",
    "meaning": "冰",
    "example": null,
    "category": "n.",
    "id": 773
  },
  {
    "word": "idea",
    "phonetic": "/aɪˈdɪə/",
    "meaning": "主意,意见,打算,想法",
    "example": null,
    "category": "n.",
    "id": 774
  },
  {
    "word": "idiom",
    "phonetic": "/ˈɪdɪəm/",
    "meaning": "习语，成语",
    "example": null,
    "category": "n.",
    "id": 775
  },
  {
    "word": "if",
    "phonetic": "/ɪf/",
    "meaning": "如果,假使,是否,是不是",
    "example": null,
    "category": "conj.",
    "id": 776
  },
  {
    "word": "ill",
    "phonetic": "/ɪl/",
    "meaning": "有病的；不健康的",
    "example": null,
    "category": "a.",
    "id": 777
  },
  {
    "word": "illness",
    "phonetic": "/ˈɪlnɪs/",
    "meaning": "疾病",
    "example": null,
    "category": "n.",
    "id": 778
  },
  {
    "word": "imagine",
    "phonetic": "/ɪˈmædʒɪn/",
    "meaning": "想像，设想",
    "example": null,
    "category": "vt.",
    "id": 779
  },
  {
    "word": "immediately",
    "phonetic": "/ɪˈmiːdɪətlɪ/",
    "meaning": "立即",
    "example": null,
    "category": "ad.",
    "id": 780
  },
  {
    "word": "important",
    "phonetic": "/ɪmˈpɔːtənt/",
    "meaning": "重要的",
    "example": null,
    "category": "a.",
    "id": 781
  },
  {
    "word": "impossible",
    "phonetic": "/ɪmˈpɔsɪb(ə)l/",
    "meaning": "不可能的",
    "example": null,
    "category": "a.",
    "id": 782
  },
  {
    "word": "improve",
    "phonetic": "/ɪmˈpruːv/",
    "meaning": "改进，更新",
    "example": null,
    "category": "vt.",
    "id": 783
  },
  {
    "word": "in",
    "phonetic": "/ɪn/",
    "meaning": "在…里(内)；在 ad. 在家，在内，向内",
    "example": null,
    "category": "prep.",
    "id": 784
  },
  {
    "word": "inch",
    "phonetic": "/ɪntʃ/",
    "meaning": "英寸",
    "example": null,
    "category": "n.",
    "id": 785
  },
  {
    "word": "include",
    "phonetic": "/ɪnˈkluːd/",
    "meaning": "包含，包括",
    "example": null,
    "category": "vt.",
    "id": 786
  },
  {
    "word": "increase",
    "phonetic": "/ɪnˈkriːs/",
    "meaning": "& n. 增加，繁殖",
    "example": null,
    "category": "v.",
    "id": 787
  },
  {
    "word": "indeed",
    "phonetic": "/ɪnˈdiːd/",
    "meaning": "确实；实在",
    "example": null,
    "category": "a.",
    "id": 788
  },
  {
    "word": "India",
    "phonetic": "/ˈɪndɪə/",
    "meaning": "印度",
    "example": null,
    "category": "n.",
    "id": 789
  },
  {
    "word": "Indian",
    "phonetic": "/ˈɪndɪən/",
    "meaning": "a.（美洲）印地安人的； 印度人的 n. 印地安人；印度人",
    "example": null,
    "category": "",
    "id": 790
  },
  {
    "word": "information",
    "phonetic": "/ɪnfəˈmeɪʃ(ə)n/",
    "meaning": "信息",
    "example": null,
    "category": "n.",
    "id": 791
  },
  {
    "word": "ink",
    "phonetic": "/ɪŋk/",
    "meaning": "墨水，油墨",
    "example": null,
    "category": "n.",
    "id": 792
  },
  {
    "word": "insect",
    "phonetic": "/ˈɪnsekt/",
    "meaning": "昆虫",
    "example": null,
    "category": "n.",
    "id": 793
  },
  {
    "word": "inside",
    "phonetic": "/ɪnˈsaɪd/",
    "meaning": "在…里面 ad. 在里面",
    "example": null,
    "category": "prep.",
    "id": 794
  },
  {
    "word": "insist",
    "phonetic": "/ɪnˈsɪst/",
    "meaning": "坚持；坚决认为",
    "example": null,
    "category": "vi.",
    "id": 795
  },
  {
    "word": "inspect",
    "phonetic": "/ɪnˈspekt/",
    "meaning": "检查；检验；审视",
    "example": null,
    "category": "vt.",
    "id": 796
  },
  {
    "word": "instruct",
    "phonetic": "/ɪnˈstrʌkt/",
    "meaning": "通知；指示；教",
    "example": null,
    "category": "vt.",
    "id": 797
  },
  {
    "word": "instruction",
    "phonetic": "/ɪnˈstrʌkʃ(ə)n/",
    "meaning": "说明,须知;教导",
    "example": null,
    "category": "n.",
    "id": 798
  },
  {
    "word": "interest",
    "phonetic": "/ˈɪntrɪst/",
    "meaning": "兴趣，趣味;利息",
    "example": null,
    "category": "n.",
    "id": 799
  },
  {
    "word": "interesting",
    "phonetic": "/ˈɪntrɪstɪŋ/",
    "meaning": "有趣的",
    "example": null,
    "category": "a.",
    "id": 800
  },
  {
    "word": "international",
    "phonetic": "/ɪntəˈnæʃən(ə)l/",
    "meaning": "国际的",
    "example": null,
    "category": "a.",
    "id": 801
  },
  {
    "word": "internet",
    "phonetic": "/ˈɪntənet/",
    "meaning": "互联网，英特网",
    "example": null,
    "category": "n.",
    "id": 802
  },
  {
    "word": "into",
    "phonetic": "/ˈɪntʊ, ˈɪntə/",
    "meaning": "到…里;向内；变成",
    "example": null,
    "category": "prep.",
    "id": 803
  },
  {
    "word": "introduce",
    "phonetic": "/ɪntrəˈdjuːs; (US) -duːs/",
    "meaning": "介绍",
    "example": null,
    "category": "vt.",
    "id": 804
  },
  {
    "word": "invent",
    "phonetic": "/ɪnˈvent/",
    "meaning": "发明，创造",
    "example": null,
    "category": "vt.",
    "id": 805
  },
  {
    "word": "invention",
    "phonetic": "/ɪnˈvenʃ(ə)n/",
    "meaning": "发明，创造",
    "example": null,
    "category": "n.",
    "id": 806
  },
  {
    "word": "inventor",
    "phonetic": "/ɪnˈventə(r)/",
    "meaning": "发明者，创造者",
    "example": null,
    "category": "n.",
    "id": 807
  },
  {
    "word": "invite",
    "phonetic": "/ɪnˈvaɪt/",
    "meaning": "邀请，招待",
    "example": null,
    "category": "vt.",
    "id": 808
  },
  {
    "word": "is",
    "phonetic": "/iz/",
    "meaning": "是",
    "example": null,
    "category": "v.",
    "id": 809
  },
  {
    "word": "island",
    "phonetic": "/ˈaɪlənd/",
    "meaning": "岛",
    "example": null,
    "category": "n.",
    "id": 810
  },
  {
    "word": "it",
    "phonetic": "/ɪt/",
    "meaning": "它",
    "example": null,
    "category": "pron.",
    "id": 811
  },
  {
    "word": "its",
    "phonetic": "/ɪts/",
    "meaning": "它的",
    "example": null,
    "category": "pron.",
    "id": 812
  },
  {
    "word": "itself",
    "phonetic": "/ɪtˈself/",
    "meaning": "它自己",
    "example": null,
    "category": "pron.",
    "id": 813
  },
  {
    "word": "jacket",
    "phonetic": "/ˈdʒækɪt/",
    "meaning": "短上衣，夹克衫",
    "example": null,
    "category": "n.",
    "id": 814
  },
  {
    "word": "jam",
    "phonetic": "/dʒæm/",
    "meaning": "果酱；阻塞",
    "example": null,
    "category": "n.",
    "id": 815
  },
  {
    "word": "January",
    "phonetic": "/ˈdʒænjʊərɪ; (US) ˈdʒænjʊerɪ/",
    "meaning": "1月",
    "example": null,
    "category": "n.",
    "id": 816
  },
  {
    "word": "Japan",
    "phonetic": "/dʒæˈpæn/",
    "meaning": "日本",
    "example": null,
    "category": "n.",
    "id": 817
  },
  {
    "word": "Japanese",
    "phonetic": "/dʒæpəˈniːz/",
    "meaning": "日本的，日本人的，日语的 n. 日本人，日语",
    "example": null,
    "category": "a.",
    "id": 818
  },
  {
    "word": "jeep",
    "phonetic": "/dʒiːp/",
    "meaning": "吉普车",
    "example": null,
    "category": "n.",
    "id": 819
  },
  {
    "word": "job",
    "phonetic": "/dʒɔb/",
    "meaning": "（一份）工作",
    "example": null,
    "category": "n.",
    "id": 820
  },
  {
    "word": "join",
    "phonetic": "/dʒɔɪn/",
    "meaning": "参加,加入;连接;会合",
    "example": null,
    "category": "v.",
    "id": 821
  },
  {
    "word": "joke",
    "phonetic": "/dʒəʊk/",
    "meaning": "笑话",
    "example": null,
    "category": "n.",
    "id": 822
  },
  {
    "word": "journalist",
    "phonetic": "/ˈdʒɜːnəlɪzt/",
    "meaning": "记者，新闻工作者",
    "example": null,
    "category": "n.",
    "id": 823
  },
  {
    "word": "journey",
    "phonetic": "/ˈdʒɜːnɪ/",
    "meaning": "旅行，路程",
    "example": null,
    "category": "n.",
    "id": 824
  },
  {
    "word": "joy",
    "phonetic": "/dʒɔɪ/",
    "meaning": "欢乐，高兴，乐趣",
    "example": null,
    "category": "n.",
    "id": 825
  },
  {
    "word": "judge",
    "phonetic": "/dʒʌdʒ/",
    "meaning": "裁判；审判员；法官 vt. 判断，断定",
    "example": null,
    "category": "n.",
    "id": 826
  },
  {
    "word": "juice",
    "phonetic": "/dʒuːs/",
    "meaning": "汁、液",
    "example": null,
    "category": "n.",
    "id": 827
  },
  {
    "word": "July",
    "phonetic": "/dʒʊˈlaɪ/",
    "meaning": "7月",
    "example": null,
    "category": "n.",
    "id": 828
  },
  {
    "word": "jump",
    "phonetic": "/dʒʌmp/",
    "meaning": "跳跃；跳变 v. 跳跃；惊起；猛扑",
    "example": null,
    "category": "n.",
    "id": 829
  },
  {
    "word": "June",
    "phonetic": "/dʒuːn/",
    "meaning": "6月",
    "example": null,
    "category": "n.",
    "id": 830
  },
  {
    "word": "jungle",
    "phonetic": "/ˈdʒʌŋɡ(ə)l/",
    "meaning": "丛林，密林",
    "example": null,
    "category": "n.",
    "id": 831
  },
  {
    "word": "junior",
    "phonetic": "/ˈdʒuːnɪə(r)/",
    "meaning": "初级的；年少的",
    "example": null,
    "category": "a.",
    "id": 832
  },
  {
    "word": "just",
    "phonetic": "/dʒʌst/",
    "meaning": "刚才；恰好；不过；仅 a. 公正的",
    "example": null,
    "category": "ad.",
    "id": 833
  },
  {
    "word": "kangaroo",
    "phonetic": "/kæŋɡəˈruː/",
    "meaning": "大袋鼠",
    "example": null,
    "category": "n.",
    "id": 834
  },
  {
    "word": "keep",
    "phonetic": "/kiːp/",
    "meaning": "保持；保存；继续不断 vt. 培育，饲养",
    "example": null,
    "category": "v.",
    "id": 835
  },
  {
    "word": "key",
    "phonetic": "/kiː/",
    "meaning": "钥匙;答案;键;关键",
    "example": null,
    "category": "n.",
    "id": 836
  },
  {
    "word": "keyboard",
    "phonetic": "/kiːbɔːd/",
    "meaning": "键盘",
    "example": null,
    "category": "n.",
    "id": 837
  },
  {
    "word": "kick",
    "phonetic": "/kɪk/",
    "meaning": "v.& n. 踢",
    "example": null,
    "category": "",
    "id": 838
  },
  {
    "word": "kid",
    "phonetic": "/kɪd/",
    "meaning": "小孩",
    "example": null,
    "category": "n.",
    "id": 839
  },
  {
    "word": "kill",
    "phonetic": "/kɪl/",
    "meaning": "杀死，弄死",
    "example": null,
    "category": "v.",
    "id": 840
  },
  {
    "word": "kilo",
    "phonetic": "/ˈkiːləʊ/",
    "meaning": "千克；千米",
    "example": null,
    "category": "n.",
    "id": 841
  },
  {
    "word": "kilogram",
    "phonetic": "/ˈkɪləuɡræm/",
    "meaning": "千克",
    "example": null,
    "category": "n.",
    "id": 842
  },
  {
    "word": "kilometre",
    "phonetic": "/'kiləumi:tə(r)/",
    "meaning": "千米（公里）",
    "example": null,
    "category": "n.",
    "id": 843
  },
  {
    "word": "kind",
    "phonetic": "/kaɪnd/",
    "meaning": "种;类 a. 善良,友好的",
    "example": null,
    "category": "n.",
    "id": 844
  },
  {
    "word": "king",
    "phonetic": "/kɪŋ/",
    "meaning": "国王",
    "example": null,
    "category": "n.",
    "id": 845
  },
  {
    "word": "kingdom",
    "phonetic": "/ˈkɪŋdəm/",
    "meaning": "王国",
    "example": null,
    "category": "n.",
    "id": 846
  },
  {
    "word": "kiss",
    "phonetic": "/kɪs/",
    "meaning": "n.& vt. 吻，亲吻",
    "example": null,
    "category": "",
    "id": 847
  },
  {
    "word": "kitchen",
    "phonetic": "/ˈkɪtʃɪn/",
    "meaning": "厨房",
    "example": null,
    "category": "n.",
    "id": 848
  },
  {
    "word": "kite",
    "phonetic": "/kaɪt/",
    "meaning": "风筝",
    "example": null,
    "category": "n.",
    "id": 849
  },
  {
    "word": "knee",
    "phonetic": "/niː/",
    "meaning": "膝盖",
    "example": null,
    "category": "n.",
    "id": 850
  },
  {
    "word": "knife",
    "phonetic": "/naɪf/",
    "meaning": "(复 knives) n. 小刀;匕首;刀片",
    "example": null,
    "category": "",
    "id": 851
  },
  {
    "word": "knock",
    "phonetic": "/nɔk/",
    "meaning": "n.& v. 敲；打；击 ",
    "example": null,
    "category": "",
    "id": 852
  },
  {
    "word": "knowledge",
    "phonetic": "/ˈnɔlɪdʒ/",
    "meaning": "知识，学问",
    "example": null,
    "category": "n.",
    "id": 853
  },
  {
    "word": "ladder",
    "phonetic": "/ˈlædə(r)/",
    "meaning": "梯子",
    "example": null,
    "category": "n.",
    "id": 854
  },
  {
    "word": "lady",
    "phonetic": "/ˈleɪdɪ/",
    "meaning": "女士，夫人",
    "example": null,
    "category": "n.",
    "id": 855
  },
  {
    "word": "lake",
    "phonetic": "/leɪk/",
    "meaning": "湖",
    "example": null,
    "category": "n.",
    "id": 856
  },
  {
    "word": "lamp",
    "phonetic": "/læmp/",
    "meaning": "灯，油灯；光源",
    "example": null,
    "category": "n.",
    "id": 857
  },
  {
    "word": "land",
    "phonetic": "/lænd/",
    "meaning": "陆地,土地 v. 登岸(陆)降落",
    "example": null,
    "category": "n.",
    "id": 858
  },
  {
    "word": "language",
    "phonetic": "/ˈlæŋɡwɪdʒ/",
    "meaning": "语言",
    "example": null,
    "category": "n.",
    "id": 859
  },
  {
    "word": "lap",
    "phonetic": "/læp/",
    "meaning": "(人坐时)膝部,(跑道的)一圈",
    "example": null,
    "category": "n.",
    "id": 860
  },
  {
    "word": "large",
    "phonetic": "/lɑːdʒ/",
    "meaning": "大的；巨大的",
    "example": null,
    "category": "a.",
    "id": 861
  },
  {
    "word": "last",
    "phonetic": "/lɑːst; (US) læst/",
    "meaning": "最后的 ad. 最后地 n. 最后 v. 持续",
    "example": null,
    "category": "a.",
    "id": 862
  },
  {
    "word": "late",
    "phonetic": "/leɪt/",
    "meaning": "晚的,迟的 ad. 晚地,迟地",
    "example": null,
    "category": "a.",
    "id": 863
  },
  {
    "word": "lately",
    "phonetic": "/ˈleɪtlɪ/",
    "meaning": "最近，不久前",
    "example": null,
    "category": "ad.",
    "id": 864
  },
  {
    "word": "later",
    "phonetic": "/ˈleɪtə(r)/",
    "meaning": "晚些的，迟些的",
    "example": null,
    "category": "a.",
    "id": 865
  },
  {
    "word": "laugh",
    "phonetic": "/lɑːf/",
    "meaning": "n.& v. 笑，大笑；嘲笑",
    "example": null,
    "category": "",
    "id": 866
  },
  {
    "word": "law",
    "phonetic": "/lɔː/",
    "meaning": "法律，法令；定律",
    "example": null,
    "category": "n.",
    "id": 867
  },
  {
    "word": "lay",
    "phonetic": "/leɪ/",
    "meaning": "放，搁",
    "example": null,
    "category": "vt.",
    "id": 868
  },
  {
    "word": "lazy",
    "phonetic": "/ˈleɪzɪ/",
    "meaning": "懒惰的",
    "example": null,
    "category": "a.",
    "id": 869
  },
  {
    "word": "lead",
    "phonetic": "/liːd/",
    "meaning": "领导，带领 n. 铅",
    "example": null,
    "category": "v.",
    "id": 870
  },
  {
    "word": "leader",
    "phonetic": "/ˈliːdə(r)/",
    "meaning": "领袖，领导人",
    "example": null,
    "category": "n.",
    "id": 871
  },
  {
    "word": "leaf",
    "phonetic": "/liːf/",
    "meaning": "（树，菜）叶",
    "example": null,
    "category": "n.",
    "id": 872
  },
  {
    "word": "league",
    "phonetic": "/liːɡ/",
    "meaning": "联盟，社团",
    "example": null,
    "category": "n.",
    "id": 873
  },
  {
    "word": "learn",
    "phonetic": "/lɜːn/",
    "meaning": "学，学习，学会",
    "example": null,
    "category": "vt.",
    "id": 874
  },
  {
    "word": "least",
    "phonetic": "/liːst/",
    "meaning": "最少，最少量",
    "example": null,
    "category": "n.",
    "id": 875
  },
  {
    "word": "leather",
    "phonetic": "/ˈleðə(r)/",
    "meaning": "皮革",
    "example": null,
    "category": "n.",
    "id": 876
  },
  {
    "word": "leave",
    "phonetic": "/liːv/",
    "meaning": "离开;把…留下，剩下",
    "example": null,
    "category": "v.",
    "id": 877
  },
  {
    "word": "left",
    "phonetic": "/left/",
    "meaning": "左边的 ad. 向左 n. 左,左边",
    "example": null,
    "category": "a.",
    "id": 878
  },
  {
    "word": "leg",
    "phonetic": "/leɡ/",
    "meaning": "腿；腿脚；支柱",
    "example": null,
    "category": "n.",
    "id": 879
  },
  {
    "word": "lend",
    "phonetic": "/lend/",
    "meaning": "借(出),把…借给",
    "example": null,
    "category": "vt.",
    "id": 880
  },
  {
    "word": "lesson",
    "phonetic": "/[ˈles(ə)n/",
    "meaning": "课；功课；教训",
    "example": null,
    "category": "n.",
    "id": 881
  },
  {
    "word": "let",
    "phonetic": "/let/",
    "meaning": "让",
    "example": null,
    "category": "vt.",
    "id": 882
  },
  {
    "word": "letter",
    "phonetic": "/ˈletə(r)/",
    "meaning": "信；字母",
    "example": null,
    "category": "n.",
    "id": 883
  },
  {
    "word": "librarian",
    "phonetic": "/laiˈbreəriən/",
    "meaning": "图书管理员；（西方的）图书馆馆长",
    "example": null,
    "category": "n.",
    "id": 884
  },
  {
    "word": "library",
    "phonetic": "/ˈlaibrəri; (US) ˈlaibreri/",
    "meaning": "图书馆，图书室",
    "example": null,
    "category": "n.",
    "id": 885
  },
  {
    "word": "license",
    "phonetic": "/ˈlaisəns/",
    "meaning": "执照，许可证",
    "example": null,
    "category": "n.",
    "id": 886
  },
  {
    "word": "lie",
    "phonetic": "/lai/",
    "meaning": "躺;卧;平放;位于n.& vi.(lied,lied) 说谎",
    "example": null,
    "category": "v.",
    "id": 887
  },
  {
    "word": "life",
    "phonetic": "/laif/",
    "meaning": "生命；生涯；生活；人生；生物",
    "example": null,
    "category": "n.",
    "id": 888
  },
  {
    "word": "lifetime",
    "phonetic": "/ˈlaiftaim/",
    "meaning": "一生，终生",
    "example": null,
    "category": "n.",
    "id": 889
  },
  {
    "word": "lift",
    "phonetic": "/lift/",
    "meaning": "举起，抬起；（云、烟等）消散 n. （英）电梯",
    "example": null,
    "category": "v.",
    "id": 890
  },
  {
    "word": "light",
    "phonetic": "/laɪt/",
    "meaning": "光，光亮；灯，灯光 vt. 点（火），点燃 a. 明亮的；轻的；浅色的",
    "example": null,
    "category": "n.",
    "id": 891
  },
  {
    "word": "like",
    "phonetic": "/laɪk/",
    "meaning": "像，跟…一样 vt. 喜欢，喜爱",
    "example": null,
    "category": "prep.",
    "id": 892
  },
  {
    "word": "line",
    "phonetic": "/laɪn/",
    "meaning": "绳索，线，排，行，线路 v. 画线于，（使）成行",
    "example": null,
    "category": "n.",
    "id": 893
  },
  {
    "word": "lion",
    "phonetic": "/ˈlaɪən/",
    "meaning": "狮子",
    "example": null,
    "category": "n.",
    "id": 894
  },
  {
    "word": "lip",
    "phonetic": "/lɪp/",
    "meaning": "嘴唇",
    "example": null,
    "category": "n.",
    "id": 895
  },
  {
    "word": "list",
    "phonetic": "/lɪst/",
    "meaning": "一览表，清单",
    "example": null,
    "category": "n.",
    "id": 896
  },
  {
    "word": "listen",
    "phonetic": "/ˈlɪs(ə)n/",
    "meaning": "听,仔细听",
    "example": null,
    "category": "vi.",
    "id": 897
  },
  {
    "word": "litter",
    "phonetic": "/ˈlɪtə(r)/",
    "meaning": "乱丢杂物",
    "example": null,
    "category": "v.",
    "id": 898
  },
  {
    "word": "little",
    "phonetic": "/ˈlɪt(ə)l/",
    "meaning": "小的,少的 ad. 很少地, 稍许 n. 没有多少",
    "example": null,
    "category": "a.",
    "id": 899
  },
  {
    "word": "live",
    "phonetic": "/lɪv/",
    "meaning": "生活;居住;活着 a. 活的,活着的;现场（直播）的",
    "example": null,
    "category": "vi.",
    "id": 900
  },
  {
    "word": "lively",
    "phonetic": "/ˈlaɪvlɪ/",
    "meaning": "活泼的;充满生气的",
    "example": null,
    "category": "a.",
    "id": 901
  },
  {
    "word": "living",
    "phonetic": "/ˈlɪvɪŋ/",
    "meaning": "活着的 n. 生计",
    "example": null,
    "category": "a.",
    "id": 902
  },
  {
    "word": "lock",
    "phonetic": "/lɔk/",
    "meaning": "锁 vt. 锁，锁上",
    "example": null,
    "category": "n.",
    "id": 903
  },
  {
    "word": "London",
    "phonetic": "/ˈlʌnd(ə)n/",
    "meaning": "伦敦",
    "example": null,
    "category": "n.",
    "id": 904
  },
  {
    "word": "lonely",
    "phonetic": "/ˈləʊnlɪ/",
    "meaning": "孤独的，寂寞的",
    "example": null,
    "category": "a.",
    "id": 905
  },
  {
    "word": "long",
    "phonetic": "/lɔŋ; (US) lɔːŋ/",
    "meaning": "长的，远 ad. 长久",
    "example": null,
    "category": "a.",
    "id": 906
  },
  {
    "word": "look",
    "phonetic": "/lʊk/",
    "meaning": "看，瞧 v. 看，观看 v. link 看起来",
    "example": null,
    "category": "n.",
    "id": 907
  },
  {
    "word": "lose",
    "phonetic": "/luːz/",
    "meaning": "失去，丢失",
    "example": null,
    "category": "vt.",
    "id": 908
  },
  {
    "word": "lot",
    "phonetic": "/lɔt/",
    "meaning": "许多，好些",
    "example": null,
    "category": "n.",
    "id": 909
  },
  {
    "word": "loud",
    "phonetic": "/laʊd/",
    "meaning": "大声的",
    "example": null,
    "category": "a.",
    "id": 910
  },
  {
    "word": "loudly",
    "phonetic": "/laʊdlɪ/",
    "meaning": "大声地",
    "example": null,
    "category": "ad.",
    "id": 911
  },
  {
    "word": "loudspeaker",
    "phonetic": "/laʊdˈspiːkə(r)/",
    "meaning": "扬声器，喇叭",
    "example": null,
    "category": "n.",
    "id": 912
  },
  {
    "word": "love",
    "phonetic": "/lʌv/",
    "meaning": "n.& vt. 爱；热爱;很喜欢",
    "example": null,
    "category": "",
    "id": 913
  },
  {
    "word": "lovely",
    "phonetic": "/ˈlʌvlɪ/",
    "meaning": "美好的，可爱的",
    "example": null,
    "category": "a.",
    "id": 914
  },
  {
    "word": "low",
    "phonetic": "/ləʊ/",
    "meaning": "a.& ad. 低；矮",
    "example": null,
    "category": "",
    "id": 915
  },
  {
    "word": "luck",
    "phonetic": "/lʌk/",
    "meaning": "运气，好运",
    "example": null,
    "category": "n.",
    "id": 916
  },
  {
    "word": "lucky",
    "phonetic": "/ˈlʌkɪ/",
    "meaning": "运气好，侥幸",
    "example": null,
    "category": "a.",
    "id": 917
  },
  {
    "word": "lunch",
    "phonetic": "/lʌntʃ/",
    "meaning": "午餐，午饭",
    "example": null,
    "category": "n.",
    "id": 918
  },
  {
    "word": "machine",
    "phonetic": "/məˈʃiːn/",
    "meaning": "机器",
    "example": null,
    "category": "n.",
    "id": 919
  },
  {
    "word": "magazine",
    "phonetic": "/mæɡəˈziːn/",
    "meaning": "杂志",
    "example": null,
    "category": "n.",
    "id": 920
  },
  {
    "word": "magic",
    "phonetic": "/ˈmædʒɪk/",
    "meaning": "有魔力的",
    "example": null,
    "category": "a.",
    "id": 921
  },
  {
    "word": "mail",
    "phonetic": "/meɪl/",
    "meaning": "邮政,邮递 v. (美)邮寄",
    "example": null,
    "category": "n.",
    "id": 922
  },
  {
    "word": "main",
    "phonetic": "/meɪn/",
    "meaning": "主要的",
    "example": null,
    "category": "a.",
    "id": 923
  },
  {
    "word": "mainland",
    "phonetic": "/ˈmeɪnlənd/",
    "meaning": "大陆",
    "example": null,
    "category": "n.",
    "id": 924
  },
  {
    "word": "make",
    "phonetic": "/meɪk/",
    "meaning": "制造,做;使得",
    "example": null,
    "category": "vt.",
    "id": 925
  },
  {
    "word": "man",
    "phonetic": "/mæn/",
    "meaning": "成年男人;人类",
    "example": null,
    "category": "n.",
    "id": 926
  },
  {
    "word": "manage",
    "phonetic": "/ˈmænɪdʒ/",
    "meaning": "管理；设法对付",
    "example": null,
    "category": "v.",
    "id": 927
  },
  {
    "word": "manager",
    "phonetic": "/ˈmænɪdʒə(r)/",
    "meaning": "经理",
    "example": null,
    "category": "n.",
    "id": 928
  },
  {
    "word": "many",
    "phonetic": "/ˈmenɪ/",
    "meaning": "许多人（或物）a. 许多的",
    "example": null,
    "category": "pron.",
    "id": 929
  },
  {
    "word": "map",
    "phonetic": "/mæp/",
    "meaning": "地图",
    "example": null,
    "category": "n.",
    "id": 930
  },
  {
    "word": "March",
    "phonetic": "/mɑːtʃ/",
    "meaning": "3月",
    "example": null,
    "category": "n.",
    "id": 931
  },
  {
    "word": "mark",
    "phonetic": "/mɑːk/",
    "meaning": "标记 vt. 标明,作记号于",
    "example": null,
    "category": "n.",
    "id": 932
  },
  {
    "word": "market",
    "phonetic": "/ˈmɑːkɪt/",
    "meaning": "市场，集市",
    "example": null,
    "category": "n.",
    "id": 933
  },
  {
    "word": "marry",
    "phonetic": "/ˈmærɪ/",
    "meaning": "v.（使）成婚，结婚",
    "example": null,
    "category": "",
    "id": 934
  },
  {
    "word": "match",
    "phonetic": "/mætʃ/",
    "meaning": "使相配，使成对 n. 比赛，竞赛 n. 火柴",
    "example": null,
    "category": "vt.",
    "id": 935
  },
  {
    "word": "mathematics",
    "phonetic": "/mæθəˈmætɪks/",
    "meaning": "n.（常作单数用）数学, (英美口语) 数学",
    "example": null,
    "category": "",
    "id": 936
  },
  {
    "word": "matter",
    "phonetic": "/ˈmætə(r)/",
    "meaning": "要紧事，要紧, 事情；问题 vi. 要紧，有重大关系",
    "example": null,
    "category": "n.",
    "id": 937
  },
  {
    "word": "May",
    "phonetic": "/meɪ/",
    "meaning": "5月",
    "example": null,
    "category": "n.",
    "id": 938
  },
  {
    "word": "maybe",
    "phonetic": "/ˈmeɪbiː/",
    "meaning": "可能，大概，也许",
    "example": null,
    "category": "ad.",
    "id": 939
  },
  {
    "word": "me",
    "phonetic": "/miː, mɪ/",
    "meaning": "我（宾格）",
    "example": null,
    "category": "pron.",
    "id": 940
  },
  {
    "word": "meal",
    "phonetic": "/miːl/",
    "meaning": "一餐（饭） ",
    "example": null,
    "category": "n.",
    "id": 941
  },
  {
    "word": "meaning",
    "phonetic": "/ˈmiːnɪŋ/",
    "meaning": "意思，含意",
    "example": null,
    "category": "n.",
    "id": 942
  },
  {
    "word": "means",
    "phonetic": "/miːnz/",
    "meaning": "方法，手段；财产",
    "example": null,
    "category": "n.",
    "id": 943
  },
  {
    "word": "meat",
    "phonetic": "/miːt/",
    "meaning": "n.（猪、牛、羊等的）肉",
    "example": null,
    "category": "",
    "id": 944
  },
  {
    "word": "meet",
    "phonetic": "/miːt/",
    "meaning": "vt./ n. 遇见，见到 会；集会",
    "example": null,
    "category": "",
    "id": 945
  },
  {
    "word": "meeting",
    "phonetic": "/ˈmiːtɪŋ/",
    "meaning": "会,集会,会见,汇合点",
    "example": null,
    "category": "n.",
    "id": 946
  },
  {
    "word": "melon",
    "phonetic": "/ˈmelən/",
    "meaning": "n.（甜）瓜；瓜状物",
    "example": null,
    "category": "",
    "id": 947
  },
  {
    "word": "member",
    "phonetic": "/ˈmembə(r)/",
    "meaning": "成员，会员",
    "example": null,
    "category": "n.",
    "id": 948
  },
  {
    "word": "memory",
    "phonetic": "/ˈmemərɪ/",
    "meaning": "回忆，记忆",
    "example": null,
    "category": "n.",
    "id": 949
  },
  {
    "word": "mend",
    "phonetic": "/mend/",
    "meaning": "修理，修补",
    "example": null,
    "category": "v.",
    "id": 950
  },
  {
    "word": "mention",
    "phonetic": "/ˈmenʃ(ə)n/",
    "meaning": "提及；记载 vt. 提到，说起",
    "example": null,
    "category": "n.",
    "id": 951
  },
  {
    "word": "menu",
    "phonetic": "/ˈmenjuː/",
    "meaning": "菜单",
    "example": null,
    "category": "n.",
    "id": 952
  },
  {
    "word": "merry",
    "phonetic": "/ˈmerɪ/",
    "meaning": "高兴的，愉快的",
    "example": null,
    "category": "a.",
    "id": 953
  },
  {
    "word": "message",
    "phonetic": "/ˈmesɪdʒ/",
    "meaning": "消息，音信",
    "example": null,
    "category": "n.",
    "id": 954
  },
  {
    "word": "metal",
    "phonetic": "/ˈmet(ə)l/",
    "meaning": "金属 a. 金属制成的",
    "example": null,
    "category": "n.",
    "id": 955
  },
  {
    "word": "metre",
    "phonetic": "/'mi:tə/",
    "meaning": "米，公尺",
    "example": null,
    "category": "n.",
    "id": 956
  },
  {
    "word": "middle",
    "phonetic": "/ˈmɪd(ə)l/",
    "meaning": "中间;当中;中级的",
    "example": null,
    "category": "n.",
    "id": 957
  },
  {
    "word": "Middle",
    "phonetic": "/ˈmɪd(ə)liːst/",
    "meaning": "中东",
    "example": null,
    "category": "n.",
    "id": 958
  },
  {
    "word": "midnight",
    "phonetic": "/ˈmɪdnaɪt/",
    "meaning": "午夜",
    "example": null,
    "category": "n.",
    "id": 959
  },
  {
    "word": "might",
    "phonetic": "/maɪt/",
    "meaning": "aux. (may的过去式，助动词) 可能，也许，或许",
    "example": null,
    "category": "v.",
    "id": 960
  },
  {
    "word": "mild",
    "phonetic": "/maɪld/",
    "meaning": "温和,暖和的,凉爽的",
    "example": null,
    "category": "a.",
    "id": 961
  },
  {
    "word": "mile",
    "phonetic": "/maɪl/",
    "meaning": "英里",
    "example": null,
    "category": "n.",
    "id": 962
  },
  {
    "word": "milk",
    "phonetic": "/mɪlk/",
    "meaning": "牛奶 vt. 挤奶",
    "example": null,
    "category": "n.",
    "id": 963
  },
  {
    "word": "million",
    "phonetic": "/ˈmɪlɪən/",
    "meaning": "百万 n. 百万个（人或物）",
    "example": null,
    "category": "num.",
    "id": 964
  },
  {
    "word": "mind",
    "phonetic": "/maɪnd/",
    "meaning": "思想,想法 v.介意,关心",
    "example": null,
    "category": "n.",
    "id": 965
  },
  {
    "word": "mine",
    "phonetic": "/maɪn/",
    "meaning": "矿藏,矿山 vt. 开采(矿物)  pron. 我的",
    "example": null,
    "category": "n.",
    "id": 966
  },
  {
    "word": "minibus",
    "phonetic": "/ˈmɪnɪbʌs/",
    "meaning": "小型公共汽车",
    "example": null,
    "category": "n.",
    "id": 967
  },
  {
    "word": "minus",
    "phonetic": "/ˈmaɪnəs/",
    "meaning": "& a.负的，减去的",
    "example": null,
    "category": "prep.",
    "id": 968
  },
  {
    "word": "minute",
    "phonetic": "/ˈmɪnɪt/",
    "meaning": "分钟;一会儿，瞬间",
    "example": null,
    "category": "n.",
    "id": 969
  },
  {
    "word": "mirror",
    "phonetic": "/ˈmɪrə(r)/",
    "meaning": "镜子",
    "example": null,
    "category": "n.",
    "id": 970
  },
  {
    "word": "miss",
    "phonetic": "/mɪs/",
    "meaning": "失去，错过，缺",
    "example": null,
    "category": "vt.",
    "id": 971
  },
  {
    "word": "mist",
    "phonetic": "/mɪst/",
    "meaning": "雾",
    "example": null,
    "category": "n.",
    "id": 972
  },
  {
    "word": "mistake",
    "phonetic": "/mɪsˈteɪk/",
    "meaning": "错误 vt. 弄错",
    "example": null,
    "category": "n.",
    "id": 973
  },
  {
    "word": "mobile",
    "phonetic": "/ˈməubaɪl; (US) məubl/",
    "meaning": "活动的，可移动的",
    "example": null,
    "category": "a.",
    "id": 974
  },
  {
    "word": "model",
    "phonetic": "/ˈmɔd(ə)l/",
    "meaning": "模型,原形,范例,模范",
    "example": null,
    "category": "n.",
    "id": 975
  },
  {
    "word": "modern",
    "phonetic": "/ˈmɔd(ə)n/",
    "meaning": "现代的",
    "example": null,
    "category": "a.",
    "id": 976
  },
  {
    "word": "Mom",
    "phonetic": "/mɔm/",
    "meaning": "妈妈",
    "example": null,
    "category": "n.",
    "id": 977
  },
  {
    "word": "moment",
    "phonetic": "/ˈməumənt/",
    "meaning": "片刻，瞬间",
    "example": null,
    "category": "n.",
    "id": 978
  },
  {
    "word": "mommy",
    "phonetic": "/ˈmʌmɪ/",
    "meaning": "妈妈（美）",
    "example": null,
    "category": "n.",
    "id": 979
  },
  {
    "word": "Monday",
    "phonetic": "/ˈmʌndeɪ, ˈmʌndɪ/",
    "meaning": "星期一",
    "example": null,
    "category": "n.",
    "id": 980
  },
  {
    "word": "money",
    "phonetic": "/ˈmʌnɪ/",
    "meaning": "钱；货币",
    "example": null,
    "category": "n.",
    "id": 981
  },
  {
    "word": "monitor",
    "phonetic": "/ˈmɔnɪtə(r)/",
    "meaning": "n.（班级内的）班长；纠察生；监视器",
    "example": null,
    "category": "",
    "id": 982
  },
  {
    "word": "monkey",
    "phonetic": "/ˈmʌŋkɪ/",
    "meaning": "猴子",
    "example": null,
    "category": "n.",
    "id": 983
  },
  {
    "word": "month",
    "phonetic": "/mʌnθ/",
    "meaning": "月，月份",
    "example": null,
    "category": "n.",
    "id": 984
  },
  {
    "word": "monument",
    "phonetic": "/ˈmɔnjumənt/",
    "meaning": "纪念碑，纪念物",
    "example": null,
    "category": "n.",
    "id": 985
  },
  {
    "word": "moon",
    "phonetic": "/muːn/",
    "meaning": "月球；月光；月状物",
    "example": null,
    "category": "n.",
    "id": 986
  },
  {
    "word": "mooncake",
    "phonetic": "/muːnkeɪk/",
    "meaning": "月饼",
    "example": null,
    "category": "n.",
    "id": 987
  },
  {
    "word": "morning",
    "phonetic": "/ˈmɔːnɪŋ/",
    "meaning": "早晨，上午",
    "example": null,
    "category": "n.",
    "id": 988
  },
  {
    "word": "most",
    "phonetic": "/məʊst; (US) mɔːst/",
    "meaning": "& ad. 最多 n. 大部分,大多数",
    "example": null,
    "category": "a.",
    "id": 989
  },
  {
    "word": "mother",
    "phonetic": "/ˈmʌðə(r)/",
    "meaning": "母亲",
    "example": null,
    "category": "n.",
    "id": 990
  },
  {
    "word": "motor",
    "phonetic": "/ˈməʊtə(r)/",
    "meaning": "发动机，马达",
    "example": null,
    "category": "n.",
    "id": 991
  },
  {
    "word": "motorbike",
    "phonetic": "/ˈməʊtəbaɪk/",
    "meaning": "摩托车",
    "example": null,
    "category": "n.",
    "id": 992
  },
  {
    "word": "motorcycle",
    "phonetic": "/'məʊtəsaikl/",
    "meaning": "摩托车",
    "example": null,
    "category": "n.",
    "id": 993
  },
  {
    "word": "mouse",
    "phonetic": "/maʊs/",
    "meaning": "鼠，耗子；（计算机）鼠标",
    "example": null,
    "category": "n.",
    "id": 994
  },
  {
    "word": "mouth",
    "phonetic": "/maʊθ/",
    "meaning": "嘴，口",
    "example": null,
    "category": "n.",
    "id": 995
  },
  {
    "word": "move",
    "phonetic": "/muːv/",
    "meaning": "移动，搬动，搬家",
    "example": null,
    "category": "v.",
    "id": 996
  },
  {
    "word": "movement",
    "phonetic": "/ˈmuːvmənt/",
    "meaning": "运动，活动",
    "example": null,
    "category": "n.",
    "id": 997
  },
  {
    "word": "movie",
    "phonetic": "/ˈmuːvɪ/",
    "meaning": "n.（口语）电影",
    "example": null,
    "category": "",
    "id": 998
  },
  {
    "word": "much",
    "phonetic": "/mʌtʃ/",
    "meaning": "a./ ad. 许多，大量，非常，更加",
    "example": null,
    "category": "",
    "id": 999
  },
  {
    "word": "multiply",
    "phonetic": "/ˈmʌltɪplaɪ/",
    "meaning": "乘；使相乘",
    "example": null,
    "category": "vt.",
    "id": 1000
  },
  {
    "word": "murder",
    "phonetic": "/ˈmɜːdə(r)/",
    "meaning": "谋杀",
    "example": null,
    "category": "vt.",
    "id": 1001
  },
  {
    "word": "museum",
    "phonetic": "/mjuːˈzɪəm/",
    "meaning": "博物馆，博物院",
    "example": null,
    "category": "n.",
    "id": 1002
  },
  {
    "word": "music",
    "phonetic": "/ˈmjuːzɪk/",
    "meaning": "音乐，乐曲",
    "example": null,
    "category": "n.",
    "id": 1003
  },
  {
    "word": "must",
    "phonetic": "/mʌst/",
    "meaning": "必须,应当;必定是",
    "example": null,
    "category": "v.",
    "id": 1004
  },
  {
    "word": "mutton",
    "phonetic": "/ˈmʌt(ə)n/",
    "meaning": "羊肉",
    "example": null,
    "category": "n.",
    "id": 1005
  },
  {
    "word": "my",
    "phonetic": "/maɪ/",
    "meaning": "我的",
    "example": null,
    "category": "pron.",
    "id": 1006
  },
  {
    "word": "myself",
    "phonetic": "/maɪˈself/",
    "meaning": "我自己",
    "example": null,
    "category": "pron.",
    "id": 1007
  },
  {
    "word": "nail",
    "phonetic": "/neɪl/",
    "meaning": "钉，钉子",
    "example": null,
    "category": "n.",
    "id": 1008
  },
  {
    "word": "name",
    "phonetic": "/neɪm/",
    "meaning": "名字,姓名,名称 vt. 命名,名叫",
    "example": null,
    "category": "n.",
    "id": 1009
  },
  {
    "word": "narrow",
    "phonetic": "/ˈnærəʊ/",
    "meaning": "狭窄的",
    "example": null,
    "category": "a.",
    "id": 1010
  },
  {
    "word": "nation",
    "phonetic": "/ˈneɪʃ(ə)n/",
    "meaning": "民族，国家",
    "example": null,
    "category": "n.",
    "id": 1011
  },
  {
    "word": "national",
    "phonetic": "/ˈnæʃən(ə)l/",
    "meaning": "国家的,全国性的，民族的",
    "example": null,
    "category": "a.",
    "id": 1012
  },
  {
    "word": "natural",
    "phonetic": "/ˈnætʃər(ə)l/",
    "meaning": "自然的",
    "example": null,
    "category": "a.",
    "id": 1013
  },
  {
    "word": "nature",
    "phonetic": "/ˈneɪtʃə(r)/",
    "meaning": "自然, 性质，种类",
    "example": null,
    "category": "n.",
    "id": 1014
  },
  {
    "word": "near",
    "phonetic": "/nɪə(r)/",
    "meaning": "近的 ad. 附近，邻近 prep. 在…附近，靠近",
    "example": null,
    "category": "a.",
    "id": 1015
  },
  {
    "word": "nearby",
    "phonetic": "/ˈnɪəbaɪ/",
    "meaning": "附近的",
    "example": null,
    "category": "a.",
    "id": 1016
  },
  {
    "word": "nearly",
    "phonetic": "/ˈnɪəlɪ/",
    "meaning": "将近，几乎",
    "example": null,
    "category": "ad.",
    "id": 1017
  },
  {
    "word": "neat",
    "phonetic": "/niːt/",
    "meaning": "整洁的；灵巧的",
    "example": null,
    "category": "a.",
    "id": 1018
  },
  {
    "word": "necessary",
    "phonetic": "/ˈnesisərɪ; (US) ˈnesəserɪ/",
    "meaning": "必需的，必要的",
    "example": null,
    "category": "a.",
    "id": 1019
  },
  {
    "word": "neck",
    "phonetic": "/nek/",
    "meaning": "颈，脖子",
    "example": null,
    "category": "n.",
    "id": 1020
  },
  {
    "word": "necklace",
    "phonetic": "/ˈneklɪs/",
    "meaning": "项链",
    "example": null,
    "category": "n.",
    "id": 1021
  },
  {
    "word": "necktie",
    "phonetic": "/ˈnektaɪ/",
    "meaning": "领带，领花",
    "example": null,
    "category": "n.",
    "id": 1022
  },
  {
    "word": "need",
    "phonetic": "/niːd/",
    "meaning": "需要,需求 aux.& v. 需要,必须",
    "example": null,
    "category": "n.",
    "id": 1023
  },
  {
    "word": "needle",
    "phonetic": "/niːd(ə)l/",
    "meaning": "针",
    "example": null,
    "category": "n.",
    "id": 1024
  },
  {
    "word": "neighbour",
    "phonetic": "/ˈneibə(r)/",
    "meaning": "邻居，邻人",
    "example": null,
    "category": "n.",
    "id": 1025
  },
  {
    "word": "neighbourhood",
    "phonetic": "/'neibəhud/",
    "meaning": "四邻；邻近地区",
    "example": null,
    "category": "n.",
    "id": 1026
  },
  {
    "word": "neither",
    "phonetic": "/ˈnaɪðə(r), ˈniːðə(r)/",
    "meaning": "a.（两者）都不;也不",
    "example": null,
    "category": "",
    "id": 1027
  },
  {
    "word": "nervous",
    "phonetic": "/ˈnəːvəs/",
    "meaning": "紧张不安的",
    "example": null,
    "category": "a.",
    "id": 1028
  },
  {
    "word": "nest",
    "phonetic": "/nest/",
    "meaning": "巢；窝",
    "example": null,
    "category": "n.",
    "id": 1029
  },
  {
    "word": "net",
    "phonetic": "/net/",
    "meaning": "网",
    "example": null,
    "category": "n.",
    "id": 1030
  },
  {
    "word": "network",
    "phonetic": "/ˈnetwəːk/",
    "meaning": "网络，网状系统",
    "example": null,
    "category": "n.",
    "id": 1031
  },
  {
    "word": "never",
    "phonetic": "/ˈnevə(r)/",
    "meaning": "决不，从来没有",
    "example": null,
    "category": "ad.",
    "id": 1032
  },
  {
    "word": "new",
    "phonetic": "/njuː; (US) nuː/",
    "meaning": "新的；新鲜的",
    "example": null,
    "category": "a.",
    "id": 1033
  },
  {
    "word": "news",
    "phonetic": "/njuːz; (US) nuːz/",
    "meaning": "新闻，消息",
    "example": null,
    "category": "n.",
    "id": 1034
  },
  {
    "word": "newspaper",
    "phonetic": "/njuːzˈpeɪpə(r); (US) nuːzˈpeɪpə(r)/",
    "meaning": "报纸",
    "example": null,
    "category": "n.",
    "id": 1035
  },
  {
    "word": "next",
    "phonetic": "/nekst/",
    "meaning": "下一个的,紧挨着的，隔壁的 ad. 随后，然后，下一步",
    "example": null,
    "category": "a.",
    "id": 1036
  },
  {
    "word": "nice",
    "phonetic": "/naɪs/",
    "meaning": "令人愉快;好的,漂亮的",
    "example": null,
    "category": "a.",
    "id": 1037
  },
  {
    "word": "niece",
    "phonetic": "/niːs/",
    "meaning": "侄女，甥女",
    "example": null,
    "category": "n.",
    "id": 1038
  },
  {
    "word": "night",
    "phonetic": "/naɪt/",
    "meaning": "夜；夜间",
    "example": null,
    "category": "n.",
    "id": 1039
  },
  {
    "word": "nine",
    "phonetic": "/naɪn/",
    "meaning": "九",
    "example": null,
    "category": "num.",
    "id": 1040
  },
  {
    "word": "nineteen",
    "phonetic": "/naɪnˈtiːn/",
    "meaning": "十九",
    "example": null,
    "category": "num.",
    "id": 1041
  },
  {
    "word": "ninety",
    "phonetic": "/ˈnaɪntɪ/",
    "meaning": "九十",
    "example": null,
    "category": "num.",
    "id": 1042
  },
  {
    "word": "ninth",
    "phonetic": "/naɪnθ/",
    "meaning": "第九",
    "example": null,
    "category": "num.",
    "id": 1043
  },
  {
    "word": "no",
    "phonetic": "/nəʊ/",
    "meaning": "不,不是 a. 没有,无,不",
    "example": null,
    "category": "ad.",
    "id": 1044
  },
  {
    "word": "nobody",
    "phonetic": "/ˈnəʊbədɪ/",
    "meaning": "渺小人物 pron. 没有人，谁也不",
    "example": null,
    "category": "n.",
    "id": 1045
  },
  {
    "word": "nod",
    "phonetic": "/nɔd/",
    "meaning": "点头",
    "example": null,
    "category": "vi.",
    "id": 1046
  },
  {
    "word": "noise",
    "phonetic": "/nɔɪz/",
    "meaning": "声音，噪声，喧闹声",
    "example": null,
    "category": "n.",
    "id": 1047
  },
  {
    "word": "noisily",
    "phonetic": "/'nɔɪzɪlɪ/",
    "meaning": "喧闹地",
    "example": null,
    "category": "ad.",
    "id": 1048
  },
  {
    "word": "noisy",
    "phonetic": "/ˈnɔɪzɪ/",
    "meaning": "喧闹的，嘈杂的",
    "example": null,
    "category": "a.",
    "id": 1049
  },
  {
    "word": "none",
    "phonetic": "/nʌn/",
    "meaning": "无任何东西, 无一人",
    "example": null,
    "category": "pron.",
    "id": 1050
  },
  {
    "word": "noodle",
    "phonetic": "/ˈnuːd(ə)l/",
    "meaning": "面条",
    "example": null,
    "category": "n.",
    "id": 1051
  },
  {
    "word": "noon",
    "phonetic": "/nuːn/",
    "meaning": "中午，正午",
    "example": null,
    "category": "n.",
    "id": 1052
  },
  {
    "word": "nor",
    "phonetic": "/nɔː(r)/",
    "meaning": "也不",
    "example": null,
    "category": "conj.",
    "id": 1053
  },
  {
    "word": "normal",
    "phonetic": "/ˈnɔːm(ə)l/",
    "meaning": "n.& a. 正常的（状态）",
    "example": null,
    "category": "",
    "id": 1054
  },
  {
    "word": "north",
    "phonetic": "/nɔːθ/",
    "meaning": "北的;朝北的 ad. 向（在,从）北方 n. 北;北方;北部",
    "example": null,
    "category": "a.",
    "id": 1055
  },
  {
    "word": "northeast",
    "phonetic": "/nɔ:θ'i:st/",
    "meaning": "东北（部）",
    "example": null,
    "category": "n.",
    "id": 1056
  },
  {
    "word": "northern",
    "phonetic": "/ˈnɔːð(ə)n/",
    "meaning": "北方的，北部的",
    "example": null,
    "category": "a.",
    "id": 1057
  },
  {
    "word": "northwest",
    "phonetic": "/nɔ:θ'west/",
    "meaning": "西北",
    "example": null,
    "category": "n.",
    "id": 1058
  },
  {
    "word": "nose",
    "phonetic": "/nəʊz/",
    "meaning": "鼻子",
    "example": null,
    "category": "n.",
    "id": 1059
  },
  {
    "word": "not",
    "phonetic": "/nɔt/",
    "meaning": "不，没",
    "example": null,
    "category": "ad.",
    "id": 1060
  },
  {
    "word": "note",
    "phonetic": "/nəʊt/",
    "meaning": "便条，笔记，注释；钞票，音调",
    "example": null,
    "category": "n.",
    "id": 1061
  },
  {
    "word": "notebook",
    "phonetic": "/ˈnəʊtbʊk/",
    "meaning": "笔记簿",
    "example": null,
    "category": "n.",
    "id": 1062
  },
  {
    "word": "nothing",
    "phonetic": "/ˈnʌθɪŋ/",
    "meaning": "没有东西,没有什么",
    "example": null,
    "category": "n.",
    "id": 1063
  },
  {
    "word": "notice",
    "phonetic": "/ˈnəʊtɪs/",
    "meaning": "布告，通告；注意 vt. 注意，注意到",
    "example": null,
    "category": "n.",
    "id": 1064
  },
  {
    "word": "novel",
    "phonetic": "/ˈnɔv(ə)l/",
    "meaning": "n.（长篇）小说",
    "example": null,
    "category": "",
    "id": 1065
  },
  {
    "word": "November",
    "phonetic": "/nəʊˈvembə(r)/",
    "meaning": "11月",
    "example": null,
    "category": "n.",
    "id": 1066
  },
  {
    "word": "now",
    "phonetic": "/naʊ/",
    "meaning": "现在",
    "example": null,
    "category": "ad.",
    "id": 1067
  },
  {
    "word": "nowhere",
    "phonetic": "/ˈnəʊweə(r); (US) ˈnəʊhweər/",
    "meaning": "任何地方都不,无处",
    "example": null,
    "category": "ad.",
    "id": 1068
  },
  {
    "word": "number",
    "phonetic": "/ˈnʌmbə(r)/",
    "meaning": "数,数字,号码,数量",
    "example": null,
    "category": "n.",
    "id": 1069
  },
  {
    "word": "nurse",
    "phonetic": "/nəːs/",
    "meaning": "护士；保姆；保育员",
    "example": null,
    "category": "n.",
    "id": 1070
  },
  {
    "word": "obey",
    "phonetic": "/əˈbeɪ/",
    "meaning": "服从，顺从，听从",
    "example": null,
    "category": "v.",
    "id": 1071
  },
  {
    "word": "object",
    "phonetic": "/ˈɔbdʒɪkt/",
    "meaning": "物，物体；宾语",
    "example": null,
    "category": "n.",
    "id": 1072
  },
  {
    "word": "ocean",
    "phonetic": "/ˈəʊʃ(ə)n/",
    "meaning": "海洋",
    "example": null,
    "category": "n.",
    "id": 1073
  },
  {
    "word": "Oceania",
    "phonetic": "",
    "meaning": "大洋洲",
    "example": null,
    "category": "n.",
    "id": 1074
  },
  {
    "word": "October",
    "phonetic": "/ɔkˈtəʊbə(r)/",
    "meaning": "10月",
    "example": null,
    "category": "n.",
    "id": 1075
  },
  {
    "word": "of",
    "phonetic": "/ɔv, əv; (US) ˈɔf/",
    "meaning": "….的",
    "example": null,
    "category": "prep.",
    "id": 1076
  },
  {
    "word": "off",
    "phonetic": "/ɔːf/",
    "meaning": "离开,脱离,（走）开",
    "example": null,
    "category": "prep.",
    "id": 1077
  },
  {
    "word": "office",
    "phonetic": "/ˈɔfɪs/",
    "meaning": "办公室",
    "example": null,
    "category": "n.",
    "id": 1078
  },
  {
    "word": "often",
    "phonetic": "/ˈɔf(ə)n; (US) ˈɔːfn/",
    "meaning": "经常，常常",
    "example": null,
    "category": "ad.",
    "id": 1079
  },
  {
    "word": "oh",
    "phonetic": "/əʊ/",
    "meaning": "哦！啊！",
    "example": null,
    "category": "int.",
    "id": 1080
  },
  {
    "word": "oil",
    "phonetic": "/ɔɪl/",
    "meaning": "油",
    "example": null,
    "category": "n.",
    "id": 1081
  },
  {
    "word": "old",
    "phonetic": "/əʊld/",
    "meaning": "老的，旧的",
    "example": null,
    "category": "a.",
    "id": 1082
  },
  {
    "word": "Olympic",
    "phonetic": "/əʊˈlɪmpɪk ɡeɪms/",
    "meaning": "奥运会",
    "example": null,
    "category": "n.",
    "id": 1083
  },
  {
    "word": "on",
    "phonetic": "/ɔn/",
    "meaning": "在…上（时），关于 ad. 接通；进行下去；（电灯）开",
    "example": null,
    "category": "prep.",
    "id": 1084
  },
  {
    "word": "once",
    "phonetic": "/wʌns/",
    "meaning": "n.& ad. 一次,一度,从前 conj. 一旦",
    "example": null,
    "category": "",
    "id": 1085
  },
  {
    "word": "one",
    "phonetic": "/wʌn/",
    "meaning": "一（个，只…）",
    "example": null,
    "category": "pron.",
    "id": 1086
  },
  {
    "word": "oneself",
    "phonetic": "/wʌnˈself/",
    "meaning": "自己；自身",
    "example": null,
    "category": "pron.",
    "id": 1087
  },
  {
    "word": "only",
    "phonetic": "/ˈəʊnlɪ/",
    "meaning": "惟一的，仅有的 ad. 仅仅，只，才",
    "example": null,
    "category": "a.",
    "id": 1088
  },
  {
    "word": "onto",
    "phonetic": "/ˈɔntʊ/",
    "meaning": "到…的上面",
    "example": null,
    "category": "prep.",
    "id": 1089
  },
  {
    "word": "open",
    "phonetic": "/ˈəʊpən/",
    "meaning": "开着的,开的 vt. 开,打开",
    "example": null,
    "category": "a.",
    "id": 1090
  },
  {
    "word": "opera",
    "phonetic": "/ˈɔpərə/",
    "meaning": "歌剧",
    "example": null,
    "category": "n.",
    "id": 1091
  },
  {
    "word": "opinion",
    "phonetic": "/əˈpɪnjən/",
    "meaning": "看法，见解",
    "example": null,
    "category": "n.",
    "id": 1092
  },
  {
    "word": "or",
    "phonetic": "/ə(r), ɔː(r)/",
    "meaning": "或；就是；否则",
    "example": null,
    "category": "conj.",
    "id": 1093
  },
  {
    "word": "orange",
    "phonetic": "/ˈɔrɪndʒ; (US) ˈɔːr-/",
    "meaning": "橘子，橙子，橘汁 a. 橘色的，橙色的",
    "example": null,
    "category": "n.",
    "id": 1094
  },
  {
    "word": "order",
    "phonetic": "/ˈɔːdə(r)/",
    "meaning": "定购，定货；点菜n. 顺序",
    "example": null,
    "category": "vt.",
    "id": 1095
  },
  {
    "word": "ordinary",
    "phonetic": "/ˈɔːdɪnərɪ; (US) ˈɔːrdənerɪ/",
    "meaning": "普通的，平常的",
    "example": null,
    "category": "a.",
    "id": 1096
  },
  {
    "word": "other",
    "phonetic": "/ˈʌðə(r)/",
    "meaning": "别人，别的东西 a. 别的,另外的",
    "example": null,
    "category": "pron.",
    "id": 1097
  },
  {
    "word": "our",
    "phonetic": "/ˈaʊə(r)/",
    "meaning": "我们的",
    "example": null,
    "category": "pron.",
    "id": 1098
  },
  {
    "word": "ourselves",
    "phonetic": "/aʊəˈselvz/",
    "meaning": "我们自己",
    "example": null,
    "category": "pron.",
    "id": 1099
  },
  {
    "word": "out",
    "phonetic": "/aʊt/",
    "meaning": "出外;在外,向外;熄",
    "example": null,
    "category": "ad.",
    "id": 1100
  },
  {
    "word": "outdoors",
    "phonetic": "/aʊtˈdɔːz/",
    "meaning": "在户外, 在野外",
    "example": null,
    "category": "ad.",
    "id": 1101
  },
  {
    "word": "outside",
    "phonetic": "/aʊtˈsaɪd/",
    "meaning": "外面 ad. 在外面；向外面 prep. 在…外面",
    "example": null,
    "category": "n.",
    "id": 1102
  },
  {
    "word": "over",
    "phonetic": "/ˈəʊvə(r)/",
    "meaning": "在…上方,越过,遍及 ad. 翻倒,遍布,越过,结束",
    "example": null,
    "category": "prep.",
    "id": 1103
  },
  {
    "word": "overcoat",
    "phonetic": "/ˈəʊvəkəʊt/",
    "meaning": "大衣",
    "example": null,
    "category": "n.",
    "id": 1104
  },
  {
    "word": "own",
    "phonetic": "/əʊn/",
    "meaning": "自己的 v. 拥有,所有",
    "example": null,
    "category": "a.",
    "id": 1105
  },
  {
    "word": "Pacific",
    "phonetic": "/pəˈsɪfɪk/",
    "meaning": "太平洋的",
    "example": null,
    "category": "a.",
    "id": 1106
  },
  {
    "word": "the",
    "phonetic": "/ðə pəˈsɪfɪkˈəʊʃ (ə)n/",
    "meaning": "太平洋",
    "example": null,
    "category": "",
    "id": 1107
  },
  {
    "word": "pack",
    "phonetic": "/pæk/",
    "meaning": "包,捆;（猎犬、野兽的）一群 v. (为运输或储存而)打包",
    "example": null,
    "category": "n.",
    "id": 1108
  },
  {
    "word": "packet",
    "phonetic": "/ˈpækɪt/",
    "meaning": "小包裹，袋",
    "example": null,
    "category": "n.",
    "id": 1109
  },
  {
    "word": "page",
    "phonetic": "/peɪdʒ/",
    "meaning": "页，页码",
    "example": null,
    "category": "n.",
    "id": 1110
  },
  {
    "word": "pain",
    "phonetic": "/peɪn/",
    "meaning": "疼痛，疼",
    "example": null,
    "category": "n.",
    "id": 1111
  },
  {
    "word": "painful",
    "phonetic": "/ˈpeɪnfʊl/",
    "meaning": "使痛的，使痛苦的",
    "example": null,
    "category": "a.",
    "id": 1112
  },
  {
    "word": "paint",
    "phonetic": "/peɪnt/",
    "meaning": "油漆 vt. 油漆,粉刷,绘画",
    "example": null,
    "category": "n.",
    "id": 1113
  },
  {
    "word": "painter",
    "phonetic": "/ˈpeɪntə(r)/",
    "meaning": "绘画者,（油）画家",
    "example": null,
    "category": "n.",
    "id": 1114
  },
  {
    "word": "painting",
    "phonetic": "/ˈpeɪntɪŋ/",
    "meaning": "油画，水彩画",
    "example": null,
    "category": "n.",
    "id": 1115
  },
  {
    "word": "pair",
    "phonetic": "/peə(r)/",
    "meaning": "一双，一对",
    "example": null,
    "category": "n.",
    "id": 1116
  },
  {
    "word": "palace",
    "phonetic": "/ˈpælɪs/",
    "meaning": "宫，宫殿",
    "example": null,
    "category": "n.",
    "id": 1117
  },
  {
    "word": "pale",
    "phonetic": "/peɪl/",
    "meaning": "苍白的，灰白的",
    "example": null,
    "category": "a.",
    "id": 1118
  },
  {
    "word": "pan",
    "phonetic": "/pæn/",
    "meaning": "平底锅",
    "example": null,
    "category": "n.",
    "id": 1119
  },
  {
    "word": "panda",
    "phonetic": "/ˈpændə/",
    "meaning": "熊猫",
    "example": null,
    "category": "n.",
    "id": 1120
  },
  {
    "word": "paper",
    "phonetic": "/ˈpeɪpə(r)/",
    "meaning": "纸；报纸",
    "example": null,
    "category": "n.",
    "id": 1121
  },
  {
    "word": "pardon",
    "phonetic": "/ˈpɑːd(ə)n/",
    "meaning": "原谅,宽恕,对不起",
    "example": null,
    "category": "n.",
    "id": 1122
  },
  {
    "word": "parent",
    "phonetic": "/ˈpeərənt/",
    "meaning": "父(母)，双亲",
    "example": null,
    "category": "n.",
    "id": 1123
  },
  {
    "word": "park",
    "phonetic": "/pɑːk/",
    "meaning": "公园 vt. 停放（汽车）",
    "example": null,
    "category": "n.",
    "id": 1124
  },
  {
    "word": "parking",
    "phonetic": "/ˈpɑːkɪŋ/",
    "meaning": "停车",
    "example": null,
    "category": "n.",
    "id": 1125
  },
  {
    "word": "parrot",
    "phonetic": "/ˈpærət/",
    "meaning": "鹦鹉",
    "example": null,
    "category": "n.",
    "id": 1126
  },
  {
    "word": "part",
    "phonetic": "/pɑːt/",
    "meaning": "部分；角色；部件；零件 a. 局部的；部分的",
    "example": null,
    "category": "n.",
    "id": 1127
  },
  {
    "word": "party",
    "phonetic": "/ˈpɑːtɪ/",
    "meaning": "聚会，晚会；党派",
    "example": null,
    "category": "n.",
    "id": 1128
  },
  {
    "word": "pass",
    "phonetic": "/pɑːs; (US) pæs/",
    "meaning": "传，递；经过；通过",
    "example": null,
    "category": "vt.",
    "id": 1129
  },
  {
    "word": "passage",
    "phonetic": "/ˈpæsɪdʒ/",
    "meaning": "n.（文章等的）一节，一段；通道；走廊",
    "example": null,
    "category": "",
    "id": 1130
  },
  {
    "word": "passenger",
    "phonetic": "/ˈpæsɪndʒə(r)/",
    "meaning": "乘客，旅客",
    "example": null,
    "category": "n.",
    "id": 1131
  },
  {
    "word": "passport",
    "phonetic": "/ˈpɑːspɔːt; (US) ˈpæspɔːt/",
    "meaning": "护照",
    "example": null,
    "category": "n.",
    "id": 1132
  },
  {
    "word": "past",
    "phonetic": "/pɑːst; (US) pæst/",
    "meaning": "过 n. 过去，昔日，往事 prep. 过…，走过某处",
    "example": null,
    "category": "ad.",
    "id": 1133
  },
  {
    "word": "path",
    "phonetic": "/pɑːθ; (US) pæθ/",
    "meaning": "小道，小径",
    "example": null,
    "category": "n.",
    "id": 1134
  },
  {
    "word": "patient",
    "phonetic": "/ˈpeɪʃ(ə)nt/",
    "meaning": "病人",
    "example": null,
    "category": "n.",
    "id": 1135
  },
  {
    "word": "pause",
    "phonetic": "/pɔːz/",
    "meaning": "n.& vi. 中止，暂停；停止",
    "example": null,
    "category": "",
    "id": 1136
  },
  {
    "word": "pay",
    "phonetic": "/peɪ/",
    "meaning": "(paid, paid) v. 付钱，给…报酬 n. 工资",
    "example": null,
    "category": "",
    "id": 1137
  },
  {
    "word": "pea",
    "phonetic": "/piː/",
    "meaning": "豌豆",
    "example": null,
    "category": "n.",
    "id": 1138
  },
  {
    "word": "peace",
    "phonetic": "/piːs/",
    "meaning": "和平",
    "example": null,
    "category": "n.",
    "id": 1139
  },
  {
    "word": "pear",
    "phonetic": "/peə(r)/",
    "meaning": "梨子，梨树",
    "example": null,
    "category": "n.",
    "id": 1140
  },
  {
    "word": "pen",
    "phonetic": "/pen/",
    "meaning": "钢笔，笔",
    "example": null,
    "category": "n.",
    "id": 1141
  },
  {
    "word": "pencil",
    "phonetic": "/ˈpens(ə)l/",
    "meaning": "铅笔",
    "example": null,
    "category": "n.",
    "id": 1142
  },
  {
    "word": "penny",
    "phonetic": "/ˈpenɪ/",
    "meaning": "(英复pence) n.（英）便士；美分",
    "example": null,
    "category": "",
    "id": 1143
  },
  {
    "word": "people",
    "phonetic": "/ˈpiːp(ə)l/",
    "meaning": "人，人们；人民",
    "example": null,
    "category": "n.",
    "id": 1144
  },
  {
    "word": "pepper",
    "phonetic": "/ˈpepə(r)/",
    "meaning": "胡椒粉",
    "example": null,
    "category": "n.",
    "id": 1145
  },
  {
    "word": "performance",
    "phonetic": "/pəˈfɔːməns/",
    "meaning": "演出，表演",
    "example": null,
    "category": "n.",
    "id": 1146
  },
  {
    "word": "perhaps",
    "phonetic": "/pəˈhæps/",
    "meaning": "可能，或",
    "example": null,
    "category": "ad.",
    "id": 1147
  },
  {
    "word": "permit",
    "phonetic": "/pəˈmɪt/",
    "meaning": "许可,允许;执照 n. 许可证",
    "example": null,
    "category": "vt.",
    "id": 1148
  },
  {
    "word": "person",
    "phonetic": "/ˈpɜːs(ə)n/",
    "meaning": "人",
    "example": null,
    "category": "n.",
    "id": 1149
  },
  {
    "word": "personal",
    "phonetic": "/ˈpɜːsən(ə)l/",
    "meaning": "个人的，私人的",
    "example": null,
    "category": "a.",
    "id": 1150
  },
  {
    "word": "pet",
    "phonetic": "/pet/",
    "meaning": "宠物，爱畜",
    "example": null,
    "category": "n.",
    "id": 1151
  },
  {
    "word": "phone",
    "phonetic": "/fəʊn/",
    "meaning": "打电话 n. 电话，电话机",
    "example": null,
    "category": "v.",
    "id": 1152
  },
  {
    "word": "photo",
    "phonetic": "/ˈfəʊtəʊ/",
    "meaning": "照片",
    "example": null,
    "category": "n.",
    "id": 1153
  },
  {
    "word": "photograph",
    "phonetic": "/ˈfəʊtəʊɡrɑːf; (US) -ɡræf/",
    "meaning": "照片",
    "example": null,
    "category": "n.",
    "id": 1154
  },
  {
    "word": "phrase",
    "phonetic": "/freɪz/",
    "meaning": "短语；习惯用语",
    "example": null,
    "category": "n.",
    "id": 1155
  },
  {
    "word": "physicist",
    "phonetic": "/ˈfɪzɪsɪst/",
    "meaning": "物理学家",
    "example": null,
    "category": "n.",
    "id": 1156
  },
  {
    "word": "physics",
    "phonetic": "/ˈfɪzɪks/",
    "meaning": "物理（学）",
    "example": null,
    "category": "n.",
    "id": 1157
  },
  {
    "word": "pianist",
    "phonetic": "/ˈpɪənist/",
    "meaning": "钢琴家",
    "example": null,
    "category": "n.",
    "id": 1158
  },
  {
    "word": "piano",
    "phonetic": "/pɪˈænəʊ/",
    "meaning": "钢琴",
    "example": null,
    "category": "n.",
    "id": 1159
  },
  {
    "word": "pick",
    "phonetic": "/pɪk/",
    "meaning": "拾起，采集；挑选",
    "example": null,
    "category": "v.",
    "id": 1160
  },
  {
    "word": "picnic",
    "phonetic": "/ˈpɪknɪk/",
    "meaning": "n.& v. 野餐",
    "example": null,
    "category": "",
    "id": 1161
  },
  {
    "word": "pie",
    "phonetic": "/paɪ/",
    "meaning": "甜馅饼",
    "example": null,
    "category": "n.",
    "id": 1162
  },
  {
    "word": "piece",
    "phonetic": "/pɪs/",
    "meaning": "一块（片，张，件…）",
    "example": null,
    "category": "n.",
    "id": 1163
  },
  {
    "word": "pig",
    "phonetic": "/pɪg/",
    "meaning": "猪",
    "example": null,
    "category": "n.",
    "id": 1164
  },
  {
    "word": "pile",
    "phonetic": "/paɪl/",
    "meaning": "n./v. 堆",
    "example": null,
    "category": "",
    "id": 1165
  },
  {
    "word": "pill",
    "phonetic": "/pɪl/",
    "meaning": "药丸，药片",
    "example": null,
    "category": "n.",
    "id": 1166
  },
  {
    "word": "pilot",
    "phonetic": "/ˈpaɪlət/",
    "meaning": "飞行员",
    "example": null,
    "category": "n.",
    "id": 1167
  },
  {
    "word": "pink",
    "phonetic": "/pɪŋk/",
    "meaning": "粉红色的",
    "example": null,
    "category": "a.",
    "id": 1168
  },
  {
    "word": "pioneer",
    "phonetic": "/paɪəˈnɪə(r)/",
    "meaning": "先锋，开拓者",
    "example": null,
    "category": "n.",
    "id": 1169
  },
  {
    "word": "pity",
    "phonetic": "/ˈpɪtɪ/",
    "meaning": "怜悯，同情",
    "example": null,
    "category": "n.",
    "id": 1170
  },
  {
    "word": "place",
    "phonetic": "/pleɪs/",
    "meaning": "地方，处所 v. 放置，安置，安排",
    "example": null,
    "category": "n.",
    "id": 1171
  },
  {
    "word": "plan",
    "phonetic": "/plæn/",
    "meaning": "n.& v. 计划，打算",
    "example": null,
    "category": "",
    "id": 1172
  },
  {
    "word": "plane",
    "phonetic": "/pleɪn/",
    "meaning": "飞机",
    "example": null,
    "category": "n.",
    "id": 1173
  },
  {
    "word": "planet",
    "phonetic": "/ˈplænɪt/",
    "meaning": "行星",
    "example": null,
    "category": "n.",
    "id": 1174
  },
  {
    "word": "plant",
    "phonetic": "/plɑːnt; (US) ˈplænt/",
    "meaning": "种植，播种 n. 植物",
    "example": null,
    "category": "vt.",
    "id": 1175
  },
  {
    "word": "plastic",
    "phonetic": "/ˈplæstɪk/",
    "meaning": "塑料的",
    "example": null,
    "category": "a.",
    "id": 1176
  },
  {
    "word": "plate",
    "phonetic": "/pleɪt/",
    "meaning": "板；片；牌；盘子；盆子",
    "example": null,
    "category": "n.",
    "id": 1177
  },
  {
    "word": "play",
    "phonetic": "/pleɪ/",
    "meaning": "玩；打（球）；游戏；播放 n. 玩耍，戏剧",
    "example": null,
    "category": "v.",
    "id": 1178
  },
  {
    "word": "playground",
    "phonetic": "/ˈpleɪgraʊnd/",
    "meaning": "操场，运动场",
    "example": null,
    "category": "n.",
    "id": 1179
  },
  {
    "word": "pleasant",
    "phonetic": "/ˈplezənt/",
    "meaning": "令人愉快的，舒适的",
    "example": null,
    "category": "a.",
    "id": 1180
  },
  {
    "word": "please",
    "phonetic": "/pliːz/",
    "meaning": "请,使人高兴,使人满意",
    "example": null,
    "category": "v.",
    "id": 1181
  },
  {
    "word": "pleased",
    "phonetic": "/pliːzd/",
    "meaning": "高兴的",
    "example": null,
    "category": "a.",
    "id": 1182
  },
  {
    "word": "pleasure",
    "phonetic": "/ˈpleʒə/",
    "meaning": "高兴，愉快",
    "example": null,
    "category": "n.",
    "id": 1183
  },
  {
    "word": "plenty",
    "phonetic": "/plenti/",
    "meaning": "充足，大量",
    "example": null,
    "category": "n.",
    "id": 1184
  },
  {
    "word": "plus",
    "phonetic": "/plʌs/",
    "meaning": "加，加上",
    "example": null,
    "category": "prep.",
    "id": 1185
  },
  {
    "word": "pocket",
    "phonetic": "/ˈpɔkɪt/",
    "meaning": "n.（衣服的）口袋",
    "example": null,
    "category": "",
    "id": 1186
  },
  {
    "word": "point",
    "phonetic": "/pɔɪnt/",
    "meaning": "指，指向 n. 点；分数",
    "example": null,
    "category": "v.",
    "id": 1187
  },
  {
    "word": "police",
    "phonetic": "/pəˈliːs/",
    "meaning": "警察，警务人员",
    "example": null,
    "category": "n.",
    "id": 1188
  },
  {
    "word": "policeman",
    "phonetic": "/pəˈliːsmən/",
    "meaning": "警察,巡警 policewoman ( -women) n. 女警察",
    "example": null,
    "category": "n.",
    "id": 1189
  },
  {
    "word": "polite",
    "phonetic": "/pəˈlaɪt/",
    "meaning": "有礼貌的,有教养的",
    "example": null,
    "category": "a.",
    "id": 1190
  },
  {
    "word": "politics",
    "phonetic": "/ˈpɔlɪtɪks/",
    "meaning": "政治",
    "example": null,
    "category": "n.",
    "id": 1191
  },
  {
    "word": "pollute",
    "phonetic": "/pəˈluːt/",
    "meaning": "污染",
    "example": null,
    "category": "vt.",
    "id": 1192
  },
  {
    "word": "pool",
    "phonetic": "/puːl/",
    "meaning": "水塘，水池",
    "example": null,
    "category": "n.",
    "id": 1193
  },
  {
    "word": "poor",
    "phonetic": "/pʊə(r)/",
    "meaning": "贫穷；可怜；不好的,差的",
    "example": null,
    "category": "a.",
    "id": 1194
  },
  {
    "word": "pop",
    "phonetic": "/pɔp/",
    "meaning": "(口语) （音乐、艺术等）大众的，通俗的",
    "example": null,
    "category": "a.",
    "id": 1195
  },
  {
    "word": "popular",
    "phonetic": "/ˈpɔpjʊlə(r)/",
    "meaning": "流行,大众,受欢迎的",
    "example": null,
    "category": "a.",
    "id": 1196
  },
  {
    "word": "population",
    "phonetic": "/pɔpjʊˈleɪʃ(ə)n/",
    "meaning": "人口，人数",
    "example": null,
    "category": "n.",
    "id": 1197
  },
  {
    "word": "pork",
    "phonetic": "/pɔːk/",
    "meaning": "猪肉",
    "example": null,
    "category": "n.",
    "id": 1198
  },
  {
    "word": "porridge",
    "phonetic": "/ˈpɔrɪdʒ; (US) ˈpɔːrɪdʒ/",
    "meaning": "稀饭，粥",
    "example": null,
    "category": "n.",
    "id": 1199
  },
  {
    "word": "port",
    "phonetic": "/pɔːt/",
    "meaning": "港口，码头",
    "example": null,
    "category": "n.",
    "id": 1200
  },
  {
    "word": "possible",
    "phonetic": "/ˈpɔsɪb(ə)l/",
    "meaning": "可能的",
    "example": null,
    "category": "a.",
    "id": 1201
  },
  {
    "word": "post",
    "phonetic": "/pəʊst/",
    "meaning": "邮政，邮寄，邮件 v. 投寄；邮寄",
    "example": null,
    "category": "n.",
    "id": 1202
  },
  {
    "word": "postage",
    "phonetic": "/ˈpəʊstɪdʒ/",
    "meaning": "邮费",
    "example": null,
    "category": "n.",
    "id": 1203
  },
  {
    "word": "postbox",
    "phonetic": "/ˈpəʊstbɔks/",
    "meaning": "邮箱",
    "example": null,
    "category": "n.",
    "id": 1204
  },
  {
    "word": "postcard",
    "phonetic": "/ˈpəʊstkɑːd/",
    "meaning": "明信片",
    "example": null,
    "category": "n.",
    "id": 1205
  },
  {
    "word": "postcode",
    "phonetic": "/ˈpəʊstkəʊd/",
    "meaning": "（英）邮政编码",
    "example": null,
    "category": "n.",
    "id": 1206
  },
  {
    "word": "postman",
    "phonetic": "/ˈpəʊstmən/",
    "meaning": "邮递员",
    "example": null,
    "category": "n.",
    "id": 1207
  },
  {
    "word": "potato",
    "phonetic": "/pəʊteɪtəʊ/",
    "meaning": "土豆，马铃薯",
    "example": null,
    "category": "n.",
    "id": 1208
  },
  {
    "word": "potential",
    "phonetic": "/pəʊtenʃ (ə)l/",
    "meaning": "潜在的，可能的",
    "example": null,
    "category": "a.",
    "id": 1209
  },
  {
    "word": "pound",
    "phonetic": "/paund/",
    "meaning": "磅；英镑",
    "example": null,
    "category": "n.",
    "id": 1210
  },
  {
    "word": "pour",
    "phonetic": "/paʊ(r)/",
    "meaning": "倾泻，不断流出",
    "example": null,
    "category": "vi.",
    "id": 1211
  },
  {
    "word": "praise",
    "phonetic": "/preɪz/",
    "meaning": "n.& vt. 赞扬，表扬",
    "example": null,
    "category": "",
    "id": 1212
  },
  {
    "word": "prefer",
    "phonetic": "/prɪˈfəː (r)/",
    "meaning": "vt.宁愿（选择）,更喜欢",
    "example": null,
    "category": "",
    "id": 1213
  },
  {
    "word": "prepare",
    "phonetic": "/prɪˈpeə(r)/",
    "meaning": "准备,预备,调制,配制",
    "example": null,
    "category": "vt.",
    "id": 1214
  },
  {
    "word": "present",
    "phonetic": "/ˈprez(ə)nt/",
    "meaning": "出现的，出席的 n. 礼物，赠品 vt. 呈奉，奉送",
    "example": null,
    "category": "a.",
    "id": 1215
  },
  {
    "word": "press",
    "phonetic": "/pres/",
    "meaning": "压,按 n. 新闻界,出版社",
    "example": null,
    "category": "vt.",
    "id": 1216
  },
  {
    "word": "pretty",
    "phonetic": "/ˈprɪtɪ/",
    "meaning": "漂亮的，俊俏的",
    "example": null,
    "category": "a.",
    "id": 1217
  },
  {
    "word": "prevent",
    "phonetic": "/prɪˈvent/",
    "meaning": "防止, 预防",
    "example": null,
    "category": "vt.",
    "id": 1218
  },
  {
    "word": "price",
    "phonetic": "/praɪs/",
    "meaning": "价格，价钱",
    "example": null,
    "category": "n.",
    "id": 1219
  },
  {
    "word": "pride",
    "phonetic": "/praɪd/",
    "meaning": "自豪，骄傲",
    "example": null,
    "category": "n.",
    "id": 1220
  },
  {
    "word": "print",
    "phonetic": "/prɪnt/",
    "meaning": "印刷",
    "example": null,
    "category": "vt.",
    "id": 1221
  },
  {
    "word": "prize",
    "phonetic": "/praɪz/",
    "meaning": "奖赏，奖品",
    "example": null,
    "category": "n.",
    "id": 1222
  },
  {
    "word": "probable",
    "phonetic": "/ˈprɔbəb(ə)l/",
    "meaning": "很可能,很有希望的",
    "example": null,
    "category": "a.",
    "id": 1223
  },
  {
    "word": "probably",
    "phonetic": "/ˈprɔbəb(ə)lɪ/",
    "meaning": "很可能，大概",
    "example": null,
    "category": "ad.",
    "id": 1224
  },
  {
    "word": "problem",
    "phonetic": "/ˈprɔbləm/",
    "meaning": "问题，难题",
    "example": null,
    "category": "n.",
    "id": 1225
  },
  {
    "word": "produce",
    "phonetic": "/prəˈdjuːs; (US) -ˈduːs/",
    "meaning": "生产；制造",
    "example": null,
    "category": "vt.",
    "id": 1226
  },
  {
    "word": "professor",
    "phonetic": "/prəˈfesə(r)/",
    "meaning": "教授",
    "example": null,
    "category": "n.",
    "id": 1227
  },
  {
    "word": "programme",
    "phonetic": "/ˈprəʊɡræm/",
    "meaning": "节目；项目",
    "example": null,
    "category": "n.",
    "id": 1228
  },
  {
    "word": "progress",
    "phonetic": "/ˈprəʊɡres; (US) ˈprɔɡres/",
    "meaning": "进步,上进 vi. 进展,进行",
    "example": null,
    "category": "n.",
    "id": 1229
  },
  {
    "word": "promise",
    "phonetic": "/ˈprɔmɪs/",
    "meaning": "n.& vi. 答应，允诺",
    "example": null,
    "category": "",
    "id": 1230
  },
  {
    "word": "pronounce",
    "phonetic": "/prəˈnaʊns/",
    "meaning": "发音",
    "example": null,
    "category": "vt.",
    "id": 1231
  },
  {
    "word": "pronunciation",
    "phonetic": "/prənʌnsɪˈeɪʃ(ə)n/",
    "meaning": "发音",
    "example": null,
    "category": "n.",
    "id": 1232
  },
  {
    "word": "proper",
    "phonetic": "/ˈprɔpə(r)/",
    "meaning": "恰当的，合适的",
    "example": null,
    "category": "a.",
    "id": 1233
  },
  {
    "word": "protect",
    "phonetic": "/prəˈtekt/",
    "meaning": "保护",
    "example": null,
    "category": "vt.",
    "id": 1234
  },
  {
    "word": "proud",
    "phonetic": "/praʊd/",
    "meaning": "自豪的；骄傲的",
    "example": null,
    "category": "a.",
    "id": 1235
  },
  {
    "word": "provide",
    "phonetic": "/prəˈvaɪd/",
    "meaning": "提供",
    "example": null,
    "category": "vt.",
    "id": 1236
  },
  {
    "word": "province",
    "phonetic": "/ˈprɔvɪns/",
    "meaning": "省",
    "example": null,
    "category": "n.",
    "id": 1237
  },
  {
    "word": "public",
    "phonetic": "/ˈpʌblɪk/",
    "meaning": "公共,公众的 n. 公众",
    "example": null,
    "category": "a.",
    "id": 1238
  },
  {
    "word": "pull",
    "phonetic": "/pʊl/",
    "meaning": "拉，拖 n. 拉力，引力",
    "example": null,
    "category": "",
    "id": 1239
  },
  {
    "word": "pupil",
    "phonetic": "/ˈpjuːpɪl/",
    "meaning": "n.（小）学生",
    "example": null,
    "category": "",
    "id": 1240
  },
  {
    "word": "purple",
    "phonetic": "/ˈpɜːp(ə)l/",
    "meaning": "/ a. 紫色",
    "example": null,
    "category": "n.",
    "id": 1241
  },
  {
    "word": "purse",
    "phonetic": "/pɜːs/",
    "meaning": "钱包",
    "example": null,
    "category": "n.",
    "id": 1242
  },
  {
    "word": "push",
    "phonetic": "/pʊʃ/",
    "meaning": "n.& v. 推",
    "example": null,
    "category": "",
    "id": 1243
  },
  {
    "word": "put",
    "phonetic": "/pʊt/",
    "meaning": "放，摆",
    "example": null,
    "category": "vt.",
    "id": 1244
  },
  {
    "word": "quarrel",
    "phonetic": "/ˈkwɔrəl; (US) ˈkwɔːrəl/",
    "meaning": "争吵，吵架",
    "example": null,
    "category": "vi.",
    "id": 1245
  },
  {
    "word": "quarter",
    "phonetic": "/ˈkwɔːtə(r)/",
    "meaning": "四分之一，一刻钟",
    "example": null,
    "category": "n.",
    "id": 1246
  },
  {
    "word": "queen",
    "phonetic": "/kwiːn/",
    "meaning": "皇后，女王",
    "example": null,
    "category": "n.",
    "id": 1247
  },
  {
    "word": "question",
    "phonetic": "/ˈkwestʃ(ə)n/",
    "meaning": "询问 n. 问题",
    "example": null,
    "category": "vt.",
    "id": 1248
  },
  {
    "word": "queue",
    "phonetic": "/kjuː/",
    "meaning": "行列，长队",
    "example": null,
    "category": "n.",
    "id": 1249
  },
  {
    "word": "quick",
    "phonetic": "/kwɪk/",
    "meaning": "快；敏捷的；急剧的",
    "example": null,
    "category": "a.",
    "id": 1250
  },
  {
    "word": "quiet",
    "phonetic": "/ˈkwaɪət/",
    "meaning": "安静的；寂静的",
    "example": null,
    "category": "a.",
    "id": 1251
  },
  {
    "word": "quilt",
    "phonetic": "/kwɪlt/",
    "meaning": "被子；被状物",
    "example": null,
    "category": "n.",
    "id": 1252
  },
  {
    "word": "quit",
    "phonetic": "/kwɪt/",
    "meaning": "离任，离校，戒掉",
    "example": null,
    "category": "v.",
    "id": 1253
  },
  {
    "word": "quite",
    "phonetic": "/kwaɪt/",
    "meaning": "完全，十分",
    "example": null,
    "category": "ad.",
    "id": 1254
  },
  {
    "word": "quiz",
    "phonetic": "/kwɪz/",
    "meaning": "测验，小型考试",
    "example": null,
    "category": "n.",
    "id": 1255
  },
  {
    "word": "rabbit",
    "phonetic": "/ˈræbɪt/",
    "meaning": "兔，家兔",
    "example": null,
    "category": "n.",
    "id": 1256
  },
  {
    "word": "race",
    "phonetic": "/reɪs/",
    "meaning": "种族，民族 v.（速度）竞赛，比赛 n. 赛跑，竞赛",
    "example": null,
    "category": "n.",
    "id": 1257
  },
  {
    "word": "radio",
    "phonetic": "/reɪdɪəʊ/",
    "meaning": "无线电，收音机",
    "example": null,
    "category": "n.",
    "id": 1258
  },
  {
    "word": "rail",
    "phonetic": "/reɪl/",
    "meaning": "铁路",
    "example": null,
    "category": "n.",
    "id": 1259
  },
  {
    "word": "railway",
    "phonetic": "/ˈreɪlweɪ/",
    "meaning": "铁路；铁道",
    "example": null,
    "category": "n.",
    "id": 1260
  },
  {
    "word": "rain",
    "phonetic": "/reɪn/",
    "meaning": "雨，雨水 vi. 下雨",
    "example": null,
    "category": "n.",
    "id": 1261
  },
  {
    "word": "raincoat",
    "phonetic": "/ˈreɪnkəʊt/",
    "meaning": "雨衣",
    "example": null,
    "category": "n.",
    "id": 1262
  },
  {
    "word": "rainy",
    "phonetic": "/ˈreɪnɪ/",
    "meaning": "下雨的；多雨的",
    "example": null,
    "category": "a.",
    "id": 1263
  },
  {
    "word": "raise",
    "phonetic": "/reɪz/",
    "meaning": "使升高；饲养",
    "example": null,
    "category": "vt.",
    "id": 1264
  },
  {
    "word": "rat",
    "phonetic": "/ræt/",
    "meaning": "老鼠",
    "example": null,
    "category": "n.",
    "id": 1265
  },
  {
    "word": "rather",
    "phonetic": "/ˈrɑːðə; (US) ˈræðər/",
    "meaning": "相当，宁可",
    "example": null,
    "category": "ad.",
    "id": 1266
  },
  {
    "word": "reach",
    "phonetic": "/riːtʃ/",
    "meaning": "到达,伸手(脚)够到",
    "example": null,
    "category": "v.",
    "id": 1267
  },
  {
    "word": "read",
    "phonetic": "/riːd/",
    "meaning": "读；朗读",
    "example": null,
    "category": "v.",
    "id": 1268
  },
  {
    "word": "ready",
    "phonetic": "/ˈredɪ/",
    "meaning": "准备好的",
    "example": null,
    "category": "a.",
    "id": 1269
  },
  {
    "word": "real",
    "phonetic": "/riːl/",
    "meaning": "真实的，确实的",
    "example": null,
    "category": "a.",
    "id": 1270
  },
  {
    "word": "realise",
    "phonetic": "/ˈrɪəlaɪz/",
    "meaning": "认识到,实现",
    "example": null,
    "category": "vt.",
    "id": 1271
  },
  {
    "word": "really",
    "phonetic": "/ˈrɪəlɪ/",
    "meaning": "真正地；到底；确实",
    "example": null,
    "category": "ad.",
    "id": 1272
  },
  {
    "word": "reason",
    "phonetic": "/ˈriːz(ə)n/",
    "meaning": "理由,原因",
    "example": null,
    "category": "n.",
    "id": 1273
  },
  {
    "word": "receive",
    "phonetic": "/rɪˈsiːv/",
    "meaning": "收到，得到",
    "example": null,
    "category": "v.",
    "id": 1274
  },
  {
    "word": "recent",
    "phonetic": "/ˈriːsənt/",
    "meaning": "近来的，最近的",
    "example": null,
    "category": "a.",
    "id": 1275
  },
  {
    "word": "record",
    "phonetic": "/ˈrekɔːd; (US) ˈrekərd/",
    "meaning": "记录；唱片",
    "example": null,
    "category": "n.",
    "id": 1276
  },
  {
    "word": "recycle",
    "phonetic": "/riːˈsaɪk(ə)l/",
    "meaning": "回收；再循环",
    "example": null,
    "category": "vt.",
    "id": 1277
  },
  {
    "word": "red",
    "phonetic": "/red/",
    "meaning": "红色 a. 红色的",
    "example": null,
    "category": "n.",
    "id": 1278
  },
  {
    "word": "refuse",
    "phonetic": "/rɪˈfjuːz/",
    "meaning": "拒绝，不愿",
    "example": null,
    "category": "vi.",
    "id": 1279
  },
  {
    "word": "regard",
    "phonetic": "/rɪˈɡɑːd/",
    "meaning": "把…看作",
    "example": null,
    "category": "v.",
    "id": 1280
  },
  {
    "word": "regret",
    "phonetic": "/rɪˈɡret/",
    "meaning": "n./ vt. 可惜,遗憾;痛惜;哀悼",
    "example": null,
    "category": "",
    "id": 1281
  },
  {
    "word": "regulation",
    "phonetic": "/reɡjʊˈleɪʃ(ə)n/",
    "meaning": "规则，规章",
    "example": null,
    "category": "n.",
    "id": 1282
  },
  {
    "word": "relax",
    "phonetic": "/rɪˈlæks/",
    "meaning": "v.（使）放松，轻松",
    "example": null,
    "category": "",
    "id": 1283
  },
  {
    "word": "relay",
    "phonetic": "/ˈriːleɪ/",
    "meaning": "接力，接替人，中转 v. 接替，补充；转运",
    "example": null,
    "category": "n.",
    "id": 1284
  },
  {
    "word": "remain",
    "phonetic": "/rɪˈmeɪn/",
    "meaning": "余下,留下 vi. 保持,仍是",
    "example": null,
    "category": "vt.",
    "id": 1285
  },
  {
    "word": "remember",
    "phonetic": "/rɪˈmembə(r)/",
    "meaning": "记得，想起",
    "example": null,
    "category": "v.",
    "id": 1286
  },
  {
    "word": "rent",
    "phonetic": "/rent/",
    "meaning": "n.& v. 租金",
    "example": null,
    "category": "",
    "id": 1287
  },
  {
    "word": "repair",
    "phonetic": "/rɪˈpeə(r)/",
    "meaning": "n.& vt. 修理；修补",
    "example": null,
    "category": "",
    "id": 1288
  },
  {
    "word": "repeat",
    "phonetic": "/rɪˈpiːt/",
    "meaning": "重说，重做",
    "example": null,
    "category": "vt.",
    "id": 1289
  },
  {
    "word": "reply",
    "phonetic": "/rɪˈplaɪ/",
    "meaning": "回答，答复",
    "example": null,
    "category": "n.",
    "id": 1290
  },
  {
    "word": "report",
    "phonetic": "/rɪˈpɔːt/",
    "meaning": "n.& v. 报道，报告",
    "example": null,
    "category": "",
    "id": 1291
  },
  {
    "word": "research",
    "phonetic": "/rɪˈsɜːtʃ/",
    "meaning": "研究，调查",
    "example": null,
    "category": "n.",
    "id": 1292
  },
  {
    "word": "rest",
    "phonetic": "/rest/",
    "meaning": "休息；剩余的部分，其余的人（物） vi. 休息，歇息",
    "example": null,
    "category": "n.",
    "id": 1293
  },
  {
    "word": "restaurant",
    "phonetic": "/ˈrestərɔnt; (US) ˈrestərənt/",
    "meaning": "饭馆, 饭店",
    "example": null,
    "category": "n.",
    "id": 1294
  },
  {
    "word": "result",
    "phonetic": "/rɪˈzʌlt/",
    "meaning": "结果，效果",
    "example": null,
    "category": "n.",
    "id": 1295
  },
  {
    "word": "return",
    "phonetic": "/rɪˈtɜːn/",
    "meaning": "归还",
    "example": null,
    "category": "v.",
    "id": 1296
  },
  {
    "word": "review",
    "phonetic": "/rɪˈvjuː/",
    "meaning": "重新调查；回顾；复习 n. 复查；复习；评论",
    "example": null,
    "category": "vt.",
    "id": 1297
  },
  {
    "word": "rice",
    "phonetic": "/raɪs/",
    "meaning": "稻米；米饭",
    "example": null,
    "category": "n.",
    "id": 1298
  },
  {
    "word": "rich",
    "phonetic": "/rɪtʃ/",
    "meaning": "富裕的，有钱的",
    "example": null,
    "category": "a.",
    "id": 1299
  },
  {
    "word": "riddle",
    "phonetic": "/ˈrɪd(ə)l/",
    "meaning": "谜(语)",
    "example": null,
    "category": "n.",
    "id": 1300
  },
  {
    "word": "ride",
    "phonetic": "/raɪd/",
    "meaning": "骑（马、自行车）；乘车 n. 乘车旅行",
    "example": null,
    "category": "v.",
    "id": 1301
  },
  {
    "word": "right",
    "phonetic": "/raɪt/",
    "meaning": "权利 a. 对,正确的 ad. 正确地,恰恰,完全地 a. 右,右边的",
    "example": null,
    "category": "n.",
    "id": 1302
  },
  {
    "word": "ring",
    "phonetic": "/rɪŋ/",
    "meaning": "v.（钟、铃等）响；打电话 n. 铃声 n. 环形物（如环、圈、戒指等）",
    "example": null,
    "category": "",
    "id": 1303
  },
  {
    "word": "rise",
    "phonetic": "/raɪz/",
    "meaning": "上升，上涨",
    "example": null,
    "category": "vi.",
    "id": 1304
  },
  {
    "word": "river",
    "phonetic": "/ˈrɪvə(r)/",
    "meaning": "江；河；水道；巨流",
    "example": null,
    "category": "n.",
    "id": 1305
  },
  {
    "word": "road",
    "phonetic": "/rəud/",
    "meaning": "路，道路",
    "example": null,
    "category": "n.",
    "id": 1306
  },
  {
    "word": "rob",
    "phonetic": "/rɔb/",
    "meaning": "抢夺，抢劫",
    "example": null,
    "category": "v.",
    "id": 1307
  },
  {
    "word": "robot",
    "phonetic": "/ˈrəubɔt/",
    "meaning": "机器人",
    "example": null,
    "category": "n.",
    "id": 1308
  },
  {
    "word": "rock",
    "phonetic": "/rɔk/",
    "meaning": "岩石,大石头 vt. 摇,摇晃",
    "example": null,
    "category": "n.",
    "id": 1309
  },
  {
    "word": "room",
    "phonetic": "/rum/",
    "meaning": "房间,室;空间;地方",
    "example": null,
    "category": "n.",
    "id": 1310
  },
  {
    "word": "rose",
    "phonetic": "/rəuz/",
    "meaning": "玫瑰花",
    "example": null,
    "category": "n.",
    "id": 1311
  },
  {
    "word": "rough",
    "phonetic": "/rʌf/",
    "meaning": "粗糙的，粗略的",
    "example": null,
    "category": "a.",
    "id": 1312
  },
  {
    "word": "round",
    "phonetic": "/raund/",
    "meaning": "转过来 prep. 环绕一周，围着 a. 圆的；球形的",
    "example": null,
    "category": "ad.",
    "id": 1313
  },
  {
    "word": "row",
    "phonetic": "/rəu/",
    "meaning": "n.（一）排,（一）行 v. 划船",
    "example": null,
    "category": "",
    "id": 1314
  },
  {
    "word": "rubber",
    "phonetic": "/ˈrʌbə(r)/",
    "meaning": "橡胶；合成橡胶",
    "example": null,
    "category": "n.",
    "id": 1315
  },
  {
    "word": "rubbish",
    "phonetic": "/ˈrʌbiːʃ/",
    "meaning": "垃圾；废物",
    "example": null,
    "category": "n.",
    "id": 1316
  },
  {
    "word": "rude",
    "phonetic": "/ruːd/",
    "meaning": "无理的, 粗鲁的",
    "example": null,
    "category": "a.",
    "id": 1317
  },
  {
    "word": "rule",
    "phonetic": "/ruːl/",
    "meaning": "规则,规定 vt. 统治,支配",
    "example": null,
    "category": "n.",
    "id": 1318
  },
  {
    "word": "ruler",
    "phonetic": "/ˈruːlə(r)/",
    "meaning": "统治者；直尺",
    "example": null,
    "category": "n.",
    "id": 1319
  },
  {
    "word": "run",
    "phonetic": "/rʌn/",
    "meaning": "跑，奔跑；（颜色）褪色",
    "example": null,
    "category": "vi.",
    "id": 1320
  },
  {
    "word": "runner",
    "phonetic": "/ˈrʌnə(r)/",
    "meaning": "赛跑者；操作者；滑行装置",
    "example": null,
    "category": "n.",
    "id": 1321
  },
  {
    "word": "rush",
    "phonetic": "/rʌʃ/",
    "meaning": "冲，奔跑",
    "example": null,
    "category": "vi.",
    "id": 1322
  },
  {
    "word": "Russia",
    "phonetic": "/ˈrʌʃə/",
    "meaning": "俄罗斯，俄国",
    "example": null,
    "category": "n.",
    "id": 1323
  },
  {
    "word": "Russian",
    "phonetic": "/ˈrʌʃ(ə)n/",
    "meaning": "俄国人的，俄语的 n. 俄国人，俄语",
    "example": null,
    "category": "a.",
    "id": 1324
  },
  {
    "word": "sad",
    "phonetic": "/sæd/",
    "meaning": "a.（使人）悲伤的",
    "example": null,
    "category": "",
    "id": 1325
  },
  {
    "word": "safe",
    "phonetic": "/seɪf/",
    "meaning": "安全的 n. 保险柜",
    "example": null,
    "category": "a.",
    "id": 1326
  },
  {
    "word": "safety",
    "phonetic": "/ˈseɪftɪ/",
    "meaning": "安全，保险",
    "example": null,
    "category": "n.",
    "id": 1327
  },
  {
    "word": "sail",
    "phonetic": "/seɪl/",
    "meaning": "航行 v. 航行，开航",
    "example": null,
    "category": "n.",
    "id": 1328
  },
  {
    "word": "salad",
    "phonetic": "/ˈsæləd/",
    "meaning": "色拉",
    "example": null,
    "category": "n.",
    "id": 1329
  },
  {
    "word": "sale",
    "phonetic": "/seɪl/",
    "meaning": "卖，出售",
    "example": null,
    "category": "n.",
    "id": 1330
  },
  {
    "word": "salesgirl",
    "phonetic": "/ˈseɪlzɡɜːl/",
    "meaning": "女售货员",
    "example": null,
    "category": "n.",
    "id": 1331
  },
  {
    "word": "salesman",
    "phonetic": "/ˈseɪlzmən/",
    "meaning": "男售货员",
    "example": null,
    "category": "n.",
    "id": 1332
  },
  {
    "word": "saleswoman",
    "phonetic": "/seɪlzwʊmən/",
    "meaning": "女售货员",
    "example": null,
    "category": "n.",
    "id": 1333
  },
  {
    "word": "salt",
    "phonetic": "/sɔːlt, sɔlt/",
    "meaning": "盐",
    "example": null,
    "category": "n.",
    "id": 1334
  },
  {
    "word": "same",
    "phonetic": "/seɪm/",
    "meaning": "同样的事 a. 同样的,同一",
    "example": null,
    "category": "n.",
    "id": 1335
  },
  {
    "word": "sand",
    "phonetic": "/sænd/",
    "meaning": "沙，沙子",
    "example": null,
    "category": "n.",
    "id": 1336
  },
  {
    "word": "sandwich",
    "phonetic": "/ˈsænwɪdʒ/",
    "meaning": "三明治（夹心面包片）",
    "example": null,
    "category": "n.",
    "id": 1337
  },
  {
    "word": "satellite",
    "phonetic": "/ˈsætəlaɪt/",
    "meaning": "卫星",
    "example": null,
    "category": "n.",
    "id": 1338
  },
  {
    "word": "satisfaction",
    "phonetic": "/sætɪsˈfækʃ(ə)n/",
    "meaning": "满意",
    "example": null,
    "category": "n.",
    "id": 1339
  },
  {
    "word": "satisfy",
    "phonetic": "/ˈsætɪsfaɪ/",
    "meaning": "满足，使满意",
    "example": null,
    "category": "vt.",
    "id": 1340
  },
  {
    "word": "Saturday",
    "phonetic": "/ˈsætədɪ/",
    "meaning": "星期六",
    "example": null,
    "category": "n.",
    "id": 1341
  },
  {
    "word": "save",
    "phonetic": "/seɪv/",
    "meaning": "救，挽救，节省",
    "example": null,
    "category": "vt.",
    "id": 1342
  },
  {
    "word": "say",
    "phonetic": "/seɪ/",
    "meaning": "说，讲",
    "example": null,
    "category": "vt.",
    "id": 1343
  },
  {
    "word": "scenery",
    "phonetic": "/ˈsiːnərɪ/",
    "meaning": "风景，景色，风光",
    "example": null,
    "category": "n.",
    "id": 1344
  },
  {
    "word": "school",
    "phonetic": "/skuːl/",
    "meaning": "学校",
    "example": null,
    "category": "n.",
    "id": 1345
  },
  {
    "word": "schoolbag",
    "phonetic": "/'sku:lbæg/",
    "meaning": "书包",
    "example": null,
    "category": "n.",
    "id": 1346
  },
  {
    "word": "schoolmate",
    "phonetic": "/ˈskuːlmeɪt/",
    "meaning": "同校同学",
    "example": null,
    "category": "n.",
    "id": 1347
  },
  {
    "word": "science",
    "phonetic": "/ˈsaɪəns/",
    "meaning": "科学，自然科学",
    "example": null,
    "category": "n.",
    "id": 1348
  },
  {
    "word": "scientific",
    "phonetic": "/saɪənˈtɪfɪk/",
    "meaning": "科学的",
    "example": null,
    "category": "a.",
    "id": 1349
  },
  {
    "word": "scientist",
    "phonetic": "/ˈsaɪəntɪst/",
    "meaning": "科学家",
    "example": null,
    "category": "n.",
    "id": 1350
  },
  {
    "word": "scissors",
    "phonetic": "/ˈsɪzəz/",
    "meaning": "剪刀，剪子",
    "example": null,
    "category": "n.",
    "id": 1351
  },
  {
    "word": "score",
    "phonetic": "/skɔː(r)/",
    "meaning": "n.& v. 得分，分数,二十",
    "example": null,
    "category": "",
    "id": 1352
  },
  {
    "word": "screen",
    "phonetic": "/skriːn/",
    "meaning": "幕，荧光屏",
    "example": null,
    "category": "n.",
    "id": 1353
  },
  {
    "word": "sea",
    "phonetic": "/siː/",
    "meaning": "海，海洋",
    "example": null,
    "category": "n.",
    "id": 1354
  },
  {
    "word": "seagull",
    "phonetic": "/ˈsiːɡʌl/",
    "meaning": "海鸥",
    "example": null,
    "category": "n.",
    "id": 1355
  },
  {
    "word": "search",
    "phonetic": "/sɜːtʃ/",
    "meaning": "n.& v. 搜寻，搜查",
    "example": null,
    "category": "",
    "id": 1356
  },
  {
    "word": "season",
    "phonetic": "/ˈsiːz(ə)n/",
    "meaning": "季；季节",
    "example": null,
    "category": "n.",
    "id": 1357
  },
  {
    "word": "seat",
    "phonetic": "/siːt/",
    "meaning": "座位，座",
    "example": null,
    "category": "n.",
    "id": 1358
  },
  {
    "word": "second",
    "phonetic": "/ˈsekənd/",
    "meaning": "秒 num. 第二 a. 第二的",
    "example": null,
    "category": "n.",
    "id": 1359
  },
  {
    "word": "secondhand",
    "phonetic": "/'sekənd'hænd/",
    "meaning": "二手货; 旧货",
    "example": null,
    "category": "n.",
    "id": 1360
  },
  {
    "word": "secret",
    "phonetic": "/ˈsiːkrɪt/",
    "meaning": "秘密，内情",
    "example": null,
    "category": "n.",
    "id": 1361
  },
  {
    "word": "secretary",
    "phonetic": "/ˈsekrətərɪ/",
    "meaning": "秘书；书记",
    "example": null,
    "category": "n.",
    "id": 1362
  },
  {
    "word": "see",
    "phonetic": "/siː/",
    "meaning": "看见，看到；领会；拜会",
    "example": null,
    "category": "vt.",
    "id": 1363
  },
  {
    "word": "seem",
    "phonetic": "/siːm/",
    "meaning": "似乎，好像",
    "example": null,
    "category": "v.",
    "id": 1364
  },
  {
    "word": "seldom",
    "phonetic": "/ˈseldəm/",
    "meaning": "很少，不常",
    "example": null,
    "category": "ad.",
    "id": 1365
  },
  {
    "word": "sell",
    "phonetic": "/sel/",
    "meaning": "卖，售",
    "example": null,
    "category": "v.",
    "id": 1366
  },
  {
    "word": "send",
    "phonetic": "/send/",
    "meaning": "打发，派遣；送，邮寄",
    "example": null,
    "category": "v.",
    "id": 1367
  },
  {
    "word": "sentence",
    "phonetic": "/ˈsent(ə)ns/",
    "meaning": "句子",
    "example": null,
    "category": "n.",
    "id": 1368
  },
  {
    "word": "separate",
    "phonetic": "/ˈsepərət/",
    "meaning": "使分开，使分离 a. 单独的，分开的",
    "example": null,
    "category": "v.",
    "id": 1369
  },
  {
    "word": "September",
    "phonetic": "/səpˈtembə(r)/",
    "meaning": "9月",
    "example": null,
    "category": "n.",
    "id": 1370
  },
  {
    "word": "serious",
    "phonetic": "/ˈsɪərɪəs/",
    "meaning": "严肃的,严重的,认真的",
    "example": null,
    "category": "a.",
    "id": 1371
  },
  {
    "word": "servant",
    "phonetic": "/ˈsɜːvənt/",
    "meaning": "仆人，佣人",
    "example": null,
    "category": "n.",
    "id": 1372
  },
  {
    "word": "serve",
    "phonetic": "/sɜːv/",
    "meaning": "招待（顾客等）,服务",
    "example": null,
    "category": "vt.",
    "id": 1373
  },
  {
    "word": "set",
    "phonetic": "/set/",
    "meaning": "释放，安置 n. 装备，设备",
    "example": null,
    "category": "vt.",
    "id": 1374
  },
  {
    "word": "seven",
    "phonetic": "/ˈsev(ə)n/",
    "meaning": "七",
    "example": null,
    "category": "num.",
    "id": 1375
  },
  {
    "word": "seventeen",
    "phonetic": "/sevənˈtiːn/",
    "meaning": "十七",
    "example": null,
    "category": "num.",
    "id": 1376
  },
  {
    "word": "seventh",
    "phonetic": "/ˈsevənθ/",
    "meaning": "第七",
    "example": null,
    "category": "num.",
    "id": 1377
  },
  {
    "word": "seventy",
    "phonetic": "/ˈsevəntɪ/",
    "meaning": "七十",
    "example": null,
    "category": "num.",
    "id": 1378
  },
  {
    "word": "several",
    "phonetic": "/ˈsevr(ə)l/",
    "meaning": "几个,数个 a. 若干",
    "example": null,
    "category": "pron.",
    "id": 1379
  },
  {
    "word": "severe",
    "phonetic": "/sɪˈvɪə(r)/",
    "meaning": "极为恶劣,十分严重的",
    "example": null,
    "category": "a.",
    "id": 1380
  },
  {
    "word": "shall",
    "phonetic": "/ʃæl, ʃ(ə)l/",
    "meaning": "aux.（表示将来）将要，会；…好吗",
    "example": null,
    "category": "v.",
    "id": 1381
  },
  {
    "word": "shape",
    "phonetic": "/ʃeɪp/",
    "meaning": "形状，外形 v. 使成型，制造，塑造",
    "example": null,
    "category": "n.",
    "id": 1382
  },
  {
    "word": "share",
    "phonetic": "/ʃeə(r)/",
    "meaning": "分享，共同使用",
    "example": null,
    "category": "vt.",
    "id": 1383
  },
  {
    "word": "sharp",
    "phonetic": "/ʃɑːp/",
    "meaning": "锋利的，尖的",
    "example": null,
    "category": "a.",
    "id": 1384
  },
  {
    "word": "sharpen",
    "phonetic": "/ˈʃɑːpən/",
    "meaning": "v.（使）变锐利，削尖",
    "example": null,
    "category": "",
    "id": 1385
  },
  {
    "word": "sharpener",
    "phonetic": "/ˈʃɑːpənə(r)/",
    "meaning": "削尖用的器具",
    "example": null,
    "category": "n.",
    "id": 1386
  },
  {
    "word": "she",
    "phonetic": "/ʃiː/",
    "meaning": "她",
    "example": null,
    "category": "pron.",
    "id": 1387
  },
  {
    "word": "sheep",
    "phonetic": "/ʃiːp/",
    "meaning": "n.（绵）羊；羊皮；驯服者",
    "example": null,
    "category": "",
    "id": 1388
  },
  {
    "word": "sheet",
    "phonetic": "/ʃiːt/",
    "meaning": "成幅的薄片，薄板",
    "example": null,
    "category": "n.",
    "id": 1389
  },
  {
    "word": "shelf",
    "phonetic": "/ʃelf/",
    "meaning": "架子；搁板；格层；礁；陆架",
    "example": null,
    "category": "n.",
    "id": 1390
  },
  {
    "word": "shine",
    "phonetic": "/ʃaɪn/",
    "meaning": "光泽；光彩；阳光；晴天；光(亮)",
    "example": null,
    "category": "n.",
    "id": 1391
  },
  {
    "word": "shine",
    "phonetic": "/ʃaɪn/",
    "meaning": "发光；照耀；杰出；擦亮",
    "example": null,
    "category": "v.",
    "id": 1392
  },
  {
    "word": "ship",
    "phonetic": "/ʃɪp/",
    "meaning": "船，轮船 vi. 用船装运",
    "example": null,
    "category": "n.",
    "id": 1393
  },
  {
    "word": "shirt",
    "phonetic": "/ʃɜːt/",
    "meaning": "男衬衫",
    "example": null,
    "category": "n.",
    "id": 1394
  },
  {
    "word": "shoe",
    "phonetic": "/ʃuː/",
    "meaning": "鞋",
    "example": null,
    "category": "n.",
    "id": 1395
  },
  {
    "word": "shoot",
    "phonetic": "/ʃuːt/",
    "meaning": "(shot, shot) vt. 射击，射中，发射",
    "example": null,
    "category": "",
    "id": 1396
  },
  {
    "word": "shop",
    "phonetic": "/ʃɔp/",
    "meaning": "买东西 n. 商店,车间",
    "example": null,
    "category": "vi.",
    "id": 1397
  },
  {
    "word": "shopping",
    "phonetic": "/ˈʃɔpɪŋ/",
    "meaning": "买东西",
    "example": null,
    "category": "n.",
    "id": 1398
  },
  {
    "word": "shore",
    "phonetic": "/ʃɔː(r)/",
    "meaning": "滨，岸",
    "example": null,
    "category": "n.",
    "id": 1399
  },
  {
    "word": "short",
    "phonetic": "/ʃɔːt/",
    "meaning": "短的；矮的",
    "example": null,
    "category": "a.",
    "id": 1400
  },
  {
    "word": "should",
    "phonetic": "/ʃud/",
    "meaning": "mod. 应当，应该，会 v. aux. 会,应该（shall的过去时态）",
    "example": null,
    "category": "v.",
    "id": 1401
  },
  {
    "word": "shout",
    "phonetic": "/ˈʃaut/",
    "meaning": "n.& v. 喊，高声呼喊",
    "example": null,
    "category": "",
    "id": 1402
  },
  {
    "word": "show",
    "phonetic": "/ʃəʊ/",
    "meaning": "展示,展览（会）;演出",
    "example": null,
    "category": "n.",
    "id": 1403
  },
  {
    "word": "show",
    "phonetic": "/ʃəʊ/",
    "meaning": "(showed, shown 或 showed)  v. 给…看,出示,显示",
    "example": null,
    "category": "",
    "id": 1404
  },
  {
    "word": "shower",
    "phonetic": "/ˈʃaʊə(r)/",
    "meaning": "阵雨；淋浴",
    "example": null,
    "category": "n.",
    "id": 1405
  },
  {
    "word": "shut",
    "phonetic": "/ʃʌt/",
    "meaning": "/ n. 关上，封闭；禁闭；",
    "example": null,
    "category": "v.",
    "id": 1406
  },
  {
    "word": "shy",
    "phonetic": "/ʃaɪ/",
    "meaning": "害羞的",
    "example": null,
    "category": "a.",
    "id": 1407
  },
  {
    "word": "sick",
    "phonetic": "/sɪk/",
    "meaning": "有病,患病的,（想）呕吐",
    "example": null,
    "category": "a.",
    "id": 1408
  },
  {
    "word": "side",
    "phonetic": "/said/",
    "meaning": "边，旁边，面，侧面",
    "example": null,
    "category": "n.",
    "id": 1409
  },
  {
    "word": "silly",
    "phonetic": "/ˈsili/",
    "meaning": "傻的，愚蠢的",
    "example": null,
    "category": "a.",
    "id": 1410
  },
  {
    "word": "since",
    "phonetic": "/sins/",
    "meaning": "从那时以来 conj. 从…以来，…以后，由于 prep. 从…以来",
    "example": null,
    "category": "ad.",
    "id": 1411
  },
  {
    "word": "sing",
    "phonetic": "/siŋ/",
    "meaning": "唱，唱歌",
    "example": null,
    "category": "v.",
    "id": 1412
  },
  {
    "word": "singer",
    "phonetic": "/siŋə/",
    "meaning": "歌唱家，歌手",
    "example": null,
    "category": "n.",
    "id": 1413
  },
  {
    "word": "single",
    "phonetic": "/ˈsiŋɡ(ə)l/",
    "meaning": "单一的，单个的",
    "example": null,
    "category": "a.",
    "id": 1414
  },
  {
    "word": "sink",
    "phonetic": "/siŋk/",
    "meaning": "下沉；消沉  n. 洗涤槽；污水槽",
    "example": null,
    "category": "vi.",
    "id": 1415
  },
  {
    "word": "sir",
    "phonetic": "/səː (r)/",
    "meaning": "先生；阁下",
    "example": null,
    "category": "n.",
    "id": 1416
  },
  {
    "word": "sister",
    "phonetic": "/ˈsistə(r)/",
    "meaning": "姐；妹",
    "example": null,
    "category": "n.",
    "id": 1417
  },
  {
    "word": "sit",
    "phonetic": "/sɪt/",
    "meaning": "坐",
    "example": null,
    "category": "vi.",
    "id": 1418
  },
  {
    "word": "six",
    "phonetic": "/sɪks/",
    "meaning": "六",
    "example": null,
    "category": "num.",
    "id": 1419
  },
  {
    "word": "sixth",
    "phonetic": "/sɪksθ/",
    "meaning": "第六",
    "example": null,
    "category": "num.",
    "id": 1420
  },
  {
    "word": "sixty",
    "phonetic": "/ˈsɪkstɪ/",
    "meaning": "六十",
    "example": null,
    "category": "num.",
    "id": 1421
  },
  {
    "word": "sixteen",
    "phonetic": "/ˈsɪkstiːn/",
    "meaning": "十六",
    "example": null,
    "category": "num.",
    "id": 1422
  },
  {
    "word": "sixteenth",
    "phonetic": "/sɪksˈtiːnθ/",
    "meaning": "第十六",
    "example": null,
    "category": "num.",
    "id": 1423
  },
  {
    "word": "size",
    "phonetic": "/saiz/",
    "meaning": "尺寸，大小",
    "example": null,
    "category": "n.",
    "id": 1424
  },
  {
    "word": "skate",
    "phonetic": "/skeɪt/",
    "meaning": "溜冰，滑冰",
    "example": null,
    "category": "vi.",
    "id": 1425
  },
  {
    "word": "skateboard",
    "phonetic": "/ˈskeɪtbɔːd/",
    "meaning": "冰鞋，滑板",
    "example": null,
    "category": "n.",
    "id": 1426
  },
  {
    "word": "ski",
    "phonetic": "/skiː/",
    "meaning": "n.& vi. 滑雪板；滑雪",
    "example": null,
    "category": "",
    "id": 1427
  },
  {
    "word": "skirt",
    "phonetic": "/skɜːt/",
    "meaning": "女裙",
    "example": null,
    "category": "n.",
    "id": 1428
  },
  {
    "word": "sky",
    "phonetic": "/skaɪ/",
    "meaning": "天；天空",
    "example": null,
    "category": "n.",
    "id": 1429
  },
  {
    "word": "sleep",
    "phonetic": "/sliːp/",
    "meaning": "睡觉",
    "example": null,
    "category": "vi.",
    "id": 1430
  },
  {
    "word": "slow",
    "phonetic": "/sləʊ/",
    "meaning": "慢慢地，缓慢地",
    "example": null,
    "category": "ad.",
    "id": 1431
  },
  {
    "word": "small",
    "phonetic": "/smɔːl/",
    "meaning": "小的，少的",
    "example": null,
    "category": "a.",
    "id": 1432
  },
  {
    "word": "smell",
    "phonetic": "/smel/",
    "meaning": "嗅，闻到；发气味 n. 气味",
    "example": null,
    "category": "v.",
    "id": 1433
  },
  {
    "word": "smile",
    "phonetic": "/smaɪl/",
    "meaning": "n.& v. 微笑",
    "example": null,
    "category": "",
    "id": 1434
  },
  {
    "word": "smoke",
    "phonetic": "/sməʊk/",
    "meaning": "烟 v. 冒烟；吸烟",
    "example": null,
    "category": "n.",
    "id": 1435
  },
  {
    "word": "smoking",
    "phonetic": "/ˈsməʊkɪŋ/",
    "meaning": "吸烟,抽烟;冒烟",
    "example": null,
    "category": "n.",
    "id": 1436
  },
  {
    "word": "snake",
    "phonetic": "/sneɪk/",
    "meaning": "蛇 v. 蛇般爬行;蜿蜒行进",
    "example": null,
    "category": "n.",
    "id": 1437
  },
  {
    "word": "snow",
    "phonetic": "/snəʊ/",
    "meaning": "雪 vi.下雪",
    "example": null,
    "category": "n.",
    "id": 1438
  },
  {
    "word": "so",
    "phonetic": "/səʊ/",
    "meaning": "如此，这么；非常；同样 conj. 因此，所以",
    "example": null,
    "category": "ad.",
    "id": 1439
  },
  {
    "word": "soap",
    "phonetic": "/səʊp/",
    "meaning": "肥皂",
    "example": null,
    "category": "n.",
    "id": 1440
  },
  {
    "word": "society",
    "phonetic": "/səˈsaɪətɪ/",
    "meaning": "社会",
    "example": null,
    "category": "n.",
    "id": 1441
  },
  {
    "word": "sock",
    "phonetic": "/sɔk/",
    "meaning": "短袜",
    "example": null,
    "category": "n.",
    "id": 1442
  },
  {
    "word": "sofa",
    "phonetic": "/səʊfə/",
    "meaning": "n.（长）沙发",
    "example": null,
    "category": "",
    "id": 1443
  },
  {
    "word": "soft",
    "phonetic": "/sɔft; (US) sɔːft/",
    "meaning": "软的，柔和的",
    "example": null,
    "category": "a.",
    "id": 1444
  },
  {
    "word": "soil",
    "phonetic": "/sɔɪl/",
    "meaning": "土壤，土地",
    "example": null,
    "category": "n.",
    "id": 1445
  },
  {
    "word": "soldier",
    "phonetic": "/ˈsəʊldʒə(r)/",
    "meaning": "士兵，战士",
    "example": null,
    "category": "n.",
    "id": 1446
  },
  {
    "word": "some",
    "phonetic": "/sʌm/",
    "meaning": "一些，若干；有些；某一 pron. 若干，一些",
    "example": null,
    "category": "a.",
    "id": 1447
  },
  {
    "word": "somebody",
    "phonetic": "/ˈsʌmbɔdɪ/",
    "meaning": "某人；有人；有名气的人",
    "example": null,
    "category": "pron.",
    "id": 1448
  },
  {
    "word": "someone",
    "phonetic": "/ˈsʌmwʌn/",
    "meaning": "某一个人",
    "example": null,
    "category": "pron.",
    "id": 1449
  },
  {
    "word": "something",
    "phonetic": "/ˈsʌmθɪŋ/",
    "meaning": "某事；某物",
    "example": null,
    "category": "pron.",
    "id": 1450
  },
  {
    "word": "somewhere",
    "phonetic": "/ˈsʌmweə/",
    "meaning": "在某处",
    "example": null,
    "category": "ad.",
    "id": 1451
  },
  {
    "word": "son",
    "phonetic": "/sʌn/",
    "meaning": "儿子",
    "example": null,
    "category": "n.",
    "id": 1452
  },
  {
    "word": "song",
    "phonetic": "/sɔŋ/",
    "meaning": "歌唱；歌曲",
    "example": null,
    "category": "n.",
    "id": 1453
  },
  {
    "word": "soon",
    "phonetic": "/suːn/",
    "meaning": "不久,很快,一会儿",
    "example": null,
    "category": "ad.",
    "id": 1454
  },
  {
    "word": "sorry",
    "phonetic": "/ˈsɔrɪ/",
    "meaning": "对不起,抱歉;难过的",
    "example": null,
    "category": "a.",
    "id": 1455
  },
  {
    "word": "sound",
    "phonetic": "/saʊnd/",
    "meaning": "听起来,发出声音 n. 声音",
    "example": null,
    "category": "vi.",
    "id": 1456
  },
  {
    "word": "soup",
    "phonetic": "/suːp/",
    "meaning": "汤",
    "example": null,
    "category": "n.",
    "id": 1457
  },
  {
    "word": "sour",
    "phonetic": "/ˈsauə(r)/",
    "meaning": "酸的，馊的",
    "example": null,
    "category": "a.",
    "id": 1458
  },
  {
    "word": "south",
    "phonetic": "/ˈsauθ/",
    "meaning": "南(方)的 ad. 在南方；向南方 n. 南；南方；南部",
    "example": null,
    "category": "a.",
    "id": 1459
  },
  {
    "word": "southeast",
    "phonetic": "/‚sauθ'iːst/",
    "meaning": "东南",
    "example": null,
    "category": "n.",
    "id": 1460
  },
  {
    "word": "southern",
    "phonetic": "/'sʌð(ə)n/",
    "meaning": "南部的，南方的",
    "example": null,
    "category": "a.",
    "id": 1461
  },
  {
    "word": "southwest",
    "phonetic": "/sauθ'west/",
    "meaning": "西南",
    "example": null,
    "category": "n.",
    "id": 1462
  },
  {
    "word": "sow",
    "phonetic": "/səu/",
    "meaning": "播种",
    "example": null,
    "category": "vt.",
    "id": 1463
  },
  {
    "word": "space",
    "phonetic": "/speɪs/",
    "meaning": "空间",
    "example": null,
    "category": "n.",
    "id": 1464
  },
  {
    "word": "spaceship",
    "phonetic": "/ˈspeɪsʃɪp/",
    "meaning": "宇宙飞船",
    "example": null,
    "category": "n.",
    "id": 1465
  },
  {
    "word": "speak",
    "phonetic": "/ˈspiːk/",
    "meaning": "说，讲；谈话；发言",
    "example": null,
    "category": "v.",
    "id": 1466
  },
  {
    "word": "special",
    "phonetic": "/ˈspeʃ(ə)l/",
    "meaning": "特别的，专门的",
    "example": null,
    "category": "a.",
    "id": 1467
  },
  {
    "word": "speech",
    "phonetic": "/spiːtʃ/",
    "meaning": "演讲",
    "example": null,
    "category": "n.",
    "id": 1468
  },
  {
    "word": "speed",
    "phonetic": "/spiːd/",
    "meaning": "速度 v.（使）加速",
    "example": null,
    "category": "n.",
    "id": 1469
  },
  {
    "word": "spell",
    "phonetic": "/spel/",
    "meaning": "拼写",
    "example": null,
    "category": "vt.",
    "id": 1470
  },
  {
    "word": "spirit",
    "phonetic": "/ˈspɪrɪt/",
    "meaning": "精神",
    "example": null,
    "category": "n.",
    "id": 1471
  },
  {
    "word": "spit",
    "phonetic": "/spɪt/",
    "meaning": "吐唾沫；吐痰",
    "example": null,
    "category": "v.",
    "id": 1472
  },
  {
    "word": "spoon",
    "phonetic": "/spuːn/",
    "meaning": "匙, 调羹",
    "example": null,
    "category": "n.",
    "id": 1473
  },
  {
    "word": "sport",
    "phonetic": "/spɔːt/",
    "meaning": "体育运动，锻炼；(复，英)运动会",
    "example": null,
    "category": "n.",
    "id": 1474
  },
  {
    "word": "spot",
    "phonetic": "/spɔt/",
    "meaning": "斑点，污点；场所，地点 v. 沾上污渍，弄脏",
    "example": null,
    "category": "n.",
    "id": 1475
  },
  {
    "word": "spring",
    "phonetic": "/sprɪŋ/",
    "meaning": "春天,春季 n. 泉水,泉",
    "example": null,
    "category": "n.",
    "id": 1476
  },
  {
    "word": "square",
    "phonetic": "/skweə(r)/",
    "meaning": "广场 a. 平方的；方形的，宽而结实的（体格，肩膀）",
    "example": null,
    "category": "n.",
    "id": 1477
  },
  {
    "word": "stamp",
    "phonetic": "/stæmp/",
    "meaning": "邮票",
    "example": null,
    "category": "n.",
    "id": 1478
  },
  {
    "word": "stand",
    "phonetic": "/stænd/",
    "meaning": "站；立；停止；立场；地位；台；坛；摊",
    "example": null,
    "category": "n.",
    "id": 1479
  },
  {
    "word": "stand",
    "phonetic": "/stænd/",
    "meaning": "站；立；起立；坐落；经受；持久",
    "example": null,
    "category": "v.",
    "id": 1480
  },
  {
    "word": "star",
    "phonetic": "/stɑː(r)/",
    "meaning": "星，恒星",
    "example": null,
    "category": "n.",
    "id": 1481
  },
  {
    "word": "start",
    "phonetic": "/stɑːt/",
    "meaning": "开始，着手；出发",
    "example": null,
    "category": "v.",
    "id": 1482
  },
  {
    "word": "state",
    "phonetic": "/steɪt/",
    "meaning": "状态；情形；国家，（美国的）州",
    "example": null,
    "category": "n.",
    "id": 1483
  },
  {
    "word": "station",
    "phonetic": "/ˈsteɪʃ(ə)n/",
    "meaning": "站，所，车站；电台",
    "example": null,
    "category": "n.",
    "id": 1484
  },
  {
    "word": "stay",
    "phonetic": "/steɪ/",
    "meaning": "n.& vi. 停留，逗留，呆",
    "example": null,
    "category": "",
    "id": 1485
  },
  {
    "word": "steal",
    "phonetic": "/stiːl/",
    "meaning": "偷, 窃取",
    "example": null,
    "category": "vt.",
    "id": 1486
  },
  {
    "word": "steep",
    "phonetic": "/stiːp/",
    "meaning": "险峻的；陡峭的",
    "example": null,
    "category": "a.",
    "id": 1487
  },
  {
    "word": "step",
    "phonetic": "/step/",
    "meaning": "脚步,台阶,梯级 vi. 走,跨步",
    "example": null,
    "category": "n.",
    "id": 1488
  },
  {
    "word": "stick",
    "phonetic": "/stɪk/",
    "meaning": "粘住，钉住；坚持 n. 木棒（棍）,枝条",
    "example": null,
    "category": "vi.",
    "id": 1489
  },
  {
    "word": "still",
    "phonetic": "/stɪl/",
    "meaning": "不动的,平静的 ad. 仍然,还",
    "example": null,
    "category": "a.",
    "id": 1490
  },
  {
    "word": "stocking",
    "phonetic": "/ˈstɔkɪŋ/",
    "meaning": "长统袜",
    "example": null,
    "category": "n.",
    "id": 1491
  },
  {
    "word": "stomach",
    "phonetic": "/ˈstʌmək/",
    "meaning": "胃，胃部",
    "example": null,
    "category": "n.",
    "id": 1492
  },
  {
    "word": "stomachache",
    "phonetic": "/ˈstʌməkeɪk/",
    "meaning": "胃疼",
    "example": null,
    "category": "n.",
    "id": 1493
  },
  {
    "word": "stone",
    "phonetic": "/stəʊn/",
    "meaning": "石头，石料",
    "example": null,
    "category": "n.",
    "id": 1494
  },
  {
    "word": "stop",
    "phonetic": "/stɔp/",
    "meaning": "停；（停车）站 v. 停，停止，阻止",
    "example": null,
    "category": "n.",
    "id": 1495
  },
  {
    "word": "store",
    "phonetic": "/stɔː(r)/",
    "meaning": "商店 vt. 储藏，存储",
    "example": null,
    "category": "n.",
    "id": 1496
  },
  {
    "word": "storm",
    "phonetic": "/stɔːm/",
    "meaning": "风暴，暴（风）雨",
    "example": null,
    "category": "n.",
    "id": 1497
  },
  {
    "word": "story",
    "phonetic": "/ˈstɔːrɪ/",
    "meaning": "故事，小说",
    "example": null,
    "category": "n.",
    "id": 1498
  },
  {
    "word": "straight",
    "phonetic": "/streɪt/",
    "meaning": "一直的，直的 ad. 一直地，直地",
    "example": null,
    "category": "a.",
    "id": 1499
  },
  {
    "word": "strange",
    "phonetic": "/streɪndʒ/",
    "meaning": "奇怪,奇特的,陌生的",
    "example": null,
    "category": "a.",
    "id": 1500
  },
  {
    "word": "street",
    "phonetic": "/striːt/",
    "meaning": "街，街道",
    "example": null,
    "category": "n.",
    "id": 1501
  },
  {
    "word": "strict",
    "phonetic": "/strɪkt/",
    "meaning": "严格的，严密的",
    "example": null,
    "category": "a.",
    "id": 1502
  },
  {
    "word": "strike",
    "phonetic": "/straɪk/",
    "meaning": "v.（钟）鸣;敲（响）,罢工,擦（打）火, 侵袭",
    "example": null,
    "category": "",
    "id": 1503
  },
  {
    "word": "strong",
    "phonetic": "/strɔŋ/",
    "meaning": "强(壮)的；坚固的；强烈的；坚强的",
    "example": null,
    "category": "a.",
    "id": 1504
  },
  {
    "word": "student",
    "phonetic": "/ˈstjuːdənt/",
    "meaning": "学生",
    "example": null,
    "category": "n.",
    "id": 1505
  },
  {
    "word": "study",
    "phonetic": "/ˈstʌdɪ/",
    "meaning": "学习；研究 n. 书房",
    "example": null,
    "category": "v.",
    "id": 1506
  },
  {
    "word": "stupid",
    "phonetic": "/ˈstjuːpɪd/",
    "meaning": "愚蠢的，笨的",
    "example": null,
    "category": "a.",
    "id": 1507
  },
  {
    "word": "subject",
    "phonetic": "/ˈsʌbdʒɪkt/",
    "meaning": "题目；主题；学科；主语；主体",
    "example": null,
    "category": "n.",
    "id": 1508
  },
  {
    "word": "succeed",
    "phonetic": "/səkˈsiːd/",
    "meaning": "成功",
    "example": null,
    "category": "vi.",
    "id": 1509
  },
  {
    "word": "success",
    "phonetic": "/səkˈses/",
    "meaning": "成功",
    "example": null,
    "category": "n.",
    "id": 1510
  },
  {
    "word": "successful",
    "phonetic": "/səkˈsesfʊl/",
    "meaning": "成功的,有成就的",
    "example": null,
    "category": "a.",
    "id": 1511
  },
  {
    "word": "such",
    "phonetic": "/sʌtʃ/",
    "meaning": "] ad. 那么 pron.（泛指）人，事物 a. 这样的，那样的",
    "example": null,
    "category": "",
    "id": 1512
  },
  {
    "word": "sudden",
    "phonetic": "/ˈsʌd(ə)n/",
    "meaning": "突然的",
    "example": null,
    "category": "a.",
    "id": 1513
  },
  {
    "word": "sugar",
    "phonetic": "/ˈʃʊɡə(r)/",
    "meaning": "糖",
    "example": null,
    "category": "n.",
    "id": 1514
  },
  {
    "word": "suggest",
    "phonetic": "/səˈdʒest; (US) sə ˈdʒest/",
    "meaning": "建议，提议",
    "example": null,
    "category": "vt.",
    "id": 1515
  },
  {
    "word": "suggestion",
    "phonetic": "/səˈdʒestʃ(ə)n/",
    "meaning": "建议",
    "example": null,
    "category": "n.",
    "id": 1516
  },
  {
    "word": "suit",
    "phonetic": "/suːt, sjuːt/",
    "meaning": "适合 n. 一套（衣服）",
    "example": null,
    "category": "vt.",
    "id": 1517
  },
  {
    "word": "summer",
    "phonetic": "/ˈsʌmə(r)/",
    "meaning": "夏天，夏季",
    "example": null,
    "category": "n.",
    "id": 1518
  },
  {
    "word": "sun",
    "phonetic": "/sʌn/",
    "meaning": "太阳，阳光",
    "example": null,
    "category": "n.",
    "id": 1519
  },
  {
    "word": "Sunday",
    "phonetic": "/ˈsʌndeɪ/",
    "meaning": "星期日",
    "example": null,
    "category": "n.",
    "id": 1520
  },
  {
    "word": "sunglasses",
    "phonetic": "/ˈsʌnɡlɑːsɪs/",
    "meaning": "太阳眼镜，墨镜",
    "example": null,
    "category": "n.",
    "id": 1521
  },
  {
    "word": "sunlight",
    "phonetic": "/ˈsʌnlaɪt/",
    "meaning": "日光，阳光",
    "example": null,
    "category": "n.",
    "id": 1522
  },
  {
    "word": "sunny",
    "phonetic": "/ˈsʌnɪ/",
    "meaning": "晴朗的;阳光充足的",
    "example": null,
    "category": "a.",
    "id": 1523
  },
  {
    "word": "sunrise",
    "phonetic": "/ˈsʌnraɪs/",
    "meaning": "黎明，拂晓",
    "example": null,
    "category": "n.",
    "id": 1524
  },
  {
    "word": "sunset",
    "phonetic": "/ˈsʌnset/",
    "meaning": "日落(时分)",
    "example": null,
    "category": "n.",
    "id": 1525
  },
  {
    "word": "sunshine",
    "phonetic": "/ˈsʌnʃaɪn/",
    "meaning": "阳光",
    "example": null,
    "category": "n.",
    "id": 1526
  },
  {
    "word": "super",
    "phonetic": "/ˈsuːpə(r), ˈsjuːpə(r)/",
    "meaning": "顶好的，超级的",
    "example": null,
    "category": "a.",
    "id": 1527
  },
  {
    "word": "supermarket",
    "phonetic": "/ˈsuːpəmɑːkɪt/",
    "meaning": "超级市场",
    "example": null,
    "category": "n.",
    "id": 1528
  },
  {
    "word": "supper",
    "phonetic": "/ˈsʌpə(r)/",
    "meaning": "晚餐，晚饭",
    "example": null,
    "category": "n.",
    "id": 1529
  },
  {
    "word": "supply",
    "phonetic": "/səˈplaɪ/",
    "meaning": "vt.& n. 供给，供应",
    "example": null,
    "category": "",
    "id": 1530
  },
  {
    "word": "suppose",
    "phonetic": "/səˈpəʊz/",
    "meaning": "猜想,假定,料想",
    "example": null,
    "category": "vt.",
    "id": 1531
  },
  {
    "word": "sure",
    "phonetic": "/ʃʊə(r), ʃɔː(r)/",
    "meaning": "确信，肯定 ad. (口语)的确，一定，当然",
    "example": null,
    "category": "a.",
    "id": 1532
  },
  {
    "word": "surf",
    "phonetic": "/ˈsɜːf/",
    "meaning": "冲浪",
    "example": null,
    "category": "v.",
    "id": 1533
  },
  {
    "word": "surprise",
    "phonetic": "/səˈpraɪz/",
    "meaning": "使惊奇,使诧异 n. 惊奇,诧异",
    "example": null,
    "category": "vt.",
    "id": 1534
  },
  {
    "word": "sweater",
    "phonetic": "/ˈswetə(r)/",
    "meaning": "厚运动衫，毛衣",
    "example": null,
    "category": "n.",
    "id": 1535
  },
  {
    "word": "sweet",
    "phonetic": "/swiːt/",
    "meaning": "甜食;蜜饯;甜点;糖果;芳香 a. 甜的;可爱的;亲切的",
    "example": null,
    "category": "n.",
    "id": 1536
  },
  {
    "word": "swim",
    "phonetic": "/swɪm/",
    "meaning": "游泳,游 n. 游泳，游",
    "example": null,
    "category": "vi.",
    "id": 1537
  },
  {
    "word": "swimming",
    "phonetic": "/ˈswɪmɪŋ/",
    "meaning": "游泳",
    "example": null,
    "category": "n.",
    "id": 1538
  },
  {
    "word": "swimming",
    "phonetic": "/ˈswɪmɪŋ puːl/",
    "meaning": "游泳池",
    "example": null,
    "category": "n.",
    "id": 1539
  },
  {
    "word": "swing",
    "phonetic": "/swɪŋ/",
    "meaning": "挥舞，摆动 n. 秋千",
    "example": null,
    "category": "vt.",
    "id": 1540
  },
  {
    "word": "table",
    "phonetic": "/ˈteɪb(ə)l/",
    "meaning": "桌子，表格",
    "example": null,
    "category": "n.",
    "id": 1541
  },
  {
    "word": "tail",
    "phonetic": "/teɪl/",
    "meaning": "(动物的)尾巴",
    "example": null,
    "category": "n.",
    "id": 1542
  },
  {
    "word": "tailor",
    "phonetic": "/ˈteɪlə(r)/",
    "meaning": "裁缝",
    "example": null,
    "category": "n.",
    "id": 1543
  },
  {
    "word": "take",
    "phonetic": "/teɪk/",
    "meaning": "拿；拿走；做；服用；乘坐；花费",
    "example": null,
    "category": "vt.",
    "id": 1544
  },
  {
    "word": "tale",
    "phonetic": "/teɪl/",
    "meaning": "故事, 传说",
    "example": null,
    "category": "n.",
    "id": 1545
  },
  {
    "word": "talk",
    "phonetic": "/tɔːk/",
    "meaning": "n.& v. 谈话,讲话,演讲,交谈",
    "example": null,
    "category": "",
    "id": 1546
  },
  {
    "word": "tall",
    "phonetic": "/tɔːl/",
    "meaning": "高的",
    "example": null,
    "category": "a.",
    "id": 1547
  },
  {
    "word": "tape",
    "phonetic": "/teɪp/",
    "meaning": "磁带；录音带",
    "example": null,
    "category": "n.",
    "id": 1548
  },
  {
    "word": "task",
    "phonetic": "/tɑːsk; (US) tæsk/",
    "meaning": "任务, 工作",
    "example": null,
    "category": "n.",
    "id": 1549
  },
  {
    "word": "taste",
    "phonetic": "/teɪst/",
    "meaning": "品尝, 尝味；味道 vt. 品尝, 尝味",
    "example": null,
    "category": "n.",
    "id": 1550
  },
  {
    "word": "taxi",
    "phonetic": "/ˈtæksɪ/",
    "meaning": "出租汽车",
    "example": null,
    "category": "n.",
    "id": 1551
  },
  {
    "word": "tea",
    "phonetic": "/tiː/",
    "meaning": "茶；茶叶 ",
    "example": null,
    "category": "n.",
    "id": 1552
  },
  {
    "word": "teacher",
    "phonetic": "/ˈtiːtʃə(r)/",
    "meaning": "教师，教员",
    "example": null,
    "category": "n.",
    "id": 1553
  },
  {
    "word": "team",
    "phonetic": "/tiːm/",
    "meaning": "队，组",
    "example": null,
    "category": "n.",
    "id": 1554
  },
  {
    "word": "teamwork",
    "phonetic": "/ˈtiːmwəːk/",
    "meaning": "合作，协同工作",
    "example": null,
    "category": "n.",
    "id": 1555
  },
  {
    "word": "teapot",
    "phonetic": "/ˈtiːpɔt/",
    "meaning": "茶壶",
    "example": null,
    "category": "n.",
    "id": 1556
  },
  {
    "word": "tear",
    "phonetic": "/teə(r)/",
    "meaning": "眼泪 v. 扯破, 撕开",
    "example": null,
    "category": "n.",
    "id": 1557
  },
  {
    "word": "technology",
    "phonetic": "/tekˈnɔlədʒɪ/",
    "meaning": "技术",
    "example": null,
    "category": "n.",
    "id": 1558
  },
  {
    "word": "teenager",
    "phonetic": "/ˈtiːneɪdʒə(r)/",
    "meaning": "n.（13～19岁的）青少年，十几岁的少年",
    "example": null,
    "category": "",
    "id": 1559
  },
  {
    "word": "telegram",
    "phonetic": "/ˈtelɪɡræm/",
    "meaning": "电报",
    "example": null,
    "category": "n.",
    "id": 1560
  },
  {
    "word": "telegraph",
    "phonetic": "/ˈtelɪɡrɑːf; (US) -ɡræf/",
    "meaning": "(拍) 电报",
    "example": null,
    "category": "v.",
    "id": 1561
  },
  {
    "word": "telephone",
    "phonetic": "/ˈtelɪfəun/",
    "meaning": "打电话 n. 电话",
    "example": null,
    "category": "v.",
    "id": 1562
  },
  {
    "word": "television",
    "phonetic": "/ˈtelɪviʒən/",
    "meaning": "电视",
    "example": null,
    "category": "n.",
    "id": 1563
  },
  {
    "word": "tell",
    "phonetic": "/tel/",
    "meaning": "告诉,讲述,吩咐",
    "example": null,
    "category": "vt.",
    "id": 1564
  },
  {
    "word": "temperature",
    "phonetic": "/ˈtemprɪtʃə(r)/",
    "meaning": "温度",
    "example": null,
    "category": "n.",
    "id": 1565
  },
  {
    "word": "ten",
    "phonetic": "/ten/",
    "meaning": "十",
    "example": null,
    "category": "num.",
    "id": 1566
  },
  {
    "word": "tent",
    "phonetic": "/tent/",
    "meaning": "帐篷",
    "example": null,
    "category": "n.",
    "id": 1567
  },
  {
    "word": "term",
    "phonetic": "/tɜːm/",
    "meaning": "学期;术语;条款;项",
    "example": null,
    "category": "n.",
    "id": 1568
  },
  {
    "word": "terrible",
    "phonetic": "/ˈterɪb(ə)l/",
    "meaning": "可怕的；糟糕的",
    "example": null,
    "category": "a.",
    "id": 1569
  },
  {
    "word": "terrify",
    "phonetic": "/ˈterɪfaɪ/",
    "meaning": "使人感到恐怖",
    "example": null,
    "category": "vt.",
    "id": 1570
  },
  {
    "word": "test",
    "phonetic": "/test/",
    "meaning": "vt.& n. 测试, 考查，试验",
    "example": null,
    "category": "",
    "id": 1571
  },
  {
    "word": "text",
    "phonetic": "/tekst/",
    "meaning": "文本，课文",
    "example": null,
    "category": "n.",
    "id": 1572
  },
  {
    "word": "textbook",
    "phonetic": "/ˈtekstbʊk/",
    "meaning": "课本，教科书",
    "example": null,
    "category": "n.",
    "id": 1573
  },
  {
    "word": "than",
    "phonetic": "/ðen, ðæn/",
    "meaning": "比",
    "example": null,
    "category": "conj.",
    "id": 1574
  },
  {
    "word": "thank",
    "phonetic": "/θæŋk/",
    "meaning": "感谢，致谢，道谢 n.（复）感谢，谢意",
    "example": null,
    "category": "vt.",
    "id": 1575
  },
  {
    "word": "thankful",
    "phonetic": "/ˈθæŋkfʊl/",
    "meaning": "感谢的，感激的",
    "example": null,
    "category": "a.",
    "id": 1576
  },
  {
    "word": "that",
    "phonetic": "/ðæt/",
    "meaning": "a.& pron.那，那个 conj. 那，那个 ad. 那么，那样",
    "example": null,
    "category": "",
    "id": 1577
  },
  {
    "word": "the",
    "phonetic": "/ðə, ðɪ, ðiː/",
    "meaning": "这（那）个,这（那）些",
    "example": null,
    "category": "art.",
    "id": 1578
  },
  {
    "word": "theatre",
    "phonetic": "/'θiətə/",
    "meaning": "剧场，戏院",
    "example": null,
    "category": "n.",
    "id": 1579
  },
  {
    "word": "their",
    "phonetic": "/ðeə(r)/",
    "meaning": "他(她,它)们的",
    "example": null,
    "category": "pron.",
    "id": 1580
  },
  {
    "word": "theirs",
    "phonetic": "/ðeəz/",
    "meaning": "他（她,它）们的",
    "example": null,
    "category": "pron.",
    "id": 1581
  },
  {
    "word": "them",
    "phonetic": "/ð(ə)m, ðem/",
    "meaning": "他/她/它们（宾格）",
    "example": null,
    "category": "pron.",
    "id": 1582
  },
  {
    "word": "themselves",
    "phonetic": "/ðəmˈselvz/",
    "meaning": "他/她/它们自己",
    "example": null,
    "category": "pron.",
    "id": 1583
  },
  {
    "word": "then",
    "phonetic": "/ðen/",
    "meaning": "当时,那时,然后,那么",
    "example": null,
    "category": "ad.",
    "id": 1584
  },
  {
    "word": "there",
    "phonetic": "/ðeə(r)/",
    "meaning": "那!你瞧! n. 那里,那儿 ad. 在那里,往那里",
    "example": null,
    "category": "int.",
    "id": 1585
  },
  {
    "word": "these",
    "phonetic": "/ðiːz/",
    "meaning": "& pron. 这些",
    "example": null,
    "category": "a.",
    "id": 1586
  },
  {
    "word": "they",
    "phonetic": "/ðeɪ/",
    "meaning": "他（她）们；它们",
    "example": null,
    "category": "pron.",
    "id": 1587
  },
  {
    "word": "thick",
    "phonetic": "/θɪk/",
    "meaning": "厚的",
    "example": null,
    "category": "a.",
    "id": 1588
  },
  {
    "word": "thief",
    "phonetic": "/θiːf/",
    "meaning": "窃贼, 小偷",
    "example": null,
    "category": "n.",
    "id": 1589
  },
  {
    "word": "thin",
    "phonetic": "/θɪn/",
    "meaning": "薄的；瘦的；稀的",
    "example": null,
    "category": "a.",
    "id": 1590
  },
  {
    "word": "thing",
    "phonetic": "/θɪŋ/",
    "meaning": "东西；(复)物品，用品；事情，事件",
    "example": null,
    "category": "n.",
    "id": 1591
  },
  {
    "word": "think",
    "phonetic": "/θɪŋk/",
    "meaning": "想；认为；考虑",
    "example": null,
    "category": "v.",
    "id": 1592
  },
  {
    "word": "third",
    "phonetic": "/θəːd/",
    "meaning": "第三",
    "example": null,
    "category": "num.",
    "id": 1593
  },
  {
    "word": "thirst",
    "phonetic": "/θəːst/",
    "meaning": "渴；口渴",
    "example": null,
    "category": "n.",
    "id": 1594
  },
  {
    "word": "thirsty",
    "phonetic": "/ˈθəːstɪ/",
    "meaning": "渴",
    "example": null,
    "category": "a.",
    "id": 1595
  },
  {
    "word": "thirteen",
    "phonetic": "/θəːtiːn/",
    "meaning": "十三",
    "example": null,
    "category": "num.",
    "id": 1596
  },
  {
    "word": "thirty",
    "phonetic": "/ˈθəːtɪ/",
    "meaning": "三十",
    "example": null,
    "category": "num.",
    "id": 1597
  },
  {
    "word": "this",
    "phonetic": "/ðɪs/",
    "meaning": "a.& pron.这，这个",
    "example": null,
    "category": "",
    "id": 1598
  },
  {
    "word": "those",
    "phonetic": "/ðəʊz/",
    "meaning": "a.& pron. 那些",
    "example": null,
    "category": "",
    "id": 1599
  },
  {
    "word": "though",
    "phonetic": "/ðəʊ/",
    "meaning": "虽然，可是",
    "example": null,
    "category": "conj.",
    "id": 1600
  },
  {
    "word": "thought",
    "phonetic": "/θɔːt/",
    "meaning": "思考,思想;念头",
    "example": null,
    "category": "n.",
    "id": 1601
  },
  {
    "word": "thousand",
    "phonetic": "/ˈθaʊzənd/",
    "meaning": "千",
    "example": null,
    "category": "num.",
    "id": 1602
  },
  {
    "word": "three",
    "phonetic": "/θriː/",
    "meaning": "三",
    "example": null,
    "category": "num.",
    "id": 1603
  },
  {
    "word": "through",
    "phonetic": "/θruː/",
    "meaning": "穿（通）过;从始至终 ad. 穿(通)过;自始至终,全部",
    "example": null,
    "category": "prep.",
    "id": 1604
  },
  {
    "word": "Thursday",
    "phonetic": "/ˈθəːzdeɪ/",
    "meaning": "星期四",
    "example": null,
    "category": "n.",
    "id": 1605
  },
  {
    "word": "thus",
    "phonetic": "/ðʌs/",
    "meaning": "这样；因而",
    "example": null,
    "category": "ad.",
    "id": 1606
  },
  {
    "word": "tick",
    "phonetic": "/tɪk/",
    "meaning": "作记号 n. 记号,符号,滴答声",
    "example": null,
    "category": "vt.",
    "id": 1607
  },
  {
    "word": "ticket",
    "phonetic": "/ˈtɪkɪt/",
    "meaning": "票；卷",
    "example": null,
    "category": "n.",
    "id": 1608
  },
  {
    "word": "tidy",
    "phonetic": "/ˈtaidi/",
    "meaning": "整洁的，干净的 vt. 弄整洁，弄干净",
    "example": null,
    "category": "a.",
    "id": 1609
  },
  {
    "word": "tie",
    "phonetic": "/taɪ/",
    "meaning": "vt.（用绳，线）系，拴，扎 n. 领带，绳子，结；关系",
    "example": null,
    "category": "",
    "id": 1610
  },
  {
    "word": "tiger",
    "phonetic": "/ˈtaɪɡə(r)/",
    "meaning": "老虎",
    "example": null,
    "category": "n.",
    "id": 1611
  },
  {
    "word": "till",
    "phonetic": "/tɪl/",
    "meaning": "conj.& prep. 直到,直到…为止",
    "example": null,
    "category": "",
    "id": 1612
  },
  {
    "word": "time",
    "phonetic": "/taɪm/",
    "meaning": "时间;时期;钟点,次,回 vt. 测定…的时间,记录…的时间",
    "example": null,
    "category": "n.",
    "id": 1613
  },
  {
    "word": "tire",
    "phonetic": "/ˈtaɪə(r)/",
    "meaning": "使疲劳",
    "example": null,
    "category": "vi.",
    "id": 1614
  },
  {
    "word": "tired",
    "phonetic": "/ˈtaɪəd/",
    "meaning": "疲劳的，累的",
    "example": null,
    "category": "a.",
    "id": 1615
  },
  {
    "word": "to",
    "phonetic": "/tʊ, tuː/",
    "meaning": "给；对，向，到",
    "example": null,
    "category": "prep.",
    "id": 1616
  },
  {
    "word": "today",
    "phonetic": "/tədei/",
    "meaning": "ad.& n. 今天;现在,当前",
    "example": null,
    "category": "",
    "id": 1617
  },
  {
    "word": "together",
    "phonetic": "/təˈgeðə/",
    "meaning": "一起，共同",
    "example": null,
    "category": "ad.",
    "id": 1618
  },
  {
    "word": "toilet",
    "phonetic": "/ˈtɔɪlɪt/",
    "meaning": "厕所",
    "example": null,
    "category": "n.",
    "id": 1619
  },
  {
    "word": "Tokyo",
    "phonetic": "/ˈtəʊkjəʊ/",
    "meaning": "东京",
    "example": null,
    "category": "n.",
    "id": 1620
  },
  {
    "word": "tomato",
    "phonetic": "/təˈmɑːtəʊ; (US) təˈmeɪtəʊ/",
    "meaning": "西红柿，番茄",
    "example": null,
    "category": "n.",
    "id": 1621
  },
  {
    "word": "tomb",
    "phonetic": "/tuːm/",
    "meaning": "坟墓",
    "example": null,
    "category": "n.",
    "id": 1622
  },
  {
    "word": "tomorrow",
    "phonetic": "/təˈmɔrəʊ/",
    "meaning": "& n. 明天",
    "example": null,
    "category": "ad.",
    "id": 1623
  },
  {
    "word": "ton",
    "phonetic": "/tʌn/",
    "meaning": "n.（重量单位）吨",
    "example": null,
    "category": "",
    "id": 1624
  },
  {
    "word": "tongue",
    "phonetic": "/tʌŋ/",
    "meaning": "舌，舌头",
    "example": null,
    "category": "n.",
    "id": 1625
  },
  {
    "word": "tonight",
    "phonetic": "/təˈnaɪt/",
    "meaning": "ad.& n. 今晚，今夜",
    "example": null,
    "category": "",
    "id": 1626
  },
  {
    "word": "too",
    "phonetic": "/tuː/",
    "meaning": "也,还,又,太,非常",
    "example": null,
    "category": "ad.",
    "id": 1627
  },
  {
    "word": "tool",
    "phonetic": "/tuːl/",
    "meaning": "工具，器具",
    "example": null,
    "category": "n.",
    "id": 1628
  },
  {
    "word": "tooth",
    "phonetic": "/tuːθ/",
    "meaning": "牙齿",
    "example": null,
    "category": "n.",
    "id": 1629
  },
  {
    "word": "toothache",
    "phonetic": "/ˈtuːθeɪk/",
    "meaning": "牙痛",
    "example": null,
    "category": "n.",
    "id": 1630
  },
  {
    "word": "toothbrush",
    "phonetic": "/ˈtuːθbrʌʃ/",
    "meaning": "牙刷",
    "example": null,
    "category": "n.",
    "id": 1631
  },
  {
    "word": "toothpaste",
    "phonetic": "/ˈtuːθpeɪst/",
    "meaning": "牙膏",
    "example": null,
    "category": "n.",
    "id": 1632
  },
  {
    "word": "top",
    "phonetic": "/tɔp/",
    "meaning": "顶部,（物体的）上面",
    "example": null,
    "category": "n.",
    "id": 1633
  },
  {
    "word": "total",
    "phonetic": "/ˈtəʊt(ə)l/",
    "meaning": "总数的;完全的 n./ v. 合计,总计",
    "example": null,
    "category": "a.",
    "id": 1634
  },
  {
    "word": "touch",
    "phonetic": "/tʌtʃ/",
    "meaning": "触摸，接触",
    "example": null,
    "category": "vt.",
    "id": 1635
  },
  {
    "word": "tough",
    "phonetic": "/tʌf /",
    "meaning": "坚硬的；结实的；棘手的，难解的",
    "example": null,
    "category": "a.",
    "id": 1636
  },
  {
    "word": "tour",
    "phonetic": "/tʊə(r)/",
    "meaning": "参观, 观光, 旅行",
    "example": null,
    "category": "n.",
    "id": 1637
  },
  {
    "word": "tourism",
    "phonetic": "/ˈtʊərɪz(ə)m/",
    "meaning": "旅游业；观光",
    "example": null,
    "category": "n.",
    "id": 1638
  },
  {
    "word": "tourist",
    "phonetic": "/ˈtʊərɪst/",
    "meaning": "旅行者，观光者",
    "example": null,
    "category": "vn.",
    "id": 1639
  },
  {
    "word": "towel",
    "phonetic": "/ˈtaʊəl/",
    "meaning": "毛巾",
    "example": null,
    "category": "n.",
    "id": 1640
  },
  {
    "word": "tower",
    "phonetic": "/ˈtaʊə(r)/",
    "meaning": "塔",
    "example": null,
    "category": "n.",
    "id": 1641
  },
  {
    "word": "town",
    "phonetic": "/taʊn/",
    "meaning": "城镇，城",
    "example": null,
    "category": "n.",
    "id": 1642
  },
  {
    "word": "toy",
    "phonetic": "/tɔɪ/",
    "meaning": "玩具, 玩物",
    "example": null,
    "category": "n.",
    "id": 1643
  },
  {
    "word": "track",
    "phonetic": "/træk/",
    "meaning": "轨道；田径",
    "example": null,
    "category": "n.",
    "id": 1644
  },
  {
    "word": "tractor",
    "phonetic": "/ˈtræktə(r)/",
    "meaning": "拖拉机",
    "example": null,
    "category": "n.",
    "id": 1645
  },
  {
    "word": "trade",
    "phonetic": "/treɪd/",
    "meaning": "商业,贸易 vt. 交易",
    "example": null,
    "category": "n.",
    "id": 1646
  },
  {
    "word": "tradition",
    "phonetic": "/trəˈdɪʃ (ə)n/",
    "meaning": "传统，风俗",
    "example": null,
    "category": "n.",
    "id": 1647
  },
  {
    "word": "traditional",
    "phonetic": "/trəˈdɪʃ(ə)n(ə)l/",
    "meaning": "传统的，风俗的，惯例的",
    "example": null,
    "category": "a.",
    "id": 1648
  },
  {
    "word": "traffic",
    "phonetic": "/ˈtræfɪk/",
    "meaning": "交通，来往车辆",
    "example": null,
    "category": "n.",
    "id": 1649
  },
  {
    "word": "train",
    "phonetic": "/treɪn/",
    "meaning": "火车 v. 培训,训练",
    "example": null,
    "category": "n.",
    "id": 1650
  },
  {
    "word": "trainer",
    "phonetic": "/treɪnə(r)/",
    "meaning": "训练人；教练",
    "example": null,
    "category": "n.",
    "id": 1651
  },
  {
    "word": "training",
    "phonetic": "/ˈtreɪnɪŋ/",
    "meaning": "培训",
    "example": null,
    "category": "n.",
    "id": 1652
  },
  {
    "word": "translate",
    "phonetic": "/trænsˈleɪt/",
    "meaning": "翻译",
    "example": null,
    "category": "vt.",
    "id": 1653
  },
  {
    "word": "trap",
    "phonetic": "/træp/",
    "meaning": "陷阱 vt. 使陷入困境",
    "example": null,
    "category": "n.",
    "id": 1654
  },
  {
    "word": "travel",
    "phonetic": "/ˈtræv(ə)l/",
    "meaning": "n.& vi. 旅行",
    "example": null,
    "category": "",
    "id": 1655
  },
  {
    "word": "traveler",
    "phonetic": "/ˈtrævələ(r)/",
    "meaning": "旅行者",
    "example": null,
    "category": "n.",
    "id": 1656
  },
  {
    "word": "treat",
    "phonetic": "/triːt/",
    "meaning": "对待，看待",
    "example": null,
    "category": "vt.",
    "id": 1657
  },
  {
    "word": "tree",
    "phonetic": "/triː/",
    "meaning": "树",
    "example": null,
    "category": "n.",
    "id": 1658
  },
  {
    "word": "trip",
    "phonetic": "/trɪp/",
    "meaning": "旅行，旅程",
    "example": null,
    "category": "n.",
    "id": 1659
  },
  {
    "word": "trouble",
    "phonetic": "/ˈtrʌb(ə)l/",
    "meaning": "使苦恼,使忧虑,使麻烦 n. 问题,疾病,烦恼,麻烦",
    "example": null,
    "category": "vt.",
    "id": 1660
  },
  {
    "word": "trousers",
    "phonetic": "/ˈtraʊzəz/",
    "meaning": "裤子，长裤",
    "example": null,
    "category": "n.",
    "id": 1661
  },
  {
    "word": "truck",
    "phonetic": "/trʌk/",
    "meaning": "卡车, 运货车；车皮",
    "example": null,
    "category": "n.",
    "id": 1662
  },
  {
    "word": "true",
    "phonetic": "/truː/",
    "meaning": "真的，真实的；忠诚的",
    "example": null,
    "category": "a.",
    "id": 1663
  },
  {
    "word": "truth",
    "phonetic": "/truːθ/",
    "meaning": "真理,事实,真相,实际",
    "example": null,
    "category": "n.",
    "id": 1664
  },
  {
    "word": "try",
    "phonetic": "/trai/",
    "meaning": "试，试图，努力",
    "example": null,
    "category": "v.",
    "id": 1665
  },
  {
    "word": "Tuesday",
    "phonetic": "/ˈtjuːzdeɪ/",
    "meaning": "星期二",
    "example": null,
    "category": "n.",
    "id": 1666
  },
  {
    "word": "turkey",
    "phonetic": "/ˈtɜːkɪ/",
    "meaning": "火鸡",
    "example": null,
    "category": "n.",
    "id": 1667
  },
  {
    "word": "turn",
    "phonetic": "/tɜːn/",
    "meaning": "旋转，翻转，转变，转弯 n. 轮流，顺序",
    "example": null,
    "category": "v.",
    "id": 1668
  },
  {
    "word": "turning",
    "phonetic": "/ˈtɜːnɪŋ/",
    "meaning": "拐弯处，拐角处",
    "example": null,
    "category": "n.",
    "id": 1669
  },
  {
    "word": "twelfth",
    "phonetic": "/twelfθ/",
    "meaning": "第十二",
    "example": null,
    "category": "num.",
    "id": 1670
  },
  {
    "word": "twelve",
    "phonetic": "/twelv/",
    "meaning": "十二",
    "example": null,
    "category": "num.",
    "id": 1671
  },
  {
    "word": "twenty",
    "phonetic": "/ˈtwentɪ/",
    "meaning": "二十",
    "example": null,
    "category": "num.",
    "id": 1672
  },
  {
    "word": "twice",
    "phonetic": "/twaɪs/",
    "meaning": "两次；两倍",
    "example": null,
    "category": "ad.",
    "id": 1673
  },
  {
    "word": "twin",
    "phonetic": "/twɪn/",
    "meaning": "双胞胎之一",
    "example": null,
    "category": "n.",
    "id": 1674
  },
  {
    "word": "two",
    "phonetic": "/tuː/",
    "meaning": "二",
    "example": null,
    "category": "num.",
    "id": 1675
  },
  {
    "word": "type",
    "phonetic": "/ˈtaɪp/",
    "meaning": "打字 n. 种类,类型",
    "example": null,
    "category": "vt.",
    "id": 1676
  },
  {
    "word": "umbrella",
    "phonetic": "/ʌmˈbrelə/",
    "meaning": "雨伞",
    "example": null,
    "category": "n.",
    "id": 1677
  },
  {
    "word": "uncle",
    "phonetic": "/ˈʌŋk(ə)l/",
    "meaning": "叔,伯,舅,姑夫,姨父",
    "example": null,
    "category": "n.",
    "id": 1678
  },
  {
    "word": "under",
    "phonetic": "/ˈʌndə(r)/",
    "meaning": "ad.& prep. 在…下面，向…下面",
    "example": null,
    "category": "",
    "id": 1679
  },
  {
    "word": "underground",
    "phonetic": "/ʌndəˈɡraʊnd/",
    "meaning": "地下的 n. 地铁",
    "example": null,
    "category": "a.",
    "id": 1680
  },
  {
    "word": "understand",
    "phonetic": "/ʌndəˈstænd/",
    "meaning": "懂得;明白;理解",
    "example": null,
    "category": "v.",
    "id": 1681
  },
  {
    "word": "understanding",
    "phonetic": "/ʌndəˈstændɪŋ/",
    "meaning": "领会;理解",
    "example": null,
    "category": "n.",
    "id": 1682
  },
  {
    "word": "unfair",
    "phonetic": "/ʌnˈfeə(r)/",
    "meaning": "不公平的，不公正的",
    "example": null,
    "category": "a.",
    "id": 1683
  },
  {
    "word": "unit",
    "phonetic": "/ˈjuːnɪt/",
    "meaning": "单元，单位",
    "example": null,
    "category": "n.",
    "id": 1684
  },
  {
    "word": "universe",
    "phonetic": "/ˈjuːnɪvɜːs/",
    "meaning": "宇宙",
    "example": null,
    "category": "n.",
    "id": 1685
  },
  {
    "word": "university",
    "phonetic": "/juːnɪˈvɜːsɪtɪ/",
    "meaning": "大学",
    "example": null,
    "category": "n.",
    "id": 1686
  },
  {
    "word": "unknown",
    "phonetic": "/ʌnnəun/",
    "meaning": "不知道的",
    "example": null,
    "category": "a.",
    "id": 1687
  },
  {
    "word": "unless",
    "phonetic": "/ʌnˈles/",
    "meaning": "如果不，除非",
    "example": null,
    "category": "conj.",
    "id": 1688
  },
  {
    "word": "unlike",
    "phonetic": "/ʌnˈlaɪk/",
    "meaning": "不像，和…不同",
    "example": null,
    "category": "prep.",
    "id": 1689
  },
  {
    "word": "until",
    "phonetic": "/ʌnˈtɪl/",
    "meaning": "prep.& conj. 直到…为止",
    "example": null,
    "category": "",
    "id": 1690
  },
  {
    "word": "unusual",
    "phonetic": "/ʌnˈjuːʒuəl/",
    "meaning": "不平常的，异常的",
    "example": null,
    "category": "a.",
    "id": 1691
  },
  {
    "word": "up",
    "phonetic": "/ʌp/",
    "meaning": "向上;在上方 prep. 向(高处);向(在)…上(面)游",
    "example": null,
    "category": "ad.",
    "id": 1692
  },
  {
    "word": "upon",
    "phonetic": "/əˈpɔn/",
    "meaning": "在…上面",
    "example": null,
    "category": "prep.",
    "id": 1693
  },
  {
    "word": "upstairs",
    "phonetic": "/ʌpˈsteəz/",
    "meaning": "在楼上，到楼上",
    "example": null,
    "category": "ad.",
    "id": 1694
  },
  {
    "word": "use",
    "phonetic": "/juːz/",
    "meaning": "利用,使用,应用 n. [juːs] 用法,应用,运用",
    "example": null,
    "category": "vt.",
    "id": 1695
  },
  {
    "word": "used",
    "phonetic": "/juːzd/",
    "meaning": "用过的;旧的;二手的",
    "example": null,
    "category": "a.",
    "id": 1696
  },
  {
    "word": "useful",
    "phonetic": "/ˈjuːsful/",
    "meaning": "有用的，有益的",
    "example": null,
    "category": "a.",
    "id": 1697
  },
  {
    "word": "useless",
    "phonetic": "/ˈjuːslɪs/",
    "meaning": "无用的",
    "example": null,
    "category": "a.",
    "id": 1698
  },
  {
    "word": "user",
    "phonetic": "/ˈjuːzə/",
    "meaning": "使用者；用户",
    "example": null,
    "category": "n.",
    "id": 1699
  },
  {
    "word": "usual",
    "phonetic": "/ˈjuːʒʊəl/",
    "meaning": "通常的，平常的",
    "example": null,
    "category": "a.",
    "id": 1700
  },
  {
    "word": "usually",
    "phonetic": "/ˈjuːʒʊəlɪ/",
    "meaning": "通常，经常",
    "example": null,
    "category": "ad.",
    "id": 1701
  },
  {
    "word": "valley",
    "phonetic": "/ˈvælɪ/",
    "meaning": "山谷, 溪谷",
    "example": null,
    "category": "n.",
    "id": 1702
  },
  {
    "word": "VCD",
    "phonetic": "",
    "meaning": "= versatile compact disk n. 影碟光盘",
    "example": null,
    "category": "",
    "id": 1703
  },
  {
    "word": "vegetable",
    "phonetic": "/ˈvedʒɪtəb(ə)l/",
    "meaning": "蔬菜",
    "example": null,
    "category": "n.",
    "id": 1704
  },
  {
    "word": "very",
    "phonetic": "/ˈverɪ/",
    "meaning": "很，非常",
    "example": null,
    "category": "ad.",
    "id": 1705
  },
  {
    "word": "victim",
    "phonetic": "/ˈvɪktɪm/",
    "meaning": "受害者，牺牲品",
    "example": null,
    "category": "n.",
    "id": 1706
  },
  {
    "word": "video",
    "phonetic": "/ˈvɪdɪəʊ/",
    "meaning": "录像，视频",
    "example": null,
    "category": "n.",
    "id": 1707
  },
  {
    "word": "village",
    "phonetic": "/ˈvɪlɪdʒ/",
    "meaning": "村庄，乡村",
    "example": null,
    "category": "n.",
    "id": 1708
  },
  {
    "word": "villager",
    "phonetic": "/'vilidʒə/",
    "meaning": "村民",
    "example": null,
    "category": "n.",
    "id": 1709
  },
  {
    "word": "violin",
    "phonetic": "/vaɪəˈlɪn/",
    "meaning": "小提琴",
    "example": null,
    "category": "n.",
    "id": 1710
  },
  {
    "word": "visit",
    "phonetic": "/ˈvizit/",
    "meaning": "n.& vt. 参观，访问，拜访",
    "example": null,
    "category": "",
    "id": 1711
  },
  {
    "word": "visitor",
    "phonetic": "/ˈvɪzɪtə(r)/",
    "meaning": "访问者，参观者",
    "example": null,
    "category": "n.",
    "id": 1712
  },
  {
    "word": "voice",
    "phonetic": "/vɔɪs/",
    "meaning": "说话声; 语态",
    "example": null,
    "category": "n.",
    "id": 1713
  },
  {
    "word": "volleyball",
    "phonetic": "/vɔlibɔːl/",
    "meaning": "排球",
    "example": null,
    "category": "n.",
    "id": 1714
  },
  {
    "word": "wait",
    "phonetic": "/weɪt/",
    "meaning": "等，等候",
    "example": null,
    "category": "vi.",
    "id": 1715
  },
  {
    "word": "wake",
    "phonetic": "/weɪk/",
    "meaning": "醒来,叫醒",
    "example": null,
    "category": "v.",
    "id": 1716
  },
  {
    "word": "walk",
    "phonetic": "/wɔːk/",
    "meaning": "n.& v. 步行；散步",
    "example": null,
    "category": "",
    "id": 1717
  },
  {
    "word": "wallet",
    "phonetic": "/ˈwɔlɪt/",
    "meaning": "(放钱,证件等的)皮夹",
    "example": null,
    "category": "n.",
    "id": 1718
  },
  {
    "word": "want",
    "phonetic": "/wɔnt/",
    "meaning": "想,想要,需要,必要",
    "example": null,
    "category": "vt.",
    "id": 1719
  },
  {
    "word": "war",
    "phonetic": "/wɔː(r)/",
    "meaning": "战争",
    "example": null,
    "category": "n.",
    "id": 1720
  },
  {
    "word": "warm",
    "phonetic": "/wɔːm/",
    "meaning": "暖和的,温暖的;热情的",
    "example": null,
    "category": "a.",
    "id": 1721
  },
  {
    "word": "warning",
    "phonetic": "/ˈwɔːnɪŋ/",
    "meaning": "警报",
    "example": null,
    "category": "n.",
    "id": 1722
  },
  {
    "word": "washroom",
    "phonetic": "/ˈwɔʃrʊm/",
    "meaning": "盥洗室",
    "example": null,
    "category": "n.",
    "id": 1723
  },
  {
    "word": "waste",
    "phonetic": "/weɪst/",
    "meaning": "n.& vt. 浪费",
    "example": null,
    "category": "",
    "id": 1724
  },
  {
    "word": "watch",
    "phonetic": "/wɔtʃ/",
    "meaning": "观看，注视；当心，注意 n. 手表，表",
    "example": null,
    "category": "vt.",
    "id": 1725
  },
  {
    "word": "water",
    "phonetic": "/ˈwɔːtə(r)/",
    "meaning": "水v. 浇水",
    "example": null,
    "category": "n.",
    "id": 1726
  },
  {
    "word": "wave",
    "phonetic": "/weɪv/",
    "meaning": "n.（热、光、声等的）波，波浪 v. 挥手，挥动，波动",
    "example": null,
    "category": "",
    "id": 1727
  },
  {
    "word": "way",
    "phonetic": "/weɪ/",
    "meaning": "路，路线；方式，手段",
    "example": null,
    "category": "n.",
    "id": 1728
  },
  {
    "word": "we",
    "phonetic": "/wiː, wɪ/",
    "meaning": "我们",
    "example": null,
    "category": "pron.",
    "id": 1729
  },
  {
    "word": "weak",
    "phonetic": "/wiːk/",
    "meaning": "差的，弱的，淡的",
    "example": null,
    "category": "a.",
    "id": 1730
  },
  {
    "word": "wear",
    "phonetic": "/weə(r)/",
    "meaning": "穿，戴",
    "example": null,
    "category": "v.",
    "id": 1731
  },
  {
    "word": "weather",
    "phonetic": "/weðə(r)/",
    "meaning": "天气",
    "example": null,
    "category": "n.",
    "id": 1732
  },
  {
    "word": "Wednesday",
    "phonetic": "/ˈwenzdeɪ/",
    "meaning": "星期三",
    "example": null,
    "category": "n.",
    "id": 1733
  },
  {
    "word": "week",
    "phonetic": "/wiːk/",
    "meaning": "星期，周",
    "example": null,
    "category": "n.",
    "id": 1734
  },
  {
    "word": "weekday",
    "phonetic": "/ˈwiːkdeɪ/",
    "meaning": "平日,工作日",
    "example": null,
    "category": "n.",
    "id": 1735
  },
  {
    "word": "weekend",
    "phonetic": "/wiːkˈend, ˈwiːkend/",
    "meaning": "周末",
    "example": null,
    "category": "n.",
    "id": 1736
  },
  {
    "word": "weigh",
    "phonetic": "/weɪ/",
    "meaning": "称…的重量，重（若干）",
    "example": null,
    "category": "vt.",
    "id": 1737
  },
  {
    "word": "weight",
    "phonetic": "/weɪt/",
    "meaning": "重，重量",
    "example": null,
    "category": "n.",
    "id": 1738
  },
  {
    "word": "welcome",
    "phonetic": "/ˈwelkəm/",
    "meaning": "& v. 欢迎 a. 受欢迎的",
    "example": null,
    "category": "int.n.",
    "id": 1739
  },
  {
    "word": "well",
    "phonetic": "/wel/",
    "meaning": "(better, best) ad. 好 a.好的,健康的 int. 好吧,那么,哎呀 n. 井",
    "example": null,
    "category": "",
    "id": 1740
  },
  {
    "word": "west",
    "phonetic": "/west/",
    "meaning": "(在)西；向西,从西来的 ad. 在西方,向西方 n. 西部；西方",
    "example": null,
    "category": "a.",
    "id": 1741
  },
  {
    "word": "western",
    "phonetic": "/ˈwest(ə)n/",
    "meaning": "西方的，西部的",
    "example": null,
    "category": "a.",
    "id": 1742
  },
  {
    "word": "westerner",
    "phonetic": "/'westənə/",
    "meaning": "西方人",
    "example": null,
    "category": "n.",
    "id": 1743
  },
  {
    "word": "westwards",
    "phonetic": "/ˈwestwədz/",
    "meaning": "向西",
    "example": null,
    "category": "ad.",
    "id": 1744
  },
  {
    "word": "wet",
    "phonetic": "/wet/",
    "meaning": "湿的,潮的,多雨的",
    "example": null,
    "category": "a.",
    "id": 1745
  },
  {
    "word": "what",
    "phonetic": "/wɔt; (US) hwɑt/",
    "meaning": "什么,怎么样 a. 多么，何等；什么",
    "example": null,
    "category": "pron.",
    "id": 1746
  },
  {
    "word": "whatever",
    "phonetic": "/wɔtˈevə(r)/",
    "meaning": "& pron. 无论什么，不管什么",
    "example": null,
    "category": "conj.",
    "id": 1747
  },
  {
    "word": "wheat",
    "phonetic": "/wiːt; (US) hwiːt/",
    "meaning": "小麦",
    "example": null,
    "category": "n.",
    "id": 1748
  },
  {
    "word": "wheel",
    "phonetic": "/wiːl; (US) hwiːl/",
    "meaning": "轮，机轮",
    "example": null,
    "category": "n.",
    "id": 1749
  },
  {
    "word": "when",
    "phonetic": "/wen/",
    "meaning": "当…的时候 ad. 什么时候，何时",
    "example": null,
    "category": "conj.",
    "id": 1750
  },
  {
    "word": "whenever",
    "phonetic": "/wenˈevə(r)/",
    "meaning": "每当，无论何时",
    "example": null,
    "category": "conj.",
    "id": 1751
  },
  {
    "word": "where",
    "phonetic": "/weə(r); (US) hweər/",
    "meaning": "在哪里；往哪里",
    "example": null,
    "category": "ad.",
    "id": 1752
  },
  {
    "word": "wherever",
    "phonetic": "/weərˈevə(r)/",
    "meaning": "无论在哪里",
    "example": null,
    "category": "conj.",
    "id": 1753
  },
  {
    "word": "whether",
    "phonetic": "/ˈweðə(r); (US) ˈhweðər/",
    "meaning": "是否",
    "example": null,
    "category": "conj.",
    "id": 1754
  },
  {
    "word": "which",
    "phonetic": "/wɪtʃ; (US) hwɪtʃ/",
    "meaning": "哪一个；哪些",
    "example": null,
    "category": "pron.",
    "id": 1755
  },
  {
    "word": "whichever",
    "phonetic": "/wɪtʃˈevə(r)/",
    "meaning": "无论哪个;无论哪些",
    "example": null,
    "category": "pron.",
    "id": 1756
  },
  {
    "word": "while",
    "phonetic": "/waɪl; (US) hwaɪl/",
    "meaning": "在…的时候,和…同时 n. 一会儿，一段时间",
    "example": null,
    "category": "conj.",
    "id": 1757
  },
  {
    "word": "white",
    "phonetic": "/waɪt; (US) hwaɪt/",
    "meaning": "白色的 n. 白色",
    "example": null,
    "category": "a.",
    "id": 1758
  },
  {
    "word": "who",
    "phonetic": "/huː/",
    "meaning": "谁",
    "example": null,
    "category": "pron.",
    "id": 1759
  },
  {
    "word": "whole",
    "phonetic": "/həʊl/",
    "meaning": "整个的",
    "example": null,
    "category": "a.",
    "id": 1760
  },
  {
    "word": "whom",
    "phonetic": "/huːm/",
    "meaning": "(who的宾格 )",
    "example": null,
    "category": "pron.",
    "id": 1761
  },
  {
    "word": "whose",
    "phonetic": "/huːz/",
    "meaning": "谁的",
    "example": null,
    "category": "pron.",
    "id": 1762
  },
  {
    "word": "why",
    "phonetic": "/waɪ; (US) hwaɪ/",
    "meaning": "ad./ int. 为什么, 你难道不知道（表示反驳、不耐烦等）",
    "example": null,
    "category": "",
    "id": 1763
  },
  {
    "word": "wide",
    "phonetic": "/waid/",
    "meaning": "宽阔的",
    "example": null,
    "category": "a.",
    "id": 1764
  },
  {
    "word": "wife",
    "phonetic": "/waɪf/",
    "meaning": "妻子",
    "example": null,
    "category": "n.",
    "id": 1765
  },
  {
    "word": "will",
    "phonetic": "/wɪl/",
    "meaning": "意志, 遗嘱",
    "example": null,
    "category": "n.",
    "id": 1766
  },
  {
    "word": "will",
    "phonetic": "/wɪl/",
    "meaning": "将,会(表示将来)；愿意，要",
    "example": null,
    "category": "v.",
    "id": 1767
  },
  {
    "word": "win",
    "phonetic": "/wɪn/",
    "meaning": "获胜，赢得 ",
    "example": null,
    "category": "n.",
    "id": 1768
  },
  {
    "word": "wind",
    "phonetic": "/wɪnd/",
    "meaning": "缠，连带；蜿蜒，弯曲 n. 风",
    "example": null,
    "category": "vt.",
    "id": 1769
  },
  {
    "word": "window",
    "phonetic": "/ˈwɪndəʊ/",
    "meaning": "窗户；计算机的窗",
    "example": null,
    "category": "n.",
    "id": 1770
  },
  {
    "word": "windy",
    "phonetic": "/ˈwɪndɪ/",
    "meaning": "有风的，多风的",
    "example": null,
    "category": "a.",
    "id": 1771
  },
  {
    "word": "wine",
    "phonetic": "/waɪn/",
    "meaning": "酒",
    "example": null,
    "category": "n.",
    "id": 1772
  },
  {
    "word": "winner",
    "phonetic": "/ˈwɪnə(r)/",
    "meaning": "获胜者",
    "example": null,
    "category": "n.",
    "id": 1773
  },
  {
    "word": "winter",
    "phonetic": "/ˈwɪntə(r)/",
    "meaning": "冬天，冬季",
    "example": null,
    "category": "n.",
    "id": 1774
  },
  {
    "word": "wish",
    "phonetic": "/wɪʃ/",
    "meaning": "愿望，祝愿 vt. 希望，想要，祝愿",
    "example": null,
    "category": "n.",
    "id": 1775
  },
  {
    "word": "with",
    "phonetic": "/wɪð/",
    "meaning": "prep.关于,带有,以,和,用,有",
    "example": null,
    "category": "",
    "id": 1776
  },
  {
    "word": "without",
    "phonetic": "/wɪðaʊt/",
    "meaning": "没有",
    "example": null,
    "category": "prep.",
    "id": 1777
  },
  {
    "word": "woman",
    "phonetic": "/ˈwʊmən/",
    "meaning": "妇女，女人",
    "example": null,
    "category": "n.",
    "id": 1778
  },
  {
    "word": "wonder",
    "phonetic": "/ˈwʌndə(r)/",
    "meaning": "对…疑惑，感到惊奇,想知道 n. 惊讶,惊叹;奇迹",
    "example": null,
    "category": "v.",
    "id": 1779
  },
  {
    "word": "wonderful",
    "phonetic": "/ˈwʌndəfʊl/",
    "meaning": "美妙的，精彩的；了不起的；太好了",
    "example": null,
    "category": "a.",
    "id": 1780
  },
  {
    "word": "wood",
    "phonetic": "/wud/",
    "meaning": "n.木头,木材,(复)树木,森林",
    "example": null,
    "category": "",
    "id": 1781
  },
  {
    "word": "wool",
    "phonetic": "/wul/",
    "meaning": "n. 羊毛，羊绒",
    "example": null,
    "category": "l",
    "id": 1782
  },
  {
    "word": "woolen",
    "phonetic": "/'wulin/",
    "meaning": "羊毛的，羊毛制的",
    "example": null,
    "category": "a.",
    "id": 1783
  },
  {
    "word": "word",
    "phonetic": "/wəːd/",
    "meaning": "词，单词；话",
    "example": null,
    "category": "n.",
    "id": 1784
  },
  {
    "word": "work",
    "phonetic": "/wəːk/",
    "meaning": "工作,劳动,事情 vi. 工作;(机器、器官等)运转,活动",
    "example": null,
    "category": "n.",
    "id": 1785
  },
  {
    "word": "worker",
    "phonetic": "/wəːkə(r)/",
    "meaning": "工人；工作者",
    "example": null,
    "category": "n.",
    "id": 1786
  },
  {
    "word": "workplace",
    "phonetic": "/wəːkpleɪs/",
    "meaning": "工作场所，车间",
    "example": null,
    "category": "n.",
    "id": 1787
  },
  {
    "word": "works",
    "phonetic": "/wəːks/",
    "meaning": "著作，作品",
    "example": null,
    "category": "n.",
    "id": 1788
  },
  {
    "word": "world",
    "phonetic": "/wəːld/",
    "meaning": "世界",
    "example": null,
    "category": "n.",
    "id": 1789
  },
  {
    "word": "worm",
    "phonetic": "/wəːm/",
    "meaning": "软体虫,蠕虫(尤指蚯蚓)",
    "example": null,
    "category": "n.",
    "id": 1790
  },
  {
    "word": "worried",
    "phonetic": "/'wʌrɪd/",
    "meaning": "担心的，烦恼的",
    "example": null,
    "category": "a.",
    "id": 1791
  },
  {
    "word": "worry",
    "phonetic": "/wʌrɪ/",
    "meaning": "n.& v. 烦恼,担忧,发怒,困扰",
    "example": null,
    "category": "",
    "id": 1792
  },
  {
    "word": "worse",
    "phonetic": "/wə:s/",
    "meaning": "(bad的比较级)更坏的",
    "example": null,
    "category": "a.",
    "id": 1793
  },
  {
    "word": "worst",
    "phonetic": "/wə:st/",
    "meaning": "(bad的最高级)最坏的",
    "example": null,
    "category": "a.",
    "id": 1794
  },
  {
    "word": "worth",
    "phonetic": "/wə:θ/",
    "meaning": "有…的价值,值得…的",
    "example": null,
    "category": "a.",
    "id": 1795
  },
  {
    "word": "would",
    "phonetic": "/wəd, wud/",
    "meaning": "v.（will的过去时）将会,打算,想要,过去常常",
    "example": null,
    "category": "modal",
    "id": 1796
  },
  {
    "word": "wound",
    "phonetic": "/wu:nd/",
    "meaning": "vt.伤,伤害 n. 创伤,伤口",
    "example": null,
    "category": "",
    "id": 1797
  },
  {
    "word": "wounded",
    "phonetic": "/wu:ndɪd/",
    "meaning": "受伤的",
    "example": null,
    "category": "a.",
    "id": 1798
  },
  {
    "word": "write",
    "phonetic": "/raɪt/",
    "meaning": "(wrote, written) v. 写，书写；写作，著述",
    "example": null,
    "category": "",
    "id": 1799
  },
  {
    "word": "wrong",
    "phonetic": "/rɔŋ/",
    "meaning": "错误,不正常,有毛病的",
    "example": null,
    "category": "a.",
    "id": 1800
  },
  {
    "word": "yard",
    "phonetic": "/jɑːd/",
    "meaning": "码；院子；场地",
    "example": null,
    "category": "n.",
    "id": 1801
  },
  {
    "word": "year",
    "phonetic": "/jɪə(r), jəː(r)/",
    "meaning": "年",
    "example": null,
    "category": "n.",
    "id": 1802
  },
  {
    "word": "yellow",
    "phonetic": "/ˈjeləʊ/",
    "meaning": "黄色的",
    "example": null,
    "category": "a.",
    "id": 1803
  },
  {
    "word": "yes",
    "phonetic": "/jes/",
    "meaning": "是，好，同意",
    "example": null,
    "category": "ad.",
    "id": 1804
  },
  {
    "word": "yesterday",
    "phonetic": "/ˈjestədeɪ/",
    "meaning": "n.& ad. 昨天",
    "example": null,
    "category": "",
    "id": 1805
  },
  {
    "word": "yet",
    "phonetic": "/jet/",
    "meaning": "尚，还，仍然",
    "example": null,
    "category": "ad.",
    "id": 1806
  },
  {
    "word": "you",
    "phonetic": "/juː, jʊ/",
    "meaning": "你；你们",
    "example": null,
    "category": "pron.",
    "id": 1807
  },
  {
    "word": "young",
    "phonetic": "/jʌŋ/",
    "meaning": "年轻的",
    "example": null,
    "category": "a.",
    "id": 1808
  },
  {
    "word": "your",
    "phonetic": "/jɔː/",
    "meaning": "你的；你们的",
    "example": null,
    "category": "pron.",
    "id": 1809
  },
  {
    "word": "yours",
    "phonetic": "/jɔːz, jʊəz/",
    "meaning": "你的；你们的",
    "example": null,
    "category": "pron.",
    "id": 1810
  },
  {
    "word": "yourself",
    "phonetic": "/jɔːˈself; (US) jʊərˈself/",
    "meaning": "你自己",
    "example": null,
    "category": "pron.",
    "id": 1811
  },
  {
    "word": "yourselves",
    "phonetic": "/jɔːˈselvz; (US) jʊərˈselvz/",
    "meaning": "你们自己",
    "example": null,
    "category": "pron.",
    "id": 1812
  },
  {
    "word": "youth",
    "phonetic": "/juːθ/",
    "meaning": "青春；青年",
    "example": null,
    "category": "n.",
    "id": 1813
  },
  {
    "word": "zero",
    "phonetic": "/ˈzɪərəʊ/",
    "meaning": "& num. 零,零度,零点",
    "example": null,
    "category": "n.",
    "id": 1814
  },
  {
    "word": "zoo",
    "phonetic": "/zuː/",
    "meaning": "动物园",
    "example": null,
    "category": "n.",
    "id": 1815
  }
];
module.exports = { JUNIOR_VOCAB };
