import api from './axios';
import type { User, UserCreate, UserUpdate } from '../types/user';

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/v1/users/?skip=0&limit=100"); // TODO: fix hard coded api query
  return data;
};

export const createUser = async (user: UserCreate): Promise<User> => {
  const { data } = await api.post("/v1/users/", user);
  return data;
};

export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/v1/users/${userId}`);
};

export const updateUser = async (id: number, data: UserUpdate): Promise<User> => {
  const { data: response } = await api.patch(`/v1/users/${id}`, data);
  return response;
};