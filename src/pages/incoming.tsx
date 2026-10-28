
import { useCallback, useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import { useAuth } from "../auth";
import { apiRequest } from "../api";
import {
  CircleHelp,
  Download,
  CircleCheck,
  ArrowRight,
  Save,
  Plus,
  X,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

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

interface Item {
  barangId: number;
  nama: string;
  satuan: string;
  jumlah: number;
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
  user?: {
    id: number;
    nama?: string;
    name?: string;
  };
}

interface ResponsMutasi {
  message: string;
  data: MutasiApi[];
}

interface Transaksi {
  id: number;
  nomor: string;
  tanggal: string;
  pihak: string;
  jumlah: string;
  namaBarang: string;
  keterangan: string;
}

interface Draf {
  pemasok: string;
  dokumen: string;
  keterangan: string;
  items: Item[];
}

interface Errors {
  pemasok?: string;
  dokumen?: string;
  items?: string;
}

const DRAF_KEY = "simpera-draf-barang-masuk";

/* ------------------------------ Utilitas ------------------------------ */

function bacaDraf(): Draf | null {
  try {
    const raw = localStorage.getItem(DRAF_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as Draf;

    return {
      pemasok: data.pemasok ?? "",
      dokumen: data.dokumen ?? "",
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

function formatTanggalPanjang(value: Date): string {
  return value.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatNomor(id: number, tanggal?: string): string {
  const tahun = tanggal
    ? new Date(tanggal).getFullYear()
    : new Date().getFullYear();

  return `BM-${tahun}-${String(id).padStart(4, "0")}`;
}

function ambilPemasok(keterangan: string | null): string {
  if (!keterangan) return "Penerimaan barang";

  const cocok = keterangan.match(/Pemasok:\s*([^|]+)/i);
  return cocok?.[1]?.trim() || keterangan;
}

function ringkasJumlah(items: Item[]): string {
  const total = items.reduce((jumlah, item) => jumlah + item.jumlah, 0);
  const satuan = [...new Set(items.map((item) => item.satuan))];

  return satuan.length === 1
    ? `${total} ${satuan[0]}`
    : `${total} item`;
}

function unduhCsv(rows: Transaksi[]) {
  const header = [
    "Nomor",
    "Tanggal",
    "Pemasok / sumber",
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
  link.download = `barang-masuk-${new Date()
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

function StatusSelesai() {
  return (
    <div className="flex shrink-0 items-center gap-[5px] rounded-full bg-[#eaf8ef] px-[9px] py-[5px]">
      <CircleCheck size={12} className="text-[#15803d]" />
      <span className="text-[12px] text-[#15803d]">Selesai</span>
    </div>
  );
}

/* ------------------------------ Halaman ------------------------------ */

export default function BarangMasukScreen() {
  const { user } = useAuth();

  const [barang, setBarang] = useState<BarangApi[]>([]);
  const [riwayat, setRiwayat] = useState<Transaksi[]>([]);

  const [memuatBarang, setMemuatBarang] = useState(true);
  const [memuatRiwayat, setMemuatRiwayat] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);
  const [semua, setSemua] = useState(false);

  const [pemasok, setPemasok] = useState(
    () => bacaDraf()?.pemasok ?? "",
  );
  const [dokumen, setDokumen] = useState(
    () => bacaDraf()?.dokumen ?? "",
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
  const tanggalPanjang = formatTanggalPanjang(sekarang);
  const waktu =
    sekarang.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WITA";

  const totalJumlah = items.reduce(
    (total, item) => total + item.jumlah,
    0,
  );

  const tampilRiwayat = semua ? riwayat : riwayat.slice(0, 4);

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

      // Cocokkan barang pada draf lama dengan ID dari database.
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
        .filter((mutasi) => mutasi.jenis_mutasi === "masuk")
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
          pihak: ambilPemasok(mutasi.keterangan),
          jumlah: `${mutasi.jumlah} ${mutasi.barang?.satuan ?? "item"}`,
          namaBarang: mutasi.barang?.nama_barang ?? `Barang ID ${mutasi.barang_id}`,
          keterangan: mutasi.keterangan ?? "-",
        })),
      );
    } catch (error) {
      setToast(
        error instanceof Error
          ? `Gagal memuat riwayat: ${error.message}`
          : "Gagal memuat riwayat barang masuk.",
      );
    } finally {
      setMemuatRiwayat(false);
    }
  }, []);

  useEffect(() => {
    void muatBarang();
    void muatRiwayat();
  }, [muatBarang, muatRiwayat]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(""), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  /* ------------------------------ Kelola Item ------------------------------ */

  const tambahItem = () => {
    const barangTerpilih = barang.find(
      (item) => String(item.id) === pilihBarangId,
    );
    const jumlah = Number(pilihJumlah);

    if (
      !barangTerpilih ||
      !Number.isInteger(jumlah) ||
      jumlah <= 0
    ) {
      setErrItem("Pilih barang dan isi jumlah berupa angka bulat lebih dari 0.");
      return;
    }

    setErrItem("");
    setErrors((sebelumnya) => ({
      ...sebelumnya,
      items: undefined,
    }));

    setItems((sebelumnya) => {
      const sudahAda = sebelumnya.find(
        (item) => item.barangId === barangTerpilih.id,
      );

      if (sudahAda) {
        return sebelumnya.map((item) =>
          item.barangId === barangTerpilih.id
            ? { ...item, jumlah: item.jumlah + jumlah }
            : item,
        );
      }

      return [
        ...sebelumnya,
        {
          barangId: barangTerpilih.id,
          nama: barangTerpilih.nama_barang,
          satuan: barangTerpilih.satuan,
          jumlah,
        },
      ];
    });

    setPilihBarangId("");
    setPilihJumlah("");
  };

  const hapusItem = (barangId: number) => {
    setItems((sebelumnya) =>
      sebelumnya.filter((item) => item.barangId !== barangId),
    );
  };

  const resetForm = () => {
    setPemasok("");
    setDokumen("");
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
      !pemasok.trim() &&
      !dokumen.trim() &&
      !keterangan.trim() &&
      items.length === 0
    ) {
      setToast("Belum ada isian yang bisa disimpan sebagai draf.");
      return;
    }

    try {
      localStorage.setItem(
        DRAF_KEY,
        JSON.stringify({ pemasok, dokumen, keterangan, items }),
      );

      setAdaDraf(true);
      setToast("Draf tersimpan di perangkat ini.");
    } catch {
      setToast("Draf gagal disimpan.");
    }
  };

  const hapusDraf = () => {
    try {
      localStorage.removeItem(DRAF_KEY);
    } catch {
      // Draf lokal tidak wajib tersedia.
    }

    setAdaDraf(false);
    setToast("Draf dihapus.");
  };

  /* ------------------------------ Simpan Transaksi ------------------------------ */

  const simpanTransaksi = async () => {
    const errorBaru: Errors = {};

    if (!pemasok.trim()) {
      errorBaru.pemasok = "Pemasok / sumber wajib diisi.";
    }

    if (!dokumen.trim()) {
      errorBaru.dokumen = "Nomor dokumen wajib diisi.";
    }

    if (items.length === 0) {
      errorBaru.items = "Tambahkan minimal satu barang.";
    }

    setErrors(errorBaru);

    if (Object.keys(errorBaru).length > 0) return;

    setMenyimpan(true);

    const itemBerhasil: number[] = [];
    const gagal: string[] = [];

    try {
      for (const item of items) {
        try {
          const keteranganMutasi = [
            `Pemasok: ${pemasok.trim()}`,
            `Dokumen: ${dokumen.trim()}`,
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
              jenis_mutasi: "masuk",
              jumlah: item.jumlah,
              keterangan: keteranganMutasi,
            }),
          });

          itemBerhasil.push(item.barangId);
        } catch (error) {
          gagal.push(
            `${item.nama}: ${
              error instanceof Error ? error.message : "Gagal menyimpan"
            }`,
          );

          // Jangan lanjutkan item berikutnya setelah terjadi kegagalan.
          break;
        }
      }

      await Promise.all([muatBarang(), muatRiwayat()]);

      if (gagal.length > 0) {
        setItems((sebelumnya) =>
          sebelumnya.filter(
            (item) => !itemBerhasil.includes(item.barangId),
          ),
        );

        if (itemBerhasil.length > 0) {
          try {
            localStorage.setItem(
              DRAF_KEY,
              JSON.stringify({
                pemasok,
                dokumen,
                keterangan,
                items: items.filter(
                  (item) => !itemBerhasil.includes(item.barangId),
                ),
              }),
            );
            setAdaDraf(true);
          } catch {
            // Kegagalan draf tidak mengubah transaksi yang sudah tersimpan.
          }
        }

        setToast(
          itemBerhasil.length > 0
            ? `${itemBerhasil.length} barang berhasil disimpan. Barang berikutnya gagal: ${gagal[0]}`
            : `Transaksi gagal disimpan: ${gagal[0]}`,
        );

        return;
      }

      try {
        localStorage.removeItem(DRAF_KEY);
      } catch {
        // Abaikan kegagalan penghapusan draf lokal.
      }

      setAdaDraf(false);
      resetForm();
      setSemua(false);
      setToast(
        `${itemBerhasil.length} barang berhasil dicatat sebagai barang masuk.`,
      );
    } finally {
      setMenyimpan(false);
    }
  };

  /* ------------------------------ Tampilan ------------------------------ */

  return (
    <div className="relative flex size-full items-start bg-[#f3f6fa]">
      <Sidebar active="Barang Masuk" />

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

        {/* Konten */}
        <div className="flex w-full flex-col gap-[24px] p-[32px]">
          {/* Judul halaman */}
          <div className="flex w-full items-center justify-between gap-4">
            <div>
              <h1 className="text-[26px] text-[#172b4d]">
                Barang Masuk
              </h1>
              <p className="mt-[5px] text-[14px] text-[#64748b]">
                Catat penerimaan barang dan pantau riwayat stok masuk
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                void muatBarang();
                void muatRiwayat();
              }}
              className="flex h-[40px] shrink-0 items-center gap-[8px] rounded-[8px] border border-[#dce4ee] bg-white px-[15px] text-[13px] text-[#1769e0] hover:bg-[#f3f6fa]"
            >
              <RefreshCw size={15} />
              Muat ulang
            </button>
          </div>

          {/* Form dan riwayat */}
          <div className="flex w-full flex-col items-start gap-[18px] xl:flex-row">
            {/* Form transaksi */}
            <div className="flex w-full shrink-0 flex-col gap-[16px] rounded-[12px] border border-[#dce4ee] bg-white p-[20px] shadow-sm xl:w-[430px]">
              <div className="flex w-full flex-col gap-[5px] rounded-[8px] bg-[#eaf8ef] p-[15px]">
                <p className="text-[15px] text-[#15803d]">
                  Transaksi masuk baru
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
                label="Pemasok / sumber *"
                value={pemasok}
                onChange={(value) => {
                  setPemasok(value);
                  setErrors((previous) => ({
                    ...previous,
                    pemasok: undefined,
                  }));
                }}
                placeholder="Contoh: CV Jaringan Bali"
                error={errors.pemasok}
              />

              <Field
                label="Nomor dokumen *"
                value={dokumen}
                onChange={(value) => {
                  setDokumen(value);
                  setErrors((previous) => ({
                    ...previous,
                    dokumen: undefined,
                  }));
                }}
                placeholder="Contoh: SJ/CJB/10/2026/184"
                error={errors.dokumen}
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
                    {items.map((item) => (
                      <div
                        key={item.barangId}
                        className="flex w-full items-center justify-between gap-[8px]"
                      >
                        <p className="min-w-0 flex-1 text-[12px] leading-[1.5] text-[#172b4d]">
                          {item.nama} — {item.jumlah} {item.satuan}
                        </p>

                        <button
                          type="button"
                          aria-label={`Hapus ${item.nama}`}
                          onClick={() => hapusItem(item.barangId)}
                          className="flex size-[24px] shrink-0 items-center justify-center rounded-[6px] text-[#64748b] hover:bg-[#fef0ef] hover:text-[#c2413a]"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
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

                    {barang.map((item) => (
                      <option key={item.id} value={String(item.id)}>
                        {item.kode_barang} — {item.nama_barang} (stok:{" "}
                        {item.stok})
                      </option>
                    ))}
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
                    Belum ada barang di database. Tambahkan barang melalui
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
                  placeholder="Contoh: Pengadaan tahap II"
                  disabled={menyimpan}
                  className="h-[42px] w-full rounded-[8px] border border-[#dce4ee] bg-white px-[12px] text-[14px] text-[#172b4d] outline-none placeholder:text-[#94a3b8] focus:border-[#1769e0]"
                />
              </div>

              <div className="flex w-full items-center justify-between gap-3 rounded-[8px] bg-[#eaf8ef] p-[12px]">
                <p className="text-[11px] text-[#64748b]">
                  Total transaksi
                </p>
                <p className="text-[13px] text-[#15803d]">
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
                    Riwayat barang masuk
                  </p>
                  <p className="mt-[3px] text-[11px] text-[#64748b]">
                    Data mutasi dari database
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => unduhCsv(riwayat)}
                  title={`Unduh ${riwayat.length} transaksi (CSV)`}
                  disabled={riwayat.length === 0}
                  className="flex h-[40px] shrink-0 items-center gap-[8px] rounded-[8px] border border-[#dce4ee] bg-white px-[15px] text-[#1769e0] hover:bg-[#f3f6fa] disabled:opacity-50"
                >
                  <Download size={16} />
                  <span className="text-[14px]">Ekspor</span>
                </button>
              </div>

              <div className="flex h-[42px] w-full items-center gap-[12px] border-b border-[#dce4ee] bg-[#f8fafc] px-[16px] text-[11px] uppercase text-[#64748b]">
                <p className="min-w-0 flex-1">
                  Nomor · tanggal · barang · pemasok
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
                  Belum ada riwayat barang masuk di database.
                </div>
              ) : (
                tampilRiwayat.map((row) => (
                  <div
                    key={row.id}
                    className="flex min-h-[62px] w-full items-center gap-[12px] border-b border-[#dce4ee] px-[16px] py-[10px]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-[11px] leading-[1.6] text-[#172b4d]">
                        {row.nomor} · {row.tanggal}
                      </p>
                      <p className="break-words text-[12px] font-medium text-[#172b4d]">
                        {row.namaBarang} — {row.jumlah}
                      </p>
                      <p className="break-words text-[11px] text-[#64748b]">
                        {row.pihak}
                      </p>
                    </div>

                    <div className="flex w-[100px] shrink-0 items-start">
                      <StatusSelesai />
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
                    className="flex shrink-0 items-center gap-[4px] font-bold text-[#15803d] hover:underline"
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

      {/* Tombol bantuan tetap tersedia */}
      <button
        type="button"
        title="Panduan Barang Masuk"
        onClick={() =>
          setToast(
            "Pilih barang dari database, isi jumlah dan pemasok, lalu simpan transaksi.",
          )
        }
        className="fixed bottom-[24px] left-[24px] z-40 flex size-[38px] items-center justify-center rounded-full border border-[#dce4ee] bg-white text-[#64748b] shadow-sm hover:text-[#1769e0]"
      >
        <CircleHelp size={17} />
      </button>
    </div>
  );
}
