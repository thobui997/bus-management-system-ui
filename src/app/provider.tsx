import { theme } from '@app/config/theme';
import { validateMessages } from '@app/config/validate-message';
import AuthProvider from '@app/context/auth-context';
import NotificationProvider from '@app/context/notification-context';
import { ConfigProvider } from 'antd';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary FallbackComponent={({ error }) => <div>Something went wrong: {error.message}</div>}>
        <BrowserRouter>
          <ConfigProvider theme={theme} componentSize='middle' form={{ validateMessages }}>
            <NotificationProvider>
              <AuthProvider>{children}</AuthProvider>
            </NotificationProvider>
          </ConfigProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.Suspense>
  );
};
