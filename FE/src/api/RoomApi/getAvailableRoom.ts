import { ApiResponse } from "@/model/ApiResponse";
import { Room } from "@/model/Room";
import { SearchRoom } from "@/model/SearchRoom";
export async function getAvailableRoom(searchRoom: SearchRoom): Promise<ApiResponse<Room>> {
    try {
        console.log(searchRoom);
        let url = "";
        if (searchRoom.roomTypeId == null) {
            url = `https://localhost:7020/api/Room/available?checkInDate=${encodeURIComponent(searchRoom.checkInDate)}&checkOutDate=${encodeURIComponent(searchRoom.checkOutDate)}&adult=${searchRoom.noAdult}&children=${searchRoom.noChildren}`;
        }
        else {
            url = `https://localhost:7020/api/Room/available?selectedRoomTypeId=${searchRoom?.roomTypeId}&checkInDate=${encodeURIComponent(searchRoom.checkInDate)}&checkOutDate=${encodeURIComponent(searchRoom.checkOutDate)}&adult=${searchRoom.noAdult}&children=${searchRoom.noChildren}`;
        }
        const res = await fetch(url, { method: "GET" });

        if (!res.ok) throw new Error("Failed to fetch rooms");
        return await res.json();
    } catch (err) {
        console.error("Error fetching rooms:", err);
        return {
            code: "500",
            message: "Error fetching rooms",
            isSuccess: false,
            list: [],
        } as ApiResponse<Room>;
    }
}
