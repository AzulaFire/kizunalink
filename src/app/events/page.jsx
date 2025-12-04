import Navbar from '@/components/Navbar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock Data for MVP
const events = [
  {
    id: 1,
    title: 'Shibuya Startup Night',
    date: 'Oct 24, 19:00',
    loc: 'Shibuya, Tokyo',
    tags: ['Tech', 'Networking'],
  },
  {
    id: 2,
    title: 'Sunday Morning Hike',
    date: 'Oct 28, 08:00',
    loc: 'Mt. Takao',
    tags: ['Outdoors', 'Fitness'],
  },
  {
    id: 3,
    title: 'English/Japanese Exchange',
    date: 'Oct 25, 18:30',
    loc: 'Umeda, Osaka',
    tags: ['Language'],
  },
];

export default function EventsPage() {
  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />
      <main className='max-w-7xl mx-auto px-4 py-12'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Upcoming Events
            </h2>
            <p className='text-zinc-500'>Join a community near you.</p>
          </div>
          {/* Filter Bar Placeholder */}
          <div className='flex gap-2'>
            <select className='h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
              <option>All Cities</option>
              <option>Tokyo</option>
              <option>Osaka</option>
            </select>
            <select className='h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
              <option>All Categories</option>
              <option>Tech</option>
              <option>Outdoors</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {events.map((e) => (
            <Card key={e.id} className='flex flex-col justify-between'>
              <CardHeader>
                <div className='flex gap-2 mb-2'>
                  {e.tags.map((tag) => (
                    <span
                      key={tag}
                      className='bg-zinc-100 text-zinc-600 text-xs px-2 py-1 rounded-full dark:bg-zinc-800 dark:text-zinc-400'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <CardTitle className='text-xl'>{e.title}</CardTitle>
                <CardDescription>
                  {e.date} • {e.loc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-zinc-500 line-clamp-2'>
                  Join us for an amazing evening of connection and learning.
                  Meet like-minded individuals in your area.
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/events/${e.id}`} className='w-full'>
                  <Button className='w-full' variant='outline'>
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
