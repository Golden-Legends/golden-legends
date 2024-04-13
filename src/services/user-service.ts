import ky from "ky";
import { BACK_URL } from "../utils/constants.ts";

const register = async (name: string, password: string) => {
  return await ky
    .post(`${BACK_URL}/register`, {
      json: {
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

const isUsernameValid = async (name: string) => {
  return await ky.get(`${BACK_URL}/users/${name}`).json();
};

export const UserService = {
  register,
  login,
  isUsernameValid,
};
