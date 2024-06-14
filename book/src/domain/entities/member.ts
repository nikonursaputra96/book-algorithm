import { Book } from "./book";

export class Member {
    constructor(
        public code: string,
        public name: string,
        public borrowedBooks: Book[] = [],
        public penaltyUntil: Date | null = null
    ) { }

    canBorrow(): boolean {
        const now = new Date();
        return this.borrowedBooks.length < 2 && (!this.penaltyUntil || this.penaltyUntil < now);
    }

    isPenalized(): boolean {
        const now = new Date();
        return this.penaltyUntil !== null && this.penaltyUntil > now;
    }
}
