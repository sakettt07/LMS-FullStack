import { catchAsyncErrors } from '../Middlewares/catchAsyncErrors.js';
import ErrorHandler from '../Middlewares/error.Middleware.js';
import { Book } from '../Models/book.models.js';

const addBook = catchAsyncErrors(async (req, res, next) => {
    const {title,author,description,price,quantity,category} = req.body;
    if(!title || !author || !description || !price || !quantity || !category){
        return next(new ErrorHandler("Please enter all fields",400));
    }
});

const getAllBooks = catchAsyncErrors(async (req, res, next) => {});

const getBookById = catchAsyncErrors(async (req, res, next) => {});

const deleteBook = catchAsyncErrors(async (req, res, next) => {});

export {addBook, getAllBooks, getBookById, deleteBook};