
import { api } from "./api";

export const chat = async (userId: string, input: string) => {
  const { data } = await api.post("/chat/ai", {
    message: input,
  });

  return data;
};

export const getMessages = async (userId: string) => {
  const { data } = await api.get("/chat/ai", {
    message: input,
  });

  return data;
}; 