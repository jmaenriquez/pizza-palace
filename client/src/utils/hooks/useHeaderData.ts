import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

interface HeaderContext {
  setHeader: (data: { title: string; subtitle?: string }) => void
}

export function useHeaderData(title: string, subtitle?: string) {
  const { setHeader } = useOutletContext<HeaderContext>()

  useEffect(() => {
    setHeader({ title, subtitle })
  }, [title, subtitle])
}
