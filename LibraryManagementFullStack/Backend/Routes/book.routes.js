import express from 'express';
import { addBook, getAllBooks, getBookById, deleteBook } from '../Controllers/book.controller.js';
import { authorizeRoles, isAuthenticated } from '../Middlewares/auth.middleware.js';

const router = express.Router();

router.route('/add').post(isAuthenticated,authorizeRoles("Admin"), addBook);
router.route('/').get(isAuthenticated, getAllBooks);
router.route('/:id').get(isAuthenticated, getBookById);
router.route('/delete/:id').delete(isAuthenticated,authorizeRoles("Admin"), deleteBook);

export default router;