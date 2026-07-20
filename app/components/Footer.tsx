import Link from "next/link";
import { Mail, AtSign, Link2, Video, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-linear-to-b from-gray-950 to-black text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-24">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          <div>
            <h2 className="text-3xl font-bold text-white">
              Glow<span className="text-primary">Skin</span>
            </h2>

            <p className="mt-6 leading-7 text-gray-400">
              GlowSkin provides science-backed skincare education,
              ingredient guides, dermatologist-inspired routines,
              and beauty tips to help everyone achieve healthier skin.
            </p>

            <div className="mt-8 flex gap-3">
              <a href="#" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-800 bg-gray-900 transition hover:border-primary hover:bg-primary hover:text-white">
                <AtSign size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-800 bg-gray-900 transition hover:border-primary hover:bg-primary hover:text-white">
                <Link2 size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-800 bg-gray-900 transition hover:border-primary hover:bg-primary hover:text-white">
                <Video size={18} />
              </a>
              <a href="#" aria-label="Email" className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-800 bg-gray-900 transition hover:border-primary hover:bg-primary hover:text-white">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wide text-white">Explore</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 transition hover:text-primary-light">Home</Link></li>
              <li><Link href="/blog" className="text-gray-400 transition hover:text-primary-light">Blog</Link></li>
              <li><Link href="/ingredients" className="text-gray-400 transition hover:text-primary-light">Ingredients</Link></li>
              <li><Link href="/skin-concerns" className="text-gray-400 transition hover:text-primary-light">Skin Concerns</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wide text-white">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-400 transition hover:text-primary-light">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 transition hover:text-primary-light">Contact</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-400 transition hover:text-primary-light">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 transition hover:text-primary-light">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wide text-white">Stay Updated</h3>
            <p className="mb-6 text-gray-400">Get weekly skincare tips and ingredient guides.</p>
            <div className="flex overflow-hidden rounded-xl border border-gray-800 bg-gray-900 focus-within:border-primary">
              <input type="email" placeholder="Your email" className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-gray-500" />
              <button aria-label="Subscribe" className="flex items-center justify-center bg-primary px-4 transition hover:bg-primary-dark">
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-sm text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} GlowSkin. All rights reserved.</p>
          <p className="text-gray-600">Made with care for healthier skin.</p>
        </div>

      </div>
    </footer>
  );
}