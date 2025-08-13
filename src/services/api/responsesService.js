import { toast } from 'react-toastify';

class ResponsesService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'response_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "answer_c" } },
          { field: { Name: "last_saved_c" } },
          { field: { Name: "is_complete_c" } },
          { 
            field: { Name: "user_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "section_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "question_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [{ fieldName: "last_saved_c", sorttype: "DESC" }]
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
        console.error("Error fetching responses:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "answer_c" } },
          { field: { Name: "last_saved_c" } },
          { field: { Name: "is_complete_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "section_id_c" } },
          { field: { Name: "question_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error("Response not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching response with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Response not found");
    }
  }

  async getByUserId(userId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "answer_c" } },
          { field: { Name: "last_saved_c" } },
          { field: { Name: "is_complete_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "section_id_c" } },
          { field: { Name: "question_id_c" } }
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
        console.error("Error fetching responses by user:", error?.response?.data?.message);
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
          { field: { Name: "answer_c" } },
          { field: { Name: "last_saved_c" } },
          { field: { Name: "is_complete_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "section_id_c" } },
          { field: { Name: "question_id_c" } }
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
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching responses by user and section:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async saveResponse(responseData) {
    try {
      // First check if response exists
      const existingResponses = await this.getByUserAndSection(responseData.user_id_c, responseData.section_id_c);
      const existingResponse = existingResponses.find(r => r.question_id_c === responseData.question_id_c);
      
      if (existingResponse) {
        // Update existing response
        const params = {
          records: [
            {
              Id: existingResponse.Id,
              answer_c: responseData.answer_c,
              last_saved_c: new Date().toISOString(),
              is_complete_c: responseData.answer_c && responseData.answer_c.trim() !== ""
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
        // Create new response
        const params = {
          records: [
            {
              Name: responseData.Name || `Response ${Date.now()}`,
              answer_c: responseData.answer_c,
              last_saved_c: new Date().toISOString(),
              is_complete_c: responseData.answer_c && responseData.answer_c.trim() !== "",
              user_id_c: parseInt(responseData.user_id_c),
              section_id_c: parseInt(responseData.section_id_c),
              question_id_c: parseInt(responseData.question_id_c)
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
        console.error("Error saving response:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(recordIds) {
    try {
      const params = {
        RecordIds: Array.isArray(recordIds) ? recordIds : [recordIds]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete response records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === params.RecordIds.length;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting responses:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const responsesService = new ResponsesService();