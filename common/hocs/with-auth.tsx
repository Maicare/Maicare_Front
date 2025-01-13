"use client";
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';
import Routes from '../routes';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';


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
    const { user,isLoading } = useAuth();
    const mode = options.mode ?? AUTH_MODE.LOGGED_IN;
    useEffect(() => {
      if(isLoading ) return;
      if (authEnabled) {
        if (mode === AUTH_MODE.LOGGED_IN && !user) {
          router.push(options.redirectUrl ?? Routes.Auth.Login);
        } else if (mode === AUTH_MODE.LOGGED_OUT && user) {
          router.push(options.redirectUrl ?? Routes.Common.Home);
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
