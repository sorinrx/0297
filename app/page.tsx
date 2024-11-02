  "use client";

  import React from "react";
  import { useSession, signOut } from "next-auth/react";
  import styles from "./page.module.css";

  function Home() {
    const { data: session } = useSession();

    if (!session) {
      return null;
    }

    return (
      <main className={styles.main}>
        <div className={styles.title}>
          Alege!
        </div>
        <div className={styles.container}>
          <a className={styles.redPill} href="/examples/all">
            Red Pill
          </a>
          <div className={styles.spacer}></div>
          <button className={styles.bluePill} onClick={() => signOut()}>
            Blue Pill
          </button>
        </div>
      </main>
    );
  }

  export default Home;