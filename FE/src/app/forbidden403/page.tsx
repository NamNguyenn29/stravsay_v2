'use client'
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
const Forbidden403 = () => {
    const router = useRouter();

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #ff4e50, #f9d423)",
                color: "#fff",
                textAlign: "center",
                px: 2,
            }}
        >
            <Typography variant="h1" sx={{ fontSize: { xs: "6rem", md: "10rem" }, fontWeight: "bold" }}>
                403
            </Typography>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Forbidden
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 400, mb: 4 }}>
                Bạn không có quyền truy cập vào trang này. Vui lòng quay về trang chủ hoặc liên hệ quản trị viên.
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => router.push("/")}
                sx={{
                    backgroundColor: "#fff",
                    color: "#ff4e50",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                }}
            >
                Quay về trang chủ
            </Button>
        </Box>
    );
};

export default Forbidden403;
