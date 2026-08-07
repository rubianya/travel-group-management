export interface GroupMember {
  registrationId: number;
  travelerName: string;
  interests: string[];
}

export interface Group {
  id: number;
  tripId: number;
  groupName: string;
  members: GroupMember[];
}