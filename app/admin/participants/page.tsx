"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { Participant } from "@/lib/types";

export default function AdminParticipantsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newName, setNewName] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Participant>>({});

  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchParticipants();
  }, [token]);

  const fetchParticipants = async () => {
    const res = await fetch("/api/admin/participants", {
      headers: { "x-admin-token": token! },
    });
    const data = await res.json();
    setParticipants(data);
  };

  const addParticipant = async () => {
    if (!newName || !newNickname) return;
    await fetch("/api/admin/participants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token!,
      },
      body: JSON.stringify({ fullName: newName, nickname: newNickname }),
    });
    setNewName("");
    setNewNickname("");
    fetchParticipants();
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await fetch(`/api/admin/participants/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token!,
      },
      body: JSON.stringify({ isVisible: !current }),
    });
    fetchParticipants();
  };

  const deleteParticipant = async (id: string) => {
    if (!confirm("Delete this participant?")) return;
    await fetch(`/api/admin/participants/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": token! },
    });
    fetchParticipants();
  };

  const startEditing = (p: Participant) => {
    setEditingId(p.id);
    setEditData({ fullName: p.fullName, nickname: p.nickname, sortOrder: p.sortOrder });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await fetch(`/api/admin/participants/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token!,
      },
      body: JSON.stringify(editData),
    });
    setEditingId(null);
    fetchParticipants();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Participants</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Add New</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            placeholder="Full Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border rounded px-3 py-2 flex-1 min-w-[150px]"
          />
          <input
            placeholder="Nickname"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            className="border rounded px-3 py-2 flex-1 min-w-[150px]"
          />
          <button
            onClick={addParticipant}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {participants.map((p) => (
          <div key={p.id} className="bg-white rounded shadow p-4">
            {editingId === p.id ? (
              <div className="space-y-2">
                <input
                  value={editData.fullName || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, fullName: e.target.value })
                  }
                  className="border rounded px-3 py-1 w-full"
                  placeholder="Full name"
                />
                <input
                  value={editData.nickname || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, nickname: e.target.value })
                  }
                  className="border rounded px-3 py-1 w-full"
                  placeholder="Nickname"
                />
                <input
                  type="number"
                  value={editData.sortOrder || 0}
                  onChange={(e) =>
                    setEditData({ ...editData, sortOrder: Number(e.target.value) })
                  }
                  className="border rounded px-3 py-1 w-full"
                  placeholder="Sort order"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 border rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold">{p.nickname}</p>
                  <p className="text-sm text-gray-500">{p.fullName}</p>
                  <p className="text-xs text-gray-400">
                    Votes: {p.voteCount} | Order: {p.sortOrder}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleVisibility(p.id, p.isVisible)}
                    className={`px-3 py-1 rounded text-sm ${
                      p.isVisible
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.isVisible ? "Visible" : "Hidden"}
                  </button>
                  <button
                    onClick={() => startEditing(p)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteParticipant(p.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
