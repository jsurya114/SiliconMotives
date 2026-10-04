"use client";
import CollectionManager from "../components/CollectionManager";
import { testimonialsConfig } from "../lib/collections";

export default function Page() {
  return <CollectionManager config={testimonialsConfig} />;
}
