// app/page.tsx

"use client";

import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Login from "./components/login";
import styles from "./page.module.css";
import { employees } from './utils/authorized_users';
import { processUserQuestion } from './utils/questionUtils';

const Home = () => {
  const { data: session, status } = useSession();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showChat, setShowChat] = useState(false);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <main className={styles.main}>
        <img src="/logoRenet.svg" className={styles.logo} alt="Renet Logo" />
        <div className={styles.title}>RENET AI</div>
        <Login />
      </main>
    );
  }

  const authorizedEmails = employees.map(employee => employee.email);

  if (!authorizedEmails.includes(session.user.email)) {
    return (
      <main className={styles.main}>
        <div className={styles.title}>Unauthorized access</div>
        <button className={styles.bluePill} onClick={() => signOut()}>Blue Pill</button>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user?.email) {
      const response = processUserQuestion(question, session.user.email);
      setAnswer(response);
    } else {
      setAnswer("Vă rugăm să vă autentificați pentru a putea procesa întrebările.");
    }
  };

  if (showChat) {
    return (
      <main className={styles.main}>
        <div className={styles.title}>
          Bine ai venit, {session.user.name}!
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Introduceți întrebarea dvs. aici"
            className={styles.input}
          />
          <button type="submit" className={styles.redPill}>Întreabă</button>
        </form>
        {answer && <p className={styles.answer}>{answer}</p>}
        <button className={styles.bluePill} onClick={() => setShowChat(false)}>Înapoi la meniu</button>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        Alege!
      </div>
      <div className={styles.container}>
        <button className={styles.redPill} onClick={() => setShowChat(true)}>
          Red Pill (Chat AI)
        </button>
        <div className={styles.spacer}></div>
        <a className={styles.redPill} href="/examples/all">
          Red Pill (Original)
        </a>
        <div className={styles.spacer}></div>
        <button className={styles.bluePill} onClick={() => signOut()}>Blue Pill</button>
      </div>
    </main>
  );
};

export default Home;