export type CampaignTemplate = { id: string; label: string; description: string; subject: string; message: string };

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: "launch-offer",
    label: "Launch offer announcement",
    description: "Announce the limited one-time package offer to eligible users.",
    subject: "Limited launch offers: Pro $5, Elite $7, Max $15",
    message: "Giglify is welcoming more workers with a limited one-time launch offer.\n\nUpgrade to Pro for $5, Elite for $7, or Max for $15 while this offer is available. Each package unlocks more task access and earning opportunities.\n\nSign in to your Giglify account to choose your package. This offer is limited and may end without notice.\n\nYou can unsubscribe from marketing emails at any time using the link in the email footer.",
  },
  {
    id: "general",
    label: "General announcement",
    description: "A reusable, branded update for the full confirmed audience.",
    subject: "An update from Giglify",
    message: "We have an important update from the Giglify team.\n\nSign in to your account to see what is new and continue making the most of your Giglify access.\n\nYou can unsubscribe from marketing emails at any time using the link in the email footer.",
  },
  { id: "custom", label: "Custom campaign", description: "Start with a blank campaign and write your own announcement.", subject: "", message: "" },
];

export function getCampaignTemplate(id: string): CampaignTemplate {
  return CAMPAIGN_TEMPLATES.find((template) => template.id === id) ?? CAMPAIGN_TEMPLATES[0];
}
