import KpiCard from "@/components/KpiCard";
import QuickAction from "@/components/QuickAction";
import ModuleCard from "@/components/ModuleCard";
import ActivityItem from "@/components/ActivityItem";
import OnboardingModal from "@/components/OnboardingModal";
import { formatCurrency } from "@/lib/utils";
import { getExpenses, getCategories } from "@/lib/actions/expenses";
import { getWells } from "@/lib/actions/water";
import { getCrops, getTasks } from "@/lib/actions/crops";
import { getAnimals } from "@/lib/actions/livestock";
import { getInventory } from "@/lib/actions/inventory";

export default async function DashboardPage() {
  /* ===== Fetch data from server actions ===== */
  const [expensesR, categoriesR, wellsR, cropsR, tasksR, animalsR, inventoryR] = await Promise.all([
    getExpenses(),
    getCategories(),
    getWells(),
    getCrops(),
    getTasks(),
    getAnimals(),
    getInventory(),
  ]);

  const expenses = expensesR.ok ? expensesR.data : [];
  const categories = categoriesR.ok ? categoriesR.data : [];
  const wells = wellsR.ok ? wellsR.data : [];
  const crops = cropsR.ok ? cropsR.data : [];
  const tasks = tasksR.ok ? tasksR.data : [];
  const animals = animalsR.ok ? animalsR.data : [];
  const inventory = inventoryR.ok ? inventoryR.data : [];

  /* ===== Real stats ===== */
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalBudget = categories.reduce((s, c) => s + (c.budget_planned || 0), 0);
  const remaining = totalBudget - totalExpenses;
  const budgetPercent = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;
  const activeCrops = crops.filter(c => c.status === "growing" || c.status === "planted").length;
  const activeWells = wells.filter(w => w.status === "active").length;
  const pendingTasks = tasks.filter(t => t.status !== "done").length;
  const doneTasks = tasks.filter(t => t.status === "done").length;
  const totalAnimals = animals.filter(a => a.status !== "sold").length;
  const healthyAnimals = animals.filter(a => a.status === "healthy").length;
  const totalInventory = inventory.length;
  const goodInventory = inventory.filter(i => i.condition === 'good' || i.condition === 'new').length;

  // Computed progress values (safe from NaN)
  const livestockHealth = totalAnimals > 0 ? Math.round((healthyAnimals / totalAnimals) * 100) : 0;
  const inventoryCondition = totalInventory > 0 ? Math.round((goodInventory / totalInventory) * 100) : 0;
  const cropsProgress = crops.length > 0 ? Math.round((activeCrops / crops.length) * 100) : 0;
  const tasksProgress = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const wellsProgress = wells.length > 0 ? Math.round((activeWells / wells.length) * 100) : 0;
  const expensesProgress = budgetPercent;

  return (
    <>

      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-text">
            <h2 className="welcome-title">
              مرحباً بك في <span className="text-gradient">مزرعتي</span>
            </h2>
            <p className="welcome-desc">
              لوحة تحكم ذكية لإدارة مزرعتك بكفاءة — تتبع المصاريف، المحاصيل،
              الآبار، والمواشي في مكان واحد
            </p>
          </div>
          <div className="welcome-stats">
            <div className="welcome-stat">
              <span className="welcome-stat-value">5</span>
              <span className="welcome-stat-label">وحدات نشطة</span>
            </div>
            <div className="welcome-stat-divider" />
            <div className="welcome-stat">
              <span className="welcome-stat-value">{expenses.length}</span>
              <span className="welcome-stat-label">معاملات مسجلة</span>
            </div>
            <div className="welcome-stat-divider" />
            <div className="welcome-stat">
              <span className="welcome-stat-value">{budgetPercent}%</span>
              <span className="welcome-stat-label">استهلاك الميزانية</span>
            </div>
          </div>
        </div>
        <div className="welcome-decoration">
          <div className="welcome-circle welcome-circle-1" />
          <div className="welcome-circle welcome-circle-2" />
          <div className="welcome-circle welcome-circle-3" />
        </div>
      </section>

      {/* KPI Grid */}
      <section className="dashboard-section">
        <div className="kpi-grid stagger-children">
          <KpiCard
            icon="💰"
            title="إجمالي الميزانية"
            value={`${formatCurrency(totalBudget)}`}
            subtitle={`${categories.length} تصنيفات`}
            trend={{ value: "الكل مسجل", direction: "neutral" }}
            color="#10b981"
          />
          <KpiCard
            icon="✅"
            title="المصروف الفعلي"
            value={`${formatCurrency(totalExpenses)}`}
            subtitle={`${expenses.length} معاملات مسجلة`}
            trend={{ value: `${budgetPercent}% من الميزانية`, direction: budgetPercent > 70 ? "down" : "up" }}
            color="#3b82f6"
          />
          <KpiCard
            icon="📊"
            title="المتبقي"
            value={`${formatCurrency(remaining)}`}
            subtitle={`${100 - budgetPercent}% من الميزانية`}
            trend={{ value: remaining > 0 ? "ميزانية كافية" : "تجاوز الميزانية", direction: remaining > 0 ? "up" : "down" }}
            color="#f59e0b"
          />
          <KpiCard
            icon="🔵"
            title="الآبار النشطة"
            value={`${activeWells}`}
            subtitle={`من أصل ${wells.length} آبار`}
            trend={{ value: `${pendingTasks} مهمة قيد التنفيذ`, direction: "neutral" }}
            color="#06b6d4"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section">
        <h2 className="section-title">
          <span className="section-title-dot" style={{ background: "#10b981" }} />
          <span>إجراءات سريعة</span>
        </h2>
        <div className="quick-actions-grid">
          <QuickAction icon="➕" label="إضافة مصروف" color="#10b981" href="/expenses" />
          <QuickAction icon="🌾" label="تسجيل محصول" color="#f59e0b" href="/crops" />
          <QuickAction icon="🐑" label="إضافة حيوان" color="#8b5cf6" href="/livestock" />
          <QuickAction icon="📋" label="مهمة جديدة" color="#ef4444" href="/tasks" />
          <QuickAction icon="💧" label="قراءة البئر" color="#06b6d4" href="/water" />
          <QuickAction icon="📄" label="تصدير تقرير" color="#64748b" href="/reports" />
        </div>
      </section>

      {/* Modules Overview */}
      <section className="dashboard-section">
        <h2 className="section-title">
          <span className="section-title-dot" style={{ background: "#3b82f6" }} />
          <span>الوحدات</span>
        </h2>
        <div className="modules-grid stagger-children">
          <ModuleCard
            icon="💰"
            title="المحاسبة"
            desc="المصاريف، الميزانية، العملات"
            count={`${expenses.length} معاملات`}
            color="#10b981"
            href="/expenses"
            progress={expensesProgress}
          />
          <ModuleCard
            icon="💧"
            title="إدارة الآبار"
            desc="الآبار، الخزانات، شبكة الري"
            count={`${activeWells} بئر نشط`}
            color="#06b6d4"
            href="/water"
            progress={wellsProgress}
          />
          <ModuleCard
            icon="🌾"
            title="المحاصيل"
            desc="التخطيط، الحصاد، العوائد"
            count={`${activeCrops} محاصيل نشطة`}
            color="#f59e0b"
            href="/crops"
            progress={cropsProgress}
          />
          <ModuleCard
            icon="🐑"
            title="المواشي"
            desc="القطيع، الصحة، التغذية"
            count={`${totalAnimals} رؤوس`}
            color="#8b5cf6"
            href="/livestock"
            progress={livestockHealth}
          />
          <ModuleCard
            icon="✅"
            title="المهام"
            desc="التخطيط، التذكيرات، الفريق"
            count={`${pendingTasks} مهام نشطة`}
            color="#ef4444"
            href="/tasks"
            progress={tasksProgress}
          />
          <ModuleCard
            icon="📦"
            title="المخزون"
            desc="المعدات، المواد، القطع"
            count={`${totalInventory} عنصر`}
            color="#ec4899"
            href="/inventory"
            progress={inventoryCondition}
          />
        </div>
      </section>

      {/* Two Column: Activity + Well */}
      <section className="dashboard-section">
        <div className="two-col-grid">
          {/* Activity Timeline */}
          <div>
            <h2 className="section-title">
              <span className="section-title-dot" style={{ background: "#f59e0b" }} />
              <span>آخر النشاطات</span>
            </h2>
            <div className="activity-card glass-card">
              <div className="activity-timeline">
                <ActivityItem
                  title="حفر الآبار"
                  desc="تحويل بنكي"
                  amount={formatCurrency(34200)}
                  time="23 جانفي 2025"
                  color="#ef4444"
                  icon="⛏️"
                />
                <ActivityItem
                  title="حفر الآبار"
                  desc="تحويل بنكي دولي"
                  amount={formatCurrency(8600)}
                  time="26 ديسمبر 2024"
                  color="#f59e0b"
                  icon="⛏️"
                />
                <ActivityItem
                  title="محصول الحمص"
                  desc="شراء البذور والأسمدة"
                  amount={formatCurrency(5100)}
                  time="1 ديسمبر 2024"
                  color="#10b981"
                  icon="🌾"
                />
                <ActivityItem
                  title="السكانار"
                  desc="فحص التربة والموقع"
                  amount={formatCurrency(2500)}
                  time="11 أكتوبر 2023"
                  color="#3b82f6"
                  icon="🔍"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding */}
      <OnboardingModal />
    </>
  );
}
