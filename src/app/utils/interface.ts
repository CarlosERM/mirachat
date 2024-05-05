export interface MyUser {
  userID: string;
  username: string;
  self: boolean;
  messages?: MyMessage[];
}

export interface MyMessage {
  content: string;
  fromSelf: boolean;
}
