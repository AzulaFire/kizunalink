'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CreateEvent() {
  const [vibe, setVibe] = useState('chill');
  const [soloFriendly, setSoloFriendly] = useState(false);

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />
      <div className='max-w-2xl mx-auto px-4 py-12'>
        <h1 className='text-3xl font-bold mb-2'>Create New Hangout</h1>
        <p className='text-zinc-500 mb-8'>Design a space for connection.</p>

        <form className='space-y-6'>
          {/* ... Basic fields (Title, Date, etc from previous step) ... */}

          <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl border space-y-6'>
            <h3 className='font-semibold text-lg'>Set the Atmosphere</h3>

            {/* Solo Friendly Toggle */}
            <div className='flex items-center justify-between'>
              <div>
                <label className='font-medium'>
                  🔰 Solo-Participants Only?
                </label>
                <p className='text-sm text-zinc-500'>
                  Only allow people joining alone. Great for making new friends.
                </p>
              </div>
              <button
                type='button'
                onClick={() => setSoloFriendly(!soloFriendly)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  soloFriendly ? 'bg-green-500' : 'bg-zinc-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                    soloFriendly ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Vibe Selection */}
            <div>
              <label className='font-medium block mb-3'>
                The Vibe (Gachi vs Yuru)
              </label>
              <div className='grid grid-cols-2 gap-4'>
                <div
                  onClick={() => setVibe('chill')}
                  className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-all ${
                    vibe === 'chill'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-transparent bg-zinc-50 dark:bg-zinc-800'
                  }`}
                >
                  <div className='text-2xl mb-1'>🍵</div>
                  <div className='font-bold'>Yuru (Chill)</div>
                  <div className='text-xs text-zinc-500'>
                    Relaxed, no pressure
                  </div>
                </div>

                <div
                  onClick={() => setVibe('serious')}
                  className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-all ${
                    vibe === 'serious'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-transparent bg-zinc-50 dark:bg-zinc-800'
                  }`}
                >
                  <div className='text-2xl mb-1'>🔥</div>
                  <div className='font-bold'>Gachi (Serious)</div>
                  <div className='text-xs text-zinc-500'>
                    Structured, focused
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button type='submit' size='lg' className='w-full'>
            Launch Hangout
          </Button>
        </form>
      </div>
    </div>
  );
}
