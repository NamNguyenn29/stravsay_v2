import api from "@/lib/axios";
import { RoomRequest } from "@/model/RoomRequest";


export const roomTypeService = {
    getRoomType: () => api.get("/RoomType"),

}
