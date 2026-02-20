/**
 * Seed Demo Users Script
 * Creates demo users in Supabase with known credentials
 * Run with: node supabase/seed-users.mjs
 */

const SUPABASE_URL = 'https://mpzdlasoqwncggoajelm.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wemRsYXNvcXduY2dnb2FqZWxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk4MjMyNywiZXhwIjoyMDg2NTU4MzI3fQ.CPDw46y0B4egJWx5FFk6cJWhnio9YvcBPuNMozGubr0';

const DEMO_USERS = [
    {
        email: 'admin@mazraati.com',
        password: 'Mazraati@2026',
        fullName: 'مدير النظام',
        farmName: 'المزرعة الرئيسية',
        currency: 'TND',
        role: 'admin',
    },
    {
        email: 'farmer@mazraati.com',
        password: 'Farmer@2026',
        fullName: 'أحمد المزارع',
        farmName: 'مزرعة الواحة',
        currency: 'TND',
        role: 'owner',
    },
    {
        email: 'demo@mazraati.com',
        password: 'Demo@2026',
        fullName: 'محمد التجريبي',
        farmName: 'مزرعة النخيل',
        currency: 'SAR',
        role: 'owner',
    },
];

async function supabaseAdmin(path, method = 'GET', body = null) {
    const opts = {
        method,
        headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
        },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${SUPABASE_URL}${path}`, opts);
    const data = await res.json();
    if (!res.ok && res.status !== 409) {
        throw new Error(`${res.status}: ${JSON.stringify(data)}`);
    }
    return data;
}

async function createUser(user) {
    console.log(`\n📧 Creating user: ${user.email}`);

    // 1. Create auth user via Supabase Admin API
    let userId;
    try {
        const authData = await supabaseAdmin('/auth/v1/admin/users', 'POST', {
            email: user.email,
            password: user.password,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
                full_name: user.fullName,
                farm_name: user.farmName,
                currency: user.currency,
            },
        });
        userId = authData.id;
        console.log(`   ✅ Auth user created: ${userId}`);
    } catch (err) {
        // User might already exist
        console.log(`   ⚠️  Auth user may already exist: ${err.message}`);
        // Try to find existing user
        try {
            const users = await supabaseAdmin('/auth/v1/admin/users?page=1&per_page=50');
            const existing = users.users?.find(u => u.email === user.email);
            if (existing) {
                userId = existing.id;
                console.log(`   ℹ️  Found existing user: ${userId}`);
            } else {
                console.error(`   ❌ Cannot find or create user: ${user.email}`);
                return null;
            }
        } catch {
            console.error(`   ❌ Failed to search users`);
            return null;
        }
    }

    // 2. Upsert profile
    try {
        await supabaseAdmin('/rest/v1/profiles', 'POST', {
            id: userId,
            full_name: user.fullName,
            preferred_currency: user.currency,
        });
        console.log(`   ✅ Profile created`);
    } catch {
        console.log(`   ℹ️  Profile may already exist (trigger-created)`);
    }

    // 3. Create farm
    let farmId;
    try {
        const farms = await supabaseAdmin('/rest/v1/farms', 'POST', {
            owner_id: userId,
            name: user.farmName,
            currency: user.currency,
        });
        farmId = Array.isArray(farms) ? farms[0]?.id : farms.id;
        console.log(`   ✅ Farm created: ${farmId}`);
    } catch (err) {
        console.log(`   ⚠️  Farm creation: ${err.message}`);
        // Try to find existing farm
        try {
            const existingFarms = await supabaseAdmin(`/rest/v1/farms?owner_id=eq.${userId}&select=id`);
            if (existingFarms.length > 0) {
                farmId = existingFarms[0].id;
                console.log(`   ℹ️  Found existing farm: ${farmId}`);
            }
        } catch { /* ignore */ }
    }

    if (!farmId) {
        console.error(`   ❌ No farm for ${user.email}`);
        return null;
    }

    // 4. Create farm_member  
    try {
        await supabaseAdmin('/rest/v1/farm_members', 'POST', {
            farm_id: farmId,
            user_id: userId,
            role: user.role,
        });
        console.log(`   ✅ Farm member created (${user.role})`);
    } catch {
        console.log(`   ℹ️  Farm member may already exist`);
    }

    return { userId, farmId, ...user };
}

async function main() {
    console.log('🌾 مزرعتي — Seeding Demo Users');
    console.log('================================\n');

    const results = [];
    for (const user of DEMO_USERS) {
        const result = await createUser(user);
        if (result) results.push(result);
    }

    console.log('\n\n================================');
    console.log('📋 Demo User Credentials:');
    console.log('================================\n');

    for (const r of results) {
        console.log(`👤 ${r.fullName}`);
        console.log(`   📧 Email:    ${r.email}`);
        console.log(`   🔑 Password: ${r.password}`);
        console.log(`   🌾 Farm:     ${r.farmName}`);
        console.log(`   💰 Currency: ${r.currency}`);
        console.log('');
    }

    console.log('================================');
    console.log('🔗 Supabase Admin Dashboard:');
    console.log('   https://supabase.com/dashboard/project/mpzdlasoqwncggoajelm');
    console.log('================================');
}

main().catch(console.error);
