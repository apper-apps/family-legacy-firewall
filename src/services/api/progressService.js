import { toast } from 'react-toastify';

class ProgressService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'progress_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "completion_percentage_c" } },
          { field: { Name: "last_updated_c" } },
          { 
            field: { Name: "user_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "section_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [{ fieldName: "last_updated_c", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching progress:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByUserId(userId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "completion_percentage_c" } },
          { field: { Name: "last_updated_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "section_id_c" } }
        ],
        where: [
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: [parseInt(userId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching progress by user:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByUserAndSection(userId, sectionId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "completion_percentage_c" } },
          { field: { Name: "last_updated_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "section_id_c" } }
        ],
        where: [
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: [parseInt(userId)]
          },
          {
            FieldName: "section_id_c",
            Operator: "EqualTo",
            Values: [parseInt(sectionId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching progress by user and section:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async updateProgress(userId, sectionId, completionPercentage) {
    try {
      // First check if progress exists
      const existingProgress = await this.getByUserAndSection(userId, sectionId);
      
      if (existingProgress) {
        // Update existing progress
        const params = {
          records: [
            {
              Id: existingProgress.Id,
              completion_percentage_c: completionPercentage,
              last_updated_c: new Date().toISOString()
            }
          ]
        };

        const response = await this.apperClient.updateRecord(this.tableName, params);
        
        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          return null;
        }

        if (response.results && response.results.length > 0 && response.results[0].success) {
          return response.results[0].data;
        }
      } else {
        // Create new progress
        const params = {
          records: [
            {
              Name: `Progress ${userId}-${sectionId}`,
              completion_percentage_c: completionPercentage,
              last_updated_c: new Date().toISOString(),
              user_id_c: parseInt(userId),
              section_id_c: parseInt(sectionId)
            }
          ]
        };

        const response = await this.apperClient.createRecord(this.tableName, params);
        
        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          return null;
        }

        if (response.results && response.results.length > 0 && response.results[0].success) {
          return response.results[0].data;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating progress:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
}

export const progressService = new ProgressService();