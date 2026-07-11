import apiClient from './apiClient'

export const courtApi = {
  getAllCourts: () =>
    apiClient.get('/courts'),

  getCourtById: (id) =>
    apiClient.get(`/courts/${id}`),
}

export default courtApi
