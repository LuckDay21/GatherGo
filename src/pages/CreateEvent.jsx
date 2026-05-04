import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { Calendar, MapPin, AlignLeft, Send, Loader2 } from 'lucide-react'

const CreateEvent = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([formData])
        .select()
        .single()

      if (error) throw error
      
      if (data) {
        navigate(`/event/${data.id}`)
      }
    } catch (error) {
      console.error('Error creating event:', error.message)
      alert('Failed to create event. Make sure you have setup Supabase tables correctly.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 lg:py-20">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <p className="text-slate-400">Set the stage for your next gathering.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Event Title</label>
          <input
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Weekend Beach Trip"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                required
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Time</label>
            <input
              type="time"
              name="event_time"
              value={formData.event_time}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Where is it happening?"
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Description</label>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 text-slate-500" size={18} />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="What's the plan?"
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
            />
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Create Event</>}
        </button>
      </form>
    </div>
  )
}

export default CreateEvent
