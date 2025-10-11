// src/app/layout.tsx
import 'antd/dist/reset.css';
import '@/css/globals.css';
import '@/css/admin.css'; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
