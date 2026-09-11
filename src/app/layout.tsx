import "./globals.css";

export const metadata = {
  title: "Fitness Center Management System",
  description: "Modern fitness center management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
