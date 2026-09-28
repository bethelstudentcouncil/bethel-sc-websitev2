(function () {
  const url = window.BETHEL_SUPABASE_URL;
  const key = window.BETHEL_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !window.supabase) { window.bethelSupabase = null; return; }
  window.bethelSupabase = window.supabase.createClient(url, key);
})();

(function () {
  const desc = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  if (!desc || !desc.set) return;
  let fullMarkup = '';
  let currentCategory = 'All';
  let expanded = false;
  let internalUpdate = false;

  function getTiles(markup) {
    return markup.match(/<div class="g-tile[\s\S]*?<\/div>\s*<\/div>/g) || [];
  }

  function categoryOf(tile) {
    const match = tile.match(/data-cat="([^"]*)"/);
    return match ? match[1] : '';
  }

  function toImageTile(tile, index) {
    return tile.replace(/<div class="gph" style="background:url\(['"]?([^'")]+)['"]?\) center\/cover no-repeat"><\/div>/, function (_, url) {
      return '<div class="gph"><img src="' + url + '" alt="Gallery photo" loading="' + (index < 3 ? 'eager' : 'lazy') + '" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:inherit"></div>';
    });
  }

  function ensureControls() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return null;
    if (!document.getElementById('galleryMoreBtn')) {
      const style = document.createElement('style');
      style.textContent = '.gallery-actions{display:flex;justify-content:center;margin-top:28px}.gallery-more{padding:12px 24px;border:1.5px solid var(--line);border-radius:100px;background:#fff;color:var(--navy);font-weight:700;font-size:14px;cursor:pointer}.gallery-more:hover{background:var(--navy);color:#fff}.gph img{display:block}';
      document.head.appendChild(style);
      const wrap = document.createElement('div');
      wrap.className = 'gallery-actions';
      const btn = document.createElement('button');
      btn.id = 'galleryMoreBtn';
      btn.className = 'gallery-more hidden';
      btn.type = 'button';
      btn.textContent = 'View all photos';
      wrap.appendChild(btn);
      grid.parentNode.insertBefore(wrap, grid.nextSibling);
      btn.addEventListener('click', function () { expanded = true; renderGalleryView(); });
    }
    return document.getElementById('galleryMoreBtn');
  }

  function renderGalleryView() {
    const grid = document.getElementById('galleryGrid');
    const btn = ensureControls();
    if (!grid) return;
    const tiles = getTiles(fullMarkup);
    const filtered = currentCategory === 'All' ? tiles : tiles.filter(function (tile) { return categoryOf(tile) === currentCategory; });
    const visible = expanded ? filtered : filtered.slice(0, 3);
    internalUpdate = true;
    desc.set.call(grid, visible.map(function (tile, index) { return toImageTile(tile, index); }).join(''));
    internalUpdate = false;
    if (btn) {
      const remaining = filtered.length - visible.length;
      btn.classList.toggle('hidden', remaining <= 0);
      btn.textContent = remaining > 0 ? 'View all ' + filtered.length + ' photos' : 'View all photos';
    }
  }

  const originalSet = desc.set;

  document.addEventListener('click', function (event) {
    const btn = event.target.closest('.filter-pill');
    if (!btn || !fullMarkup) return;
    currentCategory = btn.dataset.cat || 'All';
    expanded = false;
    setTimeout(renderGalleryView, 0);
  });

  Object.defineProperty(Element.prototype, 'innerHTML', {
    configurable: desc.configurable,
    enumerable: desc.enumerable,
    get: desc.get,
    set: function (value) {
      if (this.id === 'galleryGrid' && !internalUpdate) {
        fullMarkup = value || '';
        currentCategory = 'All';
        expanded = false;
        ensureControls();
        renderGalleryView();
        return;
      }
      originalSet.call(this, value);
    }
  });
})();