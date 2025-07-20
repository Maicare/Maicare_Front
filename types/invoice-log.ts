/**
 * Represents an audit log entry tracking changes in the system
 */
export interface InvoiceAuditLog {
    /** Unique identifier for the audit log entry */
    audit_id: number;
    
    /** Timestamp when the change occurred (ISO 8601 format) */
    changed_at: string;
    
    /** ID of the user who made the change */
    changed_by: number;
    
    /** First name of the user who made the change */
    changed_by_first_name: string;
    
    /** Last name of the user who made the change */
    changed_by_last_name: string;
    
    /** List of field names that were modified */
    changed_fields: string[];
    
    /** ID of the invoice that was modified (if applicable) */
    invoice_id: number | null;
    
    /** The type of operation performed */
    operation: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'status_change' | string;
    
    /** Object containing the new values of changed fields */
    new_values: Record<string, unknown>;
    
    /** Object containing the old values of changed fields */
    old_values: Record<string, unknown>;
  }
  
  /**
   * Extended interface with strict operation types
   */
  export interface StrictAuditLog extends Omit<InvoiceAuditLog, 'operation'> {
    operation: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'status_change';
  }
  
  /**
   * Interface for paginated audit log responses
   */
  export interface PaginatedAuditLogs {
    data: InvoiceAuditLog[];
    total: number;
    page: number;
    limit: number;
  }
  
  /**
   * Type for filtered audit log queries
   */
  export interface AuditLogFilter {
    operation?: InvoiceAuditLog['operation'];
    changed_by?: number;
    invoice_id?: number;
    start_date?: string;
    end_date?: string;
    field_changed?: string;
  }