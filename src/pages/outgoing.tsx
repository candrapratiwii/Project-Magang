import { useEffect, useState } from "react";
import {
  Save,
  CircleHelp,
  Download,
  ArrowRight,
  PackageCheck,
  Plus,
  X,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { useAuth } from "../auth";

/* ------------------------------ Data ------------------------------ */

interface Katalog {
  nama: string;
  satuan: string;
  stok: number;
}

/* Samakan dengan data di Master Barang */
const katalogAwal: Katalog[] = [
  { nama: "Kabel LAN Cat6 UTP 305m", satuan: "roll", stok: 18 },
  { nama: "Konektor RJ45 Cat6", satuan: "pcs", stok: 28 },
  { nama: "Router MikroTik RB4011", satuan: "unit", stok: 12 },
  { nama: "Switch Managed 24 Port PoE", satuan: "unit", stok: 8 },
  { nama: "Access Point Wi-Fi 6", satuan: "unit", stok: 14 },
  { nama: "SFP Module 1G Single Mode", satuan: "unit", stok: 4 },
  { nama: "Patch Cord Cat6 1m", satuan: "pcs", stok: 12 },
  { nama: "Firewall FortiGate 60F", satuan: "unit", stok: 3 },
  { nama: "UPS 1200VA", satuan: "unit", stok: 6 },
];

const daftarUnit = [
  "Bidang Aplikasi Informatika",
  "Bidang IKP",
  "Bidang Persandian",
  "UPTD Jaringan",
  "Sekretariat",
];

interface Item {
  nama: string;
  satuan: string;
  jumlah: number;
}

interface Transaksi {
  nomor: string;
  tanggal: string;
  pihak: string;
  jumlah: string;
}

const riwayatAwal: Transaksi[] = [
  { nomor: "BK-2026-0108", tanggal: "05 Okt 2026", pihak: "Bidang Aptika", jumlah: "8 unit" },
  { nomor: "BK-2026-0107", tanggal: "04 Okt 2026", pihak: "UPTD Jaringan", jumlah: "35 pcs" },
  { nomor: "BK-2026-0106", tanggal: "03 Okt 2026", pihak: "Sekretariat", jumlah: "2 unit" },
  { nomor: "BK-2026-0105", tanggal: "02 Okt 2026", pihak: "Bidang IKP", jumlah: "18 pcs" },
];

const DRAF_KEY = "simpera-draf-barang-keluar";

interface Draf {
  unit: string;
  penerima: string;
  keterangan: string;
  items: Item[];
}

function bacaDraf(): Draf | null {
  try {
    const raw = localStorage.getItem(DRAF_KEY);
    return raw ? (JSON.parse(raw) as Draf) : null;
  } catch {
    return null;
  }
}

/* ------------------------------ Util ------------------------------ */

function unduhCsv(rows: Transaksi[]) {
  const header = ["Nomor", "Tanggal", "Unit penerima", "Jumlah", "Status"];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const isi = [header, ...rows.map((r) => [r.nomor, r.tanggal, r.pihak, r.jumlah, "Diserahkan"])]
    .map((r) => r.map(esc).join(";"))
    .join("\r\n");

  // BOM supaya Excel membaca UTF-8 dengan benar
  const blob = new Blob(["\uFEFF" + isi], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `barang-keluar-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function ringkasJumlah(items: Item[]) {
  const total = items.reduce((s, i) => s + i.jumlah, 0);
  const satuan = Array.from(new Set(items.map((i) => i.satuan)));
  return satuan.length === 1 ? `${total} ${satuan[0]}` : `${total} item`;
}

/* --------------------------- Komponen kecil --------------------------- */

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
  onChange?: (v: string) => void;
  placeholder?: string;
  error?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="flex w-full min-w-px flex-[1_0_0] shrink-0 flex-col items-start gap-[7px]">
      <p className="shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal] text-[#172b4d]">
        {label}
      </p>
      <input
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        aria-invalid={!!error}
        className={`h-[42px] w-full shrink-0 rounded-[8px] border border-solid px-[12px] text-[14px] font-normal not-italic leading-[normal] outline-none placeholder:text-[#94a3b8] ${
          readOnly
            ? "border-[#dce4ee] bg-[#f8fafc] text-[#64748b]"
            : error
              ? "border-[#c2413a] bg-white text-[#172b4d]"
              : "border-[#dce4ee] bg-white text-[#172b4d] focus:border-[#1769e0]"
        }`}
      />
      {error && (
        <p className="text-[11px] font-normal not-italic leading-[normal] text-[#c2413a]">
          {error}
        </p>
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[7px] font-normal not-italic">
      <p className="shrink-0 whitespace-nowrap text-[12px] leading-[normal] text-[#172b4d]">
        {label}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`h-[42px] w-full shrink-0 rounded-[8px] border border-solid bg-white px-[10px] text-[14px] outline-none ${
          value ? "text-[#172b4d]" : "text-[#94a3b8]"
        } ${error ? "border-[#c2413a]" : "border-[#dce4ee] focus:border-[#1769e0]"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-[11px] leading-[normal] text-[#c2413a]">{error}</p>
      )}
    </div>
  );
}

function StatusDiserahkan() {
  return (
    <div className="flex shrink-0 items-center gap-[5px] overflow-clip rounded-[999px] bg-[#eaf2ff] px-[9px] py-[5px]">
      <div className="flex size-[12px] shrink-0 items-center justify-center text-[#1769e0]">
        <PackageCheck size={12} />
      </div>
      <p className="shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal] text-[#1769e0]">
        Diserahkan
      </p>
    </div>
  );
}

const langkahPanduan = [
  "Pilih unit penerima dan isi nama penerima. Keduanya wajib diisi.",
  "Pilih barang dan jumlahnya, lalu klik Tambah item. Stok yang tersedia tampil di daftar pilihan, dan jumlah tidak boleh melebihi stok.",
  "Periksa barang terpilih dan total transaksi. Barang yang salah bisa dihapus dengan tombol X.",
  "Klik Simpan draf kalau belum selesai. Isian tersimpan di perangkat ini dan muncul lagi saat halaman dibuka.",
  "Klik Simpan transaksi kalau sudah benar. Transaksi masuk ke riwayat dan stok barang berkurang.",
];

/* ------------------------------ Halaman ------------------------------ */

export default function BarangKeluarScreen() {
  const { user } = useAuth();

  const drafAwal = bacaDraf();

  const [stok, setStok] = useState<Record<string, number>>(
    Object.fromEntries(katalogAwal.map((k) => [k.nama, k.stok])),
  );
  const [riwayat, setRiwayat] = useState<Transaksi[]>(riwayatAwal);
  const [semua, setSemua] = useState(false);
  const [panduan, setPanduan] = useState(false);

  const [unit, setUnit] = useState(drafAwal?.unit ?? "");
  const [penerima, setPenerima] = useState(drafAwal?.penerima ?? "");
  const [keterangan, setKeterangan] = useState(drafAwal?.keterangan ?? "");
  const [items, setItems] = useState<Item[]>(drafAwal?.items ?? []);
  const [adaDraf, setAdaDraf] = useState(drafAwal !== null);

  const [pilihNama, setPilihNama] = useState("");
  const [pilihJumlah, setPilihJumlah] = useState("");
  const [errItem, setErrItem] = useState("");
  const [errors, setErrors] = useState<{ unit?: string; penerima?: string; items?: string }>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!panduan) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setPanduan(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [panduan]);

  const sekarang = new Date();
  const tanggalPanjang = sekarang.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const tanggalPendek = sekarang.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const waktu =
    sekarang.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WITA";

  const urutTerakhir = Math.max(
    ...riwayat.map((r) => parseInt(r.nomor.split("-").pop() ?? "0", 10)),
  );
  const nomorBerikut = `BK-${sekarang.getFullYear()}-${String(urutTerakhir + 1).padStart(4, "0")}`;

  const totalJumlah = items.reduce((s, i) => s + i.jumlah, 0);
  const tampilRiwayat = semua ? riwayat : riwayat.slice(0, 4);

  const tambahItem = () => {
    const kat = katalogAwal.find((k) => k.nama === pilihNama);
    const jml = Number(pilihJumlah);
    if (!kat || !Number.isInteger(jml) || jml <= 0) {
      setErrItem("Pilih barang dan isi jumlah (angka bulat lebih dari 0).");
      return;
    }
    const sudahDiForm = items.find((i) => i.nama === kat.nama)?.jumlah ?? 0;
    const tersedia = (stok[kat.nama] ?? 0) - sudahDiForm;
    if (jml > tersedia) {
      setErrItem(`Stok tidak cukup. Tersedia ${Math.max(tersedia, 0)} ${kat.satuan}.`);
      return;
    }
    setErrItem("");
    setErrors((e) => ({ ...e, items: undefined }));
    setItems((prev) => {
      const ada = prev.find((i) => i.nama === kat.nama);
      return ada
        ? prev.map((i) => (i.nama === kat.nama ? { ...i, jumlah: i.jumlah + jml } : i))
        : [...prev, { nama: kat.nama, satuan: kat.satuan, jumlah: jml }];
    });
    setPilihNama("");
    setPilihJumlah("");
  };

  const hapusItem = (nama: string) => setItems((prev) => prev.filter((i) => i.nama !== nama));

  const resetForm = () => {
    setUnit("");
    setPenerima("");
    setKeterangan("");
    setItems([]);
    setPilihNama("");
    setPilihJumlah("");
    setErrItem("");
    setErrors({});
  };

  const simpanDraf = () => {
    if (!unit && !penerima.trim() && !keterangan.trim() && items.length === 0) {
      setToast("Belum ada isian yang bisa disimpan sebagai draf.");
      return;
    }
    try {
      localStorage.setItem(DRAF_KEY, JSON.stringify({ unit, penerima, keterangan, items }));
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
      /* abaikan */
    }
    setAdaDraf(false);
    setToast("Draf dihapus.");
  };

  const simpanTransaksi = () => {
    const e: typeof errors = {};
    if (!unit) e.unit = "Unit penerima wajib dipilih.";
    if (!penerima.trim()) e.penerima = "Nama penerima wajib diisi.";
    if (items.length === 0) {
      e.items = "Tambahkan minimal satu barang.";
    } else {
      // cek ulang stok (misalnya draf lama dibuka saat stok sudah berubah)
      const kurang = items.find((i) => i.jumlah > (stok[i.nama] ?? 0));
      if (kurang) {
        e.items = `Stok ${kurang.nama} tidak mencukupi. Tersedia ${stok[kurang.nama] ?? 0} ${kurang.satuan}.`;
      }
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStok((prev) => {
      const baru = { ...prev };
      items.forEach((i) => {
        baru[i.nama] = (baru[i.nama] ?? 0) - i.jumlah;
      });
      return baru;
    });
    setRiwayat((prev) => [
      {
        nomor: nomorBerikut,
        tanggal: tanggalPendek,
        pihak: unit,
        jumlah: ringkasJumlah(items),
      },
      ...prev,
    ]);
    try {
      localStorage.removeItem(DRAF_KEY);
    } catch {
      /* abaikan */
    }
    setAdaDraf(false);
    resetForm();
    setSemua(false);
    setToast(`Transaksi ${nomorBerikut} berhasil disimpan. Stok barang berkurang.`);
  };

  return (
    <div className="relative flex size-full items-start bg-[#f3f6fa]">
      <Sidebar active="Barang Keluar" />

      <div className="relative flex min-h-[1080px] min-w-px flex-[1_0_0] flex-col items-start overflow-clip">
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
                Barang Keluar
              </p>
              <p className="w-full shrink-0 text-[14px] text-[#64748b]">
                Catat penyerahan barang dan pantau riwayat stok keluar
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPanduan(true)}
              className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-white bg-white px-[15px] text-[#64748b] hover:bg-[#f8fafc]"
            >
              <CircleHelp size={16} className="shrink-0" />
              <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                Panduan
              </span>
            </button>
          </div>

          {/* Transaction workspace */}
          <div className="flex w-full shrink-0 items-start gap-[18px]">
            {/* Transaction form */}
            <div className="relative flex w-[430px] shrink-0 flex-col items-start gap-[16px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[20px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
              <div className="flex w-full shrink-0 flex-col items-start gap-[5px] overflow-clip whitespace-nowrap rounded-[8px] bg-[#f2ecff] p-[15px] font-normal not-italic leading-[normal]">
                <p className="shrink-0 text-[15px] text-[#7c3aed]">
                  Transaksi keluar baru
                </p>
                <p className="shrink-0 text-[10px] text-[#64748b]">
                  {nomorBerikut} · {tanggalPanjang}
                </p>
              </div>

              {adaDraf && (
                <div className="flex w-full shrink-0 items-center justify-between rounded-[8px] bg-[#eaf2ff] px-[12px] py-[8px] font-normal not-italic leading-[normal]">
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

              <div className="flex w-full shrink-0 items-start gap-[10px]">
                <Field label="Tanggal" value={tanggalPanjang} readOnly />
                <Field label="Waktu" value={waktu} readOnly />
              </div>

              <SelectField
                label="Unit penerima *"
                value={unit}
                onChange={(v) => {
                  setUnit(v);
                  setErrors((e) => ({ ...e, unit: undefined }));
                }}
                options={daftarUnit}
                placeholder="Pilih unit penerima..."
                error={errors.unit}
              />
              <Field
                label="Nama penerima *"
                value={penerima}
                onChange={(v) => {
                  setPenerima(v);
                  setErrors((e) => ({ ...e, penerima: undefined }));
                }}
                placeholder="Contoh: I Putu Gede Wirawan"
                error={errors.penerima}
              />

              {/* Barang terpilih */}
              <div
                className={`flex w-full shrink-0 flex-col items-start gap-[10px] rounded-[8px] bg-[#f8fafc] p-[14px] font-normal not-italic text-[#172b4d] ${
                  errors.items ? "border border-solid border-[#c2413a]" : ""
                }`}
              >
                <p className="shrink-0 whitespace-nowrap text-[11px] leading-[normal]">
                  BARANG TERPILIH
                </p>

                {items.length === 0 ? (
                  <p className="text-[12px] leading-[normal] text-[#94a3b8]">
                    Belum ada barang. Pilih barang di bawah ini.
                  </p>
                ) : (
                  <div className="flex w-full flex-col gap-[6px]">
                    {items.map((i) => (
                      <div
                        key={i.nama}
                        className="flex w-full items-center justify-between gap-[8px]"
                      >
                        <p className="min-w-px flex-[1_0_0] text-[12px] leading-[1.5]">
                          {i.nama}  —  {i.jumlah} {i.satuan}
                        </p>
                        <button
                          type="button"
                          aria-label={`Hapus ${i.nama}`}
                          onClick={() => hapusItem(i.nama)}
                          className="flex size-[22px] shrink-0 items-center justify-center rounded-[6px] text-[#64748b] hover:bg-[#fef0ef] hover:text-[#c2413a]"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex w-full items-center gap-[6px]">
                  <select
                    value={pilihNama}
                    onChange={(e) => setPilihNama(e.target.value)}
                    aria-label="Pilih barang"
                    className="h-[36px] min-w-px flex-[1_0_0] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[8px] text-[12px] text-[#172b4d] outline-none focus:border-[#1769e0]"
                  >
                    <option value="">Pilih barang...</option>
                    {katalogAwal.map((k) => (
                      <option key={k.nama} value={k.nama} disabled={(stok[k.nama] ?? 0) <= 0}>
                        {k.nama} (stok {stok[k.nama] ?? 0} {k.satuan})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={pilihJumlah}
                    onChange={(e) => setPilihJumlah(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && tambahItem()}
                    placeholder="Jml"
                    aria-label="Jumlah"
                    className="h-[36px] w-[64px] shrink-0 rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[8px] text-[12px] text-[#172b4d] outline-none placeholder:text-[#94a3b8] focus:border-[#1769e0]"
                  />
                  <button
                    type="button"
                    onClick={tambahItem}
                    className="flex h-[36px] shrink-0 items-center justify-center gap-[4px] rounded-[8px] border border-solid border-[#1769e0] bg-white px-[10px] text-[12px] text-[#1769e0] hover:bg-[#eaf2ff]"
                  >
                    <Plus size={13} />
                    Tambah item
                  </button>
                </div>

                {errItem && (
                  <p className="text-[11px] leading-[normal] text-[#c2413a]">{errItem}</p>
                )}
                {errors.items && (
                  <p className="text-[11px] leading-[normal] text-[#c2413a]">{errors.items}</p>
                )}
              </div>

              <div className="flex w-full min-w-px flex-[1_0_0] shrink-0 flex-col items-start gap-[7px]">
                <p className="shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal] text-[#172b4d]">
                  Keterangan
                </p>
                <input
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Contoh: Untuk instalasi gedung"
                  className="h-[42px] w-full shrink-0 rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[12px] text-[14px] font-normal not-italic leading-[normal] text-[#172b4d] outline-none placeholder:text-[#94a3b8] focus:border-[#1769e0]"
                />
              </div>

              <div className="flex w-full shrink-0 items-start justify-between overflow-clip whitespace-nowrap rounded-[8px] bg-[#f2ecff] p-[12px] font-normal not-italic leading-[normal]">
                <p className="shrink-0 text-[11px] text-[#64748b]">
                  Total transaksi
                </p>
                <p className="shrink-0 text-[13px] text-[#7c3aed]">
                  {totalJumlah} item · {items.length} jenis
                </p>
              </div>

              <div className="flex w-full shrink-0 items-start gap-[8px] overflow-clip">
                <button
                  type="button"
                  onClick={simpanDraf}
                  className="flex h-[40px] min-w-px flex-[1_0_0] cursor-pointer items-center justify-center overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] hover:bg-[#f3f6fa]"
                >
                  <span className="shrink-0 whitespace-nowrap text-[14px] font-normal not-italic leading-[normal] text-[#1769e0]">
                    Simpan draf
                  </span>
                </button>
                <button
                  type="button"
                  onClick={simpanTransaksi}
                  className="flex h-[40px] min-w-px flex-[1_0_0] cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] font-normal not-italic text-white hover:bg-[#0e4fab]"
                >
                  <Save size={16} className="shrink-0" />
                  <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                    Simpan transaksi
                  </span>
                </button>
              </div>
            </div>

            {/* Transaction history */}
            <div className="relative flex min-w-px flex-[1_0_0] flex-col items-start rounded-[12px] border border-solid border-[#dce4ee] bg-white drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
              <div className="flex w-full shrink-0 items-center justify-between overflow-clip p-[18px] font-normal not-italic">
                <div className="flex shrink-0 flex-col items-start gap-[3px] overflow-clip whitespace-nowrap leading-[normal]">
                  <p className="shrink-0 text-[15px] text-[#172b4d]">
                    Riwayat barang keluar
                  </p>
                  <p className="shrink-0 text-[10px] text-[#64748b]">
                    Oktober 2026 · semua petugas
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => unduhCsv(riwayat)}
                  title={`Unduh ${riwayat.length} transaksi (CSV)`}
                  className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] text-[#1769e0] hover:bg-[#f3f6fa]"
                >
                  <Download size={16} className="shrink-0" />
                  <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                    Ekspor
                  </span>
                </button>
              </div>

              <div className="flex h-[42px] w-full shrink-0 items-center gap-[12px] border-b border-solid border-[#dce4ee] bg-[#f8fafc] px-[16px] text-[11px] font-normal uppercase not-italic leading-[normal] text-[#64748b]">
                <p className="min-w-px flex-[1_0_0]">
                  Nomor · tanggal · pihak · jumlah
                </p>
                <p className="w-[100px] shrink-0">Status</p>
              </div>

              {tampilRiwayat.map((r) => (
                <div
                  key={r.nomor}
                  className="flex h-[62px] w-full shrink-0 items-center gap-[12px] overflow-clip border-b border-solid border-[#dce4ee] px-[16px]"
                >
                  <p className="min-w-px flex-[1_0_0] whitespace-pre-wrap text-[11px] font-normal not-italic leading-[normal] text-[#172b4d]">
                    {`${r.nomor}  •  ${r.tanggal}  •  ${r.pihak}  •  ${r.jumlah}`}
                  </p>
                  <div className="flex w-[100px] shrink-0 items-start overflow-clip">
                    <StatusDiserahkan />
                  </div>
                </div>
              ))}

              <div className="flex w-full shrink-0 items-center justify-between overflow-clip whitespace-nowrap p-[16px] text-[10px] not-italic leading-[normal]">
                <p className="shrink-0 font-normal text-[#64748b]">
                  {semua
                    ? `${riwayat.length} transaksi`
                    : `${tampilRiwayat.length} transaksi terbaru`}
                </p>
                {riwayat.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setSemua((v) => !v)}
                    className="flex shrink-0 cursor-pointer items-center gap-[4px] font-bold text-[#7c3aed] hover:underline"
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
            onClick={(e) => e.stopPropagation()}
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
              {langkahPanduan.map((teks, i) => (
                <div key={i} className="flex items-start gap-[12px]">
                  <span className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-[#f2ecff] text-[12px] text-[#7c3aed]">
                    {i + 1}
                  </span>
                  <p className="min-w-px flex-[1_0_0] text-[13px] leading-[1.5] text-[#172b4d]">
                    {teks}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-[16px] rounded-[8px] bg-[#f8fafc] p-[12px] text-[12px] leading-[1.5] text-[#64748b]">
              Tombol Ekspor di riwayat mengunduh seluruh daftar transaksi dalam format CSV
              yang bisa dibuka di Excel.
            </p>

            <div className="mt-[20px] flex justify-end">
              <button
                type="button"
                onClick={() => setPanduan(false)}
                className="h-[40px] rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-[14px] text-white hover:bg-[#0e4fab]"
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
          className="fixed bottom-[24px] right-[24px] z-50 max-w-[360px] rounded-[10px] bg-[#172b4d] px-[16px] py-[12px] shadow-lg"
        >
          <p className="text-[13px] font-normal not-italic leading-[1.4] text-white">
            {toast}
          </p>
        </div>
      )}
    </div>
  );
}