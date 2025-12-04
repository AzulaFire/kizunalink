import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function EventCard({ event }) {
  // Helper for vibe visual
  const getVibeBadge = (vibe) => {
    switch (vibe) {
      case 'chill':
        return (
          <span className='bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200'>
            🍵 Chill Vibe
          </span>
        );
      case 'serious':
        return (
          <span className='bg-zinc-100 text-zinc-700 text-[10px] px-2 py-0.5 rounded-full border border-zinc-200'>
            🔥 Serious/Focus
          </span>
        );
      case 'learning':
        return (
          <span className='bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full border border-blue-200'>
            📚 Learning
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card className='flex flex-col justify-between hover:shadow-md transition-shadow group border-zinc-200 dark:border-zinc-800'>
      <CardHeader className='pb-3'>
        <div className='flex flex-wrap gap-2 mb-3'>
          {/* Solo Badge */}
          {event.is_solo_friendly && (
            <span className='bg-indigo-100 text-indigo-700 text-[10px] font-medium px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1'>
              🔰 Solo-Friendly
            </span>
          )}
          {/* Vibe Badge */}
          {getVibeBadge(event.vibe)}
        </div>

        <CardTitle className='text-xl group-hover:text-indigo-600 transition-colors'>
          {event.title}
        </CardTitle>
        <CardDescription className='flex items-center gap-2 mt-1'>
          <span>{event.date}</span>
          <span>•</span>
          <span>{event.loc}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className='text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400'>
          {event.description ||
            'Join us for an amazing evening of connection and learning. Meet like-minded individuals in your area.'}
        </p>

        {/* Commuter Match Indicator (Future Feature placeholder) */}
        {event.isCommuterMatch && (
          <p className='text-xs text-orange-600 mt-3 flex items-center gap-1'>
            🚃 On your Chuo Line commute
          </p>
        )}
      </CardContent>

      <CardFooter className='pt-2'>
        <Link href={`/events/${event.id}`} className='w-full'>
          <Button
            variant='outline'
            className='w-full group-hover:border-indigo-200 group-hover:bg-indigo-50 dark:group-hover:bg-zinc-800 dark:group-hover:border-zinc-700'
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
