// hooks/useAuthGuard.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/model/DecodedToken";

export function useAuthGuard(requiredRole: "ADMIN" | "USER") {
    const router = useRouter();
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        if (!token) return router.push("/login");

        try {
            const decoded: DecodedToken = jwtDecode(token);
            const now = Date.now() / 1000;

            if (decoded.exp && decoded.exp < now) {
                sessionStorage.removeItem("accessToken");
                router.push("/login");
                return;
            }

            const rawRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            const roles = Array.isArray(rawRole) ? rawRole : [rawRole];
            if (!roles.includes(requiredRole)) router.push("/login");
            else setIsValid(true);
        } catch {
            router.push("/login");
        }
    }, [requiredRole, router]);

    return isValid;
}
