import { ApiResponse } from "@/model/ApiResponse";
import { NewSupportRequest } from "@/model/NewSupportRequest";
export async function CreateNewSupportRequest(newSupportRequest: NewSupportRequest): Promise<ApiResponse<string>> {
    try {
        console.log(newSupportRequest);
        const res = await fetch("https://localhost:7020/api/SupportRequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify(newSupportRequest),
        });
        if (!res.ok) throw new Error("Failed to create support request");
        return await res.json();

    } catch (err) {
        console.error("Error creating support request:", err);
        return {
            code: "500",
            message: "Error fetching ",
            isSuccess: false,
            list: [],
        } as ApiResponse<string>;
    }
}

//modified