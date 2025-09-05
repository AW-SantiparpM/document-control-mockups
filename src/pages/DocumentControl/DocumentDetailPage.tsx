import React from "react";
import { useParams } from "react-router-dom";
import docs from "../../data/documents.json";
import DocumentPreview from "../../components/DocumentPreview";
import Timeline from "../../components/Timeline";
export default function DocumentDetailPage() {
  const { id } = useParams();
  const doc = (docs as any[]).find((d) => d.id === id);
  if (!doc) return <div>Not found</div>;
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-8">
        <h1 className="text-xl font-semibold">{doc.title}</h1>
        <DocumentPreview watermarkText="CONFIDENTIAL COPY" />
        <section>
          <h2 className="font-medium mb-2">Revision(s)</h2>
          <ul className="text-sm divide-y">
            {doc.versions.map((v: any) => (
              <li key={v.v} className="py-2 flex items-center justify-between">
                <span>
                  R{v.v} • {v.signed ? "Signed" : "Unsigned"} •{" "}
                  {new Date(v.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button className="text-primary-600 hover:underline text-xs">
                    Download
                  </button>
                  <button className="text-xs border rounded px-2 py-0.5">
                    Preview
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white border rounded p-4">
          <h3 className="font-medium mb-2">Metadata</h3>
          <dl className="text-xs space-y-1">
            <div>
              <dt className="font-semibold inline">ID:</dt>{" "}
              <dd className="inline">{doc.id}</dd>
            </div>
            <div>
              <dt className="font-semibold inline">Status:</dt>{" "}
              <dd className="inline">{doc.status}</dd>
            </div>
            <div>
              <dt className="font-semibold inline">Owner:</dt>{" "}
              <dd className="inline">{doc.owner}</dd>
            </div>
            <div>
              <dt className="font-semibold inline">Group:</dt>{" "}
              <dd className="inline">{doc.group}</dd>
            </div>
          </dl>
        </div>
        <div className="bg-white border rounded p-4">
          <h3 className="font-medium mb-2">History</h3>
          <Timeline
            items={doc.history.map((h: any) => ({
              time: h.at,
              label: h.event,
              actor: h.user,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
