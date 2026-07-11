import apiClient from './apiClient'

export const aiApi = {
  classifyCase: (text) =>
    apiClient.post('/ai/classify', { text }),

  chat: (message, history = []) =>
    apiClient.post('/ai/chat', { message, history }),

  summarizeDocument: (text) =>
    apiClient.post('/ai/summarize', { text }),

  analyzeRisk: (description, documents = []) =>
    apiClient.post('/ai/risk-analysis', { description, documents }),
}

export default aiApi
