import { theme } from '@app/config/theme';
import { validateMessages } from '@app/config/validate-message';
import AuthProvider from '@app/context/auth-context';
import NotificationProvider from '@app/context/notification-context';
import { queryConfig } from '@app/lib/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig
      })
  );

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary FallbackComponent={({ error }) => <div>Something went wrong: {error.message}</div>}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ConfigProvider theme={theme} componentSize='middle' form={{ validateMessages }}>
              <NotificationProvider>
                <AuthProvider>{children}</AuthProvider>
              </NotificationProvider>
            </ConfigProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
