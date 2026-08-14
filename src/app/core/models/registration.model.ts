export interface Registration {
  id?: number;
  tripId: number;
  travelerName: string;
  budget: number;
  interests: string[];
  status: string;
  remark?: string;
}