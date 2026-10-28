import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ClipboardList,
  ClipboardCheck,
  TriangleAlert,
  Gauge,
  Save,
  CheckCheck,
  Printer,
  CircleCheck,
  History,
  ChevronDown,
  Plus,
  Search,
  Loader,
  X,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "../auth";

import Sidebar from "../Components/Sidebar";
import { apiRequest } from "../api";



/* ------------------------------ Data ------------------------------ */

interface ApiBarang {
  id: number;
  kode_barang: string;
  nama_barang: string;
  stok: number;
  kategori_barang?: {
    nama?: string;
    nama_kategori?: string;
    nama_barang?: string;
  } | null;
  kategori?: { nama?: string; nama_kategori?: string } | string | null;
}

interface Katalog {
  id: number;
  nama: string;
  kode: string;
  kategori: string;
  gudang: string;
  sistem: number;
}

const daftarGudang = ["Gudang Utama"];

interface Baris {
  barangId: number;
  nama: string;
  kode: string;
  kategori: string;
  sistem: number;
  fisik: string; // "" = belum dihitung
  catatan: string;
}

interface Aktif {
  nomor: string;
  nama: string;
  gudang: string;
  dibuka: string; // ISO
  baris: Baris[];
  lastSaved?: string;
}

interface Periode {
  nomor: string;
  periode: string;
  tanggal: string;
  diperiksa: string;
  selisih: number;
  petugas: string;
}

interface ApiStokOpname {
  id: number;
  nomor: string;
  nama: string;
  gudang?: string;
  user_id?: number | null;
  dimulai_pada?: string | null;
  selesai_pada?: string | null;
  total_barang?: number;
  jumlah_selisih?: number;
  details?: unknown[];
  user?: { nama?: string; name?: string } | null;
  petugas?: string | null;
}

function petakanRiwayat(data: ApiStokOpname[]): Periode[] {
  return data.map((item) => {
    const mulai = item.dimulai_pada ? new Date(item.dimulai_pada) : null;
    const selesai = item.selesai_pada ? new Date(item.selesai_pada) : null;
    const tanggal =
      mulai && selesai && !Number.isNaN(mulai.getTime()) && !Number.isNaN(selesai.getTime())
        ? rentang(mulai, selesai)
        : selesai && !Number.isNaN(selesai.getTime())
          ? tglPendek(selesai)
          : "-";

    return {
      nomor: item.nomor,
      periode: item.nama?.replace(/^Opname\s+/i, "") || item.nama || "-",
      tanggal,
      diperiksa: `${Number(item.total_barang ?? item.details?.length ?? 0)} jenis`,
      selisih: Number(item.jumlah_selisih ?? 0),
      petugas: item.user?.nama ?? item.user?.name ?? item.petugas ?? "-",
    };
  });
}

function buatBaris(gudang: string, sumber: Katalog[]): Baris[] {
  return sumber
    .filter((barang) => barang.gudang === gudang)
    .map((barang) => ({
      barangId: barang.id,
      nama: barang.nama,
      kode: barang.kode,
      kategori: barang.kategori,
      sistem: barang.sistem,
      fisik: "",
      catatan: "",
    }));
}

const DRAF_KEY = "simpera-opname-aktif";

function bacaDraf(): Aktif | null {
  try {
    const raw = localStorage.getItem(DRAF_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Aktif;
    if (!Array.isArray(parsed.baris) || !parsed.baris.every((b) => Number.isInteger(b.barangId))) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

const opsiHasil = ["Belum dihitung", "Sesuai", "Selisih"];

/* ------------------------------ Util ------------------------------ */



const TZ = "Asia/Makassar";

const tglPanjang = (d: Date) =>

  d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: TZ });

const tglPendek = (d: Date) =>

  d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: TZ });

const jam = (d: Date) =>

  d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: TZ }) + " WITA";



function rentang(a: Date, b: Date) {

  const sama =

    a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  if (sama) {

    const dd = (x: Date) => String(x.getDate()).padStart(2, "0");

    return `${dd(a)}–${dd(b)} ${tglPendek(b).slice(3)}`;

  }

  return `${tglPendek(a)} – ${tglPendek(b)}`;

}



type Hasil = "belum" | "sesuai" | "selisih";

const hasilDari = (b: Baris): Hasil =>

  b.fisik === "" ? "belum" : Number(b.fisik) === b.sistem ? "sesuai" : "selisih";

const labelHasil: Record<Hasil, string> = {

  belum: "Belum dihitung",

  sesuai: "Sesuai",

  selisih: "Selisih",

};



const esc = (v: string) =>

  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");



/* Cetak lewat iframe tersembunyi: tidak diblokir pop-up dan tidak ikut mencetak halaman */

function cetakLembar(a: Aktif) {

  const dibuka = new Date(a.dibuka);

  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Lembar ${esc(a.nomor)}</title>

<style>

  body{font-family:Arial,Helvetica,sans-serif;color:#172b4d;margin:24px;font-size:12px}

  h1{font-size:18px;margin:0 0 4px}

  .meta{color:#475569;margin:0 0 16px;line-height:1.6}

  table{width:100%;border-collapse:collapse}

  th,td{border:1px solid #94a3b8;padding:8px;text-align:left;vertical-align:middle}

  th{background:#f1f5f9;font-size:11px;text-transform:uppercase}

  td.k{height:30px}

  .ttd{display:flex;justify-content:space-between;margin-top:48px}

  .ttd div{width:40%;text-align:center}

  .ttd .garis{margin-top:64px;border-top:1px solid #172b4d;padding-top:4px}

  @media print{body{margin:12mm}}

</style></head><body>

<h1>Lembar Perhitungan Fisik</h1>

<p class="meta">${esc(a.nama)} · ${esc(a.nomor)}<br>${esc(a.gudang)} · Dibuka ${esc(tglPanjang(dibuka))}</p>

<table>

<thead><tr><th>No</th><th>Kode</th><th>Nama barang</th><th>Kategori</th><th>Stok sistem</th><th>Hasil fisik</th><th>Selisih</th><th>Keterangan</th></tr></thead>

<tbody>

${a.baris

  .map(

    (b, i) =>

      `<tr><td>${i + 1}</td><td>${esc(b.kode)}</td><td>${esc(b.nama)}</td><td>${esc(b.kategori)}</td><td>${b.sistem}</td><td class="k"></td><td></td><td></td></tr>`,

  )

  .join("\n")}

</tbody></table>

<div class="ttd"><div>Petugas<div class="garis">(                              )</div></div><div>Mengetahui<div class="garis">(                              )</div></div></div>

</body></html>`;



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



/* --------------------------- Komponen kecil --------------------------- */



function StatusBadge({ label, tone }: { label: string; tone: "ok" | "warn" | "none" }) {

  const gaya = {

    ok: { bg: "bg-[#eaf8ef]", teks: "text-[#15803d]", icon: <CircleCheck size={12} /> },

    warn: { bg: "bg-[#fff7e6]", teks: "text-[#b45309]", icon: <TriangleAlert size={12} /> },

    none: { bg: "bg-[#f1f5f9]", teks: "text-[#64748b]", icon: <Loader size={12} /> },

  }[tone];

  return (

    <div

      className={`flex shrink-0 items-center gap-[5px] overflow-clip rounded-[999px] px-[9px] py-[5px] ${gaya.bg}`}

    >

      <div className={`flex size-[12px] shrink-0 items-center justify-center ${gaya.teks}`}>

        {gaya.icon}

      </div>

      <p

        className={`shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal] ${gaya.teks}`}

      >

        {label}

      </p>

    </div>

  );

}



interface Ringkasan {

  nilai: string;

  label: string;

  icon: LucideIcon;

  bg: string;

  color: string;

}



function SummaryCard({ r }: { r: Ringkasan }) {

  const Icon = r.icon;

  return (

    <div className="relative flex min-w-px flex-[1_0_0] items-center gap-[11px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white p-[15px]">

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

        <p className="shrink-0 text-[19px] text-[#172b4d]">{r.nilai}</p>

        <p className="shrink-0 text-[10px] text-[#64748b]">{r.label}</p>

      </div>

    </div>

  );

}



function OutlineButton({

  icon: Icon,

  label,

  onClick,

  disabled,

}: {

  icon: LucideIcon;

  label: string;

  onClick?: () => void;

  disabled?: boolean;

}) {

  return (

    <button

      type="button"

      onClick={onClick}

      disabled={disabled}

      className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] text-[#1769e0] hover:bg-[#f3f6fa] disabled:cursor-not-allowed disabled:opacity-50"

    >

      <Icon size={16} className="shrink-0" />

      <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">

        {label}

      </span>

    </button>

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

    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    window.addEventListener("keydown", h);

    return () => window.removeEventListener("keydown", h);

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

        className="max-h-[85vh] w-full max-w-[460px] overflow-auto rounded-[12px] bg-white p-[24px] shadow-xl"

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



/* Dropdown filter. value "" = semua */

function FilterSelect({

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

  const [buka, setBuka] = useState(false);

  const ref = useRef<HTMLDivElement>(null);



  useEffect(() => {

    if (!buka) return;

    const klikLuar = (e: MouseEvent) => {

      if (ref.current && !ref.current.contains(e.target as Node)) setBuka(false);

    };

    const esc = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);

    document.addEventListener("mousedown", klikLuar);

    document.addEventListener("keydown", esc);

    return () => {

      document.removeEventListener("mousedown", klikLuar);

      document.removeEventListener("keydown", esc);

    };

  }, [buka]);



  const aktif = value !== "";

  const semua = [label, ...options];



  return (

    <div ref={ref} className="relative shrink-0">

      <button

        type="button"

        onClick={() => setBuka((v) => !v)}

        aria-haspopup="listbox"

        aria-expanded={buka}

        className={`flex h-[40px] shrink-0 cursor-pointer items-center gap-[10px] overflow-clip rounded-[8px] border border-solid px-[12px] font-normal not-italic ${

          aktif ? "border-[#1769e0] bg-[#eaf2ff]" : "border-[#dce4ee] bg-white"

        }`}

      >

        <span

          className={`shrink-0 whitespace-nowrap text-[14px] leading-[normal] ${

            aktif ? "text-[#1769e0]" : "text-[#172b4d]"

          }`}

        >

          {aktif ? value : label}

        </span>

        <ChevronDown size={14} className="shrink-0 text-[#64748b]" />

      </button>



      {buka && (

        <div

          role="listbox"

          className="absolute left-0 top-[44px] z-20 w-max min-w-full rounded-[10px] border border-solid border-[#dce4ee] bg-white p-[6px] shadow-lg"

        >

          {semua.map((opsi, i) => {

            const terpilih = i === 0 ? !aktif : value === opsi;

            return (

              <button

                key={opsi}

                type="button"

                role="option"

                aria-selected={terpilih}

                onClick={() => {

                  onChange(i === 0 ? "" : opsi);

                  setBuka(false);

                }}

                className={`flex w-full items-center rounded-[6px] px-[10px] py-[8px] text-left text-[13px] hover:bg-[#f3f6fa] ${

                  terpilih ? "bg-[#eaf2ff] text-[#1769e0]" : "text-[#172b4d]"

                }`}

              >

                {opsi}

              </button>

            );

          })}

        </div>

      )}

    </div>

  );

}



/* ------------------------------ Halaman ------------------------------ */



export default function StokOpnameScreen() {

  const { user } = useAuth();



  const [aktif, setAktif] = useState<Aktif | null>(() => bacaDraf());
  const [riwayat, setRiwayat] = useState<Periode[]>([]);
  const [katalog, setKatalog] = useState<Katalog[]>([]);
  const [memuatBarang, setMemuatBarang] = useState(true);

  const [semuaPeriode, setSemuaPeriode] = useState(false);



  const [cari, setCari] = useState("");

  const [kategori, setKategori] = useState("");

  const [hasil, setHasil] = useState("");



  const [modalMulai, setModalMulai] = useState(false);

  const [namaBaru, setNamaBaru] = useState("");

  const [gudangBaru, setGudangBaru] = useState(daftarGudang[0]);

  const [errNama, setErrNama] = useState("");

  const [konfirmSelesai, setKonfirmSelesai] = useState(false);

  const [errSelesai, setErrSelesai] = useState("");

  const [toast, setToast] = useState("");



  useEffect(() => {

    if (!toast) return;

    const t = setTimeout(() => setToast(""), 3000);

    return () => clearTimeout(t);

  }, [toast]);

  useEffect(() => {
    let aktif = true;

    async function muatBarang() {
      setMemuatBarang(true);
      try {
        const response = await apiRequest<{ data: ApiBarang[] }>("/barang");
        const daftar = (response.data ?? []).map((barang) => {
          const kategoriBarang = barang.kategori_barang ?? barang.kategori;
          const namaKategori = typeof kategoriBarang === "string"
            ? kategoriBarang
            : kategoriBarang?.nama ?? kategoriBarang?.nama_kategori ?? "Tanpa kategori";

          return {
            id: barang.id,
            nama: barang.nama_barang,
            kode: barang.kode_barang,
            kategori: namaKategori,
            // Backend saat ini belum menyimpan gudang pada tabel barang.
            gudang: "Gudang Utama",
            sistem: Number(barang.stok ?? 0),
          } satisfies Katalog;
        });

        if (!aktif) return;
        setKatalog(daftar);
        if (daftar.length === 0) {
          setToast("Belum ada data barang di database. Tambahkan barang terlebih dahulu.");
        }
      } catch (error) {
        if (aktif) {
          setToast(error instanceof Error ? error.message : "Data barang gagal dimuat dari server.");
        }
      } finally {
        if (aktif) setMemuatBarang(false);
      }
    }

    void muatBarang();
    return () => { aktif = false; };
  }, []);

  // Muat riwayat opname dari database setiap halaman dibuka.
  useEffect(() => {
    let masihAktif = true;

    async function muatRiwayat() {
      try {
        const response = await apiRequest<{ data: ApiStokOpname[] }>("/stok-opname/riwayat");
        if (masihAktif) {
          setRiwayat(petakanRiwayat(response.data ?? []));
        }
      } catch (error) {
        if (masihAktif) {
          setToast(
            error instanceof Error
              ? `Riwayat opname gagal dimuat: ${error.message}`
              : "Riwayat opname gagal dimuat dari server.",
          );
        }
      }
    }

    void muatRiwayat();
    return () => { masihAktif = false; };
  }, []);



  const baris = aktif?.baris ?? [];

  const opsiKategori = useMemo(

    () => Array.from(new Set(baris.map((b) => b.kategori))).sort(),

    [baris],

  );



  const tampil = useMemo(() => {

    const q = cari.trim().toLowerCase();

    return baris.filter(

      (b) =>

        (q === "" || b.nama.toLowerCase().includes(q) || b.kode.toLowerCase().includes(q)) &&

        (kategori === "" || b.kategori === kategori) &&

        (hasil === "" || labelHasil[hasilDari(b)] === hasil),

    );

  }, [baris, cari, kategori, hasil]);



  const dihitung = baris.filter((b) => b.fisik !== "").length;

  const adaSelisih = baris.filter((b) => hasilDari(b) === "selisih").length;

  const sesuai = baris.filter((b) => hasilDari(b) === "sesuai").length;

  const progres = baris.length ? Math.round((dihitung / baris.length) * 100) : 0;



  const ringkasan: Ringkasan[] = [

    { nilai: `${dihitung}/${baris.length}`, label: "Jenis diperiksa", icon: ClipboardList, bg: "#eaf2ff", color: "#1769e0" },

    { nilai: String(sesuai), label: "Stok sesuai", icon: ClipboardCheck, bg: "#eaf8ef", color: "#15803d" },

    { nilai: String(adaSelisih), label: "Ada selisih", icon: TriangleAlert, bg: "#fff7e6", color: "#b45309" },

    { nilai: `${progres}%`, label: "Progres", icon: Gauge, bg: "#f2ecff", color: "#7c3aed" },

  ];



  const adaFilter = cari.trim() !== "" || kategori !== "" || hasil !== "";

  const resetFilter = () => {

    setCari("");

    setKategori("");

    setHasil("");

  };



  const ubahBaris = (kode: string, patch: Partial<Baris>) => {

    setErrSelesai("");

    setAktif((a) =>

      a ? { ...a, baris: a.baris.map((b) => (b.kode === kode ? { ...b, ...patch } : b)) } : a,

    );

  };



  /* ---- Mulai periode baru ---- */

  const bukaMulai = () => {

    if (aktif) {

      setToast("Selesaikan opname yang sedang berjalan sebelum memulai periode baru.");

      return;

    }

    const sekarang = new Date();

    const bulan = sekarang.toLocaleDateString("id-ID", { month: "long", year: "numeric", timeZone: TZ });

    setNamaBaru(`Opname ${bulan}`);

    setGudangBaru(daftarGudang[0]);

    setErrNama("");

    setModalMulai(true);

  };



  const nomorBerikut = () => {

    const angka = [

      ...riwayat.map((r) => r.nomor),

      ...(aktif ? [aktif.nomor] : []),

    ].map((n) => parseInt(n.split("-").pop() ?? "0", 10));

    return `SO-${new Date().getFullYear()}-${String(Math.max(0, ...angka) + 1).padStart(4, "0")}`;

  };



  const mulaiPeriode = () => {

    if (memuatBarang) {
      setErrNama("Data barang masih dimuat. Coba lagi sebentar.");
      return;
    }
    if (katalog.length === 0) {
      setErrNama("Belum ada barang di database untuk diperiksa.");
      return;
    }
    if (!namaBaru.trim()) {

      setErrNama("Nama periode wajib diisi.");

      return;

    }

    const baru: Aktif = {

      nomor: nomorBerikut(),

      nama: namaBaru.trim(),

      gudang: gudangBaru,

      dibuka: new Date().toISOString(),

      baris: buatBaris(gudangBaru, katalog),

    };

    setAktif(baru);

    resetFilter();

    setErrSelesai("");

    setModalMulai(false);

    setToast(`Periode ${baru.nomor} dimulai.`);

  };



  /* ---- Simpan draf ---- */

  const simpanDraf = () => {

    if (!aktif) return;

    const disimpan: Aktif = { ...aktif, lastSaved: jam(new Date()) };

    try {

      localStorage.setItem(DRAF_KEY, JSON.stringify(disimpan));

      setAktif(disimpan);

      setToast(`Draf opname tersimpan pukul ${disimpan.lastSaved}.`);

    } catch {

      setToast("Draf gagal disimpan.");

    }

  };



  /* ---- Selesaikan opname ---- */

  const cekSelesai = () => {

    if (!aktif) return;

    const belum = baris.filter((b) => b.fisik === "");

    if (belum.length > 0) {

      setErrSelesai(`Masih ada ${belum.length} barang yang belum dihitung.`);

      return;

    }

    const tanpaCatatan = baris.filter((b) => hasilDari(b) === "selisih" && b.catatan.trim() === "");

    if (tanpaCatatan.length > 0) {

      const nama = tanpaCatatan.slice(0, 3).map((b) => b.nama).join(", ");

      const lebih = tanpaCatatan.length > 3 ? ` dan ${tanpaCatatan.length - 3} lainnya` : "";

      setErrSelesai(`Isi keterangan untuk barang yang selisih: ${nama}${lebih}.`);

      return;

    }

    setErrSelesai("");

    setKonfirmSelesai(true);

  };



  const selesaikan = async () => {
    if (!aktif) return;

    try {
      const response = await apiRequest<{ message?: string }>("/stok-opname/selesaikan", {
        method: "POST",
        body: JSON.stringify({
          nomor: aktif.nomor,
          nama: aktif.nama,
          gudang: aktif.gudang,
          catatan: baris.map((b) => ({
            barang_id: b.barangId,
            stok_sistem: b.sistem,
            stok_fisik: Number(b.fisik),
            keterangan: b.catatan.trim() || null,
          })),
        }),
      });

      const p: Periode = {
        nomor: aktif.nomor,
        periode: aktif.nama.replace(/^Opname\s+/i, ""),
        tanggal: rentang(new Date(aktif.dibuka), new Date()),
        diperiksa: `${baris.length} jenis`,
        selisih: adaSelisih,
        petugas: user?.nama ?? "-",
      };
      // Ambil ulang riwayat dari database setelah opname berhasil disimpan.
      const responseRiwayat = await apiRequest<{ data: ApiStokOpname[] }>("/stok-opname/riwayat");
      setRiwayat(petakanRiwayat(responseRiwayat.data ?? []));
      try {
        localStorage.removeItem(DRAF_KEY);
      } catch {
        // Abaikan jika penyimpanan lokal tidak tersedia.
      }
      setAktif(null);
      setKonfirmSelesai(false);
      resetFilter();
      setSemuaPeriode(false);
      setToast(response.message ?? `Opname ${p.nomor} berhasil diselesaikan.`);
    } catch (error) {
      setKonfirmSelesai(false);
      setErrSelesai(error instanceof Error ? error.message : "Stok opname gagal diselesaikan.");
      setToast(error instanceof Error ? error.message : "Stok opname gagal diselesaikan.");
    }
  };



  /* ---- Cetak ---- */

  const cetak = () => {

    if (!aktif) return;

    if (!cetakLembar(aktif)) setToast("Lembar tidak bisa dicetak di browser ini.");

  };



  const tampilRiwayat = semuaPeriode ? riwayat : riwayat.slice(0, 2);

  const dibuka = aktif ? new Date(aktif.dibuka) : null;



  return (

    <div className="relative flex size-full items-start bg-[#f3f6fa]">

      <Sidebar active="Stok Opname" />



      <div className="relative flex min-h-[1200px] min-w-px flex-[1_0_0] flex-col items-start overflow-clip">

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

                Stok Opname

              </p>

              <p className="w-full shrink-0 text-[14px] text-[#64748b]">

                Cocokkan stok sistem dengan hasil perhitungan fisik gudang
                {memuatBarang ? " · Memuat data barang..." : ` · ${katalog.length} barang dari database`}

              </p>

            </div>

            <button

              type="button"

              onClick={bukaMulai}

              className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-white hover:bg-[#0e4fab]"

            >

              <Plus size={16} className="shrink-0" />

              <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">

                Mulai periode baru

              </span>

            </button>

          </div>



          {aktif && dibuka ? (

            <>

              {/* Active period */}

              <div className="flex w-full shrink-0 flex-col items-start gap-[12px] overflow-clip rounded-[12px] border border-solid border-[#c6dbff] bg-[#eaf2ff] p-[18px]">

                <div className="flex w-full shrink-0 items-center justify-between overflow-clip">

                  <div className="flex shrink-0 items-center gap-[13px] overflow-clip">

                    <div className="flex size-[40px] shrink-0 items-center justify-center overflow-clip rounded-[8px] bg-[#1769e0]">

                      <ClipboardCheck size={20} className="shrink-0 text-white" />

                    </div>

                    <div className="flex shrink-0 flex-col items-start gap-[4px] overflow-clip">

                      <div className="flex shrink-0 items-center gap-[8px] overflow-clip">

                        <p className="shrink-0 whitespace-nowrap text-[15px] font-normal not-italic leading-[normal] text-[#0e4fab]">

                          {aktif.nama}

                        </p>

                        <div className="flex shrink-0 items-center gap-[5px] overflow-clip rounded-[999px] bg-[#eaf2ff] px-[9px] py-[5px]">

                          <div className="flex size-[12px] shrink-0 items-center justify-center text-[#1769e0]">

                            <Loader size={12} />

                          </div>

                          <p className="shrink-0 whitespace-nowrap text-[12px] font-normal not-italic leading-[normal] text-[#1769e0]">

                            Sedang berjalan

                          </p>

                        </div>

                      </div>

                      <p className="shrink-0 whitespace-nowrap text-[11px] font-normal not-italic leading-[normal] text-[#64748b]">

                        {aktif.nomor} · Dibuka {tglPanjang(dibuka)}, {jam(dibuka)} · {aktif.gudang}

                      </p>

                    </div>

                  </div>

                  <div className="flex shrink-0 items-start gap-[8px] overflow-clip">

                    <OutlineButton icon={Save} label="Simpan draf" onClick={simpanDraf} />

                    <button

                      type="button"

                      onClick={cekSelesai}

                      className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-white hover:bg-[#0e4fab]"

                    >

                      <CheckCheck size={16} className="shrink-0" />

                      <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">

                        Selesaikan opname

                      </span>

                    </button>

                  </div>

                </div>



                {errSelesai && (

                  <p

                    role="alert"

                    className="w-full rounded-[8px] bg-[#fef0ef] px-[12px] py-[9px] text-[12px] font-normal not-italic leading-[1.4] text-[#c2413a]"

                  >

                    {errSelesai}

                  </p>

                )}

              </div>



              {/* Opname summary */}

              <div className="flex w-full shrink-0 items-start gap-[12px] overflow-clip">

                {ringkasan.map((r) => (

                  <SummaryCard key={r.label} r={r} />

                ))}

              </div>



              {/* Toolbar (tanpa overflow-clip supaya dropdown tidak terpotong) */}

              <div className="flex w-full shrink-0 items-end gap-[10px]">

                <div className="flex h-[40px] w-[320px] shrink-0 items-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[12px] font-normal not-italic text-[#94a3b8] focus-within:border-[#1769e0]">

                  <Search size={16} className="shrink-0" />

                  <input

                    type="text"

                    value={cari}

                    onChange={(e) => setCari(e.target.value)}

                    onKeyDown={(e) => e.key === "Escape" && setCari("")}

                    placeholder="Cari barang dalam opname..."

                    aria-label="Cari barang dalam opname"

                    className="min-w-px flex-[1_0_0] bg-transparent text-[14px] leading-[normal] text-[#172b4d] outline-none placeholder:text-[#94a3b8]"

                  />

                  {cari && (

                    <button

                      type="button"

                      aria-label="Hapus pencarian"

                      onClick={() => setCari("")}

                      className="flex shrink-0 items-center justify-center text-[#64748b]"

                    >

                      <X size={14} />

                    </button>

                  )}

                </div>



                <FilterSelect

                  label="Semua kategori"

                  value={kategori}

                  options={opsiKategori}

                  onChange={setKategori}

                />

                <FilterSelect

                  label="Semua hasil"

                  value={hasil}

                  options={opsiHasil}

                  onChange={setHasil}

                />



                {adaFilter && (

                  <button

                    type="button"

                    onClick={resetFilter}

                    className="h-[40px] shrink-0 whitespace-nowrap px-[6px] text-[13px] text-[#1769e0] hover:underline"

                  >

                    Reset filter

                  </button>

                )}



                <div className="h-px min-w-px flex-[1_0_0]" />



                <OutlineButton icon={Printer} label="Cetak lembar" onClick={cetak} />

              </div>



              {/* Physical count table */}

              <div className="relative flex w-full shrink-0 flex-col items-start rounded-[12px] border border-solid border-[#dce4ee] bg-white drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">

                <div className="flex h-[42px] w-full shrink-0 items-center gap-[12px] border-b border-solid border-[#dce4ee] bg-[#f8fafc] px-[16px] text-[11px] font-normal uppercase not-italic leading-[normal] text-[#64748b]">

                  <p className="w-[250px] shrink-0">Barang</p>

                  <p className="w-[90px] shrink-0">Stok sistem</p>

                  <p className="w-[100px] shrink-0">Hasil fisik</p>

                  <p className="w-[100px] shrink-0">Selisih otomatis</p>

                  <p className="w-[110px] shrink-0">Hasil</p>

                  <p className="min-w-px flex-[1_0_0]">Keterangan</p>

                </div>



                {tampil.length === 0 && (

                  <div className="flex w-full flex-col items-center gap-[8px] px-[16px] py-[40px] text-center font-normal not-italic">

                    <p className="text-[14px] text-[#172b4d]">Tidak ada barang yang cocok</p>

                    <p className="text-[12px] text-[#64748b]">

                      Coba kata kunci lain atau ubah filter yang dipilih.

                    </p>

                    <button

                      type="button"

                      onClick={resetFilter}

                      className="mt-[4px] h-[36px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[14px] text-[13px] text-[#1769e0] hover:bg-[#f3f6fa]"

                    >

                      Reset filter

                    </button>

                  </div>

                )}



                {tampil.map((h) => {

                  const st = hasilDari(h);

                  const selisih = h.fisik === "" ? null : Number(h.fisik) - h.sistem;

                  return (

                    <div

                      key={h.kode}

                      className={`flex min-h-[68px] w-full shrink-0 items-center gap-[12px] overflow-clip border-b border-solid border-[#dce4ee] px-[16px] py-[10px] ${

                        st === "selisih" ? "bg-[#fffcf5]" : "bg-white"

                      }`}

                    >

                      {/* span (bukan p) supaya klik pada kode tidak memicu navigasi global */}

                      <div className="flex w-[250px] shrink-0 flex-col items-start gap-[3px] overflow-clip font-normal not-italic leading-[normal]">

                        <span className="w-full text-[12px] text-[#172b4d]">{h.nama}</span>

                        <span className="shrink-0 whitespace-nowrap text-[10px] text-[#1769e0]">

                          {h.kode}

                        </span>

                      </div>

                      <span className="w-[90px] shrink-0 text-[13px] font-bold not-italic leading-[normal] text-[#172b4d]">

                        {h.sistem}

                      </span>

                      <input

                        value={h.fisik}

                        inputMode="numeric"

                        placeholder="–"

                        aria-label={`Hasil fisik ${h.nama}`}

                        onChange={(e) => ubahBaris(h.kode, { fisik: e.target.value.replace(/\D/g, "").slice(0, 6) })}

                        className={`h-[38px] w-[100px] shrink-0 rounded-[6px] border border-solid bg-white px-[11px] text-[13px] font-bold not-italic leading-[normal] text-[#172b4d] outline-none placeholder:font-normal placeholder:text-[#94a3b8] focus:border-[#1769e0] ${

                          st === "selisih" ? "border-[#b45309]" : "border-[#dce4ee]"

                        }`}

                      />

                      <div className="flex w-[100px] shrink-0 items-start overflow-clip">

                        <span

                          className={`shrink-0 whitespace-nowrap text-[13px] font-normal not-italic leading-[normal] ${

                            selisih === null

                              ? "text-[#94a3b8]"

                              : selisih === 0

                                ? "text-[#15803d]"

                                : "text-[#b45309]"

                          }`}

                        >

                          {selisih === null

                            ? "–"

                            : selisih > 0

                              ? `+${selisih}`

                              : selisih < 0

                                ? `−${Math.abs(selisih)}`

                                : "0"}

                        </span>

                      </div>

                      <div className="flex w-[110px] shrink-0 items-start overflow-clip">

                        <StatusBadge

                          label={labelHasil[st]}

                          tone={st === "sesuai" ? "ok" : st === "selisih" ? "warn" : "none"}

                        />

                      </div>

                      <input

                        value={h.catatan}

                        placeholder="Catatan (opsional)"

                        aria-label={`Keterangan ${h.nama}`}

                        onChange={(e) => ubahBaris(h.kode, { catatan: e.target.value })}

                        className="h-[38px] min-w-px flex-[1_0_0] rounded-[6px] border border-solid border-[#dce4ee] bg-white px-[11px] text-[11px] font-normal not-italic leading-[normal] text-[#172b4d] outline-none placeholder:text-[#94a3b8] focus:border-[#1769e0]"

                      />

                    </div>

                  );

                })}



                <div className="flex w-full shrink-0 items-center justify-between overflow-clip p-[16px]">

                  <p className="shrink-0 whitespace-nowrap text-[10px] font-normal not-italic leading-[normal] text-[#64748b]">

                    {tampil.length} dari {baris.length} jenis barang ditampilkan ·{" "}

                    {aktif.lastSaved

                      ? `draf terakhir disimpan ${aktif.lastSaved}`

                      : "draf belum disimpan"}

                  </p>

                  <div className="flex shrink-0 items-start gap-[14px] overflow-clip">

                    <StatusBadge label="Sesuai" tone="ok" />

                    <StatusBadge label="Ada selisih" tone="warn" />

                  </div>

                </div>

              </div>

            </>

          ) : (

            <div className="flex w-full shrink-0 flex-col items-center gap-[10px] rounded-[12px] border border-dashed border-[#c6dbff] bg-white px-[24px] py-[48px] text-center font-normal not-italic">

              <div className="flex size-[44px] items-center justify-center rounded-[10px] bg-[#eaf2ff] text-[#1769e0]">

                <ClipboardCheck size={22} />

              </div>

              <p className="text-[16px] text-[#172b4d]">Belum ada periode opname yang berjalan</p>

              <p className="max-w-[420px] text-[12px] leading-[1.5] text-[#64748b]">

                Mulai periode baru untuk mencatat hasil perhitungan fisik dan mencocokkannya

                dengan stok sistem.

              </p>

              <button

                type="button"

                onClick={bukaMulai}

                className="mt-[6px] flex h-[40px] items-center gap-[8px] rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-[14px] text-white hover:bg-[#0e4fab]"

              >

                <Plus size={16} />

                Mulai periode baru

              </button>

            </div>

          )}



          {/* Period history */}

          <div className="relative flex w-full shrink-0 flex-col items-start rounded-[12px] border border-solid border-[#dce4ee] bg-white drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)]">

            <div className="flex w-full shrink-0 items-center justify-between overflow-clip p-[18px] font-normal not-italic">

              <div className="flex shrink-0 flex-col items-start gap-[3px] overflow-clip whitespace-nowrap leading-[normal]">

                <p className="shrink-0 text-[15px] text-[#172b4d]">

                  Riwayat periode opname

                </p>

                <p className="shrink-0 text-[10px] text-[#64748b]">

                  Dokumen opname yang telah diselesaikan

                </p>

              </div>

              {riwayat.length > 2 && (

                <button

                  type="button"

                  onClick={() => setSemuaPeriode((v) => !v)}

                  className="flex h-[40px] shrink-0 cursor-pointer items-center justify-center gap-[8px] overflow-clip rounded-[8px] border border-solid border-white bg-white px-[15px] text-[#64748b] hover:bg-[#f8fafc]"

                >

                  <History size={16} className="shrink-0" />

                  <span className="shrink-0 whitespace-nowrap text-[14px] leading-[normal]">

                    {semuaPeriode ? "Lihat lebih sedikit" : "Lihat semua periode"}

                  </span>

                </button>

              )}

            </div>



            <div className="flex h-[42px] w-full shrink-0 items-center gap-[12px] border-b border-solid border-[#dce4ee] bg-[#f8fafc] px-[16px] text-[11px] font-normal uppercase not-italic leading-[normal] text-[#64748b]">

              <p className="w-[115px] shrink-0">Nomor</p>

              <p className="w-[135px] shrink-0">Periode</p>

              <p className="w-[150px] shrink-0">Tanggal</p>

              <p className="w-[90px] shrink-0">Diperiksa</p>

              <p className="w-[80px] shrink-0">Selisih</p>

              <p className="w-[95px] shrink-0">Status</p>

              <p className="min-w-px flex-[1_0_0]">Petugas</p>

            </div>



            {tampilRiwayat.map((p) => (

              <div

                key={p.nomor}

                className="flex min-h-[56px] w-full shrink-0 items-center gap-[12px] overflow-clip border-b border-solid border-[#dce4ee] px-[16px] py-[8px]"

              >

                <p className="w-[115px] shrink-0 text-[10px] font-bold not-italic leading-[normal] text-[#1769e0]">

                  {p.nomor}

                </p>

                <p className="w-[135px] shrink-0 text-[11px] font-normal not-italic leading-[normal] text-[#172b4d]">

                  {p.periode}

                </p>

                <p className="w-[150px] shrink-0 text-[10px] font-normal not-italic leading-[normal] text-[#64748b]">

                  {p.tanggal}

                </p>

                <p className="w-[90px] shrink-0 text-[10px] font-normal not-italic leading-[normal] text-[#172b4d]">

                  {p.diperiksa}

                </p>

                <p

                  className={`w-[80px] shrink-0 text-[10px] font-bold not-italic leading-[normal] ${

                    p.selisih > 0 ? "text-[#b45309]" : "text-[#15803d]"

                  }`}

                >

                  {p.selisih} item

                </p>

                <div className="flex w-[95px] shrink-0 items-start overflow-clip">

                  <StatusBadge label="Selesai" tone="ok" />

                </div>

                <p className="min-w-px flex-[1_0_0] text-[10px] font-normal not-italic leading-[normal] text-[#64748b]">

                  {p.petugas}

                </p>

              </div>

            ))}

          </div>

        </div>

      </div>



      {/* Modal: mulai periode baru */}

      {modalMulai && (

        <Modal title="Mulai periode baru" onClose={() => setModalMulai(false)}>

          <div className="flex flex-col gap-[14px]">

            <div className="flex flex-col gap-[7px]">

              <label htmlFor="nama-periode" className="text-[12px] text-[#172b4d]">

                Nama periode *

              </label>

              <input

                id="nama-periode"

                value={namaBaru}

                onChange={(e) => {

                  setNamaBaru(e.target.value);

                  setErrNama("");

                }}

                onKeyDown={(e) => e.key === "Enter" && mulaiPeriode()}

                className={`h-[42px] w-full rounded-[8px] border border-solid px-[12px] text-[14px] text-[#172b4d] outline-none ${

                  errNama ? "border-[#c2413a]" : "border-[#dce4ee] focus:border-[#1769e0]"

                }`}

              />

              {errNama && <p className="text-[11px] text-[#c2413a]">{errNama}</p>}

            </div>



            <div className="flex flex-col gap-[7px]">

              <label htmlFor="gudang-periode" className="text-[12px] text-[#172b4d]">

                Gudang yang diperiksa

              </label>

              <select

                id="gudang-periode"

                value={gudangBaru}

                onChange={(e) => setGudangBaru(e.target.value)}

                className="h-[42px] w-full rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[10px] text-[14px] text-[#172b4d] outline-none focus:border-[#1769e0]"

              >

                {daftarGudang.map((g) => (

                  <option key={g} value={g}>

                    {g}

                  </option>

                ))}

              </select>

            </div>



            <p className="text-[11px] leading-[1.5] text-[#64748b]">

              Daftar barang diambil dari gudang yang dipilih, dengan stok sistem saat ini

              sebagai pembanding.

            </p>



            <div className="mt-[4px] flex justify-end gap-[8px]">

              <button

                type="button"

                onClick={() => setModalMulai(false)}

                className="h-[40px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] text-[14px] text-[#64748b] hover:bg-[#f3f6fa]"

              >

                Tidak jadi

              </button>

              <button

                type="button"

                onClick={mulaiPeriode}

                className="h-[40px] rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-[14px] text-white hover:bg-[#0e4fab]"

              >

                Mulai periode

              </button>

            </div>

          </div>

        </Modal>

      )}



      {/* Modal: konfirmasi selesaikan */}

      {konfirmSelesai && aktif && (

        <Modal title="Selesaikan opname?" onClose={() => setKonfirmSelesai(false)}>

          <div className="flex flex-col gap-[14px]">

            <div className="flex flex-col gap-[6px] rounded-[8px] bg-[#f8fafc] p-[14px] text-[13px] text-[#172b4d]">

              <p>{aktif.nama} · {aktif.nomor}</p>

              <p className="text-[12px] text-[#64748b]">

                {baris.length} jenis barang diperiksa · {sesuai} sesuai ·{" "}

                <span className={adaSelisih > 0 ? "text-[#b45309]" : "text-[#15803d]"}>

                  {adaSelisih} ada selisih

                </span>

              </p>

            </div>

            <p className="text-[12px] leading-[1.5] text-[#64748b]">

              Setelah diselesaikan, periode ini masuk ke riwayat dan hasil perhitungannya

              tidak bisa diubah lagi.

            </p>

            <div className="flex justify-end gap-[8px]">

              <button

                type="button"

                onClick={() => setKonfirmSelesai(false)}

                className="h-[40px] rounded-[8px] border border-solid border-[#dce4ee] bg-white px-[15px] text-[14px] text-[#64748b] hover:bg-[#f3f6fa]"

              >

                Tidak jadi

              </button>

              <button

                type="button"

                onClick={selesaikan}

                className="h-[40px] rounded-[8px] border border-solid border-[#1769e0] bg-[#1769e0] px-[15px] text-[14px] text-white hover:bg-[#0e4fab]"

              >

                Ya, selesaikan

              </button>

            </div>

          </div>

        </Modal>

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
