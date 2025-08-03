import axios from "axios";

const createCustomAxios = (headersList) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: {
        Host: headersList.get("host"),
        Cookie: headersList.get("cookie"),
      },
    });
  } else {
    return axios.create();
  }
};

export default createCustomAxios;
