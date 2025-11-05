import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
    { path: '/admin', roles: ['ADMIN'] },
    { path: '/user', roles: ['USER'] },
];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;
    const rolesCookie = req.cookies.get("roles")?.value;
    const currentUrl = req.nextUrl.pathname + req.nextUrl.search;

    if (!token) {

        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.set("redirectAfterLogin", currentUrl, {
            path: "/",
            maxAge: 300,
            httpOnly: false,
        });
        return response;
    }

    try {
        const userRoles: string[] = rolesCookie ? JSON.parse(rolesCookie) : [];
        for (const route of protectedRoutes) {
            if (req.nextUrl.pathname.startsWith(route.path)) {
                // Kiểm tra ít nhất 1 role trùng khớp
                if (!userRoles.some(r => route.roles.includes(r))) {
                    return NextResponse.redirect(new URL("/forbiden403", req.url));
                }
            }
        }
        return NextResponse.next();

    } catch (err) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ['/admin', '/admin/(.*)', '/user', '/user/(.*)'],
};

