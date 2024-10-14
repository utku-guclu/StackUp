import { useState } from "react";
import { useNavigate } from "react-router";
import { useRegisterMutation } from "../../services/auth/authSlice";
import type { RegisterRequest } from "../../services/auth/types";

const Register = ({
	isAuthenticated,
}: { isAuthenticated: boolean }) => {
	const navigate = useNavigate();
	const [register, { isLoading }] = useRegisterMutation();
	const [registerFormData, setRegisterFormData] = useState<RegisterRequest>({
    	username: "",
    	email: "",
    	password: "",
	});
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
    	e.preventDefault();
    	setErrorMessage(null);
    	try {
        	const result = await register(registerFormData).unwrap();
        	if (result.ok) {
            	navigate("/", { replace: true });
        	} else {
            	setErrorMessage(result.message || "Registration failed");
        	}
    	} catch (err: any) {
        	if (err.error === 'TypeError: Failed to fetch') {
            	setErrorMessage("Unable to connect to the server. Please check your internet connection or try again later.");
        	} else {
            	setErrorMessage(err.data?.message || "An error occurred during registration");
        	}
    	}
	};

	return (
    	<div className="card">
        	{!isAuthenticated && (
            	<>
                	<h2>Register to our blogging platform</h2>
                	{errorMessage && <div className="error-message">{errorMessage}</div>}
                	<form className="login" onSubmit={handleSubmit}>
                    	<input
                        	id="username"
                        	placeholder="Username"
                        	type="text"
                        	value={registerFormData.username}
                        	onChange={(e) =>
                            	setRegisterFormData({
                                	...registerFormData,
                                	username: e.target.value,
                            	})
                        	}
                    	/>
                    	<input
                        	id="email"
                        	placeholder="Email"
                        	type="email"
                        	value={registerFormData.email}
                        	onChange={(e) =>
                            	setRegisterFormData({
                                	...registerFormData,
                                	email: e.target.value,
                            	})
                        	}
                    	/>
                    	<input
                        	id="password"
                        	type="password"
                        	placeholder="Password"
                        	value={registerFormData.password}
                        	onChange={(e) =>
                            	setRegisterFormData({
                                	...registerFormData,
                                	password: e.target.value,
                            	})
                        	}
                    	/>
                    	<button type="submit">
                        	{isLoading ? "Registering..." : "Register"}
                    	</button>
                	</form>
            	</>
        	)}
    	</div>
	);
};

export default Register;
