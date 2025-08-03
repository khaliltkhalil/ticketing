"use client";
import { useState } from "react";
import useRequest from "../../../hooks/use-request";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/auth";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setCurrentUser] = useAuth();
  const [doRequest, loading, errors] = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: (currentUser) => {
      console.log(currentUser);
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
      <h1>Sign In</h1>
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
        Sign In
      </button>
    </form>
  );
};

export default Signin;
