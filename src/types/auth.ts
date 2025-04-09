export interface LoginCredentials {
  UserEmail: string;
  UserPassword: string;
}

export interface User_Type {
  UserID: string;
  UserFullName: string;
  UserEmail: string;
  UserProfilePicture: string;
  UserPassword: string;
  UserContact: string;
  IsVerified: boolean;
  RoleIDs: string[];
  ExpoToken: string;
}

export interface AuthState {
  userData: User_Type | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}
