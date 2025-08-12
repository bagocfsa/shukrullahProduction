import React from 'react';
import { useNotification } from '../context/NotificationContext';
import CustomNotification from './CustomNotification';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="space-y-2 max-w-md w-full mx-4 pointer-events-auto">
        {notifications.map((notification) => (
          <CustomNotification
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;
