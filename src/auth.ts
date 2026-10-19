import { createContext, useContext } from "react";

export type Role = "Admin" | "Petugas Gudang";

export interface User {
  nama: string;
  username: string;
  role: Role;
}

interface AuthValue {
  user: User | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthValue>({
  user: null,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Akun contoh (tanpa backend). Ganti dengan data asli kalau sudah ada API.
export const akunDemo: (User & { password: string })[] = [
  { nama: "Ayu Pramesti", username: "ayu.pramesti", password: "admin123", role: "Admin" },
  { nama: "Made Aditya", username: "made.aditya", password: "petugas123", role: "Petugas Gudang" },
];