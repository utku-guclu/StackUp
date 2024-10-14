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
  let authState: AuthState = {
    user: null,
    token: null,
  };
  const { user, token } = useAppSelector((state) => state.auth);
  const userSession = sessionStorage.getItem("user");
  const response: UserResponse = userSession ? JSON.parse(userSession) : null;
  if (
    sessionStorage.getItem("isAuthenticated") === "true" &&
    response !== null
  ) {
    authState = {
      user:
        {
          username: response.username,
          id: response.userId,
          email: response.email,
          role: response.role,
        } ?? user,
      token: response.token ?? token,
    };
  }
  const isAuthenticated = authState.user !== null && authState.token !== null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/posts" /> : <Login authState={authState} isAuthenticated={isAuthenticated} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/posts" /> : <Register isAuthenticated={isAuthenticated} />} />
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

