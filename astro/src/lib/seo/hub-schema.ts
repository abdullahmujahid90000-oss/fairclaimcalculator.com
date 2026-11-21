import { TOPIC_CLUSTERS } from "./topic-clusters";

const ORIGIN = "https://www.fairclaimcalculator.com";

/** CollectionPage + ItemList for a cluster hub, built from the same map the hub renders. */
export function clusterHubSchema(clusterId: string, name: string, description: string, path: string) {
  const cluster = TOPIC_CLUSTERS.find((c) => c.id === clusterId);
  if (!cluster) throw new Error(`Unknown cluster ${clusterId}`);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${ORIGIN}${path}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: cluster.pages.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.label,
        url: `${ORIGIN}${p.href}`,
      })),
    },
  };
}
