import { User, Package, MapPin, Heart, Lock } from "lucide-react";

const TABS = [
  { id: "info", label: "Bilgilerim", icon: User },
  { id: "orders", label: "Siparişlerim", icon: Package },
  { id: "addresses", label: "Adreslerim", icon: MapPin },
  { id: "favorites", label: "Favorilerim", icon: Heart },
  { id: "password", label: "Şifre Değiştir", icon: Lock },
];

export default function ProfileSidebar({ active, onChange }) {
  return (
    <nav className="bg-white rounded-2xl border border-[var(--color-border)] p-2 shadow-sm">
      <ul className="space-y-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--color-text-main)] text-white"
                    : "text-[var(--color-text-main)] hover:bg-slate-50"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
