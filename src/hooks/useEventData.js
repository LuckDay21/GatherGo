import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export const useEventData = (eventId) => {
  const [event, setEvent] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [polls, setPolls] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!eventId) return

    const fetchData = async () => {
      setLoading(true)
      
      // Fetch event details
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()
      
      if (eventData) setEvent(eventData)

      // Fetch attendees
      const { data: attendeesData } = await supabase
        .from('attendees')
        .select('*')
        .eq('event_id', eventId)
      
      if (attendeesData) setAttendees(attendeesData)

      // Fetch polls with options and votes
      const { data: pollsData } = await supabase
        .from('polls')
        .select(`
          *,
          options:poll_options(*),
          votes:votes(*)
        `)
        .eq('event_id', eventId)
      
      if (pollsData) setPolls(pollsData)

      // Fetch expenses with shares
      const { data: expensesData } = await supabase
        .from('expenses')
        .select(`
          *,
          shares:expense_shares(*)
        `)
        .eq('event_id', eventId)
      
      if (expensesData) setExpenses(expensesData)

      setLoading(false)
    }

    fetchData()

    // Real-time subscriptions
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'attendees',
        filter: `event_id=eq.${eventId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') setAttendees(prev => [...prev, payload.new])
        else if (payload.eventType === 'UPDATE') setAttendees(prev => prev.map(a => a.id === payload.new.id ? payload.new : a))
        else if (payload.eventType === 'DELETE') setAttendees(prev => prev.filter(a => a.id !== payload.old.id))
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'polls',
        filter: `event_id=eq.${eventId}`
      }, () => fetchData()) // Refresh all for polls to get options/votes nested
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'votes'
      }, () => fetchData())
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'expenses',
        filter: `event_id=eq.${eventId}`
      }, () => fetchData())
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'expense_shares'
      }, () => fetchData())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId])

  return { event, attendees, polls, expenses, loading }
}
