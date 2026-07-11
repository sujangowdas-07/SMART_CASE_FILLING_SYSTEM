import apiClient from './apiClient'

export const lawyerApi = {
  searchLawyers: (params = {}) =>
    apiClient.get('/lawyers', { params }),

  getLawyerById: (id) =>
    apiClient.get(`/lawyers/${id}`),

  requestLawyer: (lawyerId, caseId) =>
    apiClient.post(`/lawyers/${lawyerId}/request`, { caseId }),

  respondToRequest: (requestId, response) =>
    apiClient.put(`/lawyers/requests/${requestId}/respond`, { response }),

  getPendingRequests: () =>
    apiClient.get('/lawyers/requests/pending'),
}

export default lawyerApi
