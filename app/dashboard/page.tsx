"use client";

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedPage from '../components/ProtectedPage';
import Link from 'next/link';
import styles from '../page.module.css';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedPage>
      <main className={styles.main}>
        <div className={styles.title}>
          Bine ai venit, {user?.name}!
        </div>
        <div className={styles.container}>
          <div className={styles.form}>
            <Link 
              href="/examples/all"
              className={styles.button}
            >
              Chat AI
            </Link>
            <button 
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={() => alert('Această funcționalitate va fi disponibilă în curând!')}
            >
              Întâlniri
            </button>
            {user?.name === 'Sorin Răducu' && (
              <Link 
                href="/admin"
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                Administrare
              </Link>
            )}
            <button 
              onClick={logout}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Deconectare
            </button>
          </div>
        </div>
      </main>
    </ProtectedPage>
  );
} 