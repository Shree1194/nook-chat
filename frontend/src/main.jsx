import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/react";
import { BrowserRouter } from "react-router";
import ClerkSetup from "./components/auth/ClerkSetup.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { WallpaperProvider } from "./context/WallpaperContext.jsx";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {clerkPublishableKey ? (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      <ThemeProvider>
        <WallpaperProvider>
          <ClerkSetup />
        </WallpaperProvider>
      </ThemeProvider>
    )}
  </StrictMode>,
);
