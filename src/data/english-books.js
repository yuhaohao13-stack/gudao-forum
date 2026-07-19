// 10本经典英文书籍（公版领域/正版内容）
// Junior level: 5 books for 初中
// Senior level: 5 books for 高中

const BOOKS = [
  // ── 初中 (Junior) ──
  {
    id: 1,
    title: "Robinson Crusoe",
    author: "Daniel Defoe",
    year: 1719,
    level: "junior",
    chineseTitle: "鲁滨逊漂流记",
    difficulty: "中等",
    wordCount: "约12000词",
    summary: "Robinson Crusoe, a young Englishman, leaves home against his parents' wishes to go to sea. After a series of adventures, he is shipwrecked on a deserted island where he spends 28 years learning to survive alone. He builds shelter, hunts for food, and eventually befriends a native man he names Friday. This classic tale of survival, resilience, and self-reliance has inspired readers for centuries.",
    chineseSummary: "年轻英国人鲁滨逊不顾父母劝阻出海冒险，遇海难流落荒岛，独自生活28年。他建屋、打猎、种植，最终救下土著「星期五」并结为好友。这部关于生存、坚韧和自立的经典小说激励了无数读者。",
    content: "CHAPTER I - START IN LIFE\n\nI was born in the year 1632, in the city of York, of a good family, though not of that country, my father being a foreigner of Bremen, who settled first at Hull. He got a good estate by merchandise, and leaving off his trade, lived afterward at York, from whence he had married my mother, whose relations were named Robinson, a very good family in that country, and from whom I was called Robinson Kreutznaer; but, by the usual corruption of words in England, we are now called - nay we call ourselves and write our name - Crusoe; and so my companions always called me.\n\nI had two elder brothers, one of whom was lieutenant-colonel to an English regiment of foot in Flanders, formerly commanded by the famous Colonel Lockhart, and was killed at the battle near Dunkirk against the Spaniards. What became of my second brother I never knew, any more than my father or mother knew what became of me.\n\nBeing the third son of the family and not bred to any trade, my head began to be filled very early with rambling thoughts. My father, who was very ancient, had given me a competent share of learning, as far as house-education and a country free school generally go, and designed me for the law; but I would be satisfied with nothing but going to sea; and my inclination to this led me so strongly against the will, nay, the commands of my father, and against all the entreaties and persuasions of my mother and other friends, that there seemed to be something fatal in that propensity of nature, tending directly to the life of misery which was to befall me...",
    chapters: 31,
    source: "Project Gutenberg",
    coverEmoji: "🏝️"
  },
  {
    id: 2,
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    year: 1865,
    level: "junior",
    chineseTitle: "爱丽丝梦游仙境",
    difficulty: "简单",
    wordCount: "约26000词",
    summary: "Alice, a young girl, falls down a rabbit hole into a fantastical world called Wonderland. She encounters peculiar creatures like the White Rabbit, the Cheshire Cat, and the Mad Hatter, and experiences bizarre adventures that challenge logic and reality. This beloved children's classic is celebrated for its imaginative storytelling, witty wordplay, and unforgettable characters.",
    chineseSummary: "小女孩爱丽丝掉进兔子洞，进入奇幻的仙境世界。她遇到了白兔、柴郡猫、疯帽匠等奇特角色，经历了一系列荒诞离奇的冒险。这部深受喜爱的儿童经典以其想象力、巧妙的文字游戏和令人难忘的角色而闻名。",
    content: "CHAPTER I - Down the Rabbit-Hole\n\nAlice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversation?'\n\nSo she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.\n\nThere was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, 'Oh dear! Oh dear! I shall be late!' (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge...",
    chapters: 12,
    source: "Project Gutenberg",
    coverEmoji: "🐰"
  },
  {
    id: 3,
    title: "The Adventures of Tom Sawyer",
    author: "Mark Twain",
    year: 1876,
    level: "junior",
    chineseTitle: "汤姆·索亚历险记",
    difficulty: "中等",
    wordCount: "约70000词",
    summary: "Tom Sawyer is a mischievous young boy living in the fictional town of St. Petersburg, Missouri. Along with his friend Huckleberry Finn, Tom experiences thrilling adventures including treasure hunting, witnessing a murder, and getting lost in a cave. Mark Twain's classic captures the essence of American childhood with humor, warmth, and a keen understanding of human nature.",
    chineseSummary: "汤姆·索亚是一个淘气的小男孩，住在密苏里州的圣彼得堡小镇。他和朋友哈克贝利·芬一起经历惊险刺激的冒险——寻宝、目睹谋杀案、在洞穴中迷路。马克·吐温的经典作品以幽默、温情和对人性的深刻洞察，捕捉了美国童年的精髓。",
    content: "CHAPTER I - Tom Plays, Fights, and Hides\n\n\"TOM!\"\n\nNo answer.\n\n\"TOM!\"\n\nNo answer.\n\n\"What's gone with that boy, I wonder! You TOM!\"\n\nNo answer.\n\nThe old lady pulled her spectacles down and looked over them about the room; then she put them up and looked out under them. She seldom or never looked THROUGH them for so small a thing as a boy; they were her state pair, the pride of her heart, and were built for \"style,\" not service—she could have seen through a pair of stove-lids just as well. She looked perplexed for a moment, and then said, not fiercely, but still loud enough for the furniture to hear:\n\n\"Well, I lay if I get hold of you I'll—\"\n\nShe did not finish, for by this time she was bending down and punching under the bed with the broom, and so she needed breath to punctuate the punches with. She resurrected nothing but the cat.\n\n\"I never did see the beat of that boy!\"\n\nShe went to the open door and stood in it and looked out among the tomato vines and 'jimpson' weeds that constituted the garden. No Tom. So she lifted up her voice at an angle calculated for distance and shouted:\n\n\"Y-o-u-u TOM!\"...",
    chapters: 35,
    source: "Project Gutenberg",
    coverEmoji: "🎣"
  },
  {
    id: 4,
    title: "Treasure Island",
    author: "Robert Louis Stevenson",
    year: 1883,
    level: "junior",
    chineseTitle: "金银岛",
    difficulty: "中等",
    wordCount: "约66000词",
    summary: "Young Jim Hawkins discovers a treasure map in the chest of a dead pirate at his parents' inn. He joins a voyage to find the buried treasure, but the ship's crew includes treacherous pirates led by the one-legged Long John Silver. A thrilling tale of adventure, bravery, and betrayal on the high seas.",
    chineseSummary: "少年吉姆·霍金斯在父母旅馆里从一名死去的海盗遗物中发现了一张藏宝图。他加入寻宝之旅，但船上竟有独腿海盗朗·约翰·西尔弗率领的叛匪。这是一个惊心动魄的海上冒险故事，充满了勇气、背叛和传奇。",
    content: "CHAPTER I - The Old Sea-dog at the Admiral Benbow\n\nSQUIRE TRELAWNEY, Dr. Livesey, and the rest of these gentlemen having asked me to write down the whole particulars about Treasure Island, from the beginning to the end, keeping nothing back but the bearings of the island, and that only because there is still treasure not yet lifted, I take up my pen in the year of grace 17__ and go back to the time when my father kept the Admiral Benbow inn and the brown old seaman with the sabre cut first took up his lodging under our roof.\n\nI remember him as if it were yesterday, as he came plodding to the inn door, his sea-chest following behind him in a hand-barrow—a tall, strong, heavy, nut-brown man, his tarry pigtail falling over the shoulder of his soiled blue coat, his hands ragged and scarred, with black, broken nails, and the sabre cut across one cheek, a dirty, livid white. I remember him looking round the cove and whistling to himself as he did so, and then breaking out in that old sea-song that he sang so often afterwards:\n\n\"Fifteen men on the dead man's chest—Yo-ho-ho, and a bottle of rum!\"...",
    chapters: 34,
    source: "Project Gutenberg",
    coverEmoji: "🏴‍☠️"
  },
  {
    id: 5,
    title: "The Wonderful Wizard of Oz",
    author: "L. Frank Baum",
    year: 1900,
    level: "junior",
    chineseTitle: "绿野仙踪",
    difficulty: "简单",
    wordCount: "约40000词",
    summary: "Dorothy Gale, a young girl from Kansas, is swept away by a cyclone to the magical land of Oz. To return home, she must travel to the Emerald City and ask the powerful Wizard of Oz for help. Along the yellow brick road, she makes three unforgettable friends: a Scarecrow wanting a brain, a Tin Woodman wanting a heart, and a Cowardly Lion wanting courage.",
    chineseSummary: "堪萨斯女孩多萝西被龙卷风卷到神奇的奥兹国。为了回家，她必须沿着黄砖路去翡翠城向伟大的奥兹巫师求助。旅途中她遇到了三个难忘的朋友：想要脑子的稻草人、想要心脏的铁皮人和想要勇气的胆小狮子。",
    content: "CHAPTER I - The Cyclone\n\nDorothy lived in the midst of the great Kansas prairies, with Uncle Henry, who was a farmer, and Aunt Em, who was the farmer's wife. Their house was small, for the lumber to build it had to be carried by wagon many miles. There were four walls, a floor and a roof, which made one room; and this room contained a rusty looking cookstove, a cupboard for the dishes, a table, three or four chairs, and the beds. Uncle Henry and Aunt Em had a big bed in one corner, and Dorothy a little bed in another corner. There was no garret at all, and no cellar—except a small hole dug in the ground, called a cyclone cellar, where the family could go in case one of those great whirlwinds arose, mighty enough to crush any building in its path. It was reached by a trap door in the middle of the floor, from which a ladder led down into the small, dark hole.\n\nWhen Dorothy stood in the doorway and looked around, she could see nothing but the great gray prairie on every side. Not a tree nor a house broke the broad sweep of flat country that reached the edge of the sky in all directions. The sun had baked the plowed land into a gray mass, with little cracks running through it...",
    chapters: 24,
    source: "Project Gutenberg",
    coverEmoji: "🌈"
  },
  // ── 高中 (Senior) ──
  {
    id: 6,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: 1813,
    level: "senior",
    chineseTitle: "傲慢与偏见",
    difficulty: "较难",
    wordCount: "约120000词",
    summary: "Elizabeth Bennet, the intelligent and spirited daughter of a country gentleman, navigates issues of manners, morality, and marriage in Regency-era England. Her initial prejudice against the wealthy Mr. Darcy, and his apparent pride, creates a complex dance of misunderstanding and eventual love. Austen's masterpiece is a brilliant social commentary and one of the most beloved novels in English literature.",
    chineseSummary: "乡村绅士家的聪慧女儿伊丽莎白·班内特在摄政时期的英格兰面对礼仪、道德和婚姻等诸多问题。她对富有的达西先生最初的偏见，以及达西表面的傲慢，交织出一曲关于误解与最终相爱的复杂舞曲。奥斯汀的这部杰作是对社会的精彩评述，也是英语文学中最受欢迎的小说之一。",
    content: "CHAPTER I\n\nIt is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\n\nHowever little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.\n\n\"My dear Mr. Bennet,\" said his lady to him one day, \"have you heard that Netherfield Park is let at last?\"\n\nMr. Bennet replied that he had not.\n\n\"But it is,\" returned she; \"for Mrs. Long has just been here, and she told me all about it.\"\n\nMr. Bennet made no answer.\n\n\"Do you not want to know who has taken it?\" cried his wife impatiently.\n\n\"You want to tell me, and I have no objection to hearing it.\"\n\nThis was invitation enough.\n\n\"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it, that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and some of his servants are to be in the house by the end of next week.\"...",
    chapters: 61,
    source: "Project Gutenberg",
    coverEmoji: "💃"
  },
  {
    id: 7,
    title: "A Christmas Carol",
    author: "Charles Dickens",
    year: 1843,
    level: "senior",
    chineseTitle: "圣诞颂歌",
    difficulty: "中等",
    wordCount: "约28000词",
    summary: "Ebenezer Scrooge, a miserly old man, is visited by the ghost of his former business partner Jacob Marley and the spirits of Christmas Past, Present, and Yet to Come. Through these supernatural visits, Scrooge confronts his selfish ways and discovers the true meaning of Christmas. Dickens' heartwarming tale of redemption has become a holiday classic worldwide.",
    chineseSummary: "吝啬鬼斯克鲁奇在圣诞夜被已故生意伙伴马利的鬼魂以及过去、现在和未来三个圣诞精灵拜访。通过这些超自然的访问，斯克鲁奇面对自己的自私行径，发现了圣诞节的真正意义。狄更斯这部温馨的救赎故事已成为全球节日经典。",
    content: "STAVE I - Marley's Ghost\n\nMarley was dead: to begin with. There is no doubt whatever about that. The register of his burial was signed by the clergyman, the clerk, the undertaker, and the chief mourner. Scrooge signed it: and Scrooge's name was good upon 'Change, for anything he chose to put his hand to. Old Marley was as dead as a door-nail.\n\nMind! I don't mean to say that I know, of my own knowledge, what there is particularly dead about a door-nail. I might have been inclined, myself, to regard a coffin-nail as the deadest piece of ironmongery in the trade. But the wisdom of our ancestors is in the simile; and my unhallowed hands shall not disturb it, or the Country's done for. You will therefore permit me to repeat, emphatically, that Marley was as dead as a door-nail.\n\nScrooge knew he was dead? Of course he did. How could it be otherwise? Scrooge and he were partners for I don't know how many years. Scrooge was his sole executor, his sole administrator, his sole assign, his sole residuary legatee, his sole friend, and sole mourner...",
    chapters: 5,
    source: "Project Gutenberg",
    coverEmoji: "🎄"
  },
  {
    id: 8,
    title: "The Call of the Wild",
    author: "Jack London",
    year: 1903,
    level: "senior",
    chineseTitle: "野性的呼唤",
    difficulty: "中等",
    wordCount: "约32000词",
    summary: "Buck, a powerful and dignified St. Bernard-Scotch Collie mix, lives a comfortable life in California until he is stolen and sold into the brutal world of the Klondike Gold Rush. Forced to become a sled dog, Buck must adapt to the harsh wilderness, learning to fight, survive, and ultimately heed the call of his wild instincts. A powerful story of primal survival.",
    chineseSummary: "巴克是一只强壮高贵的圣伯纳犬，在加州过着舒适的生活，直到被偷走卖入残酷的克朗代克淘金热世界。被迫成为雪橇犬的巴克必须适应严酷的荒野，学会战斗、生存，最终听从野性本能的呼唤。一个关于原始生存的强力故事。",
    content: "CHAPTER I - Into the Primitive\n\nBuck did not read the newspapers, or he would have known that trouble was brewing, not alone for himself, but for every tide-water dog, strong of muscle and with warm, long hair, from Puget Sound to San Diego. Because men, groping in the Arctic darkness, had found a yellow metal, and because steamship and transportation companies were booming the find, thousands of men were rushing into the Northland. These men wanted dogs, and the dogs they wanted were heavy dogs, with strong muscles by which to toil, and furry coats to protect them from the frost.\n\nBuck lived at a big house in the sun-kissed Santa Clara Valley. Judge Miller's place, it was called. It stood back from the road, half-hidden among the trees, through which glimpses could be caught of the wide cool veranda that ran around its four sides. The house was approached by gravelled driveways which wound about through wide-spreading lawns and under the interlacing boughs of tall poplars. At the rear things were on even a more spacious scale than at the front...",
    chapters: 7,
    source: "Project Gutenberg",
    coverEmoji: "🐺"
  },
  {
    id: 9,
    title: "Great Expectations",
    author: "Charles Dickens",
    year: 1861,
    level: "senior",
    chineseTitle: "远大前程",
    difficulty: "较难",
    wordCount: "约180000词",
    summary: "Pip, an orphan boy from a humble background, is given a mysterious fortune by an unknown benefactor. Sent to London to become a gentleman, Pip abandons his old friends and falls in love with the cold, beautiful Estella. Through his journey of self-discovery, Pip learns that true nobility comes from character, not wealth. One of Dickens' greatest novels about ambition, love, and redemption.",
    chineseSummary: "出身卑微的孤儿匹普得到一位匿名恩人提供的巨额财富，被送到伦敦成为绅士。匹普抛弃了旧友，爱上了冷漠美丽的艾丝黛拉。在自我发现的旅程中，匹普领悟到真正的贵族源于品格而非财富。狄更斯最伟大的关于抱负、爱情和救赎的小说之一。",
    content: "CHAPTER I\n\nMy father's family name being Pirrip, and my Christian name Philip, my infant tongue could make of both names nothing longer or more explicit than Pip. So, I called myself Pip, and came to be called Pip.\n\nI give Pirrip as my father's family name, on the authority of his tombstone and my sister,—Mrs. Joe Gargery, who married the blacksmith. As I never saw my father or my mother, and never saw any likeness of either of them (for their days were long before the days of photographs), my first fancies regarding what they were like were unreasonably derived from their tombstones...\n\nOurs was the marsh country, down by the river, within, as the river wound, twenty miles of the sea. My first most vivid and broad impression of the identity of things seems to me to have been gained on a memorable raw afternoon towards evening. At such a time I found out for certain that this bleak place overgrown with nettles was the churchyard; and that Philip Pirrip, late of this parish, and also Georgiana wife of the above, were dead and buried; and that Alexander, Bartholomew, Abraham, Tobias, and Roger, infant children of the aforesaid, were also dead and buried; and that the dark flat wilderness beyond the churchyard, intersected with dikes and mounds and gates, with scattered cattle feeding on it, was the marshes; and that the low leaden line beyond was the river; and that the distant savage lair from which the wind was rushing was the sea; and that the small bundle of shivers growing afraid of it all and beginning to cry, was Pip...",
    chapters: 59,
    source: "Project Gutenberg",
    coverEmoji: "💷"
  },
  {
    id: 10,
    title: "Moby-Dick",
    author: "Herman Melville",
    year: 1851,
    level: "senior",
    chineseTitle: "白鲸记",
    difficulty: "困难",
    wordCount: "约210000词",
    summary: "Ishmael, a schoolteacher, joins a whaling ship called the Pequod, whose captain, the obsessive Ahab, is on a vengeful quest to hunt down Moby-Dick, a giant white sperm whale that destroyed his ship and tore off his leg. This epic novel explores themes of obsession, fate, good versus evil, and humanity's struggle against nature. Considered one of the greatest American novels ever written.",
    chineseSummary: "教师以实玛利登上捕鲸船裴廓德号，船长亚哈性情偏执，一心要追杀那头曾经毁掉他的船并咬断他一条腿的巨大白色抹香鲸——莫比·迪克。这部史诗般的小说探讨了偏执、命运、善恶对抗以及人类与自然的斗争，被誉为美国最伟大的小说之一。",
    content: "CHAPTER I - Loomings\n\nCall me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people's hats off—then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me...",
    chapters: 135,
    source: "Project Gutenberg",
    coverEmoji: "🐋"
  }
]

const JUNIOR_BOOKS = BOOKS.filter(b => b.level === 'junior')
const SENIOR_BOOKS = BOOKS.filter(b => b.level === 'senior')

module.exports = { BOOKS, JUNIOR_BOOKS, SENIOR_BOOKS }
