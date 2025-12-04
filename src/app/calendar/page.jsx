'use client';
import { useState, useCallback, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function EventCalendar() {
  const router = useRouter();

  // Calendar State
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);

  // Data State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('All');

  // Fetch Events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from('events').select('*');

        if (error) throw error;

        // Transform Supabase data to React-Big-Calendar format
        const formattedEvents = data.map((event) => ({
          id: event.id,
          title: event.title,
          // 'event_date' comes as string, must convert to Date object
          start: new Date(event.event_date),
          // If end_time is null, assume 2 hour duration
          end: event.end_time
            ? new Date(event.end_time)
            : new Date(
                new Date(event.event_date).getTime() + 2 * 60 * 60 * 1000
              ),
          resource: event.city,
          vibe: event.vibe, // Keep vibe data for styling if needed
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handlers
  const onNavigate = useCallback((newDate) => setDate(newDate), [setDate]);
  const onView = useCallback((newView) => setView(newView), [setView]);

  // Filter Logic
  const filteredEvents =
    cityFilter === 'All'
      ? events
      : events.filter((e) => e.resource === cityFilter);

  const handleEventClick = (event) => {
    router.push(`/events/${event.id}`);
  };

  // Custom Event Styling based on Vibe
  const eventStyleGetter = (event) => {
    let backgroundColor = '#4f46e5'; // Default Indigo

    if (event.vibe === 'chill') backgroundColor = '#10b981'; // Emerald
    if (event.vibe === 'serious') backgroundColor = '#3f3f46'; // Zinc
    if (event.vibe === 'learning') backgroundColor = '#3b82f6'; // Blue

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        border: 'none',
        fontSize: '12px',
        padding: '2px 4px',
      },
    };
  };

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
          <h1 className='text-3xl font-bold text-zinc-900 dark:text-white'>
            {loading ? 'Loading Calendar...' : 'Community Calendar'}
          </h1>

          <select
            className='h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value='All'>All Cities</option>
            <option value='Tokyo'>Tokyo</option>
            <option value='Osaka'>Osaka</option>
            <option value='Kyoto'>Kyoto</option>
          </select>
        </div>

        <Card className='p-4 bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800'>
          <div className='h-[600px]'>
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor='start'
              endAccessor='end'
              style={{ height: '100%' }}
              onSelectEvent={handleEventClick}
              date={date}
              onNavigate={onNavigate}
              view={view}
              onView={onView}
              views={['month', 'week', 'day', 'agenda']}
              eventPropGetter={eventStyleGetter}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
