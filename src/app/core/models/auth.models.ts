export interface RegisterRequest {
  email: string;
  password: string;
  companyName: string;
  trn: string;
  sector: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  businessId: number;
  expiresAtUtc: string;
}
