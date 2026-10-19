import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChevronLeft,
  Pencil,
  Trash2,
  PackageSearch,
  Warehouse,
  CircleAlert,
  CircleCheck,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { useAuth } from "../auth";

/* Ganti sesuai hash halaman Master Barang di App kamu */
const HASH_MASTER = "master";

const KEY_TERPILIH = "simpera-barang-terpilih";
const KEY_TERSIMPAN = "simpera-barang-tersimpan";
const KEY_DIHAPUS = "simpera-barang-dihapus";

interface DataBarang {
  kode: string;
  nama: string;
  kategori: string;
  lokasi: string;
  stok: string;
  minimum: string;
  menipis: boolean;
  merek: string;
  model: string;
  deskripsi: string;
  aktif: boolean;
}

/* Samakan dengan data di Master Barang */
const dataDasar: DataBarang[] = [
  {
    kode: "MAT-LAN-006",
    nama: "Kabel LAN Cat6 UTP 305m",
    kategori: "Kabel & aksesori",
    lokasi: "Gudang Utama · Rak A-01",
    stok: "18 roll",
    minimum: "8",
    menipis: false,
  },
  {
    kode: "MAT-RJ45-006",
    nama: "Konektor RJ45 Cat6",
    kategori: "Material jaringan",
    lokasi: "Gudang Utama · Bin A-12",
    stok: "28 pcs",
    minimum: "50",
    menipis: true,
  },
  {
    kode: "NET-RTR-012",
    nama: "Router MikroTik RB4011",
    kategori: "Perangkat jaringan",
    lokasi: "Gudang Utama · Rak B-01",
    stok: "12 unit",
    minimum: "5",
    menipis: false,
  },
  {
    kode: "NET-SWI-024",
    nama: "Switch Managed 24 Port PoE",
    kategori: "Perangkat jaringan",
    lokasi: "Gudang Utama · Rak B-02",
    stok: "8 unit",
    minimum: "5",
    menipis: false,
  },
  {
    kode: "NET-AP-018",
    nama: "Access Point Wi-Fi 6",
    kategori: "Perangkat jaringan",
    lokasi: "Gudang Utama · Rak B-04",
    stok: "14 unit",
    minimum: "6",
    menipis: false,
  },
  {
    kode: "NET-SFP-001",
    nama: "SFP Module 1G Single Mode",
    kategori: "Perangkat jaringan",
    lokasi: "Gudang Utama · Rak B-03",
    stok: "4 unit",
    minimum: "10",
    menipis: true,
  },
  {
    kode: "MAT-PC-001",
    nama: "Patch Cord Cat6 1m",
    kategori: "Kabel & aksesori",
    lokasi: "Gudang Utama · Rak A-05",
    stok: "12 pcs",
    minimum: "20",
    menipis: true,
  },
  {
    kode: "NET-FW-003",
    nama: "Firewall FortiGate 60F",
    kategori: "Perangkat jaringan",
    lokasi: "Gudang Cadangan · Rak C-02",
    stok: "3 unit",
    minimum: "4",
    menipis: true,
  },
  {
    kode: "PND-UPS-005",
    nama: "UPS 1200VA",
    kategori: "Perangkat pendukung",
    lokasi: "Gudang Aptika · Rak D-01",
    stok: "6 unit",
    minimum: "3",
    menipis: false,
  },
].map((b) => ({ ...b, merek: "", model: "", deskripsi: "", aktif: true }));

function bacaJson<T>(key: string, awal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : awal;
  } catch {
    return awal;
  }
}

function cariBarang(kode: string | null): DataBarang | null {
  if (!kode) return null;
  const dihapus = new Set(bacaJson<string[]>(KEY_DIHAPUS, []));
  if (dihapus.has(kode)) return null;
  const tersimpan = bacaJson<DataBarang[]>(KEY_TERSIMPAN, []);
  return (
    tersimpan.find((b) => b.kode === kode) ??
    dataDasar.find((b) => b.kode === kode) ??
    null
  );
}

function hapusPermanen(kode: string) {
  try {
    const tersimpan = bacaJson<DataBarang[]>(KEY_TERSIMPAN, []).filter(
      (b) => b.kode !== kode,
    );
    localStorage.setItem(KEY_TERSIMPAN, JSON.stringify(tersimpan));
    const dihapus = new Set(bacaJson<string[]>(KEY_DIHAPUS, []));
    dihapus.add(kode);
    localStorage.setItem(KEY_DIHAPUS, JSON.stringify([...dihapus]));
    sessionStorage.removeItem(KEY_TERPILIH);
  } catch {
    /* abaikan */
  }
}

function kembaliKeMaster() {
  try {
    sessionStorage.removeItem(KEY_TERPILIH);
  } catch {
    /* abaikan */
  }
  window.location.hash = HASH_MASTER;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* --------------------------- Komponen kecil --------------------------- */

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex w-full shrink-0 flex-col items-start gap-[18px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[22px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
      {children}
    </div>
  );
}

function Heading({
  title,
  icon: Icon,
}: {
  title: string;
  icon: typeof PackageSearch;
}) {
  return (
    <div className="flex items-center gap-[10px]">
      <div className="flex size-[34px] items-center justify-center rounded-[8px] bg-[#eaf2ff] text-[#1769e0]">
        <Icon size={16} />
      </div>
      <p className="text-[15px] font-normal not-italic text-[#172b4d]">
        {title}
      </p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex min-w-px flex-[1_0_0] flex-col gap-[4px] font-normal not-italic leading-[normal]">
      <p className="text-[11px] text-[#64748b]">{label}</p>
      <p className="text-[14px] text-[#172b4d]">{value}</p>
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex w-full items-start gap-[16px]">{children}</div>;
}

/* ------------------------------ Halaman ------------------------------ */

export default function DetailBarangScreen() {
  const { user } = useAuth();

  const barang = useMemo(() => {
    try {
      return cariBarang(sessionStorage.getItem(KEY_TERPILIH));
    } catch {
      return null;
    }
  }, []);

  const [konfirmasi, setKonfirmasi] = useState(false);

  useEffect(() => {
    if (!konfirmasi) return;
    const esc = (e: KeyboardEvent) =>
      e.key === "Escape" && setKonfirmasi(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [konfirmasi]);

  const edit = () => {
    if (!barang) return;
    try {
      sessionStorage.setItem(KEY_TERPILIH, barang.kode);
    } catch {
      /* abaikan */
    }
    window.location.hash = "form";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hapus = () => {
    if (!barang) return;
    hapusPermanen(barang.kode);
    setKonfirmasi(false);
    kembaliKeMaster();
  };

  const [gudang, rak] = barang ? barang.lokasi.split(" · ") : ["", ""];

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

        <div className="flex w-full shrink-0 flex-col items-start gap-[24px] overflow-clip p-[32px]">
          {/* Heading + aksi */}
          <div className="flex w-full shrink-0 items-center justify-between gap-[16px] font-normal not-italic">
            <div className="flex min-w-px flex-[1_0_0] flex-col gap-[5px] leading-[normal]">
              <p className="text-[26px] text-[#172b4d]">Detail Barang</p>
              <p className="text-[14px] text-[#64748b]">
                Lihat informasi lengkap, ubah data, atau hapus barang.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-[9px]">
              <button
                type="button"
                onClick={kembaliKeMaster}
                className="flex h-[40px] cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] text-[#64748b] hover:bg-[#f8fafc]"
              >
                <ChevronLeft size={16} />
                <span className="whitespace-nowrap text-[14px]">Kembali</span>
              </button>
              {barang && (
                <>
                  <button
                    type="button"
                    onClick={edit}
                    className="flex h-[40px] cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-white hover:bg-[#0e4fab]"
                  >
                    <Pencil size={16} />
                    <span className="whitespace-nowrap text-[14px]">Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setKonfirmasi(true)}
                    className="flex h-[40px] cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-solid border-[#c2413a] bg-white px-[15px] text-[#c2413a] hover:bg-[#fef0ef]"
                  >
                    <Trash2 size={16} />
                    <span className="whitespace-nowrap text-[14px]">Hapus</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {!barang ? (
            <Card>
              <p className="text-[14px] font-normal not-italic text-[#172b4d]">
                Barang tidak ditemukan.
              </p>
              <p className="text-[12px] font-normal not-italic text-[#64748b]">
                Barang mungkin sudah dihapus. Kembali ke Master Barang untuk
                memilih barang lain.
              </p>
            </Card>
          ) : (
            <>
              {/* Ringkas */}
              <Card>
                <div className="flex w-full items-center justify-between gap-[12px] font-normal not-italic">
                  <div className="flex flex-col gap-[4px] leading-[normal]">
                    <p className="text-[11px] text-[#1769e0]">{barang.kode}</p>
                    <p className="text-[20px] text-[#172b4d]">{barang.nama}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-[8px]">
                    <div
                      className={`flex items-center gap-[5px] rounded-[999px] px-[10px] py-[5px] text-[12px] ${
                        barang.menipis
                          ? "bg-[#fef0ef] text-[#c2413a]"
                          : "bg-[#eaf8ef] text-[#15803d]"
                      }`}
                    >
                      {barang.menipis ? (
                        <CircleAlert size={12} />
                      ) : (
                        <CircleCheck size={12} />
                      )}
                      {barang.menipis ? "Stok menipis" : "Stok tersedia"}
                    </div>
                    <div
                      className={`rounded-[999px] px-[10px] py-[5px] text-[12px] ${
                        barang.aktif
                          ? "bg-[#eaf2ff] text-[#1769e0]"
                          : "bg-[#f1f5f9] text-[#64748b]"
                      }`}
                    >
                      {barang.aktif ? "Aktif" : "Nonaktif"}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Informasi */}
              <Card>
                <Heading title="Informasi barang" icon={PackageSearch} />
                <Row>
                  <Info label="Kategori" value={barang.kategori} />
                  <Info
                    label="Satuan"
                    value={barang.stok.split(" ")[1] ?? "-"}
                  />
                </Row>
                <Row>
                  <Info label="Merek" value={barang.merek || "-"} />
                  <Info label="Tipe / model" value={barang.model || "-"} />
                </Row>
                <Row>
                  <Info label="Deskripsi" value={barang.deskripsi || "-"} />
                </Row>
              </Card>

              {/* Stok & lokasi */}
              <Card>
                <Heading title="Stok & lokasi" icon={Warehouse} />
                <Row>
                  <Info label="Stok saat ini" value={barang.stok} />
                  <Info label="Stok minimum" value={barang.minimum} />
                </Row>
                <Row>
                  <Info label="Lokasi penyimpanan" value={gudang} />
                  <Info label="Rak / bin" value={rak || "-"} />
                </Row>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Konfirmasi hapus */}
      {konfirmasi && barang && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172b4d]/40 p-4"
          onClick={() => setKonfirmasi(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Konfirmasi hapus barang"
        >
          <div
            className="w-full max-w-[420px] rounded-[12px] bg-white p-[24px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[18px] text-[#172b4d]">Hapus barang ini?</p>
            <p className="mt-[8px] text-[13px] leading-[1.5] text-[#64748b]">
              {barang.nama} akan dihapus dari daftar. Tindakan ini tidak bisa
              dibatalkan.
            </p>
            <div className="mt-[20px] flex justify-end gap-[8px]">
              <button
                type="button"
                onClick={() => setKonfirmasi(false)}
                className="h-[40px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] text-[14px] text-[#64748b] hover:bg-[#f3f6fa]"
              >
                Tidak jadi
              </button>
              <button
                type="button"
                onClick={hapus}
                className="h-[40px] rounded-[8px] border border-solid border-[#c2413a] bg-[#c2413a] px-[15px] text-[14px] text-white hover:bg-[#a8352f]"
              >
                Ya, hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
