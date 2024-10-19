export interface UserProfile {
  email: string;
  role: {
    name: string;
    id: number;
    description: string;
  }
  sub: string;
}


export interface UserProfileToken {
  verifyEmail: boolean;
  id: number;
  username: string;
  email: string;
  reset: boolean;
  passwordTemp: boolean;
  role: Role;
  iat: number; // Tiempo de emisión del token (Issued At)
  exp: number;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}