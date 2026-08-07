'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
      },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
    } else {
      if (data.user) {
        await supabase.from('profiles').insert([
          { id: data.user.id, email, role }
        ])
      }
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-dark-100 rounded-2xl p-8 shadow-premium space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-extrabold text-dark-900 tracking-tight">Create Account</h1>
          <p className="text-xs text-dark-500">Join TechCart OS as a Customer, Vendor, or Delivery Partner</p>
        </div>

        {error && (
          <div className="p-3 bg-error-50 border border-error-100 text-error-600 text-xs rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-dark-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-dark-50 border border-dark-100 rounded-lg text-sm text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-dark-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-dark-50 border border-dark-100 rounded-lg text-sm text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-dark-700">Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-50 border border-dark-100 rounded-lg text-sm text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="delivery">Delivery Partner</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dark-900 hover:bg-dark-800 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-xs text-dark-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}