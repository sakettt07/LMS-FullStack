import express from 'express';
import { authorizeRoles, isAuthenticated } from '../Middlewares/auth.middleware.js';
import { borrowedBooks, getBorrowedBooksForAdmin, recordBorrowedBooks, returnBorrowedBook } from '../Controllers/borrow.controller.js';

const router = express.Router();

router.use(isAuthenticated);
router.route('/borrowed-books').get(borrowedBooks);

router.route('/record-borrowed-books/:id').post(recordBorrowedBooks);

router.route('/get-borrowed-books-for-admin').get(authorizeRoles("Admin"),getBorrowedBooksForAdmin);

router.route('/return-borrowed-book/:bookId').put(returnBorrowedBook);


export default router;