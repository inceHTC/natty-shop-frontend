import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackLink({ fallback = "/" }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate(fallback);
        }
      }}
      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-main)] transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Geri Dön
    </button>
  );
}
