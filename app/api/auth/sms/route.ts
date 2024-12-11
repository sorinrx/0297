import { NextResponse } from 'next/server';
import { authorizeWhatsAppAccess } from '@/app/utils/authorized_users';
import { createClient } from '@supabase/supabase-js';

const SMSAPI_URL = 'https://api.smsapi.com/sms.do';
const SMSAPI_TOKEN = process.env.SMSAPI_OAUTH_TOKEN;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendSMS(phoneNumber: string, code: string) {
  try {
    const formData = new URLSearchParams();
    formData.append('to', phoneNumber.replace('+', '')); // Remove + from phone number
    formData.append('message', `Your authentication code is: ${code}`);
    formData.append('format', 'json'); // Request JSON response

    const response = await fetch(SMSAPI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SMSAPI_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const text = await response.text();
    
    // Check if response starts with "OK:"
    if (text.startsWith('OK:')) {
      const [_, id, points] = text.split(':');
      return {
        success: true,
        id,
        points: parseFloat(points)
      };
    }
    
    // Try parsing as JSON if not "OK:" format
    try {
      return JSON.parse(text);
    } catch (e) {
      // If response starts with "ERROR:"
      if (text.startsWith('ERROR:')) {
        const [_, errorCode] = text.split(':');
        throw new Error(`SMS API Error: ${errorCode}`);
      }
      throw new Error(`Invalid response format: ${text}`);
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();
    
    // Verificăm direct în baza de date
    const { data: employees, error: dbError } = await supabase
      .from('employees')
      .select('*');
    
    console.log('All employees in database:', employees);
    console.log('Database error if any:', dbError);
    
    // Check if the phone number is in the authorized list
    console.log('Received phone number:', phoneNumber);

    // Verificăm dacă numărul începe cu + și îl adăugăm dacă lipsește
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    console.log('Formatted phone number:', formattedPhoneNumber);

    const employee = await authorizeWhatsAppAccess(formattedPhoneNumber);
    console.log('Found employee:', employee);
    
    if (!employee) {
      return NextResponse.json(
        { error: 'Unauthorized phone number' },
        { status: 401 }
      );
    }

    // Generate a 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send SMS
    const smsResponse = await sendSMS(phoneNumber, verificationCode);

    if (!smsResponse.success && smsResponse.error) {
      return NextResponse.json(
        { error: `SMS sending failed: ${smsResponse.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Store the verification code in a temporary storage
    global.verificationCodes = global.verificationCodes || {};
    global.verificationCodes[phoneNumber] = {
      code: verificationCode,
      timestamp: Date.now(),
    };

    return NextResponse.json({ 
      success: true,
      message: 'Verification code sent'
    });

  } catch (error) {
    console.error('Error in SMS authentication:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
