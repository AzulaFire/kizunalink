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

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // 1. Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // 2. Create the profile entry (matches our schema)
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            email: email,
            full_name: email.split('@')[0], // Default name
            city: 'Tokyo', // Default city
          },
        ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Non-blocking error, user is still created
        }
      }

      // 3. Redirect
      router.push('/login?registered=true');
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
          <CardTitle className='text-2xl font-bold'>
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your email below to create your account
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
          <form onSubmit={handleRegister} className='space-y-4'>
            <div className='grid gap-2'>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                name='email'
                type='email'
                required
                className='p-2 border rounded-md w-full bg-transparent'
                placeholder='m@example.com'
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='password'>Password</label>
              <input
                id='password'
                name='password'
                type='password'
                required
                className='p-2 border rounded-md w-full bg-transparent'
              />
            </div>
            <Button className='w-full' disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className='text-sm text-center text-zinc-500 w-full'>
            Already have an account?{' '}
            <Link href='/login' className='text-indigo-600 hover:underline'>
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
