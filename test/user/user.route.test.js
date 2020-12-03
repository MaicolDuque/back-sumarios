const assert = require('assert')
const proxyquire = require('proxyquire')

const { index, test, userPending, getUserPending } = require('../mocks/user/user.mock')
const mockListUsers = require('../mocks/user/list-users')
const testServer = require('../testServer')

describe('Routes - users', function(){
  const route = proxyquire('../../api/user', {
    './user.controller': { index, test, getUserPending }
  })

  const request = testServer('/api/users', route)
  describe('GET /api/users', function(){

    it('Retornar estado 200 al consumir servicio', function(done){
      request.get('/api/users/test').expect(200, done)
    })

    it('Debería responder listado de usuarios', function(done){
      request.get('/api/users').end(( err, res ) => {
        assert.deepStrictEqual( res.body, mockListUsers )
      })
      done()
    })

    it('Debería responder listado de editores pendientes por activar', function(done){
      request.get('/api/users/pending').end(( err, res ) => {
        assert.deepStrictEqual( res.body, userPending )
      })
      done()
    })
  })
})