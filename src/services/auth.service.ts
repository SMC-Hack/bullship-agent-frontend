import config from "@/config";
import { AuthMessageResponse, SignInResponse } from "@/interfaces/auth.interface";
import axios from "axios";

const signIn = async (signature: string, walletAddress: string, nonce: number) => {
  const url = `${config.API_URL}/auth/login`;
  const response = await axios.post<SignInResponse>(url, {
    signature,
    walletAddress,
    nonce: nonce.toString()
  });
  return response.data;
};

const getAuthMessage = async (walletAddress: string): Promise<AuthMessageResponse> => {
  const url = `${config.API_URL}/auth/${walletAddress}/generate`;
  const response = await axios.get<AuthMessageResponse>(url);
  return response.data;
};

const authService = {
  signIn,
  getAuthMessage,
};

export default authService;
