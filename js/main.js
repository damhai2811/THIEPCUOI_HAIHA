/* ══════════════════════════════════════════════════
   main.js — Tuấn Hải & Thu Hà
══════════════════════════════════════════════════ */
const GOOGLE_SCRIPT_URL = '';

/* ===== COUNTDOWN 27/12/2026 ===== */

const targetDate = new Date('2026-12-27T00:00:00+09:00').getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = targetDate - now;

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
    console.error('Countdown: Không tìm thấy ID HTML!');
    return;
  }

  const remaining = Math.max(0, diff);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Chạy ngay khi JS được thực thi
updateCountdown();

// Tự động cập nhật mỗi giây
setInterval(updateCountdown, 1000);

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); ro.unobserve(e.target); }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => ro.observe(el));

/* ── Audio ── */
const audio   = document.getElementById('audio');
const btnAud  = document.querySelector('.btn-audio');
const iconAud = btnAud.querySelector('i');
const setIcon = on => iconAud.className = on ? 'ri-volume-up-fill' : 'ri-volume-mute-fill';

btnAud.addEventListener('click', () =>
  audio.paused ? (audio.play(), setIcon(true)) : (audio.pause(), setIcon(false))
);
document.addEventListener('click', function ft() {
  audio.play().then(() => setIcon(true)).catch(() => {});
  document.removeEventListener('click', ft);
}, { once: true });

/* ── Swiper album — coverflow mượt ── */
new Swiper('.album-swiper', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  speed: 500,
  loop: true,
  coverflowEffect: { rotate: 40, stretch: 0, depth: 110, modifier: 1, slideShadows: true },
  pagination: { el: '.swiper-pagination', clickable: true },
  autoplay: { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true },
});

/* ── Click ảnh album → lightbox ── */
const lbOverlay = document.getElementById('lightbox');
const lbImg     = lbOverlay.querySelector('.lb-img');
const lbClose   = lbOverlay.querySelector('.lb-close');
const lbPrev    = lbOverlay.querySelector('.lb-prev');
const lbNext    = lbOverlay.querySelector('.lb-next');

const slides = [...document.querySelectorAll('.album-swiper .swiper-slide img')];
let cur = 0;

function lbShow(i) {
  cur = (i + slides.length) % slides.length;
  lbImg.style.opacity = '0'; lbImg.style.transform = 'scale(.88)';
  setTimeout(() => {
    lbImg.src = slides[cur].dataset.lb || slides[cur].src;
    lbImg.style.opacity = '1'; lbImg.style.transform = 'scale(1)';
  }, 150);
  lbOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function lbClose2() {
  lbOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
slides.forEach((img, i) => img.addEventListener('click', () => lbShow(i)));
lbClose.addEventListener('click', lbClose2);
lbPrev.addEventListener('click', () => lbShow(cur - 1));
lbNext.addEventListener('click', () => lbShow(cur + 1));
lbOverlay.addEventListener('click', e => { if (e.target === lbOverlay) lbClose2(); });
document.addEventListener('keydown', e => {
  if (!lbOverlay.classList.contains('open')) return;
  if (e.key === 'Escape') lbClose2();
  if (e.key === 'ArrowRight') lbShow(cur + 1);
  if (e.key === 'ArrowLeft')  lbShow(cur - 1);
});
/* Swipe */
let tx = 0;
lbImg.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
lbImg.addEventListener('touchend',   e => {
  const d = e.changedTouches[0].clientX - tx;
  if (Math.abs(d) > 40) d < 0 ? lbShow(cur + 1) : lbShow(cur - 1);
});

/* ── Gợi ý lời chúc ngẫu nhiên ── */
const wishes = [
  'Chúc mừng hạnh phúc! Mong hai bạn mãi yêu thương nhau, trăm năm hạnh phúc bên nhau.',
  'Chúc đôi uyên ương trăm năm bên nhau, nhà cửa êm ấm, con cái đủ đầy.',
  'Thương chúc Tuấn Hải và Thu Hà nên duyên vợ chồng, sống đời hạnh phúc viên mãn.',
  'Kính chúc hai bạn bước vào ngưỡng cửa hôn nhân với tất cả niềm vui và tình yêu thương.',
  'Chúc mừng ngày vui trọng đại! Mong hai bạn luôn là điểm tựa vững chắc cho nhau.',
  'Chúc đôi uyên ương trọn vẹn hạnh phúc, mãi mãi bên nhau và xây dựng tổ ấm.',
  'Chúc hai bạn hôn nhân viên mãn, gia đình hòa thuận, an khang thịnh vượng.',
  'Trăm năm giai ngẫu, vạn sự như ý, hạnh phúc không bao giờ phai nhạt.',
];
document.getElementById('gb-wand')?.addEventListener('click', () => {
  const ta = document.getElementById('gb-msg');
  ta.style.opacity = '0';
  setTimeout(() => {
    ta.value = wishes[Math.floor(Math.random() * wishes.length)];
    ta.style.transition = 'opacity .2s'; ta.style.opacity = '1';
  }, 130);
});

/* ── Sổ lưu bút ── */
let msgs = JSON.parse(localStorage.getItem('wb_msgs') || '[]');
const list  = document.getElementById('gb-list');
const empty = document.getElementById('gb-empty');

function renderMsgs() {
  if (!list || !empty) return;
  list.querySelectorAll('.gb-item').forEach(el => el.remove());
  if (!msgs.length) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  [...msgs].reverse().forEach(m => {
    const d = document.createElement('div');
    d.className = 'gb-item';
    d.innerHTML = `<div class="gb-item-name">${m.name}</div><div class="gb-item-msg">${m.msg}</div>`;
    list.appendChild(d);
  });
}
renderMsgs();

document.getElementById('gb-submit')?.addEventListener('click', () => {
  const name = document.getElementById('gb-name').value.trim();
  const msg  = document.getElementById('gb-msg').value.trim();
  if (!name || !msg) { alert('Vui lòng nhập tên và lời chúc!'); return; }
  msgs.push({ name, msg });
  localStorage.setItem('wb_msgs', JSON.stringify(msgs));
  document.getElementById('gb-name').value = '';
  document.getElementById('gb-msg').value  = '';
  renderMsgs();
  if (GOOGLE_SCRIPT_URL) fetch(GOOGLE_SCRIPT_URL, { method:'POST', mode:'no-cors', body: JSON.stringify({ name, msg }) }).catch(()=>{});
});

/* ── RSVP Modal ── */
const rsvpModal = document.getElementById('rsvp-modal');
document.getElementById('btn-rsvp')?.addEventListener('click', () => {
  rsvpModal?.classList.add('open'); document.body.style.overflow = 'hidden';
});
rsvpModal?.querySelector('.modal-x')?.addEventListener('click', () => {
  rsvpModal.classList.remove('open'); document.body.style.overflow = '';
});
rsvpModal?.addEventListener('click', e => {
  if (e.target === rsvpModal) { rsvpModal.classList.remove('open'); document.body.style.overflow = ''; }
});
rsvpModal?.querySelector('.modal-submit')?.addEventListener('click', () => {
  const name   = document.getElementById('rsvp-name')?.value.trim();
  if (!name) { alert('Vui lòng nhập tên!'); return; }
  const party  = document.getElementById('rsvp-party')?.value;
  const guests = document.getElementById('rsvp-guests')?.value;
  let rsvps = JSON.parse(localStorage.getItem('wb_rsvps') || '[]');
  rsvps.push({ name, party, guests, time: Date.now() });
  localStorage.setItem('wb_rsvps', JSON.stringify(rsvps));
  rsvpModal?.classList.remove('open'); document.body.style.overflow = '';
  alert(`Cảm ơn ${name}! Đã ghi nhận xác nhận tham dự. 🎉`);
});
