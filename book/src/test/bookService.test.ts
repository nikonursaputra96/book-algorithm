import { BookService } from '../application/services/bookService';
import { BookRepository } from '../domain/repository/bookRepository';
import { MemberRepository } from '../domain/repository/memberRepository';
import { Book } from '../domain/entities/book';
import { Member } from '../domain/entities/member';

// Mock Repository
class MockBookRepository implements BookRepository {
  private books: Book[] = [
    new Book('1', 'Book One', 'Author One', 5),
    new Book('2', 'Book Two', 'Author Two', 1),
    new Book('3', 'Book Three', 'Author Three', 0)
  ];
  private borrowedBooks: { [memberCode: string]: string[] } = {};

  async findByCode(code: string): Promise<Book | null> {
    return this.books.find(book => book.code === code) || null;
  }

  async findAll(): Promise<Book[]> {
    return this.books;
  }

  async create(book: Book): Promise<Book> {
    this.books.push(book);
    return book;
  }

  async update(code: string, updateData: Partial<Book>): Promise<Book | null> {
    const book = await this.findByCode(code);
    if (book) {
      Object.assign(book, updateData);
      return book;
    }
    return null;
  }

  async delete(code: string): Promise<boolean> {
    const index = this.books.findIndex(book => book.code === code);
    if (index > -1) {
      this.books.splice(index, 1);
      return true;
    }
    return false;
  }

  async createBorrowedBook(memberCode: string, bookCode: string): Promise<void> {
    if (!this.borrowedBooks[memberCode]) {
      this.borrowedBooks[memberCode] = [];
    }
    this.borrowedBooks[memberCode].push(bookCode);
  }

  async deleteBorrowedBook(memberCode: string, bookCode: string): Promise<void> {
    if (this.borrowedBooks[memberCode]) {
      this.borrowedBooks[memberCode] = this.borrowedBooks[memberCode].filter(code => code !== bookCode);
    }
  }

  async isBookBorrowed(memberCode: string, bookCode: string): Promise<boolean> {
    return this.borrowedBooks[memberCode]?.includes(bookCode) || false;
  }
}

class MockMemberRepository implements MemberRepository {
  private members: Member[] = [
    new Member('member1', 'John Doe', []),
    new Member('member2', 'Jane Doe', [])
  ];
  async clearPenalty(code: string): Promise<boolean> {
    const member = await this.findByCode(code);
    if (member) {
      member.penaltyUntil = null;
      return true;
    }
    return false;
  }

  async findByCode(code: string): Promise<Member | null> {
    return this.members.find(member => member.code === code) || null;
  }

  async findAll(): Promise<Member[]> {
    return this.members;
  }

  async create(member: Member): Promise<Member> {
    this.members.push(member);
    return member;
  }

  async update(code: string, updateData: Partial<Member>): Promise<Member | null> {
    const member = await this.findByCode(code);
    if (member) {
      Object.assign(member, updateData);
      return member;
    }
    return null;
  }

  async delete(code: string): Promise<boolean> {
    const index = this.members.findIndex(member => member.code === code);
    if (index > -1) {
      this.members.splice(index, 1);
      return true;
    }
    return false;
  }
}

describe('BookService', () => {
  let bookService: BookService;
  let bookRepository: MockBookRepository;
  let memberRepository: MockMemberRepository;

  beforeEach(() => {
    bookRepository = new MockBookRepository();
    memberRepository = new MockMemberRepository();
    bookService = new BookService(bookRepository, memberRepository);
  });

  it('should borrow a book successfully', async () => {
    const success = await bookService.borrowBook('member1', '1');
    expect(success).toBe(true);
    const book = await bookRepository.findByCode('1');
    expect(book?.stock).toBe(4);
  });

  it('should not borrow a book when stock is zero', async () => {
    const success = await bookService.borrowBook('member1', '3');
    expect(success).toBe(false);
    const book = await bookRepository.findByCode('3');
    expect(book?.stock).toBe(0);
  });

  it('should return a book successfully', async () => {
    await bookService.borrowBook('member1', '1');
    const success = await bookService.returnBook('member1', '1', new Date());
    expect(success).toBe(true);
    const book = await bookRepository.findByCode('1');
    expect(book?.stock).toBe(5);
  });

  it('should not return a book that was not borrowed', async () => {
    const success = await bookService.returnBook('member1', '2', new Date());
    expect(success).toBe(false);
    const book = await bookRepository.findByCode('2');
    expect(book?.stock).toBe(1);
  });
});
