import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <footer className="border-t border-border bg-card py-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-4 text-center sm:px-6">
              <p className="text-sm font-semibold text-foreground">
                AI<span className="text-blue-600 dark:text-blue-400">Center</span>
              </p>
              <p className="text-sm text-muted-foreground">
                面向创作者与团队的 AI 工具导航平台
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
