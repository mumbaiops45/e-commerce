"use client";

import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[var(--accent)] text-white pt-12 pb-6 px-6 md:px-16">

      {/* ================= TOP GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Hotel Guest Supply</h2>
          <p className="text-sm text-white/80 leading-relaxed">
            We supply premium hotel essentials, amenities, and housekeeping
            products to hotels, resorts, villas and boutique stays across India.
            Quality-checked, GST-ready and delivered on time.
          </p>
        </div>

        {/* Information */}
        <div>
          <h3 className="font-semibold mb-3">Information</h3>
          <ul className="space-y-2 text-sm text-white/80">
            {[
              "About Us",
              "My Account",
              "Contact Us",
              "Help Center",
              "FAQs",
              "Privacy Policy",
              "Terms & Conditions",
              "Return Policy",
              "Shipping Policy",
            ].map((item, i) => (
              <li key={i} className="hover:text-white cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-semibold mb-3">Our Collection</h3>
          <ul className="space-y-2 text-sm text-white/80">
            {[
              "Shop All Products",
              "Biotique Kits & 5 Liter Jars",
              "Bath Toiletries",
              "Guest Amenities",
              "Taski R1 to R9 Cleaning Chemicals",
            ].map((item, i) => (
              <li key={i} className="hover:text-white cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3">Contact Us</h3>

          <div className="space-y-3 text-sm text-white/80">

            <div className="flex gap-2 items-start">
              <FaMapMarkerAlt className="mt-1" />
              <p>
                S.No.190, Sri Ragavendra Layout, Chikkabanavara,<br />
                Bangalore - 560090
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <FaPhone />
              <p>93816 53268, 89785 90924</p>
            </div>

            <div className="flex gap-2 items-center">
              <FaEnvelope />
              <p>contact@hotelguestsupplys.com</p>
            </div>

          </div>
        </div>
      </div>

      {/* ================= DIVIDER ================= */}
      <div className="border-t border-white/20 my-6"></div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        <p className="text-sm text-white/70">
          © {new Date().getFullYear()} Hotel Guest Supply. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex gap-4 text-lg">
          <FaFacebook className="cursor-pointer hover:text-white" />
          <FaInstagram className="cursor-pointer hover:text-white" />
          <FaTwitter className="cursor-pointer hover:text-white" />
          <FaLinkedin className="cursor-pointer hover:text-white" />
        </div>

      </div>
    </footer>
  );
}