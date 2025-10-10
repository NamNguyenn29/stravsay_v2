import UserMenu from "@/components/home/UserMenu"
export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <UserMenu />
            {children}
        </div>
    )
}

