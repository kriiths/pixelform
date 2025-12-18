"use client";

import { useState, useTransition } from 'react';
import { texts } from '../content/texts';

interface Props {
  onSuccess?: () => void;
}

export default function AdminAuthForm({ onSuccess }: Props) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      setMessage('');

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      setMessage(result.message || (response.ok ? texts.admin.auth.success : texts.admin.auth.error));

      if (response.ok) {
        setPassword('');
        onSuccess?.();
        window.location.reload();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-light rounded-xl p-6 shadow-sm max-w-xl">
      <h2 className="text-xl font-semibold text-neutral-900 mb-2">{texts.admin.auth.heading}</h2>
      <p className="text-neutral-700 mb-4">{texts.admin.locked}</p>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">{texts.admin.fields.password}</span>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border border-neutral-300 rounded px-3 py-2"
          required
        />
      </label>

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="submit"
          className="w-full md:w-auto bg-black text-white px-4 py-2 rounded hover:bg-neutral-800 transition disabled:opacity-60"
          disabled={isPending}
        >
          {isPending ? texts.admin.auth.submitting : texts.admin.auth.submit}
        </button>
        {message && <p className="text-sm text-neutral-700">{message}</p>}
      </div>
    </form>
  );
}
