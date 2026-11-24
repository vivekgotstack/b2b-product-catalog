export default function CatalogueLoading() {
  return (
    <main id="main-content" aria-busy="true">
      <span className="sr-only" role="status">Loading the catalogue</span>
      <div aria-hidden="true">
        <div className="container-shell catalogue-skeleton catalogue-hero-placeholder" />
        <section className="container-shell catalogue-section">
          <div className="catalogue-heading">
            <div className="catalogue-skeleton h-9 w-60 max-w-full" />
            <div className="catalogue-skeleton h-12 w-full max-w-96" />
          </div>
          <div className="catalogue-toolbar">
            <div className="flex flex-wrap gap-2">
              {[112, 84, 72, 96, 88].map((width, index) => (
                <div className="catalogue-skeleton h-10" key={index} style={{ width }} />
              ))}
            </div>
          </div>
          <div className="product-grid">
            {[0, 1, 2, 3].map((index) => (
              <div className="product-card" key={index}>
                <div className="catalogue-skeleton catalogue-skeleton-photo aspect-square" />
                <div className="product-card-body gap-3">
                  <div className="catalogue-skeleton h-3 w-16" />
                  <div className="catalogue-skeleton h-5 w-3/4" />
                  <div className="catalogue-skeleton h-16 w-full" />
                  <div className="catalogue-skeleton h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
