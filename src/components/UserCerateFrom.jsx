"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function UserCreateForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState([]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("/api/users", formData);
      setMessage("User created successfully!");
      setUserData((prev) => [...prev, response.data.data]); // Update user list
      setFormData({ username: "", email: "", password: "" }); // Reset form
    } catch (error) {
      setError(error.response?.data?.message || "Error creating user.");
    }
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    console.log(id)

    try {
      await axios.delete(`/api/users/${id}`);
      setUserData((prev) => prev.filter((user) => user.id !== id));
      setMessage("User deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting user.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUserData(response.data?.data || []);
      } catch (error) {
        setError("Error fetching users.");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a User</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
          className="w-full px-3 py-2 border-b-2 border-gray-500 focus:outline-none focus:border-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-3 py-2 border-b-2 border-gray-500 focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          className="w-full px-3 py-2 border-b-2 border-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create User
        </button>
      </form>

      {message && (
        <p className="mt-4 text-green-600 font-medium">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-red-600 font-medium">{error}</p>
      )}

      <h2 className="text-xl font-semibold mt-8">Users</h2>
      <ul className="mt-4 space-y-2">
        {userData.length > 0 ? (
          userData.map((user) => (
            <li
              key={user.id}
              className="p-2 border-b border-gray-300 flex justify-between items-center"
            >
              <span>{user.username}</span>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </div>
  );
}
