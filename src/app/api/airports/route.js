import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

console.log('🔍 Checking env vars...');
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  const { data, error } = await supabase
    .from('airports')
    .select('iata_code, name, city, country')
    .or(`iata_code.ilike.%${query}%,city.ilike.%${query}%`)
    .limit(8)

  if (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}