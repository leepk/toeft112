
const COMMON_VI = {
  the:'cái / người / sự (mạo từ)', a:'một', an:'một', and:'và', or:'hoặc', but:'nhưng', because:'bởi vì',
  so:'vì vậy', if:'nếu', when:'khi', while:'trong khi', before:'trước', after:'sau', with:'với', without:'không có',
  for:'cho / để', from:'từ', to:'đến / để', of:'của', in:'trong', on:'trên', at:'tại', by:'bởi / bằng', about:'về',
  this:'điều này', that:'điều đó', these:'những điều này', those:'những điều đó', it:'nó / điều đó', they:'họ / chúng',
  we:'chúng ta', you:'bạn', i:'tôi', he:'anh ấy', she:'cô ấy', is:'là', are:'là', was:'đã là', were:'đã là',
  be:'là / trở thành', have:'có', has:'có', had:'đã có', do:'làm', does:'làm', did:'đã làm', can:'có thể',
  could:'có thể', should:'nên', would:'sẽ / muốn', will:'sẽ', may:'có thể', might:'có lẽ', must:'phải',
  need:'cần', want:'muốn', like:'thích / giống', know:'biết', think:'nghĩ', understand:'hiểu', explain:'giải thích',
  ask:'hỏi', answer:'trả lời', say:'nói', tell:'nói / cho biết', speak:'nói', listen:'nghe', read:'đọc', write:'viết',
  learn:'học', study:'học', work:'làm việc', help:'giúp', use:'sử dụng', make:'làm / tạo', choose:'chọn',
  change:'thay đổi', check:'kiểm tra', confirm:'xác nhận', review:'xem lại', compare:'so sánh', improve:'cải thiện',
  problem:'vấn đề', solution:'giải pháp', reason:'lý do', example:'ví dụ', result:'kết quả', detail:'chi tiết',
  idea:'ý tưởng', main:'chính', important:'quan trọng', information:'thông tin', question:'câu hỏi', response:'phản hồi',
  time:'thời gian', day:'ngày', week:'tuần', year:'năm', today:'hôm nay', tomorrow:'ngày mai', now:'bây giờ',
  first:'đầu tiên', second:'thứ hai', next:'tiếp theo', final:'cuối cùng', different:'khác', same:'giống nhau',
  better:'tốt hơn', good:'tốt', bad:'xấu / không tốt', easy:'dễ', difficult:'khó', clear:'rõ ràng', simple:'đơn giản',
  new:'mới', old:'cũ', current:'hiện tại', available:'có sẵn', possible:'có thể', practical:'thực tế', specific:'cụ thể',
  support:'hỗ trợ', system:'hệ thống', process:'quy trình', plan:'kế hoạch', option:'lựa chọn', decision:'quyết định',
  customer:'khách hàng', patient:'bệnh nhân', student:'sinh viên', teacher:'giáo viên', manager:'quản lý',
  developer:'lập trình viên', team:'nhóm', project:'dự án', service:'dịch vụ', appointment:'cuộc hẹn',
  health:'sức khỏe', pain:'đau', treatment:'điều trị', insurance:'bảo hiểm', claim:'hồ sơ yêu cầu bảo hiểm',
  software:'phần mềm', database:'cơ sở dữ liệu', model:'mô hình', data:'dữ liệu', technology:'công nghệ',
  learning:'học tập', speaking:'nói', listening:'nghe', reading:'đọc', writing:'viết'
}

let DOMAIN_MAP = null
export function setDomainGlossary(items=[]){
  DOMAIN_MAP={}
  items.forEach(x=>{
    DOMAIN_MAP[x.word.toLowerCase()]=x.meaning
    x.word.toLowerCase().split(/\s+/).forEach(w=>{ if(!DOMAIN_MAP[w] && w.length>3) DOMAIN_MAP[w]=x.meaning })
  })
}
export function lookupWord(word){
  const key=(word||'').toLowerCase().replace(/[^a-z'-]/g,'')
  if(!key) return ''
  return DOMAIN_MAP?.[key] || COMMON_VI[key] || ''
}

const cache=new Map()
export async function translateToVietnamese(text){
  const value=(text||'').trim()
  if(!value) return ''
  if(cache.has(value)) return cache.get(value)
  try{
    if(globalThis.Translator?.create){
      const translator=await globalThis.Translator.create({sourceLanguage:'en',targetLanguage:'vi'})
      const out=await translator.translate(value)
      cache.set(value,out); return out
    }
  }catch{}
  try{
    const url='https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q='+encodeURIComponent(value)
    const r=await fetch(url)
    if(r.ok){
      const data=await r.json()
      const out=(data?.[0]||[]).map(x=>x?.[0]||'').join('')
      if(out){cache.set(value,out);return out}
    }
  }catch{}
  const words=value.split(/\s+/)
  const known=words.map(w=>lookupWord(w))
  const coverage=known.filter(Boolean).length/Math.max(1,words.length)
  if(coverage>.55){
    const out=words.map((w,i)=>known[i]||w).join(' ')
    cache.set(value,out);return out
  }
  throw new Error('Translation service is unavailable.')
}
