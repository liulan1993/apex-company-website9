import type { Metadata } from "next";
import "./globals.css"; // 确保全局样式被导入

// 定义网站的元数据，这对于SEO和浏览器标签页显示很重要
export const metadata: Metadata = {
  title: "Apex—DeepSeek AI",
  description: "Apex专属AI，满血版，支持深度、联网，切换模型等。",
};

// 这是根布局组件
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
