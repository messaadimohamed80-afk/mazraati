"use client";

import Link from "next/link";

interface QuickActionProps {
    icon: string;
    label: string;
    color: string;
    href?: string;
    onClick?: () => void;
}

export default function QuickAction({ icon, label, color, href, onClick }: QuickActionProps) {
    const content = (
        <>
            <span
                className="quick-action-icon-wrapper"
                style={{ background: `${color}18`, borderColor: `${color}33` }}
            >
                <span className="quick-action-icon">{icon}</span>
            </span>
            <span className="quick-action-label">{label}</span>
        </>
    );

    if (href) {
        return (
            <Link href={href} prefetch={false} className="quick-action-card" style={{ textDecoration: "none" }}>
                {content}
            </Link>
        );
    }

    return (
        <button className="quick-action-card" onClick={onClick}>
            {content}
        </button>
    );
}
