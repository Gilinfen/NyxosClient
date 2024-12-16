import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [response, setResponse] = useState("");

  async function makeRequest() {
    try {
      const result = await invoke("make_https_request", {
        url: "https://jsonplaceholder.typicode.com/posts/1",
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: null,
      });
      setResponse(result as string);
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  return (
    <main className="container">
      <button onClick={makeRequest}>Make HTTPS Request</button>
      <p>{response}</p>
    </main>
  );
}

export default App;
