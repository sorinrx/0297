"use client";

import { useSession, signIn } from "next-auth/react";
import { authorizedEmails } from "../prezentare-pret/emails";

const PricePresProtectedPage = ({ children }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !session.user?.email) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        gap: '20px' 
      }}>
        <h1>Access Denied</h1>
        <button 
          onClick={() => signIn("google")} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#d22630',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (!authorizedEmails.includes(session.user.email)) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}>
        <h1>Unauthorized Access</h1>
        <p>You don't have permission to view this content.</p>
      </div>
    );
  }

  return children;
};

export default PricePresProtectedPage;