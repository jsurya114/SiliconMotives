"use client";
import CollectionManager from "../components/CollectionManager";
import { teamConfig } from "../lib/collections";

export default function Page() {
  return <CollectionManager config={teamConfig} />;
}
