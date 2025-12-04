'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { EventCard } from '@/components/EventCard';
import { supabase } from '@/lib/supabase';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (selectedCity !== 'All') query = query.eq('city', selectedCity);
      if (selectedCategory !== 'All')
        query = query.eq('category', selectedCategory);

      const { data, error } = await query;

      if (error) console.error('Error loading events:', error);
      else setEvents(data || []);

      setLoading(false);
    };

    fetchEvents();
  }, [selectedCity, selectedCategory]);

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <main className='max-w-7xl mx-auto px-4 py-12'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight text-white'>
              Upcoming Events
            </h2>
            <p className='text-zinc-400'>Join a community near you.</p>
          </div>

          <div className='flex gap-2'>
            <select
              className='h-10 rounded-md border border-white/20 bg-secondary px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary'
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value='All'>All Cities</option>
              <option value='Tokyo'>Tokyo</option>
              <option value='Osaka'>Osaka</option>
              <option value='Kyoto'>Kyoto</option>
            </select>
            <select
              className='h-10 rounded-md border border-white/20 bg-secondary px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value='All'>All Categories</option>
              <option value='Tech'>Tech</option>
              <option value='Outdoors'>Outdoors</option>
              <option value='Social'>Social</option>
              <option value='Learning'>Learning</option>
            </select>
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
