import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { clearAuth } from "../utils/auth";
import { Table, Button, Card, Typography, Space, message, Modal, Upload, Input, DatePicker, Form } from "antd";
import { LogoutOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const { Title, Text } = Typography;

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [latestAttendance, setLatestAttendance] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);

    const [filterEmployeeId, setFilterEmployeeId] = useState("");
    const [filterStartDate, setFilterStartDate] = useState(dayjs().startOf("week"));
    const [filterEndDate, setFilterEndDate] = useState(dayjs());

    const isAdminView = JSON.parse(localStorage.getItem("roles"))?.includes("ADMIN");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm] = Form.useForm();

    const fetchAttendanceRecords = async () => {
        setLoading(true);
        try {
            const response = await api.get("/attendance", {
                params: {
                    employee_id: filterEmployeeId,
                    start_date: filterStartDate.format("YYYY-MM-DD"),
                    end_date: filterEndDate.format("YYYY-MM-DD"),
                    isAdminView,
                    page: currentPage,
                    limit: 10,
                },
            });
            setAttendance(response.data.data.data || []);
            setTotalRecords(response.data.data.total || 0);
        } catch (error) {
            message.error("Failed to fetch attendance records.");
        }
        setLoading(false);
    };


    useEffect(() => {
        (async () => {
            try {
                const [userRes, latestAttRes] = await Promise.all([
                    api.get("/users/detail"),
                    api.get("/attendance/latest")
                ]);
                fetchAttendanceRecords()
                setUser(userRes.data.data)
                setLatestAttendance(latestAttRes.data.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    message.error("Session expired, please log in again.");
                    clearAuth();
                } else {
                    message.error("Failed to fetch data. Please try again later.");
                }
            }
        })();
    }, [currentPage]);

    // Handle file upload
    const handleFileChange = ({ fileList }) => {
        if (fileList.length > 0) {
            setFile(fileList[0].originFileObj);
            console.log("File set:", fileList[0].originFileObj);
        } else {
            setFile(null);
            console.log("No file selected.");
        }
    };

    const handleSubmitAttendance = async () => {
        if (!file) {
            message.error("Please select an image file.");
            return;
        }

        const formData = new FormData();
        formData.append("datetime", dayjs().toISOString());
        formData.append("evidence", file);

        try {
            const response = await api.post("/attendance", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("API Response:", response.data);
            message.success("Attendance submitted successfully!");
            setIsModalOpen(false);
            setFile(null);

            window.location.reload();
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            message.error("Failed to submit attendance.");
        }
    };

    const handleEditUser = () => {
        editForm.setFieldsValue(user);
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async () => {
        try {
            const values = await editForm.validateFields();
            await api.put(`/users/${user.employee_id}`, values);
            setIsEditModalOpen(false);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "User updated successfully!",
            }).then(() => {
                window.location.reload();
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update user",
            });
        }
    };



    return (
        <div style={{ padding: 20 }}>
            {user && (
                <Card style={{ marginBottom: 20 }}>
                    <Title level={4}>Welcome, {user.fullname}</Title>
                    <Text>Email: {user.email}</Text><br />
                    <Text>Department: {user.department}</Text><br />
                    <Text>employee_id: {user.employee_id}</Text><br />
                    <Text>fullname: {user.fullname}</Text><br />
                    <Text>phone: {user.phone}</Text><br />
                    <Text>address: {user.address}</Text><br />
                    <img src={user.profile_picture} alt="Profile Picture" width="200" /><br />
                    {isAdminView && <Button type="primary" onClick={handleEditUser}>Edit</Button>}
                </Card>
            )}

            <Modal
                title="Edit User"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={handleUpdateUser}
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item label="Employee ID" name="employee_id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Full Name" name="fullname" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Department" name="department">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Phone" name="phone">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Address" name="address">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {latestAttendance && (
                <Card style={{ marginBottom: 20 }}>
                    <Title level={4}>Latest Attendance</Title>
                    <Text>Clock In: {latestAttendance.clock_in || "-"}</Text><br />
                    <div>
                        <Text>Evidence Clock In:</Text><br />
                        <img src={latestAttendance.evidence_clock_in} alt="Clock In Evidence" width="200" /><br />
                    </div>
                    <Text>Clock Out: {latestAttendance.clock_out || "-"}</Text><br />
                    <div>
                        <Text>Evidence Clock Out:</Text><br />
                        <img src={latestAttendance.evidence_clock_out} alt="Clock Out Evidence" width="200" />
                    </div>

                    <Button type="primary" onClick={() => setIsModalOpen(true)}>
                        Submit Attendance
                    </Button>

                    <Modal
                        title="Submit Attendance"
                        open={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        onOk={handleSubmitAttendance}
                        okText="Submit"
                    >
                        <Upload beforeUpload={() => false} onChange={handleFileChange} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select Image</Button>
                        </Upload>
                        {file && <Text>{file.name}</Text>}
                    </Modal>
                </Card>
            )}

            <Card style={{ marginBottom: 20 }}>
                <Title level={4}>Attendance Records</Title>
                <Space style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Employee ID"
                        value={filterEmployeeId}
                        onChange={(e) => setFilterEmployeeId(e.target.value)}
                        style={{ width: 200 }}
                        allowClear
                    />
                    <DatePicker
                        placeholder="Start Date"
                        value={filterStartDate}
                        onChange={(date) => setFilterStartDate(date)}
                        allowClear={false}
                    />
                    <DatePicker
                        placeholder="End Date"
                        value={filterEndDate}
                        onChange={(date) => setFilterEndDate(date)}
                        allowClear={false}
                    />
                    <Button type="primary" onClick={fetchAttendanceRecords}>
                        Filter
                    </Button>
                </Space>
                <Table
                    dataSource={attendance}
                    rowKey="id"
                    loading={loading}
                    columns={[
                        { title: "Employee ID", dataIndex: ["User", "employee_id"], key: "employee_id" },
                        { title: "Full Name", dataIndex: ["User", "fullname"], key: "fullname" },
                        { title: "Clock In", dataIndex: "clock_in", key: "clock_in" },
                        { title: "Clock Out", dataIndex: "clock_out", key: "clock_out" },
                    ]}
                    pagination={{
                        current: currentPage,
                        total: totalRecords,
                        pageSize: 10,
                        onChange: (page) => setCurrentPage(page),
                    }}
                />
            </Card>

            <Space>
                {isAdminView && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/register")}>
                        Register Employee
                    </Button>
                )}

                <Button type="primary" danger icon={<LogoutOutlined />} onClick={clearAuth}>
                    Logout
                </Button>
            </Space>
        </div>
    );
};

export default Dashboard;