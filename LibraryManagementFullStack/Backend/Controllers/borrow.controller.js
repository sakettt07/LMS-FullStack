import { catchAsyncErrors } from '../Middlewares/catchAsyncErrors.js';
import ErrorHandler from '../Middlewares/error.Middleware.js';
import { Borrow } from '../Models/borrow.models.js';
import { Book } from '../Models/book.models.js';

const borrowBook = catchAsyncErrors(async (req, res, next) => {
});
const recordBorrowedBooks=catchAsyncErrors(async (req, res, next) => {});

const getBorrowedBooksForAdmin=catchAsyncErrors(async (req, res, next) => {});

const returnBorrowedBook=catchAsyncErrors(async (req, res, next) => {});



export {borrowBook,recordBorrowedBooks,getBorrowedBooksForAdmin,returnBorrowedBook};