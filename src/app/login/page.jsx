'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4'>
      <Card className='w-full max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Welcome back</CardTitle>
          <CardDescription>
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          {error && (
            <Alert
              variant='destructive'
              className='bg-red-50 text-red-600 border-red-200'
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className='space-y-4'>
            <div className='grid gap-2'>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                name='email'
                type='email'
                placeholder='m@example.com'
                className='p-2 border rounded-md w-full bg-transparent'
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='password'>Password</label>
              <input
                id='password'
                name='password'
                type='password'
                className='p-2 border rounded-md w-full bg-transparent'
              />
            </div>
            <Button className='w-full' disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col gap-2'>
          <div className='text-sm text-center text-zinc-500'>
            Don&apos;t have an account?{' '}
            <Link href='/register' className='text-indigo-600 hover:underline'>
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
