import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { InvestorProfile } from "../context/AuthContext";
import { TrendingUp, ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";

export const Onboarding: React.FC = () => {
  const { user, submitOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<InvestorProfile>({
    fullName: user?.displayName || "",
    age: 25,
    occupation: "Salaried",
    annualIncome: "₹5-10 Lakhs",
    experience: "Beginner",
    goal: "Wealth Creation",
    horizon: "Medium Term (3-7 years)",
    capacity: 10000,
    riskAppetite: "Moderate"
  });

  const [isCustomIncome, setIsCustomIncome] = useState(false);
  const [customIncomeVal, setCustomIncomeVal] = useState("");
  const [showCustomCapacity, setShowCustomCapacity] = useState(false);
  const [customCapacityVal, setCustomCapacityVal] = useState("");

  // Track draft load state
  React.useEffect(() => {
    if (user) {
      const draft = localStorage.getItem(`nidhi_onboarding_draft_${user.uid}`);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setFormData(parsed);
          
          // Set custom states if needed
          const stdIncomes = ["Under ₹5 Lakhs", "₹5-10 Lakhs", "₹10-25 Lakhs", "₹25-50 Lakhs", "Over ₹50 Lakhs"];
          if (parsed.annualIncome && !stdIncomes.includes(parsed.annualIncome)) {
            setIsCustomIncome(true);
            setCustomIncomeVal(parsed.annualIncome.replace(/[^0-9]/g, ""));
          }
          if (parsed.capacity && ![5000, 10000, 20000].includes(parsed.capacity)) {
            setCustomCapacityVal(parsed.capacity.toString());
            setShowCustomCapacity(true);
          }
        } catch (e) {
          console.error("Failed to parse onboarding draft", e);
        }
      }
    }
  }, [user]);

  const saveDraft = (updatedData: InvestorProfile) => {
    if (user) {
      localStorage.setItem(`nidhi_onboarding_draft_${user.uid}`, JSON.stringify(updatedData));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: name === "age" || name === "capacity" ? Number(value) : value
      };
      saveDraft(updated);
      return updated;
    });
  };

  const handleGoalSelect = (goalName: string) => {
    setFormData(prev => {
      const updated = { ...prev, goal: goalName };
      saveDraft(updated);
      return updated;
    });
  };

  const handleRiskSelect = (riskName: string) => {
    setFormData(prev => {
      const updated = { ...prev, riskAppetite: riskName };
      saveDraft(updated);
      return updated;
    });
  };

  const nextStep = () => {
    if (step < 3) setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }
    setLoading(true);
    try {
      await submitOnboarding(formData);
      // Clean up onboarding draft
      if (user) {
        localStorage.removeItem(`nidhi_onboarding_draft_${user.uid}`);
      }
      navigate("/");
    } catch (error) {
      console.error("Failed to submit onboarding profile", error);
    } finally {
      setLoading(false);
    }
  };

  const goalsList = [
    { name: "Wealth Creation", desc: "Long term capital appreciation" },
    { name: "Passive Income", desc: "Regular cashflows and dividends" },
    { name: "Emergency Fund", desc: "Highly liquid, low-risk safety net" },
    { name: "Retirement", desc: "Securing capital for after retirement" },
    { name: "Buying a House", desc: "Accumulating down payments" },
    { name: "Child Education", desc: "Funding future educational needs" }
  ];

  const riskAppetites = [
    {
      name: "Conservative",
      desc: "Capital preservation is priority. Prefers Bonds and Government Securities with lower volatility."
    },
    {
      name: "Moderate",
      desc: "Balanced mix of growth and safety. Accepts some volatility for mutual funds, index ETFs, and REITs."
    },
    {
      name: "Aggressive",
      desc: "Prioritizes maximum returns. Comfortable with high equity allocations, sector funds, and alternative assets."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 py-12">
      {/* Container wrapper */}
      <div className="w-full max-w-xl">

        {/* Logo header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-9 h-9 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 mb-2">
            <TrendingUp className="w-4.5 h-4.5 text-indigo-500" />
          </div>
          <h2 className="text-lg font-semibold tracking-wider text-zinc-100">Setup Your Profile</h2>
          <p className="text-xs text-zinc-400 mt-1">Help NIDHI construct your suitability analysis</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8 px-1">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">
            <span>Step {step} of 3</span>
            <span>{step === 1 ? "Personal Details" : step === 2 ? "Goals & Capital" : "Risk Profile"}</span>
          </div>
          <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Main card form */}
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800/80 p-8 rounded-xl shadow-xl space-y-6">

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Investor Name"
                  className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2.5 px-3.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    required
                    min={18}
                    max={100}
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2.5 px-3.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                    Occupation
                  </label>
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2.5 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Student">Student</option>
                    <option value="Retired">Retired</option>
                    <option value="Homemaker">Homemaker</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                    Annual Income Range
                  </label>
                  <select
                    name="annualIncome"
                    value={isCustomIncome ? "Custom" : formData.annualIncome}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "Custom") {
                        setIsCustomIncome(true);
                      } else {
                        setIsCustomIncome(false);
                        setFormData(prev => {
                          const updated = { ...prev, annualIncome: val };
                          saveDraft(updated);
                          return updated;
                        });
                      }
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2.5 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  >
                    <option value="Under ₹5 Lakhs">Under ₹5 Lakhs</option>
                    <option value="₹5-10 Lakhs">₹5 - 10 Lakhs</option>
                    <option value="₹10-25 Lakhs">₹10 - 25 Lakhs</option>
                    <option value="₹25-50 Lakhs">₹25 - 50 Lakhs</option>
                    <option value="Over ₹50 Lakhs">Over ₹50 Lakhs</option>
                    <option value="Custom">Custom Amount...</option>
                  </select>
                </div>

                {isCustomIncome && (
                  <div className="animate-fade-in">
                    <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                      Exact Annual Income (₹)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1250000"
                      value={customIncomeVal}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomIncomeVal(val);
                        const rawNum = Number(val);
                        let formatted = `₹${rawNum.toLocaleString("en-IN")}`;
                        if (rawNum >= 100000) {
                          formatted = `₹${(rawNum / 100000).toFixed(1)} Lakhs`;
                        }
                        setFormData(prev => {
                          const updated = { ...prev, annualIncome: formatted };
                          saveDraft(updated);
                          return updated;
                        });
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2.5 px-3.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-2">
                  Select Investment Goal
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {goalsList.map(goal => (
                    <button
                      key={goal.name}
                      type="button"
                      onClick={() => handleGoalSelect(goal.name)}
                      className={`text-left p-3.5 rounded-lg border text-xs transition-colors cursor-pointer ${formData.goal === goal.name
                          ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                          : "bg-zinc-950/60 border-zinc-800/70 text-zinc-400 hover:border-zinc-700 hover:text-zinc-250"
                        }`}
                    >
                      <p className="font-semibold">{goal.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{goal.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                    Monthly Saving Capacity (₹)
                  </label>
                  <div className="flex gap-2 mb-3">
                    {[5000, 10000, 20000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setShowCustomCapacity(false);
                          setFormData(prev => {
                            const updated = { ...prev, capacity: preset };
                            saveDraft(updated);
                            return updated;
                          });
                        }}
                        className={`flex-1 py-2 px-3 border rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                          !showCustomCapacity && formData.capacity === preset
                            ? "bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold"
                            : "bg-zinc-950/60 border-zinc-800/70 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        ₹{preset.toLocaleString("en-IN")}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomCapacity(true);
                      }}
                      className={`flex-1 py-2 px-3 border rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        showCustomCapacity
                          ? "bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold"
                          : "bg-zinc-950/60 border-zinc-800/70 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {showCustomCapacity && (
                    <div className="animate-fade-in">
                      <input
                        type="number"
                        required
                        min={100}
                        step={500}
                        placeholder="Enter custom monthly savings capacity"
                        value={customCapacityVal}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomCapacityVal(val);
                          setFormData(prev => {
                            const updated = { ...prev, capacity: Number(val) };
                            saveDraft(updated);
                            return updated;
                          });
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2.5 px-3.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                    Investment Horizon
                  </label>
                  <select
                    name="horizon"
                    value={formData.horizon}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2.5 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  >
                    <option value="Short Term (<3 years)">Short Term (&lt;3 years)</option>
                    <option value="Medium Term (3-7 years)">Medium Term (3-7 years)</option>
                    <option value="Long Term (7+ years)">Long Term (7+ years)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  Investment Experience
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2.5 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                >
                  <option value="Beginner">Beginner (No past investments)</option>
                  <option value="Intermediate">Intermediate (Mutual Funds, ETFs, Stocks)</option>
                  <option value="Expert">Expert (Options, Bonds, Alternative Assets)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-2.5">
                  Assess Your Risk Appetite
                </label>
                <div className="space-y-2.5">
                  {riskAppetites.map(risk => (
                    <button
                      key={risk.name}
                      type="button"
                      onClick={() => handleRiskSelect(risk.name)}
                      className={`text-left p-3.5 w-full rounded-lg border text-xs transition-colors flex flex-col gap-1 cursor-pointer ${formData.riskAppetite === risk.name
                          ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                          : "bg-zinc-950/60 border-zinc-800/70 text-zinc-400 hover:border-zinc-750 hover:text-zinc-250"
                        }`}
                    >
                      <span className="font-semibold flex items-center gap-1.5">
                        {risk.name}
                        {risk.name === "Moderate" && (
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                      </span>
                      <span className="text-[10px] leading-relaxed text-zinc-550">{risk.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-zinc-800/85">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 px-4 py-2 border border-zinc-800 hover:bg-zinc-800/40 text-xs font-semibold text-zinc-300 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950" />
                  Saving Profile...
                </>
              ) : step === 3 ? (
                "Finish Setup"
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
