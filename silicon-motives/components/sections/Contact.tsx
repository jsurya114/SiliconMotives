import { site } from "@/content/site";
import { RevealText } from "../motion/RevealText";
import { Reveal } from "../motion/Reveal";
import { IdeaForm } from "../site/idea-form";
import { ButtonLink } from "../ui/Button";
import { SectionLabel } from "../ui/SectionLabel";
import { PinIcon, WhatsAppIcon } from "../ui/icons";
import { contactDetails } from "@/lib/urls";
import type { ContentRow } from "@/lib/content";

const { contactSection: c } = site;

export function Contact({ settings }: { settings: ContentRow }) {
  const contact = contactDetails(settings);
  return (
    <section id="contact" data-header="light" aria-labelledby="contact-title" className="section-y bg-lagoon text-monsoon">
      <div className="wrap grid gap-y-16 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionLabel>{c.eyebrow}</SectionLabel>
          </Reveal>
          <RevealText as="h2" id="contact-title" lines={c.title} className="display t-h1 mt-8" />
          <Reveal className="mt-8 max-w-[34rem]">
            <p className="text-[1.25rem] leading-[1.55]">{c.body}</p>
          </Reveal>
          <Reveal className="mt-10">
            <IdeaForm label={c.cta} />
          </Reveal>
        </div>

        <Reveal className="lg:col-span-5 lg:self-end">
          <div className="grain on-dark rounded-[24px] bg-monsoon p-7 text-cloud sm:p-10">
            <p className="label relative z-[2] text-lagoon">{c.hello.eyebrow}</p>
            <h3 className="display t-h3 relative z-[2] mt-5 !text-[clamp(1.875rem,2.8vw,2.75rem)]">{c.hello.title}</h3>
            <p className="relative z-[2] mt-5 text-[1.0625rem] leading-[1.6] text-mist">{c.hello.body}</p>
            <div className="relative z-[2] mt-8">
              <ButtonLink
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="lagoon"
                icon={<WhatsAppIcon size={16} />}
              >
                {c.hello.cta}
              </ButtonLink>
            </div>
            <ul className="relative z-[2] mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-cloud/15 pt-6 font-display text-[0.9375rem] font-medium">
              <li>
                <a className="link-line" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </li>
              <li>
                <a className="link-line" href={contact.phoneHref}>
                  {contact.phone}
                </a>
              </li>
              <li>
                <a className="link-line" href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                  {c.hello.cta}
                </a>
              </li>
            </ul>
            {(contact.linkedin || contact.instagram) && <div className="relative z-[2] mt-5 flex flex-wrap gap-5 font-display text-[0.9375rem]">
              {contact.linkedin && <a className="link-line" href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              {contact.instagram && <a className="link-line" href={contact.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
            </div>}
          </div>
        </Reveal>
      </div>
      <div className="wrap mt-20 lg:mt-28">
        <div className="label flex items-center justify-between border-t border-monsoon/20 pt-5">
          <p>{c.signoff}</p>
          <p className="flex items-center gap-2">
            <PinIcon size={14} />
            {c.place}
          </p>
        </div>
      </div>
    </section>
  );
}
