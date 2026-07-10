'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LeadFormSectionContent,
  FormLabelsContent,
} from '@/lib/types';
import { submitLead, SubmitLeadPayload } from '@/lib/api';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface LeadFormProps {
  section: LeadFormSectionContent;
  labels: FormLabelsContent;
}

interface Step1 {
  fullName: string;
  phone: string;
  isQualified: boolean | null;
  state: 'citizen' | 'resident' | '';
}

interface Step2 {
  monthlySalary: string;
  monthlyObligations: string;
  hasRealEstateLoan: boolean | null;
  workSector: 'government' | 'private_company' | 'private_establishment' | 'retired' | '';
  serviceDuration: 'less_than_3_months' | 'more_than_3_months' | '';
}

const INITIAL_STEP1: Step1 = {
  fullName: '',
  phone: '',
  isQualified: null,
  state: '',
};

const INITIAL_STEP2: Step2 = {
  monthlySalary: '',
  monthlyObligations: '',
  hasRealEstateLoan: null,
  workSector: '',
  serviceDuration: '',
};

export default function LeadForm({ section, labels }: LeadFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [step1, setStep1] = useState<Step1>(INITIAL_STEP1);
  const [step2, setStep2] = useState<Step2>(INITIAL_STEP2);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // ── Step 1 validation ──────────────────────────────────────────────────────
  function validateStep1(): boolean {
    const e: Record<string, string> = {};
    if (!step1.fullName.trim() || step1.fullName.trim().length < 3)
      e.fullName = 'الاسم مطلوب (3 أحرف على الأقل)';
    if (!/^\d{9,10}$/.test(step1.phone.trim()))
      e.phone = 'رقم الجوال يجب أن يكون 9-10 أرقام';
    if (step1.isQualified === null) e.isQualified = 'يرجى الإجابة على سؤال العمر';
    if (!step1.state) e.state = 'يرجى تحديد الجنسية';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Step 2 validation ──────────────────────────────────────────────────────
  function validateStep2(): boolean {
    const e: Record<string, string> = {};
    const salary = parseFloat(step2.monthlySalary);
    if (!step2.monthlySalary || isNaN(salary) || salary < 0)
      e.monthlySalary = 'الراتب الشهري مطلوب';
    if (!step2.workSector) e.workSector = 'يرجى تحديد جهة العمل';
    if (!step2.serviceDuration) e.serviceDuration = 'يرجى تحديد مدة الخدمة';
    if (step2.hasRealEstateLoan === null) e.hasRealEstateLoan = 'يرجى الإجابة';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validateStep1()) setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setServerError('');

    try {
      const payload: SubmitLeadPayload = {
        fullName: step1.fullName.trim(),
        phone: step1.phone.trim(),
        isQualified: step1.isQualified!,
        state: step1.state as 'citizen' | 'resident',
        monthlySalary: parseFloat(step2.monthlySalary),
        monthlyObligations: step2.monthlyObligations
          ? parseFloat(step2.monthlyObligations)
          : 0,
        hasRealEstateLoan: step2.hasRealEstateLoan ?? false,
        workSector: step2.workSector as SubmitLeadPayload['workSector'],
        serviceDuration: step2.serviceDuration as SubmitLeadPayload['serviceDuration'],
      };

      await submitLead(payload);
      router.push('/success');
    } catch {
      setServerError('حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="lead-form"
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-padding-y)',
      }}
    >
      <div className="app-container" style={{ maxWidth: '680px' }}>
        {/* Section header — Ebdaa style */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {section.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            {section.title}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">{section.subtitle}</p>
        </div>

        {/* Step indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          {[1, 2].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  background:
                    step >= s
                      ? 'linear-gradient(135deg, var(--color-brand), var(--color-brand-light))'
                      : 'var(--color-border)',
                  color: step >= s ? '#fff' : 'var(--color-text-muted)',
                  transition: 'all 0.3s ease',
                }}
              >
                {s}
              </div>
              {s === 1 && (
                <div
                  style={{
                    width: '4rem',
                    height: '2px',
                    background:
                      step >= 2
                        ? 'var(--color-brand)'
                        : 'var(--color-border)',
                    transition: 'background 0.3s ease',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className="card"
          style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}
        >
          <form onSubmit={handleSubmit} noValidate>
            {/* ── Step 1 ── */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Full name */}
                <div className="form-field">
                  <label className="form-label">{labels.fullName}</label>
                  <input
                    type="text"
                    className={`form-input${errors.fullName ? ' error' : ''}`}
                    value={step1.fullName}
                    onChange={(e) =>
                      setStep1((p) => ({ ...p, fullName: e.target.value }))
                    }
                    placeholder="محمد العمري"
                  />
                  {errors.fullName && (
                    <span className="form-error">⚠ {errors.fullName}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="form-field">
                  <label className="form-label">{labels.phone}</label>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '1rem',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-text-muted)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    >
                      🇸🇦 +966
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      className={`form-input${errors.phone ? ' error' : ''}`}
                      style={{ paddingRight: '5.5rem' }}
                      value={step1.phone}
                      onChange={(e) =>
                        setStep1((p) => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))
                      }
                      placeholder="5xxxxxxxx"
                      maxLength={10}
                    />
                  </div>
                  {errors.phone && (
                    <span className="form-error">⚠ {errors.phone}</span>
                  )}
                </div>

                {/* Age qualification */}
                <div className="form-field">
                  <label className="form-label">{labels.ageGroup}</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {[
                      { value: true, label: labels.ageQualified },
                      { value: false, label: labels.ageNotQualified },
                    ].map(({ value, label }) => (
                      <button
                        type="button"
                        key={String(value)}
                        onClick={() =>
                          setStep1((p) => ({ ...p, isQualified: value }))
                        }
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid',
                          borderColor:
                            step1.isQualified === value
                              ? 'var(--color-brand)'
                              : 'var(--color-border)',
                          background:
                            step1.isQualified === value
                              ? 'rgba(26,95,156,0.08)'
                              : 'var(--color-surface)',
                          color:
                            step1.isQualified === value
                              ? 'var(--color-brand)'
                              : 'var(--color-text)',
                          fontWeight: 600,
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '0.9rem',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.isQualified && (
                    <span className="form-error">⚠ {errors.isQualified}</span>
                  )}
                </div>

                {/* State / residency */}
                <div className="form-field">
                  <label className="form-label">{labels.residency}</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {[
                      { value: 'citizen', label: labels.citizen },
                      { value: 'resident', label: labels.resident },
                    ].map(({ value, label }) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() =>
                          setStep1((p) => ({
                            ...p,
                            state: value as 'citizen' | 'resident',
                          }))
                        }
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid',
                          borderColor:
                            step1.state === value
                              ? 'var(--color-brand)'
                              : 'var(--color-border)',
                          background:
                            step1.state === value
                              ? 'rgba(26,95,156,0.08)'
                              : 'var(--color-surface)',
                          color:
                            step1.state === value
                              ? 'var(--color-brand)'
                              : 'var(--color-text)',
                          fontWeight: 600,
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '0.9rem',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.state && (
                    <span className="form-error">⚠ {errors.state}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                  style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <ChevronLeft size={18} />
                  {labels.nextButton}
                </button>
              </div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Monthly salary */}
                <div className="form-field">
                  <label className="form-label">{labels.monthlySalary}</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    className={`form-input${errors.monthlySalary ? ' error' : ''}`}
                    value={step2.monthlySalary}
                    onChange={(e) =>
                      setStep2((p) => ({ ...p, monthlySalary: e.target.value }))
                    }
                    placeholder="5000"
                  />
                  {errors.monthlySalary && (
                    <span className="form-error">⚠ {errors.monthlySalary}</span>
                  )}
                </div>

                {/* Monthly obligations */}
                <div className="form-field">
                  <label className="form-label">{labels.monthlyObligations}</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    className="form-input"
                    value={step2.monthlyObligations}
                    onChange={(e) =>
                      setStep2((p) => ({ ...p, monthlyObligations: e.target.value }))
                    }
                    placeholder="0"
                  />
                </div>

                {/* Real estate loan */}
                <div className="form-field">
                  <label className="form-label">{labels.realEstateLoan}</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {[
                      { value: true, label: labels.loanYes },
                      { value: false, label: labels.loanNo },
                    ].map(({ value, label }) => (
                      <button
                        type="button"
                        key={String(value)}
                        onClick={() =>
                          setStep2((p) => ({ ...p, hasRealEstateLoan: value }))
                        }
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid',
                          borderColor:
                            step2.hasRealEstateLoan === value
                              ? 'var(--color-brand)'
                              : 'var(--color-border)',
                          background:
                            step2.hasRealEstateLoan === value
                              ? 'rgba(26,95,156,0.08)'
                              : 'var(--color-surface)',
                          color:
                            step2.hasRealEstateLoan === value
                              ? 'var(--color-brand)'
                              : 'var(--color-text)',
                          fontWeight: 600,
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.hasRealEstateLoan && (
                    <span className="form-error">⚠ {errors.hasRealEstateLoan}</span>
                  )}
                </div>

                {/* Work sector */}
                <div className="form-field">
                  <label className="form-label">{labels.workSector}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { value: 'government', label: labels.sectorGovernment },
                      { value: 'private_company', label: labels.sectorPrivateCompany },
                      { value: 'private_establishment', label: labels.sectorPrivateEstablishment },
                      { value: 'retired', label: labels.sectorRetired },
                    ].map(({ value, label }) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() =>
                          setStep2((p) => ({
                            ...p,
                            workSector: value as Step2['workSector'],
                          }))
                        }
                        style={{
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid',
                          borderColor:
                            step2.workSector === value
                              ? 'var(--color-brand)'
                              : 'var(--color-border)',
                          background:
                            step2.workSector === value
                              ? 'rgba(26,95,156,0.08)'
                              : 'var(--color-surface)',
                          color:
                            step2.workSector === value
                              ? 'var(--color-brand)'
                              : 'var(--color-text)',
                          fontWeight: 600,
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '0.875rem',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.workSector && (
                    <span className="form-error">⚠ {errors.workSector}</span>
                  )}
                </div>

                {/* Service duration */}
                <div className="form-field">
                  <label className="form-label">{labels.serviceDuration}</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {[
                      { value: 'less_than_3_months', label: labels.durationLess },
                      { value: 'more_than_3_months', label: labels.durationMore },
                    ].map(({ value, label }) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() =>
                          setStep2((p) => ({
                            ...p,
                            serviceDuration: value as Step2['serviceDuration'],
                          }))
                        }
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid',
                          borderColor:
                            step2.serviceDuration === value
                              ? 'var(--color-brand)'
                              : 'var(--color-border)',
                          background:
                            step2.serviceDuration === value
                              ? 'rgba(26,95,156,0.08)'
                              : 'var(--color-surface)',
                          color:
                            step2.serviceDuration === value
                              ? 'var(--color-brand)'
                              : 'var(--color-text)',
                          fontWeight: 600,
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '0.875rem',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.serviceDuration && (
                    <span className="form-error">⚠ {errors.serviceDuration}</span>
                  )}
                </div>

                {/* Consent text */}
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                    padding: '0.75rem',
                    background: 'rgba(26,95,156,0.05)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(26,95,156,0.1)',
                  }}
                >
                  {labels.submitButton && null /* consent shown in section header */}
                </p>

                {serverError && (
                  <p
                    style={{
                      color: 'var(--color-error)',
                      fontSize: '0.875rem',
                      textAlign: 'center',
                    }}
                  >
                    ⚠ {serverError}
                  </p>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {labels.backButton}
                    <ChevronRight size={18} />
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ flex: 2, justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        جاري الإرسال...
                      </>
                    ) : (
                      labels.submitButton
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
