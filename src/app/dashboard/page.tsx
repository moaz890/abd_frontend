'use client';

import { useEffect, useState, useCallback } from 'react';
import { getLeads, updateLeadStatus, deleteLead } from '@/lib/api';
import { Lead, PaginatedLeads } from '@/lib/types';
import { getToken } from '@/lib/auth';
import {
  Search, Filter, Trash2, MessageCircle, ChevronLeft, ChevronRight,
  Loader2, X, Eye,
} from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  new: 'جديد', contacted: 'تم التواصل', closed: 'مغلق',
};
const STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6', contacted: '#f59e0b', closed: '#10b981',
};
const SECTOR_LABELS: Record<string, string> = {
  government: 'حكومي', private_company: 'شركة خاصة',
  private_establishment: 'مؤسسة خاصة', retired: 'متقاعد',
};
const DURATION_LABELS: Record<string, string> = {
  less_than_3_months: 'أقل من 3 أشهر', more_than_3_months: 'أكثر من 3 أشهر',
};

export default function LeadsDashboard() {
  const [data, setData] = useState<PaginatedLeads | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const token = getToken() ?? '';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLeads(token, { page, status: statusFilter || undefined, search: search || undefined });
      setData(res);
    } catch {/* ignore */} finally {
      setLoading(false);
    }
  }, [token, page, statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  async function handleStatusChange(id: string, status: string) {
    await updateLeadStatus(token, id, status as Lead['status']);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;
    setDeletingId(id);
    try { await deleteLead(token, id); load(); }
    finally { setDeletingId(null); }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  const stats = data?.stats;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginBottom: '2rem' }}>
        إدارة العملاء المحتملين
      </h1>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'الإجمالي', value: stats.total, color: '#1a5f9c' },
            { label: 'جديد', value: stats.new, color: '#3b82f6' },
            { label: 'تم التواصل', value: stats.contacted, color: '#f59e0b' },
            { label: 'مغلق', value: stats.closed, color: '#10b981' },
          ].map((s) => (
            <div key={s.label} style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.25rem', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
          <input
            type="search"
            placeholder="ابحث بالاسم أو الجوال..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ flex: 1, padding: '0.6rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', direction: 'rtl' }}
          />
          <button type="submit" style={{ padding: '0.6rem 1rem', background: '#1a5f9c', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
            <Search size={16} />
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ padding: '0.6rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', fontFamily: 'inherit', fontSize: '0.9rem', background: '#fff', cursor: 'pointer', direction: 'rtl' }}
        >
          <option value="">كل الحالات</option>
          <option value="new">جديد</option>
          <option value="contacted">تم التواصل</option>
          <option value="closed">مغلق</option>
        </select>

        {(search || statusFilter) && (
          <button onClick={() => { setSearch(''); setSearchInput(''); setStatusFilter(''); setPage(1); }} style={{ padding: '0.6rem 0.875rem', background: '#f1f5f9', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontFamily: 'inherit' }}>
            <X size={14} /> مسح الفلتر
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '0.875rem', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 size={32} style={{ color: '#1a5f9c', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : data?.leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>لا يوجد عملاء بعد</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['الاسم', 'الجوال', 'العمر / الجنسية', 'التاريخ', 'الحالة', 'إجراءات'].map((h) => (
                    <th key={h} style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#374151', textAlign: 'right', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.leads.map((lead) => (
                  <tr key={lead._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1e293b' }}>{lead.fullName}</td>
                    <td style={{ padding: '0.875rem 1rem', direction: 'ltr', textAlign: 'right', color: '#374151' }}>+966 {lead.phone}</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#64748b' }}>
                      {lead.isQualified ? '✅ مؤهل' : '❌ غير مؤهل'} · {lead.state === 'citizen' ? 'مواطن' : 'مقيم'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(lead.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        style={{
                          padding: '0.35rem 0.625rem', borderRadius: '9999px',
                          border: `1.5px solid ${STATUS_COLORS[lead.status]}`,
                          color: STATUS_COLORS[lead.status], fontWeight: 700,
                          fontSize: '0.8rem', background: '#fff', cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          title="عرض التفاصيل"
                          onClick={() => setSelectedLead(lead)}
                          style={{ padding: '0.4rem', background: '#f1f5f9', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', color: '#1a5f9c' }}
                        >
                          <Eye size={15} />
                        </button>
                        <a
                          href={`https://wa.me/966${lead.phone}?text=${encodeURIComponent(`مرحباً ${lead.fullName}، نتواصل معك من ABD`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="واتساب"
                          style={{ padding: '0.4rem', background: '#dcfce7', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', color: '#16a34a', display: 'flex', alignItems: 'center' }}
                        >
                          <MessageCircle size={15} />
                        </a>
                        <button
                          title="حذف"
                          onClick={() => handleDelete(lead._id)}
                          disabled={deletingId === lead._id}
                          style={{ padding: '0.4rem', background: '#fee2e2', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', color: '#dc2626' }}
                        >
                          {deletingId === lead._id ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#cbd5e1' : '#1a5f9c' }}>
              <ChevronRight size={16} />
            </button>
            <span style={{ color: '#374151', fontSize: '0.875rem', fontWeight: 600 }}>{page} / {data.pages}</span>
            <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages}
              style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: '#fff', cursor: page === data.pages ? 'not-allowed' : 'pointer', color: page === data.pages ? '#cbd5e1' : '#1a5f9c' }}>
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Lead detail modal */}
      {selectedLead && (
        <div
          onClick={(e) => e.target === e.currentTarget && setSelectedLead(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
        >
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', maxWidth: '480px', width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e293b' }}>{selectedLead.fullName}</h2>
              <button onClick={() => setSelectedLead(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {([
              ['الجوال', `+966 ${selectedLead.phone}`],
              ['أهلية العمر', selectedLead.isQualified ? 'مؤهل ✅' : 'غير مؤهل ❌'],
              ['الجنسية', selectedLead.state === 'citizen' ? 'مواطن' : 'مقيم'],
              ['الراتب الشهري', `${selectedLead.monthlySalary?.toLocaleString('ar-SA')} ريال`],
              ['الالتزامات الشهرية', `${(selectedLead.monthlyObligations ?? 0).toLocaleString('ar-SA')} ريال`],
              ['قرض عقاري', selectedLead.hasRealEstateLoan ? 'نعم' : 'لا'],
              ['جهة العمل', SECTOR_LABELS[selectedLead.workSector ?? ''] ?? selectedLead.workSector],
              ['مدة الخدمة', DURATION_LABELS[selectedLead.serviceDuration ?? ''] ?? selectedLead.serviceDuration],
              ['الحالة', STATUS_LABELS[selectedLead.status]],
              ['تاريخ التقديم', new Date(selectedLead.createdAt).toLocaleString('ar-SA')],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>{label}</span>
                <span style={{ color: '#1e293b', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
