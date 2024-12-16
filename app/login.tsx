import { Form, Input, Button, message } from "antd";
import Database from "@tauri-apps/plugin-sql";

export default function Login() {
  const handleSubmit = async (values: any) => {
    // 这里可以添加调用登录接口的逻辑
    const db = await Database.load("sqlite:test.db");

    await db.execute(
      "INSERT INTO users (username, password, status) VALUES ($1, $2, $3)",
      [values.username, values.password, "isTokerSuccess"]
    );
    message.success("登陆成功");
  };

  return (
    <div>
      <Form onFinish={handleSubmit}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
