"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Chat from "@/app/components/chat";
import { getWeather } from "@/app/utils/weather";
import { getExchangeRate } from "@/app/utils/exchangeRate";
import { getCurrentDateTime } from "@/app/utils/dateTime";
import { addLead, checkAndAddMeeting, getCalendarEvents, getCalendarEventsForRooms } from "@/app/utils/bitrix";
import { calculateTaxeNotariale } from "@/app/utils/taxeNotariale";

const FunctionCalling = () => {
  const [messages, setMessages] = useState([]);
  const [predefinedQuestion, setPredefinedQuestion] = useState("");

  const functionCallHandler = async (call) => {
    let result = {};
    try {
      console.log('Function call received:', call);
      if (call?.function?.name === "get_weather") {
        const args = JSON.parse(call.function.arguments);
        const data = getWeather(args.location);
        result = { output: data };
      } else if (call?.function?.name === "get_exchange_rate") {
        const data = await getExchangeRate();
        result = { output: data };
      } else if (call?.function?.name === "bitrix_add_lead") {
        const args = JSON.parse(call.function.arguments);
        const data = await addLead(args);
        result = { output: data };
      } else if (call?.function?.name === "bitrix_add_meeting") {
        const args = JSON.parse(call.function.arguments);
        const data = await checkAndAddMeeting(args);
        result = { output: data };
      } else if (call?.function?.name === "get_current_datetime") {
        const data = getCurrentDateTime();
        result = { output: data };
      } else if (call?.function?.name === "bitrix_get_calendar_events") {
        const args = JSON.parse(call.function.arguments);
        const data = await getCalendarEventsForRooms(args.rooms, args.from, args.to);
        result = data;
      } else if (call?.function?.name === "calculate_taxe_notariale") {
        const args = JSON.parse(call.function.arguments);
        const data = await calculateTaxeNotariale(args);
        result = { output: data };
      }
    } catch (error) {
      console.error(`Failed to ${call?.function?.name}:`, error);
      result = { error: error.message };
    }
    console.log('Function result:', result);
    return JSON.stringify(result);
  };

  return (
      <main className={styles.main}>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat
              functionCallHandler={functionCallHandler}
              initialMessages={messages}
              predefinedQuestion={predefinedQuestion}
              setShowButtons={() => {}}
            />
          </div>
        </div>
      </main>
  );
};

export default FunctionCalling;