"use client";
import { Button } from "@/components/ui/button"
import {
    FileText,
    Download,
    User,
    Send,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    CircleDollarSign,
    FileSearch,
    Loader,
    CalendarX,
    PlusCircle,
    Database,
    ChevronLeft,
    Printer,
    Mail,
    MoreVertical,
    Sparkles,
    BadgePercent,
    FileBarChart,
    Receipt,
    Edit,
    Trash
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InvoicesType } from "./columns"
import PaymentOverview from "./payment-overview"
import { LogsOverview } from "./logs-overview"
import { useRouter } from "next/navigation"

const statusConfig = {
    outstanding: {
        variant: "destructive",
        text: "Outstanding",
        icon: <AlertCircle className="h-5 w-5" />,
        bgColor: "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/60",
        textColor: "text-red-700 dark:text-red-300",
        borderColor: "border-red-200 dark:border-red-800",
        progressColor: "bg-red-500"
    },
    canceled: {
        variant: "destructive",
        text: "Canceled",
        icon: <AlertCircle className="h-5 w-5" />,
        bgColor: "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/60",
        textColor: "text-red-700 dark:text-red-300",
        borderColor: "border-red-200 dark:border-red-800",
        progressColor: "bg-red-500"
    },
    partially_paid: {
        variant: "warning",
        text: "Partial",
        icon: <Loader className="h-5 w-5" />,
        bgColor: "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/60",
        textColor: "text-amber-700 dark:text-amber-300",
        borderColor: "border-amber-200 dark:border-amber-800",
        progressColor: "bg-amber-500"
    },
    paid: {
        variant: "success",
        text: "Paid",
        icon: <CheckCircle className="h-5 w-5" />,
        bgColor: "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/60",
        textColor: "text-green-700 dark:text-green-300",
        borderColor: "border-green-200 dark:border-green-800",
        progressColor: "bg-green-500"
    },
    expired: {
        variant: "outline",
        text: "Expired",
        icon: <CalendarX className="h-5 w-5" />,
        bgColor: "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/40 dark:to-gray-700/60",
        textColor: "text-gray-700 dark:text-gray-300",
        borderColor: "border-gray-200 dark:border-gray-700",
        progressColor: "bg-gray-500"
    },
    overpaid: {
        variant: "secondary",
        text: "Overpaid",
        icon: <PlusCircle className="h-5 w-5" />,
        bgColor: "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/60",
        textColor: "text-purple-700 dark:text-purple-300",
        borderColor: "border-purple-200 dark:border-purple-800",
        progressColor: "bg-purple-500"
    },
    imported: {
        variant: "default",
        text: "Imported",
        icon: <Database className="h-5 w-5" />,
        bgColor: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/60",
        textColor: "text-blue-700 dark:text-blue-300",
        borderColor: "border-blue-200 dark:border-blue-800",
        progressColor: "bg-blue-500"
    },
    concept: {
        variant: "outline",
        text: "Concept",
        icon: <FileSearch className="h-5 w-5" />,
        bgColor: "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/40 dark:to-gray-700/60",
        textColor: "text-gray-700 dark:text-gray-300",
        borderColor: "border-gray-200 dark:border-gray-700",
        progressColor: "bg-gray-500"
    }
}

export default function InvoiceDetails({ invoice,handleCredit }: { invoice: InvoicesType,handleCredit:()=>void }) {
    const router = useRouter();
    const status = invoice.status
    const config = statusConfig[status]
    const totalAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(invoice.total_amount)

    const dueDate = new Date(invoice.due_date)
    const today = new Date()
    const isOverdue = dueDate < today && status !== "paid"
    const daysOverdue = isOverdue ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0

    // Calculate payment progress (for partially paid)
    const paymentProgress = status === "partially_paid" ? 50 : status === "paid" ? 100 : 0

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header with back button and actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <Link href="/invoices">
                    <Button variant="outline" className="rounded-full hover:bg-blue-100/50 dark:hover:bg-blue-900/20 backdrop-blur-sm">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Invoices
                    </Button>
                </Link>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="rounded-full hover:bg-purple-100/50 dark:hover:bg-purple-900/20 backdrop-blur-sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                    <Button variant="outline" className="rounded-full hover:bg-teal-100/50 dark:hover:bg-teal-900/20 backdrop-blur-sm" onClick={()=> router.push(`/invoices/${invoice.id}/update`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                    {invoice.pdf_attachment_id && (
                        <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                    )}
                    <Button variant="outline" className="rounded-full hover:bg-red-100/50 dark:hover:bg-red-900/20 backdrop-blur-sm" onClick={()=> handleCredit()}>
                        <Trash className="h-4 w-4 mr-2" />
                        Credit
                    </Button>
                </div>
            </div>

            {/* Invoice Header Card */}
            <Card className="mb-8 border-0 shadow-lg overflow-hidden">
                <div className={`${config.bgColor} p-6`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-xl bg-white/30 dark:bg-black/20 backdrop-blur-sm border border-white/20">
                                <Receipt className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                                    Invoice #{invoice.invoice_number}
                                </h1>
                                <div className="flex items-center mt-2">
                                    <div className={`inline-flex items-center ${config.bgColor} ${config.textColor} px-4 py-1.5 rounded-full border ${config.borderColor} backdrop-blur-sm`}>
                                        {config.icon}
                                        <span className="ml-2 font-medium">{invoice.status}</span>
                                    </div>
                                    {isOverdue && (
                                        <Badge variant="destructive" className="ml-3 animate-pulse">
                                            {daysOverdue} {daysOverdue === 1 ? "Day Overdue" : "Days Overdue"}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {totalAmount}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {invoice.invoice_details.length} {invoice.invoice_details.length === 1 ? "Item" : "Items"}
                            </div>
                        </div>
                    </div>
                </div>

                {status === "partially_paid" && (
                    <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t">
                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Payment Progress</span>
                                <span>{paymentProgress}%</span>
                            </div>
                            <Progress value={paymentProgress} className={`h-2 ${config.progressColor}`} />
                        </div>
                    </CardFooter>
                )}
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">


                    {/* Invoice Items */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
                                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span>Invoice Items</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {invoice.invoice_details.map((detail, index) => (
                                    <div key={index} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start space-x-4">
                                                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                                        <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium">{detail.contract_name}</h3>
                                                        <p className="text-sm text-muted-foreground">Contract ID: {detail.contract_id}</p>
                                                        {detail.warnings?.length > 0 && (
                                                            <div className="mt-3">
                                                                <div className="flex items-start p-3 rounded-lg bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60">
                                                                    <div className="flex-shrink-0 pt-0.5">
                                                                        <svg
                                                                            className="h-5 w-5 text-red-600 dark:text-red-400 animate-pulse"
                                                                            fill="currentColor"
                                                                            viewBox="0 0 20 20"
                                                                        >
                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                                                clipRule="evenodd"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                                                            Warnings for this item
                                                                        </h3>
                                                                        <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                                                                            <ul className="list-disc pl-5 space-y-1">
                                                                                {detail.warnings.map((warning, wIndex) => (
                                                                                    <li key={wIndex} className="flex items-start">
                                                                                        <span className="flex-shrink-0 h-1.5 w-1.5 mt-1.5 mr-1.5 rounded-full bg-red-600 dark:bg-red-400"></span>
                                                                                        <span>{warning}</span>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-xl font-bold">
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD"
                                                    }).format(detail.total_price)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {detail.price} € {detail.price_time_unit} • {detail.vat}% VAT
                                                </div>
                                            </div>
                                        </div>

                                        {/* Periods */}
                                        {detail.periods.length > 0 && (
                                            <div className="mt-4 pl-14">
                                                <h4 className="text-sm font-medium mb-2 flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2 text-rose-600 dark:text-rose-400" />
                                                    Billing Periods
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {detail.periods.map((period, pIndex) => (
                                                        <div key={pIndex} className="border rounded-lg p-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/20">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        {format(new Date(period.start_date), "MMM dd")} - {format(new Date(period.end_date), "MMM dd, yyyy")}
                                                                    </p>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    {period.ambulante_total_minutes > 0 && (
                                                                        <Badge variant="outline" className="rounded-full">
                                                                            {period.ambulante_total_minutes} min
                                                                        </Badge>
                                                                    )}
                                                                    {period.accommodation_time_frame && period.accommodation_time_frame.trim() !== '' && (
                                                                        <Badge variant="outline" className="rounded-full">
                                                                            {period.accommodation_time_frame}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <PaymentOverview invoiceId={invoice.id.toString()} />
                    <LogsOverview invoiceId={invoice.id.toString()} />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-3">
                                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span>Klanten</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${invoice.client_first_name}+${invoice.client_last_name}`} />
                                        <AvatarFallback>{invoice.client_first_name.charAt(0)}{invoice.client_last_name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{invoice.client_first_name} {invoice.client_last_name}</p>
                                        <p className="text-sm text-muted-foreground">ID: {invoice.client_id}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <Button variant="outline" size="sm" className="rounded-full">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Contact
                                    </Button>
                                    <Button variant="outline" size="sm" className="rounded-full">
                                        <FileBarChart className="h-4 w-4 mr-2" />
                                        History
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50/30 dark:from-amber-900/20 dark:to-orange-900/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center">
                                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 mr-3">
                                    <Send className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <span>Opdrachtgevers</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-medium">{invoice.sender_name}</p>
                                    <p className="text-sm text-muted-foreground">ID: {invoice.sender_id}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Badge variant="outline" className="rounded-full">
                                        <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
                                        {invoice.sender_kvknumber}
                                    </Badge>
                                    <Badge variant="outline" className="rounded-full">
                                        <BadgePercent className="h-3 w-3 mr-1 text-blue-500" />
                                        {invoice.sender_btwnumber}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Timeline Card */}
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100/30 dark:from-gray-800/20 dark:to-gray-700/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center">
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/30 mr-3">
                                    <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <span>Invoice Timeline</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Created</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(invoice.created_at), "MMM dd, yyyy 'at' h:mm a")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-3 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Issued</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(invoice.issue_date), "MMM dd, yyyy")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className={`p-1.5 rounded-full ${isOverdue ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"} mr-3 mt-0.5`}>
                                        <div className={`h-2 w-2 rounded-full ${isOverdue ? "bg-red-600 dark:bg-red-400" : "bg-green-600 dark:bg-green-400"}`} />
                                    </div>
                                    <div>
                                        <p className={`font-medium ${isOverdue ? "text-red-600 dark:text-red-400" : ""}`}>
                                            Due Date {isOverdue && "(Overdue)"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(invoice.due_date), "MMM dd, yyyy")}
                                            {isOverdue && (
                                                <span className="ml-2 text-red-500 dark:text-red-400">
                                                    {daysOverdue} {daysOverdue === 1 ? "day" : "days"} late
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-3 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Last Updated</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(invoice.updated_at), "MMM dd, yyyy 'at' h:mm a")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Summary */}
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-teal-50/30 dark:from-green-900/20 dark:to-teal-900/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 mr-3">
                                    <CircleDollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <span>Payment Summary</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <p className="text-sm text-muted-foreground">Subtotal</p>
                                    <p className="font-medium">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD"
                                        }).format(invoice.invoice_details.reduce((sum, item) => sum + item.pre_vat_total_price, 0))}
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="text-sm text-muted-foreground">VAT</p>
                                    <p className="font-medium">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD"
                                        }).format(invoice.invoice_details.reduce((sum, item) => sum + (item.total_price - item.pre_vat_total_price), 0))}
                                    </p>
                                </div>

                                <div className="border-t pt-3 flex justify-between">
                                    <p className="text-sm font-medium">Total Amount</p>
                                    <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                                        {totalAmount}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes Card */}
                    {/* {invoice.extra_content && (
                        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center">
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
                                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span>Notes</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{invoice.extra_content}</p>
                            </CardContent>
                        </Card>
                    )} */}

                    {/* Quick Actions */}
                    <div className="space-y-3">
                        <Button className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg h-12">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Mark as Paid
                        </Button>

                        <Button variant="outline" className="w-full rounded-full border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 h-12 backdrop-blur-sm">
                            <Mail className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                            Send Reminder
                        </Button>

                        <Button variant="outline" className="w-full rounded-full border-purple-200 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 h-12 backdrop-blur-sm">
                            <MoreVertical className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                            More Actions
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}