import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useLogoutMutation } from "../../services/auth/authSlice";

// Custom hook to handle navigation
const useCustomNavigate = () => {
  const navigate = useNavigate();
  return useCallback((to: string, options?: { replace?: boolean }) => {
    if (typeof window !== 'undefined') {
      navigate(to, options);
    }
  }, [navigate]);
};

const LogOutButton = () => {
  const [logout, { isLoading }] = useLogoutMutation();
  const customNavigate = useCustomNavigate();

  const handleLogout = async () => {
    await logout();
    customNavigate("/", { replace: true });
  };

  return (
    <button type="button" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogOutButton;
