import { useNotification } from '@app/context/notification-context';
import useLocalStorage from '@app/hooks/use-local-storage';
import { login } from '@app/shared/api';
import { AuthInfo } from '@app/shared/types';
import { User } from '@app/shared/types/user.type';
import React, { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

interface AuthContextType {
  authInfo: AuthInfo | null;
  loginAction: (payload: { email: string; password: string }) => void;
  userInfo: User | null;
}

const AuthContext = React.createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [initialAuthInfo, setStoredValue] = useLocalStorage<AuthInfo | null>('authInfo', null);
  const [initialUserInfo, setStoredUser] = useLocalStorage<User | null>('user', null);
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(initialAuthInfo);
  const [userInfo, setUserInfo] = useState<User | null>(initialUserInfo);
  const notification = useNotification();

  const loginAction = async (payload: { email: string; password: string }) => {
    try {
      const response = await login(payload.email, payload.password);
      // setStoredValue(response.data);
      // setAuthInfo(response);

      // const userInfo = await getCurrentUser();
      // setUserInfo(userInfo?.result || null);
      // setStoredUser(userInfo?.result);

      const redirectTo = searchParams.get('redirectTo') || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      notification.showNotification('error', 'Đăng nhập thất bại', 'Email hoặc mật khẩu không đúng');
    }
  };

  // const refreshUserInfo = async () => {
  //   try {
  //     const userInfo = await getCurrentUser();
  //     setUserInfo(userInfo?.result || null);
  //     setStoredUser(userInfo?.result);
  //   } catch (error) {
  //     console.error('Failed to refresh user info:', error);
  //   }
  // };

  return <AuthContext.Provider value={{ authInfo, loginAction, userInfo }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
