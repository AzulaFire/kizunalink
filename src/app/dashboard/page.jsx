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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

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
            <p className='text-zinc-400'>
              Welcome back, {profile?.full_name || 'User'}.
            </p>
          </div>
          <Link href='/dashboard/create-event'>
            <Button
              className={
                profile?.is_premium
                  ? 'bg-primary hover:bg-primary/90 text-white border-0'
                  : 'opacity-50 cursor-not-allowed bg-zinc-800 border border-white/10'
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
          <div className='lg:col-span-2 space-y-6'>
            <h2 className='text-xl font-semibold text-white'>Your Schedule</h2>

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
              <div className='space-y-4'>
                {myRsvps.map((rsvp, index) => {
                  const event = rsvp.events;
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
                        <h3 className='font-semibold text-white'>
                          {event.title}
                        </h3>
                        <p className='text-sm text-zinc-400'>
                          {dateObj.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          • {event.city}
                        </p>
                      </div>
                      <Link href={`/events/${event.id}`}>
                        <Button
                          size='sm'
                          variant='outline'
                          className='border-white/20 hover:bg-white/10'
                        >
                          View
                        </Button>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div className='space-y-6'>
            <Card className='bg-card border-white/10'>
              <CardHeader>
                <CardTitle className='text-white'>Your Identity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2 mb-4'>
                  <span className='bg-secondary text-zinc-300 text-xs px-2 py-1 rounded-full border border-white/10'>
                    Add tags to match
                  </span>
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

            {!profile?.is_premium && (
              <Card className='bg-linear-to-br from-indigo-900 to-purple-900 border-0'>
                <CardHeader>
                  <CardTitle className='text-white'>Upgrade to Host</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-indigo-200 text-sm mb-4'>
                    Create your own circles and build a community.
                  </p>
                  <Link href='/pricing'>
                    <Button className='w-full bg-white text-indigo-900 hover:bg-indigo-50 border-0 font-semibold'>
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
