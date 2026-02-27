import { Animal, VaccinationRecord } from "@/lib/types";
import { ANIMAL_TYPE_MAP, ANIMAL_STATUS_MAP, GENDER_MAP } from "@/lib/mock/mock-livestock-data";
import { formatCurrency } from "@/lib/utils";

type TabKey = "all" | "sheep" | "cattle" | "poultry" | "goat";

export function AnimalsTab({
    filteredAnimals,
    vaccinations,
    tabs,
    tab,
    setTab,
    search,
    setSearch
}: {
    filteredAnimals: Animal[];
    vaccinations: VaccinationRecord[];
    tabs: { key: TabKey; label: string; icon: string; count: number }[];
    tab: TabKey;
    setTab: (tab: TabKey) => void;
    search: string;
    setSearch: (search: string) => void;
}) {
    return (
        <>
            {/* Type filter + search */}
            <div className="crops-toolbar">
                <div className="crops-filters">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            className={`crops-filter-btn ${tab === t.key ? "crops-filter-active" : ""}`}
                            onClick={() => setTab(t.key)}
                        >
                            {t.icon} {t.label} <span className="crops-filter-count">{t.count}</span>
                        </button>
                    ))}
                </div>
                <div className="crops-search">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="ابحث عن حيوان..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="crops-search-input"
                    />
                </div>
            </div>

            {/* Animal cards */}
            <div className="livestock-grid">
                {filteredAnimals.map((animal) => {
                    const typeInfo = ANIMAL_TYPE_MAP[animal.type];
                    const statusInfo = ANIMAL_STATUS_MAP[animal.status];
                    const genderInfo = GENDER_MAP[animal.gender];
                    const animalVax = vaccinations.filter((v) => v.animal_id === animal.id);
                    const latestVax = animalVax.length > 0 ? animalVax[animalVax.length - 1] : null;

                    return (
                        <div key={animal.id} className="livestock-card glass-card">
                            <div className="livestock-card-accent" style={{ background: typeInfo.color }} />
                            <div className="livestock-card-header">
                                <div className="livestock-card-icon" style={{ background: `${typeInfo.color}15`, color: typeInfo.color }}>
                                    {typeInfo.icon}
                                </div>
                                <div className="livestock-card-title-area">
                                    <h3 className="livestock-card-name">{animal.tag_number}</h3>
                                    <span className="livestock-card-tag">{animal.name}</span>
                                </div>
                                <span
                                    className="livestock-status-badge"
                                    style={{ background: `${statusInfo.color}15`, color: statusInfo.color, borderColor: `${statusInfo.color}30` }}
                                >
                                    {statusInfo.icon} {statusInfo.label}
                                </span>
                            </div>

                            <div className="livestock-card-details">
                                <div className="livestock-detail">
                                    <span className="livestock-detail-label">النوع</span>
                                    <span className="livestock-detail-value">{typeInfo.label}</span>
                                </div>
                                <div className="livestock-detail">
                                    <span className="livestock-detail-label">السلالة</span>
                                    <span className="livestock-detail-value">{animal.breed}</span>
                                </div>
                                <div className="livestock-detail">
                                    <span className="livestock-detail-label">الجنس</span>
                                    <span className="livestock-detail-value">{genderInfo.icon} {genderInfo.label}</span>
                                </div>
                                {animal.weight_kg && (
                                    <div className="livestock-detail">
                                        <span className="livestock-detail-label">الوزن</span>
                                        <span className="livestock-detail-value">{animal.weight_kg} كغ</span>
                                    </div>
                                )}
                                {animal.birth_date && (
                                    <div className="livestock-detail">
                                        <span className="livestock-detail-label">تاريخ الولادة</span>
                                        <span className="livestock-detail-value">{new Date(animal.birth_date).toLocaleDateString("ar-TN")}</span>
                                    </div>
                                )}
                                {animal.purchase_price && (
                                    <div className="livestock-detail">
                                        <span className="livestock-detail-label">ثمن الشراء</span>
                                        <span className="livestock-detail-value">{formatCurrency(animal.purchase_price)}</span>
                                    </div>
                                )}
                            </div>

                            {latestVax && (
                                <div className="livestock-card-vax">
                                    💉 آخر تطعيم: {latestVax.vaccine_name}
                                    {latestVax.next_due && (
                                        <span className="livestock-vax-next"> — القادم: {new Date(latestVax.next_due).toLocaleDateString("ar-TN")}</span>
                                    )}
                                </div>
                            )}

                            {animal.notes && (
                                <p className="livestock-card-notes">{animal.notes}</p>
                            )}
                        </div>
                    );
                })}

                {filteredAnimals.length === 0 && (
                    <div className="crops-empty">
                        <span>🐑</span>
                        <p>لا توجد حيوانات مطابقة</p>
                    </div>
                )}
            </div>
        </>
    );
}
