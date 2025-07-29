import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/SupabaseClient'

export default function Home() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth')
      } else {
        setUser(session.user)
      }
    })

    // Realtime auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null)
          navigate('/auth')
        } else if (session) {
          setUser(session.user)
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (!user) return <p>Loading...</p>

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
