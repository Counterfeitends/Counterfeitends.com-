import { getProducts } from "./lib/supabase";
import Image from "next/image";
import SmsModal from "./SmsModal";

export default async function HomeStorefront({ showSmsModal = false }) {
  const products = await getProducts();
  const featuredProduct = products.find((product) => product.featured);
  const catalogProducts = products.filter((product) => product.slug !== featuredProduct?.slug);

  return (
    <div className="page">
      <header>
        <div className="header-inner">
          <nav>
            <a href="#shop">Index</a>
            <a href="/sms">SMS</a>
          </nav>

          <div className="brand">counterfeitends</div>

          <div className="header-spacer" />
        </div>
      </header>

      <main>
        <div className="shell">
          <section id="shop" className="shop-index">
            <div className="section-header">
              <div className="section-title">Index</div>
              <span className="section-edition">Counterfeit Ends / new work</span>
            </div>

            {featuredProduct && (
              <a
                href={`/product/${featuredProduct.slug}`}
                className="featured-product-link"
                aria-label={`View ${featuredProduct.name}, ${featuredProduct.price}`}
              >
                <article className="featured-product">
                  <div className="featured-product-image">
                    <Image
                      src={featuredProduct.image}
                      alt=""
                      fill
                      priority
                      sizes="(max-width: 800px) 100vw, 66vw"
                      className="featured-product-photo"
                    />
                    <span className="featured-image-caption">Counterfeit Ends / field study 001</span>
                  </div>

                  <div className="featured-product-copy">
                    <div className="featured-product-kicker">
                      <span>New work</span>
                      <span>01 / 03</span>
                    </div>
                    <div>
                      <h1>{featuredProduct.name}</h1>
                      <p className="featured-product-description">{featuredProduct.description}</p>
                    </div>
                    <div className="featured-product-bottom">
                      <span className="featured-product-price">{featuredProduct.price}</span>
                      <span className="featured-product-cta">View the jacket <span aria-hidden="true">↗</span></span>
                    </div>
                    <p className="featured-product-availability">{featuredProduct.availability}</p>
                  </div>
                </article>
              </a>
            )}
            {featuredProduct?.whatsappLink && (
              <a
                href={featuredProduct.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="featured-whatsapp-link"
              >
                Order by WhatsApp <span aria-hidden="true">↗</span>
                <span>+1 (510) 829-4799</span>
              </a>
            )}

            {catalogProducts.length > 0 && (
              <>
                <div className="catalog-heading">
                  <span>Other pieces</span>
                  <span>From the index</span>
                </div>
                <div className="product-grid">
                  {catalogProducts.map((product) => (
                    <a
                      key={product.slug}
                      href={`/product/${product.slug}`}
                      className="product-link"
                    >
                      <article className="product-card">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="product-name">{product.name}</div>
                        <div className="product-meta">
                          <span className="product-tag"></span>
                          <span>{product.price}</span>
                        </div>
                      </article>
                    </a>
                  ))}
                </div>
              </>
            )}
          </section>
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
      {showSmsModal && <SmsModal />}
    </div>
  );
}
