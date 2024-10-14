import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { logout } from "./services/auth/authSlice";
import Register from "./components/Register";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import UserManagement from "./components/UserManagement";
import { refreshToken } from "./services/auth/authSlice";

const Navigation = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
        </li>
        {!user && (
          <>
            <li>
              <Link to="/register" className="hover:text-gray-300">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
            </li>
          </>
        )}
        {user && user.role === "seller" && (
          <li>
            <Link to="/add-product" className="hover:text-gray-300">
              Add Product
            </Link>
          </li>
        )}
        {user && user.role === "admin" && (
          <li>
            <Link to="/user-management" className="hover:text-gray-300">
              User Management
            </Link>
          </li>
        )}
        {user && (
          <li>
            <button onClick={handleLogout} className="hover:text-gray-300">
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user) {
      const refreshTokenInterval = setInterval(() => {
        dispatch(refreshToken());
      }, 14 * 60 * 1000); // Refresh token every 14 minutes

      return () => clearInterval(refreshTokenInterval);
    }
  }, [dispatch, user]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="container mx-auto mt-8 p-4">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route
              path="/register"
              element={user ? <Navigate to="/" /> : <Register />}
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/add-product"
              element={
                user && user.role === "seller" ? (
                  <AddProduct />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/user-management"
              element={
                user && user.role === "admin" ? (
                  <UserManagement />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
