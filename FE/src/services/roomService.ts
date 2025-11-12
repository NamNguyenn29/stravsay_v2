import api from "@/lib/axios";


export const roomService = {
    getRoomType: () => api.get("/RoomType"),
    createRoom: (formData: FormData) =>
        api.post("/Room", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }),

    updateRoom: (id: string, formData: FormData) => api.put(`/Room/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),
    removeRoom: (id: string) => api.delete(`/Room/${id}`),
    searchRoom: (filter: string, currentPage: number, pageSize: number) => api.get(`/Room/search?filter=${filter}&currentPage=${currentPage}&pageSize=${pageSize}`)
}