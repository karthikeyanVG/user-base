import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Avatar, message, Card, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  TableOutlined,
  AppstoreOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUsers, deleteUser } from "../store/thunk/userThunk";
import  { setCurrentPage } from "../store/slice/userSlice";
import UserModal from "./UserModel";
import type { User } from "../store/types";
import { buttonGroupStyles, cardButtonStyles, cardContentStyles, cardEmailStyles, cardGridStyles, cardStyles, cardTitleStyles, containerStyles, contentStyles, emailLinkStyles, headerStyles, paginationStyles, searchInputStyles } from "../Styles/UserList.style";
import { logout } from "../store/slice/authSlice";
import { useNavigate } from 'react-router-dom';


const UsersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error, currentPage, totalUsers } = useAppSelector((state) => state.users);
  
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers(currentPage, 5));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleCreateUser = () => {
    setModalMode('create');
    setEditingUser(null);
    setModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    setModalMode('edit');
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleDeleteUser = (user: User) => {
    Modal.confirm({
      title: 'Delete User',
      content: `Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await dispatch(deleteUser(user.id));
          message.success('User deleted successfully!');
        } catch (error) {
          message.error('Failed to delete user.');
        }
      },
    });
  };

  const handleModalSuccess = () => {
    // dispatch(fetchUsers(currentPage, 5)); // Refresh the list
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const columns: ColumnsType<User> = [
     {
      title: "",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => <Avatar size={45} src={avatar} />,
      width: "5%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <a href={`mailto:${text}`} style={emailLinkStyles}>
          {text}
        </a>
      ),
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Edit
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );


  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div style={containerStyles}>
      <div style={contentStyles}>
        <div style={headerStyles}>
          <div style={buttonGroupStyles}>
            <Button
              type={viewMode === "table" ? "primary" : "default"}
              icon={<TableOutlined />}
              onClick={() => setViewMode("table")}
            >
              Table
            </Button>
            <Button
              type={viewMode === "card" ? "primary" : "default"}
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode("card")}
            >
              Card
            </Button>

            <Button
              onClick={() =>{ dispatch(logout()) 
                navigate('/login')}
              }
              type="dashed"
              danger
            >
              Logout
            </Button>
          </div>

          <div style={buttonGroupStyles}>
            <Input
              placeholder="Input search text"
              prefix={<SearchOutlined />}
              style={searchInputStyles}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button 
              type="primary" 
              icon={<UserAddOutlined />}
              onClick={handleCreateUser}
            >
              Create User
            </Button>
          </div>
        </div>

        {viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={filteredUsers}
            loading={loading}
            pagination={{
              current: currentPage,
              total: totalUsers,
              pageSize: 5,
              onChange: handlePageChange,
              showSizeChanger: false,
            }}
            rowKey="id"
          />
        ) : (
          <div>
            <div style={cardGridStyles}>
              {paginatedUsers.map((user) => (
                <Card key={user.id} style={cardStyles}>
                  <div style={cardContentStyles}>
                    <Avatar src={user.avatar} size={70} />
                    <h3 style={cardTitleStyles}>
                      {user.first_name} {user.last_name}
                    </h3>
                    <p style={cardEmailStyles}>{user.email}</p>
                    <Space style={cardButtonStyles}>
                      <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </Button>
                      <Button 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteUser(user)}
                      >
                        Delete
                      </Button>
                    </Space>
                  </div>
                </Card>
              ))}
            </div>
            
            <div style={paginationStyles}>
              <Space>
                <Button 
                  disabled={currentPage === 1} 
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <span>Page {currentPage} of {Math.ceil(filteredUsers.length / itemsPerPage)}</span>
                <Button 
                  disabled={endIndex >= filteredUsers.length} 
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </Space>
            </div>
          </div>
        )}

        <UserModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSuccess={handleModalSuccess}
          user={editingUser}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default UsersList;