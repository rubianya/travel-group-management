export interface TripRegistrationResponseDTO {
  id?: number;
  tripId: number;
  tripName?: string;
  userId: number;
  userEmail: string;
  userName: string;
  phone?: string;
  status: string;
  remark?: string;
  interests?: any[];
}

export interface TripRegistrationRequestDTO {
  status: string;
  remark: string;
  interestIds: Array<number>;
}
