"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeading, TypographyP } from "@/components/Typography";
import { LoadingContent } from "@/components/LoadingContent";
import type { DraftLogsResponse } from "@/app/api/user/draft-logs/route";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatShortDate } from "@/utils/date";
import { getGmailUrl } from "@/utils/url";

export default function DebugDraftsPage() {
  const { data, isLoading, error } = useSWR<DraftLogsResponse>(
    "/api/user/draft-logs",
  );

  const session = useSession();
  const userEmail = session.data?.user?.email || "";

  return (
    <div className="container mx-auto py-6">
      <PageHeading className="mb-6">Drafts</PageHeading>

      <LoadingContent loading={isLoading} error={error}>
        {data?.draftLogs.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <TypographyP>No drafts found yet.</TypographyP>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Similarity Score</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
                {data?.draftLogs?.map((draftLog) => (
                  <TableRow key={draftLog.id}>
                    <TableCell>
                      <Link
                        href={getGmailUrl(draftLog.sentMessageId, userEmail)}
                        target="_blank"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Link
                      </Link>
                    </TableCell>
                    <TableCell>
                      <TypographyP>
                        {draftLog.executedAction.content}
                      </TypographyP>
                    </TableCell>
                    <TableCell>{draftLog.similarityScore.toFixed(2)}</TableCell>
                    <TableCell>
                      {formatShortDate(new Date(draftLog.createdAt))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableHeader>
            </Table>
          </Card>
        )}
      </LoadingContent>
    </div>
  );
}
