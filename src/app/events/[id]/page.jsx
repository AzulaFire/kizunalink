'use client';
import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

export default function EventDetail({ params }) {
  const { id } = use(params);

  const [event, setEvent] = useState(null);
  const [host, setHost] = useState(null);
  const [hasRsvpd, setHasRsvpd] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Get Current User
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // 2. Fetch Event Details
      const { data: eventData, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error('Error fetching event:', error);
      setEvent(eventData);

      // 3. Fetch Host Profile
      if (eventData) {
        const { data: hostData } = await supabase
          .from('profiles')
          .select('full_name, is_premium')
          .eq('id', eventData.host_id)
          .single();
        setHost(hostData);
      }

      // 4. Check Attendees
      const { count } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);
      setAttendeeCount(count || 0);

      // 5. Check if *I* am going
      if (user) {
        const { data: myRsvp } = await supabase
          .from('event_attendees')
          .select('*')
          .eq('event_id', id)
          .eq('user_id', user.id)
          .single();
        if (myRsvp) setHasRsvpd(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleRSVP = async () => {
    if (!user) {
      alert('Please log in to RSVP');
      return;
    }
    setRsvpLoading(true);

    const { error } = await supabase
      .from('event_attendees')
      .insert({ event_id: id, user_id: user.id });

    if (!error) {
      setHasRsvpd(true);
      setAttendeeCount((prev) => prev + 1);
    } else {
      console.error(error);
      alert('Error joining event.');
    }
    setRsvpLoading(false);
  };

  if (loading)
    return (
      <div className='min-h-screen flex items-center justify-center dark:bg-black text-white'>
        Loading...
      </div>
    );
  if (!event)
    return (
      <div className='min-h-screen flex items-center justify-center dark:bg-black text-white'>
        Event not found
      </div>
    );

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />
      <main className='max-w-4xl mx-auto px-4 py-12'>
        <div className='grid md:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='md:col-span-2 space-y-6'>
            <div className='space-y-2'>
              <span className='text-indigo-600 font-semibold tracking-wide text-sm uppercase'>
                {event.category}
              </span>
              <h1 className='text-4xl font-bold tracking-tight text-zinc-900 dark:text-white'>
                {event.title}
              </h1>
            </div>

            <div className='flex items-center gap-6 text-zinc-500 text-sm md:text-base'>
              <div className='flex items-center gap-2'>
                <span className='text-lg'>🗓️</span>
                <span>{new Date(event.event_date).toLocaleString()}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-lg'>📍</span>
                <span>{event.city}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-lg'>👥</span>
                <span>{attendeeCount} Going</span>
              </div>
            </div>

            <div className='prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap'>
              <h3 className='text-lg font-semibold text-zinc-900 dark:text-white'>
                About this event
              </h3>
              {event.description}
            </div>

            <Alert>
              <AlertTitle>Safety First</AlertTitle>
              <AlertDescription>
                Always meet in public places. KizunaLink facilitates discovery
                but does not vet every event host.
              </AlertDescription>
            </Alert>
          </div>

          {/* Sidebar / Action Box */}
          <div className='space-y-6'>
            <Card className='p-6 space-y-4 shadow-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-24'>
              <div className='flex items-center gap-3'>
                <div className='size-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold'>
                  {host?.full_name
                    ? host.full_name.substring(0, 2).toUpperCase()
                    : 'H'}
                </div>
                <div>
                  <p className='text-sm font-medium text-zinc-900 dark:text-white'>
                    Hosted by {host?.full_name || 'Unknown'}
                  </p>
                  {host?.is_premium && (
                    <p className='text-xs text-zinc-500'>Premium Member</p>
                  )}
                </div>
              </div>

              <hr className='border-zinc-100 dark:border-zinc-800' />

              {hasRsvpd ? (
                <div className='space-y-4 animate-in fade-in zoom-in duration-300'>
                  <div className='bg-green-50 text-green-700 p-3 rounded-md text-center text-sm font-medium border border-green-200'>
                    You are going! 🎉
                  </div>
                  <div>
                    <p className='text-xs text-zinc-500 mb-1 font-medium'>
                      Join the chat:
                    </p>
                    <a
                      href={event.external_link}
                      target='_blank'
                      className='block'
                    >
                      <Button variant='outline' className='w-full'>
                        Open Link (Discord/Line)
                      </Button>
                    </a>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleRSVP}
                  disabled={rsvpLoading}
                  className='w-full text-lg h-12 bg-indigo-600 hover:bg-indigo-700 text-white'
                >
                  {rsvpLoading ? 'Confirming...' : 'RSVP to Event'}
                </Button>
              )}

              <p className='text-xs text-center text-zinc-400'>
                {hasRsvpd
                  ? 'See you there!'
                  : 'Link to group chat revealed after RSVP'}
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
