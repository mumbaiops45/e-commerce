import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Hotel Guest Supplys | Premium Biotique Hotel Amenities",
  description: "Wholesale Biotique hotel amenities kits, bath toiletries, guest amenities and housekeeping products for hotels and resorts across India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
