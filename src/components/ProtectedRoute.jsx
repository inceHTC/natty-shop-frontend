import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export default function ProtectedRoute({ children, admin }) {
  const token = localStorage.getItem("token");

  // 🔒 Login yok
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  let user;
  try {
    user = jwtDecode(token);
  } catch {
    localStorage.clear();
    return <Navigate to="/auth" replace />;
  }

  // 🔒 Admin yetkisi yok
  if (admin && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
