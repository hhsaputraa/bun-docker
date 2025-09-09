import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;
const isDevelopment = process.env.NODE_ENV === 'development';

// Check if Supabase credentials are configured
if (!supabaseUrl || !supabaseKey) {
  if (isDevelopment) {
    console.warn('⚠️ WARNING: Missing Supabase credentials. Running in development mode with mock data.');
    console.warn('⚠️ Please update your .env file with valid Supabase credentials for full functionality.');
  } else {
    throw new Error('Missing Supabase credentials. Please check your .env file.');
  }
}

// Create Supabase client or use a mock in development if credentials are missing
let supabaseClient = null;

// Only attempt to create a client if we have valid credentials
if (isDevelopment) {
  // In development mode, we'll use mock data by default
  console.log('🔄 Running in development mode - using mock data');
  
  // Only try to connect to Supabase if credentials look valid
  if (supabaseUrl && supabaseKey && 
      supabaseUrl !== 'your_supabase_url' && 
      supabaseKey !== 'your_supabase_anon_key') {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
      console.log('✅ Supabase client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error);
      console.log('🔄 Falling back to mock data');
      supabaseClient = null;
    }
  }
} else {
  // In production, we require valid Supabase credentials
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl === 'your_supabase_url' || 
      supabaseKey === 'your_supabase_anon_key') {
    throw new Error('Invalid Supabase credentials. Please check your .env file.');
  }
  
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to initialize Supabase client: ${err.message}`);
  }
}

export const supabase = supabaseClient;