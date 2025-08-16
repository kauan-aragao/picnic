export type Ticket = {
  subject: string;
  comment?: {
    body: string;
  };
  comments?: { body: string }[];
};

export const CATEGORIES: { id: string; pt: string; en: string; keywords: string[] }[] = [
  {
    id: "account_access",
    pt: "Acesso à Conta",
    en: "Account Access",
    keywords: [
      "account locked",
      "password",
      "login",
      "2fa",
      "unlock",
      "reset password",
      "kyc",
      "identity verification",
      "security token",
      "wallet access",
      "captcha"
    ]
  },
  {
    id: "returns",
    pt: "Devoluções / Trocas",
    en: "Returns / Exchanges",
    keywords: [
      "return",
      "exchange",
      "rma",
      "refund",
      "reverse transaction",
      "chargeback",
      "swap size",
      "send back"
    ]
  },
  {
    id: "shipping",
    pt: "Envio / Entrega",
    en: "Shipping / Delivery",
    keywords: [
      "shipping",
      "delivery",
      "tracking",
      "delivered",
      "package",
      "courier",
      "delay",
      "no movement",
      "stuck",
      "blockchain pending",
      "network congestion"
    ]
  },
  {
    id: "payment",
    pt: "Pagamento / Cobrança",
    en: "Payment / Billing",
    keywords: [
      "payment",
      "billing",
      "invoice",
      "charge",
      "credit card",
      "pay",
      "credit",
      "crypto deposit",
      "withdrawal",
      "gas fee",
      "transaction fee",
      "fiat onramp",
      "exchange rate",
      "token swap",
      "price",
      "promo code"
    ]
  },
  {
    id: "product_quality",
    pt: "Qualidade do Produto",
    en: "Product Quality",
    keywords: ["defect", "broken", "damaged", "quality", "not working"]
  },
  {
    id: "feature_request",
    pt: "Solicitação de Funcionalidade",
    en: "Feature Request",
    keywords: ["feature", "request", "suggestion", "would like", "add"]
  }
];

const defaultCategory = { id: "other", pt: "Outros", en: "Other" } as const;

export function categorizeTicket(ticket: Ticket): { id: string; pt: string; en: string } {
  const raw = `${ticket.subject} ${ticket.comment?.body ?? ""} ${ticket.comments?.map((c) => c.body).join(" ") ?? ""}`;
  const text = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");

  const matchKeyword = (kw: string): boolean => {
    const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${esc}\\b`, "i");
    return regex.test(text);
  };

  for (const cat of CATEGORIES) {
    if (cat.keywords.some(matchKeyword)) {
      return { id: cat.id, pt: cat.pt, en: cat.en };
    }
  }
  return defaultCategory;
}

export const ALL_CATEGORIES = [
  ...CATEGORIES.map((c) => ({ id: c.id, pt: c.pt, en: c.en })),
  defaultCategory
];
