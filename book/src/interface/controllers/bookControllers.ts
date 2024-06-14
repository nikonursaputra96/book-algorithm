import { Request, Response } from 'express';
import { BookService } from '../../application/services/bookService';
import { BookRepositoryImpl } from '../../infrastructure/database/bookRepositoryImpl';
import { MemberRepositoryImpl } from '../../infrastructure/database/memberRepositoryImpl';
import { Book } from '../../domain/entities/book';

const bookService = new BookService(new BookRepositoryImpl(), new MemberRepositoryImpl());

export const borrowBook = async (req: Request, res: Response) => {
    const { memberCode, bookCode } = req.body;
    const success = await bookService.borrowBook(memberCode, bookCode);
    if (success) {
        res.status(200).json({ message: 'Borrowed successfully' });
    } else {
        res.status(400).json({ message: 'Failed to borrow book' });
    }
};

export const returnBook = async (req: Request, res: Response) => {
    const { memberCode, bookCode, returnDate } = req.body;
    if (!returnDate) {
        res.status(400).json({ message: 'Return date is required' });
        return;
    }
    const success = await bookService.returnBook(memberCode, bookCode, new Date(returnDate));
    if (success) {
        res.status(200).json({ message: 'Returned successfully' });
    } else {
        res.status(400).json({ message: 'Failed to return book' });
    }
};

export const getBooks = async (req: Request, res: Response) => {
    const books = await bookService.getAllBooks();
    res.status(200).json(books);
};

export const createBook = async (req: Request, res: Response) => {
    const { code, title, author, stock } = req.body;
    const newBook = await bookService.createBook(new Book(code, title, author, stock));
    res.status(201).json(newBook);
};

// export const findById = async (req: Request, res: Response) => {
//     const { code } = req.params;
//     const books = await bookService.findByIdBook(code);
//     res.status(200).json(books);
// };
export const updateBook = async (req: Request, res: Response) => {
    const { code } = req.params;
    const { title, author, stock } = req.body;
    const updatedBook = await bookService.updateBook(code, { title, author, stock });
    if (updatedBook) {
        res.status(200).json(updatedBook);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    const { code } = req.params;
    const success = await bookService.deleteBook(code);
    if (success) {
        res.status(200).json({ message: 'Book deleted successfully' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
};

export const createBorrowedBook = async (req: Request, res: Response) => {
    const success = await bookService.borrowBook(req.params.memberCode, req.params.bookCode);
    if (success) {
        res.sendStatus(200);
    } else {
        res.status(400).send('Unable to borrow book');
    }
}

export const deleteBorrowedBook = async (req: Request, res: Response) => {
    const success = await bookService.returnBook(req.params.memberCode, req.params.bookCode, new Date(req.body.returnDate));
    if (success) {
        res.sendStatus(200);
    } else {
        res.status(400).send('Unable to return book');
    }

};
