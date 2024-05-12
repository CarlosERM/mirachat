export interface MyUser {
  userID: string;
  username: string;
  self: boolean;
  messages?: MyMessage[];
  connected: boolean;
  newMessage: boolean;
}

export interface MyMessage {
  content: string;
  from?: string;
  to: string;
  fromSelf: boolean;
}
