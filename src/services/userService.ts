import { api } from "./api";

export const updateLogout = async (id: string) => {
    return await api.patch(`/users/${id}`);
};