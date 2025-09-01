import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function GoogleLogin() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const navigate = useNavigate();
  

  useEffect(() => {
    // @ts-ignore
    if (window.google) {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      // @ts-ignore
      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large" }
      );
    }
    
    return () => {
      // @ts-ignore
      if (window.google) {
        // @ts-ignore
        window.google.accounts.id.disableAutoSelect();
      }
    };
  }, [clientId]);

  const handleCredentialResponse = async (response: any) => {
    console.log("Encoded JWT ID token: -------------------");
    const idToken = response.credential;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: idToken }),
      credentials: "include",
    });

    if (res.ok) {
        // Success! Redirect to dashboard
        toast({ title: "Sign-in successful" });
        navigate("/dashboard");
      } else {
        const { error } = await res.json();
        toast({
          title: "Sign-in Failed",
          description: error || "The OTP you entered is incorrect.",
          variant: "destructive",
        });
      }
  };

  return (
    <div>
      <div id="googleBtn"></div>
    </div>
  );
}