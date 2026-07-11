import apiClient from './apiClient'

export const hearingApi = {
  scheduleHearing: (hearingData) =>
    apiClient.post('/hearings', hearingData),

  updateHearing: (id, updates) =>
    apiClient.put(`/hearings/${id}`, updates),

  getHearingsByJudge: (judgeId) =>
    apiClient.get(`/hearings/judge/${judgeId}`),

  getHearingsByCase: (caseId) =>
    apiClient.get(`/hearings/case/${caseId}`),
}

export default hearingApi
