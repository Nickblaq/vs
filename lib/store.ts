import { Participant, RateHistoryEntry, AuditLogEntry } from "./types";

let nextParticipantId = 4; // 1-3 pre-seeded

export let participants: Participant[] = [
  {
    id: "1",
    fullName: "Adeola Johnson",
    nickname: "DJ Shine",
    avatarUrl: "",
    socialLinks: { instagram: "@djshine" },
    voteCount: 120,
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: "2",
    fullName: "Chiamaka Obi",
    nickname: "The Voice",
    avatarUrl: "",
    socialLinks: { twitter: "@thevoice" },
    voteCount: 85,
    isVisible: true,
    sortOrder: 2,
  },
  {
    id: "3",
    fullName: "Emeka Okafor",
    nickname: "Mr. Groove",
    avatarUrl: "",
    socialLinks: {},
    voteCount: 45,
    isVisible: true,
    sortOrder: 3,
  },
];

export let exchangeRate = 100;

export let rateHistory: RateHistoryEntry[] = [
  { rate: 100, timestamp: new Date().toISOString() },
];

export let auditLogs: AuditLogEntry[] = [];
let logId = 1;

export function getVisibleParticipants(): Participant[] {
  return participants
    .filter((p) => p.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getAllParticipants(): Participant[] {
  return [...participants].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function addParticipant(
  data: Omit<Participant, "id" | "voteCount" | "isVisible" | "sortOrder">
): Participant {
  const newParticipant: Participant = {
    ...data,
    id: String(nextParticipantId++),
    voteCount: 0,
    isVisible: true,
    sortOrder: participants.length + 1,
  };
  participants.push(newParticipant);
  addAuditLog("ADD_PARTICIPANT", `Added ${newParticipant.fullName}`);
  return newParticipant;
}

export function updateParticipant(
  id: string,
  updates: Partial<Participant>
): Participant | null {
  const index = participants.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const old = participants[index];
  participants[index] = { ...old, ...updates };
  addAuditLog("UPDATE_PARTICIPANT", `Updated ${old.fullName}`);
  return participants[index];
}

export function deleteParticipant(id: string): boolean {
  const index = participants.findIndex((p) => p.id === id);
  if (index === -1) return false;
  const removed = participants.splice(index, 1)[0];
  addAuditLog("DELETE_PARTICIPANT", `Deleted ${removed.fullName}`);
  return true;
}

export function setExchangeRate(newRate: number): void {
  exchangeRate = newRate;
  rateHistory.push({ rate: newRate, timestamp: new Date().toISOString() });
  addAuditLog("CHANGE_RATE", `Rate changed to ${newRate} Naira/vote`);
}

export function addVotes(participantId: string, amount: number): {
  success: boolean;
  newVoteCount?: number;
  votesAdded?: number;
} {
  const participant = participants.find((p) => p.id === participantId);
  if (!participant) return { success: false };
  const votes = Math.floor(amount / exchangeRate);
  if (votes <= 0) return { success: false };
  participant.voteCount += votes;
  addAuditLog("VOTE", `${participant.fullName} received ${votes} votes (${amount} Naira)`);
  return { success: true, newVoteCount: participant.voteCount, votesAdded: votes };
}

function addAuditLog(action: string, details: string) {
  auditLogs.push({
    id: String(logId++),
    action,
    details,
    timestamp: new Date().toISOString(),
  });
}

export function getAuditLogs(): AuditLogEntry[] {
  return [...auditLogs].reverse();
}

// Reset function for testing (not used in production)
export function resetStore() {
  nextParticipantId = 4;
  participants = [
    {
      id: "1",
      fullName: "Adeola Johnson",
      nickname: "DJ Shine",
      avatarUrl: "",
      socialLinks: { instagram: "@djshine" },
      voteCount: 120,
      isVisible: true,
      sortOrder: 1,
    },
    {
      id: "2",
      fullName: "Chiamaka Obi",
      nickname: "The Voice",
      avatarUrl: "",
      socialLinks: { twitter: "@thevoice" },
      voteCount: 85,
      isVisible: true,
      sortOrder: 2,
    },
    {
      id: "3",
      fullName: "Emeka Okafor",
      nickname: "Mr. Groove",
      avatarUrl: "",
      socialLinks: {},
      voteCount: 45,
      isVisible: true,
      sortOrder: 3,
    },
  ];
  exchangeRate = 100;
  rateHistory = [{ rate: 100, timestamp: new Date().toISOString() }];
  auditLogs = [];
  logId = 1;
}
