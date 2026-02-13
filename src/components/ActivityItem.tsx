interface ActivityItemProps {
    icon: string;
    title: string;
    desc: string;
    amount: string;
    time: string;
    color: string;
}

export default function ActivityItem({
    icon,
    title,
    desc,
    amount,
    time,
    color,
}: ActivityItemProps) {
    return (
        <div className="activity-item">
            <div className="activity-line-container">
                <span
                    className="activity-dot"
                    style={{ background: color, boxShadow: `0 0 12px ${color}66` }}
                />
                <div className="activity-line" />
            </div>
            <div className="activity-content">
                <div className="activity-header">
                    <span className="activity-item-icon">{icon}</span>
                    <strong>{title}</strong>
                    <span className="activity-time">{time}</span>
                </div>
                <p className="activity-desc">{desc}</p>
                <span className="activity-amount" style={{ color }}>
                    {amount}
                </span>
            </div>
        </div>
    );
}
