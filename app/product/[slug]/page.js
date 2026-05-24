import { products } from "../../lib/products";
import { notFound } from "next/navigation";
import ZoomImage from "./ZoomImage";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  return {
    title: product ? `${product.name} — Counterfeitends` : "Not Found",
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <div className="page">
      <header>
        <div className="header-inner">
          <nav>
            <a href="/">Index</a>
          </nav>
          <div className="brand">counterfeitends</div>
          <div className="header-spacer" />
        </div>
      </header>

      <main>
        <div className="shell">
          <div className="product-detail">
            <ZoomImage src={product.image} alt={product.name} />
            <div className="product-detail-info">
              <div className="product-detail-name">{product.name}</div>
              <div className="product-detail-price">{product.price}</div>
              {product.stripeLink && (
                <a
                  href={product.stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="buy-button"
                >
                  buy now
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-inner">
          <div className="footer-left">© Counterfeitends Studio</div>
          <a
            href="https://www.instagram.com/counterfeitends"
            className="footer-right"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}
