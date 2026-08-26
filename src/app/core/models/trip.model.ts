export interface TripResponseDTO {
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
    currentParticipants?: number;
    isFull?: boolean;
}

export interface TripRequestDTO {
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
}