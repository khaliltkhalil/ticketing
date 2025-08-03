import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const doRequest = async () => {
    setErrors(null);
    setLoading(true);
    try {
      const response = await axios[method](url, body);
      if (onSuccess) {
        console.log(response.data);
        onSuccess(response.data);
      }
      setLoading(false);
      return;
    } catch (err) {
      console.log("Error in loading", err);
      setErrors(
        <div className="alert alert-danger">
          <ul className="my-0">
            {err.response.data.errors.map((error) => (
              <li key={error.message}> {error.message}</li>
            ))}
          </ul>
        </div>
      );
      setLoading(false);
    }
  };

  return [doRequest, loading, errors];
};

export default useRequest;
