import { Book } from '../entities/book';

export interface BookRepository {
    findByCode(code: string): Promise<Book | null>;
    findAll(): Promise<Book[]>;
    create(book: Book): Promise<Book>;
    update(code: string, book: Partial<Book>): Promise<Book | null>;
    delete(code: string): Promise<boolean>;
    createBorrowedBook(memberCode: string, bookCode: string): Promise<void>;
    deleteBorrowedBook(memberCode: string, bookCode: string): Promise<void>;
}
