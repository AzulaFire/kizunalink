import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, city, date, description, hostEmail } = body;

    // 1. TODO: Insert Event into Supabase
    /*
    const { data: event, error } = await supabase
      .from('events')
      .insert([{ title, city, event_date: date, description }])
      .select()
      .single();
    */

    // 2. Fetch users in this city who opted into notifications
    // Mocking the fetch for now
    const interestedUsers = [
      { email: 'user1@example.com', name: 'User One' },
      { email: 'user2@example.com', name: 'User Two' },
    ];

    // 3. Send Email Notifications via Resend
    // We use Promise.all to send them in parallel, or use Resend's batch API
    if (interestedUsers.length > 0) {
      await resend.emails.send({
        from: 'KizunaLink <notifications@kizunalink.com>',
        to: interestedUsers.map((u) => u.email),
        subject: `New Event in ${city}: ${title}`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h1>New Event Alert! 🇯🇵</h1>
            <p>A new event just popped up in <strong>${city}</strong>.</p>
            <div style="border: 1px solid #eee; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">${title}</h2>
              <p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>
              <p>${description}</p>
              <a href="https://kizunalink.com/events/new-id" style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Event</a>
            </div>
            <p style="font-size: 12px; color: #666;">You are receiving this because you follow ${city}.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Event created and notifications sent',
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
