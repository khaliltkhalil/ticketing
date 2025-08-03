"use client";
import { useState } from "react";
import useRequest from "../../../hooks/use-request";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/auth";

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setCurrentUser] = useAuth();
  const [doRequest, loading, errors] = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: (currentUser) => {
      setCurrentUser(currentUser);
      router.push("/");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group mb-3">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group mb-3">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary" disabled={loading}>
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
