"use client";

import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "cookie-consent";

interface Consent {
  necessary: true;
  analytics: boolean;
}

function subscribe() {
  // Consent is only ever written by this component, in response to a user
  // action that already triggers a re-render — no external change to listen for.
  return () => {};
}

function getConsentSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY);
}

function getConsentServerSnapshot() {
  return null;
}

export default function CookieConsent() {
  const storedConsent = useSyncExternalStore(subscribe, getConsentSnapshot, getConsentServerSnapshot);
  const [dismissed, setDismissed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  function saveConsent(consent: Consent) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setDismissed(true);
  }

  if (storedConsent !== null || dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Súhlas s cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-4xl px-6 py-6">
        <p className="mb-4 text-sm leading-relaxed text-white/70">
          Používame cookies na zabezpečenie základnej funkčnosti webu a — ak nám to povolíš — na meranie
          návštevnosti. Nevyhnutné cookies sú vždy aktívne.
        </p>

        {showSettings && (
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <label className="flex items-center justify-between gap-4 text-sm text-white/50">
              <span>Nevyhnutné cookies (vždy aktívne)</span>
              <input type="checkbox" checked disabled className="h-4 w-4 accent-[#ff6b35]" />
            </label>
            <label className="flex items-center justify-between gap-4 text-sm text-white/70">
              <span>Analytické cookies</span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="h-4 w-4 accent-[#ff6b35]"
              />
            </label>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => saveConsent({ necessary: true, analytics: true })}
            className="rounded-full bg-[#ff6b35] px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#ff8c5c]"
          >
            Prijať všetko
          </button>
          <button
            type="button"
            onClick={() => saveConsent({ necessary: true, analytics: false })}
            className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30"
          >
            Odmietnuť voliteľné
          </button>
          {showSettings ? (
            <button
              type="button"
              onClick={() => saveConsent({ necessary: true, analytics })}
              className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30"
            >
              Uložiť výber
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30"
            >
              Nastavenia
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
