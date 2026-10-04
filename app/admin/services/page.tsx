"use client";
import CollectionManager from "../components/CollectionManager";
import { servicesConfig } from "../lib/collections";

export default function Page() {
  return <CollectionManager config={servicesConfig} />;
}
