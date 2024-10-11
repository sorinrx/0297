// app/components/login.tsx
import { useSession, signIn, signOut } from 'next-auth/react';
import styles from './login.module.css';
import { employees } from '../utils/authorized_users'; // Importă lista de utilizatori autorizați

function Login() {
  const { data: session } = useSession();

  const isAuthorized = session && employees.some(employee => employee.email === session.user?.email);

  return (
    <div>
      {session ? (
        isAuthorized ? (
          <>
            <p>Signed in as {session.user?.email}</p>
            <button className={styles.button} onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <>
            <p>You are not authorized to access this application.</p>
            <button className={styles.button} onClick={() => signOut()}>Sign out</button>
          </>
        )
      ) : (
        <>
          <button className={styles.button} onClick={() => signIn('google')}>Sign in with Google</button>
        </>
      )}
    </div>
  );
}

export default Login;