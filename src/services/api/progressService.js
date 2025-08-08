import progressData from "@/services/mockData/progress.json";
import { notificationService } from '@/services/api/notificationService';

class ProgressService {
  constructor() {
    this.progress = [...progressData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.progress];
  }

  async getByUserId(userId) {
    await this.delay(200);
    return this.progress
      .filter(p => p.userId === userId)
      .map(p => ({ ...p }));
  }

  async getByUserAndSection(userId, sectionId) {
    await this.delay(200);
    return this.progress.find(p => p.userId === userId && p.sectionId === sectionId) || null;
  }

async updateProgress(userId, sectionId, completionPercentage) {
    await this.delay(300);
    
    const existingIndex = this.progress.findIndex(
      p => p.userId === userId && p.sectionId === sectionId
    );

    const progressData = {
      userId,
      sectionId,
      completionPercentage,
      lastUpdated: new Date().toISOString()
    };

    let updatedProgress;
    const wasCompleted = existingIndex !== -1 && this.progress[existingIndex].completionPercentage === 100;
    
    if (existingIndex !== -1) {
      // Update existing progress
      this.progress[existingIndex] = {
        ...this.progress[existingIndex],
        ...progressData
      };
      updatedProgress = { ...this.progress[existingIndex] };
    } else {
      // Create new progress entry
      const newProgress = {
        Id: Math.max(...this.progress.map(p => p.Id), 0) + 1,
        ...progressData
      };
      this.progress.push(newProgress);
      updatedProgress = { ...newProgress };
    }

    // Send notification to admins when section is completed for the first time
    if (completionPercentage === 100 && !wasCompleted) {
      try {
        await notificationService.sendSectionCompletionNotification(userId, sectionId);
      } catch (error) {
        console.error('Failed to send completion notification:', error);
        // Don't fail the progress update if notification fails
      }
    }

    return updatedProgress;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const progressService = new ProgressService();