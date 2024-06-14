/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - code
 *         - title
 *         - author
 *         - stock
 *       properties:
 *         code:
 *           type: string
 *           description: The unique code of the book
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The author of the book
 *         stock:
 *           type: integer
 *           description: The available stock of the book
 *           minimum: 0
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API to manage books in the library
 */

import { Router } from 'express';
import { borrowBook, returnBook, getBooks, createBook, updateBook, deleteBook } from "../controllers/bookControllers"

const bookRoutes = Router();

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     tags: [Books]
 *     responses:
 *       '200':
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
bookRoutes.get('/', getBooks);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */
bookRoutes.post('/', createBook);

/**
 * @swagger
 * /books/{code}:
 *   put:
 *     summary: Update a book by code
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       '200':
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */
bookRoutes.put('/:code', updateBook);

/**
 * @swagger
 * /books/{code}:
 *   delete:
 *     summary: Delete a book by code
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the book to delete
 *     responses:
 *       '204':
 *         description: No content
 */
bookRoutes.delete('/:code', deleteBook);

/**
 * @swagger
 * /books/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberCode:
 *                 type: string
 *                 description: The code of the member borrowing the book
 *               bookCode:
 *                 type: string
 *                 description: The code of the book to be borrowed
 *     responses:
 *       '200':
 *         description: OK
 */
bookRoutes.post('/borrow', borrowBook);

/**
 * @swagger
 * /books/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberCode:
 *                 type: string
 *                 description: The code of the member returning the book
 *               bookCode:
 *                 type: string
 *                 description: The code of the book to be returned
 *               returnDate:
 *                 type: string
 *                 description: The code of date of returned book  / ex:2024-06-14
 *     responses:
 *       '200':
 *         description: OK
 */
bookRoutes.post('/return', returnBook);

export default bookRoutes;
