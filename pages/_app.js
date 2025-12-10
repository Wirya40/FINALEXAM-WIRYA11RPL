import "../styles/globals.css";
import TopBar from "@/components/TopBar";
import { GlobalProvider } from "@/context/GlobalContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <TopBar />
      <Component {...pageProps} />
    </GlobalProvider>
  );
}
