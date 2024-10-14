import Login from "./pages/auth/Login";
import CreatePost from "./pages/posts/CreatePost";
import AllPost from "./pages/posts/AllPosts";
import { useAppSelector } from "./store";
import UserSpecificPosts from "./pages/posts/UserSpecificPosts";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Posts from "./pages/posts/Posts";
import EditPost from "./pages/posts/EditPost";
import NotFound from "./pages/404";
import Register from "./pages/auth/Register";
import "./App.css";

import type { AuthState, UserResponse } from "./services/auth/types";

const App = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const userSession = sessionStorage.getItem("user");
  const response: UserResponse | null = userSession ? JSON.parse(userSession) : null;
  
  let authState: AuthState = {
    user: null,
    token: null,
  };

  if (sessionStorage.getItem("isAuthenticated") === "true" && response !== null) {
    authState = {
      user: {
        username: response.username,
        id: response.userId,
        email: response.email,
        role: response.role,
      },
      token: response.token,
    };
  } else if (user && token) {
    authState = { user, token };
  }

  const isAuthenticated = authState.user !== null && authState.token !== null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/posts" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/posts" /> : <Register />} />
        <Route path="/post/create" element={isAuthenticated ? <CreatePost authState={authState} /> : <Navigate to="/" />} />
        <Route path="/posts" element={isAuthenticated ? <Posts authState={authState} /> : <Navigate to="/" />}>
          <Route index element={<AllPost />} />
          <Route path="user/:username" element={<UserSpecificPosts />} />
          <Route path="user/:username/post/edit/:postId" element={<EditPost />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

