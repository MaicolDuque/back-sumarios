const assert = require('assert')
const proxyquire = require('proxyquire')

const { index, searchArticles, search, listArticles } = require('../mocks/articles/articles.mock')
const testServer = require('../testServer')

describe('Routes - articles', function(){
  const route = proxyquire('../../api/article', {
    './article.controller': { index, searchArticles }
  })

  const request = testServer('/api/articles', route)
  describe('GET /api/articles', function(){

    it('Debería responder listado de todos articulos', function(done){
      request.get('/api/articles').end(( err, res ) => {
        assert.deepStrictEqual( res.body, listArticles )
      })
      done()
    })

    it('Debería responder articulos por palabras claves', function(done){
      request.post('/api/articles/search').end(( err, res ) => {
        assert.deepStrictEqual( res.body, search('MÓVILES') )
      })
      done()
    })
  })
})