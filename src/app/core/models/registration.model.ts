export interface Registration {
  id?: number;
  tripId: number;
  travelerName: string;
  budget: number;
  interests: string[];
  status: 'REGISTERED' | 'WAITING_PAYMENT' | 'PAID' | 'CONFIRMED' | 'CANCELLED'; 
  remark?: string;
}