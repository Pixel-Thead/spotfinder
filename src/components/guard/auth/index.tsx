import { usePathname, useRouter, Route } from 'expo-router';
import React, { useEffect, useMemo } from 'react';

import { SplashScreen } from '../../SplashScreen';

import { useAuth } from '~/src/hooks/auth/useAuth';
import { RoleT } from '~/src/types/auth/context';
import { logger } from '~/src/utils/logger';

// Define roles and route access
type RoleRoute = {
  url: Route;
  role: RoleT[];
  needAuth?: boolean;
};

const routeRoles: RoleRoute[] = [
  {
    url: '/pricing',
    role: ['SUPER_ADMIN', 'USER', 'PARTNER'],
    needAuth: true,
  },
  {
    url: '/account',
    role: ['SUPER_ADMIN', 'USER', 'PARTNER'],
    needAuth: true,
  },
  {
    url: '/account/partner',
    role: ['SUPER_ADMIN', 'PARTNER'],
    needAuth: true,
  },
  {
    url: '/account/partner/add-parking',
    role: ['SUPER_ADMIN', 'PARTNER'],
    needAuth: true,
  },
  {
    url: '/pricing',
    role: ['USER', 'PARTNER'],
    needAuth: true,
  },
  {
    url: '/',
    role: ['USER', 'PARTNER', 'SUPER_ADMIN'],
    needAuth: true,
  },
  {
    url: '/parking',
    role: ['USER', 'PARTNER', 'SUPER_ADMIN'],
    needAuth: true,
  },
];

const unauthOnlyPages: Route[] = ['/auth', '/auth/register'];

type Props = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: Props) => {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated: boolean = !!user;
  const userRole = useMemo(() => user?.role ?? 'USER', [user]);

  // Route access control
  useEffect(() => {
    if (isAuthLoading) return;
    const currentRoute = routeRoles.find((route) => {
      if (route.url === pathname) return true;
      if (route.url.endsWith('/*')) {
        const base = route.url.replace('/*', '');
        return pathname.startsWith(base);
      }
      return false;
    });

    if (currentRoute) {
      // If route needs auth and user isn't logged in
      if (currentRoute.needAuth && !isAuthenticated) {
        router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // If route doesn't need auth, skip role check
      if (!currentRoute.needAuth) return;

      // Role check for authenticated user
      if (isAuthenticated) {
        const hasRole = currentRoute.role.includes(userRole);
        logger.info({ 'Has Needed Role': hasRole });
        if (!hasRole) {
          router.replace('/');
        }
      }
    }
  }, [pathname, isAuthenticated, userRole, isAuthLoading]);

  // Prevent logged-in users from accessing guest-only pages
  useEffect(() => {
    if (isAuthLoading) return;
    if (isAuthenticated && unauthOnlyPages.includes(pathname as Route)) {
      router.replace('/');
    }
  }, [pathname, isAuthenticated, isAuthLoading]);

  if (isAuthLoading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};
