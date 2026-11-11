const API_BASE_URL = "http://127.0.0.1:8000/api";

type ApiErrorPayload = {
  message?: unknown;
  errors?: unknown;
};

function getValidationMessage(): string {
  return "Periksa kembali data yang Anda masukkan. Pastikan semua isian sudah benar.";
}

function isDuplicateCodeMessage(message: string): boolean {
  return /(already been taken|already exists|has already been used|duplicate|unique|sudah digunakan|sudah terdaftar|telah digunakan|telah terdaftar)/i.test(message);
}

function hasDuplicateCodeError(errors: unknown): boolean {
  if (!errors || typeof errors !== "object") return false;

  const daftarError = errors as Record<string, unknown>;
  const pesanKode = daftarError.kode_barang ?? daftarError.kode;
  const teks = Array.isArray(pesanKode)
    ? pesanKode.map(String).join(" ")
    : typeof pesanKode === "string"
      ? pesanKode
      : "";

  return Boolean(teks && isDuplicateCodeMessage(teks));
}

function getSafeErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Permintaan tidak dapat diproses. Periksa kembali data yang Anda masukkan.";
    case 401:
      return "Sesi Anda telah berakhir atau data login tidak valid. Silakan masuk kembali.";
    case 403:
      return "Anda tidak memiliki hak akses untuk melakukan tindakan ini.";
    case 404:
      return "Data atau halaman yang diminta tidak ditemukan.";
    case 409:
      return "Data tidak dapat diproses karena terjadi konflik. Periksa kembali data terkait.";
    case 422:
      return getValidationMessage();
    case 429:
      return "Terlalu banyak permintaan. Silakan tunggu beberapa saat, lalu coba kembali.";
    default:
      if (status >= 500) {
        return "Terjadi gangguan pada server. Silakan coba kembali beberapa saat lagi.";
      }
      return "Permintaan tidak dapat diproses. Silakan coba kembali.";
  }
}

function isTechnicalMessage(message: string): boolean {
  return (
    /localhost|127\.0\.0\.1|sqlstate|syntax error|stack trace|exception|fatal error| at .*\.php|\.php:\d+/i.test(message) ||
    message.length > 240
  );
}

function getSafeMessageFromPayload(status: number, payload: ApiErrorPayload): string {
  if (hasDuplicateCodeError(payload.errors)) {
    return "Kode barang sudah digunakan. Silakan gunakan kode barang lain.";
  }

  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (message && isDuplicateCodeMessage(message)) {
    return "Kode barang sudah digunakan. Silakan gunakan kode barang lain.";
  }

  if (status === 422) return getValidationMessage();

  if (
    message &&
    !isTechnicalMessage(message) &&
    !/unauthenticated|unauthorized|forbidden|not found|server error|validation failed/i.test(message)
  ) {
    return message;
  }

  return getSafeErrorMessage(status);
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem("simpera-net-token");
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (options.body && !headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Permintaan dibatalkan.");
    }
    throw new Error("Tidak dapat terhubung ke server. Periksa koneksi dan pastikan server aplikasi sedang berjalan.");
  }

  const result = (await response.json().catch(() => ({}))) as ApiErrorPayload;
  if (!response.ok) {
    throw new Error(getSafeMessageFromPayload(response.status, result));
  }
  return result as T;
}
