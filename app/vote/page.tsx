"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import VoteModal from "@/components/VoteModal";
import type { Participant } from "@/lib/types";

export default function VotePage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [rate, setRate] = useState<number>(100);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchParticipants = async () => {
    const res = await fetch("/api/participants");
    const data = await res.json();
    setParticipants(data);
  };

  const fetchRate = async () => {
    const res = await fetch("/api/rate");
    const data = await res.json();
    setRate(data.rate);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchParticipants(), fetchRate()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const handleVoteSuccess = (participantId: string, newVoteCount: number) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId ? { ...p, voteCount: newVoteCount } : p
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        🎤 Live Voting
      </h1>
      <p className="text-center text-gray-500 mb-8">
        1 vote = {rate} Naira
      </p>
      {participants.length === 0 ? (
        <p className="text-center text-gray-400">No participants yet.</p>
      ) : (
        <div className="space-y-4">
          {participants.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow p-4 flex items-center gap-4"
            >
              <Avatar name={p.nickname} />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{p.nickname}</h2>
                <p className="text-sm text-gray-500">{p.fullName}</p>
                <div className="flex gap-2 mt-1 text-sm">
                  {p.socialLinks.instagram && (
                    <span>📷 {p.socialLinks.instagram}</span>
                  )}
                  {p.socialLinks.twitter && (
                    <span>🐦 {p.socialLinks.twitter}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{p.voteCount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">votes</p>
                <button
                  onClick={() => setSelectedParticipant(p)}
                  className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedParticipant && (
        <VoteModal
          participant={selectedParticipant}
          rate={rate}
          onClose={() => setSelectedParticipant(null)}
          onVoteSuccess={handleVoteSuccess}
        />
      )}
    </main>
  );
}
