const assert = require('assert')
const proxyquire = require('proxyquire')

const { index, create, contactList } = require('../mocks/contact-list/contact-list.mock')
const testServer = require('../testServer')

describe('Routes - contact-list', function () {
  const route = proxyquire('../../api/article', {
    './article.controller': { index, create }
  })

  const request = testServer('/api/contact-list', route)
  describe('GET /api/contact-list', function () {

    it('Debería responder listado de todos articulos', function (done) {
      request.get('/api/contact-list').end((err, res) => {
        assert.deepStrictEqual(res.body, contactList)
      })
      done()
    })

    it('Debería crear una nueva lista de contacto exitosamente', function (done) {
      request.post('/api/contact-list').end((err, res) => {
        assert.deepStrictEqual(res.body, {
          error: false,
          msg: 'La lista de contactos se creó exitosamente.',
          result: "result"
        })
      })
      done()
    })

  })
})