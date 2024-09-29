import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/auth.context';
import { Table, Button, Typography, message, Popconfirm } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title } = Typography;

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoggedIn } = useContext(AuthContext);
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        message.error('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchUsers();
    } else {
      message.error('Access denied. Admins only.');
    }
  }, [isAdmin]);

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/admin/users/${userId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      message.success('User deleted successfully.');
    } catch (error) {
      message.error('Failed to delete the user. Please try again.');
    }
  };

  if (!isLoggedIn || !isAdmin) {
    return <Typography.Paragraph>Access denied. Admins only.</Typography.Paragraph>;
  }

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => <Typography.Text>{text} ({record.email})</Typography.Text>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin) => (isAdmin ? 'Admin' : 'User'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this user?"
          onConfirm={() => handleDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger">Delete User</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="AdminUserManagement" style={{ padding: '20px', width: '100vw', backgroundColor: 'white', height: '100vh', paddingTop: '50px' }}>
      <Title level={2}>User Management</Title>

      <Table
        dataSource={users}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
}

export default UserManagement;
