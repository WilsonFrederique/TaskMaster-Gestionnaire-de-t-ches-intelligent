import axios from "axios";
import { Category } from "./Categories_api";

export interface Task {
  id: number;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  image_path: string | null;
  status: 'a_faire' | 'en_cours' | 'terminee';
  priority: 'faible' | 'moyenne' | 'haute';
  created_at: string;
  category: Category;
}

export interface TaskCreateData {
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  status: 'a_faire' | 'en_cours' | 'terminee';
  priority: 'faible' | 'moyenne' | 'haute';
  category_id: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const TaskService = {
  /**
   * Récupère toutes les tâches
   */
  async getAll(): Promise<Task[]> {
    try {
      const response = await axios.get<Task[]>(`${API_BASE_URL}/tasks/`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors de la récupération des tâches"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Récupère une tâche par son ID
   */
  async getById(id: number): Promise<Task> {
    try {
      const response = await axios.get<Task>(`${API_BASE_URL}/tasks/${id}/`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Tâche non trouvée"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Crée une nouvelle tâche
   */
  async create(data: TaskCreateData): Promise<Task> {
    try {
      // Formatage des dates pour Django
      const formattedData = {
        ...data,
        start_datetime: new Date(data.start_datetime).toISOString(),
        end_datetime: new Date(data.end_datetime).toISOString()
      };

      const response = await axios.post<Task>(`${API_BASE_URL}/tasks/`, formattedData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Détails erreur API:', error.response?.data);
        const errorMsg = error.response?.data?.detail || 
                       error.response?.data?.error || 
                       error.response?.data?.message ||
                       "Erreur lors de la création de la tâche";
        throw new Error(errorMsg);
      }
      throw new Error("Erreur inattendue lors de la création");
    }
  },

  /**
   * Met à jour une tâche existante
   */
  async update(id: number, data: Partial<TaskCreateData>): Promise<Task> {
    try {
      const formattedData = data.start_datetime && data.end_datetime ? {
        ...data,
        start_datetime: new Date(data.start_datetime).toISOString(),
        end_datetime: new Date(data.end_datetime).toISOString()
      } : data;

      const response = await axios.patch<Task>(
        `${API_BASE_URL}/tasks/${id}/`,
        formattedData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors de la mise à jour de la tâche"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Supprime une tâche
   */
  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}/`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors de la suppression de la tâche"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Change le statut d'une tâche
   */
  async updateStatus(id: number, status: 'a_faire' | 'en_cours' | 'terminee'): Promise<Task> {
    try {
      const response = await axios.patch<Task>(
        `${API_BASE_URL}/tasks/${id}/`,
        { status }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors du changement de statut"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Filtre les tâches par statut
   */
  async filterByStatus(status: string): Promise<Task[]> {
    try {
      const response = await axios.get<Task[]>(
        `${API_BASE_URL}/tasks/?status=${status}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors du filtrage des tâches"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Filtre les tâches par priorité
   */
  async filterByPriority(priority: string): Promise<Task[]> {
    try {
      const response = await axios.get<Task[]>(
        `${API_BASE_URL}/tasks/?priority=${priority}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors du filtrage des tâches"
        );
      }
      throw new Error("Erreur inattendue");
    }
  }
};