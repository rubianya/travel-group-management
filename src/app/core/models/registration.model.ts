export interface Registration {
  id?: number;
  tripId: number;
  tripName?: string;
  userId: number;
  userEmail: string;
  userName: string;
  budget: number;
  status: string;
  remark?: string;
}

export interface RegistrationRequest {
  tripId: number;
  userId: number;
  budget: number;
  status: string;
  remark: string;
  interestIds: Array<number>;
}
