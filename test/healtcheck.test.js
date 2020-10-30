/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
var should = require('should')
const fetch = require('node-fetch')
var chai = require('chai')
var expect = chai.expect
let API = require('./api')

describe('Telecontact.me API test',()=>{
  it('Should return server date', async () =>{
    const response = await  fetch(API.healtcheck)
    const body = await response.json()
    console.log(response.status)
    expect(response.status).to.equal(200)
    body.should.have.property('date') 
  })
})