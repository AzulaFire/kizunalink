import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col bg-zinc-50 dark:bg-black'>
      <Navbar />

      {/* Hero Section */}
      <section className='py-20 px-4 text-center space-y-6 max-w-4xl mx-auto mt-10'>
        <div className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100'>
          Now Live in Tokyo & Osaka
        </div>
        <h1 className='text-5xl sm:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white'>
          Find your circle <br className='hidden sm:block' />
          <span className='text-indigo-600'>in Japan.kq</span>
        </h1>
        <p className='text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto'>
          Discover local hobby groups, language exchanges, and tech meetups.
          Connect with real people in the real world.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
          <Link href='/events'>
            <Button size='lg' className='h-12 px-8 text-base'>
              Browse Events
            </Button>
          </Link>
          <Link href='/pricing'>
            <Button
              variant='outline'
              size='lg'
              className='h-12 px-8 text-base bg-white dark:bg-zinc-900'
            >
              Create Event
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Locations/Hobbies */}
      <section className='py-20 bg-white dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <FeatureCard
              title='Tokyo Tech'
              count='12 active events'
              icon='💻'
            />
            <FeatureCard
              title='Osaka Language Exchange'
              count='8 active events'
              icon='cJ'
            />
            <FeatureCard
              title='Weekend Hiking'
              count='24 active events'
              icon='Vm'
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, count, icon }) {
  return (
    <Card className='hover:shadow-md transition-shadow cursor-pointer'>
      <CardHeader className='flex flex-row items-center gap-4'>
        <div className='size-12 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-2xl'>
          {icon}
        </div>
        <div>
          <CardTitle className='text-lg'>{title}</CardTitle>
          <CardDescription>{count}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
