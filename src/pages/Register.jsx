import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Form, Input, Select, Switch, Upload, Button, Card, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { Title } = Typography;
const { Option } = Select;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();

    const handleFileChange = ({ fileList }) => {
        setFileList(fileList.slice(-1));
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        const roleType = values.role_type_id ? 2 : 1;

        formData.append("fullname", values.fullname);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("phone", values.phone || "");
        formData.append("address", values.address || "");
        formData.append("department", values.department);
        formData.append("role_type_id", roleType);

        if (fileList.length > 0) {
            formData.append("profile_picture", fileList[0].originFileObj);
        }

        try {
            setLoading(true);
            await api.post("/auth/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            Swal.fire({
                title: "Success!",
                text: "Employee registered successfully!",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/");
                window.location.reload();
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Registration failed.",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <Card>
                <Title level={3}>Register Employee</Title>
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Full Name" name="fullname" rules={[{ required: true, message: "Full name is required" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Email" name="email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Enter a valid email" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Password" name="password" rules={[{ required: true, message: "Password is required" }]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item label="Phone" name="phone">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Address" name="address">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="Department" name="department"
                        rules={[{ required: true, message: "Select a department" }]}
                    >
                        <Select placeholder="Select Department">
                            {["IT", "HR", "ADMINISTRATION", "FINANCE", "PROCUREMENT"].map((dept) => (
                                <Option key={dept} value={dept}>{dept}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Role Type" name="role_type_id" valuePropName="checked">
                        <Switch checkedChildren="ADMIN" unCheckedChildren="EMPLOYEE" />
                    </Form.Item>

                    <Form.Item label="Profile Picture" name="profile_picture">
                        <Upload
                            beforeUpload={() => false}
                            fileList={fileList}
                            onChange={handleFileChange}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Register;