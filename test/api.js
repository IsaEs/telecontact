let apiUrl ='http://localhost:5050/api/v1/'

let url = (str)=> {return {url : apiUrl + str}}

let api = {
  healtcheck : url('healtcheck'), //GET
  form: url('form'), // POST
  user: url('user/forms'), //GET, DEL
  addForm: url('user/form/add'), // PUT
  updateEmail: url('user/email'), // PUT
  preferences: url('user/preferences'), // GET, PUT
  profile: url('user/profile'),
  messages: url('user/messages'), // GET,DELETE
  signup : url('signup'),
  signin : url('signin')
}

api.toJson = (body) => { 
  try{
    return JSON.parse(body)
  }
  catch(e){
    return {}
  }
} 

module.exports = api