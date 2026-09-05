import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Center — AI 导航站",
    template: "%s — AI Center",
  },
  description: "发现、浏览与直达优质 AI 工具与资源",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#f7fbfa] text-slate-900">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="border-t border-teal-900/8 py-8 text-center text-sm text-slate-500">
          <p>AI Center · 发现值得用的 AI 工具</p>
        </footer>
      </body>
    </html>
  );
}
