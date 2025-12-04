'use client';
import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// In a real app, this would be a server component fetching from DB
// But for RSVP interactivity, we use a Client Component pattern here
export default function EventDetail({ params }) {
  const { id } = use(params); // Unwrapping params for Next.js 15

  const [hasRsvpd, setHasRsvpd] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(12); // Mock count
  const [loading, setLoading] = useState(false);

  const handleRSVP = async () => {
    setLoading(true);

    // Simulate API call to Supabase
    // await supabase.from('event_attendees').insert({ event_id: id, user_id: currentUser.id })

    setTimeout(() => {
      setHasRsvpd(true);
      setAttendeeCount((prev) => prev + 1);
      setLoading(false);
    }, 800);
  };

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />
      <main className='max-w-4xl mx-auto px-4 py-12'>
        <div className='grid md:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='md:col-span-2 space-y-6'>
            <div className='space-y-2'>
              <span className='text-indigo-600 font-semibold tracking-wide text-sm uppercase'>
                Tech Networking
              </span>
              <h1 className='text-4xl font-bold tracking-tight text-zinc-900 dark:text-white'>
                Shibuya Startup Night
              </h1>
            </div>

            <div className='flex items-center gap-6 text-zinc-500 text-sm md:text-base'>
              <div className='flex items-center gap-2'>
                <span className='text-lg'>🗓️</span>
                <span>Oct 24, 19:00</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-lg'>📍</span>
                <span>Shibuya, Tokyo</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-lg'>👥</span>
                <span>{attendeeCount} Going</span>
              </div>
            </div>

            <div className='prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed'>
              <h3 className='text-lg font-semibold text-zinc-900 dark:text-white'>
                About this event
              </h3>
              <p>
                Are you a founder, engineer, or designer? Come join us for a
                casual networking night at the WeWork in Shibuya Scramble
                Square. Drinks and light snacks provided. Entrance is free but
                please RSVP via the link.
              </p>
              <p>
                We will have a short 15 min lightning talk session followed by
                open mixing.
              </p>
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
                  JS
                </div>
                <div>
                  <p className='text-sm font-medium text-zinc-900 dark:text-white'>
                    Hosted by John S.
                  </p>
                  <p className='text-xs text-zinc-500'>Premium Member</p>
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
                      href='https://discord.gg'
                      target='_blank'
                      className='block'
                    >
                      <Button variant='outline' className='w-full'>
                        Open Discord
                      </Button>
                    </a>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleRSVP}
                  disabled={loading}
                  className='w-full text-lg h-12 bg-indigo-600 hover:bg-indigo-700 text-white'
                >
                  {loading ? 'Confirming...' : 'RSVP to Event'}
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
