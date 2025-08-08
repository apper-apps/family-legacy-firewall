import sectionsData from "@/services/mockData/sections.json";

class SectionsService {
  constructor() {
    this.sections = [...sectionsData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.sections];
  }

  async getById(id) {
    await this.delay(200);
    const section = this.sections.find(s => s.Id === id);
    if (!section) {
      throw new Error("Section not found");
    }
    return { ...section };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const sectionsService = new SectionsService();