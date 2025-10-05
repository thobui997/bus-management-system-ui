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
    },
    vehicleManagement: {
      path: '/vehicle-management',
      vehicleFleet: {
        path: '/vehicle-management/fleet'
      },
      vehicleTypes: {
        path: '/vehicle-management/vehicle-types'
      }
    },
    station: {
      path: '/station-management'
    }
  }
} as const;
