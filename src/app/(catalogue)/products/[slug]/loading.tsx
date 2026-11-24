export default function ProductLoading() {
  return (
    <main id="main-content" className="container-shell product-page" aria-busy="true">
      <span className="sr-only" role="status">Loading product details</span>
      <div aria-hidden="true">
        <div className="catalogue-skeleton mb-4 h-11 w-24" />
        <div className="product-detail-layout">
          <div>
            <div className="catalogue-skeleton aspect-square" />
            <div className="gallery-thumbnails">
              {[0, 1, 2].map((index) => <div className="catalogue-skeleton size-[66px]" key={index} />)}
            </div>
          </div>
          <div className="grid content-start gap-4">
            <div className="catalogue-skeleton h-4 w-20" />
            <div className="catalogue-skeleton h-12 w-4/5" />
            <div className="catalogue-skeleton h-14 w-full" />
            <div className="catalogue-skeleton mt-2 h-5 w-36" />
            <div className="catalogue-skeleton h-28 w-full" />
            <div className="catalogue-skeleton h-24 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
