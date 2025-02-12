export interface GameSpace {
  color: string;
  special?: 'shortcut' | 'trap';
}

export interface Player {
  id: number;
  name: string;
  color: string;
  position: number;
}