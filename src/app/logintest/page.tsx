// Buat file test-auth.tsx untuk testing
"use client";

import { useState } from "react";
import { supabase } from "@/supabaseClient"; // adjust path

export default function TestAuth() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("test123456");
  const [result, setResult] = useState("");

  const testSignup = async () => {
    setResult("Testing signup...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      setResult(`Signup: ${error ? `Error: ${error.message}` : "Success!"}`);
    } catch (err) {
      console.error("Signup catch:", err);
      setResult(`Signup catch error: ${err}`);
    }
  };

  const testLogin = async () => {
    setResult("Testing login...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setResult(`Login: ${error ? `Error: ${error.message}` : "Success!"}`);
    } catch (err) {
      console.error("Login catch:", err);
      setResult(`Login catch error: ${err}`);
    }
  };

  const testConnection = async () => {
    setResult("Testing connection...");

    try {
      const { data, error } = await supabase.auth.getSession();
      setResult(
        `Connection: ${error ? `Error: ${error.message}` : "Success!"}`
      );
    } catch (err) {
      console.error("Connection catch:", err);
      setResult(`Connection catch error: ${err}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Supabase Auth Test</h1>

      <div className="space-y-2 mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={testConnection}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Test Connection
        </button>
        <button
          onClick={testSignup}
          className="w-full p-2 bg-green-500 text-white rounded"
        >
          Test Signup
        </button>
        <button
          onClick={testLogin}
          className="w-full p-2 bg-purple-500 text-white rounded"
        >
          Test Login
        </button>
      </div>

      <div className="p-2 bg-gray-100 rounded">
        <strong>Result:</strong>
        <pre className="text-sm mt-2">{result}</pre>
      </div>
    </div>
  );
}
