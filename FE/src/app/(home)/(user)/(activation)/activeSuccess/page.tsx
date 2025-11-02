"use client";

import React from "react";
import Link from "next/link";
import { Button } from "antd";
import { motion } from "framer-motion";
import { CheckCircleTwoTone } from "@ant-design/icons";

export default function ActiveSuccess() {
    return (
        <div
            style={{
                height: "80vh",
                width: "100vw",
                backgroundImage: "url('/active_background.jpg')",
                backgroundSize: "",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "'Poppins', sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Overlay - chỉ làm tối nhẹ để nổi card lên */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.25)",
                    zIndex: 0,
                }}
            />

            {/* Hiệu ứng ánh sáng nhẹ phía sau */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1.2 }}
                style={{
                    position: "absolute",
                    width: "600px",
                    height: "600px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(0,255,200,0.35), rgba(79,70,229,0.15), transparent 70%)",
                    filter: "blur(120px)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                }}
            />

            {/* Card chính */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                style={{
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "70px",
                    padding: "70px 100px",
                    background: "rgba(255, 255, 255, 0.08)",
                    borderRadius: "40px",
                    backdropFilter: "blur(25px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    boxShadow:
                        "0 0 60px rgba(0,0,0,0.45), inset 0 0 20px rgba(255,255,255,0.05)",
                    width: "75vw",
                    maxWidth: "1100px",
                }}
            >
                {/* Icon bên trái */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "backOut" }}
                    style={{
                        background:
                            "radial-gradient(circle at center, rgba(0,255,200,0.25), rgba(79,70,229,0.25))",
                        padding: "45px",
                        borderRadius: "50%",
                        boxShadow:
                            "0 0 50px rgba(0,255,200,0.4), 0 0 100px rgba(79,70,229,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CheckCircleTwoTone
                        twoToneColor="#00ffc8"
                        style={{ fontSize: "120px" }}
                    />
                </motion.div>

                {/* Nội dung bên phải */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        maxWidth: "480px",
                    }}
                >
                    <h1
                        style={{
                            color: "#FFFFFF",
                            fontWeight: 700,
                            fontSize: "30px",
                            marginBottom: "12px",
                            letterSpacing: "0.5px",
                            textShadow: "0 0 12px rgba(0,255,200,0.2)",
                        }}
                    >
                        🎉 Your account has been activated!
                    </h1>

                    <p
                        style={{
                            fontSize: "18px",
                            color: "#E5E7EB",
                            marginTop: "8px",
                            lineHeight: "1.7",
                        }}
                    >
                        Welcome to{" "}
                        <b
                            style={{
                                color: "#00ffc8",
                                fontWeight: 600,
                                textShadow: "0 0 10px rgba(0,255,200,0.3)",
                            }}
                        >
                            Travstay
                        </b>{" "}
                        🌍 <br />
                        You’re all set to start your amazing journey!
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{ marginTop: "35px" }}
                    >
                        <Link href="/">
                            <Button
                                type="primary"
                                size="large"
                                style={{
                                    background:
                                        "linear-gradient(90deg, #00ffc8 0%, #4f46e5 100%)",
                                    border: "none",
                                    borderRadius: "14px",
                                    padding: "0 50px",
                                    fontWeight: 600,
                                    color: "#fff",
                                    boxShadow:
                                        "0 0 30px rgba(0,255,200,0.4), 0 0 40px rgba(79,70,229,0.3)",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) =>
                                (e.currentTarget.style.transform =
                                    "scale(1.08)")
                                }
                                onMouseLeave={(e) =>
                                (e.currentTarget.style.transform =
                                    "scale(1)")
                                }
                            >
                                Log in now
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
