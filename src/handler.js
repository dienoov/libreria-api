const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  bookshelf.push({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  });

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let books = bookshelf;

  if (name) {
    books = books.filter((b) => b.name.match(new RegExp(name, 'i')));
  }

  if (reading) {
    books = books.filter((b) => b.reading === !!+reading);
  }

  if (finished) {
    books = books.filter((b) => b.finished === !!+finished);
  }

  books = books.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books,
    },
  });
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = bookshelf.find((b) => b.id === id);

  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book,
    },
  });
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  const book = bookshelf.find((b) => b.id === id);

  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  book.name = name;
  book.year = year;
  book.author = author;
  book.summary = summary;
  book.publisher = publisher;
  book.pageCount = pageCount;
  book.readPage = readPage;
  book.finished = finished;
  book.reading = reading;
  book.updatedAt = updatedAt;

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = bookshelf.findIndex((b) => b.id === id);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  bookshelf.splice(index, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
