import { usersService } from './usersService';

class AuthService {
  async authenticate(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const users = await usersService.getAll();
      
      // Find user by email
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        return null;
      }
      
      // Validate password based on role
      const validPassword = this.validatePassword(user, password);
      
      if (!validPassword) {
        return null;
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error('Authentication failed');
    }
  }
  
  validatePassword(user, password) {
    // Simple password validation based on role and email
    // In a real app, this would check against hashed passwords
if (user.role === 'admin' && user.email === 'vivek.b@companyhub.com') {
      return password === 'admin123';
    }
    
    if (user.role === 'participant') {
      return password === 'participant123';
    }
    
    return false;
  }
  
  logout() {
    // In a real app, this would clear tokens, etc.
    return Promise.resolve();
  }
}

export const authService = new AuthService();