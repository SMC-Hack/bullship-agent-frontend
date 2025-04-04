export interface AuthMessageResponse {
  authMessage: {
    nonce: number;
    walletAddress: string;
    message: string;
  };
}

export interface SignInResponse {
  accessToken: string;
}
