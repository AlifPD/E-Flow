import React, { useState } from "react";
import { Form, Input, Button, Card } from "antd";
import axios from "axios";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", values);

      localStorage.setItem("roles", JSON.stringify(response.data.data.roles));
      localStorage.setItem("token", response.data.data.tokenStorage);

      Swal.fire("Success", "Login successful!", "success").then(() => {
        navigate("/");
      });
    } catch (error) {
      Swal.fire("Error", error.response?.data?.info || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="Login" className="w-96 shadow-lg">
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Employee ID / Email"
            name="identifier"
            rules={[{ required: true, message: "Please enter your Employee ID or Email!" }]}
          >
            <Input placeholder="Enter your ID or Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;