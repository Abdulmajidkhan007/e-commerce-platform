import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";

export default function ContactPage() {
  return (
    <>
      <Seo title="Contact" />
      <Container className="py-12">
        <h1 className="text-2xl font-bold text-ink dark:text-cream">Contact</h1>
        <p className="text-ink-light mt-2">Bu sahifa tez orada tayyorlanadi...</p>
      </Container>
    </>
  );
}
