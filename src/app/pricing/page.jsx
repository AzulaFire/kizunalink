'use client';

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function Pricing() {
  // Replace 'test' with your actual PayPal Client ID from the developer dashboard
  const paypalOptions = {
    'client-id': 'test',
    components: 'buttons',
    vault: true, // Required for subscriptions
    intent: 'subscription',
  };

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black'>
      <Navbar />

      {/* PayPal Script Provider wraps the content where buttons will appear */}
      <PayPalScriptProvider options={paypalOptions}>
        <div className='py-20 px-4 max-w-5xl mx-auto text-center'>
          <h1 className='text-4xl font-bold mb-4 text-zinc-900 dark:text-white'>
            Simple, transparent pricing
          </h1>
          <p className='text-xl text-zinc-500 mb-12'>
            Start your community today.
          </p>

          <div className='grid md:grid-cols-2 gap-8 max-w-3xl mx-auto'>
            {/* Free Tier */}
            <Card className='text-left bg-white dark:bg-zinc-900'>
              <CardHeader>
                <CardTitle>Explorer</CardTitle>
                <CardDescription>For those looking to connect.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <span className='text-4xl font-bold text-zinc-900 dark:text-white'>
                  ¥0
                </span>
                <ul className='space-y-2 text-sm text-zinc-600 dark:text-zinc-400'>
                  <li>✓ Unlimited event browsing</li>
                  <li>✓ Create a profile</li>
                  <li>✓ Filter by city & hobby</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full'>
                  Sign Up Free
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Tier */}
            <Card className='text-left border-indigo-600 border-2 relative overflow-hidden bg-white dark:bg-zinc-900'>
              <div className='absolute top-0 right-0 bg-indigo-600 text-white text-xs px-3 py-1 font-medium'>
                POPULAR
              </div>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
                <CardDescription>
                  For hosts and community leaders.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-baseline gap-1'>
                  <span className='text-4xl font-bold text-zinc-900 dark:text-white'>
                    ¥500
                  </span>
                  <span className='text-zinc-500'>/month</span>
                </div>
                <ul className='space-y-2 text-sm text-zinc-600 dark:text-zinc-400'>
                  <li>✓ Everything in Explorer</li>
                  <li>
                    ✓{' '}
                    <span className='font-bold text-indigo-600'>
                      Create & Manage Events
                    </span>
                  </li>
                  <li>✓ Premium &quot;Host&quot; Badge</li>
                  <li>✓ Priority listing</li>
                </ul>
              </CardContent>
              <CardFooter className='flex flex-col gap-4'>
                {/* PayPal Button Container */}
                <div className='w-full relative z-0'>
                  <PayPalButtons
                    style={{
                      shape: 'rect',
                      color: 'blue',
                      layout: 'vertical',
                      label: 'subscribe',
                    }}
                    createSubscription={(data, actions) => {
                      return actions.subscription.create({
                        /* Replace with your actual Plan ID from PayPal Dashboard 
                           (App Center -> Accept Payments -> Subscriptions)
                        */
                        plan_id: 'YOUR_PAYPAL_PLAN_ID',
                      });
                    }}
                    onApprove={async (data, actions) => {
                      // Optional: Show a loading state here
                      console.log(
                        'Subscription successful:',
                        data.subscriptionID
                      );

                      // Call your backend to update the user's status in Supabase
                      /*
                      await fetch('/api/webhooks/paypal-success', {
                          method: 'POST',
                          body: JSON.stringify({
                              subscriptionID: data.subscriptionID,
                              userId: "CURRENT_USER_ID" // Pass the auth user ID here
                          })
                      });
                      */

                      alert(
                        'Welcome to Premium! Your account has been upgraded.'
                      );
                    }}
                    onError={(err) => {
                      console.error('PayPal Error:', err);
                      alert(
                        'Something went wrong with the payment. Please try again.'
                      );
                    }}
                  />
                </div>
                <p className='text-xs text-zinc-400 text-center'>
                  Secure payment processed by PayPal. Cancel anytime.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </PayPalScriptProvider>
    </div>
  );
}
