import apiClient from './apiClient'

export const messageApi = {
  sendMessage: (receiverId, content, caseId) =>
    apiClient.post('/messages', { receiverId, content, caseId }),

  getMessagesByCase: (caseId) =>
    apiClient.get(`/messages/${caseId}`),

  getConversations: () =>
    apiClient.get('/messages/conversations'),
}

export default messageApi
