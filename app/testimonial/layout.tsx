import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Testimonial | SiliconMotives",
  description: "Share your experience working with SiliconMotives.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestimonialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
