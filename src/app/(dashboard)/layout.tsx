"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InstallPrompt from "@/components/InstallPrompt";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content" role="main" aria-label="المحتوى الرئيسي">
                <Header />
                {children}
                <Footer />
            </main>
            <InstallPrompt />
        </div>
    );
}

