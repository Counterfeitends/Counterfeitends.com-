// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Counterfeitends",
  description: "Counterfeitends — index.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
