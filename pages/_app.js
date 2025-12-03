import "@/styles/globals.css";
import { GlobalProvider } from "@/context/GlobalContext";
import { ConfigProvider } from "antd";

export default function MyApp({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <ConfigProvider>
        <Component {...pageProps} />
      </ConfigProvider>
    </GlobalProvider>
  );
}
