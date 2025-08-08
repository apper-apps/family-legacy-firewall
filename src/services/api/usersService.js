import usersData from "@/services/mockData/users.json";

class UsersService {
  constructor() {
    this.users = [...usersData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.users];
  }

  async getById(id) {
    await this.delay(200);
    const user = this.users.find(u => u.Id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async getParticipants() {
    await this.delay(200);
    return this.users.filter(u => u.role === "participant").map(u => ({ ...u }));
  }

  async create(userData) {
    await this.delay(300);
    const newUser = {
      Id: Math.max(...this.users.map(u => u.Id)) + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const usersService = new UsersService();