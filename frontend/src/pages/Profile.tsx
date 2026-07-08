import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { InvestorProfile } from "../context/AuthContext";
import { User, Sparkles, Check, Edit2, X } from "lucide-react";

export const Profile: React.FC = () => {
  const { user, profile, updateProfileData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<InvestorProfile>(
    profile || {
      fullName: user?.displayName || "",
      age: 25,
      occupation: "Salaried",
      annualIncome: "₹5-10 Lakhs",
      experience: "Beginner",
      goal: "Wealth Creation",
      horizon: "Medium Term (3-7 years)",
      capacity: 10000,
      riskAppetite: "Moderate"
    }
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "age" || name === "capacity" ? Number(value) : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileData(formData);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleCancel = () => {
    if (profile) setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">Investor Profile</h1>
          <p className="text-xs text-zinc-400 mt-1">Configure your financial parameters, goals, and risk profiles.</p>
        </div>
        
        {saveSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            Profile updated successfully
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side Profile Card */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-zinc-500" />
          </div>
          <h2 className="text-base font-semibold text-zinc-100">{profile?.fullName || user?.displayName || "Investor"}</h2>
          <p className="text-xs text-zinc-450 mt-1">{user?.email}</p>
          <div className="mt-4 px-3 py-1 bg-zinc-950 border border-zinc-800/70 rounded-full text-[10px] uppercase tracking-wider font-semibold text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            {profile?.riskAppetite || "Moderate"} Risk
          </div>
        </div>

        {/* Right Side Details / Form */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden">
          
          {/* Header row */}
          <div className="px-6 py-4 border-b border-zinc-800/85 flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Financial Profile</span>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700/80 text-xs font-semibold text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-700/50"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-1.5 border border-zinc-800 hover:bg-zinc-800/40 text-xs font-semibold text-zinc-400 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-zinc-950" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Details body */}
          <form onSubmit={handleSave} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Investor Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  />
                ) : (
                  <span className="text-sm font-medium text-zinc-200">{profile?.fullName || "Not Specified"}</span>
                )}
              </div>

              {/* Age */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Age</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    required
                    min={18}
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  />
                ) : (
                  <span className="text-sm font-medium text-zinc-200">{profile?.age} Years</span>
                )}
              </div>

              {/* Occupation */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Occupation</span>
                {isEditing ? (
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Student">Student</option>
                    <option value="Retired">Retired</option>
                    <option value="Homemaker">Homemaker</option>
                  </select>
                ) : (
                  <span className="text-sm font-medium text-zinc-200">{profile?.occupation}</span>
                )}
              </div>

              {/* Annual Income */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Annual Income</span>
                {isEditing ? (
                  <select
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  >
                    <option value="Under ₹5 Lakhs">Under ₹5 Lakhs</option>
                    <option value="₹5-10 Lakhs">₹5 - 10 Lakhs</option>
                    <option value="₹10-25 Lakhs">₹10 - 25 Lakhs</option>
                    <option value="₹25-50 Lakhs">₹25 - 50 Lakhs</option>
                    <option value="Over ₹50 Lakhs">Over ₹50 Lakhs</option>
                  </select>
                ) : (
                  <span className="text-sm font-medium text-zinc-200">{profile?.annualIncome}</span>
                )}
              </div>

              {/* Goal */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Primary Goal</span>
                {isEditing ? (
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  >
                    <option value="Wealth Creation">Wealth Creation</option>
                    <option value="Passive Income">Passive Income</option>
                    <option value="Emergency Fund">Emergency Fund</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Buying a House">Buying a House</option>
                    <option value="Child Education">Child Education</option>
                  </select>
                ) : (
                  <span className="text-sm font-medium text-zinc-200">{profile?.goal}</span>
                )}
              </div>

              {/* Horizon */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Investment Horizon</span>
                {isEditing ? (
                  <select
                    name="horizon"
                    value={formData.horizon}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  >
                    <option value="Short Term (<3 years)">Short Term (&lt;3 years)</option>
                    <option value="Medium Term (3-7 years)">Medium Term (3-7 years)</option>
                    <option value="Long Term (7+ years)">Long Term (7+ years)</option>
                  </select>
                ) : (
                  <span className="text-sm font-medium text-zinc-200">{profile?.horizon}</span>
                )}
              </div>

              {/* Monthly Capacity */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Monthly Capacity (₹)</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="capacity"
                    required
                    min={100}
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  />
                ) : (
                  <span className="text-sm font-medium text-zinc-200">₹{profile?.capacity.toLocaleString("en-IN")} / Month</span>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Experience Level</span>
                {isEditing ? (
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                ) : (
                  <span className="text-sm font-medium text-zinc-200">{profile?.experience}</span>
                )}
              </div>

              {/* Risk Appetite */}
              <div className="space-y-1.5 md:col-span-2">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-500">Risk Profile</span>
                {isEditing ? (
                  <select
                    name="riskAppetite"
                    value={formData.riskAppetite}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  >
                    <option value="Conservative">Conservative</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                ) : (
                  <span className="text-sm font-medium text-zinc-200">{profile?.riskAppetite}</span>
                )}
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
