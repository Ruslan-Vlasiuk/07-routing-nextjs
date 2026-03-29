import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api/notes";
import NotesClient from "./Notes.client";
import type { NoteTag } from "../../../../types/note";

interface FilterPageProps {
  params: Promise<{ tag?: string[] }>;
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { tag } = await params;
  const tagValue = tag?.[0];
  const activeTag = tagValue === "all" ? undefined : (tagValue as NoteTag | undefined);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", activeTag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag: activeTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient activeTag={activeTag} />
    </HydrationBoundary>
  );
}
