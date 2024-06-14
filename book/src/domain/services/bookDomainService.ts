import { Member } from '../entities/member';
import { Book } from '../entities/book';

export class BookDomainService {
    static borrowBook(member: Member, book: Book): boolean {
        if (member.canBorrow() && book.stock > 0) {
            member.borrowedBooks.push(book);
            book.stock -= 1;
            return true;
        }
        return false;
    }

    static returnBook(member: Member, book: Book, returnDate: Date): boolean {
        const borrowedBookIndex = member.borrowedBooks.findIndex(b => b.code === book.code);
        if (borrowedBookIndex > -1) {
            member.borrowedBooks.splice(borrowedBookIndex, 1);
            book.stock += 1;

            const borrowDuration = BookDomainService.calculateBorrowDuration(returnDate);
            if (borrowDuration > 7) {
                member.penaltyUntil = new Date(returnDate.getTime() + 3 * 24 * 60 * 60 * 1000);
            }
            return true;
        }
        return false;
    }

    private static calculateBorrowDuration(returnDate: Date): number {
        const now = new Date();
        const borrowedDuration = (returnDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
        return borrowedDuration;
    }
}
