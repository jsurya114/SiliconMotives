"use client";
import CollectionManager from "../components/CollectionManager";
import { caseStudiesConfig } from "../lib/collections";

export default function Page() {
  return <CollectionManager config={caseStudiesConfig} />;
}
