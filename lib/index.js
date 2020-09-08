exports.formattedTime = (msgDate) => {
  let date = new Date(msgDate * 1000)
  let hours = date.getHours()
  let minutes = '0' + date.getMinutes()
  let seconds = '0' + date.getSeconds()
  let formattedTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`
  return formattedTime
}

exports.bot = () => {
  return require('./telebot')
}