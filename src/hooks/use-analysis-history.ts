import { useEffect, useState } from "react";
import type { ModelResult, SentimentLabel } from "@/lib/sentiment";
import { consensusLabel } from "@/lib/sentiment";

export interface AnalysisHistoryItem {
  id: string;
  text: string;
  createdAt: string;
  results: ModelResult[];
  consensus: SentimentLabel;
}

const STORAGE_KEY = "sentilytics:history:v1";
const EVENT = "sentilytics:history-changed";

function read(): AnalysisHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnalysisHistoryItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: AnalysisHistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export function useAnalysisHistory() {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>(() => read());

  useEffect(() => {
    const sync = () => setHistory(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = (text: string, results: ModelResult[]) => {
    const item: AnalysisHistoryItem = {
      id: `user_${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      results,
      consensus: consensusLabel(results),
    };
    write([item, ...read()].slice(0, 100));
  };

  const clear = () => write([]);

  const remove = (id: string) => write(read().filter((h) => h.id !== id));

  return { history, add, clear, remove };
}
