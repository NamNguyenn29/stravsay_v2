import UserMenu from "@/components/user/UserMenu"
export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <UserMenu />
            {children}
        </div>
    )
}

