"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { usePayment } from "@/hooks/payment/use-payment"
import { AlertCircle, BadgeInfo, Banknote, BanknoteIcon, Calendar, CheckCircle2, CircleArrowLeft, CircleDollarSign, CircleDollarSignIcon,  CreditCard, FileText, Hash, RefreshCw, User, Wallet } from "lucide-react"
import UpsertPaymentSheet from "./upsert-payment-sheet"
import { useState } from "react"
import { Payment } from "@/types/payment.types"
import { CreatePayment } from "@/schemas/payment.schema"

const PaymentOverview = ({ invoiceId }: { invoiceId: string }) => {
    const { payments, createOne, updateOne } = usePayment({ autoFetch: true, invoiceId });
    const [isOpen, setIsOpen] = useState(false);
    const [payment, setPayment] = useState<Payment | null>(null);
    const handleCreate = async (values: CreatePayment) => {
        try {
            await createOne(
                values,
                {
                    displayProgress: true,
                    displaySuccess: true
                }
            );
        } catch (error) {
            console.log(error);
        }
    }
    const handleUpdate = async (values: CreatePayment & { recorded_by: number }) => {
        try {
            await updateOne(
                payment!.payment_id.toString()!,
                values,
                {
                    displayProgress: true,
                    displaySuccess: true
                }
            );
        } catch (error) {
            console.log(error);
        }
    }
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            case 'failed': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
            case 'refunded': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
            case 'reversed': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
            default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method.toLowerCase()) {
            case 'credit_card': return <CreditCard className="h-4 w-4 text-blue-500" />;
            case 'bank_transfer': return <Banknote className="h-4 w-4 text-violet-500" />;
            case 'check': return <BanknoteIcon className="h-4 w-4 text-indigo-500" />;
            case 'cash': return <CircleDollarSign className="h-4 w-4 text-indigo-500" />;
            default: return <FileText className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800/90">
            <CardHeader className="border-b border-muted">
                <CardTitle className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <span>Payments</span>
                        <Badge variant="outline" className="rounded-full px-3 py-1">
                            {payments?.length || 0} {payments?.length === 1 ? 'payment' : 'payments'}
                        </Badge>
                    </div>
                    <UpsertPaymentSheet
                        handleCreate={handleCreate}
                        handleOpen={(bool) => setIsOpen(bool)}
                        handleUpdate={handleUpdate}
                        isOpen={isOpen}
                        mode={payment ? "update" : "create"}
                        payment={payment || undefined}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {(payments ?? [])?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                        <Wallet className="h-10 w-10 mb-3" />
                        <p>No payments recorded</p>
                    </div>
                ) : (
                    <div className="divide-y divide-muted">
                        {payments?.map((payment) => (
                            <div key={payment.payment_id} className="p-4 hover:bg-slate-300/50 transition-colors cursor-pointer" onClick={()=>{setPayment(payment);setIsOpen(true);}}>
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    {/* Status */}
                                    <div className="col-span-2">
                                        <Badge
                                            variant="outline"
                                            className={`rounded-full capitalize ${getStatusColor(payment.payment_status)}`}
                                        >
                                            {payment.payment_status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                            {payment.payment_status === 'pending' && <RefreshCw className="h-3 w-3 mr-1" />}
                                            {payment.payment_status === 'failed' && <AlertCircle className="h-3 w-3 mr-1" />}
                                            {payment.payment_status === 'refunded' && <CircleArrowLeft className="h-3 w-3 mr-1" />}
                                            {payment.payment_status === 'reversed' && <CircleDollarSignIcon className="h-3 w-3 mr-1" />}
                                            {payment.payment_status.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    {/* Amount */}
                                    <div className="col-span-2 font-medium text-lg">
                                        ${payment.amount.toFixed(2)}
                                    </div>

                                    {/* Method */}
                                    <div className="col-span-2 flex items-center gap-2">
                                        {getMethodIcon(payment.payment_method)}
                                        <span className="capitalize">{payment.payment_method.replace('_', ' ')}</span>
                                    </div>

                                    {/* Date */}
                                    <div className="col-span-2 flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(payment.payment_date).toLocaleDateString()}
                                    </div>

                                    {/* Processed By */}
                                    <div className="col-span-2 flex items-center gap-2">
                                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs">
                                            <User className="h-3 w-3" />
                                        </div>
                                        <span className="text-sm">
                                            {payment.recorded_by_first_name} {payment.recorded_by_last_name}
                                        </span>
                                    </div>

                                    {/* Actions/Reference */}
                                    <div className="col-span-2 flex justify-end">
                                        {payment.payment_reference && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Badge variant="outline" className="rounded-full gap-1">
                                                        <Hash className="h-3 w-3" />
                                                        <span className="max-w-[80px] truncate">{payment.payment_reference}</span>
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Reference: {payment.payment_reference}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>

                                {/* Notes - appears on hover */}
                                {payment.notes && (
                                    <div className="mt-3 pt-3 border-t border-muted flex items-start gap-2">
                                        <BadgeInfo className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-muted-foreground">{payment.notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default PaymentOverview