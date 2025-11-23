"use client";

import Link from 'next/link';
import Image from 'next/image';
import { BuildingOffice2Icon, BoltIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const dashboardPrefixes = ['/dashboard', '/merchant', '/super-merchant', '/admin'];

  // Hide footer on any dashboard or admin routes (match prefix or exact path)
  if (pathname && dashboardPrefixes.some(p => pathname === p || pathname.startsWith(p + '/'))) return null;

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-4">

              <div>
                <Image src="/images/pexipay.png" alt="Pexipay" width={68} height={68} className="object-contain w-[150px] h-full mb-2" />
                <div className="text-lg font-bold">Pexipay</div>
                <div className="text-sm text-gray-600">Our platform is built for businesses that demand reliability and protection. With no chargebacks, merchants can accept payments confidently, free from the risks and disputes common in traditional payment systems.</div>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <div className="px-3 py-1">
                <Image src="/images/PCI-DSS-1.png" alt="PCI DSS" width={96} height={24} className="object-contain h-16" />
              </div>
              <div className="px-3 py-1">
                <Image src="/images/security.png" alt="Security" width={96} height={24} className="object-contain h-16" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1">
            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
                <li><Link href="/support" className="hover:underline">Support</Link></li>
                <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
                <li><Link href="/help" className="hover:underline">Help Center</Link></li>
                <li><Link href="/community" className="hover:underline">Developer Community</Link></li>
                <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Email: <a href="mailto:support@pexipay.com" className="hover:underline">info@pexipay.com</a></li>
                <li>Phone: <a href="tel:+18001234567" className="hover:underline">+1 (800) 123-4567</a></li>
                <li>
                  <Link href="https://www.linkedin.com/company/pexilabs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <BuildingOffice2Icon className="w-5 h-5 text-gray-500" />
                    <span>LinkedIn</span>
                  </Link>
                </li>
                <li>
                  <Link href="https://x.com/PexiLabs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <BoltIcon className="w-5 h-5 text-gray-500" />
                    <span>X</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary border-t border-gray-200">
        <div className="container mx-auto px-4 py-3 text-center text-xs text-white">
          © 2025 Pexipay. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
