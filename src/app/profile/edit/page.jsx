'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Camera } from 'lucide-react';
import Image from 'next/image';
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

export default function EditProfile() {
  const router = useRouter();
  const [availableHobbies, setAvailableHobbies] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [homeStation, setHomeStation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Alert State
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    isError: false,
  });

  const showAlert = (title, message, isError = false) => {
    setAlertConfig({ title, message, isError });
    setAlertOpen(true);
  };

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // 1. Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || '');
        setAvatarUrl(profile.avatar_url);
        // setBio(profile.bio);
        // setHomeStation(profile.home_station);
      }

      // 2. Fetch All Hobbies from DB
      const { data: hobbies } = await supabase
        .from('hobbies')
        .select('*')
        .order('category');
      setAvailableHobbies(hobbies || []);

      // 3. Fetch User's Selected Hobbies from DB
      const { data: userHobbies } = await supabase
        .from('profile_hobbies')
        .select('hobby_id')
        .eq('profile_id', user.id);

      if (userHobbies) {
        setSelectedHobbies(userHobbies.map((h) => h.hobby_id));
      }
    };
    loadData();
  }, [router]);

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('profile-avatars').getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (error) {
      showAlert('Upload Failed', error.message, true);
    } finally {
      setUploading(false);
    }
  };

  const toggleHobby = (id) => {
    setSelectedHobbies((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      // 1. Update Profile Basics
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          // bio: bio,
          // city: homeStation
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Update Hobbies (Delete existing, insert new)
      await supabase.from('profile_hobbies').delete().eq('profile_id', user.id);

      if (selectedHobbies.length > 0) {
        const hobbyInserts = selectedHobbies.map((hobbyId) => ({
          profile_id: user.id,
          hobby_id: hobbyId,
        }));
        const { error: hobbyError } = await supabase
          .from('profile_hobbies')
          .insert(hobbyInserts);
        if (hobbyError) throw hobbyError;
      }

      showAlert('Success', 'Your profile has been updated!');
    } catch (error) {
      console.error(error);
      showAlert('Error', 'Failed to update profile. Please try again.', true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />
      <main className='max-w-2xl mx-auto px-4 py-12'>
        <h1 className='text-3xl font-bold text-zinc-900 dark:text-white mb-8'>
          Edit Your Profile
        </h1>

        <form className='space-y-8' onSubmit={(e) => e.preventDefault()}>
          <Card className='bg-white dark:bg-zinc-900'>
            <CardHeader>
              <CardTitle>The Basics</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Avatar Upload */}
              <div className='flex items-center gap-6'>
                <div className='relative group'>
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt='Avatar'
                      width={96}
                      height={96}
                    />
                  ) : (
                    <div className='size-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-300 dark:border-zinc-600'>
                      <Camera className='size-8' />
                    </div>
                  )}
                  <div className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                    <label
                      htmlFor='avatar-upload'
                      className='text-white text-xs font-bold cursor-pointer'
                    >
                      Change
                    </label>
                  </div>
                  <input
                    type='file'
                    id='avatar-upload'
                    accept='image/*'
                    onChange={uploadAvatar}
                    className='hidden'
                    disabled={uploading}
                  />
                </div>
                <div>
                  <h3 className='font-medium text-zinc-900 dark:text-white'>
                    Profile Photo
                  </h3>
                  <p className='text-sm text-zinc-500'>
                    Recommended size: 400x400px
                  </p>
                  {uploading && (
                    <p className='text-indigo-500 text-xs mt-1'>Uploading...</p>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>
                  Display Name
                </label>
                <input
                  className='w-full p-2 border rounded-md bg-transparent'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Bio</label>
                <textarea
                  className='w-full p-2 border rounded-md bg-transparent'
                  rows='3'
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder='Tell us about yourself...'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Home Station
                </label>
                <input
                  className='w-full p-2 border rounded-md bg-transparent'
                  placeholder='e.g. Yoyogi-Uehara'
                  value={homeStation}
                  onChange={(e) => setHomeStation(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-zinc-900'>
            <CardHeader>
              <CardTitle>Your Interests</CardTitle>
              <p className='text-sm text-zinc-500'>
                Select what defines you. We use this for AI matching.
              </p>
            </CardHeader>
            <CardContent>
              {availableHobbies.length === 0 ? (
                <p className='text-sm text-zinc-500'>Loading hobbies...</p>
              ) : (
                <div className='flex flex-wrap gap-2'>
                  {availableHobbies.map((hobby) => {
                    const isSelected = selectedHobbies.includes(hobby.id);
                    return (
                      <button
                        key={hobby.id}
                        type='button'
                        onClick={() => toggleHobby(hobby.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-600 ring-offset-2'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        <span>{hobby.emoji}</span>
                        {hobby.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className='flex justify-end gap-4'>
            <Button variant='ghost' onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>

        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle
                className={alertConfig.isError ? 'text-red-500' : ''}
              >
                {alertConfig.title}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {alertConfig.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  setAlertOpen(false);
                  if (!alertConfig.isError) router.push('/dashboard');
                }}
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
