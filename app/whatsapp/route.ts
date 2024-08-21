import { NextResponse } from 'next/server';
import twilio from 'twilio';
import OpenAI from 'openai';

interface ThreadInfo {
  threadId: string;
  lastActivity: number;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const THREAD_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const threadStore: { [key: string]: ThreadInfo } = {};

export async function POST(req: Request) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const incomingMessage = params.get('Body');
  const from = params.get('From');

  if (!from) {
    return NextResponse.json({ error: "Missing 'From' parameter" }, { status: 400 });
  }

  try {
    let thread;
    const threadInfo = threadStore[from];

    if (threadInfo && Date.now() - threadInfo.lastActivity < THREAD_TIMEOUT) {
      thread = { id: threadInfo.threadId };
    } else {
      if (threadInfo) {
        await sendTimeoutMessage(from);
      }
      thread = await openai.beta.threads.create();
      threadStore[from] = { threadId: thread.id, lastActivity: Date.now() };
    }

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: incomingMessage || "",
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== "completed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    const assistantResponse = messages.data
      .filter(message => message.role === "assistant")
      .pop()?.content
      .filter(content => content.type === 'text')
      .map(content => (content as any).text.value)
      .join('\n') || "Îmi pare rău, nu am putut genera un răspuns.";

    await twilioClient.messages.create({
      body: assistantResponse,
      from: 'whatsapp:+15556008949',
      to: from
    });

    threadStore[from].lastActivity = Date.now();

    return NextResponse.json({ message: "Message processed successfully" });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

async function sendTimeoutMessage(to: string) {
  await twilioClient.messages.create({
    body: "Conversația anterioară a expirat. Începem o nouă conversație.",
    from: 'whatsapp:+15556008949',
    to: to
  });
}