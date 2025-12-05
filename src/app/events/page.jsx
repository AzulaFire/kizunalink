'use client';
import { useEffect, useState } from 'react';
import { EventCard } from '../../components/EventCard';
import { supabase } from '../../lib/supabase';
import { useSearchParams } from 'next/navigation';

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);

  // Filters state initialized from URL params if present
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get('city') || 'All'
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [selectedVibe, setSelectedVibe] = useState(
    searchParams.get('vibe') || 'All'
  );
  const [soloOnly, setSoloOnly] = useState(false);

  useEffect(() => {
    // Fetch Cities for Filter
    const fetchCities = async () => {
      const { data } = await supabase
        .from('cities')
        .select('name')
        .order('name');
      if (data) setCities(data);
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      let query = supabase
        .from('events')
        .select('*')
        .neq('status', 'cancelled') // Hide cancelled events from main feed
        .order('event_date', { ascending: true });

      if (selectedCity !== 'All') query = query.eq('city', selectedCity);
      if (selectedCategory !== 'All')
        query = query.eq('category', selectedCategory);
      if (selectedVibe !== 'All') query = query.eq('vibe', selectedVibe);
      if (soloOnly) query = query.eq('is_solo_friendly', true);

      const { data, error } = await query;

      if (error) console.error('Error loading events:', error);
      else setEvents(data || []);

      setLoading(false);
    };

    fetchEvents();
  }, [selectedCity, selectedCategory, selectedVibe, soloOnly]);

  return (
    <div className='min-h-screen bg-background'>
      <main className='max-w-7xl mx-auto px-4 py-12'>
        <div className='flex flex-col gap-6 mb-8'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight text-white'>
              Upcoming Events
            </h2>
            <p className='text-zinc-400'>Find your circle.</p>
          </div>

          <div className='flex flex-wrap gap-4 items-center bg-card p-4 rounded-xl border border-white/10'>
            <select
              className='h-10 rounded-md border border-white/20 bg-secondary px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary'
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value='All'>📍 All Cities</option>
              {cities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className='h-10 rounded-md border border-white/20 bg-secondary px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value='All'>WM All Categories</option>
              <option value='Tech'>Tech</option>
              <option value='Outdoors'>Outdoors</option>
              <option value='Social'>Social</option>
              <option value='Learning'>Learning</option>
            </select>

            <select
              className='h-10 rounded-md border border-white/20 bg-secondary px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary'
              value={selectedVibe}
              onChange={(e) => setSelectedVibe(e.target.value)}
            >
              <option value='All'>✨ Any Vibe</option>
              <option value='chill'>🍵 Chill (Yuru)</option>
              <option value='serious'>🔥 Serious (Gachi)</option>
              <option value='party'>🎉 Party</option>
              <option value='learning'>🧠 Learning</option>
            </select>

            <button
              onClick={() => setSoloOnly(!soloOnly)}
              className={`h-10 px-4 rounded-md text-sm font-medium transition-all border ${
                soloOnly
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-secondary border-white/20 text-zinc-400 hover:text-white'
              }`}
            >
              {soloOnly ? '🔰 Solo-Friendly Only' : 'Show All Events'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className='text-center py-20 text-zinc-500 animate-pulse'>
            Loading events...
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {events.length > 0 ? (
              events.map((e) => (
                <EventCard
                  key={e.id}
                  event={{
                    id: e.id,
                    title: e.title,
                    date: new Date(e.event_date).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                    loc: e.city,
                    description: e.description,
                    is_solo_friendly: e.is_solo_friendly,
                    vibe: e.vibe,
                    language_level: e.language_level,
                  }}
                />
              ))
            ) : (
              <div className='col-span-full text-center py-20 text-zinc-500 bg-card rounded-xl border border-dashed border-white/10'>
                No events found matching your filters.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
