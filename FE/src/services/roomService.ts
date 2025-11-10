import api from "@/lib/axios";
import { RoomRequest } from "@/model/RoomRequest";

export const roomService = {
    getRoomType: () => api.get("/RoomType"),
    createRoom: (formData: FormData) =>
        api.post("/Room", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }),

    updateRoom: (id: string, room: RoomRequest) => api.put(`/Room/${id}`, room),
    removeRoom: (id: string) => api.delete(`/Room/${id}`)
}