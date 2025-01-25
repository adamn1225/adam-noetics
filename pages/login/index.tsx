"use client";
import React, { useState } from "react";
import { supabase } from "@lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting to log in...");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Login successful, fetching user profile...");
      // Fetch the user's profile to determine their role
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profileData) {
        throw new Error("No profile data found");
      }

      console.log("Profile data found, redirecting...");
      // Redirect based on user role
      if (profileData.role === "admin") {
        router.push("/admin/clients/admindash");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-5/6 md:w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">
          Client Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-blue-600 hover:underline">
              <Link href="/reset-password">Forgot Password?</Link>
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-300">
              Not a customer?{" "}
              <a
                className="text-sm text-blue-600 hover:underline"
                href="tel:+19548264318"
              >
                Call Us
              </a>
            </p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="onboardbutton flex justify-center w-full text-white font-bold py-3 px-6 rounded-lg"
          >
            {loading ? "Logging in..." : "Log In"}
            <div className="arrow-wrapper">
              <div className="arrow"></div>
            </div>
          </button>
          <p className="text-lg text-center text-blue-600 underline hover:text-blue-600/80">
            <Link href="/">Go back to homepage</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;