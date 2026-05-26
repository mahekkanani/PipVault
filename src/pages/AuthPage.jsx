import { useState } from 'react';
import { LockKeyhole, Loader2 } from 'lucide-react';
import Button from '../components/Button.jsx';
import { Field, Input } from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const authAction = mode === 'login' ? signIn : signUp;
      const { error: authError } = await authAction(email.trim(), password);
      if (authError) throw authError;

      if (mode === 'signup') {
        setMessage('Check your email to confirm your account, then sign in.');
      }
    } catch (authError) {
      setError(authError.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLogin = mode === 'login';

  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <section className="w-full max-w-md rounded-lg border border-cyan-400/15 bg-slate-950/90 p-6 shadow-glow">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
            <LockKeyhole size={24} />
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">PipVault</p>
          <h1 className="mt-3 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-3xl font-semibold text-transparent">
            {isLogin ? 'Welcome back' : 'Create your vault'}
          </h1>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-lg border border-cyan-400/15 bg-slate-950 p-1">
          <button
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              isLogin ? 'bg-cyan-300 text-slate-950 shadow-neon' : 'text-cyan-100 hover:bg-cyan-950/50'
            }`}
            onClick={() => setMode('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              !isLogin ? 'bg-cyan-300 text-slate-950 shadow-neon' : 'text-cyan-100 hover:bg-cyan-950/50'
            }`}
            onClick={() => setMode('signup')}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Email">
            <Input
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </Field>
          <Field label="Password">
            <Input
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </Field>

          {error ? <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
          {message ? <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{message}</div> : null}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
            {isLogin ? 'Login' : 'Create Account'}
          </Button>
        </form>
      </section>
    </main>
  );
}
