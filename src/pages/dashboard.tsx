import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../auth";
import {
  Boxes,
  Package,
  PackagePlus,
  PackageMinus,
  PieChart,
  TriangleAlert,
  CircleAlert,
  ClipboardCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";

const assetPathPrefix = "/assets";
const imgIndicator1 = `${assetPathPrefix}/9f710.svg`;

/* ------------------------------ Data ------------------------------ */

const stokKategori = [
  { nama: "Material jaringan", jumlah: 1460, warna: "#1769e0" },
  { nama: "Perangkat jaringan", jumlah: 612, warna: "#0891b2" },
  { nama: "Perangkat pendukung", jumlah: 435, warna: "#7c3aed" },
  { nama: "Kabel & aksesori", jumlah: 340, warna: "#15803d" },
];

const totalStok = stokKategori.reduce((sum, k) => sum + k.jumlah, 0);
const RADIUS = 70;
const KELILING = 2 * Math.PI * RADIUS;

let akumulasi = 0;
const segmenDonut = stokKategori.map((k) => {
  const panjang = (k.jumlah / totalStok) * KELILING;
  const segmen = { ...k, panjang, offset: akumulasi };
  akumulasi += panjang;
  return segmen;
});

interface Metric {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const metrics: Metric[] = [
  {
    label: "Total jenis barang",
    value: "42",
    note: "+3 sejak bulan lalu",
    icon: Boxes,
    iconBg: "#eaf2ff",
    iconColor: "#1769e0",
  },
  {
    label: "Total stok tersedia",
    value: "2.847",
    note: "unit di 4 lokasi",
    icon: Package,
    iconBg: "#e6f7fa",
    iconColor: "#0891b2",
  },
  {
    label: "Barang masuk bulan ini",
    value: "386",
    note: "+18,4% dari September",
    icon: PackagePlus,
    iconBg: "#eaf8ef",
    iconColor: "#15803d",
  },
  {
    label: "Barang keluar bulan ini",
    value: "241",
    note: "37 transaksi tercatat",
    icon: PackageMinus,
    iconBg: "#fef0ef",
    iconColor: "#c2413a",
  },
];

const stokRendah = [
  {
    nama: "SFP Module 1G Single Mode",
    kode: "NET-SFP-001 · Rak B-03",
    stok: "4 unit",
    min: "minimum 10",
  },
  {
    nama: "Konektor RJ45 Cat6",
    kode: "MAT-RJ45-006 · Bin A-12",
    stok: "28 pcs",
    min: "minimum 50",
  },
  {
    nama: "Patch Cord Cat6 1m",
    kode: "MAT-PC-001 · Rak A-05",
    stok: "12 pcs",
    min: "minimum 20",
  },
];

interface Aktivitas {
  judul: string;
  detail: string;
  waktu: string;
  icon: LucideIcon;
  bg: string;
  color: string;
}

const aktivitas: Aktivitas[] = [
  {
    judul: "Barang keluar #BK-2026-0108",
    detail: "8 Access Point · Bidang Aptika",
    waktu: "10 menit lalu",
    icon: PackageMinus,
    bg: "#f2ecff",
    color: "#7c3aed",
  },
  {
    judul: "Barang masuk #BM-2026-0064",
    detail: "120 Konektor RJ45 Cat6 · CV Jaringan Bali",
    waktu: "42 menit lalu",
    icon: PackagePlus,
    bg: "#eaf8ef",
    color: "#15803d",
  },
  {
    judul: "Stok opname diselesaikan",
    detail: "Periode Oktober 2026 · selisih 2 item",
    waktu: "2 jam lalu",
    icon: ClipboardCheck,
    bg: "#eaf2ff",
    color: "#1769e0",
  },
  {
    judul: "Barang keluar #BK-2026-0107",
    detail: "35 Patch Cord Cat6 · UPTD Jaringan",
    waktu: "04 Okt 2026",
    icon: PackageMinus,
    bg: "#f2ecff",
    color: "#7c3aed",
  },
  {
    judul: "Barang masuk #BM-2026-0063",
    detail: "24 SFP Module 1G · PT Bali Digital",
    waktu: "04 Okt 2026",
    icon: PackagePlus,
    bg: "#eaf8ef",
    color: "#15803d",
  },
  {
    judul: "Barang keluar #BK-2026-0106",
    detail: "2 Switch 24 Port · Sekretariat",
    waktu: "03 Okt 2026",
    icon: PackageMinus,
    bg: "#f2ecff",
    color: "#7c3aed",
  },
  {
    judul: "Barang masuk #BM-2026-0062",
    detail: "40 Patch Cord Cat6 1m · Hasil pengadaan",
    waktu: "03 Okt 2026",
    icon: PackagePlus,
    bg: "#eaf8ef",
    color: "#15803d",
  },
];

type ModalAktif = "stok" | "aktivitas" | null;

/* ----------------------------- Komponen ----------------------------- */

function MetricCard({ m }: { m: Metric }) {
  const Icon = m.icon;
  return (
    <div className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[14px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[18px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
      <div className="flex w-full shrink-0 items-center justify-between overflow-clip">
        <p className="min-w-px flex-[1_0_0] text-[12px] font-normal not-italic leading-[normal] text-[#64748b]">
          {m.label}
        </p>
        <div
          className="flex size-[34px] shrink-0 items-center justify-center overflow-clip rounded-[8px]"
          style={{ backgroundColor: m.iconBg }}
        >
          <div
            className="flex size-[17px] shrink-0 items-center justify-center"
            style={{ color: m.iconColor }}
          >
            <Icon size={17} />
          </div>
        </div>
      </div>
      <p className="w-full shrink-0 text-[30px] font-normal not-italic leading-[normal] text-[#172b4d]">
        {m.value}
      </p>
      <p className="w-full shrink-0 text-[11px] font-normal not-italic leading-[normal] text-[#64748b]">
        {m.note}
      </p>
    </div>
  );
}

function AktivitasItem({ a }: { a: Aktivitas }) {
  const Icon = a.icon;
  return (
    <div className="flex w-full shrink-0 items-start gap-[12px] overflow-clip border-b border-solid border-[#dce4ee] py-[12px]">
      <div
        className="flex size-[34px] shrink-0 items-center justify-center overflow-clip rounded-[999px]"
        style={{ backgroundColor: a.bg }}
      >
        <div
          className="flex size-[16px] shrink-0 items-center justify-center"
          style={{ color: a.color }}
        >
          <Icon size={16} />
        </div>
      </div>
      <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[4px] overflow-clip not-italic leading-[normal]">
        <p className="w-full shrink-0 text-[12px] font-bold text-[#172b4d]">
          {a.judul}
        </p>
        <p className="w-full shrink-0 text-[11px] font-normal text-[#64748b]">
          {a.detail}
        </p>
      </div>
      <p className="w-[90px] shrink-0 text-right text-[10px] font-normal not-italic leading-[normal] text-[#94a3b8]">
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
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-[16px] flex items-center justify-between">
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

/* ----------------------------- Dashboard ----------------------------- */

export default function DashboardScreen() {
  const { user } = useAuth();
  const [modal, setModal] = useState<ModalAktif>(null);
  const tutup = () => setModal(null);

  return (
    <div className="relative flex size-full items-start bg-[#f3f6fa]">
      <Sidebar active="Dashboard" />

      <div className="relative flex min-h-[1120px] min-w-px flex-[1_0_0] flex-col items-start overflow-clip">
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
          <div className="flex w-full shrink-0 items-center justify-between font-normal not-italic">
            <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[5px] overflow-clip leading-[normal]">
              <p className="w-full shrink-0 text-[26px] text-[#172b4d]">
                Dashboard
              </p>
              <p className="w-full shrink-0 text-[14px] text-[#64748b]">
                Ringkasan kondisi persediaan per 5 Oktober 2026, 09.30 WITA
              </p>
            </div>
          </div>

          {/* KPI */}
          <div className="flex w-full shrink-0 items-start gap-[14px]">
            {metrics.map((m) => (
              <MetricCard key={m.label} m={m} />
            ))}
          </div>

          {/* Stock alert */}
          <div className="flex w-full shrink-0 flex-col items-start gap-[16px] overflow-clip rounded-[12px] border border-solid border-[#f3c6c2] bg-[#fef0ef] p-[20px]">
            <div className="flex w-full shrink-0 items-center justify-between overflow-clip">
              <div className="flex shrink-0 items-center gap-[12px] overflow-clip">
                <div className="flex size-[38px] shrink-0 items-center justify-center overflow-clip rounded-[8px] bg-[#c2413a]">
                  <div className="flex size-[20px] shrink-0 items-center justify-center text-white">
                    <TriangleAlert size={20} />
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-[3px] overflow-clip whitespace-nowrap font-normal not-italic leading-[normal]">
                  <p className="shrink-0 text-[15px] text-[#c2413a]">
                    {stokRendah.length} barang di bawah stok minimum
                  </p>
                  <p className="shrink-0 text-[12px] text-[#8b433e]">
                    Segera tindak lanjuti agar operasional jaringan tidak
                    terganggu.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModal("stok")}
                className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] font-normal not-italic text-[#1769e0] hover:bg-[#f3f6fa]"
              >
                <span className="flex size-[16px] shrink-0 items-center justify-center text-center text-[12.8px] leading-[0]">
                  <span className="leading-[normal]">›</span>
                </span>
                <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                  Lihat semua
                </span>
              </button>
            </div>

            <div className="flex w-full shrink-0 items-start gap-[10px] overflow-clip">
              {stokRendah.map((item) => (
                <div
                  key={item.kode}
                  className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[9px] overflow-clip rounded-[8px] bg-white p-[14px]"
                >
                  <div className="flex w-full shrink-0 items-center justify-between overflow-clip">
                    <p className="min-w-px flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-bold not-italic leading-[normal] text-[#172b4d]">
                      {item.nama}
                    </p>
                    <div className="flex shrink-0 items-center gap-[5px] overflow-clip rounded-[999px] bg-[#fef0ef] px-[9px] py-[5px]">
                      <div className="flex size-[12px] shrink-0 items-center justify-center text-[#c2413a]">
                        <CircleAlert size={12} />
                      </div>
                      <p className="shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal] text-[#c2413a]">
                        Kritis
                      </p>
                    </div>
                  </div>
                  <p className="w-full shrink-0 text-[10px] font-normal not-italic leading-[normal] text-[#64748b]">
                    {item.kode}
                  </p>
                  <div className="flex w-full shrink-0 items-baseline justify-between overflow-clip whitespace-nowrap font-normal not-italic leading-[normal]">
                    <p className="shrink-0 text-[17px] text-[#c2413a]">
                      {item.stok}
                    </p>
                    <p className="shrink-0 text-[10px] text-[#64748b]">
                      {item.min}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational overview */}
          <div className="flex w-full shrink-0 items-start gap-[16px]">
            {/* Stok per kategori */}
            <div className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[18px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[20px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
              <div className="flex w-full shrink-0 items-center justify-between overflow-clip">
                <div className="flex shrink-0 flex-col items-start gap-[3px] overflow-clip whitespace-nowrap font-normal not-italic leading-[normal]">
                  <p className="shrink-0 text-[16px] text-[#172b4d]">
                    Stok per kategori
                  </p>
                  <p className="shrink-0 text-[11px] text-[#64748b]">
                    Total unit tersedia saat ini
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-[5px] overflow-clip rounded-[999px] bg-[#eaf2ff] px-[9px] py-[5px]">
                  <div className="relative size-[6px] shrink-0">
                    <img
                      alt=""
                      className="absolute inset-0 block size-full max-w-none"
                      src={imgIndicator1}
                    />
                  </div>
                  <p className="shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal] text-[#1769e0]">
                    {totalStok.toLocaleString("id-ID")} unit
                  </p>
                </div>
              </div>

              {/* Donut chart */}
              <div className="flex w-full flex-col items-center gap-[16px]">
                <div className="relative size-[180px]">
                  <svg viewBox="0 0 180 180" className="size-full">
                    <circle
                      cx="90"
                      cy="90"
                      r={RADIUS}
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="22"
                    />
                    <g transform="rotate(-90 90 90)">
                      {segmenDonut.map((s) => (
                        <circle
                          key={s.nama}
                          cx="90"
                          cy="90"
                          r={RADIUS}
                          fill="none"
                          stroke={s.warna}
                          strokeWidth="22"
                          strokeDasharray={`${Math.max(s.panjang - 2, 0)} ${KELILING}`}
                          strokeDashoffset={-s.offset}
                        >
                          <title>{`${s.nama}: ${s.jumlah.toLocaleString("id-ID")} unit`}</title>
                        </circle>
                      ))}
                    </g>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[24px] leading-none text-[#172b4d]">
                      {totalStok.toLocaleString("id-ID")}
                    </p>
                    <p className="mt-1 text-[11px] text-[#64748b]">
                      total unit
                    </p>
                  </div>
                </div>

                {/* Legenda */}
                <div className="grid w-full grid-cols-2 gap-x-4 gap-y-3">
                  {stokKategori.map((k) => (
                    <div key={k.nama} className="flex items-center gap-2">
                      <span
                        className="size-[10px] shrink-0 rounded-[3px]"
                        style={{ backgroundColor: k.warna }}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[12px] text-[#172b4d]">
                          {k.nama}
                        </p>
                        <p className="text-[11px] text-[#64748b]">
                          {k.jumlah.toLocaleString("id-ID")} unit ·{" "}
                          {Math.round((k.jumlah / totalStok) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex w-full shrink-0 items-start gap-[9px] overflow-clip rounded-[8px] bg-[#eaf2ff] p-[12px] font-normal not-italic">
                <div className="flex size-[16px] shrink-0 items-center justify-center text-[#1769e0]">
                  <PieChart size={16} />
                </div>
                <p className="min-w-px flex-[1_0_0] text-[11px] leading-[1.4] text-[#0e4fab]">
                  Material jaringan mencakup 51% dari total persediaan aktif.
                </p>
              </div>
            </div>

            {/* Aktivitas terbaru */}
            <div className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[16px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[20px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
              <div className="flex w-full shrink-0 items-center justify-between overflow-clip whitespace-nowrap font-normal not-italic leading-[normal]">
                <p className="shrink-0 text-[16px] text-[#172b4d]">
                  Aktivitas terbaru
                </p>
                <button
                  type="button"
                  onClick={() => setModal("aktivitas")}
                  className="shrink-0 cursor-pointer text-[11px] text-[#1769e0] hover:underline"
                >
                  Lihat semua
                </button>
              </div>
              <div className="flex w-full shrink-0 flex-col items-start overflow-clip">
                {aktivitas.slice(0, 3).map((a) => (
                  <AktivitasItem key={a.judul} a={a} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: semua barang di bawah stok minimum */}
      {modal === "stok" && (
        <Modal title="Barang di bawah stok minimum" onClose={tutup}>
          <div className="flex flex-col gap-[10px]">
            {stokRendah.map((item) => (
              <div
                key={item.kode}
                className="rounded-[8px] border border-solid border-[#f3c6c2] bg-[#fef0ef] p-[14px]"
              >
                <p className="text-[13px] font-bold text-[#172b4d]">
                  {item.nama}
                </p>
                <p className="text-[11px] text-[#64748b]">{item.kode}</p>
                <p className="mt-1 text-[15px] text-[#c2413a]">
                  {item.stok}{" "}
                  <span className="text-[11px] text-[#64748b]">
                    · {item.min}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Modal: semua aktivitas */}
      {modal === "aktivitas" && (
        <Modal title="Semua aktivitas" onClose={tutup}>
          <div className="flex flex-col">
            {aktivitas.map((a) => (
              <AktivitasItem key={a.judul} a={a} />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
