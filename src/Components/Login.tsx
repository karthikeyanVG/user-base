import React from 'react';
import { Form, Input, Button, Card, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login } from '../store/thunk/authThunks';
import { loginStyles } from '../Styles/Login.style';

interface LoginFormValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);

    const onFinish = async (values: LoginFormValues) => {
        try {
            await dispatch(login(values.email, values.password));
            message.success('Login successfull!');
            navigate('/users');
        } catch (error: any) {
            message.error(error.message || 'Login failed!');
        }
    };

    return (
        <div style={loginStyles.container}>
            <Card style={loginStyles.card}>
                <Form
                    name="login"
                    onFinish={onFinish}
                    style={loginStyles.form}
                    initialValues={{
                        email: 'eve.holt@reqres.in',
                        password: 'cityslicka'
                    }}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={loginStyles.button}
                            size="large"
                            loading={loading}
                        >
                            Log in
                        </Button>
                    </Form.Item>
                </Form>

            </Card>
        </div>
    );
};

export default Login;