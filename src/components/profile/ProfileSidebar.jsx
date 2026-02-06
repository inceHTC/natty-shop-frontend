import {
  HiOutlineUser,
  HiOutlineClipboardList,
  HiOutlineLocationMarker,
  HiOutlineHeart,
  HiOutlineKey,
} from "react-icons/hi";

const MENU = [
  { id: "info", label: "Üyelik Bilgilerim", icon: HiOutlineUser },
  { id: "orders", label: "Siparişlerim", icon: HiOutlineClipboardList },
  { id: "addresses", label: "Adreslerim", icon: HiOutlineLocationMarker },
  { id: "favorites", label: "Favorilerim", icon: HiOutlineHeart },
  { id: "password", label: "Şifre Değiştir", icon: HiOutlineKey },
];

export default function ProfileSidebar({ active, onChange }) {
  return (
    <aside className="w-full md:w-64 shrink-0">

      <nav className="bg-white rounded-2xl border shadow-sm overflow-hidden sticky top-24">
        {MENU.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium border-b last:border-b-0 transition
              ${
                active === item.id
                  ? "bg-black text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
