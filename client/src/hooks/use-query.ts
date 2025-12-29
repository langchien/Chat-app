import { useEffect, useState } from 'react'

export function useQuery<A, R>(cb: (arg: A) => Promise<R>, arg: A) {
  const [data, setData] = useState<R | null>(null)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true)
      try {
        const result = await cb(arg)
        setData(result)
      } catch (error: unknown) {
        setIsError(true)
      } finally {
        setIsPending(false)
      }
    }
    fetchData()
  }, [cb, arg])
  return { data, isPending, isError }
}
