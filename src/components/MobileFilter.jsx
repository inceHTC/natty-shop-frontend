import { useSearchParams } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";

export default function MobileFilter({ open, setOpen }) {
  const [params, setParams] = useSearchParams();

  if (!open) return null;

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (params.get("discount") === "true") {
      next.set("discount", "true");
    }
    setParams(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* ARKA PLAN */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
      />

      {/* PANEL */}
      <div className="relative w-full bg-white rounded-t-2xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">Filtrele</h3>
          <button
            onClick={() => setOpen(false)}
            className="text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* İÇERİK (SCROLL) */}
        <div className="flex-1 overflow-y-auto p-4 pb-28">
          <FilterSidebar />
        </div>

        {/* 🔥 ALT BAR (SABİT) */}
        <div className="absolute bottom-0 left-0 w-full border-t bg-white p-4 flex gap-3">
          <button
            onClick={clearFilters}
            className="flex-1 py-3 rounded-xl border text-sm font-medium"
          >
            Temizle
          </button>

          <button
            onClick={() => setOpen(false)}
            className="flex-1 py-3 rounded-xl bg-black text-white text-sm font-semibold"
          >
            Uygula
          </button>
        </div>
      </div>
    </div>
  );
}
