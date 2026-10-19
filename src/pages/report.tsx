import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  PackagePlus,
  PackageMinus,
  Receipt,
  ArrowDownToLine,
  ArrowUpFromLine,
  Filter as FilterIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  FileSpreadsheet,
  FileText,
  Columns3,
  type LucideIcon,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { useAuth } from "../auth";

/* ------------------------------ Data ------------------------------ */

type Jenis = "Masuk" | "Keluar";

interface Transaksi {
  tanggal: string; // YYYY-MM-DD
  jam: string;
  nomor: string;
  jenis: Jenis;
  barang: string;
  kategori: string;
  jumlah: number;
  satuan: string;
  asalTujuan: string;
  petugas: string;
}

/* Samakan dengan data di Master Barang */
const infoBarang: Record<string, { kategori: string; satuan: string }> = {
  "Kabel LAN Cat6 UTP 305m": { kategori: "Kabel & aksesori", satuan: "roll" },
  "Konektor RJ45 Cat6": { kategori: "Material jaringan", satuan: "pcs" },
  "Router MikroTik RB4011": { kategori: "Perangkat jaringan", satuan: "unit" },
  "Switch Managed 24 Port PoE": { kategori: "Perangkat jaringan", satuan: "unit" },
  "Access Point Wi-Fi 6": { kategori: "Perangkat jaringan", satuan: "unit" },
  "SFP Module 1G Single Mode": { kategori: "Perangkat jaringan", satuan: "unit" },
  "Patch Cord Cat6 1m": { kategori: "Kabel & aksesori", satuan: "pcs" },
  "Firewall FortiGate 60F": { kategori: "Perangkat jaringan", satuan: "unit" },
  "UPS 1200VA": { kategori: "Perangkat pendukung", satuan: "unit" },
};

function t(
  tanggal: string,
  jam: string,
  nomor: string,
  jenis: Jenis,
  barang: string,
  jumlah: number,
  asalTujuan: string,
  petugas: string,
): Transaksi {
  const i = infoBarang[barang];
  return { tanggal, jam, nomor, jenis, barang, kategori: i.kategori, jumlah, satuan: i.satuan, asalTujuan, petugas };
}

const semuaTransaksi: Transaksi[] = [
  t("2026-10-05", "09.14", "BK-2026-0108", "Keluar", "Access Point Wi-Fi 6", 8, "Bidang Aptika", "Ayu Pramesti"),
  t("2026-10-05", "08.42", "BM-2026-0064", "Masuk", "Konektor RJ45 Cat6", 120, "CV Jaringan Bali", "Made Aditya"),
  t("2026-10-04", "14.20", "BM-2026-0063", "Masuk", "Switch Managed 24 Port PoE", 6, "PT Bali Digital", "Made Aditya"),
  t("2026-10-04", "10.05", "BK-2026-0107", "Keluar", "Patch Cord Cat6 1m", 24, "UPTD Jaringan", "Komang Arta"),
  t("2026-10-03", "16.30", "BK-2026-0106", "Keluar", "Router MikroTik RB4011", 2, "Sekretariat", "Komang Arta"),
  t("2026-10-03", "11.10", "BM-2026-0062", "Masuk", "Patch Cord Cat6 1m", 40, "Hasil pengadaan", "Made Aditya"),
  t("2026-10-02", "15.45", "BK-2026-0105", "Keluar", "Kabel LAN Cat6 UTP 305m", 3, "Bidang IKP", "Ayu Pramesti"),
  t("2026-10-02", "13.05", "BK-2026-0104", "Keluar", "Konektor RJ45 Cat6", 40, "UPTD Jaringan", "Komang Arta"),
  t("2026-10-02", "09.30", "BM-2026-0061", "Masuk", "SFP Module 1G Single Mode", 10, "PT Bali Digital", "Made Aditya"),
  t("2026-10-01", "14.50", "BK-2026-0103", "Keluar", "UPS 1200VA", 2, "Bidang Persandian", "Komang Arta"),
  t("2026-10-01", "10.20", "BM-2026-0060", "Masuk", "Kabel LAN Cat6 UTP 305m", 10, "CV Jaringan Bali", "Ayu Pramesti"),
  t("2026-10-01", "08.55", "BK-2026-0102", "Keluar", "Access Point Wi-Fi 6", 4, "Bidang IKP", "Ayu Pramesti"),
  t("2026-10-01", "08.10", "BM-2026-0059", "Masuk", "Router MikroTik RB4011", 5, "PT Bali Digital", "Made Aditya"),
  t("2026-09-30", "15.20", "BK-2026-0101", "Keluar", "Switch Managed 24 Port PoE", 2, "Sekretariat", "Komang Arta"),
  t("2026-09-30", "10.40", "BM-2026-0058", "Masuk", "Konektor RJ45 Cat6", 80, "CV Jaringan Bali", "Made Aditya"),
  t("2026-09-29", "11.30", "BK-2026-0100", "Keluar", "Patch Cord Cat6 1m", 16, "Bidang Aptika", "Ayu Pramesti"),
  t("2026-09-29", "09.00", "BM-2026-0057", "Masuk", "Access Point Wi-Fi 6", 12, "PT Bali Digital", "Made Aditya"),
  t("2026-09-28", "14.10", "BK-2026-0099", "Keluar", "Firewall FortiGate 60F", 1, "UPTD Jaringan", "Komang Arta"),
  t("2026-09-28", "10.15", "BM-2026-0056", "Masuk", "UPS 1200VA", 4, "PT Bali Digital", "Ayu Pramesti"),
];

const opsiJenis = ["Semua transaksi", "Barang masuk", "Barang keluar"];
const opsiKategori = Array.from(new Set(Object.values(infoBarang).map((i) => i.kategori))).sort();

interface FilterLaporan {
  mulai: string;
  akhir: string;
  jenis: string;
  kategori: string;
}

const FILTER_BAWAAN: FilterLaporan = {
  mulai: "2026-10-01",
  akhir: "2026-10-05",
  jenis: "Semua transaksi",
  kategori: "Semua kategori",
};

type KolomKey =
  | "tanggal"
  | "nomor"
  | "jenis"
  | "barang"
  | "kategori"
  | "jumlah"
  | "asalTujuan"
  | "petugas";

const kolomDef: { key: KolomKey; label: string; lebar: string; bawaan: boolean }[] = [
  { key: "tanggal", label: "Tanggal", lebar: "w-[125px]", bawaan: true },
  { key: "nomor", label: "Nomor", lebar: "w-[105px]", bawaan: true },
  { key: "jenis", label: "Jenis", lebar: "w-[95px]", bawaan: true },
  { key: "barang", label: "Barang", lebar: "w-[190px]", bawaan: true },
  { key: "kategori", label: "Kategori", lebar: "w-[130px]", bawaan: false },
  { key: "jumlah", label: "Jumlah", lebar: "w-[75px]", bawaan: true },
  { key: "asalTujuan", label: "Asal / tujuan", lebar: "w-[145px]", bawaan: true },
  { key: "petugas", label: "Petugas", lebar: "w-[110px]", bawaan: true },
];

const KOLOM_KEY = "simpera-laporan-kolom";
const kolomBawaan = (): Record<KolomKey, boolean> =>
  Object.fromEntries(kolomDef.map((k) => [k.key, k.bawaan])) as Record<KolomKey, boolean>;

function bacaKolom(): Record<KolomKey, boolean> {
  try {
    const raw = localStorage.getItem(KOLOM_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<KolomKey, boolean>;
      const gabung = { ...kolomBawaan(), ...parsed };
      if (Object.values(gabung).some(Boolean)) return gabung;
    }
  } catch {
    /* abaikan */
  }
  return kolomBawaan();
}

const PER_HALAMAN = 6;

const jenisStyle: Record<Jenis, { bg: string; text: string; icon: LucideIcon }> = {
  Masuk: { bg: "#eaf8ef", text: "#15803d", icon: ArrowDownToLine },
  Keluar: { bg: "#f2ecff", text: "#7c3aed", icon: ArrowUpFromLine },
};

const warnaBarang = ["#1769e0", "#0891b2", "#7c3aed", "#15803d", "#b45309"];

/* ------------------------------ Util ------------------------------ */

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const tgl = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d} ${BULAN[Number(m) - 1]} ${y}`;
};
const tambahHari = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const selisihHari = (a: string, b: string) =>
  Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function unduh(blob: Blob, nama: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nama;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* Cetak lewat iframe tersembunyi: tidak diblokir pop-up dan tidak ikut mencetak halaman */
function cetakHtml(html: string) {
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    iframe.remove();
    return false;
  }
  doc.open();
  doc.write(html);
  doc.close();
  const bersihkan = () => iframe.remove();
  win.addEventListener("afterprint", bersihkan);
  setTimeout(bersihkan, 120000);
  setTimeout(() => {
    win.focus();
    win.print();
  }, 250);
  return true;
}

function daftarHalaman(cur: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, cur - 1, cur, cur + 1]);
  const arr = Array.from(set)
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  arr.forEach((n, i) => {
    if (i > 0 && n - arr[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

/* ---------- Pembuat .xlsx tanpa dependensi (ZIP tanpa kompresi) ---------- */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(data: Uint8Array) {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function buatZip(files: { nama: string; isi: string }[]): Uint8Array {
  const enc = new TextEncoder();
  const bagian: Uint8Array[] = [];
  const pusat: Uint8Array[] = [];
  let offset = 0;

  for (const f of files) {
    const nama = enc.encode(f.nama);
    const data = enc.encode(f.isi);
    const crc = crc32(data);

    const lokal = new Uint8Array(30 + nama.length);
    const lv = new DataView(lokal.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true); // UTF-8
    lv.setUint16(8, 0, true); // tanpa kompresi
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0x21, true); // 1 Jan 1980
    lv.setUint32(14, crc, true);
    lv.setUint32(18, data.length, true);
    lv.setUint32(22, data.length, true);
    lv.setUint16(26, nama.length, true);
    lv.setUint16(28, 0, true);
    lokal.set(nama, 30);

    const cd = new Uint8Array(46 + nama.length);
    const cv = new DataView(cd.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0x21, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, data.length, true);
    cv.setUint16(28, nama.length, true);
    cv.setUint32(42, offset, true);
    cd.set(nama, 46);

    bagian.push(lokal, data);
    pusat.push(cd);
    offset += lokal.length + data.length;
  }

  const ukuranPusat = pusat.reduce((s, p) => s + p.length, 0);
  const akhir = new Uint8Array(22);
  const av = new DataView(akhir.buffer);
  av.setUint32(0, 0x06054b50, true);
  av.setUint16(8, files.length, true);
  av.setUint16(10, files.length, true);
  av.setUint32(12, ukuranPusat, true);
  av.setUint32(16, offset, true);

  const semua = [...bagian, ...pusat, akhir];
  const hasil = new Uint8Array(semua.reduce((s, p) => s + p.length, 0));
  let pos = 0;
  for (const p of semua) {
    hasil.set(p, pos);
    pos += p.length;
  }
  return hasil;
}

const xmlEsc = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    // buang karakter kontrol yang tidak valid di XML
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");

function hurufKolom(i: number) {
  let s = "";
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

type SelXlsx = string | number;

/** baris[0..] = array sel. style: 0 biasa, 1 header, 2 judul */
function buatXlsx(
  baris: { sel: SelXlsx[]; style?: 0 | 1 | 2 }[],
  lebar: number[],
  namaSheet = "Laporan",
): Uint8Array {
  const NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
  const REL = "http://schemas.openxmlformats.org/package/2006/relationships";
  const OD = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

  const rows = baris
    .map((b, r) => {
      const cells = b.sel
        .map((v, c) => {
          const ref = `${hurufKolom(c)}${r + 1}`;
          const s = b.style ? ` s="${b.style}"` : "";
          return typeof v === "number"
            ? `<c r="${ref}"${s}><v>${v}</v></c>`
            : `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${xmlEsc(v)}</t></is></c>`;
        })
        .join("");
      return `<row r="${r + 1}">${cells}</row>`;
    })
    .join("");

  const cols = lebar
    .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
    .join("");

  const head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

  return buatZip([
    {
      nama: "[Content_Types].xml",
      isi: `${head}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    },
    {
      nama: "_rels/.rels",
      isi: `${head}<Relationships xmlns="${REL}"><Relationship Id="rId1" Type="${OD}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    },
    {
      nama: "xl/workbook.xml",
      isi: `${head}<workbook xmlns="${NS}" xmlns:r="${OD}"><sheets><sheet name="${xmlEsc(namaSheet)}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    },
    {
      nama: "xl/_rels/workbook.xml.rels",
      isi: `${head}<Relationships xmlns="${REL}"><Relationship Id="rId1" Type="${OD}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${OD}/styles" Target="styles.xml"/></Relationships>`,
    },
    {
      nama: "xl/styles.xml",
      isi: `${head}<styleSheet xmlns="${NS}"><fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="14"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEAF2FF"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
    },
    {
      nama: "xl/worksheets/sheet1.xml",
      isi: `${head}<worksheet xmlns="${NS}"><cols>${cols}</cols><sheetData>${rows}</sheetData></worksheet>`,
    },
  ]);
}


/* --------------------------- Komponen kecil --------------------------- */

interface Ringkasan {
  nilai: string;
  label: string;
  icon: LucideIcon;
  bg: string;
  color: string;
}

function JenisBadge({ jenis }: { jenis: Jenis }) {
  const s = jenisStyle[jenis];
  const Icon = s.icon;
  return (
    <div
      className="flex shrink-0 items-center gap-[5px] overflow-clip rounded-[999px] px-[9px] py-[5px]"
      style={{ backgroundColor: s.bg }}
    >
      <div
        className="flex size-[12px] shrink-0 items-center justify-center"
        style={{ color: s.text }}
      >
        <Icon size={12} />
      </div>
      <p
        className="shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal]"
        style={{ color: s.text }}
      >
        {jenis}
      </p>
    </div>
  );
}

const inputCls =
  "h-[42px] w-full rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[12px] text-[14px] text-[#172b4d] outline-none focus:border-[#1769e0]";

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[7px]">
      <label className="shrink-0 whitespace-nowrap text-[12px] leading-[normal] text-[#172b4d]">
        {label}
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} mt-[7px] block`}
        />
      </label>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[7px]">
      <label className="w-full shrink-0 whitespace-nowrap text-[12px] leading-[normal] text-[#172b4d]">
        {label}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} mt-[7px] block`}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function SummaryCard({ r }: { r: Ringkasan }) {
  const Icon = r.icon;
  return (
    <div className="relative flex min-w-px flex-[1_0_0] items-center gap-[12px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white p-[16px]">
      <div
        className="flex size-[36px] shrink-0 items-center justify-center overflow-clip rounded-[8px]"
        style={{ backgroundColor: r.bg }}
      >
        <div
          className="flex size-[17px] shrink-0 items-center justify-center"
          style={{ color: r.color }}
        >
          <Icon size={17} />
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-[2px] overflow-clip whitespace-nowrap font-normal not-italic leading-[normal]">
        <p className="shrink-0 text-[20px] text-[#172b4d]">{r.nilai}</p>
        <p className="shrink-0 text-[10px] text-[#64748b]">{r.label}</p>
      </div>
    </div>
  );
}

/* ------------------------------ Halaman ------------------------------ */

export default function LaporanPersediaanScreen() {
  const { user } = useAuth();

  const [draf, setDraf] = useState<FilterLaporan>(FILTER_BAWAAN);
  const [terapan, setTerapan] = useState<FilterLaporan>(FILTER_BAWAAN);
  const [errFilter, setErrFilter] = useState("");
  const [halaman, setHalaman] = useState(1);
  const [kolom, setKolom] = useState<Record<KolomKey, boolean>>(bacaKolom);
  const [menuKolom, setMenuKolom] = useState(false);
  const [toast, setToast] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!menuKolom) return;
    const klikLuar = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuKolom(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenuKolom(false);
    document.addEventListener("mousedown", klikLuar);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", klikLuar);
      document.removeEventListener("keydown", esc);
    };
  }, [menuKolom]);

  /* ---- Filter ---- */
  const belumDiterapkan = JSON.stringify(draf) !== JSON.stringify(terapan);

  const terapkan = () => {
    if (!draf.mulai || !draf.akhir) {
      setErrFilter("Tanggal mulai dan tanggal akhir wajib diisi.");
      return;
    }
    if (draf.akhir < draf.mulai) {
      setErrFilter("Tanggal akhir tidak boleh sebelum tanggal mulai.");
      return;
    }
    setErrFilter("");
    setTerapan(draf);
    setHalaman(1);
  };

  const aturUlang = () => {
    setDraf(FILTER_BAWAAN);
    setTerapan(FILTER_BAWAAN);
    setErrFilter("");
    setHalaman(1);
  };

  const hasil = useMemo(
    () =>
      semuaTransaksi
        .filter(
          (x) =>
            x.tanggal >= terapan.mulai &&
            x.tanggal <= terapan.akhir &&
            (terapan.jenis === "Semua transaksi" ||
              (terapan.jenis === "Barang masuk" ? x.jenis === "Masuk" : x.jenis === "Keluar")) &&
            (terapan.kategori === "Semua kategori" || x.kategori === terapan.kategori),
        )
        .sort((a, b) => (b.tanggal + b.jam).localeCompare(a.tanggal + a.jam)),
    [terapan],
  );

  /* ---- Ringkasan, grafik, barang aktif ---- */
  const totalMasuk = hasil.filter((x) => x.jenis === "Masuk").reduce((s, x) => s + x.jumlah, 0);
  const totalKeluar = hasil.filter((x) => x.jenis === "Keluar").reduce((s, x) => s + x.jumlah, 0);

  const ringkasan: Ringkasan[] = [
    { nilai: String(totalMasuk + totalKeluar), label: "Total pergerakan", icon: ArrowLeftRight, bg: "#eaf2ff", color: "#1769e0" },
    { nilai: String(totalMasuk), label: "Barang masuk", icon: PackagePlus, bg: "#eaf8ef", color: "#15803d" },
    { nilai: String(totalKeluar), label: "Barang keluar", icon: PackageMinus, bg: "#f2ecff", color: "#7c3aed" },
    { nilai: String(hasil.length), label: "Total transaksi", icon: Receipt, bg: "#e6f7fa", color: "#0891b2" },
  ];

  const harian = useMemo(() => {
    const jumlahHari = selisihHari(terapan.mulai, terapan.akhir) + 1;
    const awal = jumlahHari > 31 ? tambahHari(terapan.akhir, -30) : terapan.mulai;
    const n = Math.min(jumlahHari, 31);
    return Array.from({ length: n }, (_, i) => {
      const hari = tambahHari(awal, i);
      const hariIni = hasil.filter((x) => x.tanggal === hari);
      return {
        hari,
        masuk: hariIni.filter((x) => x.jenis === "Masuk").reduce((s, x) => s + x.jumlah, 0),
        keluar: hariIni.filter((x) => x.jenis === "Keluar").reduce((s, x) => s + x.jumlah, 0),
      };
    });
  }, [hasil, terapan]);

  const maksHarian = Math.max(1, ...harian.map((d) => Math.max(d.masuk, d.keluar)));
  const tinggi = (v: number) => (v === 0 ? 0 : Math.max(3, Math.round((v / maksHarian) * 88)));
  const lebarBatang = harian.length > 10 ? 6 : 14;
  const langkahLabel = harian.length > 10 ? Math.ceil(harian.length / 8) : 1;

  const barangAktif = useMemo(() => {
    const peta = new Map<string, { jumlah: number; satuan: string }>();
    hasil.forEach((x) => {
      const cur = peta.get(x.barang) ?? { jumlah: 0, satuan: x.satuan };
      peta.set(x.barang, { jumlah: cur.jumlah + x.jumlah, satuan: x.satuan });
    });
    return Array.from(peta.entries())
      .map(([nama, v]) => ({ nama, ...v }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 5);
  }, [hasil]);

  /* ---- Tabel ---- */
  const kolomTampil = kolomDef.filter((k) => kolom[k.key]);
  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
  const halamanAktif = Math.min(halaman, totalHalaman);
  const mulai = (halamanAktif - 1) * PER_HALAMAN;
  const tampil = hasil.slice(mulai, mulai + PER_HALAMAN);

  const simpanKolom = (baru: Record<KolomKey, boolean>) => {
    setKolom(baru);
    try {
      localStorage.setItem(KOLOM_KEY, JSON.stringify(baru));
    } catch {
      /* abaikan */
    }
  };

  const ubahKolom = (key: KolomKey) => {
    const baru = { ...kolom, [key]: !kolom[key] };
    if (!Object.values(baru).some(Boolean)) return; // minimal satu kolom
    simpanKolom(baru);
  };

  const teksSel = (key: KolomKey, x: Transaksi) => {
    switch (key) {
      case "tanggal":
        return `${tgl(x.tanggal)} · ${x.jam}`;
      case "nomor":
        return x.nomor;
      case "jenis":
        return x.jenis;
      case "barang":
        return x.barang;
      case "kategori":
        return x.kategori;
      case "jumlah":
        return `${x.jumlah} ${x.satuan}`;
      case "asalTujuan":
        return x.asalTujuan;
      case "petugas":
        return x.petugas;
    }
  };

  const renderSel = (key: KolomKey, x: Transaksi, kelas: string) => {
    if (key === "jenis") {
      return (
        <div key={key} className={`flex ${kelas} items-start overflow-clip`}>
          <JenisBadge jenis={x.jenis} />
        </div>
      );
    }
    const gaya: Record<string, string> = {
      tanggal: "font-normal text-[#64748b]",
      nomor: "font-bold text-[#1769e0]",
      barang: "font-semibold text-[#172b4d]",
      kategori: "font-normal text-[#64748b]",
      jumlah: "font-bold text-[#172b4d]",
      asalTujuan: "font-normal text-[#172b4d]",
      petugas: "font-normal text-[#64748b]",
    };
    return (
      <p
        key={key}
        className={`${kelas} text-[10px] not-italic leading-[normal] ${gaya[key]}`}
      >
        {teksSel(key, x)}
      </p>
    );
  };

  /* ---- Ekspor ---- */
  const infoFilter = () => [
    ["Periode", `${tgl(terapan.mulai)} – ${tgl(terapan.akhir)}`],
    ["Jenis transaksi", terapan.jenis],
    ["Kategori barang", terapan.kategori],
  ];

  const exportExcel = () => {
    if (hasil.length === 0) return;
    const lebarKolom: Record<KolomKey, number> = {
      tanggal: 22, nomor: 16, jenis: 10, barang: 30, kategori: 20, jumlah: 10, asalTujuan: 24, petugas: 18,
    };
    const header: string[] = [];
    const lebar: number[] = [];
    kolomTampil.forEach((k) => {
      header.push(k.label);
      lebar.push(lebarKolom[k.key]);
      if (k.key === "jumlah") {
        header.push("Satuan");
        lebar.push(10);
      }
    });
    // kolom pertama dipakai juga untuk label info filter
    lebar[0] = Math.max(lebar[0], 18);

    const data = hasil.map((x) => ({
      sel: kolomTampil.flatMap((k) =>
        k.key === "jumlah" ? [x.jumlah, x.satuan] : [teksSel(k.key, x)],
      ) as (string | number)[],
    }));

    const bytes = buatXlsx(
      [
        { sel: ["Laporan Persediaan"], style: 2 },
        ...infoFilter().map(([a, b]) => ({ sel: [a, b] })),
        { sel: ["Total transaksi", hasil.length] },
        { sel: [] },
        { sel: header, style: 1 },
        ...data,
      ],
      lebar,
    );
    unduh(
      new Blob([bytes.buffer as ArrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `laporan-persediaan-${terapan.mulai}_${terapan.akhir}.xlsx`,
    );
    setToast("File Excel berhasil diunduh.");
  };

  const exportPdf = () => {
    if (hasil.length === 0) return;
    const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Laporan Persediaan</title>
<style>
  @page{size:A4 landscape;margin:12mm}
  body{font-family:Arial,Helvetica,sans-serif;color:#172b4d;font-size:11px}
  h1{font-size:18px;margin:0 0 4px}
  .meta{color:#475569;margin:0 0 12px;line-height:1.6}
  .ring{display:flex;gap:12px;margin-bottom:14px}
  .ring div{border:1px solid #cbd5e1;border-radius:6px;padding:8px 14px}
  .ring b{display:block;font-size:16px}
  table{width:100%;border-collapse:collapse}
  th,td{border:1px solid #94a3b8;padding:6px 8px;text-align:left}
  th{background:#f1f5f9;font-size:10px;text-transform:uppercase}
  tr{page-break-inside:avoid}
</style></head><body>
<h1>Laporan Persediaan</h1>
<p class="meta">${infoFilter().map(([a, b]) => `${esc(a)}: ${esc(b)}`).join(" · ")}</p>
<div class="ring">
  <div><b>${totalMasuk + totalKeluar}</b>Total pergerakan</div>
  <div><b>${totalMasuk}</b>Barang masuk</div>
  <div><b>${totalKeluar}</b>Barang keluar</div>
  <div><b>${hasil.length}</b>Total transaksi</div>
</div>
<table><thead><tr>${kolomTampil.map((k) => `<th>${esc(k.label)}</th>`).join("")}</tr></thead>
<tbody>${hasil
      .map((x) => `<tr>${kolomTampil.map((k) => `<td>${esc(teksSel(k.key, x))}</td>`).join("")}</tr>`)
      .join("")}</tbody></table>
</body></html>`;
    if (!cetakHtml(html)) setToast("Dokumen tidak bisa dicetak di browser ini.");
  };

  const adaKolomDefault = JSON.stringify(kolom) === JSON.stringify(kolomBawaan());

  return (
    <div className="relative flex size-full items-start bg-[#f3f6fa]">
      <Sidebar active="Laporan" />

      <div className="relative flex min-h-[1100px] min-w-px flex-[1_0_0] flex-col items-start overflow-clip">
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
                Laporan Persediaan
              </p>
              <p className="w-full shrink-0 text-[14px] text-[#64748b]">
                Tinjau, saring, dan ekspor data transaksi persediaan
              </p>
            </div>
            <div className="flex shrink-0 items-start gap-[8px] overflow-clip">
              <button
                type="button"
                onClick={exportExcel}
                disabled={hasil.length === 0}
                className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] text-[#1769e0] hover:bg-[#f3f6fa] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileSpreadsheet size={16} className="shrink-0" />
                <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                  Export Excel
                </span>
              </button>
              <button
                type="button"
                onClick={exportPdf}
                disabled={hasil.length === 0}
                className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-white hover:bg-[#0e4fab] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileText size={16} className="shrink-0" />
                <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                  Export PDF
                </span>
              </button>
            </div>
          </div>

          {/* Report filters */}
          <div className="relative flex w-full shrink-0 flex-col items-start gap-[16px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[18px] font-normal not-italic drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
            <div className="flex w-full shrink-0 items-center justify-between overflow-clip">
              <div className="flex shrink-0 items-center gap-[9px] overflow-clip">
                <FilterIcon size={18} className="shrink-0 text-[#1769e0]" />
                <p className="shrink-0 whitespace-nowrap text-[14px] leading-[normal] text-[#172b4d]">
                  Filter laporan
                </p>
              </div>
              <button
                type="button"
                onClick={aturUlang}
                className="shrink-0 cursor-pointer whitespace-nowrap text-[11px] leading-[normal] text-[#1769e0] hover:underline"
              >
                Atur ulang
              </button>
            </div>
            <div className="flex w-full shrink-0 items-end gap-[12px]">
              <DateField
                label="Tanggal mulai"
                value={draf.mulai}
                onChange={(v) => {
                  setDraf((d) => ({ ...d, mulai: v }));
                  setErrFilter("");
                }}
              />
              <DateField
                label="Tanggal akhir"
                value={draf.akhir}
                onChange={(v) => {
                  setDraf((d) => ({ ...d, akhir: v }));
                  setErrFilter("");
                }}
              />
              <SelectField
                label="Jenis transaksi"
                value={draf.jenis}
                options={opsiJenis}
                onChange={(v) => setDraf((d) => ({ ...d, jenis: v }))}
              />
              <SelectField
                label="Kategori barang"
                value={draf.kategori}
                options={["Semua kategori", ...opsiKategori]}
                onChange={(v) => setDraf((d) => ({ ...d, kategori: v }))}
              />
              <button
                type="button"
                onClick={terapkan}
                className="flex h-[42px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-white hover:bg-[#0e4fab]"
              >
                <Search size={16} className="shrink-0" />
                <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                  Terapkan
                </span>
              </button>
            </div>
            {errFilter && (
              <p role="alert" className="text-[12px] leading-[normal] text-[#c2413a]">
                {errFilter}
              </p>
            )}
            {!errFilter && belumDiterapkan && (
              <p className="text-[11px] leading-[normal] text-[#b45309]">
                Filter diubah. Klik Terapkan untuk memperbarui laporan.
              </p>
            )}
          </div>

          {/* Report summary */}
          <div className="flex w-full shrink-0 items-start gap-[12px] overflow-clip">
            {ringkasan.map((r) => (
              <SummaryCard key={r.label} r={r} />
            ))}
          </div>

          {/* Report insights */}
          <div className="flex w-full shrink-0 items-start gap-[16px]">
            {/* Pergerakan harian */}
            <div className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[16px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[18px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
              <div className="flex w-full shrink-0 items-start justify-between overflow-clip">
                <div className="flex shrink-0 flex-col items-start gap-[3px] overflow-clip whitespace-nowrap font-normal not-italic leading-[normal]">
                  <p className="shrink-0 text-[14px] text-[#172b4d]">
                    Pergerakan harian
                  </p>
                  <p className="shrink-0 text-[10px] text-[#64748b]">
                    {tgl(terapan.mulai)} – {tgl(terapan.akhir)}
                  </p>
                </div>
                <div className="flex shrink-0 items-start gap-[12px] overflow-clip">
                  <JenisBadge jenis="Masuk" />
                  <JenisBadge jenis="Keluar" />
                </div>
              </div>

              <div className="flex h-[128px] w-full shrink-0 items-end overflow-clip pt-[8px]">
                {harian.map((d, i) => (
                  <div
                    key={d.hari}
                    className="flex min-w-px flex-[1_0_0] flex-col items-center justify-end gap-[7px] overflow-clip"
                  >
                    <div className="flex h-[92px] shrink-0 items-end gap-[3px] overflow-clip">
                      <div
                        className="shrink-0 rounded-t-[4px] bg-[#15803d]"
                        style={{ height: tinggi(d.masuk), width: lebarBatang }}
                        title={`Masuk: ${d.masuk}`}
                      />
                      <div
                        className="shrink-0 rounded-t-[4px] bg-[#7c3aed]"
                        style={{ height: tinggi(d.keluar), width: lebarBatang }}
                        title={`Keluar: ${d.keluar}`}
                      />
                    </div>
                    <p className="h-[11px] shrink-0 whitespace-nowrap text-[9px] font-normal not-italic leading-[normal] text-[#64748b]">
                      {i % langkahLabel === 0 ? tgl(d.hari).slice(0, 6) : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Barang paling aktif */}
            <div className="relative flex w-[360px] shrink-0 flex-col items-start gap-[14px] rounded-[12px] border border-solid border-[#dce4ee] bg-white p-[18px] drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
              <p className="shrink-0 whitespace-nowrap text-[14px] font-normal not-italic leading-[normal] text-[#172b4d]">
                Barang paling aktif
              </p>
              {barangAktif.length === 0 && (
                <p className="text-[11px] leading-[normal] text-[#94a3b8]">
                  Belum ada data pada filter ini.
                </p>
              )}
              {barangAktif.map((b, i) => (
                <div
                  key={b.nama}
                  className="flex w-full shrink-0 items-center gap-[10px] overflow-clip"
                >
                  <div className="flex size-[26px] shrink-0 items-center justify-center overflow-clip rounded-[999px] bg-[#f8fafc]">
                    <p className="shrink-0 whitespace-nowrap text-[10px] font-normal not-italic leading-[normal] text-[#64748b]">
                      {i + 1}
                    </p>
                  </div>
                  <p className="min-w-px flex-[1_0_0] text-[11px] font-semibold not-italic leading-[normal] text-[#172b4d]">
                    {b.nama}
                  </p>
                  <p
                    className="shrink-0 whitespace-nowrap text-[11px] font-normal not-italic leading-[normal]"
                    style={{ color: warnaBarang[i % warnaBarang.length] }}
                  >
                    {b.jumlah} {b.satuan}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Report table (tanpa overflow-clip supaya menu kolom tidak terpotong) */}
          <div className="relative flex w-full shrink-0 flex-col items-start rounded-[12px] border border-solid border-[#dce4ee] bg-white drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">
            <div className="flex w-full shrink-0 items-center justify-between p-[17px] font-normal not-italic">
              <div className="flex shrink-0 flex-col items-start gap-[3px] overflow-clip whitespace-nowrap leading-[normal]">
                <p className="shrink-0 text-[14px] text-[#172b4d]">
                  Detail transaksi
                </p>
                <p className="shrink-0 text-[10px] text-[#64748b]">
                  {hasil.length} transaksi sesuai filter
                </p>
              </div>

              <div ref={menuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setMenuKolom((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menuKolom}
                  className={`flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid px-[15px] text-[#64748b] hover:bg-[#f8fafc] ${
                    menuKolom ? "border-[#dce4ee] bg-[#f8fafc]" : "border-white bg-white"
                  }`}
                >
                  <Columns3 size={16} className="shrink-0" />
                  <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">
                    Atur kolom
                  </span>
                </button>

                {menuKolom && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[44px] z-20 w-[220px] rounded-[10px] border border-solid border-[#dce4ee] bg-white p-[8px] shadow-lg"
                  >
                    {kolomDef.map((k) => {
                  const aktif = kolom[k.key];
                  const terakhir = aktif && kolomTampil.length === 1;
                  return (
                    <label
                      key={k.key}
                      className={`flex items-center gap-[10px] rounded-[6px] px-[10px] py-[8px] text-[13px] ${
                        terakhir ? "cursor-not-allowed text-[#94a3b8]" : "cursor-pointer text-[#172b4d] hover:bg-[#f3f6fa]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={aktif}
                        disabled={terakhir}
                        onChange={() => ubahKolom(k.key)}
                        className="size-[15px] accent-[#1769e0]"
                      />
                      {k.label}
                    </label>
                  );
                })}
                    <button
                      type="button"
                      onClick={() => simpanKolom(kolomBawaan())}
                      disabled={adaKolomDefault}
                      className="mt-[4px] w-full rounded-[6px] px-[10px] py-[8px] text-left text-[12px] text-[#1769e0] hover:bg-[#f3f6fa] disabled:cursor-not-allowed disabled:text-[#94a3b8] disabled:hover:bg-transparent"
                    >
                      Kembalikan bawaan
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex h-[42px] w-full shrink-0 items-center gap-[12px] border-b border-solid border-[#dce4ee] bg-[#f8fafc] px-[16px] text-[11px] font-normal uppercase not-italic leading-[normal] text-[#64748b]">
              {kolomTampil.map((k, i) => (
                <p
                  key={k.key}
                  className={i === kolomTampil.length - 1 ? "min-w-px flex-[1_0_0]" : `${k.lebar} shrink-0`}
                >
                  {k.label}
                </p>
              ))}
            </div>

            {tampil.length === 0 && (
              <div className="flex w-full flex-col items-center gap-[6px] px-[16px] py-[40px] text-center font-normal not-italic">
                <p className="text-[14px] text-[#172b4d]">Tidak ada transaksi</p>
                <p className="text-[12px] text-[#64748b]">
                  Coba ubah rentang tanggal atau filter lainnya.
                </p>
              </div>
            )}

            {tampil.map((x) => (
              <div
                key={x.nomor}
                className="flex min-h-[55px] w-full shrink-0 items-center gap-[12px] overflow-clip border-b border-solid border-[#dce4ee] px-[16px]"
              >
                {kolomTampil.map((k, i) =>
                  renderSel(
                    k.key,
                    x,
                    i === kolomTampil.length - 1 ? "min-w-px flex-[1_0_0]" : `${k.lebar} shrink-0`,
                  ),
                )}
              </div>
            ))}

            {/* Pagination */}
            <div className="flex w-full shrink-0 items-center justify-between overflow-clip p-[16px]">
              <p className="shrink-0 whitespace-nowrap text-[10px] font-normal not-italic leading-[normal] text-[#64748b]">
                {hasil.length === 0
                  ? "Menampilkan 0 transaksi"
                  : `Menampilkan ${mulai + 1}–${mulai + tampil.length} dari ${hasil.length} transaksi`}
              </p>
              <div className="flex shrink-0 items-start gap-[6px] overflow-clip">
                <button
                  type="button"
                  aria-label="Halaman sebelumnya"
                  onClick={() => setHalaman(halamanAktif - 1)}
                  disabled={halamanAktif <= 1}
                  className="flex size-[30px] shrink-0 items-center justify-center rounded-[6px] border border-solid border-[#dce4ee] text-[#64748b] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                {daftarHalaman(halamanAktif, totalHalaman).map((n, i) =>
                  n === "…" ? (
                    <span
                      key={`titik-${i}`}
                      className="flex size-[30px] shrink-0 items-center justify-center text-[11px] text-[#64748b]"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setHalaman(n)}
                      aria-current={n === halamanAktif ? "page" : undefined}
                      className={`flex size-[30px] shrink-0 items-center justify-center rounded-[6px] text-[11px] ${
                        n === halamanAktif
                          ? "bg-[#1769e0] font-bold text-white"
                          : "border border-solid border-[#dce4ee] font-normal text-[#172b4d]"
                      }`}
                    >
                      {n}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  aria-label="Halaman berikutnya"
                  onClick={() => setHalaman(halamanAktif + 1)}
                  disabled={halamanAktif >= totalHalaman}
                  className="flex size-[30px] shrink-0 items-center justify-center rounded-[6px] border border-solid border-[#dce4ee] text-[#64748b] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
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