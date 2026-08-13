const text = (value) => typeof value === "string" ? value.trim() : "";

export function renderProducts(values, theme) {
  const section = document.createElement("section");
  section.className = "hub-products";
  section.dataset.component = "products";
  section.style.setProperty("--hub-products-background", theme?.color?.background || "#fff");
  section.style.setProperty("--hub-products-ink", theme?.color?.ink || "#1a1a1a");
  section.style.setProperty("--hub-products-muted", theme?.color?.muted || "#737373");
  section.style.setProperty("--hub-products-accent", theme?.color?.accent || "#171717");
  section.style.setProperty("--hub-products-display-font", theme?.font?.display || "Figtree, sans-serif");
  section.style.setProperty("--hub-products-body-font", theme?.font?.body || "Figtree, sans-serif");

  const heading = text(values.heading);
  if (heading) {
    const title = document.createElement("h2");
    title.className = "hub-products__heading";
    title.textContent = heading;
    section.append(title);
  }

  const list = document.createElement("div");
  list.className = "hub-products__list";
  const products = Array.isArray(values.products) ? values.products.slice(0, 2) : [];
  products.forEach((product) => {
    if (!product || typeof product !== "object") return;
    const card = document.createElement("article");
    card.className = "hub-products__card";
    const imageUrl = text(product.imageUrl);
    if (imageUrl) {
      const media = document.createElement("div");
      media.className = "hub-products__media";
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = text(product.imageAlt);
      media.append(image);
      card.append(media);
    }
    const body = document.createElement("div");
    body.className = "hub-products__body";
    const brand = text(product.brand);
    const title = text(product.title);
    const price = text(product.price);
    if (brand) { const item = document.createElement("p"); item.className = "hub-products__brand"; item.textContent = brand; body.append(item); }
    if (title) { const item = document.createElement("h3"); item.textContent = title; body.append(item); }
    if (price) { const item = document.createElement("p"); item.className = "hub-products__price"; item.textContent = price; body.append(item); }
    if (body.childElementCount) card.append(body);
    const ctaText = text(product.ctaText);
    if (ctaText) {
      const cta = document.createElement(text(product.ctaUrl) ? "a" : "span");
      cta.className = "hub-products__cta";
      cta.textContent = ctaText;
      if (cta instanceof HTMLAnchorElement) cta.href = text(product.ctaUrl);
      card.append(cta);
    }
    if (card.childElementCount) list.append(card);
  });
  if (list.childElementCount) section.append(list);
  section.hidden = !heading && !list.childElementCount;
  return section;
}
