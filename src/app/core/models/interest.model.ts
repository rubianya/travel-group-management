export interface Interest {
    id: number;
    interestName: string;
    active: string;
    createdById: number;
}

export interface InterestRequest {
    interestName: string;
    active: string;
}
