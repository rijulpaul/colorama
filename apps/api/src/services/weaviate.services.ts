import { env } from "@repo/env-config";

const VECTOR_SERVICE_URL = env.VECTOR_SERVICE_URL ?? "http://localhost:8100";

export type SearchResult = {
  uuid: string;
  properties: Record<string, unknown>;
  distance?: number | null;
  score?: number | null;
};

export type SearchResponse = {
  results: SearchResult[];
};

export type EmbedResponse = {
  embeddings: number[][];
  model: string;
  dimensions: number;
};

export type UpsertResponse = {
  uuid: string;
};

async function vectorFetch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${VECTOR_SERVICE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Vector service error (${response.status}): ${detail}`);
  }

  return response.json() as Promise<T>;
}

export async function embedTexts(texts: string[]): Promise<EmbedResponse> {
  return vectorFetch<EmbedResponse>("/embed", { texts });
}

export async function searchSimilar(
  query: string,
  limit = 5,
  alpha = 0.5,
): Promise<SearchResponse> {
  return vectorFetch<SearchResponse>("/search", { query, limit, alpha });
}

export async function upsertObject(
  text: string,
  properties: Record<string, unknown> = {},
): Promise<UpsertResponse> {
  return vectorFetch<UpsertResponse>("/objects", { text, properties });
}

export async function getEmbedding(text: string) {
  const { results } = await searchSimilar(text, 5);
  return results;
}
