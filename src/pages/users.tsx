import { useEffect, useMemo, useState, type FormEvent } from "react";
import Sidebar, { type MenuLabel } from "../Components/Sidebar";
import { useAuth } from "../auth";
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
  ChevronDown,
  Pencil,
  Check,
  X,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------ Tipe & Data ------------------------------ */

type Peran = "Admin" | "Petugas Gudang";
type Status = "Aktif" | "Nonaktif";

interface Pengguna {
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
}

type ModalState =
  | { mode: "tambah" }
  | { mode: "ubah"; username: string }
  | null;

const peranStyle: Record<
  Peran,
  { bg: string; color: string; icon: LucideIcon }
> = {
  Admin: { bg: "#f2ecff", color: "#7c3aed", icon: ShieldCheck },
  "Petugas Gudang": { bg: "#eaf2ff", color: "#1769e0", icon: Warehouse },
};

const dataAwal: Pengguna[] = [
  {
    inisial: "AP",
    nama: "Ayu Pramesti",
    email: "ayu.pramesti@badungkab.go.id",
    username: "ayu.pramesti",
    peran: "Admin",
    status: "Aktif",
    login: "05 Okt 2026 · 09.28",
  },
  {
    inisial: "MA",
    nama: "Made Aditya",
    email: "made.aditya@badungkab.go.id",
    username: "made.aditya",
    peran: "Petugas Gudang",
    status: "Aktif",
    login: "05 Okt 2026 · 08.54",
  },
  {
    inisial: "KA",
    nama: "Komang Arta",
    email: "komang.arta@badungkab.go.id",
    username: "komang.arta",
    peran: "Petugas Gudang",
    status: "Aktif",
    login: "04 Okt 2026 · 16.18",
  },
  {
    inisial: "DW",
    nama: "Desak Wulandari",
    email: "desak.wulandari@badungkab.go.id",
    username: "desak.wulandari",
    peran: "Admin",
    status: "Aktif",
    login: "04 Okt 2026 · 14.02",
  },
  {
    inisial: "WS",
    nama: "Wayan Sudiarta",
    email: "wayan.sudiarta@badungkab.go.id",
    username: "wayan.sudiarta",
    peran: "Petugas Gudang",
    status: "Nonaktif",
    login: "21 Sep 2026 · 10.15",
  },
];

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
};

function buatInisial(nama: string) {
  const kata = nama.trim().split(/\s+/).filter(Boolean);
  if (kata.length === 0) return "??";
  if (kata.length === 1) return kata[0].slice(0, 2).toUpperCase();
  return (kata[0][0] + kata[1][0]).toUpperCase();
}

/* --------------------------- Komponen kecil --------------------------- */

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
    <div className="relative flex min-w-px flex-[1_0_0] items-center gap-[11px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white p-[15px]">
      <div
        className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[8px]"
        style={{ backgroundColor: bg }}
      >
        <div
          className="flex size-[17px] shrink-0 items-center justify-center"
          style={{ color }}
        >
          <Icon size={17} />
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-[2px] overflow-clip whitespace-nowrap font-normal not-italic leading-[normal]">
        <p className="shrink-0 text-[20px] text-[#172b4d]">{nilai}</p>
        <p className="shrink-0 text-[10px] text-[#64748b]">{label}</p>
      </div>
    </div>
  );
}

function FilterButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-[40px] shrink-0 items-center gap-[10px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[12px] font-normal not-italic"
    >
      <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal] text-[#172b4d]">
        {label}
      </span>
      <ChevronDown size={14} className="shrink-0 text-[#64748b]" />
    </button>
  );
}

function PeranBadge({ peran }: { peran: Peran }) {
  const s = peranStyle[peran];
  const Icon = s.icon;
  return (
    <div
      className="flex shrink-0 items-center gap-[5px] overflow-clip rounded-[999px] px-[9px] py-[5px]"
      style={{ backgroundColor: s.bg }}
    >
      <div
        className="flex size-[12px] shrink-0 items-center justify-center"
        style={{ color: s.color }}
      >
        <Icon size={12} />
      </div>
      <p
        className="shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal]"
        style={{ color: s.color }}
      >
        {peran}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const aktif = status === "Aktif";
  const Icon = aktif ? CircleCheck : CircleX;
  return (
    <div
      className="flex shrink-0 items-center gap-[5px] overflow-clip rounded-[999px] px-[9px] py-[5px]"
      style={{
        backgroundColor: aktif ? "#eaf8ef" : "#f1f5f9",
        color: aktif ? "#15803d" : "#64748b",
      }}
    >
      <div className="flex size-[12px] shrink-0 items-center justify-center">
        <Icon size={12} />
      </div>
      <p className="shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal]">
        {status}
      </p>
    </div>
  );
}

/* ------------------------------ Modal Form ------------------------------ */

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
  onSubmit: (data: FormData) => void;
  cekUsernameKembar: (username: string) => boolean;
}) {
  const [form, setForm] = useState<FormData>(awal);
  const [error, setError] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err: Partial<Record<keyof FormData, string>> = {};
    const nama = form.nama.trim();
    const email = form.email.trim();
    const username = form.username.trim();

    if (!nama) err.nama = "Nama wajib diisi";
    if (!email) err.email = "Email wajib diisi";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      err.email = "Format email tidak valid";
    if (!username) err.username = "Nama pengguna wajib diisi";
    else if (/\s/.test(username))
      err.username = "Nama pengguna tidak boleh mengandung spasi";
    else if (cekUsernameKembar(username))
      err.username = "Nama pengguna sudah dipakai";

    if (Object.keys(err).length > 0) {
      setError(err);
      return;
    }
    onSubmit({ ...form, nama, email, username });
  };

  const inputCls = (hasErr?: string) =>
    `h-[40px] w-full rounded-[8px] border border-solid bg-white px-[12px] text-[14px] text-[#172b4d] outline-none focus:border-[#1769e0] ${
      hasErr ? "border-[#c2413a]" : "border-[#dce4ee]"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(23,43,77,0.45)] p-[16px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-[440px] max-w-full flex-col gap-[16px] rounded-[12px] bg-white p-[24px] font-normal not-italic shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[4px]">
            <p className="text-[18px] text-[#172b4d]">
              {mode === "tambah" ? "Tambah pengguna" : "Ubah pengguna"}
            </p>
            <p className="text-[12px] text-[#64748b]">
              {mode === "tambah"
                ? "Isi data akun pengguna baru."
                : "Perbarui data akun pengguna."}
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="flex size-[30px] items-center justify-center rounded-[6px] text-[#64748b] hover:bg-[#f3f6fa]"
          >
            <X size={16} />
          </button>
        </div>

        <label className="flex flex-col gap-[6px]">
          <span className="text-[12px] text-[#64748b]">Nama lengkap</span>
          <input
            className={inputCls(error.nama)}
            value={form.nama}
            onChange={(e) => set("nama", e.target.value)}
            placeholder="Contoh: Ayu Pramesti"
            autoFocus
          />
          {error.nama && (
            <span className="text-[11px] text-[#c2413a]">{error.nama}</span>
          )}
        </label>

        <label className="flex flex-col gap-[6px]">
          <span className="text-[12px] text-[#64748b]">Email</span>
          <input
            className={inputCls(error.email)}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="nama@badungkab.go.id"
          />
          {error.email && (
            <span className="text-[11px] text-[#c2413a]">{error.email}</span>
          )}
        </label>

        <label className="flex flex-col gap-[6px]">
          <span className="text-[12px] text-[#64748b]">Nama pengguna</span>
          <input
            className={inputCls(error.username)}
            value={form.username}
            onChange={(e) => set("username", e.target.value)}
            placeholder="contoh: ayu.pramesti"
          />
          {error.username && (
            <span className="text-[11px] text-[#c2413a]">{error.username}</span>
          )}
        </label>

        <div className="flex gap-[12px]">
          <label className="flex min-w-px flex-[1_0_0] flex-col gap-[6px]">
            <span className="text-[12px] text-[#64748b]">Peran</span>
            <select
              className={inputCls()}
              value={form.peran}
              onChange={(e) => set("peran", e.target.value as Peran)}
            >
              <option value="Admin">Admin</option>
              <option value="Petugas Gudang">Petugas Gudang</option>
            </select>
          </label>
          <label className="flex min-w-px flex-[1_0_0] flex-col gap-[6px]">
            <span className="text-[12px] text-[#64748b]">Status</span>
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

        <div className="mt-[4px] flex justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="h-[40px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[16px] text-[14px] text-[#172b4d]"
          >
            Batal
          </button>
          <button
            type="submit"
            className="h-[40px] rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[16px] text-[14px] text-white"
          >
            {mode === "tambah" ? "Simpan pengguna" : "Simpan perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------ Halaman ------------------------------ */

export default function ManajemenPenggunaScreen({
  onNavigate,
}: {
  onNavigate?: (label: MenuLabel) => void;
}) {
  const { user } = useAuth();

  const [daftar, setDaftar] = useState<Pengguna[]>(dataAwal);
  const [keyword, setKeyword] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  /* Ringkasan dinamis */
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

  /* Pencarian */
  const hasil = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return daftar;
    return daftar.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q),
    );
  }, [daftar, keyword]);

  /* Data awal untuk modal */
  const penggunaDiubah =
    modal?.mode === "ubah"
      ? daftar.find((p) => p.username === modal.username)
      : undefined;

  const formAwal: FormData = penggunaDiubah
    ? {
        nama: penggunaDiubah.nama,
        email: penggunaDiubah.email,
        username: penggunaDiubah.username,
        peran: penggunaDiubah.peran,
        status: penggunaDiubah.status,
      }
    : formKosong;

  const cekUsernameKembar = (username: string) =>
    daftar.some(
      (p) =>
        p.username.toLowerCase() === username.toLowerCase() &&
        p.username !== penggunaDiubah?.username,
    );

  const handleSimpan = (data: FormData) => {
    if (modal?.mode === "ubah" && penggunaDiubah) {
      setDaftar((list) =>
        list.map((p) =>
          p.username === penggunaDiubah.username
            ? { ...p, ...data, inisial: buatInisial(data.nama) }
            : p,
        ),
      );
    } else {
      setDaftar((list) => [
        ...list,
        {
          ...data,
          inisial: buatInisial(data.nama),
          login: "Belum pernah login",
        },
      ]);
    }
    setModal(null);
  };

  return (
    <div className="relative flex size-full items-start bg-[#f3f6fa]">
      <Sidebar active="Manajemen Pengguna" onNavigate={onNavigate} />

      <div className="relative flex min-h-[1040px] min-w-px flex-[1_0_0] flex-col items-start overflow-clip">
        {/* Top bar */}
        <div className="flex h-[76px] w-full shrink-0 items-center justify-between overflow-clip whitespace-nowrap border-b border-solid border-[#dce4ee] bg-white px-[32px] not-italic leading-[normal]">
          <p className="shrink-0 text-[16px] font-bold text-[#172b4d]">
            Sistem Persediaan Infrastruktur TIK
          </p>
          <p className="shrink-0 text-[12px] font-normal text-[#64748b]">
            {user?.nama} · {user?.role}
          </p>
        </div>

        {/* Page content */}
        <div className="flex w-full shrink-0 flex-col items-start gap-[24px] overflow-clip p-[32px]">
          {/* Page heading */}
          <div className="flex w-full shrink-0 items-center justify-between overflow-clip font-normal not-italic">
            <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[5px] overflow-clip leading-[normal]">
              <p className="w-full shrink-0 text-[26px] text-[#172b4d]">
                Manajemen Pengguna
              </p>
              <p className="w-full shrink-0 text-[14px] text-[#64748b]">
                Kelola akun, status akses, dan peran pengguna sistem
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModal({ mode: "tambah" })}
              className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-white hover:bg-[#1259c2]"
            >
              <Plus size={16} className="shrink-0" />
              <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                Tambah pengguna
              </span>
            </button>
          </div>

          {/* User summary */}
          <div className="flex w-full shrink-0 items-start gap-[12px] overflow-clip">
            {ringkasan.map((r) => (
              <SummaryCard key={r.label} {...r} />
            ))}
          </div>

          {/* User management */}
          <div className="flex w-full shrink-0 items-start gap-[16px]">
            {/* Daftar pengguna */}
            <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[14px]">
              <div className="flex w-full shrink-0 items-end gap-[10px] overflow-clip">
                <label className="flex h-[40px] w-[320px] shrink-0 items-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[12px] font-normal not-italic text-[#94a3b8] focus-within:border-[#1769e0]">
                  <Search size={16} className="shrink-0" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Cari nama atau nama pengguna..."
                    className="min-w-px flex-[1_0_0] bg-transparent text-[14px] leading-[normal] text-[#172b4d] outline-none placeholder:text-[#94a3b8]"
                  />
                  {keyword && (
                    <button
                      type="button"
                      aria-label="Hapus pencarian"
                      onClick={() => setKeyword("")}
                      className="flex shrink-0 items-center text-[#94a3b8] hover:text-[#64748b]"
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>
                <FilterButton label="Semua peran" />
                <FilterButton label="Semua status" />
                <div className="h-px min-w-px flex-[1_0_0]" />
              </div>

              <div className="relative flex w-full shrink-0 flex-col items-start rounded-[12px] border border-solid border-[#dce4ee] bg-white drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
                <div className="flex h-[42px] w-full shrink-0 items-center gap-[12px] border-b border-solid border-[#dce4ee] bg-[#f8fafc] px-[16px] text-[11px] font-normal uppercase not-italic leading-[normal] text-[#64748b]">
                  <p className="w-[190px] shrink-0">Pengguna</p>
                  <p className="w-[100px] shrink-0">Nama pengguna</p>
                  <p className="w-[130px] shrink-0">Peran</p>
                  <p className="w-[75px] shrink-0">Status</p>
                  <p className="w-[95px] shrink-0">Login terakhir</p>
                  <p className="min-w-px flex-[1_0_0] text-right">Aksi</p>
                </div>

                {hasil.length === 0 && (
                  <div className="flex min-h-[90px] w-full items-center justify-center border-b border-solid border-[#dce4ee] px-[16px] text-[12px] font-normal not-italic text-[#64748b]">
                    {keyword
                      ? `Tidak ada pengguna yang cocok dengan "${keyword}"`
                      : "Belum ada pengguna"}
                  </div>
                )}

                {hasil.map((p) => {
                  const s = peranStyle[p.peran];
                  return (
                    <div
                      key={p.username}
                      className="flex min-h-[66px] w-full shrink-0 items-center gap-[12px] overflow-clip border-b border-solid border-[#dce4ee] px-[16px]"
                    >
                      <div className="flex w-[190px] shrink-0 items-center gap-[10px] overflow-clip">
                        <div
                          className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[999px]"
                          style={{ backgroundColor: s.bg }}
                        >
                          <p
                            className="shrink-0 whitespace-nowrap text-[11px] font-normal not-italic leading-[normal]"
                            style={{ color: s.color }}
                          >
                            {p.inisial}
                          </p>
                        </div>
                        <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[3px] overflow-clip not-italic leading-[normal]">
                          <p className="w-full shrink-0 text-[12px] font-bold text-[#172b4d]">
                            {p.nama}
                          </p>
                          <p className="w-full shrink-0 text-[9px] font-normal text-[#64748b]">
                            {p.email}
                          </p>
                        </div>
                      </div>
                      <p className="w-[100px] shrink-0 text-[10px] font-normal not-italic leading-[normal] text-[#172b4d]">
                        {p.username}
                      </p>
                      <div className="flex w-[130px] shrink-0 items-start overflow-clip">
                        <PeranBadge peran={p.peran} />
                      </div>
                      <div className="flex w-[75px] shrink-0 items-start overflow-clip">
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="w-[95px] shrink-0 text-[9px] font-normal not-italic leading-[1.4] text-[#64748b]">
                        {p.login}
                      </p>
                      <div className="flex min-w-px flex-[1_0_0] items-start justify-end overflow-clip">
                        <button
                          type="button"
                          aria-label={`Ubah pengguna ${p.nama}`}
                          title="Ubah pengguna"
                          onClick={() =>
                            setModal({ mode: "ubah", username: p.username })
                          }
                          className="flex size-[30px] shrink-0 cursor-pointer items-center justify-center overflow-clip rounded-[6px] border border-solid border-[#dce4ee] text-[#1769e0] hover:bg-[#eaf2ff]"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="flex w-full shrink-0 items-start justify-between overflow-clip whitespace-nowrap p-[16px] text-[10px] not-italic leading-[normal]">
                  <p className="shrink-0 font-normal text-[#64748b]">
                    {keyword
                      ? `${hasil.length} dari ${daftar.length} pengguna`
                      : `${daftar.length} pengguna terdaftar`}
                  </p>
                  <p className="shrink-0 font-bold text-[#1769e0]">
                    Lihat aktivitas akun →
                  </p>
                </div>
              </div>
            </div>

            {/* Informasi peran */}
            <div className="relative flex w-[330px] shrink-0 flex-col items-start gap-[14px]">
              <div className="relative flex w-[330px] shrink-0 flex-col items-start gap-[16px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[18px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
                <div className="flex w-full shrink-0 flex-col items-start gap-[4px] overflow-clip font-normal not-italic">
                  <p className="shrink-0 whitespace-nowrap text-[14px] leading-[normal] text-[#172b4d]">
                    Hak akses per peran
                  </p>
                  <p className="w-full shrink-0 text-[10px] leading-[1.4] text-[#64748b]">
                    Ringkasan modul yang dapat diakses oleh setiap peran.
                  </p>
                </div>

                <div className="flex w-full shrink-0 items-start gap-[8px] overflow-clip pb-[7px] text-[9px] font-bold uppercase not-italic leading-[normal] text-[#94a3b8]">
                  <p className="min-w-px flex-[1_0_0]">Modul</p>
                  <p className="w-[45px] shrink-0 text-center">Admin</p>
                  <p className="w-[55px] shrink-0 text-center">Petugas</p>
                </div>

                <div className="flex w-full shrink-0 flex-col items-start overflow-clip">
                  {hakAkses.map((modul) => (
                    <div
                      key={modul}
                      className="flex min-h-[38px] w-full shrink-0 items-center gap-[8px] overflow-clip border-b border-solid border-[#dce4ee]"
                    >
                      <p className="min-w-px flex-[1_0_0] text-[10px] font-normal not-italic leading-[normal] text-[#172b4d]">
                        {modul}
                      </p>
                      <div className="flex w-[45px] shrink-0 items-center justify-center text-[#15803d]">
                        <Check size={16} />
                      </div>
                      <div className="flex w-[55px] shrink-0 items-center justify-center text-[#15803d]">
                        <Check size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex w-full shrink-0 flex-col items-start gap-[12px] overflow-clip rounded-[12px] bg-[#fef0ef] p-[17px] font-normal not-italic">
                <div className="flex shrink-0 items-center gap-[8px] overflow-clip text-[#c2413a]">
                  <ShieldAlert size={17} className="shrink-0" />
                  <p className="shrink-0 whitespace-nowrap text-[12px] leading-[normal]">
                    Keamanan akun
                  </p>
                </div>
                <p className="w-full shrink-0 text-[10px] leading-[1.5] text-[#8b433e]">
                  Nonaktifkan akun pegawai yang tidak lagi bertugas. Perubahan
                  peran dan reset kata sandi tercatat di log audit.
                </p>
                <div className="flex shrink-0 items-center gap-[7px] overflow-clip">
                  <div className="flex size-[12px] shrink-0 items-center justify-center text-[#15803d]">
                    <CircleCheck size={12} />
                  </div>
                  <p className="shrink-0 whitespace-nowrap text-[10px] leading-[normal] text-[#15803d]">
                    Kebijakan akses aktif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal tambah / ubah */}
      {modal && (modal.mode === "tambah" || penggunaDiubah) && (
        <PenggunaModal
          key={modal.mode === "ubah" ? modal.username : "tambah"}
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
