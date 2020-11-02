/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
var should = require('should')
const fetch = require('node-fetch')
var chai = require('chai')
var expect = chai.expect
let API = require('./api')
const request = require('supertest')
const app = require('../src/app')

describe('Message Controller', ()=>{
  TOKEN=''

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
    TOKEN = responseBody.token
    HEADERS =  {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${responseBody.token}`
    }
  })
  describe('GET /messages', () =>{
    it('Should Add Domain', async ()=>{
      const res = await request(app)
        .get('/api/v1/user/messages')
        .set('Authorization',`Bearer ${TOKEN}`)
      expect(res.status).to.equal(200)
    })
  
  })


})