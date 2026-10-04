"use client";
import CollectionManager from "../components/CollectionManager";
import { faqsConfig } from "../lib/collections";

export default function Page() {
  return <CollectionManager config={faqsConfig} />;
}
