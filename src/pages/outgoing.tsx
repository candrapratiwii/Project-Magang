
import { useCallback, useEffect, useState } from "react";
import {
  Save,
  CircleHelp,
  Download,
  ArrowRight,
  PackageCheck,
  Plus,
  X,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { useAuth } from "../auth";
import { apiRequest } from "../api";

/* ------------------------------ Tipe Data ------------------------------ */

interface BarangApi {
  id: number;
  kode_barang: string;
  nama_barang: string;
  satuan: string;
  stok: number;
  stok_minimum: number;
}

interface ResponsBarang {
  message: string;
  data: BarangApi[];
}

interface MutasiApi {
  id: number;
  barang_id: number;
  user_id: number;
  jenis_mutasi: "masuk" | "keluar";
  jumlah: number;
  stok_sebelum: number;
  stok_sesudah: number;
  keterangan: string | null;
  created_at: string;
  barang?: BarangApi;
}

interface ResponsMutasi {
  message: string;
  data: MutasiApi[];
}

interface Item {
  barangId: number;
  nama: string;
  satuan: string;
  jumlah: number;
}

interface Transaksi {
  id: number;
  nomor: string;
  tanggal: string;
  pihak: string;
  jumlah: string;
  namaBarang: string;
  penerima: string;
  keterangan: string;
}

interface Draf {
  unit: string;
  penerima: string;
  keterangan: string;
  items: Item[];
}

interface Errors {
  unit?: string;
  penerima?: string;
  items?: string;
}

const daftarUnit = [
  "Bidang Aplikasi Informatika",
  "Bidang IKP",
  "Bidang Persandian",
  "UPTD Jaringan",
  "Sekretariat",
];

const DRAF_KEY = "simpera-draf-barang-keluar";

/* ------------------------------ Utilitas ------------------------------ */

function bacaDraf(): Draf | null {
  try {
    const raw = localStorage.getItem(DRAF_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as Draf;

    return {
      unit: data.unit ?? "",
      penerima: data.penerima ?? "",
      keterangan: data.keterangan ?? "",
      items: Array.isArray(data.items) ? data.items : [],
    };
  } catch {
    return null;
  }
}

function formatTanggal(value: string): string {
  const tanggal = new Date(value);

  if (Number.isNaN(tanggal.getTime())) return "-";

  return tanggal.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatNomor(id: number, createdAt: string): string {
  const tanggal = new Date(createdAt);
  const tahun = Number.isNaN(tanggal.getTime())
    ? new Date().getFullYear()
    : tanggal.getFullYear();

  return `BK-${tahun}-${String(id).padStart(4, "0")}`;
}

function ambilKeterangan(
  keterangan: string | null,
  label: string,
): string {
  if (!keterangan) return "-";

  const cocok = keterangan.match(
    new RegExp(`(?:^|\\|\\s*)${label}:\\s*([^|]+)`, "i"),
  );

  return cocok?.[1]?.trim() || "-";
}

function ringkasJumlah(items: Item[]): string {
  const total = items.reduce((sum, item) => sum + item.jumlah, 0);
  const satuan = [...new Set(items.map((item) => item.satuan))];

  return satuan.length === 1
    ? `${total} ${satuan[0]}`
    : `${total} item`;
}

function unduhCsv(rows: Transaksi[]) {
  const header = [
    "Nomor",
    "Tanggal",
    "Unit penerima",
    "Nama penerima",
    "Nama barang",
    "Jumlah",
    "Keterangan",
  ];

  const esc = (value: string) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const isi = [
    header,
    ...rows.map((row) => [
      row.nomor,
      row.tanggal,
      row.pihak,
      row.penerima,
      row.namaBarang,
      row.jumlah,
      row.keterangan,
    ]),
  ]
    .map((row) => row.map(esc).join(";"))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + isi], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `barang-keluar-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/* ------------------------------ Komponen ------------------------------ */

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-[7px]">
      <p className="text-[12px] text-[#172b4d]">{label}</p>

      <input
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        aria-invalid={!!error}
        className={`h-[42px] w-full rounded-[8px] border px-[12px] text-[14px] outline-none placeholder:text-[#94a3b8] ${
          readOnly
            ? "border-[#dce4ee] bg-[#f8fafc] text-[#64748b]"
            : error
              ? "border-[#c2413a] bg-white text-[#172b4d]"
              : "border-[#dce4ee] bg-white text-[#172b4d] focus:border-[#1769e0]"
        }`}
      />

      {error && (
        <p className="text-[11px] text-[#c2413a]">{error}</p>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-[7px]">
      <p className="text-[12px] text-[#172b4d]">{label}</p>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={!!error}
        disabled={disabled}
        className={`h-[42px] w-full rounded-[8px] border bg-white px-[10px] text-[14px] outline-none disabled:opacity-60 ${
          value ? "text-[#172b4d]" : "text-[#94a3b8]"
        } ${
          error
            ? "border-[#c2413a]"
            : "border-[#dce4ee] focus:border-[#1769e0]"
        }`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-[11px] text-[#c2413a]">{error}</p>
      )}
    </div>
  );
}

function StatusDiserahkan() {
  return (
    <div className="flex shrink-0 items-center gap-[5px] rounded-full bg-[#eaf2ff] px-[9px] py-[5px]">
      <PackageCheck size={12} className="text-[#1769e0]" />
      <span className="text-[12px] text-[#1769e0]">Diserahkan</span>
    </div>
  );
}

const langkahPanduan = [
  "Pilih unit penerima dan isi nama penerima. Keduanya wajib diisi.",
  "Pilih barang dari database dan isi jumlahnya. Jumlah tidak boleh melebihi stok tersedia.",
  "Periksa barang terpilih dan total transaksi. Hapus barang yang salah dengan tombol X.",
  "Klik Simpan draf jika belum selesai. Draf disimpan di perangkat ini.",
  "Klik Simpan transaksi jika sudah benar. Stok berkurang dan mutasi tersimpan di database.",
];

/* ------------------------------ Halaman ------------------------------ */

export default function BarangKeluarScreen() {
  const { user } = useAuth();

  const [barang, setBarang] = useState<BarangApi[]>([]);
  const [riwayat, setRiwayat] = useState<Transaksi[]>([]);

  const [memuatBarang, setMemuatBarang] = useState(true);
  const [memuatRiwayat, setMemuatRiwayat] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);

  const [semua, setSemua] = useState(false);
  const [panduan, setPanduan] = useState(false);

  const [unit, setUnit] = useState(() => bacaDraf()?.unit ?? "");
  const [penerima, setPenerima] = useState(
    () => bacaDraf()?.penerima ?? "",
  );
  const [keterangan, setKeterangan] = useState(
    () => bacaDraf()?.keterangan ?? "",
  );
  const [items, setItems] = useState<Item[]>(
    () => bacaDraf()?.items ?? [],
  );
  const [adaDraf, setAdaDraf] = useState(
    () => bacaDraf() !== null,
  );

  const [pilihBarangId, setPilihBarangId] = useState("");
  const [pilihJumlah, setPilihJumlah] = useState("");
  const [errItem, setErrItem] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [toast, setToast] = useState("");

  const sekarang = new Date();

  const tanggalPanjang = sekarang.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const waktu =
    sekarang.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WITA";

  const totalJumlah = items.reduce(
    (sum, item) => sum + item.jumlah,
    0,
  );

  const tampilRiwayat = semua ? riwayat : riwayat.slice(0, 4);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(""), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!panduan) return;

    const tutupDenganEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanduan(false);
    };

    window.addEventListener("keydown", tutupDenganEscape);

    return () => {
      window.removeEventListener("keydown", tutupDenganEscape);
    };
  }, [panduan]);

  /* ------------------------------ Ambil Barang ------------------------------ */

  const muatBarang = useCallback(async () => {
    setMemuatBarang(true);

    try {
      const response =
        await apiRequest<ResponsBarang>("/barang");

      const daftar = Array.isArray(response.data)
        ? response.data
        : [];

      setBarang(daftar);

      // Cocokkan draf dengan barang di database.
      setItems((sebelumnya) =>
        sebelumnya
          .map((item) => {
            const cocok = daftar.find(
              (b) =>
                b.id === item.barangId ||
                b.nama_barang === item.nama,
            );

            if (!cocok) return null;

            return {
              barangId: cocok.id,
              nama: cocok.nama_barang,
              satuan: cocok.satuan,
              jumlah: item.jumlah,
            };
          })
          .filter((item): item is Item => item !== null),
      );
    } catch (error) {
      setToast(
        error instanceof Error
          ? `Gagal memuat barang: ${error.message}`
          : "Gagal memuat daftar barang.",
      );
    } finally {
      setMemuatBarang(false);
    }
  }, []);

  /* ------------------------------ Ambil Riwayat ------------------------------ */

  const muatRiwayat = useCallback(async () => {
    setMemuatRiwayat(true);

    try {
      const response =
        await apiRequest<ResponsMutasi>("/mutasi-stok");

      const daftar = (response.data ?? [])
        .filter((mutasi) => mutasi.jenis_mutasi === "keluar")
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime(),
        );

      setRiwayat(
        daftar.map((mutasi) => ({
          id: mutasi.id,
          nomor: formatNomor(mutasi.id, mutasi.created_at),
          tanggal: formatTanggal(mutasi.created_at),
          pihak: ambilKeterangan(mutasi.keterangan, "Unit"),
          penerima: ambilKeterangan(
            mutasi.keterangan,
            "Penerima",
          ),
          jumlah: `${mutasi.jumlah} ${
            mutasi.barang?.satuan ?? "item"
          }`,
          namaBarang:
            mutasi.barang?.nama_barang ??
            `Barang ID ${mutasi.barang_id}`,
          keterangan: mutasi.keterangan ?? "-",
        })),
      );
    } catch (error) {
      setToast(
        error instanceof Error
          ? `Gagal memuat riwayat: ${error.message}`
          : "Gagal memuat riwayat barang keluar.",
      );
    } finally {
      setMemuatRiwayat(false);
    }
  }, []);

  useEffect(() => {
    void muatBarang();
    void muatRiwayat();
  }, [muatBarang, muatRiwayat]);

  /* ------------------------------ Kelola Item ------------------------------ */

  const tambahItem = () => {
    const terpilih = barang.find(
      (item) => String(item.id) === pilihBarangId,
    );

    const jumlah = Number(pilihJumlah);

    if (
      !terpilih ||
      !Number.isInteger(jumlah) ||
      jumlah <= 0
    ) {
      setErrItem(
        "Pilih barang dan isi jumlah berupa angka bulat lebih dari 0.",
      );
      return;
    }

    const sudahDiForm =
      items.find((item) => item.barangId === terpilih.id)
        ?.jumlah ?? 0;

    const tersedia = terpilih.stok - sudahDiForm;

    if (jumlah > tersedia) {
      setErrItem(
        `Stok tidak cukup. Tersedia ${Math.max(
          tersedia,
          0,
        )} ${terpilih.satuan}.`,
      );
      return;
    }

    setErrItem("");
    setErrors((previous) => ({
      ...previous,
      items: undefined,
    }));

    setItems((previous) => {
      const sudahAda = previous.find(
        (item) => item.barangId === terpilih.id,
      );

      if (sudahAda) {
        return previous.map((item) =>
          item.barangId === terpilih.id
            ? { ...item, jumlah: item.jumlah + jumlah }
            : item,
        );
      }

      return [
        ...previous,
        {
          barangId: terpilih.id,
          nama: terpilih.nama_barang,
          satuan: terpilih.satuan,
          jumlah,
        },
      ];
    });

    setPilihBarangId("");
    setPilihJumlah("");
  };

  const hapusItem = (barangId: number) => {
    setItems((previous) =>
      previous.filter((item) => item.barangId !== barangId),
    );
    setErrItem("");
  };

  const resetForm = () => {
    setUnit("");
    setPenerima("");
    setKeterangan("");
    setItems([]);
    setPilihBarangId("");
    setPilihJumlah("");
    setErrItem("");
    setErrors({});
  };

  /* ------------------------------ Draf ------------------------------ */

  const simpanDraf = () => {
    if (
      !unit &&
      !penerima.trim() &&
      !keterangan.trim() &&
      items.length === 0
    ) {
      setToast("Belum ada isian yang bisa disimpan sebagai draf.");
      return;
    }

    try {
      localStorage.setItem(
        DRAF_KEY,
        JSON.stringify({ unit, penerima, keterangan, items }),
      );

      setAdaDraf(true);
      setErrors({});
      setToast("Draf tersimpan di perangkat ini.");
    } catch {
      setToast("Draf gagal disimpan.");
    }
  };

  const hapusDraf = () => {
    try {
      localStorage.removeItem(DRAF_KEY);
    } catch {
      // Abaikan kegagalan penghapusan draf.
    }

    setAdaDraf(false);
    setToast("Draf dihapus.");
  };

  /* ------------------------------ Simpan Transaksi ------------------------------ */

  const simpanTransaksi = async () => {
    const errorBaru: Errors = {};

    if (!unit) {
      errorBaru.unit = "Unit penerima wajib dipilih.";
    }

    if (!penerima.trim()) {
      errorBaru.penerima = "Nama penerima wajib diisi.";
    }

    if (items.length === 0) {
      errorBaru.items = "Tambahkan minimal satu barang.";
    }

    // Periksa stok terbaru sebelum menyimpan.
    for (const item of items) {
      const terbaru = barang.find(
        (b) => b.id === item.barangId,
      );

      if (!terbaru || item.jumlah > terbaru.stok) {
        errorBaru.items = terbaru
          ? `Stok ${item.nama} tidak mencukupi. Tersedia ${terbaru.stok} ${terbaru.satuan}.`
          : `Barang ${item.nama} tidak ditemukan di database.`;

        break;
      }
    }

    setErrors(errorBaru);

    if (Object.keys(errorBaru).length > 0) return;

    setMenyimpan(true);

    const berhasil: number[] = [];
    const gagal: string[] = [];

    try {
      for (const item of items) {
        try {
          const keteranganMutasi = [
            `Unit: ${unit}`,
            `Penerima: ${penerima.trim()}`,
            keterangan.trim()
              ? `Keterangan: ${keterangan.trim()}`
              : "",
          ]
            .filter(Boolean)
            .join(" | ");

          await apiRequest("/mutasi-stok", {
            method: "POST",
            body: JSON.stringify({
              barang_id: item.barangId,
              jenis_mutasi: "keluar",
              jumlah: item.jumlah,
              keterangan: keteranganMutasi,
            }),
          });

          berhasil.push(item.barangId);
        } catch (error) {
          gagal.push(
            `${item.nama}: ${
              error instanceof Error
                ? error.message
                : "Gagal menyimpan"
            }`,
          );

          // Berhenti agar kegagalan tidak diteruskan ke barang berikutnya.
          break;
        }
      }

      await Promise.all([muatBarang(), muatRiwayat()]);

      if (gagal.length > 0) {
        const sisaItems = items.filter(
          (item) => !berhasil.includes(item.barangId),
        );

        setItems(sisaItems);

        if (berhasil.length > 0) {
          try {
            localStorage.setItem(
              DRAF_KEY,
              JSON.stringify({
                unit,
                penerima,
                keterangan,
                items: sisaItems,
              }),
            );

            setAdaDraf(true);
          } catch {
            // Transaksi yang sudah berhasil tetap tersimpan.
          }
        }

        setToast(
          berhasil.length > 0
            ? `${berhasil.length} barang berhasil dicatat. Penyimpanan berikutnya gagal: ${gagal[0]}`
            : `Transaksi gagal: ${gagal[0]}`,
        );

        return;
      }

      try {
        localStorage.removeItem(DRAF_KEY);
      } catch {
        // Abaikan kegagalan penghapusan draf.
      }

      setAdaDraf(false);
      resetForm();
      setSemua(false);

      setToast(
        `${berhasil.length} barang berhasil dicatat. Stok telah diperbarui.`,
      );
    } finally {
      setMenyimpan(false);
    }
  };

  /* ------------------------------ Tampilan ------------------------------ */

  return (
    <div className="relative flex size-full items-start bg-[#f3f6fa]">
      <Sidebar active="Barang Keluar" />

      <div className="relative flex min-h-[1080px] min-w-0 flex-1 flex-col items-start">
        {/* Top bar */}
        <div className="flex h-[76px] w-full shrink-0 items-center justify-between border-b border-[#dce4ee] bg-white px-[32px]">
          <p className="text-[16px] font-bold text-[#172b4d]">
            Sistem Persediaan Infrastruktur TIK
          </p>

          <p className="text-[12px] text-[#64748b]">
            {user?.nama} · {user?.role}
          </p>
        </div>

        {/* Konten halaman */}
        <div className="flex w-full flex-col gap-[24px] p-[32px]">
          <div className="flex w-full items-center justify-between gap-4">
            <div>
              <h1 className="text-[26px] text-[#172b4d]">
                Barang Keluar
              </h1>

              <p className="mt-[5px] text-[14px] text-[#64748b]">
                Catat penyerahan barang dan pantau riwayat stok keluar
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setPanduan(true)}
                className="flex h-[40px] items-center gap-[8px] rounded-[8px] border border-[#dce4ee] bg-white px-[15px] text-[#64748b] hover:bg-[#f8fafc]"
              >
                <CircleHelp size={16} />
                Panduan
              </button>

              <button
                type="button"
                onClick={() => {
                  void muatBarang();
                  void muatRiwayat();
                }}
                className="flex h-[40px] items-center gap-[8px] rounded-[8px] border border-[#dce4ee] bg-white px-[15px] text-[#1769e0] hover:bg-[#f8fafc]"
              >
                <RefreshCw size={15} />
                Muat ulang
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[18px] xl:flex-row">
            {/* Form transaksi */}
            <div className="flex w-full shrink-0 flex-col gap-[16px] rounded-[12px] border border-[#dce4ee] bg-white p-[20px] shadow-sm xl:w-[430px]">
              <div className="flex w-full flex-col gap-[5px] rounded-[8px] bg-[#f2ecff] p-[15px]">
                <p className="text-[15px] text-[#7c3aed]">
                  Transaksi keluar baru
                </p>
                <p className="text-[11px] text-[#64748b]">
                  {tanggalPanjang} · {waktu}
                </p>
              </div>

              {adaDraf && (
                <div className="flex w-full items-center justify-between gap-2 rounded-[8px] bg-[#eaf2ff] px-[12px] py-[8px]">
                  <p className="text-[11px] text-[#0e4fab]">
                    Draf tersimpan di perangkat ini
                  </p>

                  <button
                    type="button"
                    onClick={hapusDraf}
                    className="text-[11px] text-[#1769e0] hover:underline"
                  >
                    Hapus draf
                  </button>
                </div>
              )}

              <div className="flex w-full items-start gap-[10px]">
                <Field label="Tanggal" value={tanggalPanjang} readOnly />
                <Field label="Waktu" value={waktu} readOnly />
              </div>

              
              <Field
                label="Unit penerima *"
                value={unit}
                onChange={(value) => {
                  setUnit(value);
                  setErrors((previous) => ({
                    ...previous,
                    unit: undefined,
                  }));
                }}
                placeholder="Contoh: Bidang Aplikasi Informatika"
                error={errors.unit}
              />
              <Field
                label="Nama penerima *"
                value={penerima}
                onChange={(value) => {
                  setPenerima(value);
                  setErrors((previous) => ({
                    ...previous,
                    penerima: undefined,
                  }));
                }}
                placeholder="Contoh: I Putu Gede Wirawan"
                error={errors.penerima}
              />

              {/* Barang terpilih */}
              <div
                className={`flex w-full flex-col gap-[10px] rounded-[8px] bg-[#f8fafc] p-[14px] ${
                  errors.items ? "border border-[#c2413a]" : ""
                }`}
              >
                <p className="text-[11px] text-[#172b4d]">
                  BARANG TERPILIH
                </p>

                {items.length === 0 ? (
                  <p className="text-[12px] text-[#94a3b8]">
                    Belum ada barang. Pilih barang di bawah ini.
                  </p>
                ) : (
                  <div className="flex w-full flex-col gap-[8px]">
                    {items.map((item) => {
                      const dataBarang = barang.find(
                        (b) => b.id === item.barangId,
                      );

                      return (
                        <div
                          key={item.barangId}
                          className="flex w-full items-center justify-between gap-[8px]"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] leading-[1.5] text-[#172b4d]">
                              {item.nama} — {item.jumlah} {item.satuan}
                            </p>

                            <p className="text-[10px] text-[#64748b]">
                              Stok saat ini: {dataBarang?.stok ?? 0}{" "}
                              {item.satuan}
                            </p>
                          </div>

                          <button
                            type="button"
                            aria-label={`Hapus ${item.nama}`}
                            onClick={() => hapusItem(item.barangId)}
                            disabled={menyimpan}
                            className="flex size-[24px] shrink-0 items-center justify-center rounded-[6px] text-[#64748b] hover:bg-[#fef0ef] hover:text-[#c2413a]"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex w-full flex-wrap items-center gap-[6px]">
                  <select
                    value={pilihBarangId}
                    onChange={(event) =>
                      setPilihBarangId(event.target.value)
                    }
                    aria-label="Pilih barang"
                    disabled={memuatBarang || menyimpan}
                    className="h-[36px] min-w-0 flex-1 rounded-[8px] border border-[#dce4ee] bg-white px-[8px] text-[12px] text-[#172b4d] outline-none focus:border-[#1769e0]"
                  >
                    <option value="">
                      {memuatBarang
                        ? "Memuat barang..."
                        : "Pilih barang..."}
                    </option>

                    {barang.map((item) => {
                      const jumlahTerpilih =
                        items.find((i) => i.barangId === item.id)
                          ?.jumlah ?? 0;

                      const sisa = item.stok - jumlahTerpilih;

                      return (
                        <option
                          key={item.id}
                          value={String(item.id)}
                          disabled={sisa <= 0}
                        >
                          {item.kode_barang} — {item.nama_barang} (stok{" "}
                          {Math.max(sisa, 0)} {item.satuan})
                        </option>
                      );
                    })}
                  </select>

                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={pilihJumlah}
                    onChange={(event) =>
                      setPilihJumlah(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        tambahItem();
                      }
                    }}
                    placeholder="Jml"
                    aria-label="Jumlah"
                    disabled={menyimpan}
                    className="h-[36px] w-[64px] rounded-[8px] border border-[#dce4ee] bg-white px-[8px] text-[12px] text-[#172b4d] outline-none focus:border-[#1769e0]"
                  />

                  <button
                    type="button"
                    onClick={tambahItem}
                    disabled={memuatBarang || menyimpan}
                    className="flex h-[36px] shrink-0 items-center gap-[4px] rounded-[8px] border border-[#1769e0] bg-white px-[10px] text-[12px] text-[#1769e0] hover:bg-[#eaf2ff] disabled:opacity-50"
                  >
                    <Plus size={13} />
                    Tambah item
                  </button>
                </div>

                {!memuatBarang && barang.length === 0 && (
                  <p className="text-[11px] text-[#c2413a]">
                    Belum ada barang di database. Tambahkan barang di
                    Master Barang terlebih dahulu.
                  </p>
                )}

                {errItem && (
                  <p className="text-[11px] text-[#c2413a]">
                    {errItem}
                  </p>
                )}

                {errors.items && (
                  <p className="text-[11px] text-[#c2413a]">
                    {errors.items}
                  </p>
                )}
              </div>

              <div className="flex w-full flex-col gap-[7px]">
                <p className="text-[12px] text-[#172b4d]">
                  Keterangan
                </p>

                <input
                  value={keterangan}
                  onChange={(event) =>
                    setKeterangan(event.target.value)
                  }
                  placeholder="Contoh: Untuk instalasi gedung"
                  disabled={menyimpan}
                  className="h-[42px] w-full rounded-[8px] border border-[#dce4ee] bg-white px-[12px] text-[14px] text-[#172b4d] outline-none placeholder:text-[#94a3b8] focus:border-[#1769e0]"
                />
              </div>

              <div className="flex w-full items-center justify-between gap-3 rounded-[8px] bg-[#f2ecff] p-[12px]">
                <p className="text-[11px] text-[#64748b]">
                  Total transaksi
                </p>
                <p className="text-[13px] text-[#7c3aed]">
                  {totalJumlah} item · {items.length} jenis
                </p>
              </div>

              <div className="flex w-full flex-wrap items-center gap-[8px]">
                <button
                  type="button"
                  onClick={simpanDraf}
                  disabled={menyimpan}
                  className="flex h-[40px] min-w-0 flex-1 items-center justify-center rounded-[8px] border border-[#dce4ee] bg-white px-[12px] text-[14px] text-[#1769e0] hover:bg-[#f3f6fa] disabled:opacity-50"
                >
                  Simpan draf
                </button>

                <button
                  type="button"
                  onClick={() => void simpanTransaksi()}
                  disabled={menyimpan || memuatBarang}
                  className="flex h-[40px] min-w-0 flex-1 items-center justify-center gap-[8px] rounded-[8px] border border-[#1769e0] bg-[#1769e0] px-[12px] text-[14px] text-white hover:bg-[#0e4fab] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {menyimpan ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {menyimpan ? "Menyimpan..." : "Simpan transaksi"}
                </button>
              </div>
            </div>

            {/* Riwayat transaksi */}
            <div className="flex min-w-0 w-full flex-1 flex-col rounded-[12px] border border-[#dce4ee] bg-white shadow-sm">
              <div className="flex w-full items-center justify-between gap-3 p-[18px]">
                <div>
                  <p className="text-[15px] text-[#172b4d]">
                    Riwayat barang keluar
                  </p>

                  <p className="mt-[3px] text-[11px] text-[#64748b]">
                    Data mutasi dari database
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => unduhCsv(riwayat)}
                  disabled={riwayat.length === 0}
                  title={`Unduh ${riwayat.length} transaksi (CSV)`}
                  className="flex h-[40px] shrink-0 items-center gap-[8px] rounded-[8px] border border-[#dce4ee] bg-white px-[15px] text-[#1769e0] hover:bg-[#f3f6fa] disabled:opacity-50"
                >
                  <Download size={16} />
                  <span className="text-[14px]">Ekspor</span>
                </button>
              </div>

              <div className="flex h-[42px] w-full items-center gap-[12px] border-b border-[#dce4ee] bg-[#f8fafc] px-[16px] text-[11px] uppercase text-[#64748b]">
                <p className="min-w-0 flex-1">
                  Nomor · tanggal · barang · unit penerima
                </p>
                <p className="w-[100px] shrink-0">Status</p>
              </div>

              {memuatRiwayat ? (
                <div className="flex min-h-[120px] items-center justify-center gap-2 text-[13px] text-[#64748b]">
                  <LoaderCircle size={16} className="animate-spin" />
                  Memuat riwayat...
                </div>
              ) : tampilRiwayat.length === 0 ? (
                <div className="flex min-h-[120px] items-center justify-center px-4 text-center text-[13px] text-[#94a3b8]">
                  Belum ada riwayat barang keluar di database.
                </div>
              ) : (
                tampilRiwayat.map((row) => (
                  <div
                    key={row.id}
                    className="flex min-h-[70px] w-full items-center gap-[12px] border-b border-[#dce4ee] px-[16px] py-[10px]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-[11px] leading-[1.6] text-[#172b4d]">
                        {row.nomor} · {row.tanggal}
                      </p>

                      <p className="break-words text-[12px] font-medium text-[#172b4d]">
                        {row.namaBarang} — {row.jumlah}
                      </p>

                      <p className="break-words text-[11px] text-[#64748b]">
                        {row.pihak} · {row.penerima}
                      </p>
                    </div>

                    <div className="flex w-[100px] shrink-0 items-start">
                      <StatusDiserahkan />
                    </div>
                  </div>
                ))
              )}

              <div className="flex w-full items-center justify-between gap-3 p-[16px] text-[10px]">
                <p className="text-[#64748b]">
                  {memuatRiwayat
                    ? "Memuat data..."
                    : semua
                      ? `${riwayat.length} catatan mutasi`
                      : `${tampilRiwayat.length} catatan terbaru`}
                </p>

                {riwayat.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setSemua((value) => !value)}
                    className="flex shrink-0 items-center gap-[4px] font-bold text-[#7c3aed] hover:underline"
                  >
                    {semua ? "Lihat lebih sedikit" : "Lihat semua"}
                    {!semua && <ArrowRight size={12} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal panduan */}
      {panduan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172b4d]/40 p-4"
          onClick={() => setPanduan(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Panduan transaksi barang keluar"
        >
          <div
            className="max-h-[85vh] w-full max-w-[520px] overflow-auto rounded-[12px] bg-white p-[24px] shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-[16px] flex items-center justify-between">
              <p className="text-[18px] text-[#172b4d]">
                Panduan transaksi barang keluar
              </p>

              <button
                type="button"
                onClick={() => setPanduan(false)}
                aria-label="Tutup"
                className="flex size-[28px] items-center justify-center rounded-[6px] hover:bg-[#f3f6fa]"
              >
                <X size={18} className="text-[#64748b]" />
              </button>
            </div>

            <div className="flex flex-col gap-[12px]">
              {langkahPanduan.map((teks, index) => (
                <div key={index} className="flex items-start gap-[12px]">
                  <span className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-[#f2ecff] text-[12px] text-[#7c3aed]">
                    {index + 1}
                  </span>

                  <p className="min-w-0 flex-1 text-[13px] leading-[1.5] text-[#172b4d]">
                    {teks}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-[16px] rounded-[8px] bg-[#f8fafc] p-[12px] text-[12px] leading-[1.5] text-[#64748b]">
              Ekspor mengunduh riwayat barang keluar dalam format CSV
              yang dapat dibuka menggunakan Excel.
            </p>

            <div className="mt-[20px] flex justify-end">
              <button
                type="button"
                onClick={() => setPanduan(false)}
                className="h-[40px] rounded-[8px] border border-[#1769e0] bg-[#1769e0] px-[15px] text-[14px] text-white hover:bg-[#0e4fab]"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifikasi */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-[24px] right-[24px] z-50 max-w-[420px] rounded-[10px] bg-[#172b4d] px-[16px] py-[12px] shadow-lg"
        >
          <p className="text-[13px] leading-[1.5] text-white">
            {toast}
          </p>
        </div>
      )}
    </div>
  );
}
