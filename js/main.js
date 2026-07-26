/* ============================================================
   Website Desa Kentengsari — Interaksi utama
   ============================================================ */
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
