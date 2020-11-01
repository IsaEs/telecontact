/* eslint-disable no-undef */
const chai = require('chai')
const expect = chai.expect
let {validateUrl} = require('../src/lib')
describe('test', () => {
  it('"554"must be equal 554 ', ()=> {
    expect('554'==554).to.be.true
  })

  it('Validate must retrun true ', ()=> {
    expect(validateUrl('isaes.com','isaes.com','isaes.com')).to.be.true
  })

})