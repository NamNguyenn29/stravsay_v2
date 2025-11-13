import api from "@/lib/axios";



export const roomTypeService = {
    getRoomType: () => api.get("/RoomType"),

}
