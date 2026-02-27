import { VaccinationRecord, Animal } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function VaccinationsTab({
    vaccinations,
    animals,
    upcomingVaccinations
}: {
    vaccinations: VaccinationRecord[];
    animals: Animal[];
    upcomingVaccinations: VaccinationRecord[];
}) {
    return (
        <div className="livestock-section">
            {upcomingVaccinations.length > 0 && (
                <div className="livestock-alert glass-card" style={{ borderColor: "rgba(245,158,11,0.3)" }}>
                    <span className="livestock-alert-icon">⚠️</span>
                    <div>
                        <strong>تطعيمات قادمة</strong>
                        <p>{upcomingVaccinations.length} تطعيم مستحق خلال 30 يوم</p>
                    </div>
                </div>
            )}

            <div className="livestock-table-container glass-card">
                <h3 className="livestock-section-title">💉 سجل التطعيمات</h3>
                <table className="livestock-table">
                    <thead>
                        <tr>
                            <th>الحيوان</th>
                            <th>اللقاح</th>
                            <th>التاريخ</th>
                            <th>الموعد القادم</th>
                            <th>الطبيب</th>
                            <th>التكلفة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vaccinations.map((vax) => {
                            const animal = animals.find((a) => a.id === vax.animal_id);
                            const isDue = vax.next_due && new Date(vax.next_due) <= new Date();
                            return (
                                <tr key={vax.id} className={isDue ? "livestock-row-alert" : ""}>
                                    <td>{animal?.name || "—"} <span className="livestock-table-tag">{animal?.tag_number}</span></td>
                                    <td>{vax.vaccine_name}</td>
                                    <td>{new Date(vax.date).toLocaleDateString("ar-TN")}</td>
                                    <td>
                                        {vax.next_due ? (
                                            <span className={isDue ? "livestock-overdue" : ""}>
                                                {new Date(vax.next_due).toLocaleDateString("ar-TN")}
                                                {isDue && " ⚠️"}
                                            </span>
                                        ) : "—"}
                                    </td>
                                    <td>{vax.administered_by || "—"}</td>
                                    <td>{vax.cost ? formatCurrency(vax.cost) : "—"}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
