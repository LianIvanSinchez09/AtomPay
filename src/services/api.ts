import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export async function getDolar(tipo = "blue") {
  const res = await fetch(`https://dolarapi.com/v1/dolares/${tipo}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}