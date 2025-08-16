/* eslint-disable */
// @ts-nocheck
import { Ticket } from "./categorize";

export const PRIORITY_WEIGHTS = {
  recurrentRequester: 1, 
  daysOld: 0.3, 
  noAgentResponse: 2, 
  perAgentResponse: -2, 
  urgentCategory: 3, 
  urgentKeyword: 10, 
} as const;


export const URGENT_CATEGORY_IDS = [
  "payment", 
  "account_access", 
  "shipping", 
] as const;

export type PriorityLevel = "critical" | "high" | "medium" | "low";

export interface Priority {
  score: number;
  level: PriorityLevel;
}


export function priorityLevelFromScore(score: number): PriorityLevel {
  if (score >= 18) return "critical";
  if (score >= 10) return "high";
  if (score >= 5) return "medium";
  return "low";
}

function agentResponseCount(ticket: Ticket): number {
  if (ticket.comments) return ticket.comments.filter((c: any) => c.author?.role === "agent").length;
  return 0;
}

export function priorityScore(ticket: Ticket, allTickets: Ticket[]): Priority {
  let score = 0;

  const requesterCount = allTickets.filter((t) => t.requester.email === ticket.requester.email).length;
  if (requesterCount > 1) score += (requesterCount - 1) * PRIORITY_WEIGHTS.recurrentRequester;

  const daysOld = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / (1000 * 60 * 60 * 24));
  score += daysOld * PRIORITY_WEIGHTS.daysOld;

  const agentCount = agentResponseCount(ticket);
  if (agentCount === 0) {
    score += PRIORITY_WEIGHTS.noAgentResponse;
  } else {
    score += agentCount * PRIORITY_WEIGHTS.perAgentResponse; 
  }

  const catId = (ticket.category ?? { id: "" }).id;
  if (URGENT_CATEGORY_IDS.includes(catId as any)) score += PRIORITY_WEIGHTS.urgentCategory;

  const urgentRegex = /(urgent|asap|immediately|priority|critical|failed)/i;
  const text = `${ticket.subject} ${(ticket.comment?.body ?? "")} ${(ticket.comments?.map((c) => c.body).join(" ") ?? "")}`;
  if (urgentRegex.test(text)) score += PRIORITY_WEIGHTS.urgentKeyword;

  return { score, level: priorityLevelFromScore(score) };
}
