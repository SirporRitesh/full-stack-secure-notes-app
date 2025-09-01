import { useEffect } from "react";

export default function GoogleLogin() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
      // success -> redirect
      window.location.href = "https://hdnotesapplicationapp.vercel.app/dashboard";
    } else {
      // Handle error
    }
  };

  return (
    <div>
      <div id="googleBtn"></div>
    </div>
  );
}