import { ClerkProvider } from '@clerk/clerk-expo'
import "../global.css";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from "expo-router";

export default function Layout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  )
}
