import { useEffect, useState } from "react"
import DashboardScreen from "./pages/dashboard"
import DetailBarangScreen from "./pages/detail"
import FormTambahEditBarangScreen from "./pages/form"
import BarangMasukScreen from "./pages/incoming"
import LoginScreen from "./pages/login"
import MasterBarangScreen from "./pages/master"
import StokOpnameScreen from "./pages/opname"
import BarangKeluarScreen from "./pages/outgoing"
import LaporanPersediaanScreen from "./pages/report"
import ManajemenPenggunaScreen from "./pages/users"

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
  | "users"

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
}

const navItems: Array<[string, Route]> = [
  ["Dashboard", "dashboard"],
  ["Master Barang", "master"],
  ["Barang Masuk", "incoming"],
  ["Barang Keluar", "outgoing"],
  ["Stok Opname", "opname"],
  ["Laporan", "report"],
  ["Manajemen Pengguna", "users"],
]

const destinations: Array<[string, Route]> = [
  ["Masuk ke sistem", "dashboard"],
  ...navItems,
  ["Tambah barang", "form"],
  ["Edit barang", "form"],
  ["NET-AP-018", "detail"],
]

function routeFromHash(): Route {
  const route = window.location.hash.slice(1) as Route
  return route in routes ? route : "login"
}

export default function App() {
  const [route, setRoute] = useState<Route>(routeFromHash)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [route])

  const navigate = (nextRoute: Route) => {
    window.location.hash = nextRoute
    setRoute(nextRoute)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = (event.target as HTMLElement).closest(
      "p, button, a, [data-name='Button']",
    )
    const label = target?.textContent?.replace(/^●\s*/, "").trim()
    if (!label) return

    const match = destinations.find(
      ([text]) => label === text || label.includes(text),
    )
    if (match) navigate(match[1])
  }

  if (route === "login") {
    return (
      <main className="app-screen" data-route={route}>
        <LoginScreen onLogin={() => navigate("dashboard")} />
      </main>
    )
  }

  const Screen = routes[route]
  return (
    <main className="app-screen" data-route={route} onClick={handleClick}>
      <div className="mobile-topbar">
        <button
          aria-label="Buka menu"
          className="mobile-menu-btn"
          onClick={(event) => {
            event.stopPropagation()
            setMenuOpen(true)
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
              event.stopPropagation()
              setMenuOpen(false)
            }}
            type="button"
          />
          <aside className="mobile-drawer-panel">
            <p className="mobile-drawer-title">SIMPERA-NET</p>
            <p className="mobile-drawer-subtitle">
              Sistem Persediaan Infrastruktur TIK
            </p>
            {navItems.map(([label, nextRoute]) => (
              <button
                className={
                  nextRoute === route
                    ? "mobile-nav-item is-active"
                    : "mobile-nav-item"
                }
                key={nextRoute}
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(nextRoute)
                }}
                type="button"
              >
                {label}
              </button>
            ))}
          </aside>
        </div>
      ) : null}

      <Screen />
    </main>
  )
}
