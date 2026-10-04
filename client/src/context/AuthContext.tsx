import React from 'react'
import supabase from '../config/supabase'

import type { Session } from '@supabase/supabase-js'

interface AuthState {
  session: Session | null
  role: string | null
  loading: boolean
  sessionLoading: boolean
}

const AuthContext = React.createContext<AuthState>({
  session: null,
  role: null,
  loading: true,
  sessionLoading: true,
})

export const useAuth = () => React.useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null)
  const [sessionLoading, setSessionLoading] = React.useState(true)
  const [roleState, setRoleState] = React.useState<{ userId: string; role: string | null } | null>(null)

  // session tracking
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setSessionLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setSessionLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const userId = session?.user.id

  React.useEffect(() => {
    if (!userId) {
      setRoleState(null)
      return
    }

    let cancelled = false

    async function fetchRole(id: string) {
      let role: string | null = null
      try {
        const { data, error } = await supabase
          .from('user_infos') // <-- confirm this table name
          .select('role')
          .eq('id', id)      // <-- and this column name
          .single()

        if (error) console.error('role fetch failed:', error.message)
        else role = data?.role ?? null
      } catch (err) {
        console.error('role fetch threw:', err)
      }

      if (!cancelled) setRoleState({ userId: id, role })
    }

    fetchRole(userId)
    return () => { cancelled = true }
  }, [userId])

  const role = roleState && roleState.userId === userId ? roleState.role : null
  const roleLoading = !!userId && roleState?.userId !== userId
  const loading = sessionLoading || roleLoading

  const value = React.useMemo(
    () => ({ session, role, loading, sessionLoading }),
    [session, role, loading, sessionLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext