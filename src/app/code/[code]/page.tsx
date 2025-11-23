import { notFound } from "next/navigation";

interface PageProps {
  params: { code: string };
}

async function getLink(code: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/links/${code}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function StatsPage({ params }: PageProps) {
  const { code } = params;
  const link = await getLink(code);

  if (!link) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Link Statistics
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Short Code
              </h2>
              <p className="text-gray-900 font-mono">{link.code}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Short URL
              </h2>
              <p className="text-gray-900 font-mono break-all">
                {process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/
                {link.code}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Original URL
              </h2>
              <p className="text-gray-900 break-all">{link.url}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Total Clicks
              </h2>
              <p className="text-3xl font-bold text-blue-600">{link.clicks}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Created At
              </h2>
              <p className="text-gray-900">
                {new Date(link.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Last Clicked
              </h2>
              <p className="text-gray-900">
                {link.last_clicked_at
                  ? new Date(link.last_clicked_at).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
