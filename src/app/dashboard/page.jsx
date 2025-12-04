'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [myRsvps, setMyRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // 1. Fetch Profile info
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // 2. Fetch RSVPs (joined events)
      // Note: We join the 'events' table to get details of the events we RSVP'd to
      const { data: rsvpData } = await supabase
        .from('event_attendees')
        .select(
          `
          status,
          events (
            id,
            title,
            event_date,
            city
          )
        `
        )
        .eq('user_id', user.id);

      setMyRsvps(rsvpData || []);
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  if (loading)
    return (
      <div className='min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center'>
        Loading...
      </div>
    );

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />
      <main className='max-w-6xl mx-auto px-4 py-12'>
        <div className='flex flex-col md:flex-row justify-between items-end mb-8 gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-zinc-900 dark:text-white'>
              Dashboard
            </h1>
            <p className='text-zinc-500'>
              Welcome back, {profile?.full_name || 'User'}.
            </p>
          </div>
          {/* Quick Action */}
          <Link href='/dashboard/create-event'>
            <Button
              className={
                profile?.is_premium
                  ? 'bg-indigo-600'
                  : 'opacity-50 cursor-not-allowed bg-zinc-500'
              }
              title={!profile?.is_premium ? 'Upgrade to create events' : ''}
              disabled={!profile?.is_premium}
            >
              {profile?.is_premium
                ? '+ Create Event'
                : '🔒 Create Event (Premium)'}
            </Button>
          </Link>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column: My Schedule */}
          <div className='lg:col-span-2 space-y-6'>
            <h2 className='text-xl font-semibold'>Your Schedule</h2>

            {myRsvps.length === 0 ? (
              <div className='text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-dashed'>
                <p className='text-zinc-500'>
                  You haven&apos;t joined any circles yet.
                </p>
                <Link
                  href='/events'
                  className='text-indigo-600 text-sm mt-2 block hover:underline'
                >
                  Find a group
                </Link>
              </div>
            ) : (
              <div className='space-y-4'>
                {myRsvps.map((rsvp, index) => {
                  const event = rsvp.events;
                  const dateObj = new Date(event.event_date);
                  return (
                    <Card
                      key={index}
                      className='flex flex-row items-center p-4 gap-4'
                    >
                      <div className='bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg text-center min-w-[70px]'>
                        <div className='text-xs uppercase font-bold text-red-500'>
                          {dateObj.toLocaleString('default', {
                            month: 'short',
                          })}
                        </div>
                        <div className='text-xl font-bold'>
                          {dateObj.getDate()}
                        </div>
                      </div>
                      <div className='flex-1'>
                        <h3 className='font-semibold'>{event.title}</h3>
                        <p className='text-sm text-zinc-500'>
                          {dateObj.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          • {event.city}
                        </p>
                      </div>
                      <Link href={`/events/${event.id}`}>
                        <Button size='sm' variant='outline'>
                          View
                        </Button>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Profile & Stats */}
          <div className='space-y-6'>
            <Card className='bg-white dark:bg-zinc-900'>
              <CardHeader>
                <CardTitle>Your Identity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2 mb-4'>
                  {/* Future: Map through real user_hobbies here */}
                  <span className='bg-zinc-100 text-zinc-700 text-xs px-2 py-1 rounded-full'>
                    Add tags to match
                  </span>
                </div>
                <Link href='/profile/edit'>
                  <Button variant='outline' size='sm' className='w-full'>
                    Edit Profile & Tags
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {!profile?.is_premium && (
              <Card className='bg-indigo-900 text-white border-none'>
                <CardHeader>
                  <CardTitle className='text-white'>Upgrade to Host</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-indigo-200 text-sm mb-4'>
                    Create your own circles and build a community.
                  </p>
                  <Link href='/pricing'>
                    <Button className='w-full bg-white text-indigo-900 hover:bg-indigo-50'>
                      View Plans
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
