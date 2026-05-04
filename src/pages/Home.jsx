import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, BarChart3, Receipt, ArrowRight } from 'lucide-react'

const Home = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/20 to-transparent blur-3xl -z-10" />
      
      <main className="max-w-6xl mx-auto px-6 py-20 lg:py-32">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            Gather friends, <br />
            Go anywhere.
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 leading-relaxed">
            Organize meetups, coordinate logistics, and split bills effortlessly. 
            The real-time planner for your social life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              to="/create" 
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              Start Planning <ArrowRight size={20} />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-full font-semibold transition-all">
              View Demo
            </button>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32">
          {[
            { icon: Users, title: 'RSVP Sync', desc: 'Real-time attendee updates.' },
            { icon: BarChart3, title: 'Live Polls', desc: 'Decide together, instantly.' },
            { icon: Receipt, title: 'Split Bill', desc: 'Calculated expense sharing.' },
            { icon: Calendar, title: 'Event Hub', desc: 'All details in one link.' },
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="text-indigo-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer decoration */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl -z-10" />
    </div>
  )
}

export default Home
