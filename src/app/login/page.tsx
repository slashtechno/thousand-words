'use client'
import { useState, useEffect } from 'react'
import { signIn, useSession, updateUser, deleteUser } from '@/lib/auth-client'

function Profile() {
  const { data, isPending, error } = useSession()
  const user = data?.user
  const [name, setName] = useState(user?.name || '')
  const [message, setMessage] = useState('')

  useEffect(() => { setName(user?.name || '') }, [user?.name])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    try {
      await updateUser({ name })
      setMessage('Updated')
    } catch (e: any) {
      setMessage(e.message || 'Error')
    }
  }

  async function remove() {
    if (!confirm('Delete account?')) return
    try {
      await deleteUser()
      setMessage('Deleted')
    } catch (e: any) {
      setMessage(e.message || 'Error')
    }
  }

  if (isPending) return <p>Loading...</p>
  if (error) return <p className='text-red-500'>{error.message}</p>
  if (!user) return <p>Not signed in.</p>

  return (
    <div className='border p-4 mt-6 w-full max-w-md text-sm rounded'>
      <h2 className='font-medium mb-2 text-base'>Profile</h2>
      <p className='text-gray-600 text-xs mb-2'>Email: {user.email}</p>
      <form onSubmit={save} className='flex gap-2'>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className='flex-1 border rounded px-2 py-1'
        />
        <button type='submit' className='px-3 py-1 border rounded text-sm'>Save</button>
      </form>
      <button onClick={remove} className='mt-4 text-red-600 text-sm underline'>Delete Account</button>
      {message && <p className='text-xs mt-2'>{message}</p>}
    </div>
  )
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { data } = useSession()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await signIn.email({ email: form.email, password: form.password })
    } catch (e: any) {
      setError(e.message || 'Failed')
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center pt-16 px-4'>
      <div className='w-full max-w-md'>
        <h1 className='text-2xl font-semibold mb-4 text-center'>Login</h1>
        {!data?.user && (
          <form onSubmit={onSubmit} className='flex flex-col gap-3'>
            <input
              required
              type='email'
              placeholder='Email'
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className='border rounded px-3 py-2'
            />
            <input
              required
              type='password'
              placeholder='Password'
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className='border rounded px-3 py-2'
            />
            <button type='submit' className='border rounded px-3 py-2 text-sm'>Sign In</button>
            {error && <p className='text-red-500 text-xs'>{error}</p>}
          </form>
        )}
        <Profile />
      </div>
    </div>
  )
}
