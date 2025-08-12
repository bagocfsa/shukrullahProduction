// Access Control System for Nutrinute Website Changes
// This system ensures all changes are authorized and tracked

export interface AccessRequest {
  id: string;
  timestamp: Date;
  requestedBy: string;
  changeType: 'PRODUCT_MANAGEMENT' | 'PAYMENT_SYSTEM' | 'DELIVERY_PRICING' | 'UI_CHANGES' | 'ADMIN_FEATURES';
  description: string;
  accessCode: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'APPLIED';
  approvedBy?: string;
  appliedAt?: Date;
}

// Master access codes for different types of changes
const MASTER_ACCESS_CODES = {
  // Product Management Changes
  PRODUCT_MANAGEMENT: 'NUTRI-PROD-2024',
  
  // Payment System Changes
  PAYMENT_SYSTEM: 'NUTRI-PAY-2024',
  
  // Delivery Pricing Changes
  DELIVERY_PRICING: 'NUTRI-DELIV-2024',
  
  // UI/UX Changes
  UI_CHANGES: 'NUTRI-UI-2024',
  
  // Admin Features
  ADMIN_FEATURES: 'NUTRI-ADMIN-2024',
  
  // Master override code (for emergency changes)
  MASTER_OVERRIDE: 'NUTRI-MASTER-2024'
};

// Store access requests in localStorage for persistence
const ACCESS_REQUESTS_KEY = 'nutrinute_access_requests';

export class AccessControlManager {
  private static instance: AccessControlManager;
  private accessRequests: AccessRequest[] = [];

  private constructor() {
    this.loadAccessRequests();
  }

  public static getInstance(): AccessControlManager {
    if (!AccessControlManager.instance) {
      AccessControlManager.instance = new AccessControlManager();
    }
    return AccessControlManager.instance;
  }

  private loadAccessRequests(): void {
    try {
      const stored = localStorage.getItem(ACCESS_REQUESTS_KEY);
      if (stored) {
        this.accessRequests = JSON.parse(stored).map((req: any) => ({
          ...req,
          timestamp: new Date(req.timestamp),
          appliedAt: req.appliedAt ? new Date(req.appliedAt) : undefined
        }));
      }
    } catch (error) {
      console.error('Failed to load access requests:', error);
      this.accessRequests = [];
    }
  }

  private saveAccessRequests(): void {
    try {
      localStorage.setItem(ACCESS_REQUESTS_KEY, JSON.stringify(this.accessRequests));
    } catch (error) {
      console.error('Failed to save access requests:', error);
    }
  }

  public requestAccess(
    requestedBy: string,
    changeType: AccessRequest['changeType'],
    description: string,
    accessCode: string
  ): { success: boolean; message: string; requestId?: string } {
    // Validate access code
    const isValidCode = this.validateAccessCode(changeType, accessCode);
    
    if (!isValidCode) {
      return {
        success: false,
        message: 'Invalid access code. Please contact the system administrator for the correct code.'
      };
    }

    // Create access request
    const request: AccessRequest = {
      id: `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      requestedBy,
      changeType,
      description,
      accessCode,
      status: 'APPROVED', // Auto-approve if code is valid
      approvedBy: 'SYSTEM',
      appliedAt: new Date()
    };

    this.accessRequests.push(request);
    this.saveAccessRequests();

    return {
      success: true,
      message: 'Access granted. Changes can now be applied.',
      requestId: request.id
    };
  }

  private validateAccessCode(changeType: AccessRequest['changeType'], accessCode: string): boolean {
    // Check if it's the master override code
    if (accessCode === MASTER_ACCESS_CODES.MASTER_OVERRIDE) {
      return true;
    }

    // Check specific access code for the change type
    return accessCode === MASTER_ACCESS_CODES[changeType];
  }

  public getAccessRequests(): AccessRequest[] {
    return [...this.accessRequests].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getApprovedRequests(): AccessRequest[] {
    return this.accessRequests.filter(req => req.status === 'APPROVED');
  }

  public hasValidAccess(changeType: AccessRequest['changeType']): boolean {
    const recentRequests = this.accessRequests.filter(
      req => req.changeType === changeType && 
             req.status === 'APPROVED' &&
             req.appliedAt &&
             (Date.now() - req.appliedAt.getTime()) < 24 * 60 * 60 * 1000 // Valid for 24 hours
    );
    
    return recentRequests.length > 0;
  }

  public logChangeApplication(requestId: string, changeDetails: string): void {
    const request = this.accessRequests.find(req => req.id === requestId);
    if (request) {
      request.status = 'APPLIED';
      request.appliedAt = new Date();
      request.description += ` | Applied: ${changeDetails}`;
      this.saveAccessRequests();
    }
  }

  public getAccessCodes(): typeof MASTER_ACCESS_CODES {
    // Only return codes in development or for authorized users
    if (process.env.NODE_ENV === 'development') {
      return MASTER_ACCESS_CODES;
    }
    
    // In production, codes should be provided securely
    return {} as typeof MASTER_ACCESS_CODES;
  }
}

// Utility functions for easy access
export const accessControl = AccessControlManager.getInstance();

export const requestChangeAccess = (
  requestedBy: string,
  changeType: AccessRequest['changeType'],
  description: string,
  accessCode: string
) => {
  return accessControl.requestAccess(requestedBy, changeType, description, accessCode);
};

export const hasValidAccess = (changeType: AccessRequest['changeType']) => {
  return accessControl.hasValidAccess(changeType);
};

export const logChangeApplication = (requestId: string, changeDetails: string) => {
  accessControl.logChangeApplication(requestId, changeDetails);
};

// Access codes for reference (in development)
export const getAccessCodes = () => {
  return accessControl.getAccessCodes();
};

// Change tracking
export interface ChangeLog {
  id: string;
  timestamp: Date;
  changeType: string;
  description: string;
  appliedBy: string;
  accessRequestId: string;
  beforeState?: any;
  afterState?: any;
}

class ChangeTracker {
  private static instance: ChangeTracker;
  private changes: ChangeLog[] = [];
  private readonly CHANGES_KEY = 'nutrinute_change_log';

  private constructor() {
    this.loadChanges();
  }

  public static getInstance(): ChangeTracker {
    if (!ChangeTracker.instance) {
      ChangeTracker.instance = new ChangeTracker();
    }
    return ChangeTracker.instance;
  }

  private loadChanges(): void {
    try {
      const stored = localStorage.getItem(this.CHANGES_KEY);
      if (stored) {
        this.changes = JSON.parse(stored).map((change: any) => ({
          ...change,
          timestamp: new Date(change.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load change log:', error);
    }
  }

  private saveChanges(): void {
    try {
      localStorage.setItem(this.CHANGES_KEY, JSON.stringify(this.changes));
    } catch (error) {
      console.error('Failed to save change log:', error);
    }
  }

  public logChange(
    changeType: string,
    description: string,
    appliedBy: string,
    accessRequestId: string,
    beforeState?: any,
    afterState?: any
  ): string {
    const change: ChangeLog = {
      id: `CHG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      changeType,
      description,
      appliedBy,
      accessRequestId,
      beforeState,
      afterState
    };

    this.changes.push(change);
    this.saveChanges();

    return change.id;
  }

  public getChanges(): ChangeLog[] {
    return [...this.changes].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getChangesByType(changeType: string): ChangeLog[] {
    return this.changes.filter(change => change.changeType === changeType);
  }
}

export const changeTracker = ChangeTracker.getInstance();
