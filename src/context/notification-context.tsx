import { notification } from 'antd';
import React, { createContext, useCallback, useContext } from 'react';

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string, description?: string) => void;
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const NotificationContext = createContext<NotificationContextType>(null!);

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  const showNotification = useCallback(
    (type: NotificationType, message: string, description?: string) => {
      api[type]({
        message,
        description
      });
    },
    [api]
  );

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

export default NotificationProvider;
