import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export const metadata = {
  title: "Money Pay",
  description: "Only place to manage all your finances",
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen mt-28">{children}</main>
          <Toaster richColors />
          <footer className=" py-12 bg-blue-100">
            <div className="container mx-auto px-4 text-center text-gray-600">
              Made by Sushovan bhattarai @2025
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
