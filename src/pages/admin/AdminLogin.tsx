
import React, { useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { SEOHead } from '../../components/layout/SEOHead';

interface AdminLoginProps {
  navigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const checkAdminAccess = async (uid: string): Promise<boolean> => {
    if (!db) {
      throw new Error(
        'Firestore is not initialized. Check your Firebase configuration.'
      );
    }

    const adminDocRef = doc(db, 'admins', uid);
    const adminDoc = await getDoc(adminDocRef);

    return adminDoc.exists() && adminDoc.data().active === true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    if (!auth) {
      setError(
        'Firebase Auth is not initialized. Check your configuration.'
      );
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;
      const isAdmin = await checkAdminAccess(user.uid);

      if (isAdmin) {
        window.location.href = '/admin';
      } else {
        await auth.signOut();
        setError('Access Denied: You do not have admin privileges.');
      }
    } catch (err: any) {
      console.error('Email login error:', err);

      if (err?.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err?.code === 'auth/user-not-found') {
        setError('No account exists with this email address.');
      } else if (err?.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err?.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(
          err?.message || 'Failed to login. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    if (!auth) {
      setError(
        'Firebase Auth is not initialized. Check your configuration.'
      );
      setGoogleLoading(false);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      console.log('Google account:', user.email);
      console.log('Firebase UID:', user.uid);

      const isAdmin = await checkAdminAccess(user.uid);

      if (isAdmin) {
        navigate('/admin');
      } else {
        await auth.signOut();

        const emailAddress = user.email || 'This Google account';

        setError(
          emailAddress +
            ' is not authorized to access the admin dashboard.'
        );
      }
    } catch (err: any) {
      console.error('Google login error:', err);

      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in was cancelled.');
      } else if (err?.code === 'auth/popup-blocked') {
        setError(
          'Google sign-in popup was blocked. Please allow popups for this site.'
        );
      } else if (err?.code === 'auth/account-exists-with-different-credential') {
        setError(
          'An account already exists with this email using another sign-in method.'
        );
      } else if (err?.code === 'auth/unauthorized-domain') {
        setError(
          'This domain is not authorized in Firebase Authentication settings.'
        );
      } else if (err?.code === 'auth/operation-not-allowed') {
        setError(
          'Google sign-in is not enabled in Firebase Authentication.'
        );
      } else {
        setError(
          err?.message || 'Google sign-in failed. Please try again.'
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const isLoading = loading || googleLoading;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-50">
      <SEOHead
        title="Admin Login"
        description="Admin Login"
      />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8">

        <div className="text-center mb-8 space-y-2">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Admin Console
          </h1>

          <p className="text-sm text-slate-500">
            Sign in to manage the application.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* GOOGLE LOGIN */}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.4Z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.52A9.74 9.74 0 0 0 12 21.5Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.54 13.6a5.86 5.86 0 0 1 0-3.2V7.88H3.29a9.75 9.75 0 0 0 0 8.24l3.25-2.52Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6.37c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.49 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.38l3.25 2.52C7.31 8.09 9.46 6.37 12 6.37Z"
                />
              </svg>

              Continue with Google
            </>
          )}
        </button>

        {/* DIVIDER */}

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />

          <span className="text-xs font-semibold text-slate-400 uppercase">
            OR
          </span>

          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* EMAIL LOGIN */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-slate-100"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-slate-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Login to Dashboard'
            )}
          </button>

        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Authorized administrators only
        </p>

      </div>
    </div>
  );
};

