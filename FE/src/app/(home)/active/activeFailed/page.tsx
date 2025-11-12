import Link from "next/link";

export default function ActiveFailed() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            flexDirection: "column",
            fontFamily: "sans-serif"
        }}>
            <h1 style={{ color: "#e74c3c" }}>❌ Kích hoạt thất bại</h1>
            <p>Liên kết kích hoạt không hợp lệ hoặc đã hết hạn.</p>
            <Link href="/" style={{
                marginTop: "20px",
                backgroundColor: "#e74c3c",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold"
            }}>Gửi lại email kích hoạt</Link>
        </div>
    );
}
