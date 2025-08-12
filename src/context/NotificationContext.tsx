import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NotificationData, NotificationType } from '../components/CustomNotification';

interface NotificationContextType {
  notifications: NotificationData[];
  showNotification: (
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      duration?: number;
      actions?: Array<{
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary';
      }>;
    }
  ) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const generateId = () => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      duration?: number;
      actions?: Array<{
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary';
      }>;
    }
  ) => {
    const notification: NotificationData = {
      id: generateId(),
      type,
      title,
      message,
      duration: options?.duration ?? (type === 'error' ? 0 : 5000), // Errors don't auto-dismiss
      actions: options?.actions,
    };

    setNotifications(prev => [...prev, notification]);
  };

  const showSuccess = (title: string, message: string, duration: number = 4000) => {
    showNotification('success', title, message, { duration });
  };

  const showError = (title: string, message: string, duration: number = 0) => {
    showNotification('error', title, message, { duration });
  };

  const showWarning = (title: string, message: string, duration: number = 6000) => {
    showNotification('warning', title, message, { duration });
  };

  const showInfo = (title: string, message: string, duration: number = 5000) => {
    showNotification('info', title, message, { duration });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
