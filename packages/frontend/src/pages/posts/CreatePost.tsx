import { type FormEvent, useState } from "react";
import type { BlogCreateRequest } from "../../services/posts/types";
import { useCreatePostMutation } from "../../services/posts/blogSlice";
import { useNavigate, Link } from "react-router-dom";
import LogOutButton from "../auth/LogOutButton";
import type { AuthState } from "../../services/auth/types";
import type { ErrorResponse } from "../../services/error-types";

/**
 * Creates a post only if the user is authenticated.
 */
const CreatePost = ({ authState }: { authState: AuthState }) => {
	const navigate = useNavigate();
	const [createPost, { isLoading }] = useCreatePostMutation();
	const [postFormData, setPostFormData] = useState<BlogCreateRequest>({
    	title: "",
    	content: "",
	});

	const handlePostSubmit = async (e: FormEvent) => {
    	e.preventDefault();
    	try {
        	const result = await createPost(postFormData).unwrap();
        	if (result.ok) {
            	alert(result.message);
            	setPostFormData({ title: "", content: "" });
        	} else {
            	alert(result.message || "Failed to create post");
        	}
    	} catch (err) {
        	const error = err as ErrorResponse;
        	console.error("Failed to create blog post:", error);
        	alert(error.message || "Something went wrong");
    	}
	};

	return (
    	<div className="card">
        	<h2>
            	Post here {authState.user?.username} or{" "}
            	<Link to={"/"}>back to home</Link>
        	</h2>
        	<form className="card" onSubmit={(e) => handlePostSubmit(e)}>
            	<div className="post">
                	<input
                    	id="title"
                    	placeholder="Blog title"
                    	value={postFormData.title as string}
                    	type="text"
                    	onChange={(e) =>
                        	setPostFormData({ ...postFormData, title: e.target.value })
                    	}
                	/>
                	<textarea
                    	id="content"
                    	placeholder="Blog content"
                    	value={postFormData.content as string}
                    	onChange={(e) =>
                        	setPostFormData({ ...postFormData, content: e.target.value })
                    	}
                	/>
            	</div>
            	<div className="buttons">
                	<button type="submit">
                    	{isLoading ? "Creating new blog post..." : "Create blog post"}
                	</button>
                	<LogOutButton />
            	</div>
        	</form>
        	<h3>
            	Check out other posts <Link to={"/posts"}>here!</Link>
        	</h3>
        	<h4>
            	You can manage your posts{" "}
            	<Link to={encodeURI(`/posts/user/${authState.user?.username}`)}>
                	here
            	</Link>{" "}
            	too!
        	</h4>
    	</div>
	);
};

export default CreatePost;
