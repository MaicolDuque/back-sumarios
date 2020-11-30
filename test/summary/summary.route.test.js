const assert = require('assert')
const proxyquire = require('proxyquire')

const { index, showSummariesByUserId, summariesByKeywords,
      getSummariesKeywords, listSummaries, filterSummaries  } = require('../mocks/summary/summary.mock')
const testServer = require('../testServer')

describe('Routes - summaries', function(){
  const route = proxyquire('../../api/summary', {
    './summary.controller': { index, showSummariesByUserId, summariesByKeywords }
  })

  const request = testServer('/api/summaries', route)
  describe('GET /api/summaries', function(){

    it('Debería responder listado de todos sumarios', function(done){
      request.get('/api/summaries').end(( err, res ) => {
        assert.deepStrictEqual( res.body, listSummaries )
      })
      done()
    })

    it('Debería responder listado sumarios por editor', function(done){
      request.get('/api/summaries/user/5f898f8b1f94ca3cf457f748').end(( err, res ) => {
        assert.deepStrictEqual( res.body, filterSummaries("user_id", '5f898f8b1f94ca3cf457f748') )
      })
      done()
    })

    it('Debería responder listado sumarios por palabras claves', function(done){
      request.post('/api/summaries/keywords').end(( err, res ) => {
        assert.deepStrictEqual( res.body, getSummariesKeywords("5f898f8b1f94ca3cf457f748", ["MÓVILES"]) )
      })
      done()
    })
  })
})