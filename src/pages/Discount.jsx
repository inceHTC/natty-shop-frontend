import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BackLink from "../components/BackLink";
import ProductList from "./ProductList";

export default function Discount() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // discount yoksa EKLE, varsa DOKUNMA
    if (!searchParams.get("discount")) {
      const next = new URLSearchParams(searchParams);
      next.set("discount", "true");
      setSearchParams(next);
    }
  }, []);

  return (
    <div className="page-container py-10 md:py-14">
      <nav className="mb-6">
        <BackLink fallback="/" />
      </nav>

      <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-danger)] mb-2">
        İndirimdekiler
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Seçili ürünlerde indirim fırsatları.
      </p>

      <ProductList />
    </div>
  );
}
