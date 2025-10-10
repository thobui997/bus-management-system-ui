import { LockOutlined, MailOutlined } from '@ant-design/icons';
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
      {/* Left Side - Image & Branding */}
      <div className='login-left'>
        <div className='login-image-container'>
          <img src='https://illustrations.popsy.co/amber/remote-work.svg' alt='Bus Management System' />
          <div className='login-title'>
            <h1>FleetGo System</h1>
            <p>Manage your fleet with ease and efficiency</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className='login-right'>
        <div className='login-container'>
          <div className='login-header'>
            <div className='logo'>
              <div className='logo-image'>
                <img src='/images/bus.png' alt='logo' />
              </div>
              <div className='logo-text'>FleetGo</div>
            </div>
            <h2>Welcome Back</h2>
            <p>Please sign in to your account</p>
          </div>

          <Form form={form} name='loginForm' layout='vertical' autoComplete='off' onFinish={handleLogin}>
            <Form.Item label='Email' name='username' rules={[{ required: true, message: 'Email is required!' }]}>
              <Input
                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                size='large'
                placeholder='Enter your email'
                allowClear
              />
            </Form.Item>

            <Form.Item label='Password' name='password' rules={[{ required: true, message: 'Password is required!' }]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                size='large'
                placeholder='Enter your password'
                allowClear
              />
            </Form.Item>

            <Form.Item>
              <Button type='primary' size='large' htmlType='submit' style={{ width: '100%', marginTop: 16 }}>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className='login-footer'>
            <p>
              Don't have an account? <a href='#'>Contact Administrator</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
