export interface Payment {
    /** Payment amount in the currency's smallest unit (e.g., cents) */
    amount: number;
    /** When the payment was created (ISO 8601 format) */
    created_at: string;
    /** Related invoice ID */
    invoice_id: number;
    /** Optional notes about the payment */
    notes: string | null;
    /** When the payment was made (ISO 8601 format) */
    payment_date: string;
    /** Unique payment identifier */
    payment_id: number;
    /** Payment method (e.g., "credit_card", "bank_transfer", "paypal") */
    payment_method: 'bank_transfer'| 'credit_card'| 'check'| 'cash'| 'other';
    /** Reference number for the payment */
    payment_reference: string;
    /** Current payment status */
    payment_status: 'completed'| 'pending'| 'failed'| 'reversed'| 'refunded';
    /** ID of the user who recorded the payment */
    recorded_by: number;
    /** First name of the user who recorded the payment */
    recorded_by_first_name: string;
    /** Last name of the user who recorded the payment */
    recorded_by_last_name: string;
    /** When the payment was last updated (ISO 8601 format) */
    updated_at: string;
}

// Alternatively, with string literal unions for constrained values:
interface StrictPayment {
    amount: number;
    created_at: string;
    invoice_id: number;
    notes: string | null;
    payment_date: string;
    payment_id: number;
    payment_method: 'credit_card' | 'bank_transfer' | 'paypal' | 'cash' | 'other';
    payment_reference: string;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_paid';
    recorded_by: number;
    recorded_by_first_name: string;
    recorded_by_last_name: string;
    updated_at: string;
}

// For API responses where fields might be optional:
type ApiPayment = Partial<Payment> & {
    payment_id: number; // At least ID should be required
    invoice_id: number;
};

export const PAYMENT_METHODS = ['bank_transfer', 'credit_card', 'check', 'cash', 'other'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export const PAYMENT_METHODS_OPTIONS = PAYMENT_METHODS.map(method => ({ value: method, label: method.replace('_', ' ') }));
export const PAYMENT_STATUSES = ['completed', 'pending', 'failed', 'reversed', 'refunded'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export const PAYMENT_STATUSES_OPTIONS = PAYMENT_STATUSES.map(status => ({ value: status, label: status.replace('_', ' ') }));