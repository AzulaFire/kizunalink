'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function CreateEvent() {
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [vibe, setVibe] = useState('chill');
  const [soloFriendly, setSoloFriendly] = useState(false);
  const [hasNijikai, setHasNijikai] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Alert State
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      const { data } = await supabase
        .from('cities')
        .select('name')
        .order('name');
      if (data) setCities(data);
    };
    fetchCities();
  }, []);

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setAlertOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      showAlert('You must be logged in.');
      setIsSubmitting(false);
      return;
    }

    // 1. Handle Image Upload
    let imageUrl = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        showAlert('Error uploading image');
        setIsSubmitting(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('event-images').getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    // 2. Prepare Event Data
    const eventData = {
      host_id: user.id,
      title: formData.get('title'),
      event_date: formData.get('event_date'),
      end_time: new Date(
        new Date(formData.get('event_date')).getTime() + 2 * 60 * 60 * 1000
      ).toISOString(),
      city: formData.get('city'),
      category: formData.get('category'),
      description: formData.get('description'),
      external_link: formData.get('external_link'),
      vibe: vibe,
      is_solo_friendly: soloFriendly,
      image_url: imageUrl,
      has_nijikai: hasNijikai,
      language_level: formData.get('language_level'),
      status: 'scheduled',
    };

    const { error } = await supabase.from('events').insert([eventData]);

    if (error) {
      console.error('Error creating event:', error);
      showAlert('Failed: ' + error.message);
    } else {
      router.push('/events');
    }

    setIsSubmitting(false);
  };

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <div className='max-w-2xl mx-auto px-4 py-12'>
        <h1 className='text-3xl font-bold mb-2 text-white'>
          Create New Hangout
        </h1>
        <p className='text-zinc-400 mb-8'>Design a space for connection.</p>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='bg-card p-6 rounded-xl border border-white/10 space-y-4'>
            <h3 className='font-semibold text-lg text-white'>Event Details</h3>

            <div>
              <label className='block text-sm font-medium mb-2 text-zinc-300'>
                Event Title
              </label>
              <input
                name='title'
                required
                className='w-full p-2 border border-white/20 rounded-md bg-transparent text-white focus:border-primary focus:outline-none'
                placeholder='e.g. Sunday Coding Club'
              />
            </div>

            {/* Image Upload Input */}
            <div>
              <label className='block text-sm font-medium mb-2 text-zinc-300'>
                Event Cover Image
              </label>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => setImageFile(e.target.files[0])}
                className='block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90'
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
                  className='w-full p-2 border border-white/20 rounded-md bg-secondary text-white'
                >
                  {cities.length > 0 ? (
                    cities.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value='Tokyo'>Tokyo</option>
                      <option value='Osaka'>Osaka</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2 text-zinc-300'>
                Language Requirement 🇯🇵
              </label>
              <select
                name='language_level'
                className='w-full p-2 border border-white/20 rounded-md bg-secondary text-white'
              >
                <option value='All Levels'>🌍 All Levels Welcome</option>
                <option value='Beginner Friendly'>🔰 Beginner Friendly</option>
                <option value='Conversational (N3+)'>
                  🗣️ Conversational (N3+)
                </option>
                <option value='Native/N1'>🐉 Native/N1 Only</option>
              </select>
            </div>

            <div className='flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg border border-white/5'>
              <input
                type='checkbox'
                id='hasNijikai'
                checked={hasNijikai}
                onChange={(e) => setHasNijikai(e.target.checked)}
                className='w-5 h-5 rounded border-white/20 bg-transparent text-primary focus:ring-primary'
              />
              <div>
                <label
                  htmlFor='hasNijikai'
                  className='text-sm font-medium text-white block cursor-pointer'
                >
                  Planning a Nijikai (After-party)? 🍻
                </label>
                <p className='text-xs text-zinc-400'>
                  If checked, we will ask attendees if they want to join.
                </p>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2 text-zinc-300'>
                Category
              </label>
              <select
                name='category'
                className='w-full p-2 border border-white/20 rounded-md bg-secondary text-white'
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

          <div className='bg-card p-6 rounded-xl border border-white/10 space-y-6'>
            <h3 className='font-semibold text-lg text-white'>
              Set the Atmosphere
            </h3>

            <div className='flex items-center justify-between'>
              <div>
                <label className='font-medium text-white'>
                  🔰 Solo-Participants Only?
                </label>
                <p className='text-sm text-zinc-500'>
                  Only allow people joining alone.
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

        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Notification</AlertDialogTitle>
              <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setAlertOpen(false)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
