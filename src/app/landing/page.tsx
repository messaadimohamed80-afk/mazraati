import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "مزرعتي — أول منصة عربية لإدارة المزارع الذكية",
    description:
        "أدر مزرعتك بذكاء — تتبع المصاريف، المحاصيل، المواشي، الآبار، والطاقة. مجانية 100%. عربية 100%.",
};

const features = [
    { icon: "💰", title: "المصاريف والميزانية", desc: "تتبع دقيق للمصاريف مع مقارنة الميزانية المخططة والفعلية وتقارير PDF" },
    { icon: "🌿", title: "المحاصيل", desc: "إدارة مراحل النمو، الجدول الزمني، وتفاصيل كل محصول" },
    { icon: "🐄", title: "المواشي", desc: "تسجيل وتصنيف المواشي — أبقار، أغنام، دواجن، وأكثر" },
    { icon: "💧", title: "المياه والآبار", desc: "مراقبة الآبار، طبقات المياه، والاستهلاك اليومي" },
    { icon: "⚡", title: "الطاقة", desc: "إدارة الطاقة الشمسية، المولدات، واستهلاك الكهرباء" },
    { icon: "📦", title: "المخزون", desc: "تتبع البذور، الأسمدة، الأدوات، والأعلاف" },
    { icon: "✅", title: "المهام", desc: "إنشاء وتتبع المهام اليومية بأولويات ذكية" },
    { icon: "📊", title: "التقارير", desc: "تقارير مالية شاملة مع تصدير PDF" },
    { icon: "🗺️", title: "خرائط تفاعلية", desc: "رسم حدود المزرعة وحساب المساحة على الخريطة" },
];

const pricing = [
    {
        name: "مجاني",
        price: "0",
        period: "للأبد",
        features: ["مزرعة واحدة", "تتبع المصاريف الأساسي", "3 تقارير شهرياً", "حالة الطقس"],
        cta: "ابدأ مجاناً",
        highlight: false,
    },
    {
        name: "مزارع Pro",
        price: "7",
        period: "/ شهر",
        features: ["مزارع غير محدودة", "كل الوحدات", "تصدير PDF غير محدود", "إشعارات ذكية", "دعم أولوية"],
        cta: "جرّب مجاناً لمدة 14 يوم",
        highlight: true,
    },
    {
        name: "مؤسسة",
        price: "25",
        period: "/ شهر",
        features: ["فريق عمل متعدد", "API كامل", "تكامل IoT", "دعم مخصص", "تقارير متقدمة"],
        cta: "تواصل معنا",
        highlight: false,
    },
];

const stats = [
    { value: "9", label: "وحدات متكاملة" },
    { value: "100%", label: "عربي أصلي" },
    { value: "0", label: "تكلفة البدء" },
    { value: "24/7", label: "متاح دائماً" },
];

export default function LandingPage() {
    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="landing-nav-inner">
                    <div className="landing-logo">
                        <span className="landing-logo-icon">🌾</span>
                        <span className="landing-logo-text">مزرعتي</span>
                    </div>
                    <div className="landing-nav-links">
                        <a href="#features">المميزات</a>
                        <a href="#pricing">الأسعار</a>
                        <Link href="/auth/login" className="landing-nav-cta">دخول</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="landing-hero">
                <div className="landing-hero-content">
                    <div className="landing-hero-badge">🚀 أول منصة عربية لإدارة المزارع</div>
                    <h1 className="landing-hero-title">
                        أدِر مزرعتك
                        <br />
                        <span className="landing-hero-gradient">بذكاء وسهولة</span>
                    </h1>
                    <p className="landing-hero-desc">
                        منصة شاملة لإدارة المصاريف، المحاصيل، المواشي، الآبار، والطاقة
                        <br />
                        مصممة خصيصاً للمزارع العربي — مجانية 100%
                    </p>
                    <div className="landing-hero-actions">
                        <Link href="/auth/register" className="landing-btn-primary">
                            ابدأ مجاناً الآن ←
                        </Link>
                        <a href="#features" className="landing-btn-secondary">اكتشف المميزات</a>
                    </div>
                    <div className="landing-hero-stats">
                        {stats.map((s) => (
                            <div key={s.label} className="landing-stat">
                                <div className="landing-stat-value">{s.value}</div>
                                <div className="landing-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="landing-features">
                <div className="landing-section-inner">
                    <h2 className="landing-section-title">كل ما تحتاجه في مكان واحد</h2>
                    <p className="landing-section-desc">9 وحدات متكاملة تغطي جميع جوانب إدارة المزرعة</p>
                    <div className="landing-features-grid">
                        {features.map((f) => (
                            <div key={f.title} className="landing-feature-card">
                                <div className="landing-feature-icon">{f.icon}</div>
                                <h3 className="landing-feature-title">{f.title}</h3>
                                <p className="landing-feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Section */}
            <section className="landing-why">
                <div className="landing-section-inner">
                    <h2 className="landing-section-title">لماذا مزرعتي؟</h2>
                    <div className="landing-why-grid">
                        <div className="landing-why-card">
                            <div className="landing-why-icon">🌍</div>
                            <h3>عربي أصلي</h3>
                            <p>ليست ترجمة — مصممة من الصفر بالعربية مع واجهة RTL احترافية</p>
                        </div>
                        <div className="landing-why-card">
                            <div className="landing-why-icon">📱</div>
                            <h3>تعمل على أي جهاز</h3>
                            <p>هاتف، تابلت، أو كمبيوتر — التطبيق يتكيف مع شاشتك</p>
                        </div>
                        <div className="landing-why-card">
                            <div className="landing-why-icon">🔒</div>
                            <h3>آمنة ومحمية</h3>
                            <p>بياناتك محمية بتشفير على مستوى الصف مع Supabase</p>
                        </div>
                        <div className="landing-why-card">
                            <div className="landing-why-icon">💸</div>
                            <h3>مجانية تماماً</h3>
                            <p>ابدأ بدون أي تكلفة — ادفع فقط عندما تحتاج ميزات متقدمة</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="landing-pricing">
                <div className="landing-section-inner">
                    <h2 className="landing-section-title">خطط بسيطة وشفافة</h2>
                    <p className="landing-section-desc">ابدأ مجاناً وترقّ عندما تكون جاهزاً</p>
                    <div className="landing-pricing-grid">
                        {pricing.map((p) => (
                            <div key={p.name} className={`landing-pricing-card ${p.highlight ? "landing-pricing-highlight" : ""}`}>
                                {p.highlight && <div className="landing-pricing-badge">الأكثر شعبية</div>}
                                <h3 className="landing-pricing-name">{p.name}</h3>
                                <div className="landing-pricing-price">
                                    <span className="landing-pricing-amount">${p.price}</span>
                                    <span className="landing-pricing-period">{p.period}</span>
                                </div>
                                <ul className="landing-pricing-features">
                                    {p.features.map((f) => (
                                        <li key={f}>✓ {f}</li>
                                    ))}
                                </ul>
                                <Link
                                    href="/auth/register"
                                    className={p.highlight ? "landing-btn-primary" : "landing-btn-secondary"}
                                >
                                    {p.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="landing-cta">
                <div className="landing-section-inner">
                    <h2 className="landing-cta-title">جاهز تبدأ؟</h2>
                    <p className="landing-cta-desc">انضم لمزرعتي اليوم وابدأ بإدارة مزرعتك بذكاء — مجاناً</p>
                    <Link href="/auth/register" className="landing-btn-primary landing-btn-large">
                        سجّل حسابك المجاني ←
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="landing-footer-brand">
                        <span className="landing-logo-icon">🌾</span>
                        <span className="landing-logo-text">مزرعتي</span>
                        <p className="landing-footer-tagline">أول منصة عربية لإدارة المزارع الذكية</p>
                    </div>
                    <div className="landing-footer-links">
                        <a href="#features">المميزات</a>
                        <a href="#pricing">الأسعار</a>
                        <Link href="/auth/login">تسجيل الدخول</Link>
                        <Link href="/auth/register">إنشاء حساب</Link>
                    </div>
                    <div className="landing-footer-copy">
                        © {new Date().getFullYear()} مزرعتي. جميع الحقوق محفوظة.
                    </div>
                </div>
            </footer>
        </div>
    );
}
