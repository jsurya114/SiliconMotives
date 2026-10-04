"use client";
import CollectionManager from "../components/CollectionManager";
import { clientsConfig } from "../lib/collections";

export default function Page() {
  return <CollectionManager config={clientsConfig} />;
}
