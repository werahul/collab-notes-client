import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { io } from "socket.io-client";
import ActiveUsersBadge from "../components/ActiveUsersBadge";
import { api } from "../src/api";

const socketUrl = import.meta.env.VITE_SOCKET_URL

function randomName() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return "Guest-" + num;
}

const NotePage = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [name] = useState(randomName());
  const socketRef = useRef(null);
  const saveTimer = useRef(null);
  const skipNextIncoming = useRef(false);


  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await api.get(`/notes/${id}`);
        if (!isMounted) return;
        setNote(res.data);
        setTitle(res.data.title);
        setContent(res.data.content || "");
        setLastSavedAt(new Date(res.data.updatedAt));
      } catch (err) {
        console.error(err);
        alert("Note not found");
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [id]);


  useEffect(() => {
    const s = io(socketUrl, { transports: ["websocket"] });
    socketRef.current = s;

    s.on("connect", () => {
      setConnected(true);
      s.emit("join_note", { noteId: id, name });
    });

    s.on("disconnect", () => setConnected(false));

    s.on("note_update", ({ content: incoming }) => {
     
      if (skipNextIncoming.current) {
        skipNextIncoming.current = false;
        return;
      }
      setContent(incoming);
    });

    s.on("active_users", (list) => {
      setUsers(list);
    });

    return () => {
      s.disconnect();
    };
  }, [id, name]);

  
  function handleChange(e) {
    const value = e.target.value;
    setContent(value);
    const s = socketRef.current;
    if (s && s.connected) {
      skipNextIncoming.current = true; 
      s.emit("note_update", { noteId: id, content: value });
    }
  }

  useEffect(() => {
    function startTimer() {
      clearInterval(saveTimer.current);
      saveTimer.current = setInterval(async () => {
        try {
          const res = await api.put(`/notes/${id}`, { content, title });
          setLastSavedAt(new Date(res.data.updatedAt));
        } catch (err) {
          console.error("Auto-save failed. Will try again.", err);
        }
      }, 7000);
    }
    if (note) startTimer();
    return () => clearInterval(saveTimer.current);
  }, [note, id, content, title]);

  if (!note) return <p className="loading">Loading…</p>;

  return (
    <div className="note-page">
      <div className="note-bar">
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="status">
          <span className={connected ? "dot online" : "dot offline"}></span>
          {connected ? "Live" : "Offline"}
        </div>
      </div>

      <ActiveUsersBadge users={users} />

      <TextareaAutosize
        className="editor"
        minRows={12}
        value={content}
        onChange={handleChange}
        placeholder="Start typing…"
      />

      <div className="meta">
        <span>Your name: {name}</span>
        {lastSavedAt && (
          <span>Last saved: {lastSavedAt.toLocaleTimeString()}</span>
        )}
      </div>
    </div>
  );
};

export default NotePage;
