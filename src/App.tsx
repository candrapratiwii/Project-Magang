import { useEffect, useState } from "react";
import { AuthContext, type User } from "./auth";
import DashboardScreen from "./pages/dashboard";
import DetailBarangScreen from "./pages/detail";
import FormTambahEditBarangScreen from "./pages/form";
import BarangMasukScreen from "./pages/incoming";
import LoginScreen from "./pages/login";
import MasterBarangScreen from "./pages/master";
import StokOpnameScreen from "./pages/opname";
import BarangKeluarScreen from "./pages/outgoing";
import LaporanPersediaanScreen from "./pages/report";
import ManajemenPenggunaScreen from "./pages/users";

type Route =
  | "login"
  | "dashboard"
  | "master"
  | "detail"
  | "form"
  | "incoming"
  | "outgoing"
  | "opname"
  | "report"
  | "users";

const routes: Record<Exclude<Route, "login">, React.ComponentType> = {
  dashboard: DashboardScreen,
  master: MasterBarangScreen,
  detail: DetailBarangScreen,
  form: FormTambahEditBarangScreen,
  incoming: BarangMasukScreen,
  outgoing: BarangKeluarScreen,
  opname: StokOpnameScreen,
  report: LaporanPersediaanScreen,
  users: ManajemenPenggunaScreen,
};

const navItems: Array<[string, Route]> = [
  ["Dashboard", "dashboard"],
  ["Master Barang", "master"],
  ["Barang Masuk", "incoming"],
  ["Barang Keluar", "outgoing"],
  ["Stok Opname", "opname"],
  ["Laporan", "report"],
  ["Manajemen Pengguna", "users"],
];

const destinations: Array<[string, Route]> = [
  ["Masuk ke sistem", "dashboard"],
  ...navItems,
  ["Tambah barang", "form"],
  ["Edit barang", "form"],
  ["NET-AP-018", "detail"],
  ["Kembali", "master"], // tombol "Kembali" -> daftar Master Barang
];

// Halaman yang hanya boleh dibuka Admin
const adminOnly: Route[] = ["users"];

const STORAGE_KEY = "simpera-net-session";

function loadUser(): User | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function routeFromHash(): Route {
  const route = window.location.hash.slice(1) as Route;
  return route in routes ? route : "login";
}

export default function App() {
  const [user, setUser] = useState<User | null>(loadUser);
  const [route, setRoute] = useState<Route>(routeFromHash);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "Admin";
  const canOpen = (target: Route) => !adminOnly.includes(target) || isAdmin;

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [route]);

  // Belum login -> paksa ke login. Login tapi tidak berhak -> ke dashboard.
  useEffect(() => {
    if (!user && route !== "login") {
      window.location.hash = "login";
    } else if (user && route !== "login" && !canOpen(route)) {
      window.location.hash = "dashboard";
    }
  }, [user, route]);

  const navigate = (nextRoute: Route) => {
    if (nextRoute !== "login" && !canOpen(nextRoute)) return;
    window.location.hash = nextRoute;
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (loggedIn: User) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
    setUser(loggedIn);
    window.location.hash = "dashboard";
    setRoute("dashboard");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
    window.location.hash = "login";
    setRoute("login");
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = (event.target as HTMLElement).closest(
      "p, button, a, [data-name='Button']",
    );
    const label = target?.textContent?.replace(/^●\s*/, "").trim();
    if (!label) return;

    const match = destinations.find(
      ([text]) => label === text || label.includes(text),
    );
    if (match) navigate(match[1]);
  };

  if (!user || route === "login") {
    return (
      <main className="app-screen" data-route="login">
        <LoginScreen onLogin={handleLogin} />
      </main>
    );
  }

  // Cadangan: kalau route tidak boleh dibuka, jangan render sama sekali
  const Screen = canOpen(route) ? routes[route] : DashboardScreen;
  const visibleNav = navItems.filter(([, r]) => canOpen(r));

  return (
    <AuthContext.Provider value={{ user, logout: handleLogout }}>
      <main className="app-screen" data-route={route} onClick={handleClick}>
        <div className="mobile-topbar">
          <button
            aria-label="Buka menu"
            className="mobile-menu-btn"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen(true);
            }}
            type="button"
          >
            ☰
          </button>
          <p>SIMPERA-NET</p>
        </div>

        {menuOpen ? (
          <div className="mobile-drawer">
            <button
              className="mobile-drawer-backdrop"
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen(false);
              }}
              type="button"
            />
            <aside className="mobile-drawer-panel">
              <p className="mobile-drawer-title">SIMPERA-NET</p>
              <p className="mobile-drawer-subtitle">
                {user.nama} · {user.role}
              </p>
              {visibleNav.map(([label, nextRoute]) => (
                <button
                  className={
                    nextRoute === route
                      ? "mobile-nav-item is-active"
                      : "mobile-nav-item"
                  }
                  key={nextRoute}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(nextRoute);
                  }}
                  type="button"
                >
                  {label}
                </button>
              ))}
              <button
                className="mobile-nav-item"
                onClick={(event) => {
                  event.stopPropagation();
                  handleLogout();
                }}
                type="button"
              >
                Logout
              </button>
            </aside>
          </div>
        ) : null}

        <Screen />
      </main>
    </AuthContext.Provider>
  );
}