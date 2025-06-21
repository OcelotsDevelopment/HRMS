import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox.tsx";
// import Button from "../../../components/ui/button/Button.tsx";
import { useAuthStore } from "../../../store/authStore.ts";
import Loader from "../../../components/common/Loader.tsx";
import { useAuth } from "../../../utils/useAuth.ts";

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Password

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const login = useAuthStore((state) => state.login);
  const { loading, userLoged, error } = useAuthStore((state) => state);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate, userLoged]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      navigate("/");
    }
  }, [navigate, userLoged]);

  // email submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setStep(2);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }

    setPasswordError("");

    if (isChecked) {
      localStorage.setItem("keepLoggedIn", "true");
    } else {
      localStorage.removeItem("keepLoggedIn");
    }

    await login(email, password);
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen px-4 overflow-auto md:items-center md:justify-center bg-amber-50">
      {loading && <Loader />}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="sm:mb-8">
            <img src="/images/logo/logo.png" />
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {step === 1
                ? "Enter your email to get started!"
                : "Enter your password to continue!"}
            </p>
          </div>

          {error && (
            <div className="relative py-3 sm:py-5">
              <span className="p-2 text-red-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                {error}
              </span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <div className="space-y-6">
                {emailError && (
                  <p className="mt-1 text-sm text-red-500">{emailError}</p>
                )}

                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="info@gmail.com"
                    className="bg-white"
                    // required
                  />
                </div>
                <div>
                  {/* <Button
                    size="sm"
                    variant={undefined}
                    className="w-full bg-amber-500 hover:bg-amber-200 text-white"
                  >
                    Next
                  </Button> */}
                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-sm text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-6">
                {passwordError && (
                  <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                )}

                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="bg-white"
                      // required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <img src="../../../icons/eye.svg" />
                      ) : (
                        <img src="../../../icons/eye-close.svg" alt="" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div>
                  {/* <Button className="w-full" size="sm">
                    Sign In
                  </Button> */}

                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-sm text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
