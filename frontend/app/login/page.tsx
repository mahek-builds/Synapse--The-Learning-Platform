import { GoogleLogin } from "@react-oauth/google";
<GoogleLogin
  onSuccess={(credentialResponse) => {
    console.log("Google Login Success", credentialResponse);

    localStorage.setItem(
      "google_token",
      credentialResponse.credential || ""
    );

    navigate("/dashboard");
  }}
  onError={() => {
    console.log("Google Login Failed");
  }}
/>
return (
  <div>
    <h2>Login</h2>

    <input
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={handleLogin}>Login</button>

    <hr />

    <GoogleLogin
      onSuccess={(credentialResponse) => {
        localStorage.setItem(
          "google_token",
          credentialResponse.credential || ""
        );

        navigate("/dashboard");
      }}
      onError={() => {
        console.log("Google Login Failed");
      }}
    />
  </div>
);