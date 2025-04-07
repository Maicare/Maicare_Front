import api from "@/common/api/axios";
import { useMutation, useQueryClient } from "react-query";

async function markAsRead(notificationId: number) {
  const response = await api.post(`/system/notifications/${notificationId}/read`);
  return response.data;
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["latestNotifications"]);
    },
  });
};
