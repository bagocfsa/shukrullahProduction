// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Online price
  physicalShopPrice?: number; // Physical shop price (if different)
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  nutritionFacts?: NutritionFacts;
  ingredients: string[];
  servingSize: string;
  servingsPerContainer: number;
  benefits: string[];
  usage: string;
  warnings?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionFacts {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitamins?: { [key: string]: string };
  minerals?: { [key: string]: string };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserPreferences {
  newsletter: boolean;
  smsNotifications: boolean;
  dietaryRestrictions: string[];
  fitnessGoals: string[];
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  variant?: ProductVariant;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
}

// Search and Filter Types
export interface SearchFilters {
  category?: string;
  subcategory?: string;
  priceRange?: [number, number];
  rating?: number;
  inStock?: boolean;
  tags?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  filters: SearchFilters;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Factory Management Types
export interface ProductionBatch {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantityProduced: number;
  productionDate: Date;
  completionDate?: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  materialCosts: MaterialCost[];
  laborCosts: LaborCost[];
  overheadCosts: OverheadCost[];
  totalCost: number;
  costPerUnit: number;
  qualityCheck: QualityCheck;
  assignedWorkers: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaterialCost {
  id: string;
  materialName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  supplier?: string;
}

export interface LaborCost {
  id: string;
  workerId: string;
  workerName: string;
  hoursWorked: number;
  hourlyRate: number;
  totalCost: number;
  taskDescription: string;
}

export interface OverheadCost {
  id: string;
  category: 'utilities' | 'equipment' | 'maintenance' | 'other';
  description: string;
  amount: number;
  allocatedPercentage: number;
}

export interface QualityCheck {
  id: string;
  inspector: string;
  checkDate: Date;
  passed: boolean;
  notes?: string;
  defectRate: number;
}

// Shop Management Types
export interface ShopInventory {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  location: string;
  lastRestocked: Date;
  averageSalesPerDay: number;
  reorderPoint: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstocked';
}

export interface Sale {
  id: string;
  saleDate: Date;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'pos';
  salesPerson: string;
  location: 'online' | 'physical_shop';
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Factory Worker Types
export interface Worker {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'production' | 'quality_control' | 'supervisor' | 'manager';
  department: string;
  hourlyRate: number;
  hireDate: Date;
  status: 'active' | 'inactive' | 'terminated';
  skills: string[];
  certifications: string[];
}

// Cost Estimation Types
export interface CostEstimate {
  id: string;
  productId: string;
  productName: string;
  estimatedQuantity: number;
  estimatedMaterialCosts: MaterialCost[];
  estimatedLaborHours: number;
  estimatedLaborCost: number;
  estimatedOverheadCost: number;
  totalEstimatedCost: number;
  estimatedCostPerUnit: number;
  profitMargin: number;
  suggestedSellingPrice: number;
  createdBy: string;
  createdAt: Date;
  status: 'draft' | 'approved' | 'rejected';
}

// Inventory Transfer Types
export interface InventoryTransfer {
  id: string;
  transferDate: Date;
  fromLocation: 'factory' | 'shop';
  toLocation: 'factory' | 'shop';
  items: TransferItem[];
  transferredBy: string;
  receivedBy?: string;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  notes?: string;
}

export interface TransferItem {
  productId: string;
  productName: string;
  quantity: number;
  batchNumber?: string;
}
