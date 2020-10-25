const domainRegex = /(?<protocol>https?:\/\/)?(?<site>(?<subdomain>(([\w-]+)\.)*)(?<domain>[\w-]+)((?<tld>\.[A-Za-z]{1,3})){1,2})(?<path>\/[\w.-]+)*/i
 
exports.formattedTime = (msgDate) => {
  let date = new Date(msgDate * 1000)
  let hours = date.getHours()
  let minutes = '0' + date.getMinutes()
  let seconds = '0' + date.getSeconds()
  let formattedTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`
  return formattedTime
}

exports.validateUrl = (referrer,origin,url) => {
  let referrerGroups = referrer.match(domainRegex).groups
  let originGroups = origin.match(domainRegex).groups
  let urlGroups = url.match(domainRegex).groups
  console.log(referrerGroups,originGroups,urlGroups)
  if (urlGroups.domain === originGroups.domain || urlGroups.domain === referrerGroups.domain){
    return true
  }else {
    return false
  }
}


exports.mailer = require('./email')