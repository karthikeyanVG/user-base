import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useAppDispatch } from '../store/hooks';
import { createUser, updateUser } from '../store/thunk/userThunk';
import type { User } from '../store/types';
import type { UploadFile } from 'antd/es/upload/interface';
import { modalStyles } from '../Styles/UaerModel.style';

interface UserModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user?: User | null;
    mode: 'create' | 'edit';
}

const UserModal: React.FC<UserModalProps> = ({
    visible,
    onClose,
    onSuccess,
    user,
    mode
}) => {
    const [form] = Form.useForm();
    const [, setFileList] = React.useState<UploadFile[]>([]);
    const [uploading,] = React.useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (visible) {
            if (mode === 'edit' && user) {
                form.setFieldsValue({
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    avatar: user.avatar,
                });

                if (user.avatar) {
                    setFileList([{
                        uid: '-1',
                        name: 'profile.jpg',
                        status: 'done',
                        url: user.avatar,
                    }]);
                }
            } else {
                form.resetFields();
                setFileList([]);
            }
        }
    }, [visible, user, mode, form]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        form.setFieldValue('avatar', url);
    };

    const handleSubmit = async (values: Omit<User, 'id'>) => {
        try {
            const userData = {
                ...values,
                avatar: values.avatar || 'https://reqres.in/img/faces/1-image.jpg',
            };

            if (mode === 'create') {
                await dispatch(createUser(userData));
                message.success('User created successfully!');
            } else if (mode === 'edit' && user?.id) {
                await dispatch(updateUser(user.id, userData));
                message.success('User updated successfully!');
            }

            onSuccess();
            onClose();
        } catch (error) {
            message.error(`Failed to ${mode === 'create' ? 'create' : 'update'} user.`);
        }
    };

    return (
        <Modal
            title={
                <div style={modalStyles.header}>
                    {mode === 'create' ? 'Create New User' : 'Edit User'}
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={520}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={modalStyles.body}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input placeholder="Enter email address" />
                </Form.Item>

                <Form.Item
                    label="First Name"
                    name="first_name"
                    rules={[{ required: true, message: 'Please input first name!' }]}
                >
                    <Input placeholder="Enter first name" />
                </Form.Item>

                <Form.Item
                    label="Last Name"
                    name="last_name"
                    rules={[{ required: true, message: 'Please input last name!' }]}
                >
                    <Input placeholder="Enter last name" />
                </Form.Item>

                <Form.Item
                    label="Profile Image URL"
                    name="avatar"

                >
                    <Input
                        placeholder="https://example.com/avatar.jpg"
                        onChange={handleAvatarChange}

                        allowClear
                    />
                </Form.Item>

                <Form.Item style={modalStyles.footer}>
                    <div style={modalStyles.formActions}>
                        <Button onClick={onClose} disabled={uploading}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={uploading}
                        >
                            {mode === 'create' ? 'Create User' : 'Update User'}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserModal;