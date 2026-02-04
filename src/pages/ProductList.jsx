import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import MobileFilter from "../components/MobileFilter";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../config";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  /* =====================
     FETCH PRODUCTS (FİLTRELİ)
  ===================== */
  useEffect(() => {
    setLoading(true);

    fetch(`${API_URL}/products?${searchParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

  return (
    <>
      <div className="page-container py-10">
        <div className="grid grid-cols-12 gap-8">
          {/* DESKTOP FİLTRE */}
          <aside className="col-span-3 hidden lg:block sticky top-24 h-fit">
            <FilterSidebar />
          </aside>

          {/* ÜRÜN LİSTESİ */}
          <main className="col-span-12 lg:col-span-9">
            {/* MOBİL FİLTRE BUTONU (PREMIUM) */}
<div className="lg:hidden flex justify-end mb-4">
  <button
    onClick={() => setMobileFilterOpen(true)}
    className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white shadow-sm text-sm font-medium"
  >
    Filtrele
  </button>
</div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] skeleton rounded-2xl"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 text-slate-500">
                Ürün bulunamadı
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBİL FİLTRE */}
      <MobileFilter
        open={mobileFilterOpen}
        setOpen={setMobileFilterOpen}
      />

    
    </>
  );
}
