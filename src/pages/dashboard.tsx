
import { useEffect, useState, type ReactNode } from "react";
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

  if (Number.isNaN(tanggal.getTime())) {
    return value;
  }

  return tanggal.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Makassar",
  }) + " WITA";
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
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#172b4d]/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="max-h-[85vh] w-full max-w-[520px] overflow-auto rounded-[12px] bg-white p-[24px] shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-[16px] flex items-center justify-between gap-3">
          <p className="text-[18px] text-[#172b4d]">{title}</p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex size-[28px] items-center justify-center rounded-[6px] hover:bg-[#f3f6fa]"
          >
            <X size={18} className="text-[#64748b]" />
          </button>
        </div>

        {children}
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

  const tutup = () => setModal(null);

  useEffect(() => {
    let aktif = true;

    async function ambilDashboard() {
      try {
        setLoading(true);
        setError("");

        const response =
          await apiRequest<DashboardResponse>("/dashboard");

        if (aktif) {
          setDashboard(response.data);
        }
      } catch (err) {
        if (aktif) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data Dashboard.",
          );
        }
      } finally {
        if (aktif) {
          setLoading(false);
        }
      }
    }

    void ambilDashboard();

    return () => {
      aktif = false;
    };
  }, []);

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

  const aktivitas: Aktivitas[] = (dashboard?.mutasi_terbaru ?? []).map(
    (item) => {
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
    },
  );

  const jumlahStokMenipis =
    dashboard?.jumlah_barang_stok_menipis ?? 0;

  return (
    <div className="relative flex min-h-screen w-full items-start bg-[#f3f6fa]">
      <Sidebar active="Dashboard" />

      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="flex min-h-[76px] w-full items-center justify-between gap-4 border-b border-solid border-[#dce4ee] bg-white px-6 py-4 md:px-[32px]">
          <p className="text-[16px] font-bold text-[#172b4d]">
            Sistem Persediaan Infrastruktur TIK
          </p>

          <p className="shrink-0 text-[12px] text-[#64748b]">
            {user?.nama} · {user?.role}
          </p>
        </div>

        <div className="flex w-full flex-col gap-[24px] p-4 md:p-[32px]">
          {/* Page heading */}
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
                onClick={() => window.location.reload()}
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* KPI */}
          <div className="grid w-full grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} m={metric} />
            ))}
          </div>

          {/* Stock alert */}
          <div
            className={`flex w-full flex-col gap-[16px] rounded-[12px] border p-[20px] ${
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
                onClick={() => setModal("stok")}
                disabled={!dashboard || loading}
                className="flex h-[40px] items-center justify-center gap-[8px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] text-[14px] text-[#1769e0] hover:bg-[#f3f6fa] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Lihat detail
              </button>
            </div>

            {dashboard && jumlahStokMenipis === 0 && (
              <p className="text-[12px] text-[#64748b]">
                Backend melaporkan tidak ada barang yang memenuhi
                kondisi stok menipis.
              </p>
            )}

            {dashboard && jumlahStokMenipis > 0 && (
              <p className="text-[12px] text-[#8b433e]">
                API saat ini memberikan jumlah barang menipis, tetapi
                belum memberikan daftar barang dan batas minimumnya.
              </p>
            )}
          </div>

          {/* Operational overview */}
          <div className="grid w-full grid-cols-1 items-start gap-[16px] xl:grid-cols-2">
            {/* Stok per kategori */}
            <div className="flex min-w-0 flex-col gap-[18px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[20px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
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

            {/* Aktivitas terbaru */}
            <div className="flex min-w-0 flex-col gap-[16px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[20px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
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

      {/* Modal stok minimum */}
      {modal === "stok" && (
        <Modal title="Barang di bawah stok minimum" onClose={tutup}>
          <div className="flex flex-col gap-[10px]">
            <p className="text-[13px] text-[#64748b]">
              Backend melaporkan {formatAngka(jumlahStokMenipis)} barang
              di bawah stok minimum.
            </p>
            <p className="text-[12px] text-[#64748b]">
              Endpoint Dashboard yang tersedia saat ini hanya
              memberikan jumlahnya, belum daftar barang, jumlah stok,
              dan nilai minimum masing-masing barang.
            </p>
          </div>
        </Modal>
      )}

      {/* Modal seluruh aktivitas */}
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
