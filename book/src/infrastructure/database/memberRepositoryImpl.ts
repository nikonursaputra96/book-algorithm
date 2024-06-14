import { MemberRepository } from '../../domain/repository/memberRepository';
import prisma from './prismaClient';
import { Member } from '../../domain/entities/member';
import { Book } from '../../domain/entities/book';

export class MemberRepositoryImpl implements MemberRepository {
    async findByCode(code: string): Promise<Member | null> {
        const member = await prisma.member.findUnique({
            where: { code },
            include: { borrowedBooks: { include: { Book: true } } }
        });
        if (!member) return null;
        const borrowedBooks = member.borrowedBooks.map(bb => new Book(bb.Book.code, bb.Book.title, bb.Book.author, bb.Book.stock));
        return new Member(member.code, member.name, borrowedBooks, member.penaltyUntil);
    }

    async findAll(): Promise<Member[]> {
        const members = await prisma.member.findMany({
            include: { borrowedBooks: { include: { Book: true } } }
        });
        return members.map(member => {
            const borrowedBooks = member.borrowedBooks.map(bb => new Book(bb.Book.code, bb.Book.title, bb.Book.author, bb.Book.stock));
            return new Member(member.code, member.name, borrowedBooks, member.penaltyUntil);
        });
    }

    async create(member: Member): Promise<Member> {
        const createdMember = await prisma.member.create({
            data: {
                code: member.code,
                name: member.name,
                penaltyUntil: member.penaltyUntil,
                borrowedBooks: {
                    create: member.borrowedBooks.map(book => ({
                        bookCode: book.code,
                        borrowDate: new Date(),
                        Book: {
                            connect: {
                                code: book.code
                            }
                        }
                    }))
                }
            }
        });
        return new Member(createdMember.code, createdMember.name, member.borrowedBooks, createdMember.penaltyUntil);
    }

    async update(code: string, member: Partial<Member>): Promise<Member | null> {
        const updatedMember = await prisma.member.update({
            where: { code },
            data: {
                name: member.name,
                penaltyUntil: member.penaltyUntil
            }
        });
        if (!updatedMember) return null;
        return new Member(updatedMember.code, updatedMember.name, [], updatedMember.penaltyUntil);
    }

    async delete(code: string): Promise<boolean> {
        try {
            await prisma.member.delete({ where: { code } });
            return true;
        } catch {
            return false;
        }
    }

    async clearPenalty(memberCode: string): Promise<boolean> {
        const members = await prisma.member.findUnique({ where: { code: memberCode } });

        if (!members || !members.penaltyUntil) {
            return false;
        }

        members.penaltyUntil = null;
        await prisma.member.update({
            where: { code: memberCode },
            data: { penaltyUntil: null }
        });

        return true;
    }
}
