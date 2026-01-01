import api from "@/utils/axiosInstance";

export const getTeamMembers = async () => {
  const { data } = await api.get("/admin/team");
  return data;
};

export const addMember = async (payload) => {
  const { data } = await api.post("/admin/team", payload);
  return data;
};

export const updateMember = async (id, payload) => {
  const { data } = await api.patch(`/admin/team"/${id}`, payload);
  return data;
};

export const deleteMember = async (id) => {
  return api.delete(`/admin/team/${id}`);
};
