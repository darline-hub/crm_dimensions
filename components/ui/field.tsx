import * as React from "react"

export function FieldGroup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-4 ${className}`}>{children}</div>
}

export function Field({ children, className = "", orientation }: { children: React.ReactNode; className?: string; orientation?: string; "data-invalid"?: boolean }) {
  return <div className={`${orientation === "horizontal" ? "flex items-center space-x-2" : "space-y-1.5"} ${className}`}>{children}</div>
}

export function FieldLabel({ htmlFor, children, className = "" }: { htmlFor?: string; children: React.ReactNode; className?: string }) {
  return <label htmlFor={htmlFor} className={`text-sm font-medium leading-none ${className}`}>{children}</label>
}

export function FieldContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function FieldError({ errors, className = "" }: { errors?: any[]; className?: string }) {
  if (!errors || errors.length === 0 || !errors[0]) return null
  return <p className={`text-xs text-red-500 font-medium ${className}`}>{errors[0]?.message}</p>
}