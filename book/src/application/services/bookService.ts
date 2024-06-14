import { BookRepository } from '../../domain/repository/bookRepository';
import { MemberRepository } from '../../domain/repository/memberRepository';
import { BookDomainService } from '../../domain/services/bookDomainService';
import { Book } from '../../domain/entities/book';
import { Member } from '../../domain/entities/member';

export class BookService {
    constructor(
        private bookRepository: BookRepository,
        private memberRepository: MemberRepository
    ) { }

    async borrowBook(memberCode: string, bookCode: string): Promise<boolean> {
        const member = await this.memberRepository.findByCode(memberCode);
        const book = await this.bookRepository.findByCode(bookCode);

        if (!member || !book || book.stock < 1) {
            return false;
        }

        const success = BookDomainService.borrowBook(member, book);
        if (success) {
            await this.bookRepository.createBorrowedBook(member.code, book.code);
            await this.bookRepository.update(book.code, { stock: book.stock });
        }
        return success;
    }

    async returnBook(memberCode: string, bookCode: string, returnDate: Date): Promise<boolean> {
        if (!returnDate) {
            return false;
        }

        const member = await this.memberRepository.findByCode(memberCode);
        const book = await this.bookRepository.findByCode(bookCode);

        if (!member || !book) {
            return false;
        }

        const success = BookDomainService.returnBook(member, book, returnDate);
        if (success) {
            await this.bookRepository.deleteBorrowedBook(member.code, book.code);
            await this.bookRepository.update(book.code, { stock: book.stock });
            await this.memberRepository.update(memberCode, { penaltyUntil: member.penaltyUntil });
        }
        return success;
    }

    async getAllBooks(): Promise<Book[]> {
        return this.bookRepository.findAll();
    }

    async getAllMembers(): Promise<Member[]> {
        return this.memberRepository.findAll();
    }

    async createBook(book: Book): Promise<Book> {
        return this.bookRepository.create(book);
    }

    async createMember(member: Member): Promise<Member> {
        return this.memberRepository.create(member);
    }

    async updateBook(bookCode: string, book: Partial<Book>): Promise<Book | null> {
        return this.bookRepository.update(bookCode, book);
    }

    async deleteBook(bookCode: string): Promise<boolean> {
        return this.bookRepository.delete(bookCode);
    }

    async updateMember(memberCode: string, member: Partial<Member>): Promise<Member | null> {
        return this.memberRepository.update(memberCode, member);
    }

    async deleteMember(memberCode: string): Promise<boolean> {
        return this.memberRepository.delete(memberCode);
    }

    async findByIdMember(memberCode: string): Promise<Member | null> {
        return this.memberRepository.findByCode(memberCode);
    }
    async clearPenalty(memberCode: string): Promise<boolean> {
        return this.memberRepository.clearPenalty(memberCode);
    }
}
