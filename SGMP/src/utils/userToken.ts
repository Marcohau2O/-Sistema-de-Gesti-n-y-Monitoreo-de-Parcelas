import { jwtDecode } from "jwt-decode";
import { getToken } from "@/utils/tokenStorage";

interface UserPayload {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<UserPayload>(token);
    return decoded;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
}