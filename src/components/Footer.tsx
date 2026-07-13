import React from 'react';
import { FileText, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer 
      id="main-footer"
      className="border-t border-white/10 dark:border-white/10 bg-white/30 dark:bg-[#0c0e1a]/30 backdrop-blur-md py-8 sm:py-12 mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-200/40 dark:border-gray-800/40">
          
          {/* Logo & Slogan */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-600 text-white shadow-sm">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-display font-bold text-sm tracking-tight text-gray-900 dark:text-white">
                TextUtils<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[280px]">
              Premium, client-side utility suite for developers, copywriters, and content organizers.
            </p>
          </div>

          {/* Privacy Assertion */}
          <div className="max-w-md text-center md:text-right">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 mb-2">
              ● 100% Client-Side Sandbox Secure
            </span>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-normal">
              No character inputs are uploaded or sent over any internet connection. All analytical computations occur immediately inside your browser session.
            </p>
          </div>

        </div>

        {/* Legal & Authorship */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500">
          <div>
            © {year} TextUtils Pro Workspace. Open source under MIT guidelines.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for frictionless drafting.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
