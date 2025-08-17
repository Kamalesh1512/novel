"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";

interface TokenInfo {
  provider: string;
  accessToken: string;
  expiresAt: string;
  updatedAt: string;
  status: "valid" | "expiring" | "expired";
  timeLeft: string;
}

export default function OAuthTokenAdminPage() {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [refreshingProvider, setRefreshingProvider] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/oauth-tokens")
      .then((res) => res.json())
      .then(setTokens);
  }, []);

  const handleRefresh = async (provider: string) => {
    setRefreshingProvider(provider);
    const res = await fetch(`/api/admin/oauth-tokens/refresh?provider=${provider}`, {
      method: "POST"
    });
    const updated = await res.json();
    setTokens((prev) =>
      prev.map((t) => (t.provider === provider ? updated : t))
    );
    setRefreshingProvider(null);
  };

  const renderBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-green-500">Valid</Badge>;
      case "expiring":
        return <Badge className="bg-yellow-500 text-black">Expiring Soon</Badge>;
      case "expired":
        return <Badge className="bg-red-500">Expired</Badge>;
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">OAuth Token Manager</h1>

      {tokens.length === 0 ? (
        <p>Loading or no tokens found...</p>
      ) : (
        tokens.map((token) => (
          <Card key={token.provider} className="mb-4">
            <CardContent className="space-y-4 p-6">
              <p>
                <strong>Provider:</strong> {token.provider}
              </p>
              <p>
                <strong>Access Token:</strong> ••••{token.accessToken.slice(-6)}
              </p>
              <p>
                <strong>Expires At:</strong> {format(new Date(token.expiresAt), "PPpp")}
              </p>
              <p>
                <strong>Time Left:</strong> {token.timeLeft}
              </p>
              <p>
                <strong>Status:</strong> {renderBadge(token.status)}
              </p>
              <Button
                onClick={() => handleRefresh(token.provider)}
                disabled={refreshingProvider === token.provider}
              >
                {refreshingProvider === token.provider ? "Refreshing..." : "Refresh Token"}
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
