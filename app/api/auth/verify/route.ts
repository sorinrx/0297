import { NextResponse } from 'next/server';
import { findEmployeeByEmail, authorizeWhatsAppAccess } from '@/app/utils/authorized_users';

export async function POST(request: Request) {
  try {
    const { phoneNumber, code } = await request.json();

    // Check if the verification code exists and is valid
    const storedData = global.verificationCodes?.[phoneNumber];
    
    if (!storedData) {
      return NextResponse.json(
        { error: 'No verification code found' },
        { status: 400 }
      );
    }

    // Check if code has expired (15 minutes)
    if (Date.now() - storedData.timestamp > 15 * 60 * 1000) {
      delete global.verificationCodes[phoneNumber];
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      );
    }

    // Verify the code
    if (storedData.code !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Get employee data
    const employee = await authorizeWhatsAppAccess(phoneNumber);
    
    if (!employee) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Clean up the verification code
    delete global.verificationCodes[phoneNumber];

    // Return user data for the frontend
    return NextResponse.json({
      success: true,
      user: {
        name: employee.name,
        phoneprivatenumber: employee.phoneprivatenumber
      }
    });

  } catch (error) {
    console.error('Error in verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
