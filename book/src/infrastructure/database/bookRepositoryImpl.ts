import { BookRepository } from '../../domain/repository/bookRepository';
import prisma from './prismaClient';
import { Book } from '../../domain/entities/book';
import { Member } from '../../domain/entities/member';

export class BookRepositoryImpl implements BookRepository {
    async findByCode(code: string): Promise<Book | null> {
        const book = await prisma.book.findUnique({ where: { code } });
        if (!book) return null;
        return new Book(book.code, book.title, book.author, book.stock);
    }

    async findAll(): Promise<Book[]> {
        const books = await prisma.book.findMany();
        return books.map(book => new Book(book.code, book.title, book.author, book.stock));
    }

    async create(book: Book): Promise<Book> {
        const createdBook = await prisma.book.create({ data: book });
        return new Book(createdBook.code, createdBook.title, createdBook.author, createdBook.stock);
    }

    // async findByIdBook(code: string): Promise<Book | null> {
    //     const findBook = await prisma.book.findFirst({
    //         where: { code },
    //     });
    //     if (!findBook) return null;
    //     return new Book(findBook.code, findBook.title, findBook.author, findBook.stock);
    // }
    async update(code: string, book: Partial<Book>): Promise<Book | null> {
        const updatedBook = await prisma.book.update({
            where: { code },
            data: book
        });
        if (!updatedBook) return null;
        return new Book(updatedBook.code, updatedBook.title, updatedBook.author, updatedBook.stock);
    }

    async delete(code: string): Promise<boolean> {
        try {
            await prisma.book.delete({ where: { code } });
            return true;
        } catch {
            return false;
        }
    }

    async createBorrowedBook(memberCode: string, bookCode: string): Promise<void> {
        const member = await prisma.member.findUnique({ where: { code: memberCode } });
        const book = await prisma.book.findUnique({ where: { code: bookCode } });

        if (!member || !book) {
            console.error(`Member or Book not found with codes: ${memberCode}, ${bookCode}`);
            return
        }

        await prisma.borrowedBook.create({
            data: {
                memberId: member.id,
                bookId: book.id,
                borrowDate: new Date(),
            },
        });
    }

    async deleteBorrowedBook(memberCode: string, bookCode: string): Promise<void> {
        const member = await prisma.member.findUnique({ where: { code: memberCode } });
        const book = await prisma.book.findUnique({ where: { code: bookCode } });

        if (!member || !book) {
            throw new Error(`Member or Book not found with codes: ${memberCode}, ${bookCode}`);
        }

        await prisma.borrowedBook.deleteMany({
            where: {
                memberId: member.id,
                bookId: book.id,
            },
        });
    }



}