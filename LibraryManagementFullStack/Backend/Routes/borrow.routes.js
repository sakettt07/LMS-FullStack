import express from 'express';
import { authorizeRoles, isAuthenticated } from '../Middlewares/auth.middleware.js';
import { borrowedBooks, getBorrowedBooksForAdmin, recordBorrowedBooks, returnBorrowedBook } from '../Controllers/borrow.controller.js';

const router = express.Router();

router.route('/borrowed-books').get(isAuthenticated, borrowedBooks);

router.route('/record-borrowed-books/:id').post(isAuthenticated,recordBorrowedBooks);

router.route('/get-borrowed-books-for-admin').get(isAuthenticated,authorizeRoles("Admin"),getBorrowedBooksForAdmin);

router.route('/return-borrowed-book/:bookId').put(isAuthenticated,returnBorrowedBook);


export default router;