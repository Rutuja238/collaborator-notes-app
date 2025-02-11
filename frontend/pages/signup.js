import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      console.log("Signing up with:", name, email, password);
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password });

      alert("Signup successful! Redirecting to login...");
      router.push("/login");
    } catch (err) {
      console.error("Signup failed", err);
      alert("Error signing up. Please try again.");
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
      <form style={styles.form} onSubmit={handleSignup}>
        <h2 style={{ textAlign: "center" }}>Sign Up</h2>

        <div style={styles.fieldContainer}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldContainer}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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

        <a href="#" style={styles.link}>Already have an account?</a>

        <button type="submit" style={styles.button}>Sign Up</button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          <span>Already a Member? </span>
          <a href="/login" style={{ color: "#007bff", textDecoration: "none" }}>Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
