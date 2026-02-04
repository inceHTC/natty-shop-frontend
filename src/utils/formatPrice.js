export function formatPrice(price) {
  return price.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
  });
}

/** KDV dahil fiyattan KDV tutarını hesaplar (Türkiye %18 standart) */
export function calculateVAT(price, vatRate = 0.18) {
  const netAmount = price / (1 + vatRate);
  return price - netAmount;
}

/** KDV dahil fiyattan net (KDV hariç) tutarı hesaplar */
export function priceWithoutVAT(price, vatRate = 0.18) {
  return price / (1 + vatRate);
}

/** Fiyat, adet ve KDV oranına göre detaylı breakdown döner */
export function getVATBreakdown(price, quantity = 1, vatRate = 0.18) {
  const total = price * quantity;
  const vatAmount = calculateVAT(total, vatRate);
  const netAmount = total - vatAmount;
  return {
    total,
    vatAmount,
    netAmount,
    vatRatePercent: vatRate * 100,
  };
}
