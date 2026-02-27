import { FeedRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function FeedTab({
    feed,
    lowFeed
}: {
    feed: FeedRecord[];
    lowFeed: FeedRecord[];
}) {
    return (
        <div className="livestock-section">
            {lowFeed.length > 0 && (
                <div className="livestock-alert glass-card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                    <span className="livestock-alert-icon">🔴</span>
                    <div>
                        <strong>مخزون منخفض</strong>
                        <p>{lowFeed.length} أنواع علف أقل من 30%</p>
                    </div>
                </div>
            )}

            <div className="livestock-feed-grid">
                {feed.map((feedItem) => {
                    const percent = Math.round((feedItem.remaining_kg / feedItem.quantity_kg) * 100);
                    const isLow = percent < 30;
                    const barColor = isLow ? "#ef4444" : percent < 60 ? "#f59e0b" : "#10b981";

                    return (
                        <div key={feedItem.id} className="livestock-feed-card glass-card">
                            <div className="livestock-feed-header">
                                <h4 className="livestock-feed-name">🌾 {feedItem.feed_type}</h4>
                                <span className="livestock-feed-cost">{formatCurrency(feedItem.quantity_kg * feedItem.cost_per_kg)}</span>
                            </div>

                            <div className="livestock-feed-bar-area">
                                <div className="livestock-feed-bar-header">
                                    <span>المخزون المتبقي</span>
                                    <span style={{ color: barColor, fontWeight: 700 }}>{feedItem.remaining_kg} كغ / {feedItem.quantity_kg} كغ</span>
                                </div>
                                <div className="livestock-feed-bar">
                                    <div className="livestock-feed-bar-fill" style={{ width: `${percent}%`, background: barColor }} />
                                </div>
                                <span className="livestock-feed-percent" style={{ color: barColor }}>{percent}%</span>
                            </div>

                            <div className="livestock-feed-meta">
                                <span>📅 شراء: {new Date(feedItem.purchase_date).toLocaleDateString("ar-TN")}</span>
                                <span>💰 {feedItem.cost_per_kg} د.ت/كغ</span>
                            </div>
                            {feedItem.notes && <p className="livestock-card-notes">{feedItem.notes}</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
