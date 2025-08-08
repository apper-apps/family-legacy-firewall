import usersData from "@/services/mockData/users.json";
import { notificationService } from "@/services/api/notificationService";

let users = [...usersData];
class UsersService {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...users];
  }

  async getById(id) {
    // Validate id parameter
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid user ID');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = users.find(u => u.Id === id);
    return user ? { ...user } : null;
  }

  async create(userData) {
    // Auto-generate ID
    const newId = users.length > 0 ? Math.max(...users.map(u => u.Id)) + 1 : 1;
    
    const newUser = {
      ...userData,
      Id: newId,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { ...newUser };
  }

async update(id, userData) {
    // Validate id parameter
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const userIndex = users.findIndex(u => u.Id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const originalUser = { ...users[userIndex] };
    const updatedUser = {
      ...users[userIndex],
      ...userData,
      Id: id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Send notification to admins if this is a participant profile update
    if (updatedUser.role === 'participant') {
      try {
        await notificationService.sendProfileUpdateNotification(id, originalUser, updatedUser);
      } catch (error) {
        console.error('Failed to send profile update notification:', error);
        // Don't fail the update if notification fails
      }
    }
    
    return { ...updatedUser };
  }

  async delete(id) {
    // Validate id parameter
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const userIndex = users.findIndex(u => u.Id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users.splice(userIndex, 1);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return true;
  }

  async authenticate(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return null;
    }
    
    // Simple password validation for demo
    // In a real app, this would check against hashed passwords
    const validPassword = this.validatePassword(user, password);
    
    if (!validPassword) {
      return null;
    }
    
    return { ...user };
  }

  validatePassword(user, password) {
    // Simple password validation based on role
    // In a real app, this would check against hashed passwords
    if (user.role === 'admin') {
      return password === 'admin123';
    }
    
    if (user.role === 'participant') {
      return password === 'participant123';
    }
    
    return false;
  }

  async getParticipants() {
    const allUsers = await this.getAll();
    return allUsers.filter(user => user.role === 'participant');
  }

  async getAdmins() {
    const allUsers = await this.getAll();
    return allUsers.filter(user => user.role === 'admin');
  }
}

export const usersService = new UsersService();