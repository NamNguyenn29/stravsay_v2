'use client';
import UserMenu from "@/components/user/UserMenu";
import { motion } from "framer-motion";

export default function UserLayout({ children }: { children: React.ReactNode }) {


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <UserMenu />
            {children}
        </motion.div>
    );
}
