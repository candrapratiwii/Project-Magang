
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, User as UserIcon } from "lucide-react";
import { apiRequest } from "../api";
import type { User } from "../auth";

const assetPathPrefix = "/assets";
const imgImage1 = "/assets/8d655.png";

type LoginScreenProps = {
  onLogin: (user: User) => void;
};

type LoginResponse = {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    role: "admin" | "petugas_gudang";
    status: string;
  };
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const savedUser = localStorage.getItem("simpera-net-user") ?? "";

  const [username, setUsername] = useState(savedUser);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(savedUser !== "");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setInfo("");

    if (!username.trim() || !password) {
      setError("Nama pengguna dan kata sandi wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest<LoginResponse>("/login", {
        method: "POST",
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      if (!response.token || !response.user) {
        throw new Error("Respons login dari server tidak sesuai.");
      }

      if (response.user.role !== "admin" &&
          response.user.role !== "petugas_gudang") {
        throw new Error("Role pengguna tidak dikenali.");
      }

      sessionStorage.setItem("simpera-net-token", response.token);

      if (remember) {
        localStorage.setItem("simpera-net-user", username.trim());
      } else {
        localStorage.removeItem("simpera-net-user");
      }

      const loggedInUser: User = {
        nama: response.user.name,
        username: response.user.username,
        role:
          response.user.role === "admin"
            ? "Admin"
            : "Petugas Gudang",
      };

      setPassword("");
      onLogin(loggedInUser);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login gagal. Silakan coba kembali.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#0b2442] p-4 sm:p-10">
      {/* Latar: gambar blur + lapisan biru */}
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full scale-110 object-cover blur-md"
        src={imgImage1}
      />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(29,47,191,0.55)_0%,rgba(11,36,66,0.75)_100%)]" />

      <div className="relative z-10 flex min-h-[560px] w-full max-w-[1100px] gap-4 rounded-[32px] bg-white p-3 shadow-[0px_18px_48px_0px_rgba(0,0,0,0.35)] sm:rounded-[48px] sm:p-4 lg:h-[640px]">
        {/* Kiri: form login */}
        <section className="flex flex-1 items-center justify-center px-4 py-8">
          <form
            className="w-full max-w-[290px]"
            onSubmit={handleSubmit}
          >
            <div className="mb-10 flex flex-col items-center text-center">
              <img
                alt="SIMPERA-NET"
                className="mb-3 h-16 w-16 shrink-0 object-contain"
                src={`${assetPathPrefix}/logo.png`}
              />

              <h1 className="text-[30px] font-bold leading-tight text-black">
                Selamat datang
              </h1>

              <p className="mt-2 text-[13px] text-[#172b4d]">
                Masuk menggunakan akun SIMPERA-NET.
              </p>
            </div>

            <div className="space-y-3">
              {/* Username */}
              <div className="flex h-[42px] items-center gap-2 rounded-full border border-[#dce4ee] bg-white px-5 focus-within:border-[#1230b0]">
                <input
                  aria-label="Nama pengguna"
                  autoComplete="username"
                  className="h-full w-full bg-transparent text-[13px] text-[#172b4d] outline-none placeholder:text-[#94a3b8]"
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Nama pengguna"
                  value={username}
                  disabled={isLoading}
                />

                <UserIcon
                  className="shrink-0 text-[#94a3b8]"
                  size={16}
                />
              </div>

              {/* Password */}
              <div className="flex h-[42px] items-center gap-2 rounded-full border border-[#dce4ee] bg-white px-5 focus-within:border-[#1230b0]">
                <input
                  aria-label="Kata sandi"
                  autoComplete="current-password"
                  className="h-full w-full bg-transparent text-[13px] text-[#172b4d] outline-none placeholder:text-[#94a3b8]"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Kata sandi"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={isLoading}
                />

                <button
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Lihat kata sandi"
                  }
                  className="shrink-0 text-[#94a3b8] hover:text-[#1230b0]"
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {/* Ingat saya dan lupa kata sandi */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-[11px] text-[#172b4d]">
                  <input
                    checked={remember}
                    className="size-[14px] rounded border-[#dce4ee] accent-[#1230b0]"
                    onChange={(event) =>
                      setRemember(event.target.checked)
                    }
                    type="checkbox"
                    disabled={isLoading}
                  />
                  Ingat saya
                </label>

                <button
                  className="text-[11px] text-[#64748b] hover:text-[#1230b0] hover:underline"
                  onClick={() => {
                    setError("");
                    setInfo(
                      "Hubungi admin Bidang TIK untuk reset kata sandi akun Anda.",
                    );
                  }}
                  type="button"
                  disabled={isLoading}
                >
                  Lupa kata sandi?
                </button>
              </div>
            </div>

            {/* Pesan */}
            {error ? (
              <p
                className="mt-4 text-[12px] text-[#c2410c]"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            {info ? (
              <p className="mt-4 text-[12px] text-[#0e4fab]">
                {info}
              </p>
            ) : null}

            {/* Tombol masuk */}
            <button
              className="mt-6 flex h-[42px] w-full items-center justify-center rounded-full bg-[#1230b0] text-[14px] font-medium text-white hover:bg-[#0e2690] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>

            <p className="mt-8 text-center text-[11px] text-[#94a3b8]">
              Akses terbatas untuk pegawai yang berwenang • Versi 1.0
            </p>
          </form>
        </section>

        {/* Kanan: gambar tajam */}
        <section className="relative hidden w-1/2 shrink-0 overflow-hidden rounded-[24px] sm:rounded-[36px] lg:block">
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            src={imgImage1}
          />
        </section>
      </div>
    </div>
  );
}
