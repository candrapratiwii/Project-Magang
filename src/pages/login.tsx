import { FormEvent, useState } from "react"

const imgImage1 = "/assets/8d655.png"

type LoginScreenProps = {
  onLogin: () => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setInfo("")

    if (!username.trim() || !password.trim()) {
      setError("Nama pengguna dan kata sandi wajib diisi.")
      return
    }

    if (password.length < 4) {
      setError("Kata sandi minimal 4 karakter.")
      return
    }

    if (remember) {
      localStorage.setItem("simpera-net-user", username.trim())
    } else {
      localStorage.removeItem("simpera-net-user")
    }

    setError("")
    onLogin()
  }

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-[#f3f6fa] lg:flex-row">
      <section className="relative flex min-h-[280px] flex-col justify-between overflow-hidden p-6 text-white sm:min-h-[360px] sm:p-10 lg:min-h-[100dvh] lg:w-[46%] lg:max-w-[690px] lg:shrink-0 lg:p-14">
        <img
          alt=""
          className="absolute inset-0 size-full object-cover"
          src={imgImage1}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(11,36,66,0.5)] to-[rgba(7,24,43,0.95)]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex size-[46px] shrink-0 items-center justify-center rounded-lg bg-[#1769e0] text-[19px] text-white">
            ◆
          </div>
          <div>
            <p className="text-[15px] leading-tight">SIMPERA-NET.</p>
            <p className="text-[12px] text-[#d5e2ef]">
              Bidang Teknologi dan Informasi
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-10 max-w-[500px] space-y-5 lg:mt-0">
          <div className="inline-flex items-center gap-[7px] rounded-full bg-[rgba(23,105,224,0.2)] px-[11px] py-[6px]">
            <span className="text-[12px] text-[#9cc4ff]">✓</span>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#cde1ff]">
              Operasional internal terintegrasi
            </p>
          </div>
          <p className="text-[28px] leading-[1.15] sm:text-[36px] lg:text-[43px] lg:leading-[1.12]">
            Persediaan TIK tertata, layanan publik tetap terjaga.
          </p>
          <p className="text-[14px] leading-[1.6] text-[#c7d5e3] sm:text-[16px]">
            Kelola perangkat, material jaringan, dan riwayat transaksi secara
            cepat, akurat, dan mudah ditelusuri.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[15px] text-[#7cb0ff]">◆</p>
              <p className="mt-1 text-[13px] font-bold">Data stok</p>
              <p className="text-[11px] text-[#afc3d6]">selalu terkini</p>
            </div>
            <div>
              <p className="text-[15px] text-[#7cb0ff]">◆</p>
              <p className="mt-1 text-[13px] font-bold">Riwayat</p>
              <p className="text-[11px] text-[#afc3d6]">mudah diaudit</p>
            </div>
            <div>
              <p className="text-[15px] text-[#7cb0ff]">◆</p>
              <p className="mt-1 text-[13px] font-bold">Peringatan</p>
              <p className="text-[11px] text-[#afc3d6]">stok minimum</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 mt-8 text-[11px] text-[#92a9be] lg:mt-0">
          Akses terbatas untuk pegawai yang berwenang • Versi 1.0
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        <form
          className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-[0px_18px_48px_0px_rgba(15,39,64,0.16)] sm:p-[38px]"
          onSubmit={handleSubmit}
        >
          <div className="mb-6 space-y-2">
            <h1 className="text-[26px] leading-tight text-[#172b4d]">
              Selamat datang
            </h1>
            <p className="text-[14px] leading-[1.5] text-[#64748b]">
              Masuk menggunakan akun Sistem Persediaan Infrastruktur TIK.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block space-y-[7px] text-[12px] text-[#172b4d]">
              Nama pengguna *
              <span className="mt-[7px] flex h-[42px] items-center gap-2 rounded-lg border border-[#dce4ee] bg-white px-3">
                <span className="text-[12px] text-[#94a3b8]">●</span>
                <input
                  autoComplete="username"
                  className="h-full w-full bg-transparent text-[14px] text-[#172b4d] outline-none placeholder:text-[#94a3b8]"
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Masukkan nama pengguna"
                  value={username}
                />
              </span>
            </label>

            <label className="block space-y-[7px] text-[12px] text-[#172b4d]">
              Kata sandi *
              <span className="mt-[7px] flex h-[44px] items-center gap-2 rounded-lg border border-[#dce4ee] bg-white px-3">
                <span className="text-[12px] text-[#94a3b8]">◆</span>
                <input
                  autoComplete="current-password"
                  className="h-full w-full bg-transparent text-[14px] text-[#172b4d] outline-none placeholder:text-[#94a3b8]"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan kata sandi"
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  className="shrink-0 text-[12px] text-[#94a3b8] hover:text-[#1769e0]"
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  {showPassword ? "Sembunyi" : "Lihat"}
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-[12px] text-[#64748b]">
                <input
                  checked={remember}
                  className="size-[18px] rounded border-[#dce4ee] accent-[#1769e0]"
                  onChange={(event) => setRemember(event.target.checked)}
                  type="checkbox"
                />
                Ingat saya
              </label>
              <button
                className="text-[12px] text-[#1769e0] hover:underline"
                onClick={() => {
                  setError("")
                  setInfo(
                    "Hubungi admin Bidang TIK untuk reset kata sandi akun Anda.",
                  )
                }}
                type="button"
              >
                Lupa kata sandi?
              </button>
            </div>
          </div>

          {error ? (
            <p className="mt-4 text-[12px] text-[#c2410c]">{error}</p>
          ) : null}
          {info ? (
            <p className="mt-4 text-[12px] text-[#0e4fab]">{info}</p>
          ) : null}

          <button
            className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#1769e0] text-[14px] text-white hover:bg-[#145bbf]"
            type="submit"
          >
            <span>◆</span>
            Masuk ke sistem
          </button>

          <div className="mt-6 flex gap-2.5 rounded-lg bg-[#eaf2ff] p-3 text-[11px] leading-[1.45] text-[#0e4fab]">
            <span className="text-[14px] text-[#1769e0]">◆</span>
            <p>
              Jangan membagikan kredensial. Hubungi admin jika akun terkunci.
            </p>
          </div>
        </form>
      </section>
    </div>
  )
}
