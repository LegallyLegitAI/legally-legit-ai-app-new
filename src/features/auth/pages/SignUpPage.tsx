import { useSignUp } from '../hooks/useAuth';

export function SignUpPage() {
  const signUp = useSignUp();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const full_name = formData.get('full_name') as string;
    const business_name = formData.get('business_name') as string;
    
    signUp.mutate({ email, password, full_name, business_name });
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="full_name" placeholder="Full Name" required />
        <input type="text" name="business_name" placeholder="Business Name" />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit" disabled={signUp.isPending}>
          {signUp.isPending ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
