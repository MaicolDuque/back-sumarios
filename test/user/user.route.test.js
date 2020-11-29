const assert = require('assert')
const proxyquire = require('proxyquire')

const { UserControllerMock } = require('../mocks/user/user.mock')
const mockListUsers = require('../mocks/user/list-users')
const testServer = require('../testServer')

describe('Routes - users', function(){
  const route = proxyquire('../../api/user', {
    './user.controller': UserControllerMock
  })

  const request = testServer('/api/users', route)
  describe('GET /api/users/test', function(){

    it('should response with status 200', function(done){
      request.get('/api/users/test').expect(200, done)
    })

    it('should response with list users', function(done){
      request.get('/api/users').end(( err, res ) => {
        assert.deepStrictEqual( res.body, mockListUsers )
      })
      done()
    })
  })
})