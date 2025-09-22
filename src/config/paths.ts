export const paths = {
  auth: {
    login: {
      path: '/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`
    }
  },

  app: {
    dashboard: {
      path: '/dashboard'
    }
  }
} as const;
