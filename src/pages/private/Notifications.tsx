import React from 'react'
import NotificationsLoader from '../../components/Notifications/NotificationsLoader'
import { getNotifications } from '../../services/notificationService';
import { useEffect, useState } from 'react';
import { useNotificationScan } from '../../hooks/useNotificationScan';

const Notifications = () => {

  return (
    <div>
      <NotificationsLoader/>
    </div>
  )
}

export default Notifications
