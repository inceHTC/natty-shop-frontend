import { useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi";

export default function Toast({
  message,
  actionLabel,
  actionTo,
  onClose,
  visible,
  duration = 3500,
}) {
  useEffect(() => {
    if (!visible || !onClose) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [visible, onClose, duration]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-[100] max-w-sm w-full animate-toast-in"
      aria-live="polite"
    >
      <div className="bg-[var(--color-text-main)] text-white rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden flex items-stretch">
        <div className="flex items-center gap-4 p-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center flex-shrink-0">
            <HiOutlineShoppingBag className="text-2xl text-[var(--color-accent)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">{message}</p>
            {actionLabel && actionTo && (
              <Link
                to={actionTo}
                onClick={onClose}
                className="inline-block mt-1.5 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors underline underline-offset-2"
              >
                {actionLabel}
              </Link>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-3 text-slate-400 hover:text-white transition-colors self-center"
          aria-label="Kapat"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
