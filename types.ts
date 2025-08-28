
export enum AppView {
  CHAT = 'CHAT',
  DIARY = 'DIARY',
  CALENDAR = 'CALENDAR',
  THERAPY = 'THERAPY',
  EMERGENCY = 'EMERGENCY',
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface DiaryEntry {
  id: string;
  content: string;
  date: Date;
}
