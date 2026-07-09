import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "../services/firebase";

export interface InvestorProfile {
  fullName: string;
  age: number;
  occupation: string;
  annualIncome: string;
  experience: string;
  goal: string;
  horizon: string;
  capacity: number;
  riskAppetite: string;
}

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
} | null;

interface AuthContextType {
  user: AuthUser;
  loading: boolean;
  onboarded: boolean;
  profile: InvestorProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  submitOnboarding: (profileData: InvestorProfile) => Promise<void>;
  updateProfileData: (profileData: InvestorProfile) => Promise<void>;
  resendVerification: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Live Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified
        });

        // Load profile if present in localStorage (only if verified)
        if (firebaseUser.emailVerified) {
          const storedProfile = localStorage.getItem(`nidhi_profile_${firebaseUser.uid}`);
          if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
            setOnboarded(true);
          } else {
            setProfile(null);
            setOnboarded(false);
          }
        } else {
          setProfile(null);
          setOnboarded(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        setOnboarded(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        emailVerified: fbUser.emailVerified
      });

      if (fbUser.emailVerified) {
        const storedProfile = localStorage.getItem(`nidhi_profile_${fbUser.uid}`);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
          setOnboarded(true);
        } else {
          setProfile(null);
          setOnboarded(false);
        }
      } else {
        setProfile(null);
        setOnboarded(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Immediately call sendEmailVerification after successful account creation
      await sendEmailVerification(userCredential.user);
      
      const fbUser = userCredential.user;
      setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: name,
        emailVerified: fbUser.emailVerified
      });
      setProfile(null);
      setOnboarded(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
      setOnboarded(false);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error("No user logged in to verify.");
    }
  };

  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const fbUser = auth.currentUser;
      setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        emailVerified: fbUser.emailVerified
      });

      if (fbUser.emailVerified) {
        const storedProfile = localStorage.getItem(`nidhi_profile_${fbUser.uid}`);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
          setOnboarded(true);
        } else {
          setProfile(null);
          setOnboarded(false);
        }
      }
    }
  };

  const submitOnboarding = async (profileData: InvestorProfile) => {
    if (!user) return;
    localStorage.setItem(`nidhi_profile_${user.uid}`, JSON.stringify(profileData));
    setProfile(profileData);
    setOnboarded(true);
  };

  const updateProfileData = async (profileData: InvestorProfile) => {
    if (!user) return;
    localStorage.setItem(`nidhi_profile_${user.uid}`, JSON.stringify(profileData));
    setProfile(profileData);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        onboarded, 
        profile, 
        login, 
        signup, 
        logout, 
        submitOnboarding, 
        updateProfileData,
        resendVerification,
        reloadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
