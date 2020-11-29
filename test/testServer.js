'use strict'

const express = require('express')
const supertest = require('supertest')

function testServer(root, route) {
  const app = express()
  app.use(root, route)
  return supertest(app)
}

module.exports = testServer