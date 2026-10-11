import { publicConfig } from '@/lib/content';
import { AdminApp } from '@/components/admin/admin-app';
export const dynamic = 'force-dynamic';
export default function AdminPage() { return <AdminApp config={publicConfig()} />; }
