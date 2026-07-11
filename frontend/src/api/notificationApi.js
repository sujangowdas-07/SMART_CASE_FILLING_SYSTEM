import apiClient from './apiClient'

export const notificationApi = {
  getNotifications: () =>
    apiClient.get('/notifications'),

  markAsRead: (id) =>
    apiClient.put(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.put('/notifications/read-all'),

  getUnreadCount: () =>
    apiClient.get('/notifications/unread-count'),
}

export default notificationApi
