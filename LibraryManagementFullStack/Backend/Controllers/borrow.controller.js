import { catchAsyncErrors } from '../Middlewares/catchAsyncErrors.js';
import ErrorHandler from '../Middlewares/error.Middleware.js';
import { Borrow } from '../Models/borrow.models.js';
import { Book } from '../Models/book.models.js';
import { User } from '../Models/user.models.js';
import { calculateFine } from '../Utils/fineCalculator.js';

const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
    const {borrowedBooks} = req.user;
    if(borrowedBooks.length===0){
        return next(new ErrorHandler("No borrowed books", 404));
    }
    res.status(200).json({
        success: true,
        borrowedBooks,
    });
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
    const user=await User.findOne({email,accountVerified: true,role: "User"});
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
    const borrowedBooks=await Borrow.find();
    if(borrowedBooks.length===0){
        return next(new ErrorHandler("No borrowed books", 404));
    }
    res.status(200).json({
        success: true,
        borrowedBooks,
    });
});

const returnBorrowedBook=catchAsyncErrors(async (req, res, next) => {
    // TODO: return borrowed book

    const {bookId} = req.params;
    const {email} = req.body;
    const book=await Book.findById(bookId);
    if(!book){
        return next(new ErrorHandler("Book not found", 404));
    }
    const user=await User.findOne({email,accountVerified: true});
    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }
    const borrowedBook = user.borrowedBooks.find((b) => b.bookId.toString() === bookId && b.returned === false);
    if(!borrowedBook){
        return next(new ErrorHandler("Book not borrowed", 404));
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
        return next(new ErrorHandler("Borrow record not found", 404));
    }
    borrow.returnDate = new Date();
    const fine=calculateFine(borrow.dueDate);
    borrow.fine = fine;
    await borrow.save();
    res.status(200).json({
        success: true,
        message: fine!==0?`Book returned successfully the total charges including the fine is ₹ ${fine+book.price}`:`Book returned successfully the total charges is ₹ ${book.price}`,
    });
});



export {borrowedBooks,recordBorrowedBooks,getBorrowedBooksForAdmin,returnBorrowedBook};