import { NextResponse } from 'next/server';
import twilio from 'twilio';
import OpenAI from 'openai';
import { getCurrentDateTime } from '../utils/dateTime';
import { getExchangeRate } from '../utils/exchangeRate';
import { addLead, checkAndAddMeeting, getCalendarEvents, getCalendarEventsForRooms } from '../utils/bitrix';
import { authorizeWhatsAppAccess, setAuthorizedUser, getAuthorizedUser } from '../utils/authorized_users';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function executeFunction(functionName: string, args: any) {
  console.log(`Executing function: ${functionName} with args:`, args);
  try {
    switch (functionName) {
      case "get_calendar_events":
      case "bitrix_get_calendar_events":
        if (args.rooms) {
          return await getCalendarEventsForRooms(args.rooms, args.from, args.to);
        } else {
          return await getCalendarEvents(args.room, args.from, args.to);
        }
      case "add_lead":
      case "bitrix_add_lead":
        return await addLead(args);
      case "check_and_add_meeting":
      case "bitrix_add_meeting":
        return await checkAndAddMeeting(args);
      case "get_current_datetime":
        return getCurrentDateTime();
      case "get_exchange_rate":
        return await getExchangeRate();
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  } catch (error) {
    console.error(`Error executing function ${functionName}:`, error);
    return { error: error.message };
  }
}

export async function POST(req: Request) {
  console.log('Received WhatsApp message');
  
  const body = await req.text();
  const params = new URLSearchParams(body);
  const incomingMessage = params.get('Body');
  const from = params.get('From');

  console.log(`Message from ${from}: ${incomingMessage}`);

  // Verifică dacă utilizatorul este autorizat
  const phoneNumber = from!.replace('whatsapp:', '');
  const authorizedUser = authorizeWhatsAppAccess(phoneNumber);

  // Inițializează clientul Twilio
  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  if (!authorizedUser) {
    console.log(`Unauthorized access attempt from ${from}`);
    
    // Trimite mesajul cu link-ul YouTube pentru utilizatorii neautorizați
    await twilioClient.messages.create({
      body: "Acces neautorizat. Vă rugăm să vizionați acest video pentru mai multe informații: https://youtu.be/e3haeOxhV0E?si=LdWhrYJy8q9aAxgg",
      from: 'whatsapp:+15556008949',
      to: from!
    });

    return NextResponse.json({ message: "Unauthorized access message sent" }, { status: 401 });
  }

  // Setează utilizatorul autorizat
  setAuthorizedUser(phoneNumber, authorizedUser);

  try {
    console.log('Creating thread');
    const thread = await openai.beta.threads.create();
    console.log(`Thread created: ${thread.id}`);

    console.log('Adding message to thread');
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: incomingMessage,
    });

    console.log('Running assistant');
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    });

    console.log('Waiting for assistant to complete');
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    let attempts = 0;
    const maxAttempts = 30; // 30 secunde

    while (runStatus.status !== "completed" && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log(`Run status: ${runStatus.status}`);
      attempts++;

      if (runStatus.status === "requires_action") {
        const toolCalls = runStatus.required_action?.submit_tool_outputs.tool_calls;
        if (toolCalls) {
          const toolOutputs = await Promise.all(toolCalls.map(async (toolCall) => {
            const result = await executeFunction(toolCall.function.name, JSON.parse(toolCall.function.arguments));
            return {
              tool_call_id: toolCall.id,
              output: JSON.stringify(result),
            };
          }));

          await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
            tool_outputs: toolOutputs,
          });
        }
      }
    }

    if (attempts >= maxAttempts) {
      console.error("Assistant timed out");
      return NextResponse.json({ error: "Asistentul a întâmpinat o problemă. Vă rugăm să încercați din nou." });
    }

    console.log('Retrieving messages');
    const messages = await openai.beta.threads.messages.list(thread.id);

    const assistantResponse = messages.data
      .filter(message => message.role === "assistant")
      .pop()?.content
      .filter(content => content.type === 'text')
      .map(content => (content as any).text.value)
      .join('\n') || "Îmi pare rău, nu am putut genera un răspuns.";

    console.log(`Assistant response: ${assistantResponse}`);

    // Personalizează răspunsul cu numele utilizatorului
    const personalizedResponse = `${authorizedUser.name.split(' ')[0]}, ${assistantResponse}`;

    // Trimite răspunsul înapoi prin Twilio
    await twilioClient.messages.create({
      body: personalizedResponse,
      from: 'whatsapp:+15556008949',
      to: from!
    });

    console.log('Response sent back to WhatsApp');

    return NextResponse.json({ message: "Message processed successfully" });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}