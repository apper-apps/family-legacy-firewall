import { usersService } from '@/services/api/usersService';
import { sectionsService } from '@/services/api/sectionsService';
import emailjs from '@emailjs/browser';

class NotificationService {
  constructor() {
    // EmailJS configuration - in production, these would be environment variables
    this.serviceId = 'service_familylegacy';
    this.templateId = 'template_section_complete';
    this.publicKey = 'your_emailjs_public_key';
    
    // Initialize EmailJS
    if (typeof window !== 'undefined') {
      emailjs.init(this.publicKey);
    }
  }

  async sendSectionCompletionNotification(userId, sectionId) {
    try {
      await this.delay(300);
      
      // Get participant and section details
      const [user, section, admins] = await Promise.all([
        usersService.getById(userId),
        sectionsService.getById(sectionId),
        this.getAdminUsers()
      ]);

      const notificationData = {
        participantName: user.name,
        participantEmail: user.email,
        sectionTitle: section.title,
        sectionNumber: section.order,
        completionTime: new Date().toLocaleString(),
        completionDate: new Date().toLocaleDateString()
      };

      // Send notifications to all admin users
      const notificationPromises = admins.map(admin => 
        this.sendEmailNotification(admin.email, notificationData)
      );

      await Promise.all(notificationPromises);
      
      // Log notification for debugging
      console.log(`Sent section completion notifications for ${user.name} completing ${section.title}`);
      
      return {
        success: true,
        recipientCount: admins.length,
        participant: user.name,
        section: section.title
      };
      
    } catch (error) {
      console.error('Failed to send section completion notification:', error);
      throw error;
    }
  }

  async sendEmailNotification(adminEmail, notificationData) {
    // In mock mode, simulate email sending
    if (this.isMockMode()) {
      await this.delay(500);
      console.log(`Mock email sent to ${adminEmail}:`, {
        subject: `Section Completed: ${notificationData.participantName} - ${notificationData.sectionTitle}`,
        body: `${notificationData.participantName} has completed section ${notificationData.sectionNumber}: "${notificationData.sectionTitle}" at ${notificationData.completionTime}.`
      });
      return { success: true, mode: 'mock' };
    }

    // Real email sending via EmailJS
    try {
      const templateParams = {
        to_email: adminEmail,
        participant_name: notificationData.participantName,
        participant_email: notificationData.participantEmail,
        section_title: notificationData.sectionTitle,
        section_number: notificationData.sectionNumber,
        completion_time: notificationData.completionTime,
        completion_date: notificationData.completionDate
      };

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      return { success: true, mode: 'email', response };
    } catch (error) {
      console.error('EmailJS sending failed:', error);
      throw error;
    }
  }

  async getAdminUsers() {
    const allUsers = await usersService.getAll();
    return allUsers.filter(user => user.role === 'admin');
  }

  isMockMode() {
    // Use mock mode when EmailJS is not properly configured
    return !this.serviceId || this.serviceId === 'service_familylegacy' || 
           !this.publicKey || this.publicKey === 'your_emailjs_public_key';
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const notificationService = new NotificationService();