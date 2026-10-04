import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  allow?: string
  deny?: string 
  guest?: boolean     
  redirectTo?: string 
}

function AuthPath({ allow, deny, guest = false, redirectTo = '/' }: Props) {
  const { role, loading } = useAuth()

  if (loading) return null

  if (allow && role !== allow) return <Navigate to={redirectTo} replace />
  if (deny && role === deny) return <Navigate to={redirectTo} replace />

  return <Outlet />
}

export default AuthPath