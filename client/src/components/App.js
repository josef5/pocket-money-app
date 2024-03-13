import { useEffect, useRef } from 'react';
import '../css/App.css';
import { NavLink } from 'react-router-dom';
import BankBalance from './Bank/BankBalance';

function App({ session }) {
  // Trigger update in BankBalance when app moves back into foreground
  const bankRef = useRef();

  const appState = () => {
    if (document.visibilityState === 'hidden') {
      return 'hidden';
    }
    if (document.hasFocus()) {
      return 'active';
    }
    return 'passive';
  };

  useEffect(() => {
    console.log('App Mounted');

    let displayState = appState();

    const onDisplayStateChange = () => {
      const nextState = appState();
      const prevState = displayState;

      if (nextState !== prevState) {
        console.log(`State changed: ${prevState} >>> ${nextState}`);

        displayState = nextState;

        if (nextState === 'active') {
          bankRef.current?.triggerReload();
        }
      }
    };

    // Subscribe to all of the events related to visibility
    ['pageshow', 'focus', 'blur', 'visibilitychange', 'resume'].forEach(
      type => {
        window.addEventListener(type, onDisplayStateChange);
      }
    );

    // Cleanup on unmount
    return () => {
      console.log('App Unmounted');

      ['pageshow', 'focus', 'blur', 'visibilitychange', 'resume'].forEach(
        type => {
          window.removeEventListener(type, onDisplayStateChange);
        }
      );
    };
  }, []);

  return (
    <div className="App">
      <BankBalance session={session} ref={bankRef} />
      {session && session.getCurrentUser && (
        <NavLink to="/history" className="link-secondary mt-4">
          See History
        </NavLink>
      )}
    </div>
  );
}

export default App;
