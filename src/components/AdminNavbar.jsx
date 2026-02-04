import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const exitAdminPanel = () => {
    // ❗ LOGOUT YOK
    // sadece admin panelden çık
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <button
        onClick={exitAdminPanel}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
      >
        Siteye Dön
      </button>
    </div>
  );
}
