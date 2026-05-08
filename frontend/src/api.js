import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

export const getNotes  = () => api.get('/api/notes').then(r => r.data)
export const createNote = (d) => api.post('/api/notes', d).then(r => r.data)
export const deleteNote = (id) => api.delete(`/api/notes/${id}`).then(r => r.data)
