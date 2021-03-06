const domainRegex = /(?<protocol>https?:\/\/)?(?<site>(?<subdomain>(([\w-]+)\.)*)(?<domain>[\w-]+)((?<tld>\.[A-Za-z]{1,3})){1,2})(?<path>\/[\w.-]+)*/i
const { createHash, createHmac } = require('crypto')

exports.formattedTime = (msgDate) => {
  let date = new Date(msgDate * 1000)
  let hours = date.getHours()
  let minutes = '0' + date.getMinutes()
  let seconds = '0' + date.getSeconds()
  let formattedTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`
  return formattedTime
}

exports.validateUrl = (referrer,origin,url) => {
  function getGroups(str){
    return typeof str === 'string' ? (str.match(domainRegex) != null ?  str.match(domainRegex).groups : '') : ''
  }
  let referrerGroups = getGroups(referrer)
  let originGroups = getGroups(origin)
  let urlGroups = getGroups(url)
  if (urlGroups.domain === originGroups.domain || urlGroups.domain === referrerGroups.domain){
    return true
  }else {
    return false
  }  
}

exports.checkSignature =   ({ hash, ...data }, token) => {
  const secret = createHash('sha256')
    .update(token)
    .digest()
  const checkString = Object.keys(data)
    .sort()
    .map(k => (`${k}=${data[k]}`))
    .join('\n')
  const hmac = createHmac('sha256', secret)
    .update(checkString)
    .digest('hex')
  return hmac === hash
}


exports.mailer = require('./email')