/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
var should = require('should')
var request = require('request')
var chai = require('chai')
var expect = chai.expect
let API = require('./api')

describe('Telecontact.me API test',()=>{
  it('Should return 100 cards max',(done) =>{
    request.get(API.healtcheck , (error, response, _body) =>{
      var body = API.toJson(_body)
      expect(response.statusCode).to.equal(200)
      body.should.have.property('date') 
      done()
    })
  })
})