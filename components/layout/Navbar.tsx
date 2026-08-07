'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getUserProfile() {
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
    }
    getUserProfile()
  }, [supabase])

  return (
    <header className="sticky top-0 z-50 bg-white/80 premium-blur border-b border-dark-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl tracking-tight text-dark-900">
          Tech<span className="text-brand-500">Cart OS</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-semibold">
          <Link href="/" className="text-dark-600 hover:text-dark-900">Store</Link>
          
          {role && role !== 'customer' && (
            <Link href={`/${role}`} className="px-3 py-1 bg-dark-100 text-dark-800 rounded uppercase text-xs">
              {role} Panel
            </Link>
          )}

          {userEmail ? (
            <span className="text-xs text-dark-500">{userEmail}</span>
          ) : (
            <Link href="/login" className="bg-dark-900 text-white text-xs px-4 py-2 rounded-lg hover:bg-dark-800">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}