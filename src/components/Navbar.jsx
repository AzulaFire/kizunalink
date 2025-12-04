'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  // In a real app, you would check Supabase auth state here
  const user = null; // Mock user state

  return (
    <nav className='border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 dark:bg-zinc-950/80 dark:border-zinc-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex items-center gap-8'>
            <Link
              href='/'
              className='text-xl font-bold tracking-tighter text-zinc-900 dark:text-white'
            >
              Kizuna<span className='text-indigo-600'>Link</span>
            </Link>
            <div className='hidden md:flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400'>
              <Link
                href='/events'
                className='hover:text-zinc-900 dark:hover:text-white transition-colors'
              >
                Browse Events
              </Link>
              <Link
                href='/calendar'
                className='hover:text-zinc-900 dark:hover:text-white transition-colors'
              >
                Calendar
              </Link>
              <Link
                href='/pricing'
                className='hover:text-zinc-900 dark:hover:text-white transition-colors'
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            {user ? (
              <Link href='/dashboard'>
                <Button variant='outline'>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link
                  href='/login'
                  className='text-sm font-medium text-zinc-600 hover:text-zinc-900 hidden sm:block'
                >
                  Log in
                </Link>
                <Link href='/register'>
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
