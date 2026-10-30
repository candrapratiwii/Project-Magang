import { useEffect, useState, type ReactNode } from "react";
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
import { apiRequest } from "../api";

const HASH_MASTER = "master";
const KEY_TERPILIH = "simpera-barang-terpilih";

interface DataBarang {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  kategoriId: string;
  satuan: string;
  lokasi: string;
  stok: number;
  minimum: number;
  deskripsi: string;
  aktif: boolean;
}

type StatusMuat = "memuat" | "siap" | "gagal";

const bukaData = <T,>(raw: unknown): T =>
  (raw && typeof raw === "object" && "data" in raw
    ? (raw as { data: T }).data
    : raw) as T;

function ambil(
  o: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const key of keys) {
    if (o[key] !== undefined && o[key] !== null) {
      return String(o[key]);
    }
  }
  return "";
}

function formatStok(stok: number, satuan: string) {
  return `${stok} ${satuan || "unit"}`;
}

function kembaliKeMaster() {
  try {
    sessionStorage.removeItem(KEY_TERPILIH);
  } catch {
    // Abaikan jika sessionStorage tidak tersedia.
  }

  window.location.hash = HASH_MASTER;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

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

function Info({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex min-w-px flex-[1_0_0] flex-col gap-[4px] font-normal not-italic leading-[normal]">
      <p className="text-[11px] text-[#64748b]">{label}</p>
      <p className="break-words text-[14px] text-[#172b4d]">
        {value}
      </p>
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-start gap-[16px]">
      {children}
    </div>
  );
}

export default function DetailBarangScreen() {
  const { user } = useAuth();
  const isAdmin = String(user?.role ?? "").toLowerCase() === "admin";

  const [barang, setBarang] = useState<DataBarang | null>(null);
  const [status, setStatus] = useState<StatusMuat>("memuat");
  const [pesanError, setPesanError] = useState("");
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [menghapus, setMenghapus] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let batal = false;

    async function muatBarang() {
      setStatus("memuat");
      setPesanError("");

      let kodeTerpilih: string | null = null;

      try {
        kodeTerpilih = sessionStorage.getItem(KEY_TERPILIH);
      } catch {
        // Abaikan jika sessionStorage tidak tersedia.
      }

      if (!kodeTerpilih) {
        if (!batal) {
          setBarang(null);
          setStatus("gagal");
          setPesanError(
            "Barang belum dipilih. Kembali ke Master Barang dan pilih Detail.",
          );
        }
        return;
      }

      try {
        const raw = await apiRequest<unknown>("/barang");
        const data = bukaData<unknown>(raw);
        const daftar = Array.isArray(data) ? data : [];

        const item = daftar.find(
          (value) =>
            value &&
            typeof value === "object" &&
            ambil(
              value as Record<string, unknown>,
              "kode_barang",
              "kode",
            ) === kodeTerpilih,
        ) as Record<string, unknown> | undefined;

        if (!item) {
          throw new Error(
            "Barang tidak ditemukan pada data backend.",
          );
        }

        const kategoriRelasi =
          item.kategori_barang &&
          typeof item.kategori_barang === "object"
            ? (item.kategori_barang as Record<string, unknown>)
            : item.kategoriBarang &&
                typeof item.kategoriBarang === "object"
              ? (item.kategoriBarang as Record<string, unknown>)
              : {};

        const namaKategori =
          ambil(
            kategoriRelasi,
            "nama_kategori",
            "nama",
          ) || "Tidak diketahui";

        const dataBarang: DataBarang = {
          id: ambil(item, "id"),
          kode: ambil(item, "kode_barang", "kode"),
          nama: ambil(item, "nama_barang", "nama"),
          kategori: namaKategori,
          kategoriId: ambil(
            item,
            "kategori_barang_id",
            "kategori_id",
          ),
          satuan: ambil(item, "satuan") || "unit",
          lokasi:
            ambil(item, "lokasi") || "Tempat Penyimpanan",
          stok: Number(item.stok ?? 0),
          minimum: Number(
            item.stok_minimum ?? item.minimum ?? 0,
          ),
          deskripsi: ambil(item, "deskripsi"),
          aktif:
            item.aktif !== false &&
            item.is_active !== false &&
            item.status !== "nonaktif",
        };

        if (!batal) {
          setBarang(dataBarang);
          setStatus("siap");
        }
      } catch (err) {
        if (batal) return;

        setBarang(null);
        setStatus("gagal");
        setPesanError(
          err instanceof Error
            ? err.message
            : "Data barang gagal dimuat. Periksa koneksi backend.",
        );
      }
    }

    void muatBarang();

    return () => {
      batal = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!konfirmasi) return;

    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setKonfirmasi(false);
    };

    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [konfirmasi]);

  const edit = () => {
    if (!isAdmin || !barang) return;

    try {
      sessionStorage.setItem(KEY_TERPILIH, barang.kode);
    } catch {
      setToast("Tidak dapat menyimpan pilihan barang.");
      return;
    }

    window.location.hash = "form";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hapus = async () => {
    if (!isAdmin || !barang || menghapus) return;

    setMenghapus(true);

    try {
      await apiRequest(
        `/barang/${encodeURIComponent(barang.id)}`,
        { method: "DELETE" },
      );

      setKonfirmasi(false);
      kembaliKeMaster();
    } catch (err) {
      setToast(
        err instanceof Error
          ? err.message
          : "Barang gagal dihapus. Silakan coba lagi.",
      );
      setMenghapus(false);
    }
  };

  const satuanTampil =
    barang?.satuan
      ? barang.satuan.charAt(0).toUpperCase() +
        barang.satuan.slice(1)
      : "-";

  const lokasi = barang?.lokasi || "-";
  const menipis =
    !!barang && barang.stok <= barang.minimum;

  return (
    <div className="relative flex size-full items-start bg-[#f3f6fa]">
      <Sidebar active="Master Barang" />

      <div className="relative flex min-h-[1040px] min-w-px flex-[1_0_0] flex-col items-start overflow-clip">
        <div className="flex h-[76px] w-full shrink-0 items-center justify-between overflow-clip whitespace-nowrap border-b border-solid border-[#dce4ee] bg-white px-[32px] not-italic leading-[normal]">
          <p className="shrink-0 text-[16px] font-bold text-[#172b4d]">
            Sistem Persediaan Infrastruktur TIK
          </p>

          <p className="shrink-0 text-[12px] font-normal text-[#64748b]">
            {user?.nama} · {user?.role}
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col items-start gap-[24px] overflow-clip p-[32px]">
          <div className="flex w-full shrink-0 items-center justify-between gap-[16px] font-normal not-italic">
            <div className="flex min-w-px flex-[1_0_0] flex-col gap-[5px] leading-[normal]">
              <p className="text-[26px] text-[#172b4d]">
                Detail Barang
              </p>
              <p className="text-[14px] text-[#64748b]">
                {isAdmin
                  ? "Lihat informasi lengkap, ubah data, atau kelola barang."
                  : "Lihat informasi lengkap data barang."}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-[9px]">
              <button
                type="button"
                onClick={kembaliKeMaster}
                className="flex h-[40px] cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] text-[#64748b] hover:bg-[#f8fafc]"
              >
                <ChevronLeft size={16} />
                <span className="whitespace-nowrap text-[14px]">
                  Kembali
                </span>
              </button>

              {barang && isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={edit}
                    className="flex h-[40px] cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-white hover:bg-[#0e4fab]"
                  >
                    <Pencil size={16} />
                    <span className="whitespace-nowrap text-[14px]">
                      Edit
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setKonfirmasi(true)}
                    className="flex h-[40px] cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-solid border-[#c2413a] bg-white px-[15px] text-[#c2413a] hover:bg-[#fef0ef]"
                  >
                    <Trash2 size={16} />
                    <span className="whitespace-nowrap text-[14px]">
                      Hapus
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          {status === "memuat" ? (
            <Card>
              <p className="text-[14px] text-[#172b4d]">
                Memuat detail barang dari server...
              </p>
            </Card>
          ) : !barang ? (
            <Card>
              <p className="text-[14px] font-normal text-[#172b4d]">
                Barang tidak ditemukan.
              </p>
              <p className="text-[12px] text-[#64748b]">
                {pesanError ||
                  "Kembali ke Master Barang dan pilih barang yang ingin dilihat."}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-[12px] text-[#1769e0] hover:underline"
              >
                Coba muat ulang
              </button>
            </Card>
          ) : (
            <>
              <Card>
                <div className="flex w-full items-center justify-between gap-[12px] font-normal not-italic">
                  <div className="flex min-w-0 flex-col gap-[4px] leading-[normal]">
                    <p className="text-[11px] text-[#1769e0]">
                      {barang.kode}
                    </p>
                    <p className="break-words text-[20px] text-[#172b4d]">
                      {barang.nama}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-[8px]">
                    <div
                      className={`flex items-center gap-[5px] rounded-[999px] px-[10px] py-[5px] text-[12px] ${
                        menipis
                          ? "bg-[#fef0ef] text-[#c2413a]"
                          : "bg-[#eaf8ef] text-[#15803d]"
                      }`}
                    >
                      {menipis ? (
                        <CircleAlert size={12} />
                      ) : (
                        <CircleCheck size={12} />
                      )}
                      {menipis ? "Stok menipis" : "Stok tersedia"}
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

              <Card>
                <Heading
                  title="Informasi barang"
                  icon={PackageSearch}
                />

                <Row>
                  <Info
                    label="Kategori"
                    value={barang.kategori}
                  />
                  <Info label="Satuan" value={satuanTampil} />
                </Row>

                <Row>
                  <Info label="Kode barang" value={barang.kode} />
                  <Info label="Nama barang" value={barang.nama} />
                </Row>

                <Row>
                  <Info
                    label="Deskripsi"
                    value={barang.deskripsi || "-"}
                  />
                </Row>
              </Card>

              <Card>
                <Heading title="Stok & lokasi" icon={Warehouse} />

                <Row>
                  <Info
                    label="Stok saat ini"
                    value={formatStok(barang.stok, barang.satuan)}
                  />
                  <Info
                    label="Stok minimum"
                    value={formatStok(
                      barang.minimum,
                      barang.satuan,
                    )}
                  />
                </Row>

                <Row>
                  <Info
                    label="Lokasi penyimpanan"
                    value={lokasi}
                  />
                </Row>
              </Card>
            </>
          )}
        </div>
      </div>

      {konfirmasi && barang && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172b4d]/40 p-4"
          onClick={() => !menghapus && setKonfirmasi(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Konfirmasi hapus barang"
        >
          <div
            className="w-full max-w-[420px] rounded-[12px] bg-white p-[24px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[18px] text-[#172b4d]">
              Hapus barang ini?
            </p>

            <p className="mt-[8px] text-[13px] leading-[1.5] text-[#64748b]">
              {barang.nama} akan diproses melalui backend. Tindakan
              ini mungkin tidak bisa dibatalkan.
            </p>

            <div className="mt-[20px] flex justify-end gap-[8px]">
              <button
                type="button"
                disabled={menghapus}
                onClick={() => setKonfirmasi(false)}
                className="h-[40px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] text-[14px] text-[#64748b] hover:bg-[#f3f6fa] disabled:opacity-60"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={menghapus}
                onClick={hapus}
                className="h-[40px] rounded-[8px] border border-solid border-[#c2413a] bg-[#c2413a] px-[15px] text-[14px] text-white hover:bg-[#a8352f] disabled:opacity-60"
              >
                {menghapus ? "Menghapus..." : "Ya, hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-[24px] right-[24px] z-50 max-w-[360px] rounded-[10px] bg-[#172b4d] px-[16px] py-[12px] shadow-lg"
        >
          <p className="text-[13px] leading-[1.4] text-white">
            {toast}
          </p>
        </div>
      )}
    </div>
  );
}