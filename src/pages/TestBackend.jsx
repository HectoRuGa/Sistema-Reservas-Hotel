import { useEffect, useState } from "react";
import api from "../api/api";

function TestBackend() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Conexión Backend</h1>
      <p>{message}</p>
    </div>
  );
}

export default TestBackend;