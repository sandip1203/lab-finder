import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-screen w-full flex flex-col bg-gray-100">{children}</body>
    </html>
  );
}
