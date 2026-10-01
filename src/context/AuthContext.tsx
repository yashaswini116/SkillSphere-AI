"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, UserRole } from "@/lib/types";
import { demoStudentUser, demoAdminUser, initialBadges } from "@/lib/mockData";
import { playAudioFeedback } from "@/lib/utils";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import confetti from "canvas-confetti";

interface AuthResponse {
  success: boolean;
  error?: string;
  message?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isFirebaseLive: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<AuthResponse>;
  registerWithEmail: (
    email: string,
    pass: string,
    name: string,
    targetRole?: string
  ) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  loginAsDemoStudent: () => void;
  loginAsDemoAdmin: () => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addXp: (amount: number, reason?: string) => void;
  markRoadmapStepComplete: (stepId: string, xpReward: number) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFirebaseLive: false,
  loginWithEmail: async () => ({ success: false }),
  registerWithEmail: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  loginAsDemoStudent: () => {},
  loginAsDemoAdmin: () => {},
  logout: async () => {},
  updateProfile: () => {},
  addXp: () => {},
  markRoadmapStepComplete: () => {},
  activeRole: "student",
  setActiveRole: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFirebaseLive, setIsFirebaseLive] = useState<boolean>(false);

  // Helper to build a UserProfile from Firebase User + local storage overlay
  const buildProfileFromFirebase = (fbUser: FirebaseUser, extra?: Partial<UserProfile>): UserProfile => {
    const localOverlayKey = `skillsphere_profile_${fbUser.uid}`;
    let overlay: Partial<UserProfile> = {};
    try {
      const stored = localStorage.getItem(localOverlayKey);
      if (stored) overlay = JSON.parse(stored);
    } catch {
      // safe fallback
    }

    return {
      uid: fbUser.uid,
      name: extra?.name || fbUser.displayName || overlay.name || fbUser.email?.split("@")[0] || "Explorer",
      email: fbUser.email || extra?.email || "user@skillsphere.ai",
      role: extra?.role || overlay.role || "student",
      avatarUrl: fbUser.photoURL || overlay.avatarUrl || undefined,
      headline: overlay.headline || "Aspiring AI Specialist",
      bio: overlay.bio || "Building next-generation intelligent systems with SkillSphere AI.",
      targetRole: extra?.targetRole || overlay.targetRole || "Full Stack AI Developer",
      currentSkills: overlay.currentSkills || [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Tailwind CSS",
        "Git",
        "SQL",
        "Python",
      ],
      xp: overlay.xp !== undefined ? overlay.xp : 320,
      level: overlay.level || 1,
      streakDays: overlay.streakDays || 1,
      lastActiveDate: new Date().toISOString(),
      badges: overlay.badges || initialBadges.slice(0, 3),
      completedRoadmapSteps: overlay.completedRoadmapSteps || ["step-1", "step-2"],
      createdAt: overlay.createdAt || new Date().toISOString(),
    };
  };

  const persistUser = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("skillsphere_current_user", JSON.stringify(u));
      localStorage.setItem(`skillsphere_profile_${u.uid}`, JSON.stringify(u));
    } else {
      localStorage.removeItem("skillsphere_current_user");
    }
  };

  // Listen to Firebase auth changes & sync local session
  useEffect(() => {
    const isLive = isFirebaseConfigured();
    setIsFirebaseLive(isLive);

    if (isLive && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const profile = buildProfileFromFirebase(fbUser);
          persistUser(profile);
        } else {
          // If no firebase user, check if we have a demo/local mock user
          const stored = localStorage.getItem("skillsphere_current_user");
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {
              localStorage.removeItem("skillsphere_current_user");
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Local / Offline fallback mode
      const stored = localStorage.getItem("skillsphere_current_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem("skillsphere_current_user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, []);

  const formatFirebaseError = (err: any): string => {
    const code = err?.code || "";
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Invalid email or password. Please verify and try again.";
      case "auth/user-not-found":
        return "No account found with this email. Please sign up first.";
      case "auth/email-already-in-use":
        return "An account already exists with this email address.";
      case "auth/weak-password":
        return "Password is too weak. Please use at least 6 characters.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/popup-closed-by-user":
        return "Google sign-in popup was closed before completing.";
      case "auth/network-request-failed":
        return "Network connection issue. Please check your internet connection.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please wait a moment and try again.";
      default:
        return err?.message || "Authentication failed. Please try again.";
    }
  };

  // 1. Email / Password Login
  const loginWithEmail = async (email: string, pass: string): Promise<AuthResponse> => {
    if (!email || !pass) {
      return { success: false, error: "Please enter both email and password." };
    }

    if (isFirebaseLive && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
        const profile = buildProfileFromFirebase(cred.user);
        persistUser(profile);
        playAudioFeedback("success");
        return { success: true };
      } catch (err: any) {
        playAudioFeedback("click");
        return { success: false, error: formatFirebaseError(err) };
      }
    } else {
      // Local Simulated Fallback
      if (pass.length < 6) {
        return { success: false, error: "Password must be at least 6 characters." };
      }
      const existingUser: UserProfile = {
        ...demoStudentUser,
        uid: "local-user-" + Date.now(),
        email: email.trim(),
        name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      };
      persistUser(existingUser);
      playAudioFeedback("success");
      return { success: true };
    }
  };

  // 2. Email / Password Registration
  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
    targetRole?: string
  ): Promise<AuthResponse> => {
    if (!email || !pass || !name) {
      return { success: false, error: "Please fill in all required fields." };
    }

    if (isFirebaseLive && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
        try {
          await firebaseUpdateProfile(cred.user, { displayName: name.trim() });
        } catch {
          // ignore display name update error if minor
        }
        const profile = buildProfileFromFirebase(cred.user, {
          name: name.trim(),
          targetRole: targetRole || "Full Stack AI Developer",
        });
        persistUser(profile);
        playAudioFeedback("success");
        return { success: true };
      } catch (err: any) {
        playAudioFeedback("click");
        return { success: false, error: formatFirebaseError(err) };
      }
    } else {
      // Local Simulated Fallback
      if (pass.length < 6) {
        return { success: false, error: "Password must be at least 6 characters." };
      }
      const newUser: UserProfile = {
        ...demoStudentUser,
        uid: "local-user-" + Date.now(),
        name: name.trim(),
        email: email.trim(),
        targetRole: targetRole || "Full Stack AI Developer",
      };
      persistUser(newUser);
      playAudioFeedback("success");
      return { success: true };
    }
  };

  // 3. Google Sign In
  const loginWithGoogle = async (): Promise<AuthResponse> => {
    if (isFirebaseLive && auth) {
      try {
        const cred = await signInWithPopup(auth, googleProvider);
        const profile = buildProfileFromFirebase(cred.user);
        persistUser(profile);
        playAudioFeedback("success");
        return { success: true };
      } catch (err: any) {
        playAudioFeedback("click");
        return { success: false, error: formatFirebaseError(err) };
      }
    } else {
      // Local Google Mock
      const googleMockUser: UserProfile = {
        ...demoStudentUser,
        uid: "local-google-" + Date.now(),
        name: "Google Explorer",
        email: "student.google@skillsphere.ai",
        targetRole: "Full Stack AI Developer",
      };
      persistUser(googleMockUser);
      playAudioFeedback("success");
      return {
        success: true,
        message: "Signed in with Google (Local Developer Session)",
      };
    }
  };

  // 4. Reset Password
  const resetPassword = async (email: string): Promise<AuthResponse> => {
    if (!email) return { success: false, error: "Please enter your email address." };

    if (isFirebaseLive && auth) {
      try {
        await sendPasswordResetEmail(auth, email.trim());
        return {
          success: true,
          message: "Password reset link sent! Check your inbox.",
        };
      } catch (err: any) {
        return { success: false, error: formatFirebaseError(err) };
      }
    } else {
      return {
        success: true,
        message: "Password reset link simulated! In local mode, you can log in directly.",
      };
    }
  };

  // 5. Logout
  const logout = async (): Promise<void> => {
    playAudioFeedback("click");
    if (isFirebaseLive && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn("Sign out warning:", e);
      }
    }
    persistUser(null);
  };

  // Demo Login helpers
  const loginAsDemoStudent = () => {
    playAudioFeedback("click");
    persistUser(demoStudentUser);
  };

  const loginAsDemoAdmin = () => {
    playAudioFeedback("click");
    persistUser(demoAdminUser);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    persistUser(updated);
    playAudioFeedback("success");
  };

  const addXp = (amount: number) => {
    if (!user) return;
    const newXp = user.xp + amount;
    const newLevel = Math.floor(newXp / 750) + 1;
    const isLevelUp = newLevel > user.level;

    const updatedUser: UserProfile = {
      ...user,
      xp: newXp,
      level: newLevel,
    };

    persistUser(updatedUser);

    if (isLevelUp) {
      playAudioFeedback("levelUp");
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    } else {
      playAudioFeedback("xp");
    }
  };

  const markRoadmapStepComplete = (stepId: string, xpReward: number) => {
    if (!user) return;
    if (user.completedRoadmapSteps.includes(stepId)) return;

    const completed = [...user.completedRoadmapSteps, stepId];
    const newXp = user.xp + xpReward;
    const newLevel = Math.floor(newXp / 750) + 1;

    const newBadges = [...user.badges];
    if (completed.length >= 5 && !newBadges.some((b) => b.id === "badge-7")) {
      const b7 = initialBadges.find((b) => b.id === "badge-7");
      if (b7) newBadges.push({ ...b7, unlockedAt: new Date().toISOString() });
    }

    const updatedUser: UserProfile = {
      ...user,
      completedRoadmapSteps: completed,
      xp: newXp,
      level: newLevel,
      badges: newBadges,
    };

    persistUser(updatedUser);
    playAudioFeedback("success");

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Safe fallback
    }
  };

  const setActiveRole = (role: UserRole) => {
    if (!user) return;
    updateProfile({ role });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseLive,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        resetPassword,
        loginAsDemoStudent,
        loginAsDemoAdmin,
        logout,
        updateProfile,
        addXp,
        markRoadmapStepComplete,
        activeRole: user?.role || "student",
        setActiveRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
