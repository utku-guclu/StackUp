import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../services/auth/authSlice";
import type { LoginRequest, UserResponse } from "../../services/auth/types";
import { Link } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	const [login, { isLoading }] = useLoginMutation();
	const [loginFormData, setLoginFormData] = useState<LoginRequest>({
    	email: "",
    	password: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
    	e.preventDefault();
    	try {
        	const result = await login(loginFormData).unwrap();
        	if (result.ok) {
            	// Store session information
            	sessionStorage.setItem("isAuthenticated", "true");
            	const userResponse: UserResponse = {
                	token: result.token,
                	username: result.username,
                	userId: result.userId,
                	email: result.email,
                	role: result.role,
                	status: result.status,
                	ok: result.ok
            	};
            	sessionStorage.setItem("user", JSON.stringify(userResponse));
            	
            	// Redirect to posts page
            	navigate("/posts", { replace: true });
        	} else {
            	alert("Invalid credentials!");
        	}
    	} catch (err) {
        	console.error("Login error:", err);
        	alert("Server error! Please file a bug report!");
    	}
	};

	return (
    	<div className="card">
        	<h2>Login to our blogging platform</h2>
        	<form className="login" onSubmit={handleSubmit}>
                    	<input
                        	id="email"
                        	placeholder="Email"
                        	type="email"
                        	value={loginFormData.email}
                        	onChange={(e) =>
                            	setLoginFormData({ ...loginFormData, email: e.target.value })
                        	}
                    	/>
                    	<input
                        	id="password"
                        	type="password"
                        	placeholder="Password"
                        	value={loginFormData.password}
                        	onChange={(e) =>
                            	setLoginFormData({ ...loginFormData, password: e.target.value })
                        	}
                    	/>
                    	<div className="buttons">
                        	<button type="submit">
                            	{isLoading ? "Logging in..." : "Login"}
                        	</button>
                        	<button type="button" onClick={() => navigate("/register")}>
                            	Click here to register
                        	</button>
                    	</div>
        	</form>
        	<p>
            	Don't have an account? <Link to="/register">Register here</Link>
        	</p>
    	</div>
	);
};

export default Login;
