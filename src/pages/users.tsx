import { useEffect, useMemo, useState, type FormEvent } from "react";
import Sidebar, { type MenuLabel } from "../Components/Sidebar";
import { useAuth } from "../auth";
import { apiRequest } from "../api";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Warehouse,
  UserCheck,
  CircleCheck,
  CircleX,
  Plus,
  Search,
  Pencil,
  Check,
  X,
  type LucideIcon,
} from "lucide-react";

type Peran = "Admin" | "Petugas Gudang";
type Status = "Aktif" | "Nonaktif";

interface Pengguna {
  id: number;
  inisial: string;
  nama: string;
  email: string;
  username: string;
  peran: Peran;
  status: Status;
  login: string;
}

interface FormData {
  nama: string;
  email: string;
  username: string;
  peran: Peran;
  status: Status;
  password: string;
}

type ModalState =
  | { mode: "tambah" }
  | { mode: "ubah"; id: number }
  | null;

const peranStyle: Record<
  Peran,
  { bg: string; color: string; icon: LucideIcon }
> = {
  Admin: { bg: "#f2ecff", color: "#7c3aed", icon: ShieldCheck },
  "Petugas Gudang": {
    bg: "#eaf2ff",
    color: "#1769e0",
    icon: Warehouse,
  },
};

const hakAkses = [
  "Dashboard & notifikasi",
  "Master barang",
  "Barang masuk / keluar",
  "Stok opname",
  "Laporan & export",
];

const formKosong: FormData = {
  nama: "",
  email: "",
  username: "",
  peran: "Petugas Gudang",
  status: "Aktif",
  password: "",
};

function buatInisial(nama: string) {
  const kata = nama.trim().split(/\s+/).filter(Boolean);

  if (kata.length === 0) return "??";
  if (kata.length === 1) return kata[0].slice(0, 2).toUpperCase();

  return (kata[0][0] + kata[1][0]).toUpperCase();
}

function SummaryCard({
  nilai,
  label,
  icon: Icon,
  bg,
  color,
}: {
  nilai: number;
  label: string;
  icon: LucideIcon;
  bg: string;
  color: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[#dce4ee] bg-white p-3 sm:p-4">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: bg, color }}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xl leading-tight text-[#172b4d]">{nilai}</p>
        <p className="mt-1 text-xs text-[#64748b]">{label}</p>
      </div>
    </div>
  );
}

function PeranBadge({ peran }: { peran: Peran }) {
  const style = peranStyle[peran];
  const Icon = style.icon;

  return (
    <span
      className="inline-flex w-fit max-w-full items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      <Icon size={13} className="shrink-0" />
      <span>{peran}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const aktif = status === "Aktif";
  const Icon = aktif ? CircleCheck : CircleX;

  return (
    <span
      className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs"
      style={{
        backgroundColor: aktif ? "#eaf8ef" : "#f1f5f9",
        color: aktif ? "#15803d" : "#64748b",
      }}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

function PenggunaModal({
  mode,
  awal,
  onClose,
  onSubmit,
  cekUsernameKembar,
}: {
  mode: "tambah" | "ubah";
  awal: FormData;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  cekUsernameKembar: (username: string) => boolean;
}) {
  const [form, setForm] = useState<FormData>(awal);
  const [menyimpan, setMenyimpan] = useState(false);
  const [errorSimpan, setErrorSimpan] = useState("");
  const [error, setError] = useState<
    Partial<Record<keyof FormData, string>>
  >({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const err: Partial<Record<keyof FormData, string>> = {};
    const nama = form.nama.trim();
    const email = form.email.trim();
    const username = form.username.trim();

    if (!nama) err.nama = "Nama wajib diisi";

    if (!email) {
      err.email = "Email wajib diisi";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      err.email = "Format email tidak valid";
    }

    if (!username) {
      err.username = "Nama pengguna wajib diisi";
    } else if (/\s/.test(username)) {
      err.username = "Nama pengguna tidak boleh mengandung spasi";
    } else if (cekUsernameKembar(username)) {
      err.username = "Nama pengguna sudah dipakai";
    }

    if (mode === "tambah" && form.password.trim().length < 8) {
      err.password = "Password awal minimal 8 karakter";
    }

    if (Object.keys(err).length > 0) {
      setError(err);
      return;
    }

    setMenyimpan(true);
    setErrorSimpan("");

    try {
      await onSubmit({
        ...form,
        nama,
        email,
        username,
        password: form.password,
      });
    } catch (error) {
      setErrorSimpan(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan pengguna.",
      );
    } finally {
      setMenyimpan(false);
    }
  };

  const inputCls = (hasErr?: string) =>
    `h-10 w-full rounded-lg border bg-white px-3 text-sm text-[#172b4d] outline-none focus:border-[#1769e0] ${
      hasErr ? "border-[#c2413a]" : "border-[#dce4ee]"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(23,43,77,0.45)] p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="my-auto flex w-full max-w-[440px] flex-col gap-4 rounded-xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg text-[#172b4d]">
              {mode === "tambah" ? "Tambah pengguna" : "Ubah pengguna"}
            </p>
            <p className="mt-1 text-xs text-[#64748b]">
              {mode === "tambah"
                ? "Isi data akun pengguna baru."
                : "Perbarui data akun pengguna."}
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-[#64748b] hover:bg-[#f3f6fa]"
          >
            <X size={17} />
          </button>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[#64748b]">Nama lengkap</span>
          <input
            className={inputCls(error.nama)}
            value={form.nama}
            onChange={(e) => set("nama", e.target.value)}
            placeholder="Contoh: Ayu Pramesti"
            autoFocus
          />
          {error.nama && (
            <span className="text-xs text-[#c2413a]">{error.nama}</span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[#64748b]">Email</span>
          <input
            className={inputCls(error.email)}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="nama@simperanet.local"
          />
          {error.email && (
            <span className="text-xs text-[#c2413a]">{error.email}</span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[#64748b]">Nama pengguna</span>
          <input
            className={inputCls(error.username)}
            value={form.username}
            onChange={(e) => set("username", e.target.value)}
            placeholder="contoh: ayu.pramesti"
          />
          {error.username && (
            <span className="text-xs text-[#c2413a]">
              {error.username}
            </span>
          )}
        </label>

        {mode === "tambah" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-[#64748b]">Password awal</span>
            <input
              type="password"
              autoComplete="new-password"
              className={inputCls(error.password)}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Minimal 8 karakter"
            />
            {error.password && (
              <span className="text-xs text-[#c2413a]">
                {error.password}
              </span>
            )}
          </label>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="text-xs text-[#64748b]">Peran</span>
            <select
              className={inputCls()}
              value={form.peran}
              onChange={(e) => set("peran", e.target.value as Peran)}
            >
              <option value="Admin">Admin</option>
              <option value="Petugas Gudang">Petugas Gudang</option>
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="text-xs text-[#64748b]">Status</span>
            <select
              className={inputCls()}
              value={form.status}
              onChange={(e) => set("status", e.target.value as Status)}
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </label>
        </div>

        {errorSimpan && (
          <p className="text-sm text-[#c2413a]">{errorSimpan}</p>
        )}

        <div className="mt-1 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={menyimpan}
            className="h-10 rounded-lg border border-[#dce4ee] px-4 text-sm text-[#172b4d]"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={menyimpan}
            className="h-10 rounded-lg bg-[#1769e0] px-4 text-sm text-white disabled:opacity-60"
          >
            {menyimpan
              ? "Menyimpan..."
              : mode === "tambah"
                ? "Simpan pengguna"
                : "Simpan perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ManajemenPenggunaScreen({
  onNavigate,
}: {
  onNavigate?: (label: MenuLabel) => void;
}) {
  const { user } = useAuth();

  const [daftar, setDaftar] = useState<Pengguna[]>([]);
  const [keyword, setKeyword] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [memuat, setMemuat] = useState(true);
  const [errorApi, setErrorApi] = useState("");
  const [filterPeran, setFilterPeran] = useState<"Semua" | Peran>("Semua");
  const [filterStatus, setFilterStatus] = useState<"Semua" | Status>("Semua");

  type PenggunaApi = {
    id: number;
    name: string;
    email: string;
    username: string;
    role: "admin" | "petugas_gudang";
    status: "aktif" | "nonaktif";
    last_login_at: string | null;
  };

  const muatPengguna = async () => {
    setMemuat(true);
    setErrorApi("");

    try {
      const response = await apiRequest<{ data: PenggunaApi[] }>("/users");

      setDaftar(
        response.data.map((p) => ({
          id: p.id,
          inisial: buatInisial(p.name),
          nama: p.name,
          email: p.email,
          username: p.username,
          peran: p.role === "admin" ? "Admin" : "Petugas Gudang",
          status: p.status === "aktif" ? "Aktif" : "Nonaktif",
          login: p.last_login_at
            ? new Date(p.last_login_at).toLocaleString("id-ID")
            : "Belum pernah login",
        })),
      );
    } catch (error) {
      setErrorApi(
        error instanceof Error
          ? error.message
          : "Gagal memuat data pengguna.",
      );
    } finally {
      setMemuat(false);
    }
  };

  useEffect(() => {
    void muatPengguna();
  }, []);

  const ringkasan = useMemo(
    () => [
      {
        nilai: daftar.length,
        label: "Total pengguna",
        icon: Users,
        bg: "#eaf2ff",
        color: "#1769e0",
      },
      {
        nilai: daftar.filter((p) => p.peran === "Admin").length,
        label: "Admin",
        icon: ShieldCheck,
        bg: "#f2ecff",
        color: "#7c3aed",
      },
      {
        nilai: daftar.filter((p) => p.peran === "Petugas Gudang").length,
        label: "Petugas Gudang",
        icon: Warehouse,
        bg: "#e6f7fa",
        color: "#0891b2",
      },
      {
        nilai: daftar.filter((p) => p.status === "Aktif").length,
        label: "Akun aktif",
        icon: UserCheck,
        bg: "#eaf8ef",
        color: "#15803d",
      },
    ],
    [daftar],
  );

  const hasil = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return daftar.filter((p) => {
      const cocokKata =
        !q ||
        p.nama.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q);

      const cocokPeran = filterPeran === "Semua" || p.peran === filterPeran;
      const cocokStatus =
        filterStatus === "Semua" || p.status === filterStatus;

      return cocokKata && cocokPeran && cocokStatus;
    });
  }, [daftar, keyword, filterPeran, filterStatus]);

  const penggunaDiubah =
    modal?.mode === "ubah"
      ? daftar.find((p) => p.id === modal.id)
      : undefined;

  const formAwal: FormData = penggunaDiubah
    ? {
        nama: penggunaDiubah.nama,
        email: penggunaDiubah.email,
        username: penggunaDiubah.username,
        peran: penggunaDiubah.peran,
        status: penggunaDiubah.status,
        password: "",
      }
    : formKosong;

  const cekUsernameKembar = (username: string) =>
    daftar.some(
      (p) =>
        p.username.toLowerCase() === username.toLowerCase() &&
        p.id !== penggunaDiubah?.id,
    );

  const handleSimpan = async (data: FormData) => {
    const payload = {
      name: data.nama,
      email: data.email,
      username: data.username,
      role: data.peran === "Admin" ? "admin" : "petugas_gudang",
      status: data.status === "Aktif" ? "aktif" : "nonaktif",
      ...(modal?.mode === "tambah" ? { password: data.password } : {}),
    };

    if (modal?.mode === "ubah" && penggunaDiubah) {
      await apiRequest(`/users/${penggunaDiubah.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await apiRequest("/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    setModal(null);
    await muatPengguna();
  };

  return (
    <div className="relative flex min-h-screen w-full min-w-0 items-start bg-[#f3f6fa]">
      <Sidebar active="Manajemen Pengguna" onNavigate={onNavigate} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex min-h-[76px] w-full flex-wrap items-center justify-between gap-2 border-b border-[#dce4ee] bg-white px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-[#172b4d] sm:text-base">
            Sistem Persediaan Infrastruktur TIK
          </p>
          <p className="text-xs text-[#64748b]">
            {user?.nama} · {user?.role}
          </p>
        </header>

        <main className="flex w-full min-w-0 flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl text-[#172b4d] sm:text-[26px]">
                Manajemen Pengguna
              </h1>
              <p className="mt-1 text-sm text-[#64748b]">
                Kelola akun, status akses, dan peran pengguna sistem
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModal({ mode: "tambah" })}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1769e0] px-4 text-sm text-white hover:bg-[#1259c2]"
            >
              <Plus size={16} />
              Tambah pengguna
            </button>
          </div>

          <section className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {ringkasan.map((r) => (
              <SummaryCard key={r.label} {...r} />
            ))}
          </section>

          <section className="grid w-full min-w-0 grid-cols-1 items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="flex min-w-0 flex-col gap-4">
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(180px,1fr)_180px_160px]">
                <label className="flex h-10 min-w-0 items-center gap-2 rounded-lg border border-[#dce4ee] bg-white px-3 text-[#94a3b8] focus-within:border-[#1769e0]">
                  <Search size={18} className="shrink-0" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Cari nama atau nama pengguna..."
                    className="min-w-0 flex-1 bg-transparent text-sm text-[#172b4d] outline-none placeholder:text-[#94a3b8]"
                  />
                  {keyword && (
                    <button
                      type="button"
                      aria-label="Hapus pencarian"
                      onClick={() => setKeyword("")}
                      className="shrink-0 text-[#94a3b8] hover:text-[#64748b]"
                    >
                      <X size={15} />
                    </button>
                  )}
                </label>

                <select
                  aria-label="Filter peran"
                  value={filterPeran}
                  onChange={(e) =>
                    setFilterPeran(e.target.value as "Semua" | Peran)
                  }
                  className="h-10 min-w-0 rounded-lg border border-[#dce4ee] bg-white px-3 text-sm text-[#172b4d]"
                >
                  <option value="Semua">Semua peran</option>
                  <option value="Admin">Admin</option>
                  <option value="Petugas Gudang">Petugas Gudang</option>
                </select>

                <select
                  aria-label="Filter status"
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as "Semua" | Status)
                  }
                  className="h-10 min-w-0 rounded-lg border border-[#dce4ee] bg-white px-3 text-sm text-[#172b4d]"
                >
                  <option value="Semua">Semua status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#dce4ee] bg-white shadow-[0px_8px_24px_rgba(18,49,79,0.06)]">
                <div className="w-full min-w-0 overflow-x-auto">
                  <div className="min-w-[760px]">
                    <div className="grid h-[46px] grid-cols-[190px_100px_130px_90px_125px_48px] items-center gap-3 border-b border-[#dce4ee] bg-[#f8fafc] px-4 text-[11px] uppercase text-[#64748b]">
                      <p>Pengguna</p>
                      <p>Nama pengguna</p>
                      <p>Peran</p>
                      <p>Status</p>
                      <p>Login terakhir</p>
                      <p className="text-right">Aksi</p>
                    </div>

                    {memuat && (
                      <div className="flex min-h-[90px] items-center justify-center px-4 text-sm text-[#64748b]">
                        Memuat data pengguna...
                      </div>
                    )}

                    {errorApi && !memuat && (
                      <div className="flex min-h-[90px] flex-col items-center justify-center gap-3 px-4 text-sm text-[#c2413a]">
                        <span>Gagal memuat data pengguna: {errorApi}</span>
                        <button
                          type="button"
                          onClick={() => void muatPengguna()}
                          className="rounded border border-[#dce4ee] px-3 py-1.5 text-[#1769e0]"
                        >
                          Coba lagi
                        </button>
                      </div>
                    )}

                    {!memuat && !errorApi && hasil.length === 0 && (
                      <div className="flex min-h-[90px] items-center justify-center px-4 text-sm text-[#64748b]">
                        {keyword
                          ? `Tidak ada pengguna yang cocok dengan "${keyword}"`
                          : "Belum ada pengguna"}
                      </div>
                    )}

                    {!memuat &&
                      !errorApi &&
                      hasil.map((p) => (
                        <div
                          key={p.id}
                          className="grid min-h-[74px] grid-cols-[190px_100px_130px_90px_125px_48px] items-center gap-3 border-b border-[#dce4ee] px-4 last:border-b-0"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs"
                              style={{
                                backgroundColor: peranStyle[p.peran].bg,
                                color: peranStyle[p.peran].color,
                              }}
                            >
                              {p.inisial}
                            </div>
                            <div className="min-w-0">
                              <p className="break-words text-sm font-bold text-[#172b4d]">
                                {p.nama}
                              </p>
                              <p className="mt-1 break-all text-xs text-[#64748b]">
                                {p.email}
                              </p>
                            </div>
                          </div>

                          <p className="break-words text-xs text-[#172b4d]">
                            {p.username}
                          </p>

                          <div className="min-w-0">
                            <PeranBadge peran={p.peran} />
                          </div>

                          <div className="min-w-0">
                            <StatusBadge status={p.status} />
                          </div>

                          <p className="text-xs leading-relaxed text-[#64748b]">
                            {p.login}
                          </p>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              aria-label={`Ubah pengguna ${p.nama}`}
                              title="Ubah pengguna"
                              onClick={() =>
                                setModal({ mode: "ubah", id: p.id })
                              }
                              className="flex size-[30px] shrink-0 items-center justify-center rounded-md border border-[#dce4ee] text-[#1769e0] hover:bg-[#eaf2ff]"
                            >
                              <Pencil size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#dce4ee] px-4 py-3 text-xs">
                  <p className="text-[#64748b]">
                    {keyword ||
                    filterPeran !== "Semua" ||
                    filterStatus !== "Semua"
                      ? `${hasil.length} dari ${daftar.length} pengguna`
                      : `${daftar.length} pengguna terdaftar`}
                  </p>
                  <p className="cursor-pointer font-semibold text-[#1769e0]">
                    Lihat aktivitas akun →
                  </p>
                </div>
              </div>
            </div>

            <aside className="flex min-w-0 flex-col gap-4">
              <div className="min-w-0 rounded-xl border border-[#dce4ee] bg-white p-4 shadow-[0px_8px_24px_rgba(18,49,79,0.06)] sm:p-5">
                <h2 className="text-base text-[#172b4d]">
                  Hak akses per peran
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-[#64748b]">
                  Ringkasan modul yang dapat diakses oleh setiap peran.
                </p>

                <div className="mt-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_45px_55px] items-center gap-2 border-b border-[#dce4ee] pb-3 text-[10px] font-bold uppercase text-[#94a3b8]">
                    <p>Modul</p>
                    <p className="text-center">Admin</p>
                    <p className="text-center">Petugas</p>
                  </div>

                  {hakAkses.map((modul) => (
                    <div
                      key={modul}
                      className="grid min-h-[43px] grid-cols-[minmax(0,1fr)_45px_55px] items-center gap-2 border-b border-[#dce4ee] last:border-b-0"
                    >
                      <p className="min-w-0 break-words text-xs text-[#172b4d]">
                        {modul}
                      </p>
                      <div className="flex justify-center text-[#15803d]">
                        <Check size={17} />
                      </div>
                      <div className="flex justify-center text-[#15803d]">
                        <Check size={17} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-3 rounded-xl bg-[#fef0ef] p-4 sm:p-5">
                <div className="flex items-center gap-2 text-[#c2413a]">
                  <ShieldAlert size={19} className="shrink-0" />
                  <h2 className="text-sm">Keamanan akun</h2>
                </div>

                <p className="text-xs leading-relaxed text-[#8b433e]">
                  Nonaktifkan akun pegawai yang tidak lagi bertugas.
                  Perubahan peran dan reset kata sandi tercatat di log audit.
                </p>

                <div className="flex items-center gap-2 text-xs text-[#15803d]">
                  <CircleCheck size={15} className="shrink-0" />
                  <span>Kebijakan akses aktif</span>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>

      {modal && (modal.mode === "tambah" || penggunaDiubah) && (
        <PenggunaModal
          key={modal.mode === "ubah" ? modal.id : "tambah"}
          mode={modal.mode}
          awal={formAwal}
          onClose={() => setModal(null)}
          onSubmit={handleSimpan}
          cekUsernameKembar={cekUsernameKembar}
        />
      )}
    </div>
  );
}
