'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CreateEvent() {
  const router = useRouter();
  const [vibe, setVibe] = useState('chill');
  const [soloFriendly, setSoloFriendly] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in.');
      setIsSubmitting(false);
      return;
    }

    const eventData = {
      host_id: user.id,
      title: formData.get('title'),
      event_date: formData.get('event_date'),
      // For simplicity in MVP, setting end time to 2 hours after start
      end_time: new Date(
        new Date(formData.get('event_date')).getTime() + 2 * 60 * 60 * 1000
      ).toISOString(),
      city: formData.get('city'),
      category: formData.get('category'), // You might want to add a select for this
      description: formData.get('description'),
      external_link: formData.get('external_link'),
      vibe: vibe,
      is_solo_friendly: soloFriendly,
    };

    const { error } = await supabase.from('events').insert([eventData]);

    if (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event: ' + error.message);
    } else {
      alert('Event Created Successfully!');
      router.push('/events');
    }

    setIsSubmitting(false);
  };

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />
      <div className='max-w-2xl mx-auto px-4 py-12'>
        <h1 className='text-3xl font-bold mb-2 text-white'>
          Create New Hangout
        </h1>
        <p className='text-zinc-400 mb-8'>Design a space for connection.</p>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl border border-white/10 space-y-4'>
            <h3 className='font-semibold text-lg text-white'>Event Details</h3>

            <div>
              <label className='block text-sm font-medium mb-2 text-zinc-300'>
                Event Title
              </label>
              <input
                name='title'
                required
                className='w-full p-2 border border-white/20 rounded-md bg-transparent text-white'
                placeholder='e.g. Sunday Coding Club'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-2 text-zinc-300'>
                  Date & Time
                </label>
                <input
                  type='datetime-local'
                  name='event_date'
                  required
                  className='w-full p-2 border border-white/20 rounded-md bg-transparent text-white dark:scheme-dark'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2 text-zinc-300'>
                  City
                </label>
                <select
                  name='city'
                  className='w-full p-2 border border-white/20 rounded-md bg-zinc-900 text-white'
                >
                  <option value='Tokyo'>Tokyo</option>
                  <option value='Osaka'>Osaka</option>
                  <option value='Kyoto'>Kyoto</option>
                  <option value='Fukuoka'>Fukuoka</option>
                </select>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2 text-zinc-300'>
                Category
              </label>
              <select
                name='category'
                className='w-full p-2 border border-white/20 rounded-md bg-zinc-900 text-white'
              >
                <option value='Tech'>Tech</option>
                <option value='Outdoors'>Outdoors</option>
                <option value='Social'>Social</option>
                <option value='Learning'>Learning</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2 text-zinc-300'>
                Description
              </label>
              <textarea
                name='description'
                rows='4'
                className='w-full p-2 border border-white/20 rounded-md bg-transparent text-white'
                placeholder="What's the plan?"
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2 text-zinc-300'>
                Link to Join (Discord/Line/Forms)
              </label>
              <input
                name='external_link'
                type='url'
                required
                className='w-full p-2 border border-white/20 rounded-md bg-transparent text-white'
                placeholder='https://discord.gg/...'
              />
              <p className='text-xs text-zinc-500 mt-1'>
                This link is only visible to users who click &quot;Join&quot;.
              </p>
            </div>
          </div>

          <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl border border-white/10 space-y-6'>
            <h3 className='font-semibold text-lg text-white'>
              Set the Atmosphere
            </h3>

            {/* Solo Friendly Toggle */}
            <div className='flex items-center justify-between'>
              <div>
                <label className='font-medium text-white'>
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
                  soloFriendly ? 'bg-green-500' : 'bg-zinc-700'
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
              <label className='font-medium block mb-3 text-white'>
                The Vibe
              </label>
              <div className='grid grid-cols-2 gap-4'>
                <div
                  onClick={() => setVibe('chill')}
                  className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-all ${
                    vibe === 'chill'
                      ? 'border-emerald-500 bg-emerald-900/20'
                      : 'border-white/10 bg-zinc-800'
                  }`}
                >
                  <div className='text-2xl mb-1'>🍵</div>
                  <div className='font-bold text-white'>Yuru (Chill)</div>
                  <div className='text-xs text-zinc-400'>
                    Relaxed, no pressure
                  </div>
                </div>

                <div
                  onClick={() => setVibe('serious')}
                  className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-all ${
                    vibe === 'serious'
                      ? 'border-indigo-500 bg-indigo-900/20'
                      : 'border-white/10 bg-zinc-800'
                  }`}
                >
                  <div className='text-2xl mb-1'>🔥</div>
                  <div className='font-bold text-white'>Gachi (Serious)</div>
                  <div className='text-xs text-zinc-400'>
                    Structured, focused
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            type='submit'
            size='lg'
            className='w-full bg-primary hover:bg-primary/90 text-white'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Launch Hangout'}
          </Button>
        </form>
      </div>
    </div>
  );
}
