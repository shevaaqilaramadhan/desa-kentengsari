/* ============================================================
   Website Desa Kentengsari — Interaksi utama
   ============================================================ */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Navbar: background gelap saat di-scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile (hamburger) ---------- */
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  /* ---------- Kartu UMKM: kontrol flip yang aksesibel ---------- */
  const umkmCards = document.querySelectorAll('.umkm-card[tabindex="0"]');
  if (umkmCards.length) {
    const setCardExpanded = (card, expanded) => {
      const front = card.querySelector('.umkm-card__front');
      const back = card.querySelector('.umkm-card__back');

      card.classList.toggle('is-flipped', expanded);
      card.setAttribute('aria-expanded', String(expanded));
      front.setAttribute('aria-hidden', String(expanded));
      back.setAttribute('aria-hidden', String(!expanded));
    };

    const toggleCard = card => {
      setCardExpanded(card, card.getAttribute('aria-expanded') !== 'true');
    };

    document.addEventListener('pointerdown', event => {
      umkmCards.forEach(card => {
        if (!card.contains(event.target)) {
          setCardExpanded(card, false);
          if (document.activeElement === card) card.blur();
        }
      });
    });

    umkmCards.forEach((card, index) => {
      const front = card.querySelector('.umkm-card__front');
      const back = card.querySelector('.umkm-card__back');
      const businessName = front.querySelector('h3').textContent.trim();
      const product = front.querySelector('.umkm-card__product').textContent.trim();

      back.id = `umkm-card-detail-${index + 1}`;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Detail UMKM ${businessName}, produk ${product}`);
      card.setAttribute('aria-controls', back.id);
      setCardExpanded(card, false);

      card.addEventListener('click', () => {
        card.focus({ preventScroll: true });
        toggleCard(card);
      });
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!event.repeat) toggleCard(card);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          setCardExpanded(card, false);
        }
      });
      card.addEventListener('focusout', event => {
        if (!card.contains(event.relatedTarget)) setCardExpanded(card, false);
      });
    });

    /* ---------- Filter dusun dengan reflow bergaya FLIP (native WAAPI) ---------- */
    const filter = document.getElementById('umkmFilter');
    const grid = document.getElementById('umkmGrid');
    const resultCount = document.getElementById('umkmResultCount');
    const emptyState = document.getElementById('umkmEmptyState');

    if (filter && grid && resultCount && emptyState) {
      const cards = Array.from(umkmCards);
      const allFilter = filter.querySelector('[data-filter-all]');
      const categoryFilters = Array.from(filter.querySelectorAll('[data-filter-category]'));
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let filterRun = 0;

      const getCardDusun = card => {
        const locationRow = Array.from(card.querySelectorAll('.umkm-card__details > div')).find(row => {
          const term = row.querySelector('dt');
          return term && /^(Dusun|Lokasi)$/i.test(term.textContent.trim());
        });
        const location = locationRow ? locationRow.querySelector('dd').textContent.trim().toLowerCase() : '';

        if (location.includes('nglarangan')) return 'nglarangan';
        if (location.includes('kenteng krajan')) return 'kenteng-krajan';
        if (location.includes('kenteng wetan')) return 'kenteng-wetan';
        return 'belum-terverifikasi';
      };

      const setFilterVisibility = (card, visible) => {
        card.dataset.filterVisible = String(visible);
        setCardExpanded(card, false);
        card.inert = !visible;

        if (visible) {
          card.hidden = false;
          card.tabIndex = 0;
          card.removeAttribute('aria-hidden');
        } else {
          card.tabIndex = -1;
          card.setAttribute('aria-hidden', 'true');
          card.hidden = true;
        }
      };

      const cancelCardAnimations = () => {
        cards.forEach(card => {
          card.getAnimations().forEach(animation => animation.cancel());
          card.style.removeProperty('opacity');
          card.style.removeProperty('transform');
          card.style.removeProperty('will-change');
        });
      };

      const animateFilter = async () => {
        const run = ++filterRun;
        cancelCardAnimations();

        /* Selesaikan keadaan target dari interaksi sebelumnya sebelum mengukur ulang. */
        cards.forEach(card => {
          if (card.dataset.filterVisible) {
            setFilterVisibility(card, card.dataset.filterVisible === 'true');
          }
        });

        const firstRects = new Map(
          cards.filter(card => !card.hidden).map(card => [card, card.getBoundingClientRect()])
        );
        const selectedDusun = new Set(
          categoryFilters
            .filter(button => button.getAttribute('aria-pressed') === 'true')
            .map(button => button.value)
        );
        const targets = new Map(cards.map(card => [card, selectedDusun.has(card.dataset.dusun)]));
        const leaving = cards.filter(card => !card.hidden && !targets.get(card));
        const entering = cards.filter(card => card.hidden && targets.get(card));
        const retained = cards.filter(card => !card.hidden && targets.get(card));
        const visibleCount = cards.filter(card => targets.get(card)).length;
        const instant = reducedMotion.matches || !Element.prototype.animate;

        cards.forEach(card => {
          card.dataset.filterVisible = String(targets.get(card));
          if (!targets.get(card)) {
            setCardExpanded(card, false);
            card.inert = true;
            card.tabIndex = -1;
            card.setAttribute('aria-hidden', 'true');
          }
        });

        resultCount.textContent = `${visibleCount} usaha ditampilkan`;
        emptyState.hidden = visibleCount !== 0;

        if (instant) {
          cards.forEach(card => setFilterVisibility(card, targets.get(card)));
          return;
        }

        const exitAnimations = leaving.map((card, index) => {
          card.style.willChange = 'opacity, transform';
          return card.animate(
            [
              { opacity: 1, transform: 'scale(1)' },
              { opacity: 0, transform: 'scale(.92)' }
            ],
            {
              duration: 180,
              delay: Math.min(index * 18, 90),
              easing: 'ease-in',
              fill: 'forwards'
            }
          );
        });

        await Promise.allSettled(exitAnimations.map(animation => animation.finished));
        if (run !== filterRun) return;

        exitAnimations.forEach(animation => animation.cancel());
        leaving.forEach(card => card.style.removeProperty('will-change'));
        leaving.forEach(card => setFilterVisibility(card, false));
        entering.forEach(card => setFilterVisibility(card, true));

        /* Paksa layout sesudah perubahan visibility, lalu gerakkan kartu yang bertahan
           dari koordinat lama ke koordinat baru tanpa mengubah urutan DOM. */
        const lastRects = new Map(
          cards.filter(card => targets.get(card)).map(card => [card, card.getBoundingClientRect()])
        );
        const visibleCards = cards.filter(card => targets.get(card));

        retained.forEach(card => {
          const first = firstRects.get(card);
          const last = lastRects.get(card);
          if (!first || !last) return;

          const deltaX = first.left - last.left;
          const deltaY = first.top - last.top;
          if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

          const index = visibleCards.indexOf(card);
          card.style.willChange = 'transform';
          const animation = card.animate(
            [
              { transform: `translate(${deltaX}px, ${deltaY}px)` },
              { transform: 'translate(0, 0)' }
            ],
            {
              duration: 540,
              delay: Math.min(index * 28, 168),
              easing: 'cubic-bezier(.2, .75, .25, 1)',
              fill: 'none'
            }
          );
          animation.finished.then(() => {
            if (run === filterRun) card.style.removeProperty('will-change');
            animation.cancel();
          }).catch(() => {});
        });

        entering.forEach(card => {
          const index = visibleCards.indexOf(card);
          card.style.willChange = 'opacity, transform';
          const animation = card.animate(
            [
              { opacity: 0, transform: 'scale(.92)' },
              { opacity: 1, transform: 'scale(1)' }
            ],
            {
              duration: 440,
              delay: Math.min(index * 28, 168),
              easing: 'cubic-bezier(.2, .75, .25, 1)',
              fill: 'none'
            }
          );
          animation.finished.then(() => {
            if (run === filterRun) card.style.removeProperty('will-change');
            animation.cancel();
          }).catch(() => {});
        });

      };

      cards.forEach(card => {
        card.dataset.dusun = getCardDusun(card);
        card.dataset.filterVisible = 'true';
      });

      allFilter.addEventListener('click', () => {
        const activateAll = allFilter.getAttribute('aria-pressed') !== 'true';
        categoryFilters.forEach(button => {
          button.setAttribute('aria-pressed', String(activateAll));
        });
        allFilter.setAttribute('aria-pressed', String(activateAll));
        animateFilter();
      });

      categoryFilters.forEach(button => {
        button.addEventListener('click', () => {
          const isActive = button.getAttribute('aria-pressed') === 'true';
          button.setAttribute('aria-pressed', String(!isActive));

          const activeCount = categoryFilters.filter(category => (
            category.getAttribute('aria-pressed') === 'true'
          )).length;
          const allState = activeCount === categoryFilters.length
            ? 'true'
            : activeCount === 0 ? 'false' : 'mixed';
          allFilter.setAttribute('aria-pressed', allState);
          animateFilter();
        });
      });

      filter.hidden = false;
      animateFilter();
    }
  }

  /* ---------- Animasi reveal saat elemen masuk viewport ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Lightbox galeri ---------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const img = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.lightbox__caption');
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    document.querySelectorAll('[data-lightbox]').forEach(item => {
      item.addEventListener('click', () => {
        const source = item.querySelector('img');
        img.src = item.getAttribute('data-src') || (source ? source.src : '');
        img.alt = item.getAttribute('data-caption') || 'Pratinjau foto';
        caption.textContent = item.getAttribute('data-caption') || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox || e.target.closest('.lightbox__close')) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  /* ---------- Tombol scroll ke atas ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    const toggleScrollBtn = () => scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    toggleScrollBtn();
    window.addEventListener('scroll', toggleScrollBtn, { passive: true });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Formulir kontak (mailto untuk situs statis) ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nama = form.nama.value.trim();
      const email = form.email.value.trim();
      const pesan = form.pesan.value.trim();
      if (!nama || !email || !pesan) return;
      const subject = encodeURIComponent(`Pesan dari ${nama} — Website Desa Kentengsari`);
      const body = encodeURIComponent(`Nama: ${nama}\nEmail: ${email}\n\nPesan:\n${pesan}`);
      window.location.href = `mailto:pemdeskentengsari@gmail.com?subject=${subject}&body=${body}`;
      const note = document.getElementById('formNote');
      if (note) note.textContent = 'Aplikasi email Anda akan terbuka dengan pesan yang sudah terisi. Terima kasih!';
    });
  }

  /* ---------- Tahun otomatis pada footer ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
