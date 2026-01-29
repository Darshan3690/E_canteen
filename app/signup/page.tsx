import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      padding: 24 
    }}>
      <SignUp 
        routing="hash"
        signInUrl="/login"
        fallbackRedirectUrl="/select-role"
      />
    </div>
  );
}