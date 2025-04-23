import { catchAsyncErrors } from '../Middlewares/catchAsyncErrors.js';
import ErrorHandler from '../Middlewares/error.Middleware.js';
import { Book } from '../Models/book.models.js';
import {v2 as cloudinary} from 'cloudinary';

const addBook = catchAsyncErrors(async (req, res, next) => {

    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Book Cover Image Required",400));
    }
    const {bookCoverImage} = req.files;
    const allowedFormats= ['image/jpeg', 'image/png', 'image/jpg'];
    if(!allowedFormats.includes(bookCoverImage.mimetype)){
        return next(new ErrorHandler("Please upload a valid image",400));
    }
    const {title,author,description,price,quantity,category} = req.body;
    if(!title || !author || !description || !price || !quantity || !category){
        return next(new ErrorHandler("Please enter all fields",400));
    }

    if(price <= 0 || quantity <= 0){
        return next(new ErrorHandler("Price and Quantity should be greater than 0",400));
    }
    const cloudinaryResponse=await cloudinary.uploader.upload(bookCoverImage.tempFilePath, {
        folder: 'LibraryManagement/Books',
    });
    if(!cloudinaryResponse||cloudinaryResponse.error){
        return next(new ErrorHandler(`Image upload failed || ${cloudinaryResponse.error}`,500));
    }
    const book = await Book.create({
        title,
        author,
        description,
        price,
        quantity,
        category,
        bookCoverImage:{
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(201).json({
        success: true,
        message: "Book added successfully",
        book,
    });
});

const getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find();
    if(!books || books.length === 0){
        return next(new ErrorHandler("No books found",404));
    }
    res.status(200).json({
        success: true,
        message: "Books fetched successfully",
        books,
    });
});

const getBookById = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const book = await Book.findById(id);
    if(!book){
        return next(new ErrorHandler("Book not found",404));
    }
    res.status(200).json({
        success: true,
        message: "Book fetched successfully",
        book,
    });
});

const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const book = await Book.findById(id);
    if(!book){
        return next(new ErrorHandler("Book not found",404));
    }
    await cloudinary.uploader.destroy(book.bookCoverImage.public_id);
    await book.deleteOne();
    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
    });
});

export {addBook, getAllBooks, getBookById, deleteBook};