'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Mock data - fetch from Supabase 'hobbies' table in real app
const AVAILABLE_HOBBIES = [
  { id: 1, name: 'Street Photography', category: 'Creative' },
  { id: 2, name: 'Cafe Hopping', category: 'Social' },
  { id: 3, name: 'Language Exchange', category: 'Learning' },
  { id: 4, name: 'Hiking', category: 'Sports' },
  { id: 5, name: 'Goshuin (Temple Seals)', category: 'Cultural' },
  { id: 6, name: 'Sake Tasting', category: 'Social' },
];

export default function EditProfile() {
  const [selectedHobbies, setSelectedHobbies] = useState([1, 4]); // Mock pre-selected
  const [isSaving, setIsSaving] = useState(false);

  const toggleHobby = (id) => {
    setSelectedHobbies((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // await supabase.from('user_hobbies').upsert(...)
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />
      <main className='max-w-2xl mx-auto px-4 py-12'>
        <h1 className='text-3xl font-bold text-zinc-900 dark:text-white mb-8'>
          Edit Your Profile
        </h1>

        <form className='space-y-8'>
          {/* Basic Info */}
          <Card className='bg-white dark:bg-zinc-900'>
            <CardHeader>
              <CardTitle>The Basics</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Display Name
                </label>
                <input
                  className='w-full p-2 border rounded-md bg-transparent'
                  defaultValue='John Doe'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Bio</label>
                <textarea
                  className='w-full p-2 border rounded-md bg-transparent'
                  rows='3'
                  defaultValue='Love capturing moments in Tokyo.'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Home Station
                </label>
                <input
                  className='w-full p-2 border rounded-md bg-transparent'
                  placeholder='e.g. Yoyogi-Uehara'
                />
                <p className='text-xs text-zinc-500 mt-1'>
                  Used to find events near you.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Identity Tags */}
          <Card className='bg-white dark:bg-zinc-900'>
            <CardHeader>
              <CardTitle>Your Interests</CardTitle>
              <p className='text-sm text-zinc-500'>
                Select what defines you. We use this for AI matching.
              </p>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {AVAILABLE_HOBBIES.map((hobby) => {
                  const isSelected = selectedHobbies.includes(hobby.id);
                  return (
                    <button
                      key={hobby.id}
                      type='button'
                      onClick={() => toggleHobby(hobby.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-600 ring-offset-2'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {hobby.name}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className='flex justify-end gap-4'>
            <Button variant='ghost'>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
