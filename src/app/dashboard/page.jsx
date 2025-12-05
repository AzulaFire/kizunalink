'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
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

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [myRsvps, setMyRsvps] = useState([]);
  const [hostedEvents, setHostedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelData, setCancelData] = useState(null); // { type: 'rsvp'|'host', id: ... }

  // FIX: Moved fetchData inside useEffect to avoid external sync state updates
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Fetch Attending
      const { data: rsvpData } = await supabase
        .from('event_attendees')
        .select(
          `
          events (
            id, title, event_date, city, status
          )
        `
        )
        .eq('user_id', user.id);

      setMyRsvps(rsvpData || []);

      // Fetch Hosting
      const { data: hostedData } = await supabase
        .from('events')
        .select('*')
        .eq('host_id', user.id)
        .order('event_date', { ascending: true });

      setHostedEvents(hostedData || []);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const confirmCancel = (type, id) => {
    setCancelData({ type, id });
  };

  const handleCancelAction = async () => {
    if (!cancelData) return;

    if (cancelData.type === 'rsvp') {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', cancelData.id)
        .eq('user_id', user.id);

      // Optimistic update
      setMyRsvps((prev) =>
        prev.filter((item) => item.events.id !== cancelData.id)
      );
    } else if (cancelData.type === 'host') {
      await supabase
        .from('events')
        .update({ status: 'cancelled' })
        .eq('id', cancelData.id);

      // Optimistic update
      setHostedEvents((prev) =>
        prev.map((e) =>
          e.id === cancelData.id ? { ...e, status: 'cancelled' } : e
        )
      );
    }

    setCancelData(null);
  };

  if (loading)
    return (
      <div className='min-h-screen bg-background flex items-center justify-center text-zinc-500'>
        Loading...
      </div>
    );

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <main className='max-w-6xl mx-auto px-4 py-12'>
        <div className='flex flex-col md:flex-row justify-between items-end mb-8 gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-white'>Dashboard</h1>
            <p className='text-zinc-400'>Manage your circles and schedule.</p>
          </div>
          <Link href='/dashboard/create-event'>
            <Button
              className={
                profile?.is_premium
                  ? 'bg-primary hover:bg-primary/90 text-white border-0'
                  : 'opacity-50 cursor-not-allowed bg-zinc-800 border border-white/10'
              }
              disabled={!profile?.is_premium}
            >
              {profile?.is_premium
                ? '+ Create Event'
                : '🔒 Create Event (Premium)'}
            </Button>
          </Link>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            {/* Hosting Section */}
            {hostedEvents.length > 0 && (
              <section className='space-y-4'>
                <h2 className='text-xl font-semibold text-white'>
                  Events You Host
                </h2>
                {hostedEvents.map((event) => (
                  <Card
                    key={event.id}
                    className='flex flex-row items-center p-4 gap-4 bg-card border-white/10'
                  >
                    <div className='bg-indigo-900/30 p-3 rounded-lg text-center min-w-[70px] border border-indigo-500/30'>
                      <div className='text-xs uppercase font-bold text-indigo-400'>
                        HOST
                      </div>
                    </div>
                    <div className='flex-1'>
                      <h3
                        className={`font-semibold ${
                          event.status === 'cancelled'
                            ? 'text-zinc-500 line-through'
                            : 'text-white'
                        }`}
                      >
                        {event.title}
                        {event.status === 'cancelled' && (
                          <span className='ml-2 text-red-500 text-xs no-underline font-bold'>
                            CANCELLED
                          </span>
                        )}
                      </h3>
                      <p className='text-sm text-zinc-400'>
                        {new Date(event.event_date).toLocaleDateString()} •{' '}
                        {event.city}
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <Link href={`/events/${event.id}`}>
                        <Button
                          size='sm'
                          variant='outline'
                          className='border-white/20 hover:bg-white/10'
                        >
                          View
                        </Button>
                      </Link>
                      {event.status !== 'cancelled' && (
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => confirmCancel('host', event.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </section>
            )}

            <section className='space-y-4'>
              <h2 className='text-xl font-semibold text-white'>Attending</h2>
              {myRsvps.length === 0 ? (
                <div className='text-center py-12 bg-card rounded-xl border border-dashed border-white/10'>
                  <p className='text-zinc-500'>
                    You haven&apos;t joined any circles yet.
                  </p>
                  <Link
                    href='/events'
                    className='text-primary text-sm mt-2 block hover:underline'
                  >
                    Find a group
                  </Link>
                </div>
              ) : (
                myRsvps.map((rsvp, index) => {
                  const event = rsvp.events;
                  if (!event) return null;
                  const dateObj = new Date(event.event_date);
                  return (
                    <Card
                      key={index}
                      className='flex flex-row items-center p-4 gap-4 bg-card border-white/10'
                    >
                      <div className='bg-secondary p-3 rounded-lg text-center min-w-[70px]'>
                        <div className='text-xs uppercase font-bold text-primary'>
                          {dateObj.toLocaleString('default', {
                            month: 'short',
                          })}
                        </div>
                        <div className='text-xl font-bold text-white'>
                          {dateObj.getDate()}
                        </div>
                      </div>
                      <div className='flex-1'>
                        <h3
                          className={`font-semibold ${
                            event.status === 'cancelled'
                              ? 'text-zinc-500 line-through'
                              : 'text-white'
                          }`}
                        >
                          {event.title}
                          {event.status === 'cancelled' && (
                            <span className='ml-2 text-red-500 text-xs no-underline font-bold'>
                              CANCELLED BY HOST
                            </span>
                          )}
                        </h3>
                        <p className='text-sm text-zinc-400'>
                          {dateObj.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          • {event.city}
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <Link href={`/events/${event.id}`}>
                          <Button
                            size='sm'
                            variant='outline'
                            className='border-white/20 hover:bg-white/10'
                          >
                            View
                          </Button>
                        </Link>
                        {event.status !== 'cancelled' && (
                          <Button
                            size='sm'
                            variant='ghost'
                            className='text-zinc-500 hover:text-red-400'
                            onClick={() => confirmCancel('rsvp', event.id)}
                          >
                            Leave
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </section>
          </div>

          <div className='space-y-6'>
            <Card className='bg-card border-white/10'>
              <CardHeader>
                <CardTitle className='text-white'>Your Identity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-3 mb-4'>
                  {profile?.avatar_url && (
                    <Image
                      src={profile.avatar_url}
                      className='size-12 rounded-full object-cover'
                      alt='Avatar'
                      width={48}
                      height={48}
                    />
                  )}
                  <div>
                    <p className='font-medium text-white'>
                      {profile?.full_name}
                    </p>
                    <p className='text-xs text-zinc-500'>Member</p>
                  </div>
                </div>
                <Link href='/profile/edit'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full border-white/20 hover:bg-white/10'
                  >
                    Edit Profile & Tags
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <AlertDialog
          open={!!cancelData}
          onOpenChange={() => setCancelData(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
              <AlertDialogDescription>
                {cancelData?.type === 'host'
                  ? 'Are you sure you want to cancel this event? This will notify all attendees.'
                  : 'Are you sure you want to withdraw your RSVP?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelAction}
                className='bg-red-600 hover:bg-red-700'
              >
                Yes, Cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
