import { Metadata } from "next";
import Link from "next/link";
import { getPublicStatusPage } from "@/lib/api/status-pages";
import { StatusRefresh } from "@/components/status/status-refresh";
import { StatusHeader } from "@/components/status/status-header";
import { MonitorList } from "@/components/status/monitor-list";
import { IncidentTimeline } from "@/components/status/incident-timeline";
import { SubscribeForm } from "@/components/status/subscribe-form";
import { ApiError } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await getPublicStatusPage(slug);
    return {
      title: `${data.title} Status`,
      description: `Check the live status of ${data.workspace_name} services.`,
      openGraph: {
        title: `${data.title} Status`,
        description: `Check the live status of ${data.workspace_name} services.`,
        images: ["/status-og-placeholder.png"], // Placeholder
      },
    };
  } catch {
    return {
      title: "Status Page",
    };
  }
}

export default async function PublicStatusPage({ params }: Props) {
  const { slug } = await params;

  let data;

  try {
    data = await getPublicStatusPage(slug);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Status page not found</h1>
          <p className="text-slate-600 mb-8">The status page you are looking for doesn&apos;t exist or has been moved.</p>
          <Link href="/" className="text-indigo-600 font-semibold hover:text-indigo-700">Go back home &rarr;</Link>
        </div>
      );
    }
    throw error;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <StatusRefresh>
        <div className="space-y-12">
          <StatusHeader
            title={data.title}
            workspaceLogo={data.workspace_logo}
            overallStatus={data.overall_status}
            lastChecked={data.last_checked}
            workspaceName={data.workspace_name}
          />

          <MonitorList monitors={data.monitors} />

          <IncidentTimeline
            activeIncidents={data.active_incidents}
            pastIncidents={data.past_incidents}
          />

          <SubscribeForm slug={slug} />
        </div>
      </StatusRefresh>
    </div>
  );
}
