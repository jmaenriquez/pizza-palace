import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  allow?: string[];
  deny?: string[];
  guest?: boolean;
  redirectTo?: string;
}

function AuthPath({ allow, deny, guest = false, redirectTo = '/' }: Props) {
  const { session, role, loading } = useAuth()

  if (loading) return null

  if(guest && session) return <Navigate to={redirectTo} replace />

  if (allow && !allow.includes(role ?? "")) {
    return <Navigate to={redirectTo} replace />;
  }

  if (deny && deny.includes(role ?? "")) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />
}

export default AuthPath