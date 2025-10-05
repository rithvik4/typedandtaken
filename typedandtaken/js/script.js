/* ---------------------------
   typedandtaken - script.js
   Single JS handling all pages interactions
   --------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------
     NAVBAR / HAMBURGER
     --------------------------- */
  (function headerHandlers(){
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;
    const toggle = () => {
      const showing = navLinks.classList.toggle('show');
      hamburger.setAttribute('aria-expanded', showing ? 'true' : 'false');
    };
    hamburger.addEventListener('click', toggle);
    hamburger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

    // Close nav when clicking a link (mobile)
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (navLinks.classList.contains('show')) navLinks.classList.remove('show');
    }));
  })();


  /* ---------------------------
     SCROLL / FADE ANIMATIONS (.animate)
     --------------------------- */
  (function scrollReveal(){
    const animated = Array.from(document.querySelectorAll('.animate'));
    if (!animated.length) return;
    const reveal = () => {
      const vh = window.innerHeight;
      animated.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < vh - 100) el.classList.add('show');
      });
    };
    reveal();
    window.addEventListener('scroll', reveal, { passive:true });
    window.addEventListener('resize', reveal);
  })();


  /* ---------------------------
     INSTAGRAM POPUP (center modal)
     --------------------------- */
  (function instagramPopup(){
    const openBtns = Array.from(document.querySelectorAll('#instagramBtn, #instagramBtnSmall'));
    const popup = document.getElementById('instagramPopup');
    if (!openBtns.length || !popup) return;
    const closeBtn = popup.querySelector('.close');
    openBtns.forEach(btn => btn.addEventListener('click', e => {
      e.preventDefault();
      popup.style.display = 'flex';
      popup.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
      // show animation
      popup.querySelector('.popup-content')?.classList.add('show');
    }));
    closeBtn?.addEventListener('click', () => {
      popup.style.display = 'none'; popup.setAttribute('aria-hidden','true'); document.body.style.overflow = '';
    });
    window.addEventListener('click', e => { if (e.target === popup) { popup.style.display = 'none'; popup.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }});
    window.addEventListener('keydown', e => { if (e.key === 'Escape' && popup.style.display === 'flex') { popup.style.display = 'none'; popup.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }});
  })();


  /* ---------------------------
     HOME - CAROUSEL (autoplay + manual)
     --------------------------- */
  (function featuredCarousel(){
    const slidesEl = document.getElementById('slides');
    if (!slidesEl) return;
    const slides = Array.from(slidesEl.children);
    const prevBtn = document.getElementById('prevFeat');
    const nextBtn = document.getElementById('nextFeat');
    let index = 0, timer = null;

    const update = (i) => {
      const w = slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(slidesEl).gap || 16);
      index = (i + slides.length) % slides.length;
      slidesEl.style.transform = `translateX(-${index * w}px)`;
    };
    const next = () => update(index + 1);
    const prev = () => update(index - 1);

    if (nextBtn) nextBtn.addEventListener('click', e => { e.preventDefault(); next(); reset(); });
    if (prevBtn) prevBtn.addEventListener('click', e => { e.preventDefault(); prev(); reset(); });

    const start = () => { timer = setInterval(next, 3600); };
    const reset = () => { clearInterval(timer); start(); };

    // init
    setTimeout(()=> update(0), 60);
    start();

    // keyboard nav
    const carousel = document.getElementById('carousel');
    if (carousel) carousel.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); });
  })();


  /* ---------------------------
     HOME - HERO PARALLAX BLOBS
     --------------------------- */
  (function heroParallax(){
    const hero = document.querySelector('.home-hero');
    const b1 = document.querySelector('.blob-1');
    const b2 = document.querySelector('.blob-2');
    if (!hero || !b1 || !b2) return;
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      b1.style.transform = `translate3d(${x * -12}px, ${y * -8}px, 0)`;
      b2.style.transform = `translate3d(${x * 10}px, ${y * 6}px, 0)`;
    });
    hero.addEventListener('mouseleave', ()=> { b1.style.transform=''; b2.style.transform=''; });
  })();


  /* ---------------------------
     GALLERY - LIGHTBOX (download, prev/next, keyboard)
     --------------------------- */
  (function galleryLightbox(){
    const grid = document.getElementById('photoGrid');
    const lightbox = document.getElementById('lightbox');
    if (!grid || !lightbox) return;

    const cards = Array.from(grid.querySelectorAll('.photo-card'));
    const photos = cards.map(card => {
      const img = card.querySelector('img');
      return { src: img.dataset.src || img.src, alt: img.alt || '', caption: img.dataset.caption || '', ig: img.datasetInstagram || img.dataset.instagram || null };
    });

    const lbImage = document.getElementById('lbImage');
    const lbCaption = document.getElementById('lbCaption');
    const lbInstagram = document.getElementById('lbInstagram');
    const lbDownload = document.getElementById('lbDownload');
    const lbClose = lightbox.querySelector('.lb-close');
    const lbPrev = lightbox.querySelector('.lb-prev');
    const lbNext = lightbox.querySelector('.lb-next');

    let current = 0;
    const open = idx => {
      current = (idx + photos.length) % photos.length;
      const p = photos[current];
      lbImage.src = p.src; lbImage.alt = p.alt; lbCaption.textContent = p.caption || '';
      lbInstagram.href = p.ig || 'https://www.instagram.com/typedandtaken';
      lightbox.style.display = 'flex'; lightbox.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
      lbClose.focus();
    };
    const close = () => { lightbox.style.display='none'; lightbox.setAttribute('aria-hidden','true'); lbImage.src=''; document.body.style.overflow=''; };

    cards.forEach((card,i)=>{
      card.addEventListener('click', ()=> open(i));
      card.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); open(i); } });
    });

    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', ()=> open(current-1));
    lbNext.addEventListener('click', ()=> open(current+1));

    lbDownload.addEventListener('click', ()=>{
      const url = lbImage.src; if(!url) return;
      const a=document.createElement('a'); a.href=url; a.download = url.split('/').pop().split('?')[0]; document.body.appendChild(a); a.click(); a.remove();
    });

    window.addEventListener('keydown', e=>{
      if (lightbox.style.display !== 'flex') return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(current-1);
      if (e.key === 'ArrowRight') open(current+1);
    });
    lightbox.addEventListener('click', e=> { if (e.target === lightbox) close(); });
  })();


  /* ---------------------------
     WRITINGS - SEARCH, TAGS, READ-MODAL
     --------------------------- */
  (function writingsHandlers(){
    const search = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const tagWrap = document.getElementById('tagsWrap');
    const tagBtns = tagWrap ? Array.from(tagWrap.querySelectorAll('.tag-chip')) : [];
    const grid = document.getElementById('writingsGrid');
    const cards = grid ? Array.from(grid.querySelectorAll('.writing-card')) : [];

    if (!grid) return;
    const normalize = s => (s||'').toLowerCase().trim();

    let activeTag = 'all';
    const apply = () => {
      const q = search ? normalize(search.value) : '';
      cards.forEach(card => {
        const title = normalize(card.getAttribute('data-title') || '');
        const tags = normalize(card.getAttribute('data-tags') || '');
        const tagMatch = (activeTag === 'all') ? true : tags.split(',').map(t=>t.trim()).includes(activeTag);
        const qMatch = q === '' ? true : (title.includes(q) || tags.includes(q) || card.textContent.toLowerCase().includes(q));
        if (tagMatch && qMatch) { card.style.display=''; card.classList.add('show'); } else { card.style.display='none'; }
      });
    };

    if (search){ search.addEventListener('input', apply); clearSearch?.addEventListener('click', ()=>{ if(search){search.value=''; search.focus(); apply()} }); }
    tagBtns.forEach(btn => btn.addEventListener('click', ()=>{
      tagBtns.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); activeTag = btn.dataset.tag; apply();
    }));
    // set All active by default
    const start = document.querySelector('.tag-chip[data-tag="all"]'); if (start) start.classList.add('active');
    apply();

    // read modal
    const modal = document.getElementById('readModal');
    if (!modal) return;
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalDate = document.getElementById('modalDate');
    const modalClose = document.getElementById('modalClose');
    const modalShare = document.getElementById('modalShare');

    // sample full content map (extend with your actual content)
    const fullContent = {
      w1: { title:'Taking a breath, letting the world spin around', date:'Apr 12, 2025', body:`<p>Finding beauty in the pause — sometimes silence says more than words ever can. The photograph that begins the day is quieter than the thought that follows. I often wait for a fraction of a second where the subject forgets the camera; where the world keeps moving and the frame decides to stop.</p><p>Memory likes to edit — it keeps the idea and discards the noise. Writing is that small edit. Lately I have been learning to let photographs keep their edges and my words accept the blur.</p>`},
      w2: { title:'Between light and shadow', date:'Mar 23, 2025', body:`<p>Contrast is not just a visual trick — it's a rhythm. The sharp line of a shadow on a pavement, the soft halo of a streetlight on an old window; these contrasts narrate the quiet movement of a city after dusk.</p>`},
      w3: { title:'A train window hymn', date:'Feb 9, 2025', body:`<p>The window becomes a small theater. Fields blur into brushstrokes, each village a short scene.</p>`},
      w4: { title:'Silent afternoons', date:'Jan 18, 2025', body:`<p>Afternoons are the archive of small rituals — a cup left cooling, books opened at a remembered page.</p>`}
    };

    document.querySelectorAll('.read-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const data = fullContent[id];
        if (!data) return;
        modalTitle.textContent = data.title;
        modalDate.textContent = data.date;
        modalBody.innerHTML = data.body;
        modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false'); modalClose.focus();
      });
    });
    modalClose.addEventListener('click', ()=> { modal.style.display='none'; modal.setAttribute('aria-hidden','true');});
    window.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.style.display === 'flex') modalClose.click(); });
    window.addEventListener('click', e => { if (e.target === modal) modalClose.click(); });

    if (modalShare) modalShare.addEventListener('click', async () => {
      try {
        const shareText = `${modalTitle.textContent} — read on typedandtaken\nhttps://www.instagram.com/typedandtaken`;
        await navigator.clipboard.writeText(shareText);
        modalShare.textContent = 'Link copied';
        setTimeout(()=> modalShare.textContent = 'Copy link', 1800);
      } catch { modalShare.textContent='Unable'; setTimeout(()=> modalShare.textContent='Copy link',1800); }
    });
  })();


  /* ---------------------------
     CONTACT - FORM + COPY BUTTONS + SUCCESS POPUP
     --------------------------- */
  (function contactHandlers(){
    const form = document.getElementById('contactForm');
    const clearBtn = document.getElementById('clearForm');
    const success = document.getElementById('contactSuccess');
    const popupClose = success ? success.querySelector('.close') : null;

    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const txt = btn.dataset.copy || '';
        try { await navigator.clipboard.writeText(txt); btn.textContent = 'Copied'; setTimeout(()=> btn.textContent='Copy',1400); } catch { btn.textContent='Error'; setTimeout(()=> btn.textContent='Copy',1400); }
      });
    });

    if (clearBtn && form) clearBtn.addEventListener('click', ()=> form.reset());

    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if (!name || !email || !message) { alert('Please provide name, email and a message.'); return; }
      console.log('Contact form payload:', {name,email,subject:form.subject.value.trim(),message});
      if (success) { success.style.display='flex'; success.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
      form.reset();
    });

    if (popupClose) popupClose.addEventListener('click', ()=> { success.style.display='none'; success.setAttribute('aria-hidden','true'); document.body.style.overflow=''; });
    window.addEventListener('click', e => { if (e.target === success) { success.style.display='none'; success.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }});
    window.addEventListener('keydown', e => { if (e.key === 'Escape' && success && success.style.display === 'flex') popupClose?.click(); });
  })();


  /* ---------------------------
     SUBSCRIBE (client-side)
     --------------------------- */
  (function subscribe(){
    const sform = document.getElementById('subscribeForm');
    if (!sform) return;
    sform.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('subscribeEmail').value.trim();
      if (!email) { alert('Provide email'); return; }
      console.log('Subscribe:', email);
      const btn = sform.querySelector('button'); btn.textContent = 'Subscribed'; setTimeout(()=> btn.textContent='Subscribe',1800); sform.reset();
    });
  })();

  /* ---------------------------
     Accessibility improvements:
     - ensure focus outlines visible for keyboard users
     --------------------------- */
  (function a11yFocus(){
    document.addEventListener('keyup', e => { if (e.key === 'Tab') document.body.classList.add('show-focus'); }, { once:true });
  })();

});
