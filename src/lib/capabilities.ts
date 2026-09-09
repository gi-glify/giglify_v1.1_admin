export const ADMIN_CAPABILITIES = {
  viewOverview: true,
  viewRequesters: true,
  reviewRequesters: true,
  viewTasks: true,
  publishTasks: true,
  viewSubmissions: true,
  reviewSubmissions: true,
  viewPayments: true,
  reviewPayments: true,
  viewUsers: true,
  manageSupport: true,
  viewAudit: true,
} as const;

export type AdminCapability = keyof typeof ADMIN_CAPABILITIES;

export function hasCapability(isAdmin: boolean | null, capability: AdminCapability): boolean {
  return isAdmin === true && ADMIN_CAPABILITIES[capability];
}
