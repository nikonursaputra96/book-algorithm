import { Request, Response } from 'express';
import { BookService } from '../../application/services/bookService';
import { BookRepositoryImpl } from '../../infrastructure/database/bookRepositoryImpl';
import { MemberRepositoryImpl } from '../../infrastructure/database/memberRepositoryImpl';
import { Member } from '../../domain/entities/member';


const bookService = new BookService(new BookRepositoryImpl(), new MemberRepositoryImpl());

export const getMembers = async (req: Request, res: Response) => {
    const members = await bookService.getAllMembers();
    res.status(200).json(members);
};

export const createMember = async (req: Request, res: Response) => {
    const { code, name } = req.body;
    const newMember = await bookService.createMember(new Member(code, name));
    res.status(201).json(newMember);
};

export const updateMember = async (req: Request, res: Response) => {
    const { code } = req.params;
    const { name } = req.body;
    const updatedMember = await bookService.updateMember(code, { name });
    if (updatedMember) {
        res.status(200).json(updatedMember);
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
};
export const findByCode = async (req: Request, res: Response) => {
    const { code } = req.params;
    const updatedMember = await bookService.findByIdMember(code);
    if (updatedMember) {
        res.status(200).json(updatedMember);
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
};

export const deleteMember = async (req: Request, res: Response) => {
    const { code } = req.params;
    const success = await bookService.deleteMember(code);
    if (success) {
        res.status(200).json({ message: 'Member deleted successfully' });
    } else {
        res.status(404).json({ message: 'Member not found' });
    }

};

export const clearPenalty = async (req: Request, res: Response) => {
    const { memberCode } = req.params;
    try {
        await bookService.clearPenalty(memberCode);
        res.status(200).json({ message: 'Penalty cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to clear penalty' });
    }
};