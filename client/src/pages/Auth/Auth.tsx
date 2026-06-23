import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  login, 
  setOnboardingStep, 
  updateOnboardingData, 
  completeOnboarding 
} from '../../store/authSlice';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  FileText, 
  UploadCloud, 
  User, 
  Phone, 
  KeyRound, 
  CheckCircle2,
  Sparkles,
  Plane
} from 'lucide-react';

interface AuthProps {
  onBackToHome: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onBackToHome }) => {
  const dispatch = useAppDispatch();
  const step = useAppSelector((state) => state.auth.onboardingStep);
  const onboardingData = useAppSelector((state) => state.auth.onboardingData);

  const [isRegistering, setIsRegistering] = useState(false);
  const [loginEmail, setLoginEmail] = useState('anisur@apextravel.com');
  const [loginPassword, setLoginPassword] = useState('ApexTravel2026!');
  
  // Local wizard fields validation/states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      dispatch(login({ email: loginEmail }));
    }
  };

  const handleNextStep = () => {
    if (step < 4) {
      dispatch(setOnboardingStep(step + 1));
    } else {
      dispatch(completeOnboarding());
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      dispatch(setOnboardingStep(step - 1));
    }
  };

  const triggerOtp = () => {
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const mockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTradeLicenseFile(e.target.files[0].name);
    }
  };

  const entityTypes = [
    { id: 'Proprietorship', label: 'Proprietorship', desc: 'Sole owner business operations' },
    { id: 'Partnership', label: 'Partnership', desc: 'Joint venture entity agreement' },
    { id: 'Ltd', label: 'Limited Company', desc: 'Private or Public Limited corporation' },
    { id: 'Freelancer', label: 'Freelancer / IATA', desc: 'Independent travel consultant license' },
  ];

  return (
    <div className="min-h-screen bg-[#01111a] bg-radial from-[#022538] to-[#01111a] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 selection:bg-brand-cyan selection:text-slate-950">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2.5"
        >
          <div className="w-9 h-9 rounded-lg bg-brand-cyan/15 flex items-center justify-center border border-brand-cyan/20">
            <Plane className="w-4.5 h-4.5 text-brand-cyan transform -rotate-45" />
          </div>
          <span className="font-display font-bold text-base text-white tracking-wider">FLYLOCAL B2B</span>
        </button>
        <button
          onClick={onBackToHome}
          className="text-xs text-slate-400 hover:text-white font-semibold transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-xl"
        >
          Back to Portal Info
        </button>
      </header>

      {/* Auth Workspace Card */}
      <main className="flex-1 flex items-center justify-center my-8">
        <div className="w-full max-w-lg glass-panel-dark rounded-3xl p-6 sm:p-8 border-brand-cyan/20 shadow-2xl relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-brand-cyan/10 rounded-full blur-xl pointer-events-none" />

          {/* Tab Selector */}
          {!isRegistering ? (
            /* Login Layout */
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <h2 className="font-display text-2xl font-bold text-white tracking-wide">
                  Agent Sign In
                </h2>
                <p className="text-xs text-slate-400">
                  Access your agency booking workspace and GDS channels.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 ml-1">
                    Business Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. agent@apextravel.com"
                      className="w-full bg-[#011420] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#011420] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      defaultChecked
                      className="rounded bg-[#011420] border-white/10 text-brand-cyan focus:ring-0"
                    />
                    <label htmlFor="remember" className="text-slate-400 cursor-pointer">
                      Remember agency
                    </label>
                  </div>
                  <span className="text-brand-cyan hover:underline cursor-pointer">Forgot password?</span>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-cyan text-slate-950 font-bold text-sm hover:bg-brand-cyan-light transition-all shadow-lg shadow-brand-cyan/15 mt-2 cursor-pointer"
                >
                  <span>Authenticate Portal Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="border-t border-white/5 pt-6 text-center text-xs font-semibold space-y-3">
                <p className="text-slate-400">
                  New agency? Start onboarding to request GDS credentials.
                </p>
                <button
                  onClick={() => setIsRegistering(true)}
                  className="w-full py-3 rounded-xl border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/5 text-xs font-bold transition-all"
                >
                  Start Multi-step Registration Wizard
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Registration Wizard */
            <div className="space-y-6">
              {/* Onboarding Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-brand-cyan font-bold block">
                    Agency Onboarding
                  </span>
                  <h3 className="font-display font-semibold text-lg text-white">
                    Step {step} of 4:{' '}
                    {step === 1 && 'Entity Type'}
                    {step === 2 && 'Company details'}
                    {step === 3 && 'Representative'}
                    {step === 4 && 'Credentials'}
                  </h3>
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`w-5 h-1 rounded-full transition-colors ${
                        s === step
                          ? 'bg-brand-cyan'
                          : s < step
                          ? 'bg-emerald-400'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Wizard forms */}
              <div className="space-y-4 min-h-60">
                {/* Step 1: Entity Type */}
                {step === 1 && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400 mb-2">
                      Please select your business entity category to adapt GDS compliance schemas.
                    </p>
                    <div className="grid grid-cols-1 gap-2.5">
                      {entityTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => dispatch(updateOnboardingData({ entityType: type.id }))}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                            onboardingData.entityType === type.id
                              ? 'bg-brand-cyan/10 border-brand-cyan text-white shadow-inner'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-xs font-semibold block">{type.label}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5 block">{type.desc}</span>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              onboardingData.entityType === type.id
                                ? 'border-brand-cyan bg-brand-cyan text-slate-950'
                                : 'border-slate-500'
                            }`}>
                              {onboardingData.entityType === type.id && (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Company Details */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Company Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={onboardingData.companyName}
                          onChange={(e) => dispatch(updateOnboardingData({ companyName: e.target.value }))}
                          placeholder="e.g. Apex Travel & Tours"
                          className="w-full bg-[#011420] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Trade License Registration</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={onboardingData.tradeLicense}
                          onChange={(e) => dispatch(updateOnboardingData({ tradeLicense: e.target.value }))}
                          placeholder="e.g. TR-2026-9941"
                          className="w-full bg-[#011420] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Business Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={onboardingData.businessEmail}
                          onChange={(e) => dispatch(updateOnboardingData({ businessEmail: e.target.value }))}
                          placeholder="e.g. licensing@apextravel.com"
                          className="w-full bg-[#011420] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                      </div>
                    </div>

                    {/* Drag and Drop Mock File Upload */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">
                        Upload PDF Trade License
                      </label>
                      <div className="border border-dashed border-white/10 bg-[#011420] rounded-xl p-4 text-center cursor-pointer hover:border-brand-cyan/40 transition-colors relative">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg"
                          onChange={mockFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <UploadCloud className="w-7 h-7 text-brand-cyan mx-auto mb-2" />
                        {tradeLicenseFile ? (
                          <div className="text-xs text-emerald-400 font-semibold truncate px-4">
                            Attached: {tradeLicenseFile}
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs text-slate-300 font-semibold block">Click to attach file</span>
                            <span className="text-[9px] text-slate-500 block mt-0.5">Supports PDF or PNG/JPG (Max 5MB)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Representative & OTP Verification */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Representative Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={onboardingData.representativeName}
                          onChange={(e) => dispatch(updateOnboardingData({ representativeName: e.target.value }))}
                          placeholder="e.g. Anisur Rahman"
                          className="w-full bg-[#011420] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Phone Number (OTP Verification)</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={onboardingData.phone}
                            onChange={(e) => dispatch(updateOnboardingData({ phone: e.target.value }))}
                            placeholder="e.g. +880 1712-345678"
                            className="w-full bg-[#011420] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={triggerOtp}
                          disabled={otpLoading || otpSent || !onboardingData.phone}
                          className="px-4 rounded-xl text-xs font-bold bg-brand-cyan disabled:bg-slate-900 disabled:text-slate-500 disabled:border-white/5 border border-transparent text-slate-950 hover:bg-brand-cyan-light transition-all flex items-center justify-center shrink-0 cursor-pointer"
                        >
                          {otpLoading ? 'Sending...' : otpSent ? 'Code Sent!' : 'Send OTP'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">NID / Passport Registration</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={onboardingData.nidPassport}
                          onChange={(e) => dispatch(updateOnboardingData({ nidPassport: e.target.value }))}
                          placeholder="e.g. NID-994821034"
                          className="w-full bg-[#011420] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                        />
                      </div>
                    </div>

                    {/* OTP Entry verification code */}
                    {otpSent && (
                      <div className="space-y-1.5 p-3.5 bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">Enter OTP Code</span>
                          <span className="text-[10px] text-slate-400 font-medium">Verification Code: 9948</span>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={otpVal}
                          onChange={(e) => setOtpVal(e.target.value)}
                          placeholder="Type 9948 to verify"
                          className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-center text-sm font-bold text-white tracking-widest focus:outline-none focus:border-brand-cyan"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Password Credentials Setting */}
                {step === 4 && (
                  <div className="space-y-5 text-center">
                    <div className="space-y-1.5">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-display font-semibold text-white text-base">Agency Verification Confirmed</h4>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                        All agency licenses have compiled successfully. Please configure your master administrative password.
                      </p>
                    </div>

                    <div className="space-y-4 text-left max-w-xs mx-auto">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Setup Password</label>
                        <div className="relative">
                          <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="password"
                            required
                            placeholder="••••••••••••"
                            className="w-full bg-[#011420] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Confirm Password</label>
                        <div className="relative">
                          <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="password"
                            required
                            placeholder="••••••••••••"
                            className="w-full bg-[#011420] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wizard navigation triggers */}
              <div className="flex justify-between items-center border-t border-white/5 pt-5 gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={step === 1}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-xs font-semibold transition-all disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={
                      (step === 1 && !onboardingData.entityType) ||
                      (step === 2 && (!onboardingData.companyName || !onboardingData.tradeLicense || !onboardingData.businessEmail)) ||
                      (step === 3 && (!onboardingData.representativeName || !onboardingData.nidPassport || (otpSent && otpVal !== '9948')))
                    }
                    className="px-5 py-2.5 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyan-light transition-all flex items-center gap-1.5 cursor-pointer disabled:bg-slate-900 disabled:text-slate-500"
                  >
                    <span>Proceed Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-5 py-2.5 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyan-light transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-brand-cyan/20 animate-pulse"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Complete & Access Portal</span>
                  </button>
                )}
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-xs text-slate-400 hover:text-white underline transition-colors"
                >
                  Cancel onboarding, return to login
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center text-[10px] text-slate-500 font-semibold">
        <div className="flex justify-center items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Secured with B2B GDS Compliance Protocol • TLS 1.3 Encryption</span>
        </div>
      </footer>
    </div>
  );
};
