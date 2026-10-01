import { getProducts } from "./lib/supabase";
import SmsModal from "./SmsModal";

export default async function HomeStorefront({ showSmsModal = false }) {
  const products = await getProducts();

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
          <section id="shop">
            <div className="section-header">
              <div className="section-title">Index</div>
            </div>

            <div className="product-grid">
              {products.map((product) => (
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