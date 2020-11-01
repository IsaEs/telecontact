/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
var should = require('should')
const fetch = require('node-fetch')
var chai = require('chai')
var expect = chai.expect
let API = require('./api')

describe('Domain Controller', ()=>{
  let HEADERS = ''
  let formId = ''
  before( async () => {
    const body = {
      'email': '13123@gmail.com',
      'password': 'test'
    }
    const response = await fetch(API.signin, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    })
    const responseBody = await response.json()
    HEADERS =  {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${responseBody.token}`
    }
  })


  it('Should Add Domain', async ()=>{
    const body = {
      'name': 'My blog',
      'domain':'telegram.com'
    }
    const response = await fetch(API.domain, {
      method: 'post',
      body: JSON.stringify(body),
      headers: HEADERS
    })
    const resBody = await response.json()
    formId = resBody.formId
    expect(response.status).to.equal(201)
    resBody.should.have.property('formId') 
    resBody.should.have.property('prefs') 
    resBody.prefs.should.have.property('sendMail')
  })

  it('Should not add domain if domain name not defined', async ()=>{
    const body = {
      'domain':'telegram.com'
    }
    const response = await fetch(API.domain, {
      method: 'post',
      body: JSON.stringify(body),
      headers: HEADERS
    })
    const resBody = await response.json()
    expect(response.status).to.equal(400)
    resBody.should.have.property('msg') 
  })

  it('Should update the name if its valid', async ()=>{
    let name = 'Name Updated'
    const body = { formId,name }
    const response = await fetch(API.domain, {
      method: 'put',
      body: JSON.stringify(body),
      headers: HEADERS
    })
    expect(response.status).to.equal(201)
  })


})