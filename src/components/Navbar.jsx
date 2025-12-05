'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      }
    };
    fetchData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push('/login');
  };

  return (
    <nav className='border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex items-center gap-8'>
            <Link
              href='/'
              className='text-xl font-bold tracking-tighter text-white'
            >
              Kizuna<span className='text-primary'>Link</span>
            </Link>
            <div className='hidden md:flex gap-6 text-sm font-medium text-zinc-400'>
              <Link
                href='/events'
                className='hover:text-white transition-colors'
              >
                Browse Events
              </Link>
              <Link
                href='/calendar'
                className='hover:text-white transition-colors'
              >
                Calendar
              </Link>
              <Link
                href='/pricing'
                className='hover:text-white transition-colors'
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            {user ? (
              <>
                {/* User Greeting & Avatar */}
                <div className='flex items-center gap-3 mr-2'>
                  <div className='text-right hidden sm:block'>
                    <p className='text-xs text-zinc-400'>Welcome back,</p>
                    <p className='text-sm font-medium text-white max-w-[100px] truncate'>
                      {profile?.full_name || 'Friend'}
                    </p>
                  </div>
                  <Link href='/profile/edit'>
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt='Profile'
                        className='size-9 rounded-full object-cover border border-white/10 hover:border-primary/50 transition-colors'
                      />
                    ) : (
                      <div className='size-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border border-white/10'>
                        {profile?.full_name
                          ? profile.full_name[0].toUpperCase()
                          : 'U'}
                      </div>
                    )}
                  </Link>
                </div>

                <Link href='/dashboard'>
                  <Button
                    variant='outline'
                    className='border-white/20 hover:bg-white/10 text-white'
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant='ghost'
                  onClick={handleLogout}
                  className='text-sm text-zinc-400 hover:text-white'
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href='/login'
                  className='text-sm font-medium text-zinc-400 hover:text-white hidden sm:block'
                >
                  Log in
                </Link>
                <Link href='/register'>
                  <Button className='bg-primary hover:bg-primary/90 text-white border-0'>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
