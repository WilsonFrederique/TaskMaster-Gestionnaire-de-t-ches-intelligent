import axios from "axios";

export interface Category {
  id: number;
  name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Service pour gérer les opérations CRUD des catégories
 */
export const CategoryService = {
  /**
   * Récupère toutes les catégories
   */
  async getAll(): Promise<Category[]> {
    try {
      const response = await axios.get<Category[]>(`${API_BASE_URL}/categories/`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors de la récupération des catégories"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Récupère une catégorie par son ID
   */
  async getById(id: number): Promise<Category> {
    try {
      const response = await axios.get<Category>(`${API_BASE_URL}/categories/${id}/`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Catégorie non trouvée"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Crée une nouvelle catégorie
   */
  async create(data: { name: string }): Promise<Category> {
    try {
      const response = await axios.post<Category>(`${API_BASE_URL}/categories/`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors de la création de la catégorie"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Met à jour une catégorie existante
   */
  async update(id: number, data: { name: string }): Promise<Category> {
    try {
      const response = await axios.put<Category>(`${API_BASE_URL}/categories/${id}/`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors de la mise à jour de la catégorie"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Supprime une catégorie
   */
  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}/`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors de la suppression de la catégorie"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Recherche des catégories par nom
   */
  async search(name: string): Promise<Category[]> {
    try {
      const response = await axios.get<Category[]>(`${API_BASE_URL}/categories/?search=${name}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors de la recherche des catégories"
        );
      }
      throw new Error("Erreur inattendue");
    }
  }
};