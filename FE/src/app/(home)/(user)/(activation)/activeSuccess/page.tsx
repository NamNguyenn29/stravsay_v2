import Link from "next/link";


export default function ActiveSuccess() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            flexDirection: "column",
            fontFamily: "sans-serif"
        }}>
            <h1 style={{ color: "#4CAF50" }}>🎉 Tài khoản của bạn đã được kích hoạt!</h1>
            <p>Bây giờ bạn có thể đăng nhập và bắt đầu sử dụng Travstay.</p>
            <Link href="/" style={{
                marginTop: "20px",
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold"
            }}>Đăng nhập ngay</Link>
        </div>
    );
}
