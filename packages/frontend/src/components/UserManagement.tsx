import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser } from "../slices/userSlice";
import { RootState, AppDispatch } from "../store";

const UserManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.items);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (userId: string) => {
    dispatch(deleteUser(userId));
  };

  return (
    <div>
      <h2>User Management</h2>
      {users.map((user) => (
        <div key={user.id}>
          <p>
            {user.username} - {user.role}
          </p>
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default UserManagement;
