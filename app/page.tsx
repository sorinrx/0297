"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";

function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePhoneNumber = (number: string) => {
    // Romanian phone number format: +40xxxxxxxxx
    const romanianPhoneRegex = /^\+40[0-9]{9}$/;
    return romanianPhoneRegex.test(number);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Număr de telefon invalid. Folosiți formatul: +40xxxxxxxxx");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setShowVerification(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(data.user));

      // Redirect to internal page instead of examples/all
      router.push('/internal');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowVerification(false);
    setVerificationCode("");
    setError("");
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        Autentificare
      </div>
      <div className={styles.container}>
        {!showVerification ? (
          <form onSubmit={handleSendCode} className={styles.form}>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Număr de telefon (+40...)"
              required
              className={styles.input}
              pattern="\+40[0-9]{9}"
            />
            <button 
              type="submit" 
              disabled={loading}
              className={styles.button}
            >
              {loading ? 'Se trimite...' : 'Trimite cod'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className={styles.form}>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Cod de verificare"
              required
              className={styles.input}
              maxLength={6}
              pattern="[0-9]{6}"
            />
            <button 
              type="submit" 
              disabled={loading}
              className={styles.button}
            >
              {loading ? 'Se verifică...' : 'Verifică'}
            </button>
            <button 
              type="button"
              onClick={handleBack}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Înapoi
            </button>
          </form>
        )}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </main>
  );
}

export default Home;
