import "./globals.css";

export const metadata = {
  title: "PopPK/ER Evidence Review Agent",
  description: "Clinical pharmacology and pharmacometrics evidence review assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
