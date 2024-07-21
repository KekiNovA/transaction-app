export interface CardData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    _id: string;
    name: string;
  };
  receiver: {
    _id: string;
    name: string;
  };
  amount: number;
  details: string;
}

export interface userType {
  _id: string;
  name: string;
}
