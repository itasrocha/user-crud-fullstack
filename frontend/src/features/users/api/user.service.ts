import api from './axios';
import type { User } from '../types/user';


export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/users/?skip=0&limit=100"); // TODO: fix hard coded api query
  return data;
};

export const createUser = async (user: CreateUserDTO): Promise<User> => {
  const { data } = await api.post("/users/", user);
  return data;
};

export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/users/${userId}`);
};

export const updateUser = async (id: number, data: CreateUserDTO): Promise<User> => {
  const { data: response } = await api.put(`/users/${id}`, data);
  return response;
};