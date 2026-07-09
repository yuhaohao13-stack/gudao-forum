'use client'
import { useState } from 'react'

const CHINA_REGIONS = [
  { n: '北京', c: [] },
  { n: '上海', c: [] },
  { n: '天津', c: [] },
  { n: '重庆', c: [] },
  { n: '河北', c: ['石家庄','唐山','秦皇岛','邯郸','邢台','保定','张家口','承德','沧州','廊坊','衡水'] },
  { n: '山西', c: ['太原','大同','阳泉','长治','晋城','朔州','晋中','运城','忻州','临汾','吕梁'] },
  { n: '内蒙古', c: ['呼和浩特','包头','乌海','赤峰','通辽','鄂尔多斯','呼伦贝尔','巴彦淖尔','乌兰察布','兴安盟','锡林郭勒盟','阿拉善盟'] },
  { n: '辽宁', c: ['沈阳','大连','鞍山','抚顺','本溪','丹东','锦州','营口','阜新','辽阳','盘锦','铁岭','朝阳','葫芦岛'] },
  { n: '吉林', c: ['长春','吉林','四平','辽源','通化','白山','松原','白城','延边'] },
  { n: '黑龙江', c: ['哈尔滨','齐齐哈尔','鸡西','鹤岗','双鸭山','大庆','伊春','佳木斯','七台河','牡丹江','黑河','绥化','大兴安岭'] },
  { n: '江苏', c: ['南京','无锡','徐州','常州','苏州','南通','连云港','淮安','盐城','扬州','镇江','泰州','宿迁'] },
  { n: '浙江', c: ['杭州','宁波','温州','嘉兴','湖州','绍兴','金华','衢州','舟山','台州','丽水'] },
  { n: '安徽', c: ['合肥','芜湖','蚌埠','淮南','马鞍山','淮北','铜陵','安庆','黄山','滁州','阜阳','宿州','六安','亳州','池州','宣城'] },
  { n: '福建', c: ['福州','厦门','莆田','三明','泉州','漳州','南平','龙岩','宁德'] },
  { n: '江西', c: ['南昌','景德镇','萍乡','九江','新余','鹰潭','赣州','吉安','宜春','抚州','上饶'] },
  { n: '山东', c: ['济南','青岛','淄博','枣庄','东营','烟台','潍坊','济宁','泰安','威海','日照','临沂','德州','聊城','滨州','菏泽'] },
  { n: '河南', c: ['郑州','开封','洛阳','平顶山','安阳','鹤壁','新乡','焦作','濮阳','许昌','漯河','三门峡','南阳','商丘','信阳','周口','驻马店','济源'] },
  { n: '湖北', c: ['武汉','黄石','十堰','宜昌','襄阳','鄂州','荆门','孝感','荆州','黄冈','咸宁','随州','恩施'] },
  { n: '湖南', c: ['长沙','株洲','湘潭','衡阳','邵阳','岳阳','常德','张家界','益阳','郴州','永州','怀化','娄底','湘西'] },
  { n: '广东', c: ['广州','深圳','珠海','汕头','佛山','韶关','湛江','肇庆','江门','茂名','惠州','梅州','汕尾','河源','阳江','清远','东莞','中山','潮州','揭阳','云浮'] },
  { n: '广西', c: ['南宁','柳州','桂林','梧州','北海','防城港','钦州','贵港','玉林','百色','贺州','河池','来宾','崇左'] },
  { n: '海南', c: ['海口','三亚','三沙','儋州'] },
  { n: '四川', c: ['成都','自贡','攀枝花','泸州','德阳','绵阳','广元','遂宁','内江','乐山','南充','眉山','宜宾','广安','达州','雅安','巴中','资阳'] },
  { n: '贵州', c: ['贵阳','六盘水','遵义','安顺','毕节','铜仁','黔西南','黔东南','黔南'] },
  { n: '云南', c: ['昆明','曲靖','玉溪','保山','昭通','丽江','普洱','临沧','楚雄','红河','文山','西双版纳','大理','德宏','怒江','迪庆'] },
  { n: '西藏', c: ['拉萨','日喀则','昌都','林芝','山南','那曲','阿里'] },
  { n: '陕西', c: ['西安','铜川','宝鸡','咸阳','渭南','延安','汉中','榆林','安康','商洛'] },
  { n: '甘肃', c: ['兰州','嘉峪关','金昌','白银','天水','武威','张掖','平凉','酒泉','庆阳','定西','陇南','临夏','甘南'] },
  { n: '青海', c: ['西宁','海东','海北','黄南','海南','果洛','玉树','海西'] },
  { n: '宁夏', c: ['银川','石嘴山','吴忠','固原','中卫'] },
  { n: '新疆', c: ['乌鲁木齐','克拉玛依','吐鲁番','哈密','昌吉','博尔塔拉','巴音郭楞','阿克苏','克孜勒苏','喀什','和田','伊犁','塔城','阿勒泰'] },
  { n: '台湾', c: ['台北','高雄','台中','台南','基隆','新竹','嘉义','桃园','新北'] },
  { n: '香港', c: [] },
  { n: '澳门', c: [] },
]

export default function BirthPlaceSelector({ value, onChange, lang }) {
  const t = (zh, en) => lang === 'en' ? en : zh
  const isOverseas = value?.overseas === true
  const sel = isOverseas ? null : CHINA_REGIONS.find(r => r.n === value?.province)

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button type="button" onClick={() => onChange({ overseas: true })}
          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
            isOverseas ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
          🌍 {t('海外', 'Overseas')}
        </button>
        <button type="button" onClick={() => onChange({ province: '', city: '' })}
          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
            !isOverseas ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
          🇨🇳 {t('中国', 'China')}
        </button>
      </div>

      {isOverseas ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-500">
          {t('海外', 'Overseas')}
        </div>
      ) : (
        <>
          <select value={value?.province || ''}
            onChange={e => onChange({ province: e.target.value, city: '' })}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">{t('请选择省份', 'Select province')}</option>
            {CHINA_REGIONS.map(r => <option key={r.n} value={r.n}>{r.n}</option>)}
          </select>

          {value?.province && sel?.c?.length > 0 && (
            <select value={value?.city || ''}
              onChange={e => onChange({ province: value.province, city: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">{t('请选择城市', 'Select city')}</option>
              {sel.c.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}

          {value?.province && sel?.c?.length === 0 && (
            <div className="text-xs text-gray-400 px-1">{t('无需选择城市', 'No city selection needed')}</div>
          )}
        </>
      )}
    </div>
  )
}

export function bpStr(v) {
  if (!v) return ''
  if (v.overseas) return '海外'
  return v.province + (v.city ? '/' + v.city : '')
}

export function parseBp(s) {
  if (!s) return { province: '', city: '' }
  if (s === '海外') return { overseas: true }
  const p = s.split('/')
  return { province: p[0], city: p[1] || '' }
}
