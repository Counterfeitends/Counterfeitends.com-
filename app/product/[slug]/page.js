import { products } from "../../lib/products";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "./ProductGallery";
import ProductPhotoStories from "./ProductPhotoStories";
import ZoomImage from "./ZoomImage";
import { productPhotoGroups } from "../../lib/product-shoot";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  return {
    title: product ? `${product.name} — Counterfeitends` : "Not Found",
    description: product?.description,
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
            <Link href="/">Index</Link>
          </nav>
          <div className="brand">counterfeitends</div>
          <div className="header-spacer" />
        </div>
      </header>

      <main>
        <div className="shell">
          <div className="listing-context">
            <Link href="/">Index</Link>
            <span aria-hidden="true">/</span>
            <span>Marketplace listing</span>
          </div>
          <div className="product-detail">
            {product.gallery ? (
              <ProductGallery images={product.gallery} name={product.name} />
            ) : (
              <ZoomImage src={product.image} alt={product.name} />
            )}
            <aside className={`product-detail-info${product.featured ? " product-detail-featured-info" : ""}`}>
              {product.featured && (
                <div className="listing-seller">
                  <span className="listing-seller-avatar" aria-hidden="true">CE</span>
                  <span className="listing-seller-name">
                    <span>Seller</span>
                    <strong>counterfeitends</strong>
                  </span>
                </div>
              )}
              {product.featured && product.availability && (
                <p className="listing-availability">
                  <span aria-hidden="true" />
                  {product.availability}
                </p>
              )}
              <h1 className="product-detail-name">{product.name}</h1>
              <div className="product-detail-price">{product.price}</div>
              {product.description && !product.featured && <p className="product-detail-description">{product.description}</p>}
              {product.stripeLink && (
                <div className="listing-purchase-actions">
                  <a
                    href={product.stripeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy-button"
                  >
                    Checkout securely — {product.price}
                  </a>
                  {product.whatsappLink && (
                    <a
                      href={product.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-order-link"
                    >
                      Message seller on WhatsApp
                      <span>+1 (510) 829-4799</span>
                    </a>
                  )}
                  {product.featured && (
                    <p className="listing-payment-note">Secure checkout opens on Stripe.</p>
                  )}
                </div>
              )}
              {!product.stripeLink && product.availability && (
                <div className="product-availability">
                  <button type="button" className="buy-button buy-button-disabled" disabled>
                    Checkout opening soon
                  </button>
                  <p>{product.availability}</p>
                </div>
              )}
              {product.description && (
                <section className="listing-description">
                  <h2>About this piece</h2>
                  <p>{product.description}</p>
                </section>
              )}
            </aside>
          </div>
          {product.featured && (
            <ProductPhotoStories groups={productPhotoGroups} name={product.name} />
          )}
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
