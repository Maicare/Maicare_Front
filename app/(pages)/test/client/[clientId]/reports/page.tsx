import { redirect } from 'next/navigation'
import React from 'react'

const ReportsPage = () => {
  return (
    redirect("reports/user-reports")
  )
}

export default ReportsPage