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
      <body className="flex min-h-full flex-col bg-[#f5f7fb] text-foreground dark:bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <footer className="border-t border-border bg-card py-8">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-1 px-4 text-center lg:px-6">
              <p className="text-sm font-semibold text-foreground">
                AI<span className="text-blue-600 dark:text-blue-400">Center</span>
              </p>
              <p className="text-xs text-muted-foreground">
                发现全球顶尖的 AI 工具与实用神器
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
