import { Player } from '../interfaces/Player.interface';

export interface Message {
  text: string;
  player: Player;
  room: string;
}
