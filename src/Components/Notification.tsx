import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
  } from "react";
  import "./notifications.css";
  
  export type NotificationType = "success" | "error" | "warning" | "info";
  
  export interface NotificationOptions {
    title?: string;
    message: string;
    type?: NotificationType;
    duration?: number;
  }
  
  interface NotificationItem extends NotificationOptions {
    id: number;
    type: NotificationType;
  }
  
  interface NotificationContextValue {
    notify: (options: NotificationOptions) => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    dismiss: (id: number) => void;
  }
  
  const NotificationContext =
    createContext<NotificationContextValue | null>(null);
  
  const DEFAULT_TITLES: Record<NotificationType, string> = {
    success: "Berhasil",
    error: "Terjadi Kesalahan",
    warning: "Perhatian",
    info: "Informasi",
  };
  
  function NotificationIcon({ type }: { type: NotificationType }) {
    const symbol = {
      success: "✓",
      error: "!",
      warning: "!",
      info: "i",
    }[type];
  
    return <span className="simpera-notification__icon-symbol">{symbol}</span>;
  }
  
  export function NotificationProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const nextId = useRef(0);
    const timeoutRefs = useRef<Map<number, ReturnType<typeof setTimeout>>>(
      new Map(),
    );
  
    const dismiss = useCallback((id: number) => {
      const timeout = timeoutRefs.current.get(id);
  
      if (timeout) {
        clearTimeout(timeout);
        timeoutRefs.current.delete(id);
      }
  
      setNotifications((current) =>
        current.filter((item) => item.id !== id),
      );
    }, []);
  
    const notify = useCallback(
      (options: NotificationOptions) => {
        const type = options.type ?? "info";
        const id = ++nextId.current;
  
        const item: NotificationItem = {
          ...options,
          id,
          type,
          title: options.title ?? DEFAULT_TITLES[type],
        };
  
        setNotifications((current) => [...current, item]);
  
        // Error tetap tampil sampai ditutup pengguna.
        const duration = options.duration ?? (type === "error" ? 0 : 4000);
  
        if (duration > 0) {
          const timeout = setTimeout(() => dismiss(id), duration);
          timeoutRefs.current.set(id, timeout);
        }
      },
      [dismiss],
    );
  
    const success = useCallback(
      (message: string, title?: string) =>
        notify({ message, title, type: "success" }),
      [notify],
    );
  
    const error = useCallback(
      (message: string, title?: string) =>
        notify({ message, title, type: "error" }),
      [notify],
    );
  
    const warning = useCallback(
      (message: string, title?: string) =>
        notify({ message, title, type: "warning" }),
      [notify],
    );
  
    const info = useCallback(
      (message: string, title?: string) =>
        notify({ message, title, type: "info" }),
      [notify],
    );
  
    useEffect(() => {
      const timeoutMap = timeoutRefs.current;
  
      return () => {
        timeoutMap.forEach((timeout) => clearTimeout(timeout));
        timeoutMap.clear();
      };
    }, []);
  
    return (
      <NotificationContext.Provider
        value={{ notify, success, error, warning, info, dismiss }}
      >
        {children}
  
        <div
          className="simpera-notification-container"
          aria-live="polite"
          aria-atomic="false"
        >
          {notifications.map((item) => (
            <section
              className={`simpera-notification simpera-notification--${item.type}`}
              key={item.id}
              role={item.type === "error" ? "alert" : "status"}
            >
              <div
                className={`simpera-notification__icon simpera-notification__icon--${item.type}`}
              >
                <NotificationIcon type={item.type} />
              </div>
  
              <div className="simpera-notification__content">
                <strong className="simpera-notification__title">
                  {item.title}
                </strong>
                <p className="simpera-notification__message">
                  {item.message}
                </p>
              </div>
  
              <button
                type="button"
                className="simpera-notification__close"
                aria-label="Tutup notifikasi"
                onClick={() => dismiss(item.id)}
              >
                ×
              </button>
            </section>
          ))}
        </div>
      </NotificationContext.Provider>
    );
  }
  
  export function useNotification() {
    const context = useContext(NotificationContext);
  
    if (!context) {
      throw new Error(
        "useNotification harus digunakan di dalam NotificationProvider.",
      );
    }
  
    return context;
  }  