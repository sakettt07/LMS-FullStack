import {ApiError} from "../Utils/Api.Error.js";
import {asyncHandler} from "../Utils/asyncHandler.js";
import {ApiResponse} from "../Utils/ApiResponse.js";
import { Borrow } from '../Models/borrow.models.js';
import { Book } from '../Models/book.models.js';
import { User } from '../Models/user.models.js';
import { calculateFine } from '../Utils/fineCalculator.js';

const borrowedBooks = asyncHandler(async (req, res, next) => {
    const {borrowedBooks} = req.user;
    if(borrowedBooks.length===0){
        throw new ApiError(404,"No borrowed books found");
    }
    return res.status(200).json(new ApiResponse(200,borrowedBooks,"Borrowed books fetched successfully"));
});
const recordBorrowedBooks=asyncHandler(async (req, res, next) => {
    //TODO: record borrowed books for admin
    // fetch the book which user has borrowed
    // fetch the user who borrowed the book
    // validation for the book and user
    // decrease the quantity and update the User borrowed books
    // create a new Borrow record

    const {id} = req.params;
    const {email}=req.body;

    const book=await Book.findById(id);
    if(!book){
        throw new ApiError(404,"Book not found");
    }
    const user=await User.findOne({email,accountVerified: true,role: "User"});
    if(!user){
        throw new ApiError(404,"User not found");
    }
    if(book.quantity===0){
        throw new ApiError(404,"Book not available");
    }
    const isAlreadyBorrowed= user.borrowedBooks.find((b) => b.bookId.toString() === id.toString() && b.returned === false);
    if(isAlreadyBorrowed){
        throw new ApiError(404,"Book already borrowed");
    }
    book.quantity-=1;
    book.availability=book.quantity>0;
    await book.save();

    await user.borrowedBooks.push({
        bookId: id,
        bookTitle: book.title,
        borrowedDate: Date.now(),
        dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    });
    await user.save();
    await Borrow.create({
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
        },
        book:{
            id: book._id,
        },
        dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
        price: book.price,
    });
    return res.status(200).json(new ApiResponse(200,book,"Book borrowed successfully"));

});
const getBorrowedBooksForAdmin=asyncHandler(async (req, res, next) => {
    const borrowedBooks=await Borrow.find();
    if(borrowedBooks.length===0){
        throw new ApiError(404,"No borrowed books found");
    }
    return res.status(200).json(new ApiResponse(200,borrowedBooks,"Borrowed books fetched successfully"));
});

const returnBorrowedBook=asyncHandler(async (req, res, next) => {
    // TODO: return borrowed book

    const {bookId} = req.params;
    const {email} = req.body;
    const book=await Book.findById(bookId);
    if(!book){
        throw new ApiError(404,"Book not found");
    }
    const user=await User.findOne({email,accountVerified: true});
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const borrowedBook = user.borrowedBooks.find((b) => b.bookId.toString() === bookId && b.returned === false);
    if(!borrowedBook){
        throw new ApiError(404,"Book not borrowed by user");
    }
    borrowedBook.returned = true;
    await user.save();
    book.quantity += 1;
    book.availability = book.quantity > 0;
    await book.save();

    const borrow=await Borrow.findOne({
        "book.id":bookId,
        "user.email": email,
        returnDate: null,
    });
    if(!borrow){
        throw new ApiError(404,"Borrow record not found");
    }
    borrow.returnDate = new Date();
    const fine=calculateFine(borrow.dueDate);
    borrow.fine = fine;
    await borrow.save();
    return res.status(200).json(new ApiResponse(200,{
        success: true,
        message: fine!==0?`Book returned successfully the total charges including the fine is ₹ ${fine+book.price}`:`Book returned successfully the total charges is ₹ ${book.price}`,
    }));
});



export {borrowedBooks,recordBorrowedBooks,getBorrowedBooksForAdmin,returnBorrowedBook};