"use client";

import { useEffect } from "react";
import useRequest from "../../../hooks/use-request";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/auth";

export default function () {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useAuth();
  const [doRequest] = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => {
      setCurrentUser(null);
      router.push("/");
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing out...</div>;
}
