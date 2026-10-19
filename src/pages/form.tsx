import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronLeft,
  PackageSearch,
  Lightbulb,
  Save,
  type LucideIcon,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { useAuth } from "../auth";

/* ------------------------------ Data ------------------------------ */

interface BarangTersimpan {
  kode: string;
  nama: string;
  kategori: string;
  lokasi: string; // "Gudang Utama · Rak B-04"
  stok: string; // "12 unit"
  minimum: string; // "5"
  menipis: boolean;
  merek: string;
  model: string;
  deskripsi: string;
  aktif: boolean;
}

/* Samakan dengan data di Master Barang */
const dataDasar: BarangTersimpan[] = [
  { kode: "MAT-LAN-006", nama: "Kabel LAN Cat6 UTP 305m", kategori: "Kabel & aksesori", lokasi: "Gudang Utama · Rak A-01", stok: "18 roll", minimum: "8", menipis: false },
  { kode: "MAT-RJ45-006", nama: "Konektor RJ45 Cat6", kategori: "Material jaringan", lokasi: "Gudang Utama · Bin A-12", stok: "28 pcs", minimum: "50", menipis: true },
  { kode: "NET-RTR-012", nama: "Router MikroTik RB4011", kategori: "Perangkat jaringan", lokasi: "Gudang Utama · Rak B-01", stok: "12 unit", minimum: "5", menipis: false },
  { kode: "NET-SWI-024", nama: "Switch Managed 24 Port PoE", kategori: "Perangkat jaringan", lokasi: "Gudang Utama · Rak B-02", stok: "8 unit", minimum: "5", menipis: false },
  { kode: "NET-AP-018", nama: "Access Point Wi-Fi 6", kategori: "Perangkat jaringan", lokasi: "Gudang Utama · Rak B-04", stok: "14 unit", minimum: "6", menipis: false },
  { kode: "NET-SFP-001", nama: "SFP Module 1G Single Mode", kategori: "Perangkat jaringan", lokasi: "Gudang Utama · Rak B-03", stok: "4 unit", minimum: "10", menipis: true },
  { kode: "MAT-PC-001", nama: "Patch Cord Cat6 1m", kategori: "Kabel & aksesori", lokasi: "Gudang Utama · Rak A-05", stok: "12 pcs", minimum: "20", menipis: true },
  { kode: "NET-FW-003", nama: "Firewall FortiGate 60F", kategori: "Perangkat jaringan", lokasi: "Gudang Cadangan · Rak C-02", stok: "3 unit", minimum: "4", menipis: true },
  { kode: "PND-UPS-005", nama: "UPS 1200VA", kategori: "Perangkat pendukung", lokasi: "Gudang Aptika · Rak D-01", stok: "6 unit", minimum: "3", menipis: false },
].map((b) => ({ ...b, merek: "", model: "", deskripsi: "", aktif: true }));

const opsiKategori = [
  "Perangkat jaringan",
  "Kabel & aksesori",
  "Material jaringan",
  "Perangkat pendukung",
];
const opsiSatuan = ["Unit", "Pcs", "Roll", "Box", "Set", "Meter"];
const opsiGudang = ["Gudang Utama", "Gudang Cadangan", "Gudang Aptika"];

const prefixKategori: Record<string, string> = {
  "Perangkat jaringan": "NET",
  "Kabel & aksesori": "MAT",
  "Material jaringan": "MAT",
  "Perangkat pendukung": "PND",
};

const tips = [
  "Gunakan nama barang yang mudah dikenali.",
  "Pastikan kategori dan satuan sudah tepat.",
  "Stok minimum membantu mencegah kekosongan.",
];

const KEY_TERPILIH = "simpera-barang-terpilih";
const KEY_TERSIMPAN = "simpera-barang-tersimpan";
const KEY_DIHAPUS = "simpera-barang-dihapus";

function bacaJson<T>(key: string, awal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : awal;
  } catch {
    return awal;
  }
}

function bacaTersimpan(): BarangTersimpan[] {
  return bacaJson<BarangTersimpan[]>(KEY_TERSIMPAN, []);
}

/* gabungan data dasar + data tersimpan, tanpa yang sudah dihapus */
function semuaBarang(): BarangTersimpan[] {
  const tersimpan = bacaTersimpan();
  const dihapus = new Set(bacaJson<string[]>(KEY_DIHAPUS, []));
  const kodeTersimpan = new Set(tersimpan.map((b) => b.kode));
  return [
    ...dataDasar.filter((b) => !kodeTersimpan.has(b.kode)),
    ...tersimpan,
  ].filter((b) => !dihapus.has(b.kode));
}

function bacaKodeTerpilih(): string | null {
  try {
    return sessionStorage.getItem(KEY_TERPILIH);
  } catch {
    return null;
  }
}

function buatKode(kategori: string, daftar: BarangTersimpan[]) {
  const prefix = prefixKategori[kategori] ?? "BRG";
  const urutan = daftar.map((b) => parseInt(b.kode.split("-").pop() ?? "0", 10) || 0);
  const berikut = Math.max(0, ...urutan) + 1;
  return `${prefix}-${String(berikut).padStart(3, "0")}`;
}

function kembali() {
  window.history.back();
}

/* --------------------------- Komponen kecil --------------------------- */

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[7px]">
      <p className="shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal] text-[#172b4d]">
        {label}
      </p>
      {children}
      {error ? (
        <p className="w-full shrink-0 text-[11px] font-normal not-italic leading-[normal] text-[#c2413a]">
          {error}
        </p>
      ) : (
        hint && (
          <p className="w-full shrink-0 text-[11px] font-normal not-italic leading-[normal] text-[#64748b]">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
  type = "text",
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  error?: string;
  readOnly?: boolean;
  type?: "text" | "number";
}) {
  return (
    <input
      type={type}
      min={type === "number" ? 0 : undefined}
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
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative w-full shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[42px] w-full cursor-pointer appearance-none rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[12px] pr-[34px] text-[14px] font-normal not-italic text-[#172b4d] outline-none focus:border-[#1769e0]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 text-[#64748b]"
      />
    </div>
  );
}

function SectionHeading({
  title,
  desc,
  icon: Icon,
}: {
  title: string;
  desc: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex w-full shrink-0 items-center gap-[11px] overflow-clip">
      <div className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[8px] bg-[#eaf2ff]">
        <div className="flex size-[17px] shrink-0 items-center justify-center text-[#1769e0]">
          <Icon size={17} />
        </div>
      </div>
      <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[3px] overflow-clip font-normal not-italic leading-[normal]">
        <p className="shrink-0 whitespace-nowrap text-[15px] text-[#172b4d]">
          {title}
        </p>
        <p className="w-full shrink-0 text-[11px] text-[#64748b]">{desc}</p>
      </div>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex w-full shrink-0 flex-col items-start gap-[20px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[22px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
      {children}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full shrink-0 items-start gap-[14px]">{children}</div>
  );
}

function StatusOption({
  aktif,
  dipilih,
  judul,
  desc,
  onClick,
}: {
  aktif: boolean;
  dipilih: boolean;
  judul: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={dipilih}
      onClick={onClick}
      className={`flex w-full shrink-0 cursor-pointer items-center gap-[10px] overflow-clip rounded-[8px] border border-solid p-[12px] text-left ${
        dipilih
          ? aktif
            ? "border-[#b9e5c8] bg-[#eaf8ef]"
            : "border-[#cbd5e1] bg-[#f1f5f9]"
          : "border-[#dce4ee] bg-white hover:bg-[#f8fafc]"
      }`}
    >
      {dipilih ? (
        <div
          className={`flex size-[18px] shrink-0 items-center justify-center overflow-clip rounded-[999px] ${
            aktif ? "bg-[#15803d]" : "bg-[#64748b]"
          }`}
        >
          <div className="size-[6px] shrink-0 rounded-[999px] bg-white" />
        </div>
      ) : (
        <div className="size-[18px] shrink-0 rounded-[999px] border border-solid border-[#dce4ee]" />
      )}
      <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[2px] overflow-clip not-italic leading-[normal]">
        <p
          className={`shrink-0 whitespace-nowrap text-[12px] ${
            dipilih
              ? aktif
                ? "font-bold text-[#15803d]"
                : "font-bold text-[#172b4d]"
              : "font-normal text-[#172b4d]"
          }`}
        >
          {judul}
        </p>
        <p className="w-full shrink-0 text-[10px] font-normal text-[#64748b]">
          {desc}
        </p>
      </div>
    </button>
  );
}

/* ------------------------------ Halaman ------------------------------ */

type Errors = Partial<
  Record<"kode" | "nama" | "stok" | "minimum" | "rak", string>
>;

export default function FormTambahEditBarangScreen() {
  const { user } = useAuth();

  /* mode edit kalau ada kode terpilih yang ditemukan */
  const barangEdit = useMemo(() => {
    const kode = bacaKodeTerpilih();
    return kode ? (semuaBarang().find((b) => b.kode === kode) ?? null) : null;
  }, []);
  const modeEdit = barangEdit !== null;

  const awalStok = barangEdit?.stok.split(" ") ?? [];
  const awalLokasi = barangEdit?.lokasi.split(" · ") ?? [];

  const [kategori, setKategori] = useState(
    barangEdit?.kategori ?? opsiKategori[0],
  );
  const [kode, setKode] = useState(
    barangEdit?.kode ?? buatKode(opsiKategori[0], semuaBarang()),
  );
  const [kodeManual, setKodeManual] = useState(modeEdit);
  const [nama, setNama] = useState(barangEdit?.nama ?? "");
  const [satuan, setSatuan] = useState(
    awalStok[1]
      ? awalStok[1].charAt(0).toUpperCase() + awalStok[1].slice(1)
      : "Unit",
  );
  const [merek, setMerek] = useState(barangEdit?.merek ?? "");
  const [model, setModel] = useState(barangEdit?.model ?? "");
  const [deskripsi, setDeskripsi] = useState(barangEdit?.deskripsi ?? "");
  const [stok, setStok] = useState(awalStok[0] ?? "0");
  const [minimum, setMinimum] = useState(barangEdit?.minimum ?? "5");
  const [gudang, setGudang] = useState(awalLokasi[0] ?? opsiGudang[0]);
  const [rak, setRak] = useState(awalLokasi[1] ?? "");
  const [aktif, setAktif] = useState(barangEdit?.aktif ?? true);

  const [errors, setErrors] = useState<Errors>({});
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  /* setiap perubahan menandai "dirty" dan menghapus error field itu */
  const ubah =
    (setter: (v: string) => void, field?: keyof Errors) => (v: string) => {
      setter(v);
      setDirty(true);
      if (field) setErrors((e) => ({ ...e, [field]: undefined }));
    };

  const ubahKategori = (v: string) => {
    setKategori(v);
    setDirty(true);
    if (!kodeManual && !modeEdit) setKode(buatKode(v, semuaBarang()));
  };

  const ubahKode = (v: string) => {
    setKode(v.toUpperCase());
    setKodeManual(true);
    setDirty(true);
    setErrors((e) => ({ ...e, kode: undefined }));
  };

  /* progress langkah */
  const langkah1Lengkap = kode.trim() !== "" && nama.trim() !== "";
  const langkah2Lengkap =
    langkah1Lengkap && stok !== "" && minimum !== "" && rak.trim() !== "";
  const langkah = [
    { no: 1, label: "Informasi barang", aktif: true, garis: langkah1Lengkap },
    { no: 2, label: "Stok & lokasi", aktif: langkah1Lengkap, garis: langkah2Lengkap },
    { no: 3, label: "Konfirmasi", aktif: langkah2Lengkap, garis: undefined },
  ];

  const simpan = () => {
    const e: Errors = {};
    const kodeBersih = kode.trim();
    const stokNum = Number(stok);
    const minNum = Number(minimum);

    if (!kodeBersih) e.kode = "Kode barang wajib diisi.";
    else if (
      semuaBarang().some(
        (b) =>
          b.kode.toLowerCase() === kodeBersih.toLowerCase() &&
          b.kode !== barangEdit?.kode,
      )
    )
      e.kode = "Kode barang sudah dipakai.";

    if (!nama.trim()) e.nama = "Nama barang wajib diisi.";

    if (stok === "" || !Number.isInteger(stokNum) || stokNum < 0)
      e.stok = "Isi dengan angka bulat, minimal 0.";
    if (minimum === "" || !Number.isInteger(minNum) || minNum < 0)
      e.minimum = "Isi dengan angka bulat, minimal 0.";
    if (!rak.trim()) e.rak = "Rak / bin wajib diisi.";

    setErrors(e);
    if (Object.keys(e).length > 0) {
      setToast("Masih ada isian yang belum benar. Periksa kolom berwarna merah.");
      return;
    }

    const stokTeks = modeEdit
      ? (barangEdit as BarangTersimpan).stok
      : `${stokNum} ${satuan.toLowerCase()}`;
    const stokAngka = modeEdit ? parseInt(stokTeks, 10) : stokNum;

    const item: BarangTersimpan = {
      kode: kodeBersih,
      nama: nama.trim(),
      kategori,
      lokasi: `${gudang} · ${rak.trim()}`,
      stok: stokTeks,
      minimum: String(minNum),
      menipis: stokAngka <= minNum,
      merek: merek.trim(),
      model: model.trim(),
      deskripsi: deskripsi.trim(),
      aktif,
    };

    try {
      const kodeLama = barangEdit?.kode;

      /* buang versi lama (kode lama / kode yang sama) dari data tersimpan */
      const lama = bacaTersimpan().filter(
        (b) => b.kode !== (kodeLama ?? kodeBersih) && b.kode !== kodeBersih,
      );
      localStorage.setItem(KEY_TERSIMPAN, JSON.stringify([...lama, item]));

      /* kode baru boleh dipakai lagi; kode lama (kalau diganti) disembunyikan */
      const dihapus = new Set(bacaJson<string[]>(KEY_DIHAPUS, []));
      dihapus.delete(kodeBersih);
      if (kodeLama && kodeLama !== kodeBersih) dihapus.add(kodeLama);
      localStorage.setItem(KEY_DIHAPUS, JSON.stringify([...dihapus]));

      /* simpan kode terbaru supaya halaman detail tetap menemukan barangnya */
      sessionStorage.setItem(KEY_TERPILIH, kodeBersih);
    } catch {
      setToast("Data gagal disimpan.");
      return;
    }

    setDirty(false);
    setToast(
      modeEdit ? "Perubahan barang berhasil disimpan." : "Barang baru berhasil disimpan.",
    );
    setTimeout(kembali, 900);
  };

  /* jangan hapus kode terpilih, halaman detail masih membutuhkannya */
  const batal = () => {
    kembali();
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
                {modeEdit ? "Edit Barang" : "Tambah Barang"}
              </p>
              <p className="w-full shrink-0 text-[14px] text-[#64748b]">
                Lengkapi atau perbarui data master barang. Kolom bertanda *
                wajib diisi.
              </p>
            </div>
            <button
              type="button"
              onClick={batal}
              className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-white bg-white px-[15px] text-[#64748b] hover:bg-[#f8fafc]"
            >
              <ChevronLeft size={16} className="shrink-0" />
              <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                Kembali
              </span>
            </button>
          </div>

          {/* Form progress */}
          <div className="flex w-full shrink-0 items-center justify-between overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white p-[14px]">
            {langkah.map((l) => (
              <div
                key={l.no}
                className="flex shrink-0 items-center gap-[9px] overflow-clip"
              >
                <div
                  className={`flex size-[28px] shrink-0 items-center justify-center overflow-clip rounded-[999px] border border-solid ${
                    l.aktif
                      ? "border-[#1769e0] bg-[#1769e0]"
                      : "border-[#dce4ee] bg-[#f8fafc]"
                  }`}
                >
                  <p
                    className={`shrink-0 whitespace-nowrap text-[11px] font-normal not-italic leading-[normal] ${
                      l.aktif ? "text-white" : "text-[#64748b]"
                    }`}
                  >
                    {l.no}
                  </p>
                </div>
                <p
                  className={`shrink-0 whitespace-nowrap text-[12px] not-italic leading-[normal] ${
                    l.aktif
                      ? "font-bold text-[#172b4d]"
                      : "font-medium text-[#64748b]"
                  }`}
                >
                  {l.label}
                </p>
                {l.garis !== undefined && (
                  <div
                    className={`h-[2px] w-[220px] shrink-0 ${
                      l.garis ? "bg-[#1769e0]" : "bg-[#dce4ee]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form columns */}
          <div className="flex w-full shrink-0 items-start gap-[16px]">
            {/* Primary form */}
            <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[16px]">
              <Card>
                <SectionHeading
                  icon={PackageSearch}
                  title="Informasi barang"
                  desc="Identitas utama yang digunakan pada pencarian dan laporan."
                />
                <Row>
                  <Field
                    label="Kode barang *"
                    hint="Dibuat otomatis, dapat disesuaikan."
                    error={errors.kode}
                  >
                    <TextInput
                      value={kode}
                      onChange={ubahKode}
                      error={errors.kode}
                    />
                  </Field>
                  <Field label="Nama barang *" error={errors.nama}>
                    <TextInput
                      value={nama}
                      onChange={ubah(setNama, "nama")}
                      placeholder="Contoh: Access Point Wi-Fi 6"
                      error={errors.nama}
                    />
                  </Field>
                </Row>
                <Row>
                  <Field label="Kategori">
                    <SelectInput
                      value={kategori}
                      onChange={ubahKategori}
                      options={opsiKategori}
                    />
                  </Field>
                  <Field label="Satuan">
                    <SelectInput
                      value={satuan}
                      onChange={ubah(setSatuan)}
                      options={opsiSatuan}
                    />
                  </Field>
                </Row>
                <Row>
                  <Field label="Merek">
                    <TextInput
                      value={merek}
                      onChange={ubah(setMerek)}
                      placeholder="Contoh: Ubiquiti"
                    />
                  </Field>
                  <Field label="Tipe / model">
                    <TextInput
                      value={model}
                      onChange={ubah(setModel)}
                      placeholder="Contoh: UniFi U6+"
                    />
                  </Field>
                </Row>
                <div className="flex w-full shrink-0 flex-col items-start gap-[7px]">
                  <p className="shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal] text-[#172b4d]">
                    Deskripsi
                  </p>
                  <textarea
                    value={deskripsi}
                    onChange={(e) => ubah(setDeskripsi)(e.target.value)}
                    placeholder="Tambahkan spesifikasi singkat atau kegunaan barang..."
                    className="h-[78px] w-full shrink-0 resize-none rounded-[8px] border border-solid border-[#dce4ee] bg-white p-[12px] text-[13px] font-normal not-italic leading-[1.4] text-[#172b4d] outline-none placeholder:text-[#94a3b8] focus:border-[#1769e0]"
                  />
                </div>
              </Card>

              <Card>
                <SectionHeading
                  icon={PackageSearch}
                  title="Stok & lokasi"
                  desc="Atur saldo awal, ambang minimum, dan posisi penyimpanan."
                />
                <Row>
                  <Field
                    label="Stok awal *"
                    hint={
                      modeEdit
                        ? "Stok diubah lewat menu Barang Masuk / Keluar."
                        : "Transaksi awal akan tercatat otomatis."
                    }
                    error={errors.stok}
                  >
                    <TextInput
                      type="number"
                      value={modeEdit ? String(parseInt(barangEdit!.stok, 10)) : stok}
                      onChange={ubah(setStok, "stok")}
                      readOnly={modeEdit}
                      error={errors.stok}
                    />
                  </Field>
                  <Field
                    label="Stok minimum *"
                    hint="Sistem memberi peringatan saat stok ≤ nilai ini."
                    error={errors.minimum}
                  >
                    <TextInput
                      type="number"
                      value={minimum}
                      onChange={ubah(setMinimum, "minimum")}
                      error={errors.minimum}
                    />
                  </Field>
                </Row>
                <Row>
                  <Field label="Lokasi penyimpanan">
                    <SelectInput
                      value={gudang}
                      onChange={ubah(setGudang)}
                      options={opsiGudang}
                    />
                  </Field>
                  <Field label="Rak / bin *" error={errors.rak}>
                    <TextInput
                      value={rak}
                      onChange={ubah(setRak, "rak")}
                      placeholder="Contoh: Rak B-04"
                      error={errors.rak}
                    />
                  </Field>
                </Row>
              </Card>
            </div>

            {/* Form guidance */}
            <div className="relative flex w-[300px] shrink-0 flex-col items-start gap-[16px]">
              <div
                role="radiogroup"
                aria-label="Status data"
                className="relative flex w-[300px] shrink-0 flex-col items-start gap-[15px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[18px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]"
              >
                <p className="shrink-0 whitespace-nowrap text-[14px] font-normal not-italic leading-[normal] text-[#172b4d]">
                  Status data
                </p>
                <StatusOption
                  aktif
                  dipilih={aktif}
                  judul="Aktif"
                  desc="Dapat dipakai dalam transaksi"
                  onClick={() => {
                    setAktif(true);
                    setDirty(true);
                  }}
                />
                <StatusOption
                  aktif={false}
                  dipilih={!aktif}
                  judul="Nonaktif"
                  desc="Disimpan sebagai arsip"
                  onClick={() => {
                    setAktif(false);
                    setDirty(true);
                  }}
                />
              </div>

              <div className="flex w-full shrink-0 flex-col items-start gap-[12px] overflow-clip rounded-[12px] bg-[#eaf2ff] p-[18px] font-normal not-italic">
                <div className="flex shrink-0 items-center gap-[8px] overflow-clip">
                  <div className="flex size-[17px] shrink-0 items-center justify-center text-[#1769e0]">
                    <Lightbulb size={17} />
                  </div>
                  <p className="shrink-0 whitespace-nowrap text-[12px] leading-[normal] text-[#0e4fab]">
                    Panduan singkat
                  </p>
                </div>
                {tips.map((t) => (
                  <div
                    key={t}
                    className="flex w-full shrink-0 items-start gap-[8px] overflow-clip"
                  >
                    <p className="shrink-0 whitespace-nowrap text-[12px] leading-[normal] text-[#1769e0]">
                      •
                    </p>
                    <p className="min-w-px flex-[1_0_0] text-[10px] leading-[1.5] text-[#0e4fab]">
                      {t}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form actions */}
          <div className="flex w-full shrink-0 items-center justify-between overflow-clip pt-[4px]">
            <p className="shrink-0 whitespace-nowrap text-[11px] font-normal not-italic leading-[normal] text-[#64748b]">
              {dirty ? "Ada perubahan yang belum disimpan" : "Data belum disimpan"}
            </p>
            <div className="flex shrink-0 items-start gap-[9px] overflow-clip">
              <button
                type="button"
                onClick={batal}
                className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] hover:bg-[#f3f6fa]"
              >
                <span className="shrink-0 whitespace-nowrap text-[14px] font-normal not-italic leading-[normal] text-[#1769e0]">
                  Batal
                </span>
              </button>
              <button
                type="button"
                onClick={simpan}
                className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] font-normal not-italic text-white hover:bg-[#0e4fab]"
              >
                <Save size={16} className="shrink-0" />
                <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                  {modeEdit ? "Simpan perubahan" : "Simpan barang"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

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