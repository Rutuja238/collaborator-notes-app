import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { FaEllipsisV } from "react-icons/fa";

export default function Notes() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);

  // Fetch notes when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login if no token
      return;
    }

    axios
      .get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setNotes(data))
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login"); // Redirect if unauthorized
      });
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    router.push("/login"); // Redirect to login page
  };

  // Handle delete note
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setNotes(notes.filter((note) => note._id !== id));
  };

  // Handle sharing a note
  const handleShare = async (id) => {
    const email = prompt("Enter email to share with:");
    if (!email) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/notes/${id}/share`,
        { email },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("Note shared successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Error sharing note. Please try again.");
    }
  };

  const handleManageCollaborators = async (id) => {
    try {
      const { data: collaborators } = await axios.get(
        `http://localhost:5000/api/notes/${id}/collaborators`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const emailToRemove = prompt(
        `Collaborators: \n${collaborators.join("\n")}\nEnter email to remove:`
      );

      if (!emailToRemove) return;

      await axios.post(
        `http://localhost:5000/api/notes/${id}/remove-collaborator`,
        { email: emailToRemove },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("Collaborator removed successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Error managing collaborators.");
    }
  };


  return (
    <div style={{  background: "linear-gradient(135deg, #ff9a9e, #fad0c4)", minHeight: "100vh", padding: "20px" }}>
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "white" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>My Notes</h1>

        <div>
          <button
            onClick={() => router.push("/note/new")}
            style={{ background: "white", color: "#ff5c8a", padding: "10px 20px", borderRadius: "5px", fontWeight: "bold", marginRight: "10px" }}
          >
            Create Note
          </button>

          <button
            onClick={handleLogout}
            style={{ background: "#ff4e50", color: "white", padding: "10px 20px", borderRadius: "5px", fontWeight: "bold" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div style={{ marginTop: "20px" }}>
        {notes.map((note) => (
          <div
            key={note._id}
            style={{
              background: "white",
              color: "black",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px",
              position: "relative",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontWeight: "bold" }}>{note.title}</h2>

              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setMenuOpen(menuOpen === note._id ? null : note._id)}
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <FaEllipsisV size={20} color="#ff3b7d" />
                </button>

                {menuOpen === note._id && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      background: "#ff5c8a",
                      color: "white",
                      padding: "10px",
                      borderRadius: "5px",
                      zIndex: 10,
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <button
                      onClick={() => router.push(`/note/${note._id}`)}
                      style={{
                        display: "block",
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        padding: "5px 10px",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      style={{
                        display: "block",
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        padding: "5px 10px",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleShare(note._id)}
                      style={{
                        display: "block",
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        padding: "5px 10px",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      Share
                    </button>
                    <button
                      onClick={() => handleManageCollaborators(note._id)}
                      style={{
                        display: "block",
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        padding: "5px 10px",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      Manage Collaborators
                    </button>

                  </div>
                )}
              </div>
            </div>

            <p>{note.content}</p>
            <p style={{ fontSize: "12px", color: "gray", marginTop: "10px" }}>
              <strong>Created:</strong> {new Date(note.createdAt).toLocaleString()}
            </p>
            <p style={{ fontSize: "12px", color: "gray" }}>
              <strong>Updated:</strong> {new Date(note.updatedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}