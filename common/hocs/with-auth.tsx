"use client";
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';
import Routes from '../routes';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useLocalizedPath } from '@/hooks/common/useLocalizedPath';


type Props = Record<string, unknown>;

export enum AUTH_MODE {
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
}

interface WithAuthOptions {
  mode?: AUTH_MODE;
  redirectUrl?: string;
}

const withAuth = (Component: React.ComponentType<Props>, options: WithAuthOptions = {}):NextPage => {
  // create a new component that renders the original component with auth checking
  const WrappedComponent = (props: Props) => {
    const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';
    // State to manage redirection check
    const [isAllowed, setIsAllowed] = useState(false);
    const router = useRouter();
    const { user,isLoading, } = useAuth({autoFetch:true});
    const mode = options.mode ?? AUTH_MODE.LOGGED_IN;
    const {currentLocale} = useLocalizedPath();
    useEffect(() => {
      if(isLoading ) return;
      console.log({user})
      if (authEnabled) {
        if (mode === AUTH_MODE.LOGGED_IN && !user) {
          const url =options.redirectUrl ? "/" + currentLocale + options.redirectUrl : "/" + currentLocale + Routes.Auth.Login;
          router.replace(url);
        } else if (mode === AUTH_MODE.LOGGED_OUT && user) {
          const url =options.redirectUrl ? "/" + currentLocale + options.redirectUrl : "/" + currentLocale + Routes.Common.Home;
          router.replace(url);
        } else {
          setIsAllowed(true); // Allow rendering if no redirection is needed
        }
      } else {
        setIsAllowed(true); // If auth is disabled, allow rendering
      }
    }, [user, isLoading]);

    // Prevent rendering while redirecting
    if (!isAllowed) {
      return null;
    }
    return <Component {...(props as Props)} />;
  };

  // set the display name of the wrapped component for debugging purposes
  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default withAuth;
