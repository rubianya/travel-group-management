import { User } from './user.model';
import { Registration } from './registration.model';

export interface Group {
  id: number;
  tripId: number;
  groupName: string;
  leader?: User;
  members: Registration[];
  status: 'DRAFT' | 'CONFIRMED' | string;
  note?: string;
}

export interface TripGroupRequestDTO {
  groupName: string;
  leaderId?: number;
  note?: string;
}