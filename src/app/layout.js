import ReduxProvider from "@/wrapper/ReduxProvider";
import "./globals.css";

export const metadata = {
  title: {
    default: "Rahnimo Admin Panel",
    template: "%s | Rahnimo Admin Panel",
  },
  description: "This is Interior and Architecture site",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
