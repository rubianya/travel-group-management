export interface Trip {
    id?: number;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    maxParticipants: number;
    groupSize: number;
    budget: number;
    category: string;
    status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'GROUPING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}