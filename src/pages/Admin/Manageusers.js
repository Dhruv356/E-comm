import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:5000/api/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load users."
      );
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("User deleted successfully.");
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete user."
      );
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/users/${userId}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("User role updated.");
      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user role."
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <section className="admin-wrapper">
    <h1 className="admin-title">👥 Manage Users</h1>

    <div className="user-table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateUserRole(user._id, e.target.value)
                    }
                    className="role-select"
                    aria-label="Change User Role"
                  >
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => deleteUser(user._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);
};

export default ManageUsers;
