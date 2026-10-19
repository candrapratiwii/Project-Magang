import { useState, type ReactNode } from "react";
import {
  Boxes,
  PackagePlus,
  PackageMinus,
  ClipboardCheck,
  LayoutDashboard,
  ArrowLeftRight,
  FileBarChart,
  Users,
  ChevronDown,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../auth";

const assetPathPrefix = "/assets";

export type MenuLabel =
  | "Dashboard"
  | "Master Barang"
  | "Barang Masuk"
  | "Barang Keluar"
  | "Stok Opname"
  | "Laporan"
  | "Manajemen Pengguna";

interface NavItemProps {
  icon?: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  trailing?: ReactNode;
  className?: string;
}

function NavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
  trailing,
  className = "",
}: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-[10px] rounded-[8px] px-[12px] py-[10px] text-left text-[13px] transition-colors ${
        active
          ? "bg-[#29455f] font-medium text-[#65a1ff]"
          : "text-[#d7e2ec] hover:bg-[#1c3a56]"
      } ${className}`}
    >
      {Icon && <Icon size={17} className="shrink-0" />}
      <span className="flex-1">{label}</span>
      {trailing}
    </button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-[12px] pb-[4px] pt-[18px] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7f98b0]">
      {children}
    </p>
  );
}

interface SidebarProps {
  /** Menu yang sedang aktif (sesuai halaman). */
  active: MenuLabel;
  /** Dipanggil saat menu diklik, mis. untuk navigasi router. */
  onNavigate?: (label: MenuLabel) => void;
}

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "Admin";

  // Dropdown Transaksi otomatis terbuka kalau halaman aktifnya anak menunya
  const [transaksiOpen, setTransaksiOpen] = useState(
    active === "Barang Masuk" || active === "Barang Keluar",
  );

  const go = (label: MenuLabel) => () => onNavigate?.(label);

  return (
    // Pembungkus: menjaga ruang 244px di layout supaya konten tidak tertutup
    <div className="relative w-[244px] shrink-0 self-stretch">
      {/* Sidebar menempel di layar (tidak ikut scroll) */}
      <aside className="fixed top-0 flex h-screen w-[244px] flex-col overflow-y-auto bg-[#102a43] px-[14px] py-[20px]">
        {/* Brand */}
        <div className="flex items-center gap-[10px] px-[6px] pb-[6px]">
          <img
            alt="SIMPERA-NET"
            className="h-10 w-10 shrink-0 object-contain"
            src={`${assetPathPrefix}/logo.png`}
          />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold text-white">
              SIMPERA-NET
            </p>
            <p className="truncate text-[10px] text-[#afc3d6]">
              Persediaan Infrastruktur TIK
            </p>
          </div>
        </div>

        <div className="my-[10px] h-px w-full bg-[#29455f]" />

        <nav className="flex flex-col">
          <SectionLabel>Utama</SectionLabel>
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={active === "Dashboard"}
            onClick={go("Dashboard")}
          />

          <SectionLabel>Persediaan</SectionLabel>
          <NavItem
            icon={Boxes}
            label="Master Barang"
            active={active === "Master Barang"}
            onClick={go("Master Barang")}
          />
          <NavItem
            icon={ArrowLeftRight}
            label="Transaksi"
            onClick={() => setTransaksiOpen((v) => !v)}
            trailing={
              <ChevronDown
                size={15}
                className={`text-[#afc3d6] transition-transform ${
                  transaksiOpen ? "rotate-180" : ""
                }`}
              />
            }
          />
          {transaksiOpen && (
            <div className="ml-[22px] mt-[2px] flex flex-col border-l border-[#29455f] pl-[8px]">
              <NavItem
                icon={PackagePlus}
                label="Barang Masuk"
                active={active === "Barang Masuk"}
                onClick={go("Barang Masuk")}
              />
              <NavItem
                icon={PackageMinus}
                label="Barang Keluar"
                active={active === "Barang Keluar"}
                onClick={go("Barang Keluar")}
              />
            </div>
          )}
          <NavItem
            icon={ClipboardCheck}
            label="Stok Opname"
            active={active === "Stok Opname"}
            onClick={go("Stok Opname")}
          />

          <SectionLabel>Analitik</SectionLabel>
          <NavItem
            icon={FileBarChart}
            label="Laporan"
            active={active === "Laporan"}
            onClick={go("Laporan")}
          />

          {/* Hanya Admin yang melihat menu ini */}
          {isAdmin && (
            <>
              <SectionLabel>Administrasi</SectionLabel>
              <NavItem
                icon={Users}
                label="Manajemen Pengguna"
                active={active === "Manajemen Pengguna"}
                onClick={go("Manajemen Pengguna")}
              />
            </>
          )}
        </nav>

        {/* Info user + keluar */}
        {user && (
          <div className="mt-auto border-t border-[#29455f] pt-[14px]">
            <div className="px-[6px] pb-[8px]">
              <p className="truncate text-[12px] font-semibold text-white">
                {user.nama}
              </p>
              <p className="truncate text-[10px] text-[#afc3d6]">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                logout();
              }}
              className="flex w-full items-center gap-[10px] rounded-[8px] px-[12px] py-[10px] text-left text-[13px] text-[#d7e2ec] transition-colors hover:bg-[#1c3a56]"
            >
              <LogOut size={17} className="shrink-0" />
              <span className="flex-1">Logout</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
