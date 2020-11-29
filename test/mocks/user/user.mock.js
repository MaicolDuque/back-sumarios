class UserControllerMock {
  test() {
    return Promise.resolve('Hello')
  }
}

module.exports = {
  UserControllerMock
}