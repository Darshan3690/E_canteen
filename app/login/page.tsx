import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      padding: 24 
    }}>
      <SignIn 
        routing="hash"
        signUpUrl="/signup"
        fallbackRedirectUrl="/select-role"
      />
    </div>
  );
}