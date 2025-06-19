import { getMarkers } from "@/lib/server/getMarkers"
import { getAdminReports } from "@/lib/server/getAdminReports"

export type ReportData = Awaited<ReturnType<typeof getMarkers> | ReturnType<typeof getAdminReports>>