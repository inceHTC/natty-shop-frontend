import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import BackLink from "../components/BackLink";
import { formatPrice } from "../utils/formatPrice";
import { API_URL } from "../config";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { Check, Truck, RefreshCcw, ShieldCheck } from "lucide-react";

function getImageUrl(url, gender = "kadin") {
  if (!url) return "";
  const base = `${API_URL}/images`;
  return url.includes("/") ? `${base}/${url}` : `${base}/${gender}/${url}`;
}

export default function Product({
  addToCart,
  favoriteIds,
  toggleFavorite,
  user,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  /* =====================
     FETCH PRODUCT
  ===================== */
  useEffect(() => {
    setLoading(true);

    fetch(`${API_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const normalizedProduct = {
          ...data,
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
        };

        setProduct(normalizedProduct);

        // SON GÖRÜNTÜLENENLER
        try {
          const viewed =
            JSON.parse(localStorage.getItem("recentProducts")) || [];

          const filtered = viewed.filter(
            (p) => p.id !== normalizedProduct.id
          );

          filtered.unshift({
            id: normalizedProduct.id,
            name: normalizedProduct.name,
            price: normalizedProduct.price,
            image: normalizedProduct.image,
            images: normalizedProduct.images,
            gender: normalizedProduct.gender,
            type: normalizedProduct.type,
          });

          localStorage.setItem(
            "recentProducts",
            JSON.stringify(filtered.slice(0, 6))
          );
        } catch {}

        const main =
          normalizedProduct.images?.find((img) => img.isMain) ||
          normalizedProduct.images?.[0] ||
          (normalizedProduct.image
            ? { id: 0, url: normalizedProduct.image, isMain: true }
            : null);

        setActiveImage(main);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  /* ürün değişince numarayı resetle */
  useEffect(() => {
    setSelectedSize(null);
  }, [id]);

  if (loading) {
    return (
      <div className="page-container py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 skeleton w-3/4 rounded-lg" />
            <div className="h-6 skeleton w-1/4 rounded-lg" />
            <div className="h-24 skeleton w-full rounded-lg mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Ürün bulunamadı</h1>
        <Link to="/" className="underline">
          Anasayfaya dön
        </Link>
      </div>
    );
  }

  const gender = product.gender || "kadin";
  const isFavorite = favoriteIds?.has(product.id);

  const images = product.images?.length
    ? product.images
    : product.image
    ? [{ id: 0, url: product.image, isMain: true }]
    : [];

  const isShoe = product.type === "ayakkabi";
  const hasSizes = product.sizes.length > 0;

  const lowStockSize =
    isShoe &&
    hasSizes &&
    product.sizes.find((s) => s.stock > 0 && s.stock < 5);

  /* =====================
     ADD TO CART
  ===================== */
  const handleAddToCart = () => {
    if (!product.isActive) return;

    if (isShoe && hasSizes && !selectedSize) {
      alert("Lütfen numara seçin");
      return;
    }

    if (isShoe && !hasSizes) {
      alert("Bu ürün için numara bilgisi tanımlanmamış");
      return;
    }

    setAdding(true);

    addToCart({
      ...product,
      selectedSize: isShoe ? selectedSize : null,
    });

    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <div className="bg-[var(--color-bg-main)]">
      {/* BREADCRUMB */}
      <div className="border-b bg-white">
        <div className="page-container py-3 flex justify-between text-sm">
          <span>
            <Link to="/">Anasayfa</Link> /{" "}
            <Link to={`/kategori/${gender}`}>
              {gender === "erkek" ? "Erkek" : "Kadın"}
            </Link>{" "}
            / {product.name}
          </span>
          <BackLink fallback="/" />
        </div>
      </div>

      <div className="page-container py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
          {/* GALERİ */}
          <div>
            <div className="rounded-2xl overflow-hidden border aspect-[4/5] max-h-[520px] bg-white p-3">
              <img
                src={getImageUrl(activeImage?.url, gender)}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 border rounded-xl overflow-hidden ${
                      activeImage?.id === img.id ? "ring-2 ring-black" : ""
                    }`}
                  >
                    <img
                      src={getImageUrl(img.url, gender)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BİLGİ */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between mb-4">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <button
                onClick={() => {
                  if (!user) navigate("/auth");
                  else toggleFavorite?.(product.id);
                }}
                className="text-red-500"
              >
                {isFavorite ? (
                  <HiHeart size={24} />
                ) : (
                  <HiOutlineHeart size={24} />
                )}
              </button>
            </div>

            <p className="mb-6 text-slate-600">
              {product.description || "Bu ürün için açıklama yok."}
            </p>

            <div className="text-2xl font-bold mb-2">
              {formatPrice(product.price)}
            </div>

            {/* GÜVEN BANDI */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-600 mb-6">
              <div className="flex items-center gap-1">
                <Truck size={14} /> Aynı gün kargo
              </div>
              <div className="flex items-center gap-1">
                <RefreshCcw size={14} /> 14 gün iade
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck size={14} /> Güvenli ödeme
              </div>
            </div>

            {/* STOK UYARISI */}
            {lowStockSize && (
              <div className="mb-4 text-sm font-medium text-red-600">
                ⚠️ Bu üründen son {lowStockSize.stock} adet kaldı
              </div>
            )}

            {/* NUMARA SEÇİMİ */}
            {isShoe &&
              (hasSizes ? (
                <div className="mb-6">
                  <p className="font-semibold mb-2">Numara Seçin</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((s) => {
                      const outOfStock = s.stock <= 0;
                      const active = selectedSize === s.size;

                      return (
                        <button
                          key={s.size}
                          type="button"
                          onClick={() => {
                            if (outOfStock) return;
                            setSelectedSize(s.size);
                          }}
                          className={`px-3 py-2 rounded-lg border text-sm transition
                            ${
                              outOfStock
                                ? "bg-slate-100 text-slate-400 opacity-50"
                                : active
                                ? "bg-black text-white"
                                : "bg-white hover:border-black"
                            }`}
                        >
                          {s.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 mb-6">
                  Bu ürün için numara bilgisi tanımlanmamış.
                </p>
              ))}

            {/* SEPETE EKLE */}
            <button
              onClick={handleAddToCart}
              disabled={adding || (isShoe && hasSizes && !selectedSize)}
              className={`w-full md:max-w-sm py-4 rounded-xl font-semibold transition
                ${
                  adding
                    ? "bg-slate-800 text-white"
                    : isShoe && hasSizes && !selectedSize
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-black text-white hover:opacity-90"
                }`}
            >
              {adding ? (
                <span className="flex items-center justify-center gap-2">
                  <Check size={18} /> Sepete eklendi
                </span>
              ) : isShoe && hasSizes && !selectedSize ? (
                "Numara seçin"
              ) : (
                "Sepete Ekle"
              )}
            </button>
          </div>
        </div>
      </div>
      {/* MOBİL FİLTRE BUTONU */}
<button
  onClick={() => setMobileFilterOpen(true)}
  className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg z-40"
>
  Filtrele
</button>

    </div>
  );
}
