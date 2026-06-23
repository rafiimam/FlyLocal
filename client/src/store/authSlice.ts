import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Agent {
  name: string;
  email: string;
  companyName: string;
  entityType: string;
  tradeLicense: string;
  representativeName: string;
  phone: string;
  nidPassport: string;
  balance: number;
  currency: string;
  role: 'Agent' | 'Admin';
}

export interface OnboardingData {
  entityType: string;
  companyName: string;
  tradeLicense: string;
  businessEmail: string;
  representativeName: string;
  phone: string;
  nidPassport: string;
  password?: string;
}

export interface PendingAgency {
  id: string;
  companyName: string;
  entityType: string;
  tradeLicense: string;
  businessEmail: string;
  representativeName: string;
  phone: string;
  nidPassport: string;
  registrationDate: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  agent: Agent | null;
  onboardingStep: number;
  onboardingData: OnboardingData;
  pendingAgencies: PendingAgency[];
  demoRoleToggle: 'Agent' | 'Admin'; // Helper to switch views in the demo HUD
}

const defaultOnboarding: OnboardingData = {
  entityType: '',
  companyName: '',
  tradeLicense: '',
  businessEmail: '',
  representativeName: '',
  phone: '',
  nidPassport: '',
};

const initialState: AuthState = {
  isLoggedIn: false,
  agent: null,
  onboardingStep: 1,
  onboardingData: defaultOnboarding,
  pendingAgencies: [
    {
      id: 'PA-201',
      companyName: 'Delta Flights & Travels Ltd',
      entityType: 'Partnership',
      tradeLicense: 'TR-2026-8842',
      businessEmail: 'licensing@deltaflights.com',
      representativeName: 'Kamrul Islam',
      phone: '+880 1819-223344',
      nidPassport: 'NID-449281034',
      registrationDate: '2026-06-19T10:15:00Z',
    },
    {
      id: 'PA-202',
      companyName: 'Orion Travel Planners',
      entityType: 'Proprietorship',
      tradeLicense: 'TR-2026-7731',
      businessEmail: 'orion.travels@gmail.com',
      representativeName: 'Tanvir Ahmed',
      phone: '+880 1521-445566',
      nidPassport: 'NID-883921045',
      registrationDate: '2026-06-20T08:30:00Z',
    }
  ],
  demoRoleToggle: 'Agent',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string }>) => {
      const email = action.payload.email;
      const isAdmin = email === 'admin@flylocal.com' || email.includes('admin');
      
      state.agent = {
        name: isAdmin ? 'System Administrator' : 'Anisur Rahman',
        email: email,
        companyName: isAdmin ? 'FlyLocal GDS Platform' : 'Apex Travel & Tours',
        entityType: isAdmin ? 'Government Authority' : 'Limited Company',
        tradeLicense: isAdmin ? 'GDS-2026-ADMIN' : 'TR-2026-9941',
        representativeName: isAdmin ? 'Admin Root' : 'Anisur Rahman',
        phone: isAdmin ? '+880 1999-999999' : '+880 1712-345678',
        nidPassport: isAdmin ? 'NID-000000000' : 'NID-994821034',
        balance: isAdmin ? 5000000 : 595500,
        currency: 'BDT',
        role: isAdmin ? 'Admin' : 'Agent',
      };
      state.isLoggedIn = true;
      state.demoRoleToggle = isAdmin ? 'Admin' : 'Agent';
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.agent = null;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.agent) {
        state.agent.balance += action.payload;
      }
    },
    setOnboardingStep: (state, action: PayloadAction<number>) => {
      state.onboardingStep = action.payload;
    },
    updateOnboardingData: (state, action: PayloadAction<Partial<OnboardingData>>) => {
      state.onboardingData = { ...state.onboardingData, ...action.payload };
    },
    completeOnboarding: (state) => {
      // Add newly registered company to pending agencies list for admin approval
      const newAgencyId = `PA-${Date.now()}`;
      const newAgency: PendingAgency = {
        id: newAgencyId,
        companyName: state.onboardingData.companyName || 'New Horizon Tours',
        entityType: state.onboardingData.entityType || 'Proprietorship',
        tradeLicense: state.onboardingData.tradeLicense || 'TX-8849-XYZ',
        businessEmail: state.onboardingData.businessEmail || 'agent@portal.com',
        representativeName: state.onboardingData.representativeName || 'Representative Name',
        phone: state.onboardingData.phone || '+880 1500-000000',
        nidPassport: state.onboardingData.nidPassport || 'NID-111222333',
        registrationDate: new Date().toISOString(),
      };
      
      state.pendingAgencies = [newAgency, ...state.pendingAgencies];
      state.onboardingStep = 5; // Step 5: Submitted screen
    },
    resetOnboarding: (state) => {
      state.onboardingStep = 1;
      state.onboardingData = defaultOnboarding;
    },
    approveAgency: (state, action: PayloadAction<string>) => {
      state.pendingAgencies = state.pendingAgencies.filter(
        (agency) => agency.id !== action.payload
      );
    },
    setDemoRole: (state, action: PayloadAction<'Agent' | 'Admin'>) => {
      state.demoRoleToggle = action.payload;
      if (state.agent) {
        state.agent.role = action.payload;
        // Adjust agent name/company for demo aesthetics
        if (action.payload === 'Admin') {
          state.agent.name = 'System Administrator';
          state.agent.companyName = 'FlyLocal GDS Platform';
        } else {
          state.agent.name = 'Anisur Rahman';
          state.agent.companyName = 'Apex Travel & Tours';
        }
      }
    },
    adminApproveDepositBalance: (state, action: PayloadAction<number>) => {
      // Approving deposits increases the active agent wallet balance in the demo
      if (state.agent) {
        state.agent.balance += action.payload;
      }
    }
  },
});

export const {
  login,
  logout,
  updateBalance,
  setOnboardingStep,
  updateOnboardingData,
  completeOnboarding,
  resetOnboarding,
  approveAgency,
  setDemoRole,
  adminApproveDepositBalance,
} = authSlice.actions;

export default authSlice.reducer;
