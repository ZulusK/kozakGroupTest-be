const request = require('supertest-as-promised');
const app = require('../../../index');
const queryString = require('query-string');
const httpStatus = require('http-status');

module.exports = {
  getInfo: accessToken => request(app)
    .get('/api/auth/login')
    .set('Authorization', `bearer ${accessToken}`),
  updateToken: refreshToken => request(app)
    .get('/api/auth/token')
    .set('Authorization', `bearer ${refreshToken}`),
  login: ({ email, password }) => request(app)
    .post('/api/auth/login')
    .auth(email, password),
  create: data => request(app)
    .post('/api/users')
    .send(data),
  createOrLogin: data => request(app)
    .post('/api/users')
    .send(data)
    .then((res) => {
      if (res.status !== httpStatus.OK) {
        return request(app)
          .post('/api/auth/login')
          .auth(data.email, data.password);
      }
      return res;
    }),
  update: ({ userId, data, accessToken }) => request(app)
    .put(`/api/users/${userId}`)
    .set('Authorization', `bearer ${accessToken}`)
    .send(data),
  updatePassword: ({
    userId, data, email, password
  }) => request(app)
    .put(`/api/users/${userId}/password`)
    .auth(email, password)
    .send(data)
};
