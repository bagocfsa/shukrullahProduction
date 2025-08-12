// Google Sheets Authentication Service
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQaONZmV5tBSRUhpEfgqKaGatSax_lUnH4gyQpwAAnMs9Kka9p6BF_U9s5oLxcZR6kn9cPaTNXkkr9C/pub?output=csv';

export interface GoogleSheetsUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'staff' | 'manager';
  phone?: string;
  department?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  lastLogin?: string;
}

export class GoogleSheetsAuthService {
  private static instance: GoogleSheetsAuthService;
  private users: GoogleSheetsUser[] = [];
  private lastFetch: number = 0;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes cache

  public static getInstance(): GoogleSheetsAuthService {
    if (!GoogleSheetsAuthService.instance) {
      GoogleSheetsAuthService.instance = new GoogleSheetsAuthService();
    }
    return GoogleSheetsAuthService.instance;
  }

  /**
   * Parse CSV text into user objects
   */
  private parseCSV(csvText: string): GoogleSheetsUser[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    // Get headers from first line
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const users: GoogleSheetsUser[] = [];

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length < headers.length) continue;

      const user: any = {};
      headers.forEach((header, index) => {
        user[header] = values[index] || '';
      });

      // Map to our user interface (adjust field names as needed)
      const mappedUser: GoogleSheetsUser = {
        id: user.id || user.ID || `user_${i}`,
        email: user.email || user.Email || '',
        password: user.password || user.Password || '',
        firstName: user.firstName || user.FirstName || user.first_name || '',
        lastName: user.lastName || user.LastName || user.last_name || '',
        role: this.mapRole(user.role || user.Role || 'staff'),
        phone: user.phone || user.Phone || '',
        department: user.department || user.Department || '',
        status: this.mapStatus(user.status || user.Status || 'active'),
        createdAt: user.createdAt || user.CreatedAt || user.created_at || '',
        lastLogin: user.lastLogin || user.LastLogin || user.last_login || ''
      };

      // Only add users with valid email and password
      if (mappedUser.email && mappedUser.password) {
        users.push(mappedUser);
      }
    }

    return users;
  }

  /**
   * Parse a single CSV line handling quoted values
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  /**
   * Map role values to our role types
   */
  private mapRole(role: string): 'admin' | 'staff' | 'manager' {
    const roleStr = role.toLowerCase().trim();
    if (roleStr.includes('admin')) return 'admin';
    if (roleStr.includes('manager')) return 'manager';
    return 'staff';
  }

  /**
   * Map status values to our status types
   */
  private mapStatus(status: string): 'active' | 'inactive' {
    const statusStr = status.toLowerCase().trim();
    return statusStr === 'active' || statusStr === '1' || statusStr === 'true' ? 'active' : 'inactive';
  }

  /**
   * Fetch users from Google Sheets
   */
  public async fetchUsers(): Promise<GoogleSheetsUser[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.users.length > 0 && (now - this.lastFetch) < this.cacheDuration) {
      return this.users;
    }

    try {
      console.log('Fetching users from Google Sheets...');
      const response = await fetch(GOOGLE_SHEETS_CSV_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      this.users = this.parseCSV(csvText);
      this.lastFetch = now;

      console.log(`Loaded ${this.users.length} users from Google Sheets`);
      return this.users;
    } catch (error) {
      console.error('Error fetching users from Google Sheets:', error);
      
      // Return fallback admin user if Google Sheets fails
      if (this.users.length === 0) {
        console.warn('Google Sheets failed to load. Using emergency fallback admin user.');
        this.users = [{
          id: 'emergency_admin',
          email: 'admin@localhost',
          password: 'emergency123',
          firstName: 'Emergency',
          lastName: 'Admin',
          role: 'admin',
          phone: '09019286029',
          department: 'System',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: ''
        }];
      }
      
      return this.users;
    }
  }

  /**
   * Authenticate user with email and password
   */
  public async authenticateUser(email: string, password: string): Promise<GoogleSheetsUser | null> {
    const users = await this.fetchUsers();
    
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password &&
      u.status === 'active'
    );

    if (user) {
      // Update last login (in a real app, you'd update the sheet)
      console.log(`User authenticated: ${user.firstName} ${user.lastName} (${user.role})`);
      return { ...user, lastLogin: new Date().toISOString() };
    }

    return null;
  }

  /**
   * Get user by email
   */
  public async getUserByEmail(email: string): Promise<GoogleSheetsUser | null> {
    const users = await this.fetchUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  /**
   * Get all users (admin only)
   */
  public async getAllUsers(): Promise<GoogleSheetsUser[]> {
    return await this.fetchUsers();
  }

  /**
   * Clear cache (force refresh from Google Sheets)
   */
  public clearCache(): void {
    this.users = [];
    this.lastFetch = 0;
  }

  /**
   * Get cache status
   */
  public getCacheStatus(): { cached: boolean; lastFetch: Date | null; userCount: number } {
    return {
      cached: this.users.length > 0,
      lastFetch: this.lastFetch > 0 ? new Date(this.lastFetch) : null,
      userCount: this.users.length
    };
  }
}

export default GoogleSheetsAuthService.getInstance();
