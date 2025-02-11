import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      console.log("Attempting login with:", username, password);
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { 
        email: username, // Assuming the API expects "email" instead of "username"
        password 
      });

      console.log("Login successful, token:", data.token);
      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (err) {
      console.error("Login failed", err);
      alert("Invalid credentials");
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
      fontFamily: "Arial, sans-serif",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backdropFilter: "blur(5px)", // Apply blur effect
      backgroundColor: "rgba(0, 0, 0, 0.2)", // Slight transparency for effect
    },
    form: {
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
      width: "350px",
    },
    fieldContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: "15px",
    },
    label: {
      width: "100px",
      fontWeight: "bold",
      textAlign: "left",
    },
    input: {
      flex: "1",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    button: {
      width: "100%",
      padding: "10px",
      background: "linear-gradient(135deg, #ff4e50, #fc9d9a)",
      color: "white",
      border: "none",
      borderRadius: "20px",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "10px",
    },
    link: {
      display: "block",
      textAlign: "left",
      color: "#007bff",
      textDecoration: "none",
      fontSize: "14px",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleLogin}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

        <div style={styles.fieldContainer}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldContainer}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={styles.input}
          />
        </div>

        <a href="#" style={styles.link}>Don't have an account?</a>

        {/* Ensure the button is inside the form */}
        <button type="submit" style={styles.button}>Login</button>

        
        <p style={{ textAlign: "center", marginTop: "10px" }}>
  <span>Not a Member? </span>
  <a href="/signup" style={{ color: "#007bff", textDecoration: "none" }}>Signup</a>
</p>

      </form>
    </div>
  );
};

export default Login;
