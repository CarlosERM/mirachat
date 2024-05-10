export interface MyUser {
  userID: string;
  username: string;
  self: boolean;
  messages?: MyMessage[];
  connected: boolean;
}

export interface MyMessage {
  content: string;
  fromSelf: boolean;
}
