import { usersService } from '@/services/api/usersService';
import { sectionsService } from '@/services/api/sectionsService';
import emailjs from '@emailjs/browser';

class NotificationService {
  constructor() {
    // EmailJS configuration - in production, these would be environment variables
    this.serviceId = 'service_familylegacy';
    this.templateId = 'template_section_complete';
    this.profileTemplateId = 'template_profile_update';
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
        this.sendEmailNotification(admin.email, notificationData, 'section')
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

  async sendProfileUpdateNotification(userId, originalUser, updatedUser) {
    try {
      await this.delay(300);
      
      const admins = await this.getAdminUsers();

      // Identify changed fields
      const changes = [];
      const fieldsToCheck = ['name', 'email', 'phone', 'company', 'position'];
      
      fieldsToCheck.forEach(field => {
        if (originalUser[field] !== updatedUser[field]) {
          changes.push({
            field: field.charAt(0).toUpperCase() + field.slice(1),
            from: originalUser[field] || 'Not set',
            to: updatedUser[field] || 'Not set'
          });
        }
      });

      if (changes.length === 0) {
        return { success: true, changes: 0 };
      }

      const notificationData = {
        participantName: updatedUser.name,
        participantEmail: updatedUser.email,
        participantId: userId,
        updateTime: new Date().toLocaleString(),
        updateDate: new Date().toLocaleDateString(),
        changes: changes,
        changeCount: changes.length,
        changesText: changes.map(c => `${c.field}: "${c.from}" → "${c.to}"`).join(', ')
      };

      // Send notifications to all admin users
      const notificationPromises = admins.map(admin => 
        this.sendEmailNotification(admin.email, notificationData, 'profile')
      );

      await Promise.all(notificationPromises);
      
      // Log notification for debugging
      console.log(`Sent profile update notifications for ${updatedUser.name} with ${changes.length} changes`);
      
      return {
        success: true,
        recipientCount: admins.length,
        participant: updatedUser.name,
        changes: changes.length
      };
      
    } catch (error) {
      console.error('Failed to send profile update notification:', error);
      throw error;
    }
  }

  async sendEmailNotification(adminEmail, notificationData, type = 'section') {
    // In mock mode, simulate email sending
    if (this.isMockMode()) {
      await this.delay(500);
      
      if (type === 'profile') {
        console.log(`Mock email sent to ${adminEmail}:`, {
          subject: `Profile Updated: ${notificationData.participantName}`,
          body: `${notificationData.participantName} has updated their profile with ${notificationData.changeCount} changes: ${notificationData.changesText} at ${notificationData.updateTime}.`
        });
      } else {
        console.log(`Mock email sent to ${adminEmail}:`, {
          subject: `Section Completed: ${notificationData.participantName} - ${notificationData.sectionTitle}`,
          body: `${notificationData.participantName} has completed section ${notificationData.sectionNumber}: "${notificationData.sectionTitle}" at ${notificationData.completionTime}.`
        });
      }
      return { success: true, mode: 'mock' };
    }

    // Real email sending via EmailJS
    try {
      let templateParams;
      let templateId;

      if (type === 'profile') {
        templateId = this.profileTemplateId;
        templateParams = {
          to_email: adminEmail,
          participant_name: notificationData.participantName,
          participant_email: notificationData.participantEmail,
          participant_id: notificationData.participantId,
          update_time: notificationData.updateTime,
          update_date: notificationData.updateDate,
          changes_text: notificationData.changesText,
          change_count: notificationData.changeCount
        };
      } else {
        templateId = this.templateId;
        templateParams = {
          to_email: adminEmail,
          participant_name: notificationData.participantName,
          participant_email: notificationData.participantEmail,
          section_title: notificationData.sectionTitle,
          section_number: notificationData.sectionNumber,
          completion_time: notificationData.completionTime,
          completion_date: notificationData.completionDate
        };
      }

      const response = await emailjs.send(
        this.serviceId,
        templateId,
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