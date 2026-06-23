import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";

export default function NotFoundPage() {
  return (
    <>
      <Seo title="NotFound" />
      <Container className="py-12">
        <h1 className="text-2xl font-bold text-ink dark:text-cream">NotFound</h1>
        <p className="text-ink-light mt-2">Bu sahifa tez orada tayyorlanadi...</p>
      </Container>
    </>
  );
}
