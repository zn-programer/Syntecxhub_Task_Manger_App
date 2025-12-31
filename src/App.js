/** @format */
import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const [notes, setNotes] = useState(null);
  async function getTodos() {
    const todos = (await axios.get("http://localhost:5000/api/todos")).data;
    setNotes(todos);
  }
  useEffect(() => {
    getTodos();
  }, []);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [whatWillView, setWhatWillView] = useState("login");
  const [error, setError] = useState(null);
  const handleAddOrEdit = () => {
    if (!input.trim()) return;
    if (editId) {
      setNotes(
        notes.map((note) =>
          note.id === editId ? { ...note, text: input } : note
        )
      );
      setEditId(null);
    } else {
      setNotes([...notes, { id: Date.now(), text: input, completed: false }]);
    }
    setInput("");
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleEdit = (note) => {
    setInput(note.text);
    setEditId(note.id);
  };

  const toggleComplete = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  };
  // ===========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ======
  const [name, setName] = useState("");
  const handleLogin = () => {
    if (!email || !password) return alert("املأ جميع الحقول");
  };
  if (whatWillView === "todos") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>📝 ملاحظاتي</h1>
          <p style={styles.subtitle}>نظّم مهامك و أنجزها بسهولة</p>

          <div style={styles.inputBox}>
            <input
              style={styles.input}
              type='text'
              placeholder='اكتب مهمة جديدة...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              style={styles.addBtn}
              onClick={async () => {
                if (!editId) {
                  await axios.post("http://localhost:5000/api/todos", {
                    title: input,
                    completed: false,
                  });
                  setInput("");
                  getTodos();
                } else {
                  await axios.put(`http://localhost:5000/api/todos/${editId}`, {
                    title: input,
                  });
                  setInput("");
                  getTodos();
                }
              }}>
              {editId ? "تعديل" : "إضافة"}
            </button>
          </div>

          <div style={styles.list}>
            {notes?.map((note) => (
              <div
                key={note._id}
                style={{
                  ...styles.note,
                  background: note.completed ? "#e6fff3" : "#f9f9f9",
                }}>
                <div>
                  <input
                    type='checkbox'
                    checked={note.completed}
                    onClick={async () => {
                      await axios.put(
                        `http://localhost:5000/api/todos/${note._id}`,
                        { completed: !note.completed }
                      );
                      console.log(note.completed);
                      getTodos();
                    }}
                  />
                  <span
                    style={{
                      ...styles.text,
                      textDecoration: note.completed === true ? "line-through" : "none",
                      color: note.completed ? "#1e8f62" : "#333",
                    }}>
                    {note.title}
                  </span>
                </div>
                <div>
                  <button
                    style={styles.edit}
                    onClick={() => {
                      setEditId(note._id);
                      setInput(note.title);
                    }}>
                    ✏️
                  </button>
                  <button
                    style={styles.delete}
                    onClick={async () => {
                      await axios.delete(
                        `http://localhost:5000/api/todos/${note._id}`
                      );
                      getTodos();
                    }}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else if (whatWillView === "login") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>تسجيل الدخول</h2>
          <p style={styles.subtitle}>مرحباً بعودتك 👋</p>

          <input
            style={styles.input}
            type='email'
            placeholder='البريد الإلكتروني'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type='password'
            placeholder='كلمة المرور'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={async () => {
              const data = {
                email: email,
                password: password,
              };
              console.log(data);
              try {
                await axios.post("http://localhost:5000/api/auth/login", data);
                setName("");
                setEmail("");
                setPassword("");
                setWhatWillView("todos");
              } catch (error) {
                console.log(error.message);
                setError(error.message);
              }
            }}
            style={{
              width: "200px",
              padding: "10px",
              background: "green ",
              color: "white",
              border: "none",
              borderRadius: "20px 0px 20px 0px",
              cursor: "pointer",
            }}>
            دخول
          </button>
          {error ? <div style={{ color: "red" }}>حدث خطأ ما</div> : null}

          <p style={styles.text}>
            ليس لديك حساب؟
            <span
              style={styles.link}
              onClick={() => {
                setWhatWillView("register");
              }}>
              إنشاء حساب
            </span>
          </p>
        </div>
      </div>
    );
  } else if (whatWillView === "register") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>إنشاء حساب</h2>
          <p style={styles.subtitle}>ابدأ تنظيم مهامك الآن ✨</p>

          <input
            style={styles.input}
            type='text'
            placeholder='الاسم'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={styles.input}
            type='email'
            placeholder='البريد الإلكتروني'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type='password'
            placeholder='كلمة المرور'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            style={{
              width: "200px",
              padding: "10px",
              background: "green ",
              color: "white",
              border: "none",
              borderRadius: "20px 0px 20px 0px",
              cursor: "pointer",
            }}
            onClick={async () => {
              const data = {
                email: email,
                username: name,
                password: password,
              };
              console.log(data);
              await axios.post("http://localhost:5000/api/auth/register", data);
              setName("");
              setEmail("");
              setPassword("");
              setWhatWillView("todos");
            }}>
            تسجيل
          </button>

          <p style={styles.text}>
            لديك حساب؟
            <span
              style={styles.link}
              onClick={() => {
                setWhatWillView("login");
              }}>
              تسجيل الدخول
            </span>
          </p>
        </div>
      </div>
    );
  }
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #8C5ED1, #2FAE7B)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Segoe UI",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    width: "380px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    margin: 0,
    color: "#2FAE7B",
  },
  subtitle: {
    color: "#777",
    fontSize: "14px",
    marginBottom: "20px",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    margin: "5px",
  },
  addBtn: {
    background: "#8C5ED1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    cursor: "pointer",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  note: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderRadius: "10px",
  },
  text: {
    marginLeft: "8px",
    fontSize: "15px",
  },
  edit: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  delete: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "6px",
  },
  link: {
    cursor: "pointer",
    color: "blue",
  },
};

export default App;
