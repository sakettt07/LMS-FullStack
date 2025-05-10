import {ApiError} from  "../Utils/Api.Error.js";
import {ApiResponse} from "..//Utils/ApiResponse.js";
import {asyncHandler} from "../Utils/asyncHandler.js";
import { Book } from '../Models/book.models.js';
import {v2 as cloudinary} from 'cloudinary';

const addBook = asyncHandler(async (req, res, next) => {

    if(!req.files || Object.keys(req.files).length === 0){
        throw new ApiError(400,"Please upload a book cover image");
    }
    const {bookCoverImage} = req.files;
    const allowedFormats= ['image/jpeg', 'image/png', 'image/jpg'];
    if(!allowedFormats.includes(bookCoverImage.mimetype)){
        throw new ApiError(400,"Please upload a valid image file");
    }
    const {title,author,description,price,quantity,category} = req.body;
    if(!title || !author || !description || !price || !quantity || !category){
        throw new ApiError(400,"Please fill all the fields");
    }

    if(price <= 0 || quantity <= 0){
        throw new ApiError(400,"Price and quantity should be greater than 0");
    }
    const cloudinaryResponse=await cloudinary.uploader.upload(bookCoverImage.tempFilePath, {
        folder: 'LibraryManagement/Books',
    });
    if(!cloudinaryResponse||cloudinaryResponse.error){
        throw new ApiError(500,"Error uploading image to cloudinary");
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
    if(!book){
        await cloudinary.uploader.destroy(cloudinaryResponse.public_id);
        throw new ApiError(500,"Error creating book");
    }
    return res.status(201).json(new ApiResponse(200,book,"Book created successfully"));
});

const getAllBooks = asyncHandler(async (req, res, next) => {
    const books = await Book.find();
    if(!books || books.length === 0){
        throw new ApiError(404,"No books found");
    }
    return res.status(200).json(new ApiResponse(200,books,"Books fetched successfully"));
});

const getBookById = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const book = await Book.findById(id);
    if(!book){
        throw new ApiError(404,"Book not found");
    }
    return res.status(200).json(new ApiResponse(200,book,"Book fetched successfully"));
});

const deleteBook = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const book = await Book.findById(id);
    if(!book){
        throw new ApiError(404,"Book not found");
    }
    await cloudinary.uploader.destroy(book.bookCoverImage.public_id);
    await book.deleteOne();
    return res.status(200).json(new ApiResponse(200,book,"Book deleted successfully"));
});

export {addBook, getAllBooks, getBookById, deleteBook};