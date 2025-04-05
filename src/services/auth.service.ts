import {
  AuthMessageResponse,
  SignInResponse,
} from "@/interfaces/auth.interface";
import api from "@/lib/axios";

const signIn = async (
  signature: string,
  walletAddress: string,
  nonce: number
) => {
  const response = await api.post<SignInResponse>("/auth/login", {
    signature,
    walletAddress,
    nonce: nonce.toString(),
  });
  return response.data;
};

const getAuthMessage = async (
  walletAddress: string
): Promise<AuthMessageResponse> => {
  const response = await api.get<AuthMessageResponse>(
    `/auth/${walletAddress}/generate`
  );
  return response.data;
};

const authService = {
  signIn,
  getAuthMessage,
};

export default authService;
