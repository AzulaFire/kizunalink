'use client';
import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';

export default function EventDetail({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [host, setHost] = useState(null);
  const [hasRsvpd, setHasRsvpd] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [hostRating, setHostRating] = useState(null);
  const [hitokoto, setHitokoto] = useState('');
  const [wantsNijikai, setWantsNijikai] = useState(false);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null); // 'cancelEvent' or 'cancelRSVP'

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data: eventData, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error('Error fetching event:', error);
      setEvent(eventData);

      if (eventData) {
        const { data: hostData } = await supabase
          .from('profiles')
          .select('id, full_name, is_premium')
          .eq('id', eventData.host_id)
          .single();
        setHost(hostData);

        const { data: ratings } = await supabase
          .from('host_ratings')
          .select('rating')
          .eq('host_id', eventData.host_id);

        if (ratings && ratings.length > 0) {
          const avg =
            ratings.reduce((acc, curr) => acc + curr.rating, 0) /
            ratings.length;
          setHostRating(avg.toFixed(1));
        }
      }

      const { count } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id);
      setAttendeeCount(count || 0);

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

    const { error } = await supabase.from('event_attendees').insert({
      event_id: id,
      user_id: user.id,
      hitokoto: hitokoto || null, // Optional now
      wants_nijikai: wantsNijikai,
    });

    if (!error) {
      setHasRsvpd(true);
      setAttendeeCount((prev) => prev + 1);
    } else {
      console.error(error);
      alert('Error joining event.');
    }
    setRsvpLoading(false);
  };

  const performAction = async () => {
    if (dialogAction === 'cancelEvent') {
      const { error } = await supabase
        .from('events')
        .update({ status: 'cancelled' })
        .eq('id', id);
      if (!error) {
        router.push('/dashboard');
      }
    } else if (dialogAction === 'cancelRSVP') {
      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', id)
        .eq('user_id', user.id);
      if (!error) {
        setHasRsvpd(false);
        setAttendeeCount((prev) => prev - 1);
      }
    }
    setDialogOpen(false);
  };

  const triggerCancelEvent = () => {
    setDialogAction('cancelEvent');
    setDialogOpen(true);
  };

  const triggerCancelRSVP = () => {
    setDialogAction('cancelRSVP');
    setDialogOpen(true);
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

  const isHost = user && host && user.id === host.id;
  const isCancelled = event.status === 'cancelled';

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />
      <main className='max-w-4xl mx-auto px-4 py-12'>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='md:col-span-2 space-y-6'>
            {event.image_url && (
              <Image
                src={event.image_url}
                alt={event.title}
                width={1000}
                height={1000}
                className='w-full h-64 object-cover rounded-xl border border-white/10'
              />
            )}

            <div className='space-y-2'>
              <div className='flex gap-2'>
                <span className='text-indigo-600 font-semibold tracking-wide text-sm uppercase'>
                  {event.category}
                </span>
                {event.language_level &&
                  event.language_level !== 'All Levels' && (
                    <span className='bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded border border-zinc-700 flex items-center'>
                      🗣️ {event.language_level}
                    </span>
                  )}
                {isCancelled && (
                  <span className='bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold flex items-center'>
                    CANCELLED
                  </span>
                )}
              </div>
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

            {event.has_nijikai && (
              <div className='bg-yellow-900/20 text-yellow-600 border border-yellow-900/30 p-3 rounded-lg flex items-center gap-2'>
                <span className='text-xl'>🍻</span>
                <div>
                  <p className='text-sm font-bold'>
                    Nijikai (After-party) Planned!
                  </p>
                  <p className='text-xs opacity-90'>
                    The host is planning drinks/food after the main event.
                  </p>
                </div>
              </div>
            )}

            <div className='prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap'>
              <h3 className='text-lg font-semibold text-zinc-900 dark:text-white'>
                About this event
              </h3>
              {event.description}
            </div>

            {isHost && !isCancelled && (
              <div className='bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg'>
                <h3 className='text-sm font-bold text-white mb-2'>
                  Host Controls
                </h3>
                <div className='flex gap-2'>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={triggerCancelEvent}
                  >
                    Cancel Event
                  </Button>
                  {/* Edit button would route to an edit page */}
                  {/* <Button variant="outline" size="sm">Edit Event</Button> */}
                </div>
              </div>
            )}
          </div>

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
                  <div className='flex items-center gap-1 text-xs text-zinc-500'>
                    <span className='text-yellow-500'>★</span>
                    {hostRating ? `${hostRating} Host Rating` : 'New Host'}
                  </div>
                </div>
              </div>

              <hr className='border-zinc-100 dark:border-zinc-800' />

              {isCancelled ? (
                <div className='text-center p-4 bg-red-900/20 rounded border border-red-900/50 text-red-500 font-bold'>
                  Event has been cancelled by host.
                </div>
              ) : hasRsvpd ? (
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
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full text-red-400 hover:text-red-500 hover:bg-red-900/20'
                    onClick={triggerCancelRSVP}
                  >
                    Cancel RSVP
                  </Button>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div>
                    <label className='text-xs font-medium text-zinc-400 mb-1 block'>
                      Say &quot;Hitokoto&quot; (Optional one word hello):
                    </label>
                    <input
                      className='w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      placeholder='e.g. Excited to practice Japanese!'
                      value={hitokoto}
                      onChange={(e) => setHitokoto(e.target.value)}
                    />
                  </div>

                  {event.has_nijikai && (
                    <label className='flex items-center gap-2 cursor-pointer group'>
                      <input
                        type='checkbox'
                        checked={wantsNijikai}
                        onChange={(e) => setWantsNijikai(e.target.checked)}
                        className='rounded border-zinc-600 bg-zinc-800 text-indigo-600 focus:ring-indigo-500'
                      />
                      <span className='text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors'>
                        I&apos;m interested in the After-party 🍻
                      </span>
                    </label>
                  )}

                  <Button
                    onClick={handleRSVP}
                    disabled={rsvpLoading}
                    className='w-full text-lg h-12 bg-indigo-600 hover:bg-indigo-700 text-white'
                  >
                    {rsvpLoading ? 'Confirming...' : 'RSVP to Event'}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>

        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {dialogAction === 'cancelEvent'
                  ? 'This will cancel the event for all attendees. This action cannot be undone.'
                  : 'You will be removed from the attendee list.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Go Back</AlertDialogCancel>
              <AlertDialogAction
                onClick={performAction}
                className='bg-red-600 hover:bg-red-700'
              >
                {dialogAction === 'cancelEvent'
                  ? 'Yes, Cancel Event'
                  : 'Yes, Cancel RSVP'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
