'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DynamicNav() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()
  const pathname = usePathname()

  useEffect(() => {
    async function loadUserProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? null)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        setRole(profile?.role || 'customer')
      }
      setLoading(false)
    }
    loadUserProfile()
  }, [supabase])

  const navLinks = [
    { name: 'Catalogue', href: '/' },
    { name: 'Best Sellers', href: '/featured' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white premium-blur border-b border-dark-100 shadow-subtle">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo - Strong and Clean */}
        <Link href="/" className="font-extrabold text-lg md:text-xl tracking-tighter text-dark-900 group">
          Tech<span className="text-brand-500 transition-colors group-hover:text-brand-600">Cart OS</span>
        </Link>

        {/* Dynamic Desktop Links */}
        {!loading && (
          <nav className="flex items-center gap-6 md:gap-8 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className={`hover:text-dark-900 ${pathname === link.href ? 'text-dark-900 font-semibold' : 'text-dark-600'}`}>
                {link.name}
              </Link>
            ))}
            
            {/* Role-Specific Panels (Only if authorized) */}
            {role && role !== 'customer' && (
              <Link href={`/${role}`} className="px-3 py-1 text-xs font-semibold rounded bg-dark-100 text-dark-700 hover:bg-dark-200 uppercase tracking-wide">
                {role} Console
              </Link>
            )}
          </nav>
        )}

        {/* User Actions Section */}
        <div className="flex items-center gap-4 text-sm">
          {!loading && userEmail ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-500 hidden sm:inline">{userEmail}</span>
              <Link href="/cart" className="relative group">
                {/* Minimalist Cart Icon */}
                <svg className="w-5 h-5 text-dark-600 hover:text-dark-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>
            </div>
          ) : (
            <Link href="/login" className="bg-dark-900 hover:bg-dark-800 text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors duration-200">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}