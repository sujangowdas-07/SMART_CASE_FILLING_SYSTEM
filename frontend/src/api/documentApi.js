import apiClient from './apiClient'

export const documentApi = {
  upload: (caseId, file, category) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('caseId', caseId)
    if (category) formData.append('category', category)
    return apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getDocumentsByCase: (caseId) =>
    apiClient.get(`/documents/case/${caseId}`),

  verifyDocument: (docId, status) =>
    apiClient.put(`/documents/${docId}/verify`, { status }),

  downloadDocument: (docId) =>
    apiClient.get(`/documents/${docId}/download`, { responseType: 'blob' }),
}

export default documentApi
