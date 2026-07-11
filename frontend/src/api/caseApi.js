import apiClient from './apiClient'

export const caseApi = {
  fileCase: (caseData) =>
    apiClient.post('/cases', caseData),

  getCases: () =>
    apiClient.get('/cases'),

  getCaseById: (id) =>
    apiClient.get(`/cases/${id}`),

  updateCaseStatus: (id, status) =>
    apiClient.put(`/cases/${id}/status`, { status }),

  getCaseTimeline: (id) =>
    apiClient.get(`/cases/${id}/timeline`),
}

export default caseApi
