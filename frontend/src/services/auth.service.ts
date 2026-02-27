import { api } from "./api";

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

export async function loginRequest(data: LoginDTO) {
    const response = await api.post("/auth/login", data);
    return response.data;
}

export async function registerRequest(data: RegisterDTO) {
    const response = await api.post("/auth/register", data);
    return response.data;
}

export async function getMe() {
  const response = await api.get("/auth/me");
  return response.data;
}