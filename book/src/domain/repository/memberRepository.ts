import { Member } from '../entities/member';

export interface MemberRepository {
    findByCode(code: string): Promise<Member | null>;
    findAll(): Promise<Member[]>;
    create(member: Member): Promise<Member>;
    update(code: string, member: Partial<Member>): Promise<Member | null>;
    delete(code: string): Promise<boolean>;
    clearPenalty(memberCode: String): Promise<boolean>;
}
