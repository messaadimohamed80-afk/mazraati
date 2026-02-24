interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon = "📭",
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    const content = (
        <div className="empty-state">
            <div className="empty-state-icon">{icon}</div>
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-desc">{description}</p>}
            {actionLabel && (
                actionHref ? (
                    <a href={actionHref} className="empty-state-btn">
                        {actionLabel}
                    </a>
                ) : onAction ? (
                    <button onClick={onAction} className="empty-state-btn">
                        {actionLabel}
                    </button>
                ) : null
            )}
        </div>
    );
    return content;
}
