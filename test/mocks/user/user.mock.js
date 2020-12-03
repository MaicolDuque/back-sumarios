const mockListUser = require('./list-users')

const userPending = mockListUser.find( user => !user.mg_status)

async function test() {
  return Promise.resolve('Hello')
}

async function index(req, res){
  return Promise.resolve(res.send(mockListUser))
}

async function getUserPending(req, res){
  return Promise.resolve(res.send(userPending))
}

module.exports = {
  test,
  index,
  getUserPending,
  userPending
}