import api from "@/lib/axios";
import { SearchRoom } from "@/model/SearchRoom";


export const roomService = {
    createRoom: (formData: FormData) =>
        api.post("/Room", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }),

    updateRoom: (id: string, formData: FormData) => api.put(`/Room/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),
    removeRoom: (id: string) => api.delete(`/Room/${id}`),
    searchRoom: (filter: string, currentPage: number, pageSize: number) => api.get(`/Room/search?filter=${filter}&currentPage=${currentPage}&pageSize=${pageSize}`),
    getRoomById: (roomId: string) => api.get(`/Room/${roomId}`),
    getRooms: (currentPage: number, pageSize: number) => api.get(`/Room?currentPage=${currentPage}&pageSize=${pageSize}`),
    getAvailableRoom: (searchRoom: SearchRoom) => {
        const baseUrl = `/Room/available?checkInDate=${encodeURIComponent(searchRoom.checkInDate)}&checkOutDate=${encodeURIComponent(searchRoom.checkOutDate)}&adult=${searchRoom.noAdult}&children=${searchRoom.noChildren}`;
        const url = searchRoom.roomTypeId
            ? `${baseUrl}&selectedRoomTypeId=${searchRoom.roomTypeId}`
            : baseUrl;

        return api.get(url);
    }
}