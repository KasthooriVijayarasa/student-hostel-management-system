import { useState } from "react";
import axios from "axios";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    try {

      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          username,
          password
        }
      );

      console.log(response.data);

      localStorage.setItem(
        "token",
        response.data.token
      );

      alert("Login Successful");

      window.location.reload();

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message || "Login Failed"
      );

    }

  };

  return (

    <div style={{ padding: "20px" }}>

      <h1>Admin Login</h1>

      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>
        Login
      </button>

    </div>

  );

}

export default Login;