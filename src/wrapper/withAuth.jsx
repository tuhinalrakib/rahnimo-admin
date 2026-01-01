"use client"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { useEffect } from "react"

const withAuth = (WrappedComponent) => {
  return function AuthComponent(props) {
    const router = useRouter()
    const user = useSelector((state) => state.user.user)

    useEffect(() => {
      if (!user) router.replace("/login")
    }, [user, router])

    if (!user) return null

    return <WrappedComponent {...props} />
  }
}

export default withAuth
