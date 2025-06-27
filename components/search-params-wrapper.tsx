"use client"

import type { ReactNode } from "react"

interface SearchParamsWrapperProps {
  children: ReactNode
}

export function SearchParamsWrapper({ children }: SearchParamsWrapperProps) {
  return <>{children}</>
}
