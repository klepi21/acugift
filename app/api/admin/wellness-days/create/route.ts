import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { format, addMinutes } from 'date-fns';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const { date, start_time, end_time } = await request.json();

    if (!date || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create wellness day
    const { data: dayData, error: dayError } = await supabase
      .from('wellness_days')
      .insert([
        { date, start_time, end_time }
      ])
      .select()
      .single();

    if (dayError) {
      console.error('Error creating wellness day:', dayError);
      throw dayError;
    }

    // Generate 15-minute slots
    const slots = [];
    let currentTime = new Date(`1970-01-01T${start_time}`);
    const endTimeDate = new Date(`1970-01-01T${end_time}`);

    while (currentTime < endTimeDate) {
      const slotEndTime = addMinutes(currentTime, 15);
      
      slots.push({
        wellness_day_id: dayData.id,
        start_time: format(currentTime, 'HH:mm:ss'),
        end_time: format(slotEndTime, 'HH:mm:ss'),
        is_booked: false
      });

      currentTime = slotEndTime;
    }

    // Create slots
    const { error: slotsError } = await supabase
      .from('wellness_slots')
      .insert(slots);

    if (slotsError) {
      console.error('Error creating slots:', slotsError);
      throw slotsError;
    }

    return NextResponse.json({ success: true, data: dayData });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 