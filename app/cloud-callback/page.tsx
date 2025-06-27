import { Suspense } from "react"

export default function CloudCallbackPage() {
  return <Suspense fallback={<div>Processing cloud connection...</div>}>{/* existing component content */}</Suspense>
}
