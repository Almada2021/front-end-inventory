export interface UsersResponse {
  users: User[];
}
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string[];
}
