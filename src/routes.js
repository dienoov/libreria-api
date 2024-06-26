const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [{
  path: '/books',
  method: 'POST',
  handler: addBookHandler,
}, {
  path: '/books',
  method: 'GET',
  handler: getAllBooksHandler,
}, {
  path: '/books/{id}',
  method: 'GET',
  handler: getBookByIdHandler,
}, {
  path: '/books/{id}',
  method: 'PUT',
  handler: editBookByIdHandler,
}, {
  path: '/books/{id}',
  method: 'DELETE',
  handler: deleteBookByIdHandler,
}];

module.exports = routes;
