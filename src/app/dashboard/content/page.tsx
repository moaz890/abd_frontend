'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import { getContent, updateContent, uploadContentImage } from '@/lib/api';
import { SiteContent, TestimonialItem, FaqItem } from '@/lib/types';
import { DEFAULT_SITE_CONTENT } from '@/lib/contentDefaults';
import {
  Loader2,
  Save,
  CheckCircle,
  Upload,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
} from 'lucide-react';

type TabId =
  | 'hero'
  | 'form'
  | 'features'
  | 'testimonials'
  | 'faqs'
  | 'footer'
  | 'logo'
  | 'seo'
  | 'success';

const TABS: { id: TabId; label: string }[] = [
  { id: 'hero', label: 'الهيرو (البطل)' },
  { id: 'form', label: 'النموذج والحقول' },
  { id: 'features', label: 'المميزات والمتجر' },
  { id: 'testimonials', label: 'آراء العملاء' },
  { id: 'faqs', label: 'الأسئلة الشائعة' },
  { id: 'footer', label: 'الفوتر والتواصل' },
  { id: 'logo', label: 'الشعار' },
  { id: 'seo', label: 'SEO' },
  { id: 'success', label: 'صفحة النجاح' },
];

const inputClass =
  'w-full px-4 py-2.5 rounded-lg text-right bg-white border border-gray-300 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200';

const labelClass = 'block text-xs font-bold text-gray-600 mb-1';

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="w-full">
      <label className={labelClass}>{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} resize-y min-h-[80px]`}
        />
      ) : (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  onChange,
  uploadType,
  token,
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  uploadType: string;
  token: string;
  optional?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadContentImage(token, file, uploadType);
      onChange(url);
    } catch {
      setUploadError('فشل رفع الصورة');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="space-y-2">
      <label className={labelClass}>{label}</label>
      {value && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 max-w-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="معاينة"
            className="max-h-24 w-auto rounded object-contain"
          />
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="رابط الصورة أو ارفع ملفاً"
          className={`${inputClass} ltr text-left`}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{uploading ? 'رفع...' : 'رفع'}</span>
        </button>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={ref}
        onChange={handleFile}
        className="hidden"
        disabled={uploading}
      />
      {optional && value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-red-500 hover:text-red-700 text-xs font-bold"
        >
          إزالة الصورة
        </button>
      )}
      {uploadError && <p className="text-red-500 text-xs font-semibold">{uploadError}</p>}
    </div>
  );
}

export default function ContentPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>('hero');
  const [cms, setCms] = useState<SiteContent>(DEFAULT_SITE_CONTENT as unknown as SiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.replace('/dashboard/login');
      return;
    }
    setToken(t);
    getContent()
      .then((data) => {
        setCms(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  async function saveSection(section: keyof SiteContent, data: unknown) {
    setSaving(section);
    setToast('');
    try {
      const response = await updateContent(token, section, data as object);
      setCms(response.content);
      // Trigger revalidation
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET ?? '' }),
      }).catch(() => {});
      setToast(`تم حفظ التغييرات بنجاح ✅`);
    } catch {
      setToast('حدث خطأ أثناء حفظ البيانات ❌');
    } finally {
      setSaving(null);
      setTimeout(() => setToast(''), 4000);
    }
  }

  function SaveButton({ section, onClick }: { section: keyof SiteContent; onClick: () => void }) {
    const isSaving = saving === section;
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={!!saving}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold transition-all duration-300 mt-4 shadow-sm"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جارٍ الحفظ...</span>
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            <span>حفظ التغييرات</span>
          </>
        )}
      </button>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="text-right" dir="rtl">
      <div className="flex items-center gap-3 mb-6 justify-start border-b border-gray-200 pb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-800">إدارة محتوى الموقع</h1>
          <p className="text-gray-500 text-sm mt-0.5">تعديل ونشر محتوى وعناصر الصفحة الرئيسية</p>
        </div>
      </div>

      {toast && (
        <div
          className={`flex items-center gap-2 border text-sm rounded-lg px-4 py-3 mb-6 justify-start ${
            toast.includes('❌')
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}
        >
          {toast.includes('❌') ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span className="font-bold">{toast}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Tabs */}
        <nav className="lg:w-60 flex lg:flex-col flex-wrap gap-1.5 shrink-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 rounded-lg text-sm font-bold text-right transition-all duration-200 ${
                tab === t.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Tab Content Panel */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
          {/* HERO TAB */}
          {tab === 'hero' && (
            <div className="space-y-4">
              <h3 className="text-gray-800 font-extrabold text-base border-b border-gray-100 pb-2">شاشة الترحيب (Hero)</h3>
              <Field
                label="نص الشارة العلوية (Badge)"
                value={cms.hero?.badge}
                onChange={(v) => setCms((c) => ({ ...c, hero: { ...c.hero, badge: v } }))}
              />
              <Field
                label="العنوان الأساسي - السطر الأول"
                value={cms.hero?.titleLine1}
                onChange={(v) => setCms((c) => ({ ...c, hero: { ...c.hero, titleLine1: v } }))}
              />
              <Field
                label="العنوان الأساسي - السطر الثاني"
                value={cms.hero?.titleLine2}
                onChange={(v) => setCms((c) => ({ ...c, hero: { ...c.hero, titleLine2: v } }))}
              />
              <Field
                label="الوصف الفرعي"
                value={cms.hero?.subtitle}
                onChange={(v) => setCms((c) => ({ ...c, hero: { ...c.hero, subtitle: v } }))}
                multiline
              />
              <Field
                label="نص زر التحقق (CTA)"
                value={cms.hero?.ctaText}
                onChange={(v) => setCms((c) => ({ ...c, hero: { ...c.hero, ctaText: v } }))}
              />
              <ImageUploadField
                label="الصورة التعبيرية الجانبية"
                value={cms.hero?.imageUrl}
                uploadType="hero"
                token={token}
                onChange={(v) => setCms((c) => ({ ...c, hero: { ...c.hero, imageUrl: v } }))}
              />

              <hr className="border-gray-100 my-4" />
              <h4 className="text-gray-700 font-bold text-sm">شارات الأمان والضمان (بحد أقصى 3)</h4>
              {cms.hero?.trustBadges?.map((badge, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-55 rounded-lg border border-gray-100">
                  <Field
                    label={`أيقونة شارة ${i + 1} (رمز تعبيري)`}
                    value={badge.icon}
                    onChange={(v) => {
                      const trustBadges = [...(cms.hero.trustBadges ?? [])];
                      trustBadges[i] = { ...trustBadges[i], icon: v };
                      setCms((c) => ({ ...c, hero: { ...c.hero, trustBadges } }));
                    }}
                  />
                  <Field
                    label={`نص شارة ${i + 1}`}
                    value={badge.label}
                    onChange={(v) => {
                      const trustBadges = [...(cms.hero.trustBadges ?? [])];
                      trustBadges[i] = { ...trustBadges[i], label: v };
                      setCms((c) => ({ ...c, hero: { ...c.hero, trustBadges } }));
                    }}
                  />
                </div>
              ))}

              <SaveButton section="hero" onClick={() => saveSection('hero', cms.hero)} />
            </div>
          )}

          {/* FORM TAB */}
          {tab === 'form' && (
            <div className="space-y-4">
              <h3 className="text-gray-800 font-extrabold text-base border-b border-gray-100 pb-2">قسم نموذج التقديم</h3>
              <Field
                label="شارة قسم التقديم"
                value={cms.leadFormSection?.badge}
                onChange={(v) => setCms((c) => ({ ...c, leadFormSection: { ...c.leadFormSection, badge: v } }))}
              />
              <Field
                label="عنوان القسم الرئيسي"
                value={cms.leadFormSection?.title}
                onChange={(v) => setCms((c) => ({ ...c, leadFormSection: { ...c.leadFormSection, title: v } }))}
              />
              <Field
                label="النص الوصفي الفرعي"
                value={cms.leadFormSection?.subtitle}
                onChange={(v) => setCms((c) => ({ ...c, leadFormSection: { ...c.leadFormSection, subtitle: v } }))}
                multiline
              />
              <Field
                label="نص الاتفاقية والموافقة (Consent)"
                value={cms.leadFormSection?.consentText}
                onChange={(v) => setCms((c) => ({ ...c, leadFormSection: { ...c.leadFormSection, consentText: v } }))}
                multiline
              />
              <SaveButton section="leadFormSection" onClick={() => saveSection('leadFormSection', cms.leadFormSection)} />

              <hr className="border-gray-200 my-6" />
              <h3 className="text-gray-800 font-extrabold text-base border-b border-gray-100 pb-2">تسميات الحقول والخيارات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(cms.formLabels ?? {}) as (keyof typeof cms.formLabels)[]).map((key) => (
                  <Field
                    key={key}
                    label={`الحقل: ${key}`}
                    value={cms.formLabels[key]}
                    onChange={(v) => setCms((c) => ({ ...c, formLabels: { ...c.formLabels, [key]: v } }))}
                  />
                ))}
              </div>
              <SaveButton section="formLabels" onClick={() => saveSection('formLabels', cms.formLabels)} />
            </div>
          )}

          {/* FEATURES TAB */}
          {tab === 'features' && (
            <div className="space-y-4">
              <h3 className="text-gray-800 font-extrabold text-base border-b border-gray-100 pb-2">قسم المميزات الرئيسية</h3>
              <Field
                label="شارة قسم المميزات"
                value={cms.features?.badge}
                onChange={(v) => setCms((c) => ({ ...c, features: { ...c.features, badge: v } }))}
              />
              <Field
                label="العنوان الرئيسي"
                value={cms.features?.title}
                onChange={(v) => setCms((c) => ({ ...c, features: { ...c.features, title: v } }))}
              />
              <Field
                label="العنوان الملون المميز"
                value={cms.features?.titleHighlight}
                onChange={(v) => setCms((c) => ({ ...c, features: { ...c.features, titleHighlight: v } }))}
              />
              <Field
                label="النص الفرعي"
                value={cms.features?.subtitle}
                onChange={(v) => setCms((c) => ({ ...c, features: { ...c.features, subtitle: v } }))}
                multiline
              />

              <hr className="border-gray-100 my-4" />
              <h4 className="text-gray-700 font-bold text-sm">البطاقات الأربع للمميزات</h4>
              <div className="space-y-4">
                {cms.features?.items?.map((item, i) => (
                  <div key={item.id || i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                    <p className="text-blue-600 text-xs font-black">بطاقة ميزة رقم {i + 1}</p>
                    <Field
                      label="العنوان"
                      value={item.heading}
                      onChange={(v) => {
                        const items = [...(cms.features.items ?? [])];
                        items[i] = { ...items[i], heading: v };
                        setCms((c) => ({ ...c, features: { ...c.features, items } }));
                      }}
                    />
                    <Field
                      label="الوصف"
                      value={item.paragraph}
                      onChange={(v) => {
                        const items = [...(cms.features.items ?? [])];
                        items[i] = { ...items[i], paragraph: v };
                        setCms((c) => ({ ...c, features: { ...c.features, items } }));
                      }}
                      multiline
                    />
                    <ImageUploadField
                      label="صورة الأيقونة التعبيرية"
                      value={item.imageUrl}
                      uploadType="feature"
                      token={token}
                      onChange={(v) => {
                        const items = [...(cms.features.items ?? [])];
                        items[i] = { ...items[i], imageUrl: v };
                        setCms((c) => ({ ...c, features: { ...c.features, items } }));
                      }}
                    />
                  </div>
                ))}
              </div>

              <hr className="border-gray-200 my-6" />
              <h3 className="text-gray-800 font-extrabold text-base border-b border-gray-100 pb-2">ترويج وبانر المتجر الإلكتروني</h3>
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
                <Field
                  label="عنوان ترويج المتجر"
                  value={cms.features?.shopPromo?.heading}
                  onChange={(v) =>
                    setCms((c) => ({
                      ...c,
                      features: {
                        ...c.features,
                        shopPromo: { ...c.features.shopPromo, heading: v },
                      },
                    }))
                  }
                />
                <Field
                  label="النص الترويجي - قبل الكلمة الملونة"
                  value={cms.features?.shopPromo?.subtextBefore}
                  onChange={(v) =>
                    setCms((c) => ({
                      ...c,
                      features: {
                        ...c.features,
                        shopPromo: { ...c.features.shopPromo, subtextBefore: v },
                      },
                    }))
                  }
                />
                <Field
                  label="الكلمة الملونة المميزة"
                  value={cms.features?.shopPromo?.subtextHighlight}
                  onChange={(v) =>
                    setCms((c) => ({
                      ...c,
                      features: {
                        ...c.features,
                        shopPromo: { ...c.features.shopPromo, subtextHighlight: v },
                      },
                    }))
                  }
                />
                <Field
                  label="النص الترويجي - بعد الكلمة الملونة"
                  value={cms.features?.shopPromo?.subtextAfter}
                  onChange={(v) =>
                    setCms((c) => ({
                      ...c,
                      features: {
                        ...c.features,
                        shopPromo: { ...c.features.shopPromo, subtextAfter: v },
                      },
                    }))
                  }
                />
                <Field
                  label="رابط المتجر الإلكتروني (الرابط الموجه له الأزرار)"
                  value={cms.features?.shopPromo?.storeUrl}
                  onChange={(v) =>
                    setCms((c) => ({
                      ...c,
                      features: {
                        ...c.features,
                        shopPromo: { ...c.features.shopPromo, storeUrl: v },
                      },
                    }))
                  }
                />
                <Field
                  label="نص زر الشراء الرئيسي"
                  value={cms.features?.shopPromo?.ctaText}
                  onChange={(v) =>
                    setCms((c) => ({
                      ...c,
                      features: {
                        ...c.features,
                        shopPromo: { ...c.features.shopPromo, ctaText: v },
                      },
                    }))
                  }
                />
                <ImageUploadField
                  label="الصورة التعبيرية للمتجر والتسوق"
                  value={cms.features?.shopPromo?.imageUrl}
                  uploadType="shop"
                  token={token}
                  onChange={(v) =>
                    setCms((c) => ({
                      ...c,
                      features: {
                        ...c.features,
                        shopPromo: { ...c.features.shopPromo, imageUrl: v },
                      },
                    }))
                  }
                />
              </div>

              <SaveButton section="features" onClick={() => saveSection('features', cms.features)} />
            </div>
          )}

          {/* TESTIMONIALS TAB */}
          {tab === 'testimonials' && (
            <div className="space-y-4">
              <h3 className="text-gray-800 font-extrabold text-base border-b border-gray-100 pb-2">تقييمات وآراء العملاء</h3>
              <div className="space-y-4">
                {cms.testimonials?.map((t, i) => (
                  <div key={t.id || i} className="p-4 bg-gray-55 rounded-xl border border-gray-200 space-y-3 relative">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <p className="text-blue-600 text-xs font-black">تقييم رقم {i + 1}</p>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => {
                            const arr = [...(cms.testimonials ?? [])];
                            [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                            setCms((c) => ({ ...c, testimonials: arr }));
                          }}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={i === (cms.testimonials?.length ?? 0) - 1}
                          onClick={() => {
                            const arr = [...(cms.testimonials ?? [])];
                            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                            setCms((c) => ({ ...c, testimonials: arr }));
                          }}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const arr = (cms.testimonials ?? []).filter((_, j) => j !== i);
                            setCms((c) => ({ ...c, testimonials: arr }));
                          }}
                          className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        label="اسم العميل"
                        value={t.name}
                        onChange={(v) => {
                          const arr = [...(cms.testimonials ?? [])];
                          arr[i] = { ...arr[i], name: v };
                          setCms((c) => ({ ...c, testimonials: arr }));
                        }}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Field
                          label="التقييم (1-5)"
                          value={String(t.rating ?? 5)}
                          onChange={(v) => {
                            const arr = [...(cms.testimonials ?? [])];
                            arr[i] = { ...arr[i], rating: Math.min(5, Math.max(1, Number(v) || 5)) };
                            setCms((c) => ({ ...c, testimonials: arr }));
                          }}
                        />
                        <Field
                          label="منذ (أشهر)"
                          value={String(t.monthsAgo ?? 1)}
                          onChange={(v) => {
                            const arr = [...(cms.testimonials ?? [])];
                            arr[i] = { ...arr[i], monthsAgo: Number(v) || 1 };
                            setCms((c) => ({ ...c, testimonials: arr }));
                          }}
                        />
                      </div>
                    </div>

                    <Field
                      label="نص الرأي والتعليق"
                      value={t.text}
                      onChange={(v) => {
                        const arr = [...(cms.testimonials ?? [])];
                        arr[i] = { ...arr[i], text: v };
                        setCms((c) => ({ ...c, testimonials: arr }));
                      }}
                      multiline
                    />

                    <ImageUploadField
                      label="أفاتار وصورة العميل الشخصية (اختياري)"
                      value={t.avatar_url ?? ''}
                      uploadType="testimonial"
                      token={token}
                      optional
                      onChange={(v) => {
                        const arr = [...(cms.testimonials ?? [])];
                        arr[i] = { ...arr[i], avatar_url: v || null };
                        setCms((c) => ({ ...c, testimonials: arr }));
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const id = `t-${Date.now()}`;
                  const order = (cms.testimonials?.length ?? 0) + 1;
                  setCms((c) => ({
                    ...c,
                    testimonials: [
                      ...(c.testimonials ?? []),
                      { id, name: '', text: '', avatar_url: null, rating: 5, monthsAgo: 1, order },
                    ],
                  }));
                }}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 text-blue-600 hover:text-blue-700 font-bold bg-blue-50/10 hover:bg-blue-50/40 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة رأي عميل جديد</span>
              </button>

              <SaveButton
                section="testimonials"
                onClick={() => {
                  const sorted = (cms.testimonials ?? []).map((t, idx) => ({ ...t, order: idx + 1 }));
                  saveSection('testimonials', sorted);
                }}
              />
            </div>
          )}

          {/* FAQS TAB */}
          {tab === 'faqs' && (
            <div className="space-y-4">
              <h3 className="text-gray-800 font-extrabold text-base border-b border-gray-100 pb-2">الأسئلة الشائعة (FAQ)</h3>
              <div className="space-y-4">
                {cms.faqs?.map((faq, i) => (
                  <div key={faq.id || i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <p className="text-blue-600 text-xs font-black">سؤال وجواب رقم {i + 1}</p>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => {
                            const arr = [...(cms.faqs ?? [])];
                            [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                            setCms((c) => ({ ...c, faqs: arr }));
                          }}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={i === (cms.faqs?.length ?? 0) - 1}
                          onClick={() => {
                            const arr = [...(cms.faqs ?? [])];
                            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                            setCms((c) => ({ ...c, faqs: arr }));
                          }}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const arr = (cms.faqs ?? []).filter((_, j) => j !== i);
                            setCms((c) => ({ ...c, faqs: arr }));
                          }}
                          className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <Field
                      label="السؤال"
                      value={faq.q}
                      onChange={(v) => {
                        const arr = [...(cms.faqs ?? [])];
                        arr[i] = { ...arr[i], q: v };
                        setCms((c) => ({ ...c, faqs: arr }));
                      }}
                    />
                    <Field
                      label="الإجابة"
                      value={faq.a}
                      onChange={(v) => {
                        const arr = [...(cms.faqs ?? [])];
                        arr[i] = { ...arr[i], a: v };
                        setCms((c) => ({ ...c, faqs: arr }));
                      }}
                      multiline
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const id = `f-${Date.now()}`;
                  const order = (cms.faqs?.length ?? 0) + 1;
                  setCms((c) => ({
                    ...c,
                    faqs: [...(c.faqs ?? []), { id, q: '', a: '', order }],
                  }));
                }}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 text-blue-600 hover:text-blue-700 font-bold bg-blue-50/10 hover:bg-blue-50/40 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة سؤال وجواب جديد</span>
              </button>

              <SaveButton
                section="faqs"
                onClick={() => {
                  const sorted = (cms.faqs ?? []).map((f, idx) => ({ ...f, order: idx + 1 }));
                  saveSection('faqs', sorted);
                }}
              />
            </div>
          )}

          {/* FOOTER TAB */}
          {tab === 'footer' && (
            <div className="space-y-4">
              <h3 className="text-gray-800 font-extrabold text-base border-b border-gray-100 pb-2">الفوتر ومعلومات الاتصال</h3>
              <Field
                label="رقم واتساب للتواصل (أرقام فقط مع رمز الدولة - مثال: 966500000000)"
                value={cms.footer?.whatsapp}
                onChange={(v) => setCms((c) => ({ ...c, footer: { ...c.footer, whatsapp: v } }))}
              />
              <Field
                label="البريد الإلكتروني للدعم"
                value={cms.footer?.email}
                onChange={(v) => setCms((c) => ({ ...c, footer: { ...c.footer, email: v } }))}
              />
              <Field
                label="رابط حساب تيك توك"
                value={cms.footer?.tiktok}
                onChange={(v) => setCms((c) => ({ ...c, footer: { ...c.footer, tiktok: v } }))}
              />
              <Field
                label="رابط حساب سناب شات"
                value={cms.footer?.snapchat}
                onChange={(v) => setCms((c) => ({ ...c, footer: { ...c.footer, snapchat: v } }))}
              />
              <Field
                label="رقم السجل التجاري (CR)"
                value={cms.footer?.crNumber}
                onChange={(v) => setCms((c) => ({ ...c, footer: { ...c.footer, crNumber: v } }))}
              />
              <Field
                label="الرقم الضريبي"
                value={cms.footer?.taxNumber}
                onChange={(v) => setCms((c) => ({ ...c, footer: { ...c.footer, taxNumber: v } }))}
              />
              <Field
                label="رقم مركز الأعمال أو الترخيص"
                value={cms.footer?.businessCenterNumber}
                onChange={(v) => setCms((c) => ({ ...c, footer: { ...c.footer, businessCenterNumber: v } }))}
              />
              <Field
                label="رابط تضمين خرائط جوجل (Google Maps Embed URL)"
                value={cms.footer?.mapsEmbedUrl}
                onChange={(v) => setCms((c) => ({ ...c, footer: { ...c.footer, mapsEmbedUrl: v } }))}
                multiline
              />
              <Field
                label="رابط الخريطة الخارجي الموجه للمتصفح"
                value={cms.footer?.mapsExternalUrl}
                onChange={(v) => setCms((c) => ({ ...c, footer: { ...c.footer, mapsExternalUrl: v } }))}
              />
              <Field
                label="نص حقوق النشر"
                value={cms.footer?.copyrightText}
                onChange={(v) => setCms((c) => ({ ...c, footer: { ...c.footer, copyrightText: v } }))}
              />
              <SaveButton section="footer" onClick={() => saveSection('footer', cms.footer)} />
            </div>
          )}

          {/* LOGO TAB */}
          {tab === 'logo' && (
            <div className="space-y-4">
              <h3 className="text-gray-800 font-extrabold text-base border-b border-gray-100 pb-2">شعار العلامة التجارية (Logo)</h3>
              <ImageUploadField
                label="صورة الشعار الأساسي للموقع"
                value={cms.logoUrl}
                uploadType="logo"
                token={token}
                onChange={(v) => setCms((c) => ({ ...c, logoUrl: v }))}
              />
              <SaveButton section="logoUrl" onClick={() => saveSection('logoUrl', cms.logoUrl as unknown as object)} />
            </div>
          )}

          {/* SEO TAB */}
          {tab === 'seo' && (
            <div className="space-y-4">
              <h3 className="text-gray-800 font-extrabold text-base border-b border-gray-100 pb-2">إعدادات محركات البحث ومواقع التواصل (SEO)</h3>
              <Field
                label="عنوان الصفحة الرئيسي (Meta Title)"
                value={cms.seo?.title}
                onChange={(v) => setCms((c) => ({ ...c, seo: { ...c.seo, title: v } }))}
              />
              <Field
                label="وصف الصفحة الرئيسي (Meta Description)"
                value={cms.seo?.description}
                onChange={(v) => setCms((c) => ({ ...c, seo: { ...c.seo, description: v } }))}
                multiline
              />
              <Field
                label="عنوان مشاركة الرابط (OG Title)"
                value={cms.seo?.ogTitle}
                onChange={(v) => setCms((c) => ({ ...c, seo: { ...c.seo, ogTitle: v } }))}
              />
              <Field
                label="وصف مشاركة الرابط (OG Description)"
                value={cms.seo?.ogDescription}
                onChange={(v) => setCms((c) => ({ ...c, seo: { ...c.seo, ogDescription: v } }))}
                multiline
              />
              <SaveButton section="seo" onClick={() => saveSection('seo', cms.seo)} />
            </div>
          )}

          {/* SUCCESS TAB */}
          {tab === 'success' && (
            <div className="space-y-4">
              <h3 className="text-gray-800 font-extrabold text-base border-b border-gray-100 pb-2">إعدادات صفحة نجاح التقديم</h3>
              <Field
                label="العنوان الترحيبي"
                value={cms.successPage?.title}
                onChange={(v) => setCms((c) => ({ ...c, successPage: { ...c.successPage, title: v } }))}
              />
              <Field
                label="الوصف والنص التوجيهي"
                value={cms.successPage?.subtitle}
                onChange={(v) => setCms((c) => ({ ...c, successPage: { ...c.successPage, subtitle: v } }))}
                multiline
              />
              <Field
                label="رقم واتساب المباشر لزر صفحة النجاح (أرقام فقط مع رمز الدولة - اختياري، فارغ للاستعانة برقم الفوتر)"
                value={cms.successPage?.whatsapp ?? ''}
                onChange={(v) => setCms((c) => ({ ...c, successPage: { ...c.successPage, whatsapp: v } }))}
              />
              <Field
                label="رسالة واتساب التلقائية المعبأة مسبقاً"
                value={cms.successPage?.whatsappMessage}
                onChange={(v) => setCms((c) => ({ ...c, successPage: { ...c.successPage, whatsappMessage: v } }))}
                multiline
              />
              <SaveButton section="successPage" onClick={() => saveSection('successPage', cms.successPage)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
