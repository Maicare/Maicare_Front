import { redirect } from 'next/navigation'

const ReportsPage = () => {
  return (
    redirect("reports/user-reports")
  )
}

export default ReportsPage