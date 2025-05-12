"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the shape of our form data
type FormData = {
  role: "student" | "mentor";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dob: { dd: string; mm: string; yyyy: string };
  pronoun: string;
  major: string;
  photo: File | null;
  goals: string;
  bio: string;
  linkedin: string;
};

export default function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [data, setData] = useState<FormData>({
    role: "student",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: { dd: "", mm: "", yyyy: "" },
    pronoun: "",
    major: "",
    photo: null,
    goals: "",
    bio: "",
    linkedin: "",
  });
  const [loading, setLoading] = useState(false);

  // Update field value
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("dob.")) {
      const field = name.split(".")[1] as keyof FormData["dob"];
      setData((d) => ({ ...d, dob: { ...d.dob, [field]: value } }));
    } else {
      setData((d) => ({ ...d, [name]: value }));
    }
  };

  // Handle file input change
  const handleFile = (e: ChangeEvent<HTMLInputElement>) =>
    setData((d) => ({ ...d, photo: e.target.files?.[0] ?? null }));

  // Validate first step fields before moving to step 2
  const onNext = (e: FormEvent) => {
    e.preventDefault();

    // Field-by-field validation with English error messages
    if (!data.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!data.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (!data.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!data.password) {
      toast.error("Password is required");
      return;
    }
    if (!data.confirmPassword) {
      toast.error("Password confirmation is required");
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Move to second step if all validations pass
    setStep(2);
  };

  // Submit form data after validating step 2 fields
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate second-step fields
    if (!data.pronoun) {
      toast.error("Pronoun selection is required");
      return;
    }
    if (!data.major) {
      toast.error("Major selection is required");
      return;
    }
    // Other fields like goals, bio, linkedin are optional

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("role", data.role);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append(
        "dob",
        `${data.dob.yyyy}-${data.dob.mm}-${data.dob.dd}`
      );
      formData.append("pronoun", data.pronoun);
      formData.append("major", data.major);
      if (data.photo) formData.append("photo", data.photo);
      formData.append("goals", data.goals);
      formData.append("bio", data.bio);
      formData.append("linkedin", data.linkedin);

      // Make API call without unused variable
      await axios.post("/api/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Successful signup
      toast.success("Signed up successfully");
      await router.replace("/home"); // Redirect to home
    } catch (error: unknown) {
      // Safe error handling with axios
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Signup failed");
      } else {
        toast.error("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left image panel */}
        <div className="w-1/2 bg-blue-50 flex items-center justify-center p-8">
          <img
            src={
              step === 1
                ? "/assets/images/Sign up-amico 1.png"
                : "/assets/images/Sign up-rafiki 1.png"
            }
            alt="signup"
            width={500}
            height={500}
          />
        </div>

        {/* Right form panel */}
        <div className="w-1/2 flex items-start justify-center p-12">
          <form
            onSubmit={step === 1 ? onNext : onSubmit}
            className="w-full max-w-lg space-y-6"
          >
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-gray-600">
              {step === 1
                ? "Join us today and unlock access..."
                : "Almost done! Tell us a bit more..."}
            </p>

            {/* Step 1 */}
            {step === 1 && (
              <>
                <div className="flex space-x-4">
                  {(["student", "mentor"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setData((d) => ({ ...d, role: r }))}
                      className={`flex-1 py-3 rounded-lg border ${
                        data.role === r ? "bg-white shadow" : "bg-gray-100"
                      }`}
                    >
                     {r === "student" ? "Student" : "Mentor"}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={data.firstName}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-100 rounded-lg"
                  />
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={data.lastName}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-100 rounded-lg"
                  />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={data.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={handleChange}
                    className="w-full p-3	bg-gray-100 rounded-lg"
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-100 rounded-lg"
                  />
                </div>
                <label>Date Of Birth</label>

                <label>Date Of Birth</label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    name="dob.dd"
                    placeholder="DD"
                    value={data.dob.dd}
                    onChange={handleChange}
                    className="p-3 bg-gray-100 rounded-lg"
                  />
                  <input
                    name="dob.mm"
                    placeholder="MM"
                    value={data.dob.mm}
                    onChange={handleChange}
                    className="p-3 bg-gray-100 rounded-lg"
                  />
                  <input
                    name="dob.yyyy"
                    placeholder="YYYY"
                    value={data.dob.yyyy}
                    onChange={handleChange}
                    className="p-3	bg-gray-100 rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg"
                >
                  Next
                </button>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <select
                  name="pronoun"
                  value={data.pronoun}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 rounded-lg"
                >
                  <option value="">Select pronoun…</option>
                  <option value="he">he</option>
                  <option value="she">she</option>
                  <option value="they">they</option>
                </select>
                <select
                  name="major"
                  value={data.major}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 rounded-lg"
                >
                  <option value="">Select major…</option>
                  <option value="software engineering">
                    software engineering
                  </option>
                  <option value="uxui design">uxui design</option>
                  <option value="computer science">computer science</option>
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="w-full p-3 bg-gray-100 rounded-lg"
                />
                <input
                  name="goals"
                  placeholder="Goals"
                  value={data.goals}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 rounded-lg"
                />
                <textarea
                  name="bio"
                  rows={3}
                  placeholder="Bio"
                  value={data.bio}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 rounded-lg"
                />
                <input
                  name="linkedin"
                  placeholder="LinkedIn URL"
                  value={data.linkedin}
                  onChange={handleChange}
                  className="w-full	p-3 bg-gray-100 rounded-lg"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg"
                >
                  {loading ? "…" : "Sign Up"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>

    
    </>
  );
}








