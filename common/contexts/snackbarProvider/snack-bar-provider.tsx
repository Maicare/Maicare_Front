import React, { useRef } from 'react';
import { SnackbarProvider as NotistackProvider, SnackbarKey } from 'notistack';
import './SnackbarProvider.css'; // Custom CSS for styling

type Props = {
  children: React.ReactNode;
};

const SnackbarProvider = ({ children }: Props) => {
  const notistackRef = useRef<any>(null);

  const onClose = (key: SnackbarKey) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <>
      <NotistackProvider
        ref={notistackRef}
        dense
        maxSnack={5}
        preventDuplicate
        autoHideDuration={3000}
        variant="success"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        iconVariant={{
          info: <SnackbarIcon icon="ℹ️" color="info" />,
          success: <SnackbarIcon icon="✔️" color="success" />,
          warning: <SnackbarIcon icon="⚠️" color="warning" />,
          error: <SnackbarIcon icon="❌" color="error" />,
        }}
        action={(key) => <CloseButton onClick={onClose(key)} />}
      >
        {children}
      </NotistackProvider>
    </>
  );
};

const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="snackbar-close-btn" onClick={onClick}>
      ✖️
    </button>
  );
};

type SnackbarIconProps = {
  icon: React.ReactNode;
  color: 'info' | 'success' | 'warning' | 'error';
};

const SnackbarIcon = ({ icon, color }: SnackbarIconProps) => {
  return (
    <span className={`snackbar-icon snackbar-icon-${color}`}>
      {icon}
    </span>
  );
};

export default SnackbarProvider;
