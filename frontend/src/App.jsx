import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  function fetchNotes() {
    axios.get(`${API_URL}/api/notes`)
      .then(res => setNotes(res.data))
      .catch(err => console.error(err))
  }

  function handleCreate(e) {
    e.preventDefault()
    if (!title || !body) return

    axios.post(`${API_URL}/api/notes`, { title, body })
      .then(res => {
        setNotes([res.data, ...notes])
        setTitle('')
        setBody('')
        setShowForm(false)
      })
      .catch(err => console.error(err))
  }

  function handleDelete(id) {
    axios.delete(`${API_URL}/api/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(note => note._id !== id))
        if (selectedNote && selectedNote._id === id) {
          setSelectedNote(null)
        }
      })
      .catch(err => console.error(err))
  }

  return (
    <div className="container">
      <h1>My Notes</h1>

      <button className="btn-add" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Note'}
      </button>

      {showForm && (
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your note..."
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={4}
          />
          <button type="submit">Save</button>
        </form>
      )}

      {notes.length === 0 && <p>No notes yet.</p>}

      <div className="notes-list">
        {notes.map(note => (
          <div key={note._id} className="note-card">
            <h3 onClick={() => setSelectedNote(note)}>{note.title}</h3>
            <p>{note.body.substring(0, 80)}...</p>
            <button onClick={() => handleDelete(note._id)}>Delete</button>
          </div>
        ))}
      </div>

      {selectedNote && (
        <div className="note-detail">
          <h2>{selectedNote.title}</h2>
          <p>{selectedNote.body}</p>
          <button onClick={() => setSelectedNote(null)}>Close</button>
        </div>
      )}
    </div>
  )
}

export default App