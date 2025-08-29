import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../src/api";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Please enter a title");

    try {
      setLoading(true);
      const res = await api.post("/notes", { title });
      navigate(`/note/${res.data._id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create note");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Create a Note</h2>
      <form onSubmit={handleCreate}>
        <input
          className="input"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <button className="btn" type="submit" disabled={loading}>
          Create
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="hint">
        After creating, copy the URL and share it to collaborate.
      </p>
    </div>
  );
};

export default CreateNote;
