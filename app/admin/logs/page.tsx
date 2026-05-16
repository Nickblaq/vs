"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { AuditLogEntry } from "@/lib/types";

export default function AdminLogsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchLogs();
  }, [token]);

  const fetchLogs = async () => {
    const res = await fetch("/api/admin/logs", {
      headers: { "x-admin-token": token! },
    });
    const data = await res.json();
    setLogs(data);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="bg-white p-3 rounded shadow text-sm">
            <span className="font-mono text-xs text-gray-500">
              {new Date(log.timestamp).toLocaleString()}
            </span>{" "}
            <strong className="uppercase text-xs">{log.action}</strong> – {log.details}
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-gray-400 text-sm">No activity yet.</p>
        )}
      </div>
    </div>
  );
}
