import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
    { path: "/admin", roles: ["ADMIN"] },
    { path: "/user", roles: ["USER"] },
];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;
    const rolesCookie = req.cookies.get("roles")?.value;
    const currentUrl = req.nextUrl.href;

    if (!token) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.set("redirectAfterLogin", currentUrl, {
            path: "/",
            maxAge: 300, // 5 phút
            httpOnly: false,
        });
        return response;
    }

    let userRoles: string[] = [];
    try {
        userRoles = rolesCookie ? JSON.parse(rolesCookie) : [];
        if (!Array.isArray(userRoles)) userRoles = [];
    } catch {
        userRoles = [];
    }

    for (const route of protectedRoutes) {
        if (req.nextUrl.pathname.startsWith(route.path)) {
            const hasAccess = userRoles.some((r) => route.roles.includes(r));
            if (!hasAccess) {
                return NextResponse.redirect(new URL("/forbidden403", req.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin", "/admin/:path*", "/user", "/user/:path*"],
};
