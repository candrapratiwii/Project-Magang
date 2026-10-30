import { useEffect, useMemo, useRef, useState } from "react";
import {
  Eye,
  Archive,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Boxes,
  PackageCheck,
  TriangleAlert,
  CircleAlert,
  CircleCheck,
  Cable,
  Plug,
  Router,
  Network,
  Wifi,
  Server,
  Zap,
  Plus,
  Search,
  Download,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../auth";
import { apiRequest } from "../api";
import Sidebar from "../Components/Sidebar";

interface Ringkasan {
  nilai: string;
  label: string;
  icon: LucideIcon;
  bg: string;
  color: string;
}

interface ApiBarang {
  id: number;
  kode_barang: string;
  nama_barang: string;
  kategori_barang_id: number;
  satuan: string;
  lokasi: string;
  stok: number;
  stok_minimum: number;
  deskripsi: string | null;
  aktif: boolean;
  kategori_barang?: {
    id: number;
    nama_kategori: string;
    deskripsi: string | null;
  };
}

interface ApiKategori {
  id: number;
  nama_kategori: string;
  deskripsi: string | null;
  barangs_count?: number;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface Barang {
  id: number;
  kode: string;
  nama: string;
  icon: LucideIcon;
  kategori: string;
  lokasi: string;
  stok: number;
  satuan: string;
  minimum: number;
  aktif: boolean;
}

const ITEM_PER_HALAMAN = 5;
const KEY_TERPILIH = "simpera-barang-terpilih";

const ikonKategori: Record<string, LucideIcon> = {
  jaringan: Network,
  kabel: Cable,
  material: Plug,
  pendukung: Zap,
  router: Router,
  wifi: Wifi,
  server: Server,
};

function ikonUntukKategori(nama: string): LucideIcon {
  const teks = nama.toLowerCase();

  if (teks.includes("router")) return Router;
  if (teks.includes("wifi") || teks.includes("wi-fi")) return Wifi;
  if (teks.includes("kabel") || teks.includes("aksesori")) return Cable;
  if (teks.includes("material") || teks.includes("konektor")) return Plug;
  if (teks.includes("server") || teks.includes("firewall")) return Server;
  if (teks.includes("pendukung")) return Zap;

  return ikonKategori.jaringan ?? Boxes;
}

function ubahDataBarang(item: ApiBarang): Barang {
  const namaKategori =
    item.kategori_barang?.nama_kategori ?? "Tanpa kategori";

  return {
    id: item.id,
    kode: item.kode_barang,
    nama: item.nama_barang,
    icon: ikonUntukKategori(namaKategori),
    kategori: namaKategori,
    lokasi: item.lokasi || "Tempat Penyimpanan",
    stok: Number(item.stok) || 0,
    satuan: item.satuan,
    minimum: Number(item.stok_minimum) || 0,
    aktif: Boolean(item.aktif),
  };
}

function statusDari(barang: Barang): "Tersedia" | "Menipis" {
  return barang.stok <= barang.minimum ? "Menipis" : "Tersedia";
}

function bukaDetail(kode: string) {
  try {
    sessionStorage.setItem(KEY_TERPILIH, kode);
  } catch {
    // Penyimpanan sesi tidak tersedia.
  }

  window.location.hash = "detail";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bukaFormBaru() {
  try {
    sessionStorage.removeItem(KEY_TERPILIH);
  } catch {
    // Penyimpanan sesi tidak tersedia.
  }

  window.location.hash = "form";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function unduhCsv(rows: Barang[]) {
  const header = [
    "Kode",
    "Nama barang",
    "Kategori",
    "Lokasi",
    "Stok",
    "Satuan",
    "Minimum",
    "Status stok",
    "Status barang",
  ];

  const esc = (value: string | number) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const baris = [
    header,
    ...rows.map((barang) => [
      barang.kode,
      barang.nama,
      barang.kategori,
      barang.lokasi,
      barang.stok,
      barang.satuan,
      barang.minimum,
      statusDari(barang),
      barang.aktif ? "Aktif" : "Diarsipkan",
    ]),
  ]
    .map((row) => row.map(esc).join(";"))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + baris], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `master-barang-${new Date().toISOString().slice(0, 10)}.csv`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function SummaryCard({ r }: { r: Ringkasan }) {
  const Icon = r.icon;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#dce4ee] bg-white p-3">
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: r.bg }}
      >
        <Icon size={16} style={{ color: r.color }} />
      </div>

      <div className="min-w-0">
        <p className="text-lg leading-6 text-[#172b4d]">{r.nilai}</p>
        <p className="truncate text-[10px] text-[#64748b]">{r.label}</p>
      </div>
    </div>
  );
}

function StockStatus({ menipis }: { menipis: boolean }) {
  const Icon = menipis ? CircleAlert : CircleCheck;

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
        menipis ? "bg-[#fef0ef]" : "bg-[#eaf8ef]"
      }`}
    >
      <Icon
        size={12}
        className={menipis ? "text-[#c2413a]" : "text-[#15803d]"}
      />

      <span
        className={`whitespace-nowrap text-[11px] ${
          menipis ? "text-[#c2413a]" : "text-[#15803d]"
        }`}
      >
        {menipis ? "Menipis" : "Tersedia"}
      </span>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [buka, setBuka] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const aktif = value !== "";

  useEffect(() => {
    if (!buka) return;

    const klikLuar = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setBuka(false);
      }
    };

    const esc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBuka(false);
    };

    document.addEventListener("mousedown", klikLuar);
    document.addEventListener("keydown", esc);

    return () => {
      document.removeEventListener("mousedown", klikLuar);
      document.removeEventListener("keydown", esc);
    };
  }, [buka]);

  return (
    <div ref={ref} className="relative min-w-0 max-w-full">
      <button
        type="button"
        onClick={() => setBuka((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={buka}
        className={`flex h-10 max-w-full items-center gap-2 rounded-lg border bg-white px-3 ${
          aktif ? "border-[#1769e0] bg-[#eaf2ff]" : "border-[#dce4ee]"
        }`}
      >
        <span
          className={`truncate text-[13px] ${
            aktif ? "text-[#1769e0]" : "text-[#172b4d]"
          }`}
        >
          {aktif ? value : label}
        </span>

        <ChevronDown size={14} className="shrink-0 text-[#64748b]" />
      </button>

      {buka && (
        <div
          role="listbox"
          className="absolute left-0 top-11 z-30 max-h-64 min-w-full overflow-y-auto rounded-lg border border-[#dce4ee] bg-white p-1 shadow-lg"
        >
          {[label, ...options].map((opsi, i) => {
            const terpilih = i === 0 ? !aktif : value === opsi;

            return (
              <button
                key={opsi}
                type="button"
                role="option"
                aria-selected={terpilih}
                onClick={() => {
                  onChange(i === 0 ? "" : opsi);
                  setBuka(false);
                }}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left text-[13px] hover:bg-[#f3f6fa] ${
                  terpilih
                    ? "bg-[#eaf2ff] text-[#1769e0]"
                    : "text-[#172b4d]"
                }`}
              >
                {opsi}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MasterBarangScreen() {
  const { user } = useAuth();

  // Hak akses: hanya Admin yang boleh mengelola master barang.
  const isAdmin = String(user?.role ?? "").toLowerCase() === "admin";

  const [daftar, setDaftar] = useState<Barang[]>([]);
  const [kategoriApi, setKategoriApi] = useState<ApiKategori[]>([]);
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("");
  const [status, setStatus] = useState("");
  const [statusBarang, setStatusBarang] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [aksiId, setAksiId] = useState<number | null>(null);
  const [lokasi, setLokasi] = useState("");
  const [halaman, setHalaman] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let aktif = true;

    async function muatData() {
      setLoading(true);
      setError("");

      try {
        const statusApi = !isAdmin
          ? "aktif"
          : statusBarang === "Barang aktif"
            ? "aktif"
            : statusBarang === "Diarsipkan"
              ? "arsip"
              : "semua";

        const [responsBarang, responsKategori] = await Promise.all([
          apiRequest<ApiResponse<ApiBarang[]>>(`/barang?status=${statusApi}`),
          apiRequest<ApiResponse<ApiKategori[]>>("/kategori-barang"),
        ]);

        if (!aktif) return;

        setDaftar(responsBarang.data.map(ubahDataBarang));
        setKategoriApi(responsKategori.data);
      } catch (err) {
        if (!aktif) return;

        setError(
          err instanceof Error
            ? err.message
            : "Data barang gagal dimuat. Silakan coba kembali.",
        );
      } finally {
        if (aktif) setLoading(false);
      }
    }

    void muatData();

    return () => {
      aktif = false;
    };
  }, [isAdmin, statusBarang, refreshKey]);

  useEffect(() => {
    // Petugas Gudang tidak boleh membuka form tambah barang melalui URL.
    if (!isAdmin && window.location.hash === "#form") {
      window.location.hash = "master";
    }
  }, [isAdmin]);

  const opsiKategori = useMemo(
    () =>
      kategoriApi
        .map((item) => item.nama_kategori)
        .filter((nama) => nama.trim() !== "")
        .sort((a, b) => a.localeCompare(b)),
    [kategoriApi],
  );

  const opsiLokasi = useMemo(
    () => [...new Set(daftar.map((b) => b.lokasi))].sort(),
    [daftar],
  );

  const ringkasan: Ringkasan[] = useMemo(() => {
    const total = daftar.length;

    const menipis = daftar.filter(
      (b) => statusDari(b) === "Menipis",
    ).length;

    const kritis = daftar.filter(
      (b) => b.minimum > 0 && b.stok <= b.minimum / 2,
    ).length;

    return [
      {
        nilai: String(total),
        label: "Total jenis",
        icon: Boxes,
        bg: "#eaf2ff",
        color: "#1769e0",
      },
      {
        nilai: String(total - menipis),
        label: "Stok tersedia",
        icon: PackageCheck,
        bg: "#eaf8ef",
        color: "#15803d",
      },
      {
        nilai: String(menipis),
        label: "Stok menipis",
        icon: TriangleAlert,
        bg: "#fff7e6",
        color: "#b45309",
      },
      {
        nilai: String(kritis),
        label: "Stok kritis",
        icon: CircleAlert,
        bg: "#fef0ef",
        color: "#c2413a",
      },
    ];
  }, [daftar]);

  const adaFilter =
    cari.trim() !== "" ||
    kategori !== "" ||
    status !== "" ||
    lokasi !== "" ||
    statusBarang !== "";

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();

    return daftar.filter(
      (b) =>
        (q === "" ||
          b.kode.toLowerCase().includes(q) ||
          b.nama.toLowerCase().includes(q)) &&
        (kategori === "" || b.kategori === kategori) &&
        (status === "" || statusDari(b) === status) &&
        (lokasi === "" || b.lokasi === lokasi),
    );
  }, [daftar, cari, kategori, status, lokasi]);

  const totalHalaman = Math.max(
    1,
    Math.ceil(hasil.length / ITEM_PER_HALAMAN),
  );

  const halamanAktif = Math.min(halaman, totalHalaman);
  const mulai = (halamanAktif - 1) * ITEM_PER_HALAMAN;
  const tampil = hasil.slice(mulai, mulai + ITEM_PER_HALAMAN);

  const ubahFilter =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setHalaman(1);
    };

  const reset = () => {
    setCari("");
    setKategori("");
    setStatus("");
    setStatusBarang("");
    setLokasi("");
    setHalaman(1);
  };

  const arsipkanBarang = async (barang: Barang) => {
    const setuju = window.confirm(
      `Arsipkan barang "${barang.nama}"? Barang yang diarsipkan tidak dapat digunakan untuk transaksi stok baru.`,
    );
    if (!setuju) return;

    setAksiId(barang.id);
    setError("");
    try {
      await apiRequest<ApiResponse<unknown>>(`/barang/${barang.id}`, {
        method: "DELETE",
      });
      window.alert(`Barang "${barang.nama}" berhasil diarsipkan.`);
      setRefreshKey((nilai) => nilai + 1);
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Barang gagal diarsipkan.",
      );
    } finally {
      setAksiId(null);
    }
  };

  const aktifkanKembali = async (barang: Barang) => {
    const setuju = window.confirm(
      `Aktifkan kembali barang "${barang.nama}"?`,
    );
    if (!setuju) return;

    setAksiId(barang.id);
    setError("");
    try {
      await apiRequest<ApiResponse<unknown>>(
        `/barang/${barang.id}/restore`,
        { method: "PATCH" },
      );
      window.alert(`Barang "${barang.nama}" berhasil diaktifkan kembali.`);
      setRefreshKey((nilai) => nilai + 1);
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Barang gagal diaktifkan kembali.",
      );
    } finally {
      setAksiId(null);
    }
  };

  const kolom =
    "grid grid-cols-[minmax(70px,0.8fr)_minmax(130px,1.5fr)_minmax(90px,1fr)_minmax(100px,1.2fr)_minmax(48px,0.55fr)_minmax(48px,0.55fr)_minmax(76px,0.8fr)_minmax(150px,1.4fr)] items-center gap-2";

  return (
    <div className="relative flex min-h-screen w-full min-w-0 items-start overflow-x-clip bg-[#f3f6fa]">
      <Sidebar active="Master Barang" />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex min-h-[76px] w-full min-w-0 flex-wrap items-center justify-between gap-2 border-b border-[#dce4ee] bg-white px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-[#172b4d] sm:text-base">
            Sistem Persediaan Infrastruktur TIK
          </p>

          <p className="text-xs text-[#64748b]">
            {user?.nama} · {user?.role}
          </p>
        </header>

        <main className="flex w-full min-w-0 flex-col gap-5 overflow-x-clip p-4 sm:p-6 lg:p-8">
          <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl text-[#172b4d]">Master Barang</h1>
              <p className="mt-1 text-sm text-[#64748b]">
                Kelola data induk perangkat dan material infrastruktur TIK
              </p>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={bukaFormBaru}
                className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#1769e0] bg-[#1769e0] px-4 text-sm text-white hover:bg-[#0e4fab]"
              >
                <Plus size={16} />
                Tambah barang
              </button>
            )}
          </div>

          <div className="flex w-full min-w-0 flex-wrap items-center gap-2">
            <div className="flex h-10 w-full min-w-0 items-center gap-2 rounded-lg border border-[#dce4ee] bg-white px-3 text-[#94a3b8] focus-within:border-[#1769e0] sm:w-72">
              <Search size={16} className="shrink-0" />

              <input
                type="text"
                value={cari}
                onChange={(e) => ubahFilter(setCari)(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Escape" && ubahFilter(setCari)("")
                }
                placeholder="Cari kode atau nama barang..."
                aria-label="Cari kode atau nama barang"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#172b4d] outline-none placeholder:text-[#94a3b8]"
              />

              {cari && (
                <button
                  type="button"
                  aria-label="Hapus pencarian"
                  onClick={() => ubahFilter(setCari)("")}
                  className="shrink-0 text-[#64748b]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <FilterSelect
              label="Semua kategori"
              value={kategori}
              options={opsiKategori}
              onChange={ubahFilter(setKategori)}
            />

            {isAdmin && (
              <FilterSelect
                label="Semua barang"
                value={statusBarang}
                options={["Barang aktif", "Diarsipkan"]}
                onChange={ubahFilter(setStatusBarang)}
              />
            )}

            <FilterSelect
              label="Semua status"
              value={status}
              options={["Tersedia", "Menipis"]}
              onChange={ubahFilter(setStatus)}
            />

            <FilterSelect
              label="Semua lokasi"
              value={lokasi}
              options={opsiLokasi}
              onChange={ubahFilter(setLokasi)}
            />

            {adaFilter && (
              <button
                type="button"
                onClick={reset}
                className="h-10 shrink-0 px-2 text-[13px] text-[#1769e0] hover:underline"
              >
                Reset filter
              </button>
            )}

            <div className="flex-1" />

            <button
              type="button"
              onClick={() => unduhCsv(hasil)}
              disabled={hasil.length === 0}
              title={`Unduh ${hasil.length} barang (CSV)`}
              className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#dce4ee] bg-white px-4 text-sm text-[#1769e0] hover:bg-[#f3f6fa] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Unduh data
            </button>
          </div>

          {error && (
            <div className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-[13px] text-[#b91c1c]">
              <p>Data Master Barang gagal dimuat: {error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-fit rounded-md border border-[#fecaca] bg-white px-3 py-2"
              >
                Coba muat ulang
              </button>
            </div>
          )}

          <div className="grid w-full min-w-0 grid-cols-2 gap-3 xl:grid-cols-4">
            {ringkasan.map((r) => (
              <SummaryCard key={r.label} r={r} />
            ))}
          </div>

          <section className="w-full min-w-0 overflow-hidden rounded-xl border border-[#dce4ee] bg-white shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
            <div className="w-full min-w-0 overflow-x-auto">
              <div className="min-w-[850px]">
                <div
                  className={`${kolom} min-h-[42px] border-b border-[#dce4ee] bg-[#f8fafc] px-3 text-[10px] uppercase text-[#64748b] sm:px-4 sm:text-[11px]`}
                >
                  <p>Kode</p>
                  <p>Nama barang</p>
                  <p>Kategori</p>
                  <p>Lokasi</p>
                  <p>Stok</p>
                  <p>Minimum</p>
                  <p>Status</p>
                  <p className="text-right">Aksi</p>
                </div>

                {loading && (
                  <div className="flex items-center justify-center px-4 py-12 text-sm text-[#64748b]">
                    Memuat data barang dari server...
                  </div>
                )}

                {!loading && !error && tampil.length === 0 && (
                  <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                    <p className="text-sm text-[#172b4d]">
                      Tidak ada barang yang cocok
                    </p>

                    <p className="text-xs text-[#64748b]">
                      Coba kata kunci lain atau ubah filter yang dipilih.
                    </p>

                    {adaFilter && (
                      <button
                        type="button"
                        onClick={reset}
                        className="mt-1 h-9 rounded-lg border border-[#dce4ee] bg-white px-4 text-[13px] text-[#1769e0] hover:bg-[#f3f6fa]"
                      >
                        Reset filter
                      </button>
                    )}
                  </div>
                )}

                {!loading &&
                  !error &&
                  tampil.map((b) => {
                    const Icon = b.icon;
                    const menipis = statusDari(b) === "Menipis";

                    return (
                      <div
                        key={b.id}
                        className={`${kolom} min-h-[66px] border-b border-[#dce4ee] px-3 py-3 last:border-b-0 sm:px-4`}
                      >
                        <p className="truncate text-[11px] text-[#1769e0]">
                          {b.kode}
                        </p>

                        <div className="flex min-w-0 items-center gap-2">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#eaf2ff]">
                            <Icon size={15} className="text-[#1769e0]" />
                          </div>

                          <p
                            title={b.nama}
                            className="min-w-0 break-words text-[11px] leading-snug text-[#172b4d]"
                          >
                            {b.nama}
                          </p>
                        </div>

                        <p
                          title={b.kategori}
                          className="min-w-0 break-words text-[11px] text-[#64748b]"
                        >
                          {b.kategori}
                        </p>

                        <p
                          title={b.lokasi}
                          className="min-w-0 break-words text-[11px] leading-snug text-[#64748b]"
                        >
                          {b.lokasi}
                        </p>

                        <p
                          className={`text-[11px] ${
                            menipis ? "text-[#c2413a]" : "text-[#172b4d]"
                          }`}
                        >
                          {b.stok} {b.satuan}
                        </p>

                        <p className="text-[11px] text-[#64748b]">
                          {b.minimum}
                        </p>

                        <div className="flex min-w-0 flex-col items-start gap-1">
                          <StockStatus menipis={menipis} />
                          {!b.aktif && (
                            <span className="rounded-full bg-[#f1f5f9] px-2 py-1 text-[10px] text-[#64748b]">
                              Diarsipkan
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => bukaDetail(b.kode)}
                            className="flex h-8 items-center justify-center gap-1 rounded-md border border-[#dce4ee] bg-white px-2 text-[11px] text-[#1769e0] hover:bg-[#eaf2ff]"
                          >
                            <Eye size={13} />
                            Detail
                          </button>

                          {isAdmin && b.aktif && (
                            <button
                              type="button"
                              disabled={aksiId === b.id}
                              onClick={() => void arsipkanBarang(b)}
                              title="Arsipkan barang"
                              className="flex h-8 items-center justify-center gap-1 rounded-md border border-[#fecaca] bg-white px-2 text-[11px] text-[#b91c1c] hover:bg-[#fef2f2] disabled:cursor-wait disabled:opacity-50"
                            >
                              <Archive size={13} />
                              Arsipkan
                            </button>
                          )}

                          {isAdmin && !b.aktif && (
                            <button
                              type="button"
                              disabled={aksiId === b.id}
                              onClick={() => void aktifkanKembali(b)}
                              title="Aktifkan kembali barang"
                              className="flex h-8 items-center justify-center gap-1 rounded-md border border-[#bbf7d0] bg-white px-2 text-[11px] text-[#15803d] hover:bg-[#eaf8ef] disabled:cursor-wait disabled:opacity-50"
                            >
                              <RotateCcw size={13} />
                              Aktifkan
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-3 px-4 pb-4">
              <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3 border-t border-[#dce4ee] pt-4">
                <p className="text-xs text-[#64748b]">
                  {loading
                    ? "Memuat data..."
                    : hasil.length === 0
                      ? "Menampilkan 0 barang"
                      : `Menampilkan ${mulai + 1}–${mulai + tampil.length} dari ${hasil.length} barang`}
                </p>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Halaman sebelumnya"
                    onClick={() => setHalaman(halamanAktif - 1)}
                    disabled={halamanAktif <= 1 || loading}
                    className="flex size-8 items-center justify-center rounded-md border border-[#dce4ee] text-[#64748b] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from(
                    { length: totalHalaman },
                    (_, i) => i + 1,
                  ).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setHalaman(n)}
                      aria-current={n === halamanAktif ? "page" : undefined}
                      disabled={loading}
                      className={`flex size-8 items-center justify-center rounded-md ${
                        n === halamanAktif
                          ? "bg-[#1769e0]"
                          : "border border-[#dce4ee]"
                      }`}
                    >
                      <span
                        className={`text-xs ${
                          n === halamanAktif
                            ? "font-bold text-white"
                            : "text-[#172b4d]"
                        }`}
                      >
                        {n}
                      </span>
                    </button>
                  ))}

                  <button
                    type="button"
                    aria-label="Halaman berikutnya"
                    onClick={() => setHalaman(halamanAktif + 1)}
                    disabled={halamanAktif >= totalHalaman || loading}
                    className="flex size-8 items-center justify-center rounded-md border border-[#dce4ee] text-[#64748b] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}