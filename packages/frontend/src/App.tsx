import Login from "./pages/auth/Login";
import CreatePost from "./pages/posts/CreatePost";
import AllPost from "./pages/posts/AllPosts";
import { useAppSelector } from "./store";
import UserSpecificPosts from "./pages/posts/UserSpecificPosts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
        <Route path="/" element={<Login authState={authState} isAuthenticated={isAuthenticated} />} />
        <Route path="/register" element={<Register isAuthenticated={isAuthenticated} />} />
        <Route path="/post/create" element={<CreatePost isAuthenticated={isAuthenticated} authState={authState} />} />
        <Route path="/posts" element={<Posts isAuthenticated={isAuthenticated} authState={authState} />}>
          <Route index element={<AllPost />} />
          <Route path="user/:username" element={<UserSpecificPosts isAuthenticated={isAuthenticated} />} />
          <Route path="user/:username/post/edit/:postId" element={<EditPost isAuthenticated={isAuthenticated} />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

