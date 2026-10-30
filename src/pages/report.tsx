import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  PackagePlus,
  PackageMinus,
  Receipt,
  ArrowDownToLine,
  ArrowUpFromLine,
  Filter as FilterIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  FileSpreadsheet,
  FileText,
  Columns3,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { useAuth } from "../auth";
import { apiRequest } from "../api";

type Jenis = "Masuk" | "Keluar";

interface Transaksi {
  id: number;
  tanggal: string;
  jam: string;
  nomor: string;
  jenis: Jenis;
  barang: string;
  kategori: string;
  jumlah: number;
  satuan: string;
  asalTujuan: string;
  petugas: string;
}

interface ApiMutasi {
  id: number;
  barang_id?: number;
  user_id?: number;
  jenis_mutasi?: string;
  jumlah?: number | string;
  stok_sebelum?: number;
  stok_sesudah?: number;
  keterangan?: string | null;
  created_at?: string;
  updated_at?: string;
  nomor?: string;
  barang?: {
    id?: number;
    kode_barang?: string;
    nama_barang?: string;
    satuan?: string;
    kategori?: string;
    lokasi?: string;
    aktif?: boolean | number | null;
    kategori_barang?: {
      nama_kategori?: string;
    } | null;
    kategoriBarang?: {
      nama_kategori?: string;
    } | null;
  } | null;
  user?: {
    name?: string;
    nama?: string;
  } | null;
}

interface FilterLaporan {
  mulai: string;
  akhir: string;
  jenis: string;
  kategori: string;
}

type KolomKey =
  | "tanggal"
  | "nomor"
  | "jenis"
  | "barang"
  | "kategori"
  | "jumlah"
  | "asalTujuan"
  | "petugas";

interface KolomDef {
  key: KolomKey;
  label: string;
  bawaan: boolean;
}

interface Ringkasan {
  nilai: string;
  label: string;
  icon: LucideIcon;
  bg: string;
  color: string;
}

const hariIni = new Date().toLocaleDateString("en-CA", {
  timeZone: "Asia/Makassar",
});

const tanggalAwal = `${hariIni.slice(0, 7)}-01`;

const FILTER_BAWAAN: FilterLaporan = {
  mulai: tanggalAwal,
  akhir: hariIni,
  jenis: "Semua transaksi",
  kategori: "Semua kategori",
};

const opsiJenis = [
  "Semua transaksi",
  "Barang masuk",
  "Barang keluar",
];

const kolomDef: KolomDef[] = [
  { key: "tanggal", label: "Tanggal", bawaan: true },
  { key: "nomor", label: "Nomor", bawaan: true },
  { key: "jenis", label: "Jenis", bawaan: true },
  { key: "barang", label: "Barang", bawaan: true },
  { key: "kategori", label: "Kategori", bawaan: false },
  { key: "jumlah", label: "Jumlah", bawaan: true },
  { key: "asalTujuan", label: "Keterangan", bawaan: true },
  { key: "petugas", label: "Petugas", bawaan: true },
];

const KOLOM_KEY = "simpera-laporan-kolom";
const PER_HALAMAN = 10;

const warnaKategori = [
  "#1769e0",
  "#0891b2",
  "#7c3aed",
  "#15803d",
  "#b45309",
];

const jenisStyle: Record<
  Jenis,
  { bg: string; text: string; icon: LucideIcon }
> = {
  Masuk: {
    bg: "#eaf8ef",
    text: "#15803d",
    icon: ArrowDownToLine,
  },
  Keluar: {
    bg: "#f2ecff",
    text: "#7c3aed",
    icon: ArrowUpFromLine,
  },
};

const inputCls =
  "mt-1 h-10 w-full min-w-0 rounded-lg border border-[#dce4ee] bg-white px-3 text-sm text-[#172b4d] outline-none focus:border-[#1769e0]";

const tgl = (iso: string) => {
  if (!iso) return "-";

  const [y, m, d] = iso.slice(0, 10).split("-");
  const bulan = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];

  return `${Number(d)} ${bulan[Number(m) - 1]} ${y}`;
};

const formatAngka = (n: number) => n.toLocaleString("id-ID");

function formatWaktu(value?: string) {
  if (!value) return { tanggal: "", jam: "" };

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { tanggal: value.slice(0, 10), jam: "" };
  }

  const tanggal = date.toLocaleDateString("en-CA", {
    timeZone: "Asia/Makassar",
  });

  const jam = date.toLocaleTimeString("id-ID", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return { tanggal, jam };
}

function tanggalTambah(iso: string, jumlah: number) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + jumlah);
  return date.toISOString().slice(0, 10);
}

function selisihHari(a: string, b: string) {
  return Math.round(
    (Date.parse(`${b}T00:00:00Z`) -
      Date.parse(`${a}T00:00:00Z`)) /
      86400000,
  );
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function kolomBawaan(): Record<KolomKey, boolean> {
  return Object.fromEntries(
    kolomDef.map((item) => [item.key, item.bawaan]),
  ) as Record<KolomKey, boolean>;
}

function bacaKolom(): Record<KolomKey, boolean> {
  try {
    const raw = localStorage.getItem(KOLOM_KEY);

    if (raw) {
      const gabungan = {
        ...kolomBawaan(),
        ...(JSON.parse(raw) as Partial<Record<KolomKey, boolean>>),
      };

      if (Object.values(gabungan).some(Boolean)) return gabungan;
    }
  } catch {
    // Gunakan konfigurasi kolom bawaan jika penyimpanan gagal.
  }

  return kolomBawaan();
}

function normalisasiMutasi(item: ApiMutasi): Transaksi {
  const waktu = formatWaktu(item.created_at || item.updated_at);
  const jenisAsli = String(item.jenis_mutasi || "").toLowerCase();

  const jenis: Jenis =
    jenisAsli === "masuk" || jenisAsli === "barang masuk"
      ? "Masuk"
      : "Keluar";

  // Barang nonaktif ditampilkan sebagai barang diarsipkan.
  // Nilai aktif dapat berupa boolean atau angka dari API.
  const barangDiarsipkan =
    item.barang?.aktif === false ||
    item.barang?.aktif === 0;

  const namaBarang = barangDiarsipkan
    ? "Barang diarsipkan"
    : item.barang?.nama_barang || "Barang tidak diketahui";

  const nomor =
    item.nomor ||
    `${jenis === "Masuk" ? "BM" : "BK"}-${String(item.id).padStart(4, "0")}`;

  const kategoriRelasi =
    item.barang?.kategori_barang ||
    item.barang?.kategoriBarang;

  return {
    id: item.id,
    tanggal: waktu.tanggal,
    jam: waktu.jam,
    nomor,
    jenis,
    barang: namaBarang,
    kategori: barangDiarsipkan
      ? "Barang diarsipkan"
      : kategoriRelasi?.nama_kategori ||
        item.barang?.kategori ||
        "Tidak diketahui",
    jumlah: Number(item.jumlah || 0),
    satuan: item.barang?.satuan || "unit",
    asalTujuan: item.keterangan || "-",
    petugas: item.user?.name || item.user?.nama || "Tidak diketahui",
  };
}

function JenisBadge({ jenis }: { jenis: Jenis }) {
  const style = jenisStyle[jenis];
  const Icon = style.icon;

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <Icon size={12} />
      {jenis}
    </span>
  );
}

function KartuRingkasan({ item }: { item: Ringkasan }) {
  const Icon = item.icon;

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#dce4ee] bg-white p-4">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: item.bg, color: item.color }}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="break-words text-xl font-semibold text-[#172b4d]">
          {item.nilai}
        </p>
        <p className="text-xs text-[#64748b]">{item.label}</p>
      </div>
    </div>
  );
}

export default function LaporanPersediaanScreen() {
  const { user } = useAuth();

  const [draf, setDraf] = useState<FilterLaporan>(FILTER_BAWAAN);
  const [terapan, setTerapan] = useState<FilterLaporan>(FILTER_BAWAAN);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errFilter, setErrFilter] = useState("");
  const [halaman, setHalaman] = useState(1);
  const [kolom, setKolom] = useState<Record<KolomKey, boolean>>(bacaKolom);
  const [menuKolom, setMenuKolom] = useState(false);
  const [toast, setToast] = useState("");
  const [pencarian, setPencarian] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const ambilTransaksi = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<{
        data?: ApiMutasi[] | { data?: ApiMutasi[] };
      }>("/mutasi-stok");

      const payload = response?.data;
      let daftar: ApiMutasi[] = [];

      if (Array.isArray(payload)) {
        daftar = payload;
      } else if (payload && Array.isArray(payload.data)) {
        daftar = payload.data;
      }

      setTransaksi(daftar.map(normalisasiMutasi));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data transaksi dari server.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void ambilTransaksi();
  }, [ambilTransaksi]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!menuKolom) return;

    const klikLuar = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuKolom(false);
      }
    };

    const tombolEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuKolom(false);
    };

    document.addEventListener("mousedown", klikLuar);
    document.addEventListener("keydown", tombolEscape);

    return () => {
      document.removeEventListener("mousedown", klikLuar);
      document.removeEventListener("keydown", tombolEscape);
    };
  }, [menuKolom]);

  const kategoriTersedia = useMemo(
    () =>
      Array.from(
        new Set(
          transaksi
            .map((item) => item.kategori)
            .filter(
              (kategori) =>
                kategori && kategori !== "Tidak diketahui",
            ),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [transaksi],
  );

  const terapkanFilter = () => {
    if (!draf.mulai || !draf.akhir) {
      setErrFilter("Tanggal mulai dan akhir wajib diisi.");
      return;
    }

    if (draf.akhir < draf.mulai) {
      setErrFilter("Tanggal akhir tidak boleh sebelum tanggal mulai.");
      return;
    }

    setErrFilter("");
    setTerapan({ ...draf });
    setHalaman(1);
  };

  const aturUlang = () => {
    setDraf(FILTER_BAWAAN);
    setTerapan(FILTER_BAWAAN);
    setErrFilter("");
    setPencarian("");
    setHalaman(1);
  };

  const hasil = useMemo(() => {
    const q = pencarian.trim().toLowerCase();

    return transaksi
      .filter(
        (item) =>
          item.tanggal >= terapan.mulai &&
          item.tanggal <= terapan.akhir &&
          (terapan.jenis === "Semua transaksi" ||
            (terapan.jenis === "Barang masuk"
              ? item.jenis === "Masuk"
              : item.jenis === "Keluar")) &&
          (terapan.kategori === "Semua kategori" ||
            item.kategori === terapan.kategori) &&
          (!q ||
            item.barang.toLowerCase().includes(q) ||
            item.nomor.toLowerCase().includes(q) ||
            item.petugas.toLowerCase().includes(q) ||
            item.asalTujuan.toLowerCase().includes(q)),
      )
      .sort((a, b) =>
        (b.tanggal + b.jam).localeCompare(a.tanggal + a.jam),
      );
  }, [transaksi, terapan, pencarian]);

  const totalMasuk = hasil
    .filter((item) => item.jenis === "Masuk")
    .reduce((sum, item) => sum + item.jumlah, 0);

  const totalKeluar = hasil
    .filter((item) => item.jenis === "Keluar")
    .reduce((sum, item) => sum + item.jumlah, 0);

  const ringkasan: Ringkasan[] = [
    {
      nilai: formatAngka(totalMasuk + totalKeluar),
      label: "Total pergerakan",
      icon: ArrowLeftRight,
      bg: "#eaf2ff",
      color: "#1769e0",
    },
    {
      nilai: formatAngka(totalMasuk),
      label: "Barang masuk",
      icon: PackagePlus,
      bg: "#eaf8ef",
      color: "#15803d",
    },
    {
      nilai: formatAngka(totalKeluar),
      label: "Barang keluar",
      icon: PackageMinus,
      bg: "#f2ecff",
      color: "#7c3aed",
    },
    {
      nilai: formatAngka(hasil.length),
      label: "Total transaksi",
      icon: Receipt,
      bg: "#e6f7fa",
      color: "#0891b2",
    },
  ];

  const jumlahHari = Math.max(
    1,
    selisihHari(terapan.mulai, terapan.akhir) + 1,
  );
  const rentangHari = Math.min(jumlahHari, 31);
  const awalGrafik =
    jumlahHari > 31
      ? tanggalTambah(terapan.akhir, -30)
      : terapan.mulai;

  const harian = Array.from({ length: rentangHari }, (_, index) => {
    const hari = tanggalTambah(awalGrafik, index);
    const dataHari = hasil.filter((item) => item.tanggal === hari);

    return {
      hari,
      masuk: dataHari
        .filter((item) => item.jenis === "Masuk")
        .reduce((sum, item) => sum + item.jumlah, 0),
      keluar: dataHari
        .filter((item) => item.jenis === "Keluar")
        .reduce((sum, item) => sum + item.jumlah, 0),
    };
  });

  const maksHarian = Math.max(
    1,
    ...harian.map((item) => Math.max(item.masuk, item.keluar)),
  );

  const barangAktif = useMemo(() => {
    const peta = new Map<string, { jumlah: number; satuan: string }>();

    hasil.forEach((item) => {
      const saatIni = peta.get(item.barang) || {
        jumlah: 0,
        satuan: item.satuan,
      };

      peta.set(item.barang, {
        jumlah: saatIni.jumlah + item.jumlah,
        satuan: item.satuan,
      });
    });

    return Array.from(peta.entries())
      .map(([nama, value]) => ({ nama, ...value }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 5);
  }, [hasil]);

  const kolomTampil = kolomDef.filter((item) => kolom[item.key]);
  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
  const halamanAktif = Math.min(halaman, totalHalaman);

  const tampil = hasil.slice(
    (halamanAktif - 1) * PER_HALAMAN,
    halamanAktif * PER_HALAMAN,
  );

  const ubahKolom = (key: KolomKey) => {
    const baru = { ...kolom, [key]: !kolom[key] };

    if (!Object.values(baru).some(Boolean)) return;

    setKolom(baru);

    try {
      localStorage.setItem(KOLOM_KEY, JSON.stringify(baru));
    } catch {
      // Preferensi kolom tetap berlaku selama halaman terbuka.
    }
  };

  const teksSel = (key: KolomKey, item: Transaksi): string => {
    switch (key) {
      case "tanggal":
        return `${tgl(item.tanggal)}${item.jam ? ` · ${item.jam}` : ""}`;
      case "nomor":
        return item.nomor;
      case "jenis":
        return item.jenis;
      case "barang":
        return item.barang;
      case "kategori":
        return item.kategori;
      case "jumlah":
        return `${formatAngka(item.jumlah)} ${item.satuan}`;
      case "asalTujuan":
        return item.asalTujuan;
      case "petugas":
        return item.petugas;
    }
  };

  const infoFilter = [
    ["Periode", `${tgl(terapan.mulai)} – ${tgl(terapan.akhir)}`],
    ["Jenis transaksi", terapan.jenis],
    ["Kategori barang", terapan.kategori],
  ];

  const exportExcel = () => {
    if (!hasil.length) return;

    const header = kolomTampil.map((item) => item.label);
    const rows = hasil.map((item) =>
      kolomTampil.map((column) => teksSel(column.key, item)),
    );

    const html = `
      <html>
      <head><meta charset="utf-8"></head>
      <body>
        <h2>Laporan Persediaan SIMPERA-NET</h2>
        <p>${infoFilter
          .map(([label, value]) => `${escapeHtml(label)}: ${escapeHtml(value)}`)
          .join(" | ")}</p>
        <p>Total transaksi: ${hasil.length}</p>
        <table border="1">
          <thead><tr>${header
            .map((value) => `<th>${escapeHtml(value)}</th>`)
            .join("")}</tr></thead>
          <tbody>${rows
            .map(
              (row) =>
                `<tr>${row
                  .map((value) => `<td>${escapeHtml(value)}</td>`)
                  .join("")}</tr>`,
            )
            .join("")}</tbody>
        </table>
      </body>
      </html>`;

    const blob = new Blob(["\ufeff", html], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-persediaan-${terapan.mulai}-${terapan.akhir}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setToast("Laporan Excel berhasil diunduh.");
  };

  const exportPdf = () => {
    if (!hasil.length) return;

    const html = `
      <!doctype html>
      <html lang="id">
      <head>
        <meta charset="utf-8">
        <title>Laporan Persediaan SIMPERA-NET</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { font-family: Arial, sans-serif; color: #172b4d; font-size: 10px; }
          h1 { font-size: 18px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; }
          th { background: #eaf2ff; }
          tr { page-break-inside: avoid; }
        </style>
      </head>
      <body>
        <h1>Laporan Persediaan SIMPERA-NET</h1>
        <p>${infoFilter
          .map(([label, value]) => `${escapeHtml(label)}: ${escapeHtml(value)}`)
          .join(" | ")}</p>
        <p>
          Total pergerakan: ${formatAngka(totalMasuk + totalKeluar)} |
          Barang masuk: ${formatAngka(totalMasuk)} |
          Barang keluar: ${formatAngka(totalKeluar)} |
          Transaksi: ${hasil.length}
        </p>
        <table>
          <thead><tr>${kolomTampil
            .map((item) => `<th>${escapeHtml(item.label)}</th>`)
            .join("")}</tr></thead>
          <tbody>${hasil
            .map(
              (item) =>
                `<tr>${kolomTampil
                  .map(
                    (column) =>
                      `<td>${escapeHtml(teksSel(column.key, item))}</td>`,
                  )
                  .join("")}</tr>`,
            )
            .join("")}</tbody>
        </table>
      </body>
      </html>`;

    const frame = document.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    frame.style.right = "0";
    frame.style.bottom = "0";
    document.body.appendChild(frame);

    const doc = frame.contentDocument;
    const win = frame.contentWindow;

    if (!doc || !win) {
      frame.remove();
      setToast("Browser tidak dapat membuka cetak PDF.");
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    win.addEventListener("afterprint", () => frame.remove(), { once: true });

    window.setTimeout(() => {
      win.focus();
      win.print();
      window.setTimeout(() => frame.remove(), 120000);
    }, 300);
  };

  return (
    <div className="relative flex min-h-screen w-full min-w-0 items-start bg-[#f3f6fa]">
      <Sidebar active="Laporan" />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex min-h-[76px] w-full flex-wrap items-center justify-between gap-3 border-b border-[#dce4ee] bg-white px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-[#172b4d] sm:text-base">
            Sistem Persediaan Infrastruktur TIK
          </p>
          <p className="text-xs text-[#64748b]">
            {user?.nama} · {user?.role}
          </p>
        </header>

        <div className="flex w-full min-w-0 flex-col gap-5 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[#172b4d]">
                Laporan Persediaan
              </h1>
              <p className="mt-1 text-sm text-[#64748b]">
                Tinjau, saring, dan ekspor data transaksi persediaan.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportExcel}
                disabled={!hasil.length}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dce4ee] bg-white px-3 text-sm text-[#1769e0] hover:bg-[#f3f6fa] disabled:opacity-50 sm:px-4"
              >
                <FileSpreadsheet size={16} />
                Excel
              </button>
              <button
                type="button"
                onClick={exportPdf}
                disabled={!hasil.length}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1769e0] px-3 text-sm text-white hover:bg-[#0e4fab] disabled:opacity-50 sm:px-4"
              >
                <FileText size={16} />
                Cetak PDF
              </button>
            </div>
          </div>

          <section className="rounded-xl border border-[#dce4ee] bg-white p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FilterIcon size={18} className="text-[#1769e0]" />
                <h2 className="text-sm font-semibold text-[#172b4d]">
                  Filter laporan
                </h2>
              </div>
              <button
                type="button"
                onClick={aturUlang}
                className="text-xs text-[#1769e0] hover:underline"
              >
                Atur ulang
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <label className="min-w-0 text-xs text-[#172b4d]">
                Tanggal mulai
                <input
                  type="date"
                  value={draf.mulai}
                  onChange={(event) =>
                    setDraf((old) => ({ ...old, mulai: event.target.value }))
                  }
                  className={inputCls}
                />
              </label>

              <label className="min-w-0 text-xs text-[#172b4d]">
                Tanggal akhir
                <input
                  type="date"
                  value={draf.akhir}
                  onChange={(event) =>
                    setDraf((old) => ({ ...old, akhir: event.target.value }))
                  }
                  className={inputCls}
                />
              </label>

              <label className="min-w-0 text-xs text-[#172b4d]">
                Jenis transaksi
                <select
                  value={draf.jenis}
                  onChange={(event) =>
                    setDraf((old) => ({ ...old, jenis: event.target.value }))
                  }
                  className={inputCls}
                >
                  {opsiJenis.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="min-w-0 text-xs text-[#172b4d]">
                Kategori barang
                <select
                  value={draf.kategori}
                  onChange={(event) =>
                    setDraf((old) => ({
                      ...old,
                      kategori: event.target.value,
                    }))
                  }
                  className={inputCls}
                >
                  <option>Semua kategori</option>
                  {kategoriTersedia.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={terapkanFilter}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#1769e0] px-4 text-sm text-white hover:bg-[#0e4fab]"
                >
                  <Search size={16} />
                  Terapkan
                </button>
              </div>
            </div>

            {errFilter && (
              <p role="alert" className="mt-3 text-xs text-[#c2413a]">
                {errFilter}
              </p>
            )}
          </section>

          {loading && (
            <div className="flex items-center gap-2 rounded-lg bg-white p-4 text-sm text-[#64748b]">
              <RefreshCw size={16} className="animate-spin" />
              Mengambil transaksi dari backend...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-[#f3c6c2] bg-[#fef0ef] p-4 text-sm text-[#c2413a]">
              <p className="font-semibold">Laporan gagal dimuat.</p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                onClick={() => void ambilTransaksi()}
                className="mt-3 rounded-md border border-[#f3c6c2] bg-white px-3 py-2"
              >
                Coba lagi
              </button>
            </div>
          )}

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {ringkasan.map((item) => (
              <KartuRingkasan key={item.label} item={item} />
            ))}
          </section>

          <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
            <div className="min-w-0 rounded-xl border border-[#dce4ee] bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-[#172b4d]">
                    Pergerakan harian
                  </h2>
                  <p className="mt-1 text-xs text-[#64748b]">
                    {tgl(terapan.mulai)} – {tgl(terapan.akhir)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#15803d]" />
                    Masuk
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#7c3aed]" />
                    Keluar
                  </span>
                </div>
              </div>

              {hasil.length === 0 ? (
                <p className="py-12 text-center text-xs text-[#94a3b8]">
                  Tidak ada transaksi pada periode ini.
                </p>
              ) : (
                <div className="mt-5 flex h-36 min-w-0 items-end gap-1 overflow-x-auto border-b border-[#e2e8f0] pb-2">
                  {harian.map((item) => (
                    <div
                      key={item.hari}
                      className="flex min-w-[20px] flex-1 flex-col items-center justify-end gap-1"
                      title={`${tgl(item.hari)} · Masuk ${item.masuk} · Keluar ${item.keluar}`}
                    >
                      <div className="flex h-28 w-full items-end justify-center gap-[2px]">
                        <div
                          className="w-2 rounded-t bg-[#15803d] sm:w-3"
                          style={{
                            height: `${(item.masuk / maksHarian) * 100}%`,
                            minHeight: item.masuk ? 3 : 0,
                          }}
                        />
                        <div
                          className="w-2 rounded-t bg-[#7c3aed] sm:w-3"
                          style={{
                            height: `${(item.keluar / maksHarian) * 100}%`,
                            minHeight: item.keluar ? 3 : 0,
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-[#64748b]">
                        {Number(item.hari.slice(-2)) % 2 === 1 ||
                        harian.length <= 10
                          ? item.hari.slice(-2)
                          : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="min-w-0 rounded-xl border border-[#dce4ee] bg-white p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-[#172b4d]">
                Barang paling aktif
              </h2>
              <p className="mt-1 text-xs text-[#64748b]">
                Berdasarkan jumlah pergerakan pada filter aktif.
              </p>

              {barangAktif.length ? (
                <div className="mt-4 flex flex-col gap-4">
                  {barangAktif.map((item, index) => {
                    const maksimum = Math.max(
                      ...barangAktif.map((barang) => barang.jumlah),
                      1,
                    );

                    return (
                      <div key={item.nama} className="min-w-0">
                        <div className="mb-1 flex items-start justify-between gap-3">
                          <p className="min-w-0 break-words text-xs text-[#172b4d]">
                            <span className="mr-2 text-[#94a3b8]">
                              {index + 1}.
                            </span>
                            {item.nama}
                          </p>
                          <span className="shrink-0 text-xs font-semibold text-[#1769e0]">
                            {formatAngka(item.jumlah)} {item.satuan}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#f1f5f9]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(item.jumlah / maksimum) * 100}%`,
                              backgroundColor:
                                warnaKategori[index % warnaKategori.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-[#94a3b8]">
                  Belum ada data pada filter ini.
                </p>
              )}
            </div>
          </section>

          <section className="min-w-0 rounded-xl border border-[#dce4ee] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce4ee] p-4 sm:p-5">
              <div>
                <h2 className="text-sm font-semibold text-[#172b4d]">
                  Detail transaksi
                </h2>
                <p className="mt-1 text-xs text-[#64748b]">
                  {formatAngka(hasil.length)} transaksi sesuai filter
                </p>
              </div>

              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuKolom((value) => !value)}
                  aria-expanded={menuKolom}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dce4ee] px-3 text-xs text-[#64748b] hover:bg-[#f8fafc]"
                >
                  <Columns3 size={15} />
                  Atur kolom
                </button>

                {menuKolom && (
                  <div className="absolute right-0 top-11 z-20 w-52 rounded-lg border border-[#dce4ee] bg-white p-2 shadow-lg">
                    {kolomDef.map((item) => {
                      const aktif = kolom[item.key];
                      const terakhir = aktif && kolomTampil.length === 1;

                      return (
                        <label
                          key={item.key}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-xs text-[#172b4d] hover:bg-[#f3f6fa]"
                        >
                          <input
                            type="checkbox"
                            checked={aktif}
                            disabled={terakhir}
                            onChange={() => ubahKolom(item.key)}
                            className="accent-[#1769e0]"
                          />
                          {item.label}
                        </label>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        const defaults = kolomBawaan();
                        setKolom(defaults);
                        try {
                          localStorage.setItem(
                            KOLOM_KEY,
                            JSON.stringify(defaults),
                          );
                        } catch {
                          // Tidak mengganggu tampilan jika storage gagal.
                        }
                      }}
                      className="mt-1 w-full rounded-md px-2 py-2 text-left text-xs text-[#1769e0] hover:bg-[#f3f6fa]"
                    >
                      Pulihkan kolom bawaan
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="border-b border-[#dce4ee] p-4">
              <label className="flex h-10 max-w-lg items-center gap-2 rounded-lg border border-[#dce4ee] px-3 text-[#94a3b8] focus-within:border-[#1769e0]">
                <Search size={15} />
                <input
                  value={pencarian}
                  onChange={(event) => {
                    setPencarian(event.target.value);
                    setHalaman(1);
                  }}
                  placeholder="Cari barang, nomor, petugas, atau keterangan..."
                  className="min-w-0 flex-1 bg-transparent text-xs text-[#172b4d] outline-none"
                />
              </label>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    {kolomTampil.map((item) => (
                      <th
                        key={item.key}
                        className="whitespace-nowrap border-b border-[#dce4ee] px-4 py-3 text-[11px] font-semibold text-[#64748b]"
                      >
                        {item.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {tampil.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#eef2f7] last:border-0 hover:bg-[#f8fafc]"
                    >
                      {kolomTampil.map((column) => (
                        <td
                          key={column.key}
                          className="max-w-[280px] px-4 py-3 text-xs text-[#172b4d]"
                        >
                          {column.key === "jenis" ? (
                            <JenisBadge jenis={item.jenis} />
                          ) : (
                            <span
                              className={
                                column.key === "nomor"
                                  ? "font-semibold text-[#1769e0]"
                                  : column.key === "barang"
                                    ? "font-medium"
                                    : "break-words"
                              }
                            >
                              {teksSel(column.key, item)}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {!loading && !error && tampil.length === 0 && (
                    <tr>
                      <td
                        colSpan={Math.max(kolomTampil.length, 1)}
                        className="px-4 py-12 text-center text-xs text-[#64748b]"
                      >
                        Tidak ada transaksi yang cocok dengan filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dce4ee] p-4">
              <p className="text-xs text-[#64748b]">
                {hasil.length
                  ? `Menampilkan ${(halamanAktif - 1) * PER_HALAMAN + 1}–${Math.min(
                      halamanAktif * PER_HALAMAN,
                      hasil.length,
                    )} dari ${hasil.length} transaksi`
                  : "Tidak ada data"}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Halaman sebelumnya"
                  onClick={() =>
                    setHalaman((value) => Math.max(1, value - 1))
                  }
                  disabled={halamanAktif <= 1}
                  className="flex size-9 items-center justify-center rounded-lg border border-[#dce4ee] text-[#64748b] disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs text-[#64748b]">
                  Halaman {halamanAktif} dari {totalHalaman}
                </span>
                <button
                  type="button"
                  aria-label="Halaman berikutnya"
                  onClick={() =>
                    setHalaman((value) =>
                      Math.min(totalHalaman, value + 1),
                    )
                  }
                  disabled={halamanAktif >= totalHalaman}
                  className="flex size-9 items-center justify-center rounded-lg border border-[#dce4ee] text-[#64748b] disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-sm rounded-lg bg-[#172b4d] px-4 py-3 text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
