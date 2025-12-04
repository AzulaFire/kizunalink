'use client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Dashboard() {
  const user = { name: 'Alex', isPremium: false }; // Mock

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />
      <main className='max-w-6xl mx-auto px-4 py-12'>
        <div className='flex flex-col md:flex-row justify-between items-end mb-8 gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-zinc-900 dark:text-white'>
              Dashboard
            </h1>
            <p className='text-zinc-500'>Welcome back, {user.name}.</p>
          </div>
          {/* Quick Action */}
          <Link href='/dashboard/create-event'>
            <Button
              className={
                user.isPremium
                  ? 'bg-indigo-600'
                  : 'opacity-50 cursor-not-allowed'
              }
              title={!user.isPremium ? 'Upgrade to create events' : ''}
            >
              {user.isPremium ? '+ Create Event' : '🔒 Create Event (Premium)'}
            </Button>
          </Link>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column: My Schedule */}
          <div className='lg:col-span-2 space-y-6'>
            <h2 className='text-xl font-semibold'>Your Schedule</h2>

            {/* Empty State */}
            {/* <div className="text-center py-12 bg-white rounded-xl border border-dashed">
              <p className="text-zinc-500">You haven't joined any circles yet.</p>
              <Link href="/events" className="text-indigo-600 text-sm mt-2 block hover:underline">Find a group</Link>
            </div> */}

            {/* Populated State */}
            <div className='space-y-4'>
              <Card className='flex flex-row items-center p-4 gap-4'>
                <div className='bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg text-center min-w-[70px]'>
                  <div className='text-xs uppercase font-bold text-red-500'>
                    Oct
                  </div>
                  <div className='text-xl font-bold'>24</div>
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold'>Shibuya Startup Night</h3>
                  <p className='text-sm text-zinc-500'>19:00 • Shibuya</p>
                </div>
                <Button size='sm' variant='outline'>
                  View
                </Button>
              </Card>

              <Card className='flex flex-row items-center p-4 gap-4'>
                <div className='bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg text-center min-w-[70px]'>
                  <div className='text-xs uppercase font-bold text-red-500'>
                    Oct
                  </div>
                  <div className='text-xl font-bold'>28</div>
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold'>Sunday Morning Hike</h3>
                  <p className='text-sm text-zinc-500'>08:00 • Mt. Takao</p>
                </div>
                <Button size='sm' variant='outline'>
                  View
                </Button>
              </Card>
            </div>
          </div>

          {/* Right Column: Profile & Stats */}
          <div className='space-y-6'>
            <Card className='bg-white dark:bg-zinc-900'>
              <CardHeader>
                <CardTitle>Your Identity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2 mb-4'>
                  <span className='bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full'>
                    📸 Photography
                  </span>
                  <span className='bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full'>
                    ⛰️ Hiking
                  </span>
                </div>
                <Link href='/profile/edit'>
                  <Button variant='outline' size='sm' className='w-full'>
                    Edit Tags
                  </Button>
                </Link>
              </CardContent>
            </Card>

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
          </div>
        </div>
      </main>
    </div>
  );
}
