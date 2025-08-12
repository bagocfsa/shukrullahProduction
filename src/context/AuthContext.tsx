import React, { createContext, useContext, useState, useEffect } from 'react';
import GoogleSheetsAuthService from '../services/googleSheetsAuth';

export type UserRole = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  department?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Google Sheets authentication is now used instead of mock users
// All user data comes from the Google Sheets CSV

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('shukrullah-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('shukrullah-user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with Google Sheets authentication...');
      const authenticatedUser = await GoogleSheetsAuthService.authenticateUser(email, password);

      if (authenticatedUser) {
        // Convert GoogleSheetsUser to our User interface
        const user: User = {
          id: authenticatedUser.id,
          email: authenticatedUser.email,
          firstName: authenticatedUser.firstName,
          lastName: authenticatedUser.lastName,
          role: authenticatedUser.role,
          phone: authenticatedUser.phone,
          department: authenticatedUser.department,
          status: authenticatedUser.status,
          createdAt: authenticatedUser.createdAt,
          lastLogin: authenticatedUser.lastLogin
        };

        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('shukrullah-user', JSON.stringify(user));
        console.log('Login successful:', user.firstName, user.lastName);
        return true;
      }

      console.log('Login failed: Invalid credentials or inactive user');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('shukrullah-user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Admin has all permissions
    if (user.role === 'admin') return true;

    // Manager has most permissions
    if (user.role === 'manager') {
      const managerPermissions = [
        'view_dashboard', 'manage_inventory', 'view_sales', 'manage_staff',
        'view_reports', 'manage_delivery', 'process_sales'
      ];
      return managerPermissions.includes(permission);
    }

    // Staff has basic permissions
    const staffPermissions = ['view_dashboard', 'process_sales', 'view_inventory'];
    return staffPermissions.includes(permission);
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    hasPermission,
    hasRole,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Permission constants
export const PERMISSIONS = {
  // Analytics & Reports
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_REPORTS: 'view_reports',
  EXPORT_REPORTS: 'export_reports',
  
  // Inventory Management
  VIEW_INVENTORY: 'view_inventory',
  MANAGE_INVENTORY: 'manage_inventory',
  UPDATE_STOCK: 'update_stock',
  
  // Production & Factory
  VIEW_PRODUCTION: 'view_production',
  MANAGE_PRODUCTION: 'manage_production',
  UPDATE_PRODUCTION: 'update_production',
  VIEW_COSTS: 'view_costs',
  MANAGE_COSTS: 'manage_costs',
  MANAGE_BATCHES: 'manage_batches',
  
  // Sales & Orders
  PROCESS_SALES: 'process_sales',
  VIEW_ORDERS: 'view_orders',
  MANAGE_ORDERS: 'manage_orders',
  REFUND_ORDERS: 'refund_orders',
  
  // Customer Management
  VIEW_CUSTOMERS: 'view_customers',
  MANAGE_CUSTOMERS: 'manage_customers',
  
  // Staff Management
  VIEW_STAFF: 'view_staff',
  MANAGE_STAFF: 'manage_staff',
  
  // System Administration
  MANAGE_USERS: 'manage_users',
  SYSTEM_SETTINGS: 'system_settings',
  
  // Shop Specific
  VIEW_SHOP_REPORTS: 'view_shop_reports',
  MANAGE_SHOP_SETTINGS: 'manage_shop_settings'
} as const;
