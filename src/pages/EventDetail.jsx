import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEventData } from '../hooks/useEventData'
import RSVPSection from '../components/RSVPSection'
import PollSection from '../components/PollSection'
import SplitBillSection from '../components/SplitBillSection'
import { Calendar, MapPin, Share2, ChevronLeft, Loader2 } from 'lucide-react'

const EventDetail = () => {
  const { id } = useParams()
  const { event, attendees, polls, expenses, loading } = useEventData(id)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Link to="/" className="text-indigo-400 hover:underline">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
        <ChevronLeft size={20} /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Event Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-indigo-400" />
                <span>{new Date(event.event_date).toLocaleDateString()} at {event.event_time?.slice(0, 5) || 'TBA'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-indigo-400" />
                <span>{event.location || 'No location set'}</span>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed">
              {event.description || 'No description provided.'}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={handleShare}
              className="px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <Share2 size={18} /> Invite Friends
            </button>
          </div>

          {/* RSVP (Mobile) */}
          <div className="lg:hidden">
            <RSVPSection eventId={event.id} attendees={attendees} />
          </div>

          {/* Polling */}
          <div id="polls">
            <PollSection eventId={event.id} polls={polls} attendees={attendees} />
          </div>

          {/* Split Bill */}
          <div id="split-bill">
            <SplitBillSection eventId={event.id} attendees={attendees} expenses={expenses} />
          </div>
        </div>

        {/* Right Column: RSVP (Desktop) */}
        <div className="hidden lg:block space-y-8">
          <RSVPSection eventId={event.id} attendees={attendees} />
        </div>
      </div>
    </div>
  )
}

export default EventDetail
