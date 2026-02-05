# Natty Shop – Frontend

Natty Shop, modern bir e-ticaret deneyimi sunmak amacıyla geliştirilmiş
full-stack bir portfolyo projesinin frontend kısmıdır.

Proje; ürün listeleme, kategori bazlı filtreleme, kullanıcı girişi ve
admin panel entegrasyonu gibi temel e-ticaret özelliklerini içerir.

🔗 **Canlı Site:**  
https://natty-shop-frontend.vercel.app

---

## 🚀 Kullanılan Teknolojiler

- React (Vite)
- React Router
- Context API
- Fetch API
- Tailwind CSS
- Vercel (Deployment)

---

## 🔗 Backend Entegrasyonu

Frontend, aşağıdaki backend servisi ile haberleşir:

- **API Base URL:**  
  `https://natty-shop-backend-production.up.railway.app`

API adresi ortam değişkeni ile yönetilir:

```env
VITE_API_URL=https://natty-shop-backend-production.up.railway.app
