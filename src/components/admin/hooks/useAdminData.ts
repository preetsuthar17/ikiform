"use client";

import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface AdminUser {
  uid: string;
  name: string;
  email: string;
  has_premium: boolean;
  polar_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminForm {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  slug?: string | null;
}

interface AdminSubmission {
  id: string;
  form_id: string;
  submission_data: Record<string, any>;
  submitted_at: string;
  ip_address: string | null;
}

export function useAdminData() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [allForms, setAllForms] = useState<AdminForm[]>([]);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/data");

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Unauthorized access to admin data");
          return;
        }
        throw new Error("Failed to fetch admin data");
      }

      const data = await response.json();
      setUsers(data.users || []);
      setAllForms(data.forms || []);
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error("Error loading admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserPremium = async (email: string, hasPremium: boolean) => {
    try {
      const response = await fetch("/api/admin/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "toggle_user_premium",
          email,
          hasPremium,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Unauthorized access");
          return;
        }
        throw new Error("Failed to update user premium status");
      }

      const result = await response.json();
      toast.success(result.message);
      await loadAllData(); // Refresh data
    } catch (error) {
      console.error("Error updating user premium status:", error);
      toast.error("Failed to update user premium status");
    }
  };

  const deleteForm = async (formId: string) => {
    try {
      const response = await fetch("/api/admin/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete_form",
          formId,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Unauthorized access");
          return;
        }
        throw new Error("Failed to delete form");
      }

      const result = await response.json();
      toast.success(result.message);
      await loadAllData(); // Refresh data
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form");
    }
  };

  const deleteUser = async (uid: string) => {
    try {
      const response = await fetch("/api/admin/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete_user",
          uid,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Unauthorized access");
          return;
        }
        throw new Error("Failed to delete user");
      }

      const result = await response.json();
      toast.success(result.message);
      await loadAllData(); // Refresh data
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const deleteSubmission = async (submissionId: string) => {
    try {
      const response = await fetch("/api/admin/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete_submission",
          submissionId,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Unauthorized access");
          return;
        }
        throw new Error("Failed to delete submission");
      }

      const result = await response.json();
      toast.success(result.message);
      await loadAllData(); // Refresh data
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
    }
  };

  const clearCache = async () => {
    try {
      const response = await fetch("/api/admin/cache", {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Unauthorized access");
          return;
        }
        throw new Error("Failed to clear cache");
      }

      const result = await response.json();
      toast.success(result.message);
      await loadAllData(); // Refresh data after clearing cache
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast.error("Failed to clear cache");
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return {
    users,
    allForms,
    submissions,
    loading,
    toggleUserPremium,
    deleteForm,
    deleteUser,
    deleteSubmission,
    refreshData: loadAllData,
    clearCache,
  };
}
