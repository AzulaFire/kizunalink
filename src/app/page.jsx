'use client';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [createLink, setCreateLink] = useState('/pricing');
  const [featuredCities, setFeaturedCities] = useState([]);
  const [featuredHobbies, setFeaturedHobbies] = useState([]);

  useEffect(() => {
    const initData = async () => {
      // 1. Check Premium
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();

        if (profile?.is_premium) {
          setCreateLink('/dashboard/create-event');
        }
      }

      // 2. Fetch Featured Cities
      const { data: cities } = await supabase
        .from('cities')
        .select('*')
        .eq('is_featured', true)
        .limit(3);
      setFeaturedCities(cities || []);

      // 3. Fetch Featured Hobby Categories
      const { data: hobbies } = await supabase
        .from('hobbies')
        .select('category, emoji')
        .limit(10);

      // Filter unique categories client-side for display
      const uniqueCats = [];
      const seen = new Set();
      if (hobbies) {
        for (const h of hobbies) {
          if (!seen.has(h.category)) {
            seen.add(h.category);
            uniqueCats.push(h);
          }
          if (uniqueCats.length >= 3) break;
        }
      }
      setFeaturedHobbies(uniqueCats);
    };
    initData();
  }, []);

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      {/* Hero Section */}
      <section className='py-24 px-4 text-center space-y-8 max-w-4xl mx-auto mt-10'>
        <div className='inline-flex items-center rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold bg-primary/10 text-primary-foreground'>
          Now Live in{' '}
          {featuredCities.length > 0
            ? featuredCities.map((c) => c.name).join(' & ')
            : 'Japan'}
        </div>
        <h1 className='text-6xl sm:text-7xl font-bold tracking-tight text-white leading-tight'>
          Find your circle <br className='hidden sm:block' />
          <span className='text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400'>
            in Japan.
          </span>
        </h1>
        <p className='text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed'>
          Discover local hobby groups, language exchanges, and tech meetups.
          Connect with real people in the real world.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center pt-6'>
          <Link href='/events'>
            <Button
              size='lg'
              className='h-12 px-8 text-base bg-primary hover:bg-primary/90 border-0 text-white shadow-lg shadow-primary/25'
            >
              Browse Events
            </Button>
          </Link>
          <Link href={createLink}>
            <Button
              variant='outline'
              size='lg'
              className='h-12 px-8 text-base border-white/20 hover:bg-white/10 text-white'
            >
              Create Event
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Interactive Section */}
      <section className='py-24 bg-card border-t border-white/5'>
        <div className='max-w-7xl mx-auto px-4'>
          <h2 className='text-2xl font-bold text-white mb-8'>
            Featured Communities
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Dynamic Cities */}
            {featuredCities.map((city) => (
              <Link href={`/events?city=${city.name}`} key={city.id}>
                <FeatureCard
                  title={`${city.name} Hub`}
                  desc={`Explore events happening in ${city.name}.`}
                  icon='🏙️'
                />
              </Link>
            ))}

            {/* Dynamic Categories */}
            {featuredHobbies.map((h, i) => (
              <Link href={`/events?category=${h.category}`} key={i}>
                <FeatureCard
                  title={h.category}
                  desc={`Connect with ${h.category.toLowerCase()} enthusiasts.`}
                  icon={h.emoji || '✨'}
                />
              </Link>
            ))}

            {/* Static Fallback if DB is empty */}
            {featuredCities.length === 0 && featuredHobbies.length === 0 && (
              <>
                <FeatureCard
                  title='Tokyo Hub'
                  desc='Events in the capital.'
                  icon='🗼'
                />
                <FeatureCard
                  title='Osaka Vibes'
                  desc='Food & fun in Kansai.'
                  icon='🐙'
                />
                <FeatureCard title='Tech' desc='Coding & Startups.' icon='💻' />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <Card className='hover:border-primary/50 transition-colors cursor-pointer bg-secondary border-white/10 group h-full'>
      <CardHeader className='flex flex-row items-center gap-4'>
        <div className='size-12 rounded-lg bg-black/40 flex items-center justify-center text-2xl border border-white/10 group-hover:scale-110 transition-transform'>
          {icon}
        </div>
        <div>
          <CardTitle className='text-lg text-white group-hover:text-primary transition-colors'>
            {title}
          </CardTitle>
          <CardDescription className='text-zinc-400'>{desc}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
