import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import { UserPlus, Check, X, Clock } from 'lucide-react'

const RSVPSection = ({ eventId, attendees }) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRSVP = async (status) => {
    if (!name.trim()) return alert('Please enter your name first.')
    setLoading(true)

    try {
      const { error } = await supabase
        .from('attendees')
        .insert([{ event_id: eventId, name, status }])

      if (error) throw error
      setName('')
    } catch (error) {
      console.error('Error RSVPing:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Attending': return <Check size={14} className="text-emerald-400" />
      case 'Not Attending': return <X size={14} className="text-rose-400" />
      default: return <Clock size={14} className="text-amber-400" />
    }
  }

  return (
    <div className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <UserPlus size={20} className="text-indigo-400" /> RSVP
        </h2>
        <span className="text-sm text-slate-400">{attendees.length} people responded</span>
      </div>

      <div className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
        />
        
        <div className="grid grid-cols-3 gap-2">
          {['Attending', 'Not Attending', 'Undecided'].map((status) => (
            <button
              key={status}
              onClick={() => handleRSVP(status)}
              disabled={loading}
              className={`py-2 px-1 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
                status === 'Attending' ? 'border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400' :
                status === 'Not Attending' ? 'border-rose-500/20 hover:bg-rose-500/10 text-rose-400' :
                'border-slate-700 hover:bg-slate-800 text-slate-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-800">
        {attendees.map((a) => (
          <div key={a.id} className="flex items-center justify-between py-1">
            <span className="text-slate-300">{a.name}</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
              {getStatusIcon(a.status)}
              <span className="text-xs font-medium text-slate-400">{a.status}</span>
            </div>
          </div>
        ))}
        {attendees.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-4">No responses yet. Be the first!</p>
        )}
      </div>
    </div>
  )
}

export default RSVPSection
