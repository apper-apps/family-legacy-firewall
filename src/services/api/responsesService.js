import responsesData from "@/services/mockData/responses.json";

class ResponsesService {
  constructor() {
    this.responses = [...responsesData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.responses];
  }

  async getById(id) {
    await this.delay(200);
    const response = this.responses.find(r => r.Id === id);
    if (!response) {
      throw new Error("Response not found");
    }
    return { ...response };
  }

  async getByUserId(userId) {
    await this.delay(200);
    return this.responses
      .filter(r => r.userId === userId)
      .map(r => ({ ...r }));
  }

  async getByUserAndSection(userId, sectionId) {
    await this.delay(200);
    return this.responses
      .filter(r => r.userId === userId && r.sectionId === sectionId)
      .map(r => ({ ...r }));
  }

  async saveResponse(responseData) {
    await this.delay(300);
    
    // Check if response already exists
    const existingIndex = this.responses.findIndex(
      r => r.userId === responseData.userId && 
           r.sectionId === responseData.sectionId && 
           r.questionId === responseData.questionId
    );

    if (existingIndex !== -1) {
      // Update existing response
      this.responses[existingIndex] = {
        ...this.responses[existingIndex],
        answer: responseData.answer,
        lastSaved: new Date().toISOString()
      };
      return { ...this.responses[existingIndex] };
    } else {
      // Create new response
      const newResponse = {
        Id: Math.max(...this.responses.map(r => r.Id), 0) + 1,
        ...responseData,
        lastSaved: new Date().toISOString(),
        isComplete: responseData.answer && responseData.answer.trim() !== ""
      };
      this.responses.push(newResponse);
      return { ...newResponse };
    }
  }

  async delete(id) {
    await this.delay(200);
    const index = this.responses.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Response not found");
    }
    const deleted = this.responses.splice(index, 1)[0];
    return { ...deleted };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const responsesService = new ResponsesService();