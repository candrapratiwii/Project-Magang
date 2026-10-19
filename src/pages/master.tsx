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
import Sidebar from "../Components/Sidebar";

/* ------------------------------ Data ------------------------------ */

interface Ringkasan {
  nilai: string;
  label: string;
  icon: LucideIcon;
  bg: string;
  color: string;
}

interface Barang {
  kode: string;
  nama: string;
  icon: LucideIcon;
  kategori: string;
  lokasi: string;
  stok: string;
  minimum: string;
  menipis?: boolean;
}

const barang: Barang[] = [
  { kode: "MAT-LAN-006", nama: "Kabel LAN Cat6 UTP 305m", icon: Cable, kategori: "Kabel & aksesori", lokasi: "Gudang Utama · Rak A-01", stok: "18 roll", minimum: "8" },
  { kode: "MAT-RJ45-006", nama: "Konektor RJ45 Cat6", icon: Plug, kategori: "Material jaringan", lokasi: "Gudang Utama · Bin A-12", stok: "28 pcs", minimum: "50", menipis: true },
  { kode: "NET-RTR-012", nama: "Router MikroTik RB4011", icon: Router, kategori: "Perangkat jaringan", lokasi: "Gudang Utama · Rak B-01", stok: "12 unit", minimum: "5" },
  { kode: "NET-SWI-024", nama: "Switch Managed 24 Port PoE", icon: Network, kategori: "Perangkat jaringan", lokasi: "Gudang Utama · Rak B-02", stok: "8 unit", minimum: "5" },
  { kode: "NET-AP-018", nama: "Access Point Wi-Fi 6", icon: Wifi, kategori: "Perangkat jaringan", lokasi: "Gudang Utama · Rak B-04", stok: "14 unit", minimum: "6" },
  { kode: "NET-SFP-001", nama: "SFP Module 1G Single Mode", icon: Network, kategori: "Perangkat jaringan", lokasi: "Gudang Utama · Rak B-03", stok: "4 unit", minimum: "10", menipis: true },
  { kode: "MAT-PC-001", nama: "Patch Cord Cat6 1m", icon: Cable, kategori: "Kabel & aksesori", lokasi: "Gudang Utama · Rak A-05", stok: "12 pcs", minimum: "20", menipis: true },
  { kode: "NET-FW-003", nama: "Firewall FortiGate 60F", icon: Server, kategori: "Perangkat jaringan", lokasi: "Gudang Cadangan · Rak C-02", stok: "3 unit", minimum: "4", menipis: true },
  { kode: "PND-UPS-005", nama: "UPS 1200VA", icon: Zap, kategori: "Perangkat pendukung", lokasi: "Gudang Aptika · Rak D-01", stok: "6 unit", minimum: "3" },
];

const ITEM_PER_HALAMAN = 5;

const KEY_TERPILIH = "simpera-barang-terpilih";
const KEY_TERSIMPAN = "simpera-barang-tersimpan";
const KEY_DIHAPUS = "simpera-barang-dihapus";

const gudangDari = (lokasi: string) => lokasi.split(" · ")[0];
const unik = (arr: string[]) => Array.from(new Set(arr)).sort();
const angkaStok = (stok: string) => parseInt(stok, 10) || 0;

const opsiStatus = ["Tersedia", "Menipis"];

const statusDari = (b: Barang) => (b.menipis ? "Menipis" : "Tersedia");

/* Buka halaman detail. Edit dan hapus dilakukan dari halaman detail. */
function bukaDetail(kode: string) {
  try {
    sessionStorage.setItem(KEY_TERPILIH, kode);
  } catch {
    /* abaikan */
  }
  window.location.hash = "detail";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Tombol "Tambah barang": buka form kosong (hapus kode terpilih dulu) */
function bukaFormBaru() {
  try {
    sessionStorage.removeItem(KEY_TERPILIH);
  } catch {
    /* abaikan */
  }
  window.location.hash = "form";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const ikonKategori: Record<string, LucideIcon> = {
  "Perangkat jaringan": Network,
  "Kabel & aksesori": Cable,
  "Material jaringan": Plug,
  "Perangkat pendukung": Zap,
};

function bacaJson<T>(key: string, awal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : awal;
  } catch {
    return awal;
  }
}

function gabungDataTersimpan(dasar: Barang[]): Barang[] {
  const tersimpan = bacaJson<Omit<Barang, "icon">[]>(KEY_TERSIMPAN, []);
  const dihapus = new Set(bacaJson<string[]>(KEY_DIHAPUS, []));
  const kode = new Set(tersimpan.map((b) => b.kode));
  return [
    ...dasar.filter((b) => !kode.has(b.kode)),
    ...tersimpan.map((b) => ({ ...b, icon: ikonKategori[b.kategori] ?? Boxes })),
  ].filter((b) => !dihapus.has(b.kode));
}

/* ------------------------------ Unduh CSV ------------------------------ */

function unduhCsv(rows: Barang[]) {
  const header = ["Kode", "Nama barang", "Kategori", "Lokasi", "Stok", "Minimum", "Status"];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const baris = [
    header,
    ...rows.map((b) => [b.kode, b.nama, b.kategori, b.lokasi, b.stok, b.minimum, statusDari(b)]),
  ]
    .map((r) => r.map(esc).join(";"))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + baris], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `master-barang-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* --------------------------- Komponen kecil --------------------------- */

function SummaryCard({ r }: { r: Ringkasan }) {
  const Icon = r.icon;
  return (
    <div className="relative flex min-w-px flex-[1_0_0] items-center gap-[11px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white p-[14px]">
      <div
        className="flex size-[34px] shrink-0 items-center justify-center overflow-clip rounded-[8px]"
        style={{ backgroundColor: r.bg }}
      >
        <div
          className="flex size-[16px] shrink-0 items-center justify-center"
          style={{ color: r.color }}
        >
          <Icon size={16} />
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-[2px] overflow-clip whitespace-nowrap font-normal not-italic leading-[normal]">
        <p className="shrink-0 text-[18px] text-[#172b4d]">{r.nilai}</p>
        <p className="shrink-0 text-[10px] text-[#64748b]">{r.label}</p>
      </div>
    </div>
  );
}

function StockStatus({ menipis }: { menipis?: boolean }) {
  const Icon = menipis ? CircleAlert : CircleCheck;
  return (
    <div
      className={`flex shrink-0 items-center gap-[5px] overflow-clip rounded-[999px] px-[9px] py-[5px] ${
        menipis ? "bg-[#fef0ef]" : "bg-[#eaf8ef]"
      }`}
    >
      <div
        className={`flex size-[12px] shrink-0 items-center justify-center ${
          menipis ? "text-[#c2413a]" : "text-[#15803d]"
        }`}
      >
        <Icon size={12} />
      </div>
      <p
        className={`shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal] ${
          menipis ? "text-[#c2413a]" : "text-[#15803d]"
        }`}
      >
        {menipis ? "Menipis" : "Tersedia"}
      </p>
    </div>
  );
}

/* Dropdown filter. value "" = semua */
function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [buka, setBuka] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buka) return;
    const klikLuar = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setBuka(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);
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
        className={`flex h-[40px] shrink-0 cursor-pointer items-center gap-[10px] overflow-clip rounded-[8px] border border-solid bg-white px-[12px] font-normal not-italic ${
          aktif ? "border-[#1769e0] bg-[#eaf2ff]" : "border-[#dce4ee]"
        }`}
      >
        <span
          className={`shrink-0 whitespace-nowrap text-[14px] leading-[normal] ${
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
          className="absolute left-0 top-[44px] z-20 min-w-full w-max rounded-[10px] border border-solid border-[#dce4ee] bg-white p-[6px] shadow-lg"
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
                  terpilih ? "bg-[#eaf2ff] text-[#1769e0]" : "text-[#172b4d]"
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

/* ------------------------------ Halaman ------------------------------ */

export default function MasterBarangScreen() {
  const { user } = useAuth();

  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("");
  const [status, setStatus] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [halaman, setHalaman] = useState(1);
  const [daftar] = useState<Barang[]>(() => gabungDataTersimpan(barang));

  const opsiKategori = useMemo(() => unik(daftar.map((b) => b.kategori)), [daftar]);
  const opsiLokasi = useMemo(() => unik(daftar.map((b) => gudangDari(b.lokasi))), [daftar]);

  /* Kritis = barang menipis dengan stok <= separuh minimum. */
  const ringkasan: Ringkasan[] = useMemo(() => {
    const total = daftar.length;
    const menipis = daftar.filter((b) => b.menipis).length;
    const kritis = daftar.filter(
      (b) => b.menipis && angkaStok(b.stok) <= Number(b.minimum) / 2,
    ).length;
    return [
      { nilai: String(total), label: "Total jenis", icon: Boxes, bg: "#eaf2ff", color: "#1769e0" },
      { nilai: String(total - menipis), label: "Stok tersedia", icon: PackageCheck, bg: "#eaf8ef", color: "#15803d" },
      { nilai: String(menipis), label: "Stok menipis", icon: TriangleAlert, bg: "#fff7e6", color: "#b45309" },
      { nilai: String(kritis), label: "Stok kritis", icon: CircleAlert, bg: "#fef0ef", color: "#c2413a" },
    ];
  }, [daftar]);

  const adaFilter = cari.trim() !== "" || kategori !== "" || status !== "" || lokasi !== "";

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return daftar.filter(
      (b) =>
        (q === "" || b.kode.toLowerCase().includes(q) || b.nama.toLowerCase().includes(q)) &&
        (kategori === "" || b.kategori === kategori) &&
        (status === "" || statusDari(b) === status) &&
        (lokasi === "" || gudangDari(b.lokasi) === lokasi)
    );
  }, [daftar, cari, kategori, status, lokasi]);

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / ITEM_PER_HALAMAN));
  const halamanAktif = Math.min(halaman, totalHalaman);
  const mulai = (halamanAktif - 1) * ITEM_PER_HALAMAN;
  const tampil = hasil.slice(mulai, mulai + ITEM_PER_HALAMAN);

  const ubah = (setter: (v: string) => void) => (v: string) => {
    setter(v);
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
                Master Barang
              </p>
              <p className="w-full shrink-0 text-[14px] text-[#64748b]">
                Kelola data induk perangkat dan material infrastruktur TIK
              </p>
            </div>
            <button
              type="button"
              onClick={bukaFormBaru}
              className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-white hover:bg-[#0e4fab]"
            >
              <Plus size={16} className="shrink-0" />
              <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                Tambah barang
              </span>
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex w-full shrink-0 items-end gap-[10px]">
            <div className="flex h-[40px] w-[320px] shrink-0 items-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[12px] font-normal not-italic text-[#94a3b8] focus-within:border-[#1769e0]">
              <Search size={16} className="shrink-0" />
              <input
                type="text"
                value={cari}
                onChange={(e) => ubah(setCari)(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && ubah(setCari)("")}
                placeholder="Cari kode atau nama barang..."
                aria-label="Cari kode atau nama barang"
                className="min-w-px flex-[1_0_0] bg-transparent text-[14px] leading-[normal] text-[#172b4d] outline-none placeholder:text-[#94a3b8]"
              />
              {cari && (
                <button
                  type="button"
                  aria-label="Hapus pencarian"
                  onClick={() => ubah(setCari)("")}
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
              onChange={ubah(setKategori)}
            />
            <FilterSelect
              label="Semua status"
              value={status}
              options={opsiStatus}
              onChange={ubah(setStatus)}
            />
            <FilterSelect
              label="Semua lokasi"
              value={lokasi}
              options={opsiLokasi}
              onChange={ubah(setLokasi)}
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
              className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] font-normal not-italic text-[#1769e0] hover:bg-[#f3f6fa] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} className="shrink-0" />
              <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                Unduh data
              </span>
            </button>
          </div>

          {/* Inventory summary */}
          <div className="flex w-full shrink-0 items-start gap-[10px] overflow-clip">
            {ringkasan.map((r) => (
              <SummaryCard key={r.label} r={r} />
            ))}
          </div>

          {/* Inventory table */}
          <div className="relative flex w-full shrink-0 flex-col items-start rounded-[12px] border border-solid border-[#dce4ee] bg-white drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
            <div className="flex h-[42px] w-full shrink-0 items-center gap-[12px] border-b border-solid border-[#dce4ee] bg-[#f8fafc] px-[16px] text-[11px] font-normal uppercase not-italic leading-[normal] text-[#64748b]">
              <p className="w-[105px] shrink-0">Kode</p>
              <p className="w-[225px] shrink-0">Nama barang</p>
              <p className="w-[140px] shrink-0">Kategori</p>
              <p className="w-[185px] shrink-0">Lokasi</p>
              <p className="w-[72px] shrink-0">Stok</p>
              <p className="w-[66px] shrink-0">Minimum</p>
              <p className="w-[90px] shrink-0">Status</p>
              <p className="min-w-px flex-[1_0_0] text-right">Aksi</p>
            </div>

            <div className="flex w-full shrink-0 flex-col items-start overflow-clip">
              {tampil.length === 0 && (
                <div className="flex w-full flex-col items-center gap-[8px] px-[16px] py-[48px] text-center font-normal not-italic">
                  <p className="text-[14px] text-[#172b4d]">
                    Tidak ada barang yang cocok
                  </p>
                  <p className="text-[12px] text-[#64748b]">
                    Coba kata kunci lain atau ubah filter yang dipilih.
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-[4px] h-[36px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[14px] text-[13px] text-[#1769e0] hover:bg-[#f3f6fa]"
                  >
                    Reset filter
                  </button>
                </div>
              )}

              {tampil.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.kode}
                    className="flex min-h-[66px] w-full shrink-0 items-center gap-[12px] overflow-clip border-b border-solid border-[#dce4ee] px-[16px] py-[10px]"
                  >
                    <p className="w-[105px] shrink-0 text-[11px] font-normal not-italic leading-[normal] text-[#1769e0]">
                      {b.kode}
                    </p>
                    <div className="flex w-[225px] shrink-0 items-center gap-[10px] overflow-clip">
                      <div className="flex size-[34px] shrink-0 items-center justify-center overflow-clip rounded-[6px] bg-[#eaf2ff]">
                        <div className="flex size-[16px] shrink-0 items-center justify-center text-[#1769e0]">
                          <Icon size={16} />
                        </div>
                      </div>
                      <p className="min-w-px flex-[1_0_0] text-[12px] font-normal not-italic leading-[1.35] text-[#172b4d]">
                        {b.nama}
                      </p>
                    </div>
                    <p className="w-[140px] shrink-0 text-[11px] font-normal not-italic leading-[normal] text-[#64748b]">
                      {b.kategori}
                    </p>
                    <p className="w-[185px] shrink-0 text-[11px] font-normal not-italic leading-[1.4] text-[#64748b]">
                      {b.lokasi}
                    </p>
                    <p
                      className={`w-[72px] shrink-0 text-[12px] font-normal not-italic leading-[normal] ${
                        b.menipis ? "text-[#c2413a]" : "text-[#172b4d]"
                      }`}
                    >
                      {b.stok}
                    </p>
                    <p className="w-[66px] shrink-0 text-[11px] font-normal not-italic leading-[normal] text-[#64748b]">
                      {b.minimum}
                    </p>
                    <div className="flex w-[90px] shrink-0 items-start overflow-clip">
                      <StockStatus menipis={b.menipis} />
                    </div>
                    <div className="flex min-w-px flex-[1_0_0] items-start justify-end overflow-clip">
                      <button
                        type="button"
                        onClick={() => bukaDetail(b.kode)}
                        className="flex h-[32px] shrink-0 cursor-pointer items-center justify-center gap-[6px] rounded-[6px] border border-solid border-[#dce4ee] bg-white px-[10px] text-[12px] font-normal not-italic text-[#1769e0] hover:bg-[#eaf2ff]"
                      >
                        <Eye size={14} />
                        Detail
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex w-full shrink-0 flex-col items-start overflow-clip px-[16px] pb-[14px]">
              <div className="flex w-full shrink-0 items-center justify-between overflow-clip pt-[14px]">
                <p className="shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal] text-[#64748b]">
                  {hasil.length === 0
                    ? "Menampilkan 0 barang"
                    : `Menampilkan ${mulai + 1}–${mulai + tampil.length} dari ${hasil.length} barang`}
                </p>
                <div className="flex shrink-0 items-start gap-[6px] overflow-clip">
                  <button
                    type="button"
                    aria-label="Halaman sebelumnya"
                    onClick={() => setHalaman(halamanAktif - 1)}
                    disabled={halamanAktif <= 1}
                    className="flex size-[32px] shrink-0 items-center justify-center overflow-clip rounded-[6px] border border-solid border-[#dce4ee] text-[#64748b] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setHalaman(n)}
                      aria-current={n === halamanAktif ? "page" : undefined}
                      className={`flex size-[32px] shrink-0 items-center justify-center overflow-clip rounded-[6px] ${
                        n === halamanAktif
                          ? "bg-[#1769e0]"
                          : "border border-solid border-[#dce4ee]"
                      }`}
                    >
                      <span
                        className={`shrink-0 whitespace-nowrap text-[12px] not-italic leading-[normal] ${
                          n === halamanAktif
                            ? "font-bold text-white"
                            : "font-normal text-[#172b4d]"
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
                    disabled={halamanAktif >= totalHalaman}
                    className="flex size-[32px] shrink-0 items-center justify-center overflow-clip rounded-[6px] border border-solid border-[#dce4ee] text-[#64748b] disabled:cursor-not-allowed disabled:opacity-40"
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