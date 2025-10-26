export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  users: UsersState;
  auth: AuthState;
}