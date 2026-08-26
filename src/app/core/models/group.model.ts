import { TripRegistrationResponseDTO } from './registration.model';

export interface TripGroupResponseDTO {
  id: number;
  tripId: number;
  tripName: string;
  groupName: string;
  leaderId: number;
  leaderName: string;
  status: string;
  note?: string;
  members: TripRegistrationResponseDTO[];
}

export interface TripGroupRequestDTO {
  tripId?: number;
  groupName: string;
  leaderId?: number;
  status: string;
  note?: string;
}