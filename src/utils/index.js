/**
 * Created by zhangyao on 18/4/12.
 */

// 去掉对象中的空字段
export function checkBe(obj) {
  if (!(typeof obj === 'object')) {
    return
  }
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] == null || obj[key] === undefined || obj[key] === '')) {
      delete obj[key]
    }
  }
  return obj
}

// 时间段
export function time_range(beginTime, endTime) {
  var strb = beginTime.split(":");
  if (strb.length != 2) {
    return false;
  }
  var stre = endTime.split(":");
  if (stre.length != 2) {
    return false;
  }
  var b = new Date();
  var e = new Date();
  var n = new Date();
  b.setHours(strb[0]);
  b.setMinutes(strb[1]);
  e.setHours(stre[0]);
  e.setMinutes(stre[1]);
  if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
    return true;
  } else {
    this.$message({
      type: 'warning',
      message: `当前时间是${n.getHours()}:${n.getMinutes()}，不在推送消息时间范围内，请在早上6点至晚上8点内进行推送！`
    });
    return false;
  }
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function objectMerge(target, source) {
  /* 合并两个对象,给出最后一个优先级。 */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = source[keys].constructor === Array ? [] : {}
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function assign (to = {}, from = {}, { extra = [], onlyExtra = false } = {}) {
  if (!onlyExtra) {
    for (const key of Object.keys(to)) {
      to[key] = from[key]
    }
  }

  extra.forEach(item => {
    (item.toKey && item.fromKey) ? to[item.toKey] = from[item.fromKey] : to[item] = from[item]
  })

  return to
}
/**
 * 函数节流
 * @param fn  函数
 * @param delay 多久执行一次
 * @param mustRunDelay 执行时间间隔
 * @return {Function}
 */
export function throttle(fn, delay, mustRunDelay) {
  let timer = null
  let t_start
  return function () {
    let context = this, args = arguments, t_curr = +new Date()
    clearTimeout(timer)
    if (!t_start) {
      t_start = t_curr
    }
    if (t_curr - t_start >= mustRunDelay) {
      fn.apply(context, args)
      t_start = t_curr
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }
}

// 获取当前时间，格式YYYY-MM-DD
export function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
// 时间戳 格式 年-月-日
function add0(m){return m<10?'0'+m:m }
export function format(shijianchuo, symbol = '') {
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  symbol = symbol === ''? '-' : symbol
  return y+symbol+add0(m)+symbol+add0(d);
}
// alert(format(1541865600000, '-'))
// 时间戳 年月日时分秒
function add0(m){return m<10?'0'+m:m }
export function formatTime(shijianchuo){
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return ''+add0(h)+':'+add0(mm)+':'+add0(s);
}

// function getDays(day1, day2) {
//   var d1 = day1.getDate();
//   var d2 = day2.getDate();
//
//   var dayTimeMillins = 1000*60*60*24;
//   var d1Ms = d1.getTime();
//   var d2Ms = d2.getTime();
//   var ret;
//   for (d1Ms; d1Ms <= d2Ms; d1Ms += dayTimeMillins) {
//     if (!ret) {
//       var day = new Date(d1Ms);
//       ret = day.getYMD();
//     } else {
//       var day = new Date(d1Ms);
//       ret = ret + ',' + day.getYMD();
//     }
//   }
//   alert(ret); // 或可换为return ret;
// }
// Date.prototype.getYMD = function(){
//   var retDate = this.getFullYear() + "-";  // 获取年份。
//   retDate += this.getMonth() + 1 + "-";    // 获取月份。
//   retDate += this.getDate();               // 获取日。
//   return retDate;                          // 返回日期。
// }
//
// String.prototype.getDate = function(){
//   var strArr = this.split('-');
//   var date = new Date(strArr[0], strArr[1] - 1, strArr[2]);
//   return date;
// }

// getDays('2015-02-1', '2015-02-5');

