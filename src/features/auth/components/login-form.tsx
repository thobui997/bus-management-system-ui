import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '@app/context/auth-context';
import { Button, Form, Input } from 'antd';
import './login-form.scss';

const LoginForm = () => {
  const [form] = Form.useForm();
  const auth = useAuth();

  const handleLogin = () => {
    form.validateFields().then((values) => {
      auth.loginAction({ email: values.username, password: values.password });
    });
  };

  return (
    <div id='Login'>
      <div className='login-container'>
        <h2>Login</h2>

        <Form form={form} name='loginForm' layout='vertical' autoComplete='off'>
          <Form.Item label='Username' name='username' rules={[{ required: true, message: 'Username is required!' }]}>
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              size='large'
              placeholder='Enter username'
              allowClear
            />
          </Form.Item>

          <Form.Item label='Password' name='password' rules={[{ required: true, message: 'Password is required!' }]}>
            <Input.Password size='large' placeholder='Enter password' allowClear />
          </Form.Item>

          <Form.Item label={null}>
            <Button type='primary' size='large' htmlType='button' style={{ width: '100%' }} onClick={handleLogin}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
