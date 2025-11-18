import { apiClient } from "./apiClient";

/**
 * Transform snake_case backend profile to camelCase
 */
const transformProfile = (data) => {
  return {
    id: data.id,
    villageId: data.village_id,
    description: data.description || "",
    vision: data.vision || "",
    mission: Array.isArray(data.mission) ? data.mission : [],
    area: data.area || null,
    population: data.population || null,
    populationDensity: data.population_density || null,
    address: data.address || "",
    phone: data.phone || "",
    email: data.email || "",
    website: data.website || "",
    logoUrl: data.logo_url || "",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const villageProfileService = {
  /**
   * Get village profile (public endpoint)
   * @param {number} villageId
   */
  async getProfile(villageId) {
    try {
      const response = await apiClient.get(`/villages/${villageId}/profile`);
      return transformProfile(response.data);
    } catch (error) {
      console.error("Failed to fetch village profile:", error);
      throw error;
    }
  },

  /**
   * Update village profile
   * Requires: BPS Admin or Village Officer (own village only)
   * @param {number} villageId
   * @param {Object} profileData - camelCase profile fields
   */
  async updateProfile(villageId, profileData) {
    try {
      // Transform camelCase to snake_case for backend
      const payload = {};

      if (profileData.description !== undefined)
        payload.description = profileData.description;
      if (profileData.vision !== undefined) payload.vision = profileData.vision;
      if (profileData.mission !== undefined)
        payload.mission = profileData.mission;
      if (profileData.area !== undefined) payload.area = profileData.area;
      if (profileData.population !== undefined)
        payload.population = profileData.population;
      if (profileData.address !== undefined)
        payload.address = profileData.address;
      if (profileData.phone !== undefined) payload.phone = profileData.phone;
      if (profileData.email !== undefined) payload.email = profileData.email;
      if (profileData.website !== undefined)
        payload.website = profileData.website;
      if (profileData.logoUrl !== undefined)
        payload.logo_url = profileData.logoUrl;

      const response = await apiClient.put(
        `/villages/${villageId}/profile`,
        payload
      );
      return transformProfile(response.data);
    } catch (error) {
      console.error("Failed to update village profile:", error);
      throw error;
    }
  },

  /**
   * Upload logo image (Note: Backend currently accepts logo_url as string, not file upload)
   * This is a placeholder for future file upload implementation
   */
  async uploadLogo() {
    // TODO: Implement when backend supports file upload
    // For now, we'll need to host the image elsewhere and pass the URL
    throw new Error(
      "Logo file upload not yet implemented. Use logoUrl field with hosted image URL."
    );
  },
};
