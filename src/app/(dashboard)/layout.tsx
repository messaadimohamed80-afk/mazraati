"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Header />
                {children}
                <Footer />
            </main>
        </div>
    );
}
