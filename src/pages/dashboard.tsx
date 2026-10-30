import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "../auth";
import { apiRequest } from "../api";
import {
  Boxes,
  Package,
  PackagePlus,
  PackageMinus,
  PieChart,
  TriangleAlert,
  CircleAlert,
  CircleCheck,
  Search,
  RefreshCw,
  X,
  type LucideIcon,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";

const warnaKategori = [
  "#1769e0",
  "#0891b2",
  "#7c3aed",
  "#15803d",
  "#c2413a",
  "#d97706",
];

type ModalAktif = "stok" | "aktivitas" | null;

type DashboardResponse = {
  message: string;
  data: {
    total_barang: number;
    total_kategori: number;
    total_stok: number;
    jumlah_barang_stok_menipis: number;
    total_barang_masuk: number;
    total_barang_keluar: number;
    stok_per_kategori: {
      id: number;
      nama_kategori: string;
      total_stok: number;
    }[];
    mutasi_terbaru: {
      id: number;
      barang_id: number;
      user_id: number;
      jenis_mutasi: string;
      jumlah: number;
      stok_sebelum: number;
      stok_sesudah: number;
      keterangan: string | null;
      created_at: string;
      barang?: {
        kode_barang: string;
        nama_barang: string;
        satuan: string;
      } | null;
      user?: {
        name: string;
      } | null;
    }[];
  };
};

type ApiBarang = {
  id: number;
  kode_barang: string;
  nama_barang: string;
  stok: number;
  stok_minimum: number;
  satuan: string;
  lokasi?: string | null;
  kategori_barang?: {
    nama_kategori: string;
  } | null;
};

type BarangMenipis = {
  id: number;
  kode: string;
  nama: string;
  stok: number;
  minimum: number;
  satuan: string;
  lokasi: string;
  kategori: string;
  kekurangan: number;
};

interface Metric {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

interface Aktivitas {
  id: number;
  judul: string;
  detail: string;
  waktu: string;
  icon: LucideIcon;
  bg: string;
  color: string;
}

function formatAngka(value: number) {
  return value.toLocaleString("id-ID");
}

function formatWaktu(value: string) {
  const tanggal = new Date(value);

  if (Number.isNaN(tanggal.getTime())) return value;

  return (
    tanggal.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Makassar",
    }) + " WITA"
  );
}

function MetricCard({ m }: { m: Metric }) {
  const Icon = m.icon;

  return (
    <div className="relative flex min-w-0 flex-1 flex-col items-start gap-[14px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[18px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
      <div className="flex w-full items-center justify-between gap-2">
        <p className="min-w-0 flex-1 text-[12px] text-[#64748b]">
          {m.label}
        </p>
        <div
          className="flex size-[34px] shrink-0 items-center justify-center rounded-[8px]"
          style={{ backgroundColor: m.iconBg }}
        >
          <Icon size={17} style={{ color: m.iconColor }} />
        </div>
      </div>
      <p className="w-full break-words text-[30px] text-[#172b4d]">
        {m.value}
      </p>
      <p className="w-full text-[11px] text-[#64748b]">{m.note}</p>
    </div>
  );
}

function AktivitasItem({ a }: { a: Aktivitas }) {
  const Icon = a.icon;

  return (
    <div className="flex w-full items-start gap-[12px] border-b border-solid border-[#dce4ee] py-[12px] last:border-b-0">
      <div
        className="flex size-[34px] shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: a.bg }}
      >
        <Icon size={16} style={{ color: a.color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-bold text-[#172b4d]">{a.judul}</p>
        <p className="mt-1 text-[11px] text-[#64748b]">{a.detail}</p>
      </div>
      <p className="max-w-[120px] shrink-0 text-right text-[10px] text-[#94a3b8]">
        {a.waktu}
      </p>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
  lebar = "max-w-[520px]",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  lebar?: string;
}) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#172b4d]/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`my-auto max-h-[85vh] w-full ${lebar} overflow-auto rounded-[12px] bg-white p-5 shadow-xl sm:p-[24px]`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-[16px] flex items-center justify-between gap-3">
          <p className="text-[18px] text-[#172b4d]">{title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex size-[28px] shrink-0 items-center justify-center rounded-[6px] hover:bg-[#f3f6fa]"
          >
            <X size={18} className="text-[#64748b]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function BarangMenipisItem({ barang }: { barang: BarangMenipis }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#dce4ee] p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#fef0ef]">
          <TriangleAlert size={17} className="text-[#c2413a]" />
        </div>
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold text-[#172b4d]">
            {barang.nama}
          </p>
          <p className="mt-1 break-words text-xs text-[#64748b]">
            {barang.kode}
            {barang.kategori ? ` · ${barang.kategori}` : ""}
          </p>
          {barang.lokasi && (
            <p className="mt-1 text-xs text-[#64748b]">
              Lokasi: {barang.lokasi}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-[#eef2f7] pt-3 sm:min-w-[190px] sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
        <div>
          <p className="text-[10px] text-[#64748b]">Stok</p>
          <p className="mt-1 text-sm font-semibold text-[#c2413a]">
            {formatAngka(barang.stok)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#64748b]">Minimum</p>
          <p className="mt-1 text-sm text-[#172b4d]">
            {formatAngka(barang.minimum)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#64748b]">Kurang</p>
          <p className="mt-1 text-sm font-semibold text-[#c2413a]">
            {formatAngka(barang.kekurangan)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardScreen() {
  const { user } = useAuth();

  const [modal, setModal] = useState<ModalAktif>(null);
  const [dashboard, setDashboard] =
    useState<DashboardResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [barangMenipis, setBarangMenipis] = useState<BarangMenipis[]>([]);
  const [loadingBarangMenipis, setLoadingBarangMenipis] = useState(false);
  const [errorBarangMenipis, setErrorBarangMenipis] = useState("");
  const [sudahMemuatBarangMenipis, setSudahMemuatBarangMenipis] =
    useState(false);
  const [pencarianStok, setPencarianStok] = useState("");

  const tutup = useCallback(() => setModal(null), []);

  const ambilDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await apiRequest<DashboardResponse>("/dashboard");

      setDashboard(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data Dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void ambilDashboard();
  }, [ambilDashboard]);

  const ambilBarangMenipis = useCallback(async () => {
    setLoadingBarangMenipis(true);
    setErrorBarangMenipis("");

    try {
      const response = await apiRequest<{ data: ApiBarang[] }>("/barang");

      const daftar = (Array.isArray(response.data) ? response.data : [])
        .map((item): BarangMenipis | null => {
          const stok = Number(item.stok);
          const minimum = Number(item.stok_minimum);

          if (
            !Number.isFinite(stok) ||
            !Number.isFinite(minimum) ||
            stok > minimum
          ) {
            return null;
          }

          return {
            id: item.id,
            kode: item.kode_barang,
            nama: item.nama_barang,
            stok,
            minimum,
            satuan: item.satuan || "unit",
            lokasi: item.lokasi || "",
            kategori: item.kategori_barang?.nama_kategori || "",
            kekurangan: Math.max(0, minimum - stok),
          };
        })
        .filter((item): item is BarangMenipis => item !== null)
        .sort((a, b) => {
          if (b.kekurangan !== a.kekurangan) {
            return b.kekurangan - a.kekurangan;
          }
          return a.nama.localeCompare(b.nama);
        });

      setBarangMenipis(daftar);
      setSudahMemuatBarangMenipis(true);
    } catch (err) {
      setErrorBarangMenipis(
        err instanceof Error
          ? err.message
          : "Gagal mengambil daftar barang.",
      );
    } finally {
      setLoadingBarangMenipis(false);
    }
  }, []);

  const bukaDetailStok = useCallback(() => {
    setPencarianStok("");
    setModal("stok");
    void ambilBarangMenipis();
  }, [ambilBarangMenipis]);

  const kategori = (dashboard?.stok_per_kategori ?? []).map(
    (item, index) => ({
      nama: item.nama_kategori,
      jumlah: item.total_stok,
      warna: warnaKategori[index % warnaKategori.length],
    }),
  );

  const totalStokKategori = kategori.reduce(
    (total, item) => total + item.jumlah,
    0,
  );

  const radius = 70;
  const keliling = 2 * Math.PI * radius;
  let akumulasi = 0;

  const segmenDonut = kategori.map((item) => {
    const panjang =
      totalStokKategori > 0
        ? (item.jumlah / totalStokKategori) * keliling
        : 0;

    const segmen = {
      ...item,
      panjang,
      offset: akumulasi,
    };

    akumulasi += panjang;
    return segmen;
  });

  const metrics: Metric[] = [
    {
      label: "Total jenis barang",
      value: dashboard ? formatAngka(dashboard.total_barang) : "—",
      note: dashboard
        ? `${formatAngka(dashboard.total_kategori)} kategori terdaftar`
        : "Menunggu data backend",
      icon: Boxes,
      iconBg: "#eaf2ff",
      iconColor: "#1769e0",
    },
    {
      label: "Total stok tersedia",
      value: dashboard ? formatAngka(dashboard.total_stok) : "—",
      note: "Total unit dalam persediaan",
      icon: Package,
      iconBg: "#e6f7fa",
      iconColor: "#0891b2",
    },
    {
      label: "Barang masuk",
      value: dashboard
        ? formatAngka(dashboard.total_barang_masuk)
        : "—",
      note: "Total mutasi masuk dari API",
      icon: PackagePlus,
      iconBg: "#eaf8ef",
      iconColor: "#15803d",
    },
    {
      label: "Barang keluar",
      value: dashboard
        ? formatAngka(dashboard.total_barang_keluar)
        : "—",
      note: "Total mutasi keluar dari API",
      icon: PackageMinus,
      iconBg: "#fef0ef",
      iconColor: "#c2413a",
    },
  ];

  const aktivitas: Aktivitas[] = (
    dashboard?.mutasi_terbaru ?? []
  ).map((item) => {
    const masuk = item.jenis_mutasi.toLowerCase() === "masuk";
    const namaBarang = item.barang?.nama_barang ?? "Barang";
    const satuan = item.barang?.satuan ?? "unit";
    const namaUser = item.user?.name;

    return {
      id: item.id,
      judul: `Barang ${masuk ? "masuk" : "keluar"} #${item.id}`,
      detail: `${formatAngka(item.jumlah)} ${namaBarang} (${satuan})${
        namaUser ? ` · ${namaUser}` : ""
      }`,
      waktu: formatWaktu(item.created_at),
      icon: masuk ? PackagePlus : PackageMinus,
      bg: masuk ? "#eaf8ef" : "#f2ecff",
      color: masuk ? "#15803d" : "#7c3aed",
    };
  });

  const jumlahStokMenipis =
    dashboard?.jumlah_barang_stok_menipis ?? 0;

  const hasilCariStok = useMemo(() => {
    const q = pencarianStok.trim().toLowerCase();

    if (!q) return barangMenipis;

    return barangMenipis.filter(
      (barang) =>
        barang.nama.toLowerCase().includes(q) ||
        barang.kode.toLowerCase().includes(q) ||
        barang.kategori.toLowerCase().includes(q) ||
        barang.lokasi.toLowerCase().includes(q),
    );
  }, [barangMenipis, pencarianStok]);

  return (
    <div className="relative flex min-h-screen w-full min-w-0 items-start bg-[#f3f6fa]">
      <Sidebar active="Dashboard" />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex min-h-[76px] w-full flex-wrap items-center justify-between gap-3 border-b border-solid border-[#dce4ee] bg-white px-4 py-4 sm:px-6 md:px-[32px]">
          <p className="text-[16px] font-bold text-[#172b4d]">
            Sistem Persediaan Infrastruktur TIK
          </p>
          <p className="text-[12px] text-[#64748b]">
            {user?.nama} · {user?.role}
          </p>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-[24px] p-4 md:p-[32px]">
          <div>
            <h1 className="text-[26px] text-[#172b4d]">Dashboard</h1>
            <p className="mt-1 text-[14px] text-[#64748b]">
              Ringkasan kondisi persediaan berdasarkan data backend.
            </p>
          </div>

          {loading && (
            <p className="rounded-lg bg-white p-4 text-sm text-[#64748b]">
              Memuat data Dashboard...
            </p>
          )}

          {error && (
            <div
              className="rounded-[10px] border border-[#f3c6c2] bg-[#fef0ef] p-4 text-sm text-[#c2413a]"
              role="alert"
            >
              <p className="font-semibold">
                Gagal mengambil data Dashboard.
              </p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                className="mt-3 rounded-md border border-[#f3c6c2] bg-white px-3 py-2 hover:bg-[#fff7f6]"
                onClick={() => void ambilDashboard()}
              >
                Coba lagi
              </button>
            </div>
          )}

          <div className="grid w-full grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} m={metric} />
            ))}
          </div>

          <div
            className={`flex w-full flex-col gap-[16px] rounded-[12px] border p-4 sm:p-[20px] ${
              jumlahStokMenipis > 0
                ? "border-[#f3c6c2] bg-[#fef0ef]"
                : "border-[#dce4ee] bg-white"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-[12px]">
                <div
                  className={`flex size-[38px] shrink-0 items-center justify-center rounded-[8px] ${
                    jumlahStokMenipis > 0
                      ? "bg-[#c2413a] text-white"
                      : "bg-[#eaf8ef] text-[#15803d]"
                  }`}
                >
                  {jumlahStokMenipis > 0 ? (
                    <TriangleAlert size={20} />
                  ) : (
                    <CircleAlert size={20} />
                  )}
                </div>

                <div>
                  <p
                    className={`text-[15px] ${
                      jumlahStokMenipis > 0
                        ? "text-[#c2413a]"
                        : "text-[#172b4d]"
                    }`}
                  >
                    {loading
                      ? "Memeriksa kondisi stok..."
                      : `${formatAngka(jumlahStokMenipis)} barang di bawah stok minimum`}
                  </p>
                  <p className="mt-1 text-[12px] text-[#64748b]">
                    Jumlah berdasarkan ringkasan dari backend.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={bukaDetailStok}
                disabled={!dashboard || loading}
                className="flex h-[40px] items-center justify-center gap-[8px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] text-[14px] text-[#1769e0] hover:bg-[#f3f6fa] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Lihat detail
              </button>
            </div>

            {dashboard && jumlahStokMenipis === 0 && (
              <p className="text-[12px] text-[#64748b]">
                Backend melaporkan tidak ada barang yang memenuhi kondisi
                stok menipis.
              </p>
            )}
          </div>

          <div className="grid w-full min-w-0 grid-cols-1 items-start gap-[16px] xl:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-[18px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-4 drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] sm:p-[20px]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[16px] text-[#172b4d]">
                    Stok per kategori
                  </p>
                  <p className="mt-1 text-[11px] text-[#64748b]">
                    Total unit tersedia berdasarkan API
                  </p>
                </div>
                <span className="rounded-full bg-[#eaf2ff] px-[9px] py-[5px] text-[12px] text-[#1769e0]">
                  {formatAngka(totalStokKategori)} unit
                </span>
              </div>

              {kategori.length > 0 ? (
                <>
                  <div className="flex w-full flex-col items-center gap-[16px]">
                    <div className="relative size-[180px]">
                      <svg
                        viewBox="0 0 180 180"
                        className="size-full"
                        role="img"
                        aria-label="Diagram donat stok per kategori"
                      >
                        <circle
                          cx="90"
                          cy="90"
                          r={radius}
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="22"
                        />

                        {totalStokKategori > 0 && (
                          <g transform="rotate(-90 90 90)">
                            {segmenDonut.map((segmen) => (
                              <circle
                                key={segmen.nama}
                                cx="90"
                                cy="90"
                                r={radius}
                                fill="none"
                                stroke={segmen.warna}
                                strokeWidth="22"
                                strokeDasharray={`${Math.max(
                                  segmen.panjang - 2,
                                  0,
                                )} ${keliling}`}
                                strokeDashoffset={-segmen.offset}
                              >
                                <title>
                                  {`${segmen.nama}: ${formatAngka(segmen.jumlah)} unit`}
                                </title>
                              </circle>
                            ))}
                          </g>
                        )}
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-[24px] leading-none text-[#172b4d]">
                          {formatAngka(totalStokKategori)}
                        </p>
                        <p className="mt-1 text-[11px] text-[#64748b]">
                          total unit
                        </p>
                      </div>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                      {kategori.map((item) => (
                        <div
                          key={item.nama}
                          className="flex min-w-0 items-center gap-2"
                        >
                          <span
                            className="size-[10px] shrink-0 rounded-[3px]"
                            style={{ backgroundColor: item.warna }}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[12px] text-[#172b4d]">
                              {item.nama}
                            </p>
                            <p className="text-[11px] text-[#64748b]">
                              {formatAngka(item.jumlah)} unit ·{" "}
                              {totalStokKategori > 0
                                ? Math.round(
                                    (item.jumlah / totalStokKategori) * 100,
                                  )
                                : 0}
                              %
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-[9px] rounded-[8px] bg-[#eaf2ff] p-[12px] text-[11px] leading-[1.4] text-[#0e4fab]">
                    <PieChart size={16} className="shrink-0" />
                    <p>
                      Grafik menampilkan proporsi stok setiap kategori
                      berdasarkan data yang diterima dari backend.
                    </p>
                  </div>
                </>
              ) : (
                <p className="py-8 text-center text-[12px] text-[#64748b]">
                  {loading
                    ? "Memuat data kategori..."
                    : "Belum ada data stok per kategori."}
                </p>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-[16px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-4 drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] sm:p-[20px]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[16px] text-[#172b4d]">
                  Aktivitas terbaru
                </p>
                <button
                  type="button"
                  onClick={() => setModal("aktivitas")}
                  disabled={!dashboard || loading}
                  className="text-[11px] text-[#1769e0] hover:underline disabled:opacity-50"
                >
                  Lihat semua
                </button>
              </div>

              <div className="flex w-full flex-col">
                {aktivitas.length > 0 ? (
                  aktivitas.slice(0, 3).map((item) => (
                    <AktivitasItem key={item.id} a={item} />
                  ))
                ) : (
                  <p className="py-8 text-center text-[12px] text-[#64748b]">
                    {loading
                      ? "Memuat aktivitas..."
                      : "Belum ada aktivitas terbaru."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal === "stok" && (
        <Modal
          title="Barang di bawah stok minimum"
          onClose={tutup}
          lebar="max-w-[720px]"
        >
          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-[#f8fafc] p-3">
              <p className="text-sm text-[#172b4d]">
                Ditemukan{" "}
                <strong>{formatAngka(barangMenipis.length)} barang</strong>{" "}
                dengan stok kurang dari atau sama dengan stok minimum.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#64748b]">
                Data diambil dari daftar barang di server. Periksa jumlah
                stok dan batas minimum sebelum melakukan pengadaan atau
                penyesuaian.
              </p>
            </div>

            <label className="flex h-10 items-center gap-2 rounded-lg border border-[#dce4ee] px-3 text-[#94a3b8] focus-within:border-[#1769e0]">
              <Search size={16} className="shrink-0" />
              <input
                value={pencarianStok}
                onChange={(e) => setPencarianStok(e.target.value)}
                placeholder="Cari nama, kode, kategori, atau lokasi..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#172b4d] outline-none placeholder:text-[#94a3b8]"
              />
              {pencarianStok && (
                <button
                  type="button"
                  aria-label="Hapus pencarian"
                  onClick={() => setPencarianStok("")}
                >
                  <X size={14} />
                </button>
              )}
            </label>

            {loadingBarangMenipis && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#64748b]">
                <RefreshCw size={16} className="animate-spin" />
                Memuat daftar barang...
              </div>
            )}

            {errorBarangMenipis && !loadingBarangMenipis && (
              <div className="rounded-lg border border-[#f3c6c2] bg-[#fef0ef] p-4 text-sm text-[#c2413a]">
                <p>Daftar barang gagal dimuat.</p>
                <p className="mt-1 text-xs">{errorBarangMenipis}</p>
                <button
                  type="button"
                  onClick={() => void ambilBarangMenipis()}
                  className="mt-3 rounded-md border border-[#f3c6c2] bg-white px-3 py-2 text-xs"
                >
                  Coba lagi
                </button>
              </div>
            )}

            {!loadingBarangMenipis &&
              !errorBarangMenipis &&
              hasilCariStok.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  {barangMenipis.length === 0 ? (
                    <>
                      <CircleCheck size={30} className="text-[#15803d]" />
                      <p className="text-sm font-semibold text-[#172b4d]">
                        Tidak ada barang yang menipis
                      </p>
                      <p className="text-xs text-[#64748b]">
                        Semua barang berada di atas batas minimum stok.
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-[#64748b]">
                      Tidak ada barang yang cocok dengan pencarian.
                    </p>
                  )}
                </div>
              )}

            {!loadingBarangMenipis &&
              !errorBarangMenipis &&
              hasilCariStok.length > 0 && (
                <div className="flex flex-col gap-2">
                  {hasilCariStok.map((barang) => (
                    <BarangMenipisItem key={barang.id} barang={barang} />
                  ))}
                </div>
              )}

            {!loadingBarangMenipis &&
              !errorBarangMenipis &&
              sudahMemuatBarangMenipis &&
              barangMenipis.length > 0 && (
                <p className="text-xs text-[#64748b]">
                  Menampilkan {formatAngka(hasilCariStok.length)} dari{" "}
                  {formatAngka(barangMenipis.length)} barang menipis.
                </p>
              )}
          </div>
        </Modal>
      )}

      {modal === "aktivitas" && (
        <Modal title="Semua aktivitas" onClose={tutup}>
          <div className="flex flex-col">
            {aktivitas.length > 0 ? (
              aktivitas.map((item) => (
                <AktivitasItem key={item.id} a={item} />
              ))
            ) : (
              <p className="py-6 text-center text-[12px] text-[#64748b]">
                Belum ada aktivitas terbaru.
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}