/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  //return valid_map.indexOf(str.trim()) >= 0
  return true;
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

export function isInteger(arg) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  return reg.test(arg)
}

export function luhnCheck(bankno){
  const lastNum=bankno.substr(bankno.length-1,1);//????????????????????????luhn???????????????

  const first15Num=bankno.substr(0,bankno.length-1);//???15???18???
  const newArr=new Array();
  for(let i=first15Num.length-1;i>-1;i--){    //???15???18?????????????????????
    newArr.push(first15Num.substr(i,1));
  }
  const arrJiShu=new Array();  //?????????*2?????? <9
  const arrJiShu2=new Array(); //?????????*2?????? >9

  const arrOuShu=new Array();  //???????????????
  for(let j=0;j<newArr.length;j++){
    if((j+1)%2==1){//?????????
      if(parseInt(newArr[j])*2<9)
        arrJiShu.push(parseInt(newArr[j])*2);
      else
        arrJiShu2.push(parseInt(newArr[j])*2);
    }
    else //?????????
      arrOuShu.push(newArr[j]);
  }

  const jishu_child1=new Array();//?????????*2 >9 ?????????????????????????????????
  const jishu_child2=new Array();//?????????*2 >9 ?????????????????????????????????
  for(let h=0;h<arrJiShu2.length;h++){
    jishu_child1.push(parseInt(arrJiShu2[h])%10);
    jishu_child2.push(parseInt(arrJiShu2[h])/10);
  }

  let sumJiShu=0; //?????????*2 < 9 ???????????????
  let sumOuShu=0; //?????????????????????
  let sumJiShuChild1=0; //?????????*2 >9 ???????????????????????????????????????
  let sumJiShuChild2=0; //?????????*2 >9 ???????????????????????????????????????
  let sumTotal=0;
  for(let m=0;m<arrJiShu.length;m++){
    sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
  }

  for(let n=0;n<arrOuShu.length;n++){
    sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
  }

  for(let p=0;p<jishu_child1.length;p++){
    sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
    sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
  }
  //????????????
  sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);

  //??????luhn???
  const k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;
  const luhn= 10-k;

  return lastNum==luhn
}

