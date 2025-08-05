import { useSignIn } from '../hooks/useAuth';

export function SignInPage() {
  const signIn = useSignIn();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    signIn.mutate({ email, password });
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit" disabled={signIn.isPending}>
          {signIn.isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
