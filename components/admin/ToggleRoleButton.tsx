"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  userId: string;
  currentRole: string;
}

export default function ToggleRoleButton({ userId, currentRole }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/users/${userId}`, { method: "PATCH" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={currentRole === "ADMIN" ? "destructive" : "outline"}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : currentRole === "ADMIN" ? (
        "Quitar admin"
      ) : (
        "Hacer admin"
      )}
    </Button>
  );
}
