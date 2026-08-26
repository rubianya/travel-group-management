export interface TripStatDTO {
    totalTrips: number;
    openTrips: number;
}

export interface ApplicantStatDTO {
    totalApplicants: number;
    confirmedApplicants: number;
    cancelledApplicants: number;
}

export interface UpcomingTripDTO {
    tripId: number;
    tripName: string;
    startDate: string;
    endDate: string;
    status: string;
}
