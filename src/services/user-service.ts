import ky from "ky";
import { BACK_URL } from "../utils/constants.ts";

const register = async (email: string, name: string, password: string) => {
  return await ky
    .post(`${BACK_URL}/register`, {
      json: {
        email,
        name,
        password,
      },
    })
    .json();
};

const login = async (name: string, password: string) => {
  return await ky
    .post(`${BACK_URL}/login`, {
      json: {
        name,
        password,
      },
    })
    .json();
};

export const UserService = {
  register,
  login,
};
