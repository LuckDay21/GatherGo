import React, { useState, useMemo } from 'react'
import { supabase } from '../utils/supabase'
import { Receipt, Plus, Users, Calculator, Loader2 } from 'lucide-react'

const SplitBillSection = ({ eventId, attendees, expenses }) => {
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newExpense, setNewExpense] = useState({
    description: '',
    total_amount: '',
    paid_by: '',
    participants: []
  })

  // Calculate balances: who owes who
  const settlements = useMemo(() => {
    const balances = {}
    attendees.forEach(a => balances[a.id] = 0)

    expenses.forEach(exp => {
      const amount = parseFloat(exp.total_amount)
      balances[exp.paid_by] += amount

      const shares = exp.shares || []
      shares.forEach(share => {
        balances[share.attendee_id] -= parseFloat(share.amount_owed)
      })
    })

    const creditors = []
    const debtors = []

    Object.entries(balances).forEach(([id, balance]) => {
      const attendee = attendees.find(a => a.id === id)
      if (!attendee) return
      if (balance > 0.01) creditors.push({ id, name: attendee.name, balance })
      else if (balance < -0.01) debtors.push({ id, name: attendee.name, balance: Math.abs(balance) })
    })

    const results = []
    let i = 0, j = 0
    while (i < creditors.length && j < debtors.length) {
      const pay = Math.min(creditors[i].balance, debtors[j].balance)
      results.push({
        from: debtors[j].name,
        to: creditors[i].name,
        amount: pay.toFixed(2)
      })
      creditors[i].balance -= pay
      debtors[j].balance -= pay
      if (creditors[i].balance < 0.01) i++
      if (debtors[j].balance < 0.01) j++
    }

    return results
  }, [attendees, expenses])

  const handleCreateExpense = async (e) => {
    e.preventDefault()
    if (!newExpense.paid_by || newExpense.participants.length === 0) {
      return alert('Please select who paid and who is sharing the expense.')
    }
    setLoading(true)

    try {
      const { data: exp, error: expError } = await supabase
        .from('expenses')
        .insert([{
          event_id: eventId,
          description: newExpense.description,
          total_amount: parseFloat(newExpense.total_amount),
          paid_by: newExpense.paid_by
        }])
        .select()
        .single()

      if (expError) throw expError

      const shareAmount = parseFloat(newExpense.total_amount) / newExpense.participants.length
      const sharesToInsert = newExpense.participants.map(aid => ({
        expense_id: exp.id,
        attendee_id: aid,
        amount_owed: shareAmount
      }))

      const { error: sharesError } = await supabase
        .from('expense_shares')
        .insert(sharesToInsert)

      if (sharesError) throw sharesError

      setNewExpense({ description: '', total_amount: '', paid_by: '', participants: [] })
      setShowAddExpense(false)
    } catch (error) {
      console.error('Error creating expense:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleParticipant = (id) => {
    setNewExpense(prev => ({
      ...prev,
      participants: prev.participants.includes(id) 
        ? prev.participants.filter(p => p !== id) 
        : [...prev.participants, id]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Receipt size={20} className="text-indigo-400" /> Split Bill
        </h2>
        <button 
          onClick={() => setShowAddExpense(!showAddExpense)}
          className="p-2 hover:bg-slate-900 border border-slate-800 rounded-lg transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {showAddExpense && (
        <form onSubmit={handleCreateExpense} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <input
            required
            placeholder="Expense description (e.g. Pizza)"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <input
            required
            type="number"
            step="0.01"
            placeholder="Total Amount"
            value={newExpense.total_amount}
            onChange={(e) => setNewExpense({ ...newExpense, total_amount: e.target.value })}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Who paid?</label>
            <select 
              required
              value={newExpense.paid_by}
              onChange={(e) => setNewExpense({ ...newExpense, paid_by: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none text-sm"
            >
              <option value="">Select person</option>
              {attendees.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Split among whom?</label>
            <div className="grid grid-cols-2 gap-2">
              {attendees.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleParticipant(a.id)}
                  className={`px-3 py-2 rounded-lg border text-xs transition-all ${
                    newExpense.participants.includes(a.id) 
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                    : 'border-slate-800 bg-slate-950 text-slate-500'
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition-all"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Add Expense'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Calculator size={14} /> Expenses
          </h3>
          <div className="space-y-3">
            {expenses.map((exp) => (
              <div key={exp.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{exp.description}</h4>
                  <p className="text-xs text-slate-500">Paid by {attendees.find(a => a.id === exp.paid_by)?.name}</p>
                </div>
                <div className="text-indigo-400 font-bold">${parseFloat(exp.total_amount).toFixed(2)}</div>
              </div>
            ))}
            {expenses.length === 0 && <p className="text-slate-600 text-sm italic">No expenses yet.</p>}
          </div>
        </div>

        {/* Settlements */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Users size={14} /> Settlements
          </h3>
          <div className="space-y-3">
            {settlements.map((s, i) => (
              <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-between group">
                <span className="text-slate-300 font-medium">{s.from}</span>
                <div className="flex-1 flex items-center justify-center gap-2 px-4">
                  <div className="h-[1px] flex-1 bg-slate-800" />
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">pays ${s.amount} to</span>
                  <div className="h-[1px] flex-1 bg-slate-800" />
                </div>
                <span className="text-indigo-400 font-medium">{s.to}</span>
              </div>
            ))}
            {settlements.length === 0 && expenses.length > 0 && <p className="text-emerald-400 text-sm italic">Everyone is settled up! 🎉</p>}
            {expenses.length === 0 && <p className="text-slate-600 text-sm italic">Add expenses to see calculations.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplitBillSection
