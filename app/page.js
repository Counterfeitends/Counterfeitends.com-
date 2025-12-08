// app/page.js

export default function HomePage() {
  return (
    <div className="page">
  <header>
  <div className="header-inner">
    <nav>
      <a href="#shop">Index</a>
    </nav>

    <div className="brand">counterfeitends</div>

    {/* empty spacer to balance the grid */}
    <div className="header-spacer" />
  </div>
</header>



      <main>
        {/* FULLSCREEN HERO MEDIA (video) */}
        <section id="home-hero" className="hero-media">
          <video
            className="hero-video"
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </section>

        <div className="shell">
          {/* SHOP / INDEX SECTION ONLY */}
          <section id="shop">
            <div className="section-header">
              <div className="section-title">Index</div>
            </div>

            <div className="product-grid">
              {/* Duplicate / edit these cards as you add real images + names + prices */}

              <article className="product-card">
                <img src="/products/jadenimage2.jpg" alt="Flair Liner Jacket" className="product-image" />
                <div className="product-name">Flair Liner Jacket</div>
                <div className="product-meta">
                  <span className="product-tag"></span>
                  <span>$800</span>
                </div>
              </article>

       
            </div>
          </section>
        </div>
      </main>

    <footer>
  <div className="footer-inner">
    <div className="footer-left">© Counterfeitends Studio</div>
    <a href="#" className="footer-right">INSTAGRAM</a>
  </div>
</footer>

    </div>
  );
}
