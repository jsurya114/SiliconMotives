import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export const metadata: Metadata = {
  title: "Engineering notes",
  description:
    "Perspectives on thoughtful software engineering and remote collaboration from SiliconMotives.",
  robots: { index: false, follow: true },
};
export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="simple-page">
        <div className="shell">
          <span className="eyebrow">ENGINEERING NOTES / COMING SOON</span>
          <h1>Ideas worth sharing.</h1>
          <p>
            We’re making room for notes on building software, working remotely,
            and the decisions behind thoughtful products.
          </p>
          <a className="button button-primary" href="/">
            Back to SiliconMotives ↗
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
