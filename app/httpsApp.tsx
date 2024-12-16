import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import axios from "axios"; // 导入axios

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

  async function makeAxiosRequest() {
    // 新增axios请求的方法
    try {
      const result = await axios.get(
        "https://jsonplaceholder.typicode.com/posts/1",
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(result);

      // setResponse(result.data); // 设置响应数据
    } catch (error) {
      console.error("Axios request failed:", error);
    }
  }

  return (
    <main className="container">
      <button onClick={makeRequest}>Make HTTPS Request</button>
      <button onClick={makeAxiosRequest}>Make Axios Request</button>{" "}
      {/* 新增按钮 */}
      <p>{response}</p>
    </main>
  );
}

export default App;
