import { useState, useEffect } from 'react'
import { supabase } from "../supabase/SupabaseClient"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'


export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If already logged in, redirect to /recipes
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) navigate('/recipes')
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
        toast.error(error.message)

    } else {
      if (isLogin) {
        navigate('/recipes')
      } else {
        alert('Check your email for confirmation.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '10px' }}>
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
