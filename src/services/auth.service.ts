import config from "@/config";
import axios from "axios";

const signIn = async (signature: string) => {
  const url = `${config.API_URL}/auth/signin`;
  const response = await axios.post(url, {
    signature,
  });
  return response.data;
};
const authService = {
  signIn,
};

export default authService;
