import { catchAsyncErrors } from '../Middlewares/catchAsyncErrors.js';
import ErrorHandler from '../Middlewares/error.Middleware.js';
import { Borrow } from '../Models/borrow.models.js';
import { Book } from '../Models/book.models.js';
import { User } from '../Models/user.models.js';

const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
});
const recordBorrowedBooks=catchAsyncErrors(async (req, res, next) => {
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
        return next(new ErrorHandler("Book not found", 404));
    }
    const user=await User.findOne({email});
    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }
    if(book.quantity===0){
        return next(new ErrorHandler("Book not available", 404));
    }
    const isAlreadyBorrowed= user.borrowedBooks.find((b) => b.bookId.toString() === id.toString() && b.returned === false);
    if(isAlreadyBorrowed){
        return next(new ErrorHandler("Book already borrowed", 404));
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
    res.status(200).json({
        success: true,
        message: "Book borrowed successfully",
    });

});
const getBorrowedBooksForAdmin=catchAsyncErrors(async (req, res, next) => {
    
});

const returnBorrowedBook=catchAsyncErrors(async (req, res, next) => {});



export {borrowedBooks,recordBorrowedBooks,getBorrowedBooksForAdmin,returnBorrowedBook};