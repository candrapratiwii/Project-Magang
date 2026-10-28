import { useEffect, useState, type ReactNode } from "react";
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
import { apiRequest } from "../api";

/* ====================================================================
 * KONTRAK API
 *
 * GET  /kategori-barang -> daftar kategori
 * GET  /barang          -> daftar barang
 * POST /barang          -> tambah barang
 * PUT  /barang/{id}     -> edit barang berdasarkan ID database
 *
 * Lokasi tetap: "Tempat Penyimpanan"
 * ==================================================================== */

const BACKEND_DUKUNG_MEREK_MODEL = false;
const LOKASI_TETAP = "Tempat Penyimpanan";

const panggil = <T,>(
  path: string,
  method: "GET" | "POST" | "PUT" = "GET",
  body?: unknown,
) =>
  apiRequest<T>(
    path,
    method === "GET"
      ? undefined
      : {
          method,
          body:
            body === undefined ? undefined : JSON.stringify(body),
        },
  );

const bukaData = <T,>(raw: unknown): T =>
  (raw && typeof raw === "object" && "data" in raw
    ? (raw as { data: T }).data
    : raw) as T;

const ambil = (
  o: Record<string, unknown>,
  ...kunci: string[]
) => {
  for (const k of kunci) {
    if (o[k] !== undefined && o[k] !== null) {
      return String(o[k]);
    }
  }
  return "";
};

type Errors = Partial<
  Record<
    "kode" | "nama" | "kategori" | "stok" | "minimum",
    string
  >
>;

const FIELD_API: Record<string, keyof Errors> = {
  kode_barang: "kode",
  nama_barang: "nama",
  kategori_barang_id: "kategori",
  stok: "stok",
  stok_minimum: "minimum",
};

function bacaErrorApi(
  err: unknown,
): { pesan: string; fields: Errors } {
  const fields: Errors = {};
  let pesan = "Data gagal disimpan.";

  if (err && typeof err === "object") {
    const o = err as {
      message?: unknown;
      errors?: unknown;
    };

    if (typeof o.message === "string" && o.message) {
      pesan = o.message;
    }

    if (o.errors && typeof o.errors === "object") {
      for (const [k, v] of Object.entries(
        o.errors as Record<string, unknown>,
      )) {
        const f = FIELD_API[k];
        const teks = Array.isArray(v)
          ? String(v[0] ?? "")
          : String(v ?? "");

        if (f && teks) fields[f] = teks;
      }

      if (Object.keys(fields).length > 0) {
        pesan =
          "Masih ada isian yang belum benar. Periksa kolom berwarna merah.";
      }
    }
  }

  return { pesan, fields };
}

/* ------------------------------ Data ------------------------------ */

interface Kategori {
  id: string;
  nama: string;
}

interface Opsi {
  value: string;
  label: string;
}

const opsiSatuan = [
  "Unit",
  "Pcs",
  "Roll",
  "Box",
  "Set",
  "Meter",
];

const tips = [
  "Gunakan nama barang yang mudah dikenali.",
  "Pastikan kategori dan satuan sudah tepat.",
  "Stok minimum membantu mencegah kekosongan.",
];

const KEY_TERPILIH = "simpera-barang-terpilih";

function bacaKodeTerpilih(): string | null {
  try {
    return sessionStorage.getItem(KEY_TERPILIH);
  } catch {
    return null;
  }
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
  placeholder,
  disabled = false,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Opsi[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div className="relative w-full shrink-0">
      <select
        value={value}
        disabled={disabled}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[42px] w-full cursor-pointer appearance-none rounded-[8px] border border-solid bg-white px-[12px] pr-[34px] text-[14px] font-normal not-italic text-[#172b4d] outline-none disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#64748b] ${
          error
            ? "border-[#c2413a]"
            : "border-[#dce4ee] focus:border-[#1769e0]"
        }`}
      >
        {placeholder !== undefined && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
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

        <p className="w-full shrink-0 text-[11px] text-[#64748b]">
          {desc}
        </p>
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
    <div className="flex w-full shrink-0 items-start gap-[14px]">
      {children}
    </div>
  );
}

type StatusMuat = "memuat" | "siap" | "gagal";
/* ------------------------------ Halaman ------------------------------ */

export default function FormTambahEditBarangScreen() {
  const { user } = useAuth();

  /* Mode edit jika halaman sebelumnya memilih sebuah barang */
  const [kodeTerpilih] = useState(bacaKodeTerpilih);
  const modeEdit = kodeTerpilih !== null;

  const [barangId, setBarangId] = useState<string | null>(null);
  const [statusBarang, setStatusBarang] = useState<StatusMuat>(
    modeEdit ? "memuat" : "siap",
  );

  const [daftarKategori, setDaftarKategori] = useState<Kategori[]>([]);
  const [statusKategori, setStatusKategori] =
    useState<StatusMuat>("memuat");
  const [percobaanKategori, setPercobaanKategori] = useState(0);

  const [kategoriId, setKategoriId] = useState("");
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [satuan, setSatuan] = useState("Unit");
  const [merek, setMerek] = useState("");
  const [model, setModel] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [stok, setStok] = useState("0");
  const [minimum, setMinimum] = useState("5");

  const [errors, setErrors] = useState<Errors>({});
  const [dirty, setDirty] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;

    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---- Kategori dari API ---- */
  useEffect(() => {
    let batal = false;

    setStatusKategori("memuat");

    panggil<unknown>("/kategori-barang")
      .then((raw) => {
        if (batal) return;

        const data = bukaData<unknown>(raw);

        const hasil: Kategori[] = (
          Array.isArray(data) ? data : []
        ).map((k: Record<string, unknown>) => ({
          id: ambil(k, "id"),
          nama: ambil(k, "nama", "nama_kategori"),
        }));

        setDaftarKategori(hasil);
        setStatusKategori("siap");

        if (!modeEdit && hasil.length > 0) {
          setKategoriId((cur) => cur || hasil[0].id);
        }
      })
      .catch(() => {
        if (!batal) setStatusKategori("gagal");
      });

    return () => {
      batal = true;
    };
  }, [percobaanKategori, modeEdit]);

  /* ---- Data barang untuk mode edit ---- */
  useEffect(() => {
    if (kodeTerpilih === null) return;

    let batal = false;
    setStatusBarang("memuat");

    panggil<unknown>("/barang")
      .then((raw) => {
        if (batal) return;

        const data = bukaData<unknown>(raw);
        const daftar = Array.isArray(data) ? data : [];

        const b = daftar.find(
          (item) =>
            item &&
            typeof item === "object" &&
            ambil(
              item as Record<string, unknown>,
              "kode_barang",
              "kode",
            ) === kodeTerpilih,
        ) as Record<string, unknown> | undefined;

        if (!b) {
          throw new Error("Barang tidak ditemukan.");
        }

        const satuanApi = ambil(b, "satuan");

        setBarangId(ambil(b, "id") || null);
        setKode(ambil(b, "kode_barang", "kode"));
        setNama(ambil(b, "nama_barang", "nama"));
        setKategoriId(
          ambil(b, "kategori_barang_id", "kategori_id"),
        );

        setSatuan(
          opsiSatuan.find(
            (o) => o.toLowerCase() === satuanApi.toLowerCase(),
          ) ?? "Unit",
        );

        setStok(ambil(b, "stok") || "0");
        setMinimum(ambil(b, "stok_minimum", "minimum") || "0");
        setDeskripsi(ambil(b, "deskripsi"));

        setStatusBarang("siap");
      })
      .catch(() => {
        if (!batal) setStatusBarang("gagal");
      });

    return () => {
      batal = true;
    };
  }, [kodeTerpilih]);

  /* Setiap perubahan menandai data sebagai berubah */
  const ubah =
    (setter: (v: string) => void, field?: keyof Errors) =>
    (v: string) => {
      setter(v);
      setDirty(true);

      if (field) {
        setErrors((e) => ({ ...e, [field]: undefined }));
      }
    };

  const ubahKode = (v: string) => {
    setKode(v.toUpperCase());
    setDirty(true);
    setErrors((e) => ({ ...e, kode: undefined }));
  };

  /* Progress langkah */
  const langkah1Lengkap =
    kode.trim() !== "" && nama.trim() !== "";

  const langkah2Lengkap =
    langkah1Lengkap && stok !== "" && minimum !== "";

  const langkah = [
    {
      no: 1,
      label: "Informasi barang",
      aktif: true,
      garis: langkah1Lengkap,
    },
    {
      no: 2,
      label: "Stok & lokasi",
      aktif: langkah1Lengkap,
      garis: langkah2Lengkap,
    },
    {
      no: 3,
      label: "Konfirmasi",
      aktif: langkah2Lengkap,
      garis: undefined,
    },
  ];

  const simpan = async () => {
    if (menyimpan) return;

    const e: Errors = {};
    const kodeBersih = kode.trim();
    const stokNum = Number(stok);
    const minNum = Number(minimum);

    if (!kodeBersih) {
      e.kode = "Kode barang wajib diisi.";
    }

    if (!nama.trim()) {
      e.nama = "Nama barang wajib diisi.";
    }

    if (!kategoriId) {
      e.kategori = "Pilih kategori barang.";
    }

    /* Stok hanya diisi saat tambah barang.
       Saat edit, stok dikelola lewat transaksi. */
    if (
      !modeEdit &&
      (stok === "" || !Number.isInteger(stokNum) || stokNum < 0)
    ) {
      e.stok = "Isi dengan angka bulat, minimal 0.";
    }

    if (
      minimum === "" ||
      !Number.isInteger(minNum) ||
      minNum < 0
    ) {
      e.minimum = "Isi dengan angka bulat, minimal 0.";
    }

    setErrors(e);

    if (Object.keys(e).length > 0) {
      setToast(
        "Masih ada isian yang belum benar. Periksa kolom berwarna merah.",
      );
      return;
    }

    if (modeEdit && !barangId) {
      setToast(
        "Data barang belum termuat. Coba muat ulang halaman.",
      );
      return;
    }

    const idKategori = Number.isNaN(Number(kategoriId))
      ? kategoriId
      : Number(kategoriId);

    /* Merek/model dikirim hanya setelah backend mendukungnya */
    const tambahan = BACKEND_DUKUNG_MEREK_MODEL
      ? { merek: merek.trim(), model: model.trim() }
      : {};

    const dasar = {
      kode_barang: kodeBersih,
      nama_barang: nama.trim(),
      kategori_barang_id: idKategori,
      satuan: satuan.toLowerCase(),
      lokasi: LOKASI_TETAP,
      stok_minimum: minNum,
      deskripsi: deskripsi.trim() || null,
      ...tambahan,
    };

    setMenyimpan(true);

    try {
      if (modeEdit) {
        /* Stok tidak diubah melalui form edit */
        await panggil(
          `/barang/${encodeURIComponent(barangId as string)}`,
          "PUT",
          dasar,
        );
      } else {
        await panggil("/barang", "POST", {
          ...dasar,
          stok: stokNum,
        });
      }
    } catch (err) {
      const { pesan, fields } = bacaErrorApi(err);

      setErrors((cur) => ({ ...cur, ...fields }));
      setToast(pesan);
      setMenyimpan(false);
      return;
    }

    setMenyimpan(false);

    try {
      sessionStorage.setItem(KEY_TERPILIH, kodeBersih);
    } catch {
      /* Abaikan jika sessionStorage tidak tersedia */
    }

    const adaMerekModel =
      merek.trim() !== "" || model.trim() !== "";

    const catatan =
      !BACKEND_DUKUNG_MEREK_MODEL && adaMerekModel
        ? " Merek dan tipe/model belum tersimpan karena backend belum mendukung kolomnya."
        : "";

    setDirty(false);

    setToast(
      (modeEdit
        ? "Perubahan barang berhasil disimpan."
        : "Barang baru berhasil disimpan.") + catatan,
    );

    setTimeout(kembali, catatan ? 2500 : 900);
  };

  const batal = () => {
    kembali();
  };

  const opsiKategori: Opsi[] = daftarKategori.map((k) => ({
    value: k.id,
    label: k.nama,
  }));

  const hintMerekModel = BACKEND_DUKUNG_MEREK_MODEL
    ? "Opsional."
    : "Opsional. Belum tersimpan ke server.";

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
                Lengkapi atau perbarui data master barang. Kolom
                bertanda * wajib diisi.
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
          {modeEdit && statusBarang !== "siap" ? (
            <Card>
              <p className="text-[14px] font-normal not-italic text-[#172b4d]">
                {statusBarang === "memuat"
                  ? "Memuat data barang..."
                  : "Data barang tidak dapat dimuat."}
              </p>

              {statusBarang === "gagal" && (
                <p className="text-[12px] font-normal not-italic text-[#64748b]">
                  Barang mungkin sudah dihapus atau server tidak dapat
                  dihubungi. Kembali ke Master Barang untuk memilih
                  barang lain.
                </p>
              )}
            </Card>
          ) : (
            <>
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
                          l.aktif
                            ? "text-white"
                            : "text-[#64748b]"
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
                          l.garis
                            ? "bg-[#1769e0]"
                            : "bg-[#dce4ee]"
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
                        hint="Isi kode yang unik, contoh: NET-AP-019."
                        error={errors.kode}
                      >
                        <TextInput
                          value={kode}
                          onChange={ubahKode}
                          placeholder="Contoh: NET-AP-019"
                          error={errors.kode}
                        />
                      </Field>

                      <Field
                        label="Nama barang *"
                        error={errors.nama}
                      >
                        <TextInput
                          value={nama}
                          onChange={ubah(setNama, "nama")}
                          placeholder="Contoh: Access Point Wi-Fi 6"
                          error={errors.nama}
                        />
                      </Field>
                    </Row>

                    <Row>
                      <Field
                        label="Kategori *"
                        error={
                          errors.kategori ??
                          (statusKategori === "gagal"
                            ? "Kategori tidak dapat dimuat dari server."
                            : undefined)
                        }
                      >
                        <SelectInput
                          value={kategoriId}
                          onChange={ubah(setKategoriId, "kategori")}
                          options={opsiKategori}
                          placeholder={
                            statusKategori === "memuat"
                              ? "Memuat kategori..."
                              : "Pilih kategori"
                          }
                          disabled={statusKategori !== "siap"}
                          error={errors.kategori}
                        />

                        {statusKategori === "gagal" && (
                          <button
                            type="button"
                            onClick={() =>
                              setPercobaanKategori((n) => n + 1)
                            }
                            className="text-[11px] font-normal not-italic text-[#1769e0] hover:underline"
                          >
                            Coba lagi
                          </button>
                        )}
                      </Field>

                      <Field label="Satuan">
                        <SelectInput
                          value={satuan}
                          onChange={ubah(setSatuan)}
                          options={opsiSatuan.map((s) => ({
                            value: s,
                            label: s,
                          }))}
                        />
                      </Field>
                    </Row>

                    <Row>
                      <Field
                        label="Merek"
                        hint={hintMerekModel}
                      >
                        <TextInput
                          value={merek}
                          onChange={ubah(setMerek)}
                          placeholder="Contoh: Ubiquiti"
                        />
                      </Field>

                      <Field
                        label="Tipe / model"
                        hint={hintMerekModel}
                      >
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
                        onChange={(e) =>
                          ubah(setDeskripsi)(e.target.value)
                        }
                        placeholder="Tambahkan spesifikasi singkat atau kegunaan barang..."
                        className="h-[78px] w-full shrink-0 resize-none rounded-[8px] border border-solid border-[#dce4ee] bg-white p-[12px] text-[13px] font-normal not-italic leading-[1.4] text-[#172b4d] outline-none placeholder:text-[#94a3b8] focus:border-[#1769e0]"
                      />
                    </div>
                  </Card>

                  <Card>
                    <SectionHeading
                      icon={PackageSearch}
                      title="Stok & lokasi"
                      desc="Atur saldo awal dan ambang minimum stok."
                    />

                    <Row>
                      <Field
                        label="Stok awal *"
                        hint={
                          modeEdit
                            ? "Stok diubah lewat menu Barang Masuk / Keluar."
                            : "Periksa pencatatan transaksi stok awal pada backend."
                        }
                        error={errors.stok}
                      >
                        <TextInput
                          type="number"
                          value={stok}
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
                        <TextInput
                          value={LOKASI_TETAP}
                          readOnly
                        />
                      </Field>
                    </Row>
                  </Card>
                </div>

                {/* Form guidance */}
                <div className="relative flex w-[300px] shrink-0 flex-col items-start gap-[16px]">
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
                  {dirty
                    ? "Ada perubahan yang belum disimpan"
                    : "Data belum disimpan"}
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
                    disabled={menyimpan}
                    className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] font-normal not-italic text-white hover:bg-[#0e4fab] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={16} className="shrink-0" />

                    <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                      {menyimpan
                        ? "Menyimpan..."
                        : modeEdit
                          ? "Simpan perubahan"
                          : "Simpan barang"}
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
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