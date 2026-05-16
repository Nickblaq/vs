"use client";

import { useState } from "react";

interface VoteModalProps {
  participant: { id: string; fullName: string; nickname: string };
  rate: number;
  onClose: () => void;
  onVoteSuccess: (participantId: string, newVoteCount: number) => void;
}

export default function VoteModal({ participant, rate, onClose, onVoteSuccess }: VoteModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const votes = amount > 0 ? Math.floor(amount / rate) : 0;

  const handleSubmit = async () => {
    if (amount <= 0 || votes <= 0) {
      setError("Amount too low for at least 1 vote");
      return;
    }
    setLoading(true);
    setError("");

    // Simulate payment delay (1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: participant.id, amount }),
      });
      const data = await res.json();
      if (data.success) {
        onVoteSuccess(participant.id, data.newVoteCount);
        onClose();
      } else {
        setError(data.message || "Vote failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold mb-2">
          Vote for {participant.nickname}
        </h2>
        <p className="text-gray-600 mb-4">
          Rate: {rate} Naira = 1 vote
        </p>

        <label className="block text-sm font-medium mb-1">
          Amount (Naira)
        </label>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Enter amount"
        />
        {votes > 0 && (
          <p className="text-sm text-green-600 mb-3">
            You will receive <strong>{votes} vote{votes > 1 ? "s" : ""}</strong>.
          </p>
        )}
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || amount <= 0}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay (Mock)"}
          </button>
        </div>
      </div>
    </div>
  );
}
