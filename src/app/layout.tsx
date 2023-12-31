import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import AuthContext from "@/provider/AuthContext";
import TanstackProvider  from "@/provider/TanstackProvider";

const inter = Inter({ subsets: ["latin"] });

const noto = Noto_Sans_Thai({
  subsets: ["thai"],
  display: "swap",
  variable: "--font-noto",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${noto.className} ${noto.variable}`}>
        <StyledComponentsRegistry>
          <AuthContext>
          <TanstackProvider>
            {children}
            </  TanstackProvider>
            </AuthContext>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
