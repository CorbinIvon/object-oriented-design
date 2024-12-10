export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  designs?: Design[];
}

export interface Design {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
