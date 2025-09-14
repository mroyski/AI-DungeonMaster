import { Player } from "./Player.interface";

export interface Room {
  id: string;
  name: string;
  maxPlayers: number;
  owner?: string;
  ownerId?: string;
  players: Player[];
  inProgress?: boolean;
}
