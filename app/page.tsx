"use client";

import React from "react";
import styles from "./page.module.css";

function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.title}>
        Alege!
      </div>
      <div className={styles.container}>
        <a className={styles.bluePill} href="/examples/all">
          Blue Pill
        </a>
        <div className={styles.spacer}></div>
        <a className={styles.redPill} href="/examples/all">
          Red Pill
        </a>
      </div>
    </main>
  );
}

export default Home;