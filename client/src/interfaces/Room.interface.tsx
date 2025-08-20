export interface Room {
  id: string;
  name: string;
  owner?: string;
  ownerId?: string;
  inProgress?: boolean;
}
