"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
};

const UserMessage = ({ text }: { text: string }) => {
  return <div className={styles.userMessage}>{text}</div>;
};

const AssistantMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.assistantMessage}>
      <Markdown>{text}</Markdown>
    </div>
  );
};

const CodeMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.codeMessage}>
      {text.split("\n").map((line, index) => (
        <div key={index}>
          <span>{`${index + 1}. `}</span>
          {line}
        </div>
      ))}
    </div>
  );
};

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    case "code":
      return <CodeMessage text={text} />;
    default:
      return null;
  }
};

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
  initialMessages?: MessageProps[];
  predefinedQuestion?: string;
  setShowButtons: (show: boolean) => void;
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""),
  initialMessages = [],
  predefinedQuestion = "",
  setShowButtons,
}: ChatProps) => {
  const [userInput, setUserInput] = useState(predefinedQuestion);
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [showPredefinedButtons, setShowPredefinedButtons] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  useEffect(() => {
    if (predefinedQuestion) {
      setUserInput(predefinedQuestion);
      handleSubmit(new Event("submit") as unknown as React.FormEvent);
    }
  }, [predefinedQuestion]);

  const sendMessage = async (text: string) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content: text,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const submitActionResult = async (runId: string, toolCallOutputs: any[]) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs.map(({ output, tool_call_id }) => ({
            output,
            tool_call_id,
          })),
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);
    setShowButtons(false);
    setShowPredefinedButtons(false);
    scrollToBottom();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handlePredefinedQuestion = (question: string) => {
    setUserInput(question);
    sendMessage(question);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: question },
    ]);
    setUserInput(""); // Resetează prompt-ul
    setInputDisabled(true);
    setShowButtons(false);
    setShowPredefinedButtons(false);
    scrollToBottom();
  };

  const handleTextCreated = () => {
    appendMessage("assistant", "");
    setShowButtons(false);
  };

  const handleTextDelta = (delta: any) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    }
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  const handleImageFileDone = (image: any) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  };

  const toolCallCreated = (toolCall: any) => {
    if (toolCall.type != "code_interpreter") return;
    appendMessage("code", "");
  };

  const handleToolCallDelta = (delta: any) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    }
  };

  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  const handleRunCompleted = () => {
    setInputDisabled(false);
  };

  const handleReadableStream = (stream: AssistantStream) => {
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);
    stream.on("imageFileDone", handleImageFileDone);
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", handleToolCallDelta);
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };

  const appendToLastMessage = (text: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role: "user" | "assistant" | "code", text: string) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const annotateLastMessage = (annotations: any) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
      };
      annotations.forEach((annotation: any) => {
        if (annotation.type === "file_path") {
          updatedLastMessage.text = updatedLastMessage.text.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`
          );
        }
      });
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        {showPredefinedButtons && (
          <div className={styles.buttonContainer}>
            <button
              className={styles.predefinedButton}
              onClick={() => handlePredefinedQuestion("Ce știi să faci?")}
            >
              Ce știi să faci?
            </button>
            <button
              className={styles.predefinedButton}
              onClick={() => handlePredefinedQuestion("Ce trebuie să-ți dau pentru a pune o întâlnire in Bitrix24 prin tine?")}
            >
              Rezervă sala
            </button>
            <button
              className={styles.predefinedButton}
              onClick={() => handlePredefinedQuestion("Ce trebuie să-ți dau pentru a calcula taxele notariale?")}
            >
              Taxe Notariale
            </button>
            <button
              className={styles.predefinedButton}
              onClick={() => handlePredefinedQuestion("Ce informații trebuie să-ți dau ca să-mi introduci un lead in Bitrix24 ?")}
            >
              Adăugă Lead
            </button>
            <button
              className={styles.predefinedButton}
              onClick={() => handlePredefinedQuestion("Cât este azi cursul euro/leu la BNR ?")}
            >
              Cursul BNR
            </button>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className={`${styles.inputForm} ${styles.clearfix}`}
        >
          <textarea
            ref={textareaRef}
            className={styles.input}
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              handleResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter your question"
            rows={1}
            disabled={inputDisabled}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={inputDisabled}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;