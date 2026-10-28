import { useEffect, useMemo, useRef, useState } from "react";
import {
  Eye,
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
    "Status",
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
    <div className="relative flex min-w-px flex-[1_0_0] items-center gap-[11px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white p-[14px]">
      <div
        className="flex size-[34px] shrink-0 items-center justify-center rounded-[8px]"
        style={{ backgroundColor: r.bg }}
      >
        <Icon size={16} style={{ color: r.color }} />
      </div>
      <div className="flex shrink-0 flex-col gap-[2px] whitespace-nowrap">
        <p className="text-[18px] text-[#172b4d]">{r.nilai}</p>
        <p className="text-[10px] text-[#64748b]">{r.label}</p>
      </div>
    </div>
  );
}

function StockStatus({ menipis }: { menipis: boolean }) {
  const Icon = menipis ? CircleAlert : CircleCheck;

  return (
    <div
      className={`flex shrink-0 items-center gap-[5px] rounded-[999px] px-[9px] py-[5px] ${
        menipis ? "bg-[#fef0ef]" : "bg-[#eaf8ef]"
      }`}
    >
      <Icon
        size={12}
        className={menipis ? "text-[#c2413a]" : "text-[#15803d]"}
      />
      <span
        className={`whitespace-nowrap text-[12px] ${
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

  const aktif = value !== "";
  const semua = [label, ...options];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setBuka((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={buka}
        className={`flex h-[40px] shrink-0 cursor-pointer items-center gap-[10px] rounded-[8px] border bg-white px-[12px] ${
          aktif ? "border-[#1769e0] bg-[#eaf2ff]" : "border-[#dce4ee]"
        }`}
      >
        <span
          className={`whitespace-nowrap text-[14px] ${
            aktif ? "text-[#1769e0]" : "text-[#172b4d]"
          }`}
        >
          {aktif ? value : label}
        </span>
        <ChevronDown size={14} className="text-[#64748b]" />
      </button>

      {buka && (
        <div
          role="listbox"
          className="absolute left-0 top-[44px] z-20 w-max min-w-full rounded-[10px] border border-solid border-[#dce4ee] bg-white p-[6px] shadow-lg"
        >
          {semua.map((opsi, i) => {
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
                className={`flex w-full items-center rounded-[6px] px-[10px] py-[8px] text-left text-[13px] hover:bg-[#f3f6fa] ${
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

  const [daftar, setDaftar] = useState<Barang[]>([]);
  const [kategoriApi, setKategoriApi] = useState<ApiKategori[]>([]);
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("");
  const [status, setStatus] = useState("");
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
        const [responsBarang, responsKategori] = await Promise.all([
          apiRequest<ApiResponse<ApiBarang[]>>("/barang"),
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
  }, []);

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
    lokasi !== "";

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

  const ubahFilter = (
    setter: (value: string) => void,
  ) => (value: string) => {
    setter(value);
    setHalaman(1);
  };

  const reset = () => {
    setCari("");
    setKategori("");
    setStatus("");
    setLokasi("");
    setHalaman(1);
  };

  return (
    <div className="relative flex size-full items-start bg-[#f3f6fa]">
      <Sidebar active="Master Barang" />

      <div className="relative flex min-h-[1040px] min-w-px flex-[1_0_0] flex-col items-start overflow-clip">
        <div className="flex h-[76px] w-full shrink-0 items-center justify-between overflow-clip whitespace-nowrap border-b border-solid border-[#dce4ee] bg-white px-[32px]">
          <p className="shrink-0 text-[16px] font-bold text-[#172b4d]">
            Sistem Persediaan Infrastruktur TIK
          </p>
          <p className="shrink-0 text-[12px] text-[#64748b]">
            {user?.nama} · {user?.role}
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col items-start gap-[24px] overflow-x-auto p-[32px]">
          <div className="flex w-full shrink-0 items-center justify-between gap-4">
            <div className="flex min-w-px flex-col items-start gap-[5px]">
              <p className="text-[26px] text-[#172b4d]">Master Barang</p>
              <p className="text-[14px] text-[#64748b]">
                Kelola data induk perangkat dan material infrastruktur TIK
              </p>
            </div>

            <button
              type="button"
              onClick={bukaFormBaru}
              className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-white hover:bg-[#0e4fab]"
            >
              <Plus size={16} />
              <span className="whitespace-nowrap text-[14px]">
                Tambah barang
              </span>
            </button>
          </div>

          <div className="flex w-full shrink-0 flex-wrap items-end gap-[10px]">
            <div className="flex h-[40px] w-[320px] max-w-full shrink-0 items-center gap-[8px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[12px] text-[#94a3b8] focus-within:border-[#1769e0]">
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
                className="min-w-px flex-[1_0_0] bg-transparent text-[14px] text-[#172b4d] outline-none placeholder:text-[#94a3b8]"
              />
              {cari && (
                <button
                  type="button"
                  aria-label="Hapus pencarian"
                  onClick={() => ubahFilter(setCari)("")}
                  className="flex shrink-0 items-center justify-center text-[#64748b]"
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
                className="h-[40px] shrink-0 whitespace-nowrap px-[6px] text-[13px] text-[#1769e0] hover:underline"
              >
                Reset filter
              </button>
            )}

            <div className="h-px min-w-px flex-[1_0_0]" />

            <button
              type="button"
              onClick={() => unduhCsv(hasil)}
              disabled={hasil.length === 0}
              title={`Unduh ${hasil.length} barang (CSV)`}
              className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] text-[#1769e0] hover:bg-[#f3f6fa] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              <span className="whitespace-nowrap text-[14px]">
                Unduh data
              </span>
            </button>
          </div>

          {error && (
            <div className="flex w-full flex-col gap-3 rounded-[8px] border border-[#fecaca] bg-[#fef2f2] p-4 text-[13px] text-[#b91c1c]">
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

          <div className="flex w-full shrink-0 items-start gap-[10px] overflow-x-auto">
            {ringkasan.map((r) => (
              <SummaryCard key={r.label} r={r} />
            ))}
          </div>

          <div className="relative flex w-full min-w-[900px] shrink-0 flex-col items-start rounded-[12px] border border-solid border-[#dce4ee] bg-white shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
            <div className="flex h-[42px] w-full shrink-0 items-center gap-[12px] border-b border-solid border-[#dce4ee] bg-[#f8fafc] px-[16px] text-[11px] uppercase text-[#64748b]">
              <p className="w-[105px] shrink-0">Kode</p>
              <p className="w-[225px] shrink-0">Nama barang</p>
              <p className="w-[140px] shrink-0">Kategori</p>
              <p className="w-[185px] shrink-0">Lokasi</p>
              <p className="w-[72px] shrink-0">Stok</p>
              <p className="w-[66px] shrink-0">Minimum</p>
              <p className="w-[90px] shrink-0">Status</p>
              <p className="min-w-px flex-[1_0_0] text-right">Aksi</p>
            </div>

            <div className="flex w-full shrink-0 flex-col items-start">
              {loading && (
                <div className="flex w-full items-center justify-center px-4 py-12 text-[14px] text-[#64748b]">
                  Memuat data barang dari server...
                </div>
              )}

              {!loading && !error && tampil.length === 0 && (
                <div className="flex w-full flex-col items-center gap-[8px] px-[16px] py-[48px] text-center">
                  <p className="text-[14px] text-[#172b4d]">
                    Tidak ada barang yang cocok
                  </p>
                  <p className="text-[12px] text-[#64748b]">
                    Coba kata kunci lain atau ubah filter yang dipilih.
                  </p>
                  {adaFilter && (
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-[4px] h-[36px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[14px] text-[13px] text-[#1769e0] hover:bg-[#f3f6fa]"
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
                      className="flex min-h-[66px] w-full shrink-0 items-center gap-[12px] border-b border-solid border-[#dce4ee] px-[16px] py-[10px]"
                    >
                      <p className="w-[105px] shrink-0 text-[11px] text-[#1769e0]">
                        {b.kode}
                      </p>

                      <div className="flex w-[225px] shrink-0 items-center gap-[10px]">
                        <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[6px] bg-[#eaf2ff]">
                          <Icon size={16} className="text-[#1769e0]" />
                        </div>
                        <p className="min-w-px flex-[1_0_0] text-[12px] leading-[1.35] text-[#172b4d]">
                          {b.nama}
                        </p>
                      </div>

                      <p className="w-[140px] shrink-0 text-[11px] text-[#64748b]">
                        {b.kategori}
                      </p>

                      <p className="w-[185px] shrink-0 text-[11px] leading-[1.4] text-[#64748b]">
                        {b.lokasi}
                      </p>

                      <p
                        className={`w-[72px] shrink-0 text-[12px] ${
                          menipis ? "text-[#c2413a]" : "text-[#172b4d]"
                        }`}
                      >
                        {b.stok} {b.satuan}
                      </p>

                      <p className="w-[66px] shrink-0 text-[11px] text-[#64748b]">
                        {b.minimum}
                      </p>

                      <div className="flex w-[90px] shrink-0 items-start">
                        <StockStatus menipis={menipis} />
                      </div>

                      <div className="flex min-w-px flex-[1_0_0] justify-end">
                        <button
                          type="button"
                          onClick={() => bukaDetail(b.kode)}
                          className="flex h-[32px] shrink-0 cursor-pointer items-center justify-center gap-[6px] rounded-[6px] border border-solid border-[#dce4ee] bg-white px-[10px] text-[12px] text-[#1769e0] hover:bg-[#eaf2ff]"
                        >
                          <Eye size={14} />
                          Detail
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex w-full shrink-0 flex-col items-start px-[16px] pb-[14px]">
              <div className="flex w-full shrink-0 items-center justify-between gap-3 pt-[14px]">
                <p className="whitespace-nowrap text-[12px] text-[#64748b]">
                  {loading
                    ? "Memuat data..."
                    : hasil.length === 0
                      ? "Menampilkan 0 barang"
                      : `Menampilkan ${mulai + 1}–${mulai + tampil.length} dari ${hasil.length} barang`}
                </p>

                <div className="flex shrink-0 items-start gap-[6px]">
                  <button
                    type="button"
                    aria-label="Halaman sebelumnya"
                    onClick={() => setHalaman(halamanAktif - 1)}
                    disabled={halamanAktif <= 1 || loading}
                    className="flex size-[32px] items-center justify-center rounded-[6px] border border-solid border-[#dce4ee] text-[#64748b] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: totalHalaman }, (_, i) => i + 1).map(
                    (n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setHalaman(n)}
                        aria-current={n === halamanAktif ? "page" : undefined}
                        disabled={loading}
                        className={`flex size-[32px] items-center justify-center rounded-[6px] ${
                          n === halamanAktif
                            ? "bg-[#1769e0]"
                            : "border border-solid border-[#dce4ee]"
                        }`}
                      >
                        <span
                          className={`text-[12px] ${
                            n === halamanAktif
                              ? "font-bold text-white"
                              : "text-[#172b4d]"
                          }`}
                        >
                          {n}
                        </span>
                      </button>
                    ),
                  )}

                  <button
                    type="button"
                    aria-label="Halaman berikutnya"
                    onClick={() => setHalaman(halamanAktif + 1)}
                    disabled={halamanAktif >= totalHalaman || loading}
                    className="flex size-[32px] items-center justify-center rounded-[6px] border border-solid border-[#dce4ee] text-[#64748b] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}