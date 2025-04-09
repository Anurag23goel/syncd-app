export interface User {
  UserID: string;
  UserFullName: string;
  UserEmail: string;
  UserProfilePicture: string | null;
  UserContact: string;
  IsVerified: boolean;
  RoleIDs: string[];
  ExpoToken: string;
}
