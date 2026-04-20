import { useState } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("Sending data:", user);

      const res = await axios.post(
        "http://localhost:8081/api/users/register",
        user
      );

      console.log("Response:", res.data);
      alert("User Registered Successfully!");
    } catch (err) {
      console.error("Backend Error:", err.response?.data || err.message);
      alert("Error registering user");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Registration</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <br /><br />

      <input name="email" placeholder="Email" onChange={handleChange} />
      <br /><br />

      <input name="password" placeholder="Password" onChange={handleChange} />
      <br /><br />

      <input name="role" placeholder="Role" onChange={handleChange} />
      <br /><br />

      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}

export default App;