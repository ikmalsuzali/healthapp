"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Welcome back, {session.user?.name || session.user?.email}!
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Sign out
                </button>
              </div>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    User Information
                  </h3>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>ID:</strong> {session.user?.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {session.user?.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Name:</strong>{" "}
                      {session.user?.name || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Health Profile
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Complete your health profile to get personalized
                      recommendations.
                    </p>
                    <button className="mt-2 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      Complete Profile
                    </button>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Quick Actions
                  </h3>
                  <div className="mt-4 space-y-2">
                    <button className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                      View Health Records
                    </button>
                    <button className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                      Schedule Appointment
                    </button>
                    <button className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                      View Reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
