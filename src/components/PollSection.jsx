import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import { BarChart3, Plus, Trash2, Loader2 } from 'lucide-react'

const PollSection = ({ eventId, polls, attendees }) => {
  const [showAddPoll, setShowAddPoll] = useState(false)
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] })
  const [loading, setLoading] = useState(false)

  const handleAddOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })
  }

  const handleCreatePoll = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert([{ event_id: eventId, question: newPoll.question }])
        .select()
        .single()

      if (pollError) throw pollError

      const optionsToInsert = newPoll.options
        .filter(opt => opt.trim() !== '')
        .map(opt => ({ poll_id: poll.id, option_text: opt }))

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert)

      if (optionsError) throw optionsError

      setNewPoll({ question: '', options: ['', ''] })
      setShowAddPoll(false)
    } catch (error) {
      console.error('Error creating poll:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (pollId, optionId) => {
    // For simplicity in this demo, we'll ask for name to find attendee_id 
    // or just use a random attendee from the list if available
    if (attendees.length === 0) return alert('At least one person must RSVP first to vote!')
    
    // In a real app, we'd have the current user's attendee ID
    const attendeeId = attendees[0].id // Default to first attendee for demo

    try {
      const { error } = await supabase
        .from('votes')
        .insert([{ poll_id: pollId, option_id: optionId, attendee_id: attendeeId }])

      if (error) throw error
    } catch (error) {
      console.error('Error voting:', error.message)
      alert('You might have already voted or something went wrong.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 size={20} className="text-indigo-400" /> Live Polls
        </h2>
        <button 
          onClick={() => setShowAddPoll(!showAddPoll)}
          className="p-2 hover:bg-slate-900 border border-slate-800 rounded-lg transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {showAddPoll && (
        <form onSubmit={handleCreatePoll} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <input
            required
            value={newPoll.question}
            onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
            placeholder="What's the question?"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          {newPoll.options.map((opt, i) => (
            <input
              key={i}
              required
              value={opt}
              onChange={(e) => {
                const newOptions = [...newPoll.options]
                newOptions[i] = e.target.value
                setNewPoll({ ...newPoll, options: newOptions })
              }}
              placeholder={`Option ${i + 1}`}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
            />
          ))}
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={handleAddOption}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              + Add Option
            </button>
          </div>
          <button
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition-all"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Create Poll'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {polls.map((poll) => (
          <div key={poll.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-medium text-slate-200">{poll.question}</h3>
            <div className="space-y-3">
              {poll.options?.map((opt) => {
                const voteCount = poll.votes?.filter(v => v.option_id === opt.id).length || 0
                const totalVotes = poll.votes?.length || 0
                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleVote(poll.id, opt.id)}
                    className="w-full text-left group relative overflow-hidden"
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{opt.option_text}</span>
                      <span className="text-indigo-400 font-bold">{voteCount}</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {polls.length === 0 && !showAddPoll && (
          <div className="md:col-span-2 py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No polls yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  )
}

export default PollSection
