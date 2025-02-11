import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditNote() {
  const router = useRouter();
  const { id } = router.query;
  const [note, setNote] = useState({ title: "", content: "" });

  useEffect(() => {
    if (id && id !== "new") {
      axios.get(`http://localhost:5000/api/notes/${id}`).then(({ data }) => setNote(data));
    }
  }, [id]);

  const handleSave = async () => {
    if (id === "new") {
      await axios.post("http://localhost:5000/api/notes", note, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } else {
      await axios.put(`http://localhost:5000/api/notes/${id}`, note, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    }
    router.push("/");
  };

  const handleShare = (id) => {
    const email = prompt("Enter email to share with:");
    if (!email) return;
  
    const token = localStorage.getItem("token");
    console.log("Token:", token);
  
    axios.post(`http://localhost:5000/api/notes/${id}/share`, { email }, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => alert("Note shared successfully!"))
    .catch((error) => {
      alert("Error sharing note");
      console.error("Error:", error.response ? error.response.data : error);
    });
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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px", // Add spacing between elements
      minHeight: "350px", // Ensures enough space inside
    },
    title: {
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "16px",
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
  };

  return (
    <div style={styles.container}>
      <form style={styles.form}>
        <h2 style={styles.title}>{id === "new" ? "Create Note" : "Edit Note"}</h2>

        <input
          style={styles.input}
          placeholder="Title"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
        />
        <textarea
          style={{ ...styles.input, height: "150px" }}
          placeholder="Content"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
        />
        <button type="button" style={styles.button} onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  );
}