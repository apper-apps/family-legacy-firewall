import { usersService } from './usersService';

class AuthService {
  async authenticate(email, password) {
    // Authentication is now handled by ApperUI
    // This service is maintained for compatibility but not used
    return null;
  }
  
  validatePassword(user, password) {
    // Password validation is now handled by ApperUI
    // This method is maintained for compatibility but not used
    return false;
  }
  
  logout() {
    // Logout is now handled by ApperUI
    // This method is maintained for compatibility but not used
    return Promise.resolve();
  }
}

export const authService = new AuthService();