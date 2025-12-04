'use client';
import { useState, useCallback } from 'react';
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

// Setup the localizer
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

// Helper to get dates relative to today for the demo
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const day = today.getDate();

// Updated Mock Data (Dynamic dates so you see them now)
const mockEvents = [
  {
    id: 1,
    title: 'Shibuya Startup Night',
    start: new Date(year, month, day + 2, 19, 0), // 2 days from now at 7 PM
    end: new Date(year, month, day + 2, 22, 0),
    resource: 'Tokyo',
  },
  {
    id: 2,
    title: 'Sunday Morning Hike',
    start: new Date(year, month, day + 5, 8, 0), // 5 days from now
    end: new Date(year, month, day + 5, 12, 0),
    resource: 'Tokyo',
  },
  {
    id: 3,
    title: 'Osaka Language Exchange',
    start: new Date(year, month, day + 3, 18, 30),
    end: new Date(year, month, day + 3, 20, 30),
    resource: 'Osaka',
  },
];

export default function EventCalendar() {
  const router = useRouter();

  // 1. Add State for Date and View to make it "Controlled"
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);

  const [events, setEvents] = useState(mockEvents);
  const [cityFilter, setCityFilter] = useState('All');

  // 2. Handlers for Navigation (Back/Next/Today) and View Change (Month/Week/Day)
  const onNavigate = useCallback((newDate) => setDate(newDate), [setDate]);
  const onView = useCallback((newView) => setView(newView), [setView]);

  // Filter logic
  const filteredEvents =
    cityFilter === 'All'
      ? events
      : events.filter((e) => e.resource === cityFilter);

  const handleEventClick = (event) => {
    router.push(`/events/${event.id}`);
  };

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
          <h1 className='text-3xl font-bold text-zinc-900 dark:text-white'>
            Community Calendar
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
              // 3. Pass the controlled props here
              date={date}
              onNavigate={onNavigate}
              view={view}
              onView={onView}
              views={['month', 'week', 'day', 'agenda']}
              eventPropGetter={(event) => ({
                className:
                  'bg-indigo-600 text-white rounded-md border-none text-xs px-1',
              })}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
