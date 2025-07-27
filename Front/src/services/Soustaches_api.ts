import axios from "axios";

export interface SubTask {
  id: number;
  title: string;
  is_done: boolean;
  task_id: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const SubTaskService = {
  /**
   * Récupère toutes les sous-tâches d'une tâche
   */
  async getByTask(taskId: number): Promise<SubTask[]> {
    try {
      const response = await axios.get<SubTask[]>(
        `${API_BASE_URL}/subtasks/?task=${taskId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors de la récupération des sous-tâches"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Crée une nouvelle sous-tâche
   */
  async create(data: { title: string; task_id: number }): Promise<SubTask> {
    try {
      const response = await axios.post<SubTask>(
        `${API_BASE_URL}/subtasks/`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors de la création de la sous-tâche"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Met à jour une sous-tâche
   */
  async update(id: number, data: Partial<SubTask>): Promise<SubTask> {
    try {
      const response = await axios.patch<SubTask>(
        `${API_BASE_URL}/subtasks/${id}/`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors de la mise à jour de la sous-tâche"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Supprime une sous-tâche
   */
  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/subtasks/${id}/`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Erreur lors de la suppression de la sous-tâche"
        );
      }
      throw new Error("Erreur inattendue");
    }
  },

  /**
   * Basculer l'état is_done d'une sous-tâche
   */
  async toggleStatus(id: number): Promise<SubTask> {
    try {
      // D'abord récupérer la sous-tâche actuelle
      const current = await axios.get<SubTask>(`${API_BASE_URL}/subtasks/${id}/`);
      // Puis inverser le statut
      const response = await axios.patch<SubTask>(
        `${API_BASE_URL}/subtasks/${id}/`,
        { is_done: !current.data.is_done }
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
  }
};