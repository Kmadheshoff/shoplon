import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12 dark:border-t dark:border-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <p className="text-2xl font-bold mb-4">Shoplon</p>
          <p className="text-gray-400 text-sm">Curated e-commerce store for artisanal toys, handbags, and sarees.</p>
        </div>
        
        <div>
          <h3 className="font-bold mb-4">Company</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>About Us</li>
            <li>Careers</li>
            <li>Blog</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-4">Support</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>FAQ</li>
            <li>Shipping</li>
            <li>Returns</li>
          </ul>
        </div>

        <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="text-gray-400 text-sm space-y-2">
                <li className="flex items-center gap-2"><Mail size={16}/> support@shoplon.com</li>
                <li className="flex items-center gap-2"><Phone size={16}/> +91 90802 82080</li>
                <li className="flex items-center gap-2"><MapPin size={16}/> Chennai, India</li>
            </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        &copy; 2026 Shoplon. All rights reserved.
      </div>
    </footer>
  );
}
