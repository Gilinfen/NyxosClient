import { useEffect, useState } from "react";
import Database from "@tauri-apps/plugin-sql";
import type { TOKEN_STATUS_KEYS, User } from "./root";
import { Button, Form, Input } from "antd";

function DbApp() {
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [username, setName] = useState<string>("");
  const [password, setEmail] = useState<string>("");
  const [status, setstatus] = useState<TOKEN_STATUS_KEYS>("isTokerSuccess");
  const [error, setError] = useState<string>("");

  async function getUsers() {
    try {
      const db = await Database.load("sqlite:test.db");
      const dbUsers = await db.select<User[]>("SELECT * FROM users");

      setError("");
      setUsers(dbUsers);
      setIsLoadingUsers(false);
    } catch (error) {
      console.log(error);
      setError("Failed to get users - check console");
    }
  }

  async function setUser(user: Omit<User, "id">) {
    try {
      setIsLoadingUsers(true);
      const db = await Database.load("sqlite:test.db");

      await db.execute(
        "INSERT INTO users (username, password,status) VALUES ($1, $2, $3)",
        [user.username, user.password, status]
      );

      getUsers().then(() => setIsLoadingUsers(false));
    } catch (error) {
      console.log(error);
      setError("Failed to insert user - check console");
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <main className="container">
      <h1>Welcome to Tauri + SQLite</h1>

      {isLoadingUsers ? (
        <div>Loading users...</div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <Form
            className="row"
            onFinish={() => {
              setUser({ username, password, status });
              getUsers();
            }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "请输入用户名!" }]}
            >
              <Input
                id="username-input"
                onChange={(e) => setName(e.currentTarget.value)}
                placeholder="请输入用户名..."
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input.Password
                id="password-input"
                onChange={(e) => setEmail(e.currentTarget.value)}
                placeholder="请输入密码..."
              />
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                添加用户
              </Button>
            </Form.Item>
          </Form>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              textAlign: "center",
            }}
          >
            <h1>用户列表</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>密码</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.password}</td>
                    <td>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && <p>{error}</p>}
    </main>
  );
}

export default DbApp;
