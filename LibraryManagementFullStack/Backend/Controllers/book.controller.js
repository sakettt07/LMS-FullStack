import { catchAsyncErrors } from '../Middlewares/catchAsyncErrors.js';
import ErrorHandler from '../Middlewares/error.Middleware.js';
import { Book } from '../Models/book.models.js';

const addBook = catchAsyncErrors(async (req, res, next) => {});

const getAllBooks = catchAsyncErrors(async (req, res, next) => {});

const getBookById = catchAsyncErrors(async (req, res, next) => {});

const deleteBook = catchAsyncErrors(async (req, res, next) => {});

export {addBook, getAllBooks, getBookById, deleteBook};