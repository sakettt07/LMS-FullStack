import express from 'express';
import { addBook, getAllBooks, getBookById, deleteBook } from '../Controllers/book.controller.js';
import { authorizeRoles, isAuthenticated } from '../Middlewares/auth.middleware.js';

const router = express.Router();

router.use(isAuthenticated);
router.route('/add').post(authorizeRoles("Admin"), addBook);
router.route('/').get( getAllBooks);
router.route('/:id').get( getBookById);
router.route('/delete/:id').delete(authorizeRoles("Admin"), deleteBook);

export default router;