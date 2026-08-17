export interface Trip {
    id?: number;
    tripName: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    maxParticipants: number;
    groupSize: number;
    budget: number;
    tripType: string;
    imageUrl: string;
    status: string;
    createdById: number;
}