const POEMS = [
  // ========== 山水田园 (Landscape & Pastoral) ==========
  { id: '1', title: '静夜思', author: '李白', content: '床前明月光\n疑是地上霜\n举头望明月\n低头思故乡', category: '思乡怀人' },
  { id: '2', title: '望庐山瀑布', author: '李白', content: '日照香炉生紫烟\n遥看瀑布挂前川\n飞流直下三千尺\n疑是银河落九天', category: '山水田园' },
  { id: '3', title: '早发白帝城', author: '李白', content: '朝辞白帝彩云间\n千里江陵一日还\n两岸猿声啼不住\n轻舟已过万重山', category: '山水田园' },
  { id: '4', title: '望天门山', author: '李白', content: '天门中断楚江开\n碧水东流至此回\n两岸青山相对出\n孤帆一片日边来', category: '山水田园' },
  { id: '5', title: '独坐敬亭山', author: '李白', content: '众鸟高飞尽\n孤云独去闲\n相看两不厌\n只有敬亭山', category: '山水田园' },
  { id: '6', title: '夜宿山寺', author: '李白', content: '危楼高百尺\n手可摘星辰\n不敢高声语\n恐惊天上人', category: '山水田园' },
  { id: '7', title: '绝句', author: '杜甫', content: '两个黄鹂鸣翠柳\n一行白鹭上青天\n窗含西岭千秋雪\n门泊东吴万里船', category: '山水田园' },
  { id: '8', title: '春夜喜雨', author: '杜甫', content: '好雨知时节\n当春乃发生\n随风潜入夜\n润物细无声\n野径云俱黑\n江船火独明\n晓看红湿处\n花重锦官城', category: '山水田园' },
  { id: '9', title: '山居秋暝', author: '王维', content: '空山新雨后\n天气晚来秋\n明月松间照\n清泉石上流\n竹喧归浣女\n莲动下渔舟\n随意春芳歇\n王孙自可留', category: '山水田园' },
  { id: '10', title: '鸟鸣涧', author: '王维', content: '人闲桂花落\n夜静春山空\n月出惊山鸟\n时鸣春涧中', category: '山水田园' },
  { id: '11', title: '鹿柴', author: '王维', content: '空山不见人\n但闻人语响\n返景入深林\n复照青苔上', category: '山水田园' },
  { id: '12', title: '画', author: '王维', content: '远看山有色\n近听水无声\n春去花还在\n人来鸟不惊', category: '山水田园' },
  { id: '13', title: '春晓', author: '孟浩然', content: '春眠不觉晓\n处处闻啼鸟\n夜来风雨声\n花落知多少', category: '山水田园' },
  { id: '14', title: '山行', author: '杜牧', content: '远上寒山石径斜\n白云生处有人家\n停车坐爱枫林晚\n霜叶红于二月花', category: '山水田园' },
  { id: '15', title: '江南春', author: '杜牧', content: '千里莺啼绿映红\n水村山郭酒旗风\n南朝四百八十寺\n多少楼台烟雨中', category: '山水田园' },
  { id: '16', title: '钱塘湖春行', author: '白居易', content: '孤山寺北贾亭西\n水面初平云脚低\n几处早莺争暖树\n谁家新燕啄春泥\n乱花渐欲迷人眼\n浅草才能没马蹄\n最爱湖东行不足\n绿杨阴里白沙堤', category: '山水田园' },
  { id: '17', title: '大林寺桃花', author: '白居易', content: '人间四月芳菲尽\n山寺桃花始盛开\n长恨春归无觅处\n不知转入此中来', category: '山水田园' },
  { id: '18', title: '早春呈水部张十八员外', author: '韩愈', content: '天街小雨润如酥\n草色遥看近却无\n最是一年春好处\n绝胜烟柳满皇都', category: '山水田园' },
  { id: '19', title: '春江花月夜', author: '张若虚', content: '春江潮水连海平\n海上明月共潮生\n滟滟随波千万里\n何处春江无月明\n江流宛转绕芳甸\n月照花林皆似霰\n空里流霜不觉飞\n汀上白沙看不见', category: '山水田园' },

  // ========== 边塞征战 (Frontier & Battle) ==========
  { id: '20', title: '出塞', author: '王昌龄', content: '秦时明月汉时关\n万里长征人未还\n但使龙城飞将在\n不教胡马度阴山', category: '边塞征战' },
  { id: '21', title: '从军行', author: '王昌龄', content: '青海长云暗雪山\n孤城遥望玉门关\n黄沙百战穿金甲\n不破楼兰终不还', category: '边塞征战' },
  { id: '22', title: '凉州词', author: '王之涣', content: '黄河远上白云间\n一片孤城万仞山\n羌笛何须怨杨柳\n春风不度玉门关', category: '边塞征战' },
  { id: '23', title: '凉州词', author: '王翰', content: '葡萄美酒夜光杯\n欲饮琵琶马上催\n醉卧沙场君莫笑\n古来征战几人回', category: '边塞征战' },
  { id: '24', title: '使至塞上', author: '王维', content: '单车欲问边\n属国过居延\n征蓬出汉塞\n归雁入胡天\n大漠孤烟直\n长河落日圆\n萧关逢候骑\n都护在燕然', category: '边塞征战' },
  { id: '25', title: '塞下曲', author: '卢纶', content: '月黑雁飞高\n单于夜遁逃\n欲将轻骑逐\n大雪满弓刀', category: '边塞征战' },
  { id: '26', title: '白雪歌送武判官归京', author: '岑参', content: '北风卷地白草折\n胡天八月即飞雪\n忽如一夜春风来\n千树万树梨花开\n散入珠帘湿罗幕\n狐裘不暖锦衾薄\n将军角弓不得控\n都护铁衣冷难着', category: '边塞征战' },
  { id: '27', title: '雁门太守行', author: '李贺', content: '黑云压城城欲摧\n甲光向日金鳞开\n角声满天秋色里\n塞上燕脂凝夜紫\n半卷红旗临易水\n霜重鼓寒声不起\n报君黄金台上意\n提携玉龙为君死', category: '边塞征战' },

  // ========== 咏物言志 (Objects & Aspirations) ==========
  { id: '28', title: '望岳', author: '杜甫', content: '岱宗夫如何\n齐鲁青未了\n造化钟神秀\n阴阳割昏晓\n荡胸生曾云\n决眦入归鸟\n会当凌绝顶\n一览众山小', category: '咏物言志' },
  { id: '29', title: '登高', author: '杜甫', content: '风急天高猿啸哀\n渚清沙白鸟飞回\n无边落木萧萧下\n不尽长江滚滚来\n万里悲秋常作客\n百年多病独登台\n艰难苦恨繁霜鬓\n潦倒新停浊酒杯', category: '咏物言志' },
  { id: '30', title: '登鹳雀楼', author: '王之涣', content: '白日依山尽\n黄河入海流\n欲穷千里目\n更上一层楼', category: '咏物言志' },
  { id: '31', title: '江雪', author: '柳宗元', content: '千山鸟飞绝\n万径人踪灭\n孤舟蓑笠翁\n独钓寒江雪', category: '咏物言志' },
  { id: '32', title: '咏柳', author: '贺知章', content: '碧玉妆成一树高\n万条垂下绿丝绦\n不知细叶谁裁出\n二月春风似剪刀', category: '咏物言志' },
  { id: '33', title: '登幽州台歌', author: '陈子昂', content: '前不见古人\n后不见来者\n念天地之悠悠\n独怆然而涕下', category: '咏物言志' },
  { id: '34', title: '锦瑟', author: '李商隐', content: '锦瑟无端五十弦\n一弦一柱思华年\n庄生晓梦迷蝴蝶\n望帝春心托杜鹃\n沧海月明珠有泪\n蓝田日暖玉生烟\n此情可待成追忆\n只是当时已惘然', category: '咏物言志' },
  { id: '35', title: '嫦娥', author: '李商隐', content: '云母屏风烛影深\n长河渐落晓星沉\n嫦娥应悔偷灵药\n碧海青天夜夜心', category: '咏物言志' },
  { id: '36', title: '行路难', author: '李白', content: '金樽清酒斗十千\n玉盘珍羞直万钱\n停杯投箸不能食\n拔剑四顾心茫然\n欲渡黄河冰塞川\n将登太行雪满山\n闲来垂钓碧溪上\n忽复乘舟梦日边\n行路难\n行路难\n多歧路\n今安在\n长风破浪会有时\n直挂云帆济沧海', category: '咏物言志' },
  { id: '37', title: '将进酒', author: '李白', content: '君不见黄河之水天上来\n奔流到海不复回\n君不见高堂明镜悲白发\n朝如青丝暮成雪\n人生得意须尽欢\n莫使金樽空对月\n天生我材必有用\n千金散尽还复来', category: '咏物言志' },
  { id: '38', title: '月下独酌', author: '李白', content: '花间一壶酒\n独酌无相亲\n举杯邀明月\n对影成三人\n月既不解饮\n影徒随我身\n暂伴月将影\n行乐须及春', category: '咏物言志' },
  { id: '39', title: '秋词', author: '刘禹锡', content: '自古逢秋悲寂寥\n我言秋日胜春朝\n晴空一鹤排云上\n便引诗情到碧霄', category: '咏物言志' },
  { id: '40', title: '竹枝词', author: '刘禹锡', content: '杨柳青青江水平\n闻郎江上踏歌声\n东边日出西边雨\n道是无晴却有晴', category: '咏物言志' },

  // ========== 送别友情 (Farewell & Friendship) ==========
  { id: '41', title: '赠汪伦', author: '李白', content: '李白乘舟将欲行\n忽闻岸上踏歌声\n桃花潭水深千尺\n不及汪伦送我情', category: '送别友情' },
  { id: '42', title: '黄鹤楼送孟浩然之广陵', author: '李白', content: '故人西辞黄鹤楼\n烟花三月下扬州\n孤帆远影碧空尽\n唯见长江天际流', category: '送别友情' },
  { id: '43', title: '送杜少府之任蜀州', author: '王勃', content: '城阙辅三秦\n风烟望五津\n与君离别意\n同是宦游人\n海内存知己\n天涯若比邻\n无为在歧路\n儿女共沾巾', category: '送别友情' },
  { id: '44', title: '送元二使安西', author: '王维', content: '渭城朝雨浥轻尘\n客舍青青柳色新\n劝君更尽一杯酒\n西出阳关无故人', category: '送别友情' },
  { id: '45', title: '别董大', author: '高适', content: '千里黄云白日曛\n北风吹雁雪纷纷\n莫愁前路无知己\n天下谁人不识君', category: '送别友情' },
  { id: '46', title: '赋得古原草送别', author: '白居易', content: '离离原上草\n一岁一枯荣\n野火烧不尽\n春风吹又生\n远芳侵古道\n晴翠接荒城\n又送王孙去\n萋萋满别情', category: '送别友情' },
  { id: '47', title: '芙蓉楼送辛渐', author: '王昌龄', content: '寒雨连江夜入吴\n平明送客楚山孤\n洛阳亲友如相问\n一片冰心在玉壶', category: '送别友情' },
  { id: '48', title: '过故人庄', author: '孟浩然', content: '故人具鸡黍\n邀我至田家\n绿树村边合\n青山郭外斜\n开轩面场圃\n把酒话桑麻\n待到重阳日\n还来就菊花', category: '送别友情' },
  { id: '49', title: '闻王昌龄左迁龙标遥有此寄', author: '李白', content: '杨花落尽子规啼\n闻道龙标过五溪\n我寄愁心与明月\n随风直到夜郎西', category: '送别友情' },
  { id: '50', title: '无题', author: '李商隐', content: '相见时难别亦难\n东风无力百花残\n春蚕到死丝方尽\n蜡炬成灰泪始干\n晓镜但愁云鬓改\n夜吟应觉月光寒\n蓬山此去无多路\n青鸟殷勤为探看', category: '送别友情' },
  { id: '51', title: '问刘十九', author: '白居易', content: '绿蚁新醅酒\n红泥小火炉\n晚来天欲雪\n能饮一杯无', category: '送别友情' },

  // ========== 思乡怀人 (Homesickness & Longing) ==========
  { id: '52', title: '九月九日忆山东兄弟', author: '王维', content: '独在异乡为异客\n每逢佳节倍思亲\n遥知兄弟登高处\n遍插茱萸少一人', category: '思乡怀人' },
  { id: '53', title: '相思', author: '王维', content: '红豆生南国\n春来发几枝\n愿君多采撷\n此物最相思', category: '思乡怀人' },
  { id: '54', title: '枫桥夜泊', author: '张继', content: '月落乌啼霜满天\n江枫渔火对愁眠\n姑苏城外寒山寺\n夜半钟声到客船', category: '思乡怀人' },
  { id: '55', title: '回乡偶书', author: '贺知章', content: '少小离家老大回\n乡音无改鬓毛衰\n儿童相见不相识\n笑问客从何处来', category: '思乡怀人' },
  { id: '56', title: '宿建德江', author: '孟浩然', content: '移舟泊烟渚\n日暮客愁新\n野旷天低树\n江清月近人', category: '思乡怀人' },
  { id: '57', title: '夜雨寄北', author: '李商隐', content: '君问归期未有期\n巴山夜雨涨秋池\n何当共剪西窗烛\n却话巴山夜雨时', category: '思乡怀人' },
  { id: '58', title: '黄鹤楼', author: '崔颢', content: '昔人已乘黄鹤去\n此地空余黄鹤楼\n黄鹤一去不复返\n白云千载空悠悠\n晴川历历汉阳树\n芳草萋萋鹦鹉洲\n日暮乡关何处是\n烟波江上使人愁', category: '思乡怀人' },
  { id: '59', title: '月夜忆舍弟', author: '杜甫', content: '戍鼓断人行\n边秋一雁声\n露从今夜白\n月是故乡明\n有弟皆分散\n无家问死生\n寄书长不达\n况乃未休兵', category: '思乡怀人' },
  { id: '60', title: '古朗月行', author: '李白', content: '小时不识月\n呼作白玉盘\n又疑瑶台镜\n飞在青云端\n仙人垂两足\n桂树何团团\n白兔捣药成\n问言与谁餐', category: '思乡怀人' },

  // ========== 爱国忧民 (Patriotism & People) ==========
  { id: '61', title: '春望', author: '杜甫', content: '国破山河在\n城春草木深\n感时花溅泪\n恨别鸟惊心\n烽火连三月\n家书抵万金\n白头搔更短\n浑欲不胜簪', category: '爱国忧民' },
  { id: '62', title: '茅屋为秋风所破歌', author: '杜甫', content: '八月秋高风怒号\n卷我屋上三重茅\n茅飞渡江洒江郊\n高者挂罥长林梢\n下者飘转沉塘坳\n安得广厦千万间\n大庇天下寒士俱欢颜\n风雨不动安如山', category: '爱国忧民' },
  { id: '63', title: '闻官军收河南河北', author: '杜甫', content: '剑外忽传收蓟北\n初闻涕泪满衣裳\n却看妻子愁何在\n漫卷诗书喜欲狂\n白日放歌须纵酒\n青春作伴好还乡\n即从巴峡穿巫峡\n便下襄阳向洛阳', category: '爱国忧民' },
  { id: '64', title: '悯农', author: '李绅', content: '锄禾日当午\n汗滴禾下土\n谁知盘中餐\n粒粒皆辛苦', category: '爱国忧民' },
  { id: '65', title: '悯农（其二）', author: '李绅', content: '春种一粒粟\n秋收万颗子\n四海无闲田\n农夫犹饿死', category: '爱国忧民' },
  { id: '66', title: '泊秦淮', author: '杜牧', content: '烟笼寒水月笼沙\n夜泊秦淮近酒家\n商女不知亡国恨\n隔江犹唱后庭花', category: '爱国忧民' },
]

export const CATEGORIES = ['山水田园', '边塞征战', '咏物言志', '送别友情', '思乡怀人', '爱国忧民']

export default POEMS
