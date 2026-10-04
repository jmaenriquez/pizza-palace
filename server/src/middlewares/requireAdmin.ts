import type { Request, Response, NextFunction } from 'express'
import supabase from '../config/supabase'

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Not logged in.' })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Invalid session.' })

  const { data: info } = await supabase
    .from('user_infos')
    .select('role')
    .eq('id', user.id)
    .single()

  if (info?.role !== 'Admin') return res.status(403).json({ error: 'Admins only.' })

  res.locals.userId = user.id
  next()
}

export default requireAdmin;