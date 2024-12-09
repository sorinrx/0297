"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

interface UserData {
  name: string;
  phonePrivateNumber: string;
}

export default function InternalPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) {
      router.push('/'); // Redirect to login if no user data
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/');
    }
  }, []);

  const handleChatAI = () => {
    router.push('/examples/all');
  };

  if (!userData) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div>Se încarcă...</div>
        </div>
      </main>
    );
  }

  // Split name into first and last name
  const [firstName, ...lastNameParts] = userData.name.split(' ');
  const lastName = lastNameParts.join(' ');

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.welcome}>
          Bun venit, {firstName} {lastName}
        </h1>
        <button 
          onClick={handleChatAI}
          className={styles.chatButton}
        >
          ChatAI
        </button>
      </div>
    </main>
  );
}
