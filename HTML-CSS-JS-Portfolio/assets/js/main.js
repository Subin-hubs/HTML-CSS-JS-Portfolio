// Site main behaviors: projects data, modal, contact form, reveal observer

// CONTACT FORM (uses EmailJS that's loaded in head)
function submitForm() {
    const n = document.getElementById('cf-name').value.trim();
    const em = document.getElementById('cf-email').value.trim();
    const sub = document.getElementById('cf-subject').value.trim();
    const m = document.getElementById('cf-message').value.trim();
    const btn = document.querySelector('.form-submit');
    if (!n || !em || !sub || !m) { alert('Please fill all fields'); return }
    btn.innerHTML = 'Sending...'; btn.disabled = true;
    emailjs.send('service_y4t7prr', 'template_e4ks0ok', { from_name: n, from_email: em, subject: sub, message: m })
        .then(res => { document.getElementById('contactForm').style.display = 'none'; document.getElementById('formSuccess').style.display = 'block'; })
        .catch(err => { console.log('EMAILJS ERROR:', err); alert('Failed to send message') })
        .finally(() => { btn.innerHTML = 'Send Message'; btn.disabled = false });
}
function resetForm() { document.getElementById('contactForm').style.display = 'block'; document.getElementById('formSuccess').style.display = 'none'; document.getElementById('cf-name').value = ''; document.getElementById('cf-email').value = ''; document.getElementById('cf-subject').value = ''; document.getElementById('cf-message').value = ''; }

// Projects & certs data (kept minimal — copy from original)
const projects = {
    fb: { image: 'assets/projects/facebook.jpg', bg: 'linear-gradient(135deg,#4af080,#2db860)', title: 'Facebook Clone App', desc: 'A full-featured social media application...', features: ['Email/password & Google OAuth via Firebase Auth', 'Real-time posts feed with Firestore listeners'], stack: ['Flutter', 'Dart', 'Firebase Auth', 'Firestore'], github: '#', demo: null },
    portfolio: { image: 'assets/projects/portfolio.jpeg', bg: 'linear-gradient(135deg,#4af0b0,#2dc8e8)', title: 'Portfolio Website', desc: 'A personal portfolio with a clean, minimalist design philosophy.', features: ['Smooth scroll navigation', 'Responsive design'], stack: ['HTML', 'CSS', 'JavaScript'], github: '#', demo: 'https://subintamang.vercel.app' }
};

const certs = {
    flutter: { imageSrc: 'assets/project/Br.jpeg', emoji: '🎯', bg: 'linear-gradient(135deg,#0468d7,#02a9f4)', title: 'Flutter Development Certificate', issuer: 'Broadway Infosys', issued: '2023', desc: 'Completed an intensive Flutter development training.' },
    python: { imageSrc: 'assets/project/python.png', emoji: '🐍', bg: 'linear-gradient(135deg,#3776ab,#ffd343)', title: 'Python (Problem Solving) Certificate', issuer: 'HackerRank', issued: '2023', desc: 'Earned the HackerRank Python certification.' }
};

function showModal() { document.getElementById('modal').classList.add('open'); document.body.style.overflow = 'hidden' }
function closeModal() { document.getElementById('modal').classList.remove('open'); document.body.style.overflow = '' }
function closeModalOuter(e) { if (e.target === document.getElementById('modal')) closeModal() }

function openProjectModal(key) {
    const p = projects[key]; if (!p) return;
    const thumb = document.getElementById('modalThumb'); thumb.style.background = p.bg || '#0b0c0f'; thumb.innerHTML = p.image ? `<img src="${p.image}" style="display:block;width:100%;height:100%;object-fit:cover;" />` : '';
    const feats = (p.features || []).map(f => `<li>${f}</li>`).join(''); const stack = (p.stack || []).map(s => `<span class="stack-tag">${s}</span>`).join(''); const demo = p.demo ? `<a href="${p.demo}" target="_blank" class="btn-sm btn-sm-accent"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : '';
    document.getElementById('modalContent').innerHTML = `
    <div class="modal-title">${p.title}</div>
    <p class="modal-desc">${p.desc}</p>
    <div class="modal-features-title">Key Features</div>
    <ul class="modal-features">${feats}</ul>
    <div class="modal-features-title" style="margin-top:4px">Tech Stack</div>
    <div class="modal-stack">${stack}</div>
    <div class="modal-actions">${demo}<a href="${p.github}" target="_blank" class="btn-sm btn-sm-ghost"><i class="fab fa-github"></i> GitHub</a></div>`;
    showModal();
}

function openCertModal(key) {
    const c = certs[key]; if (!c) return; const thumb = document.getElementById('modalThumb'); if (c.imageSrc) { thumb.style.background = '#0b0c0f'; thumb.innerHTML = `<img src="${c.imageSrc}" alt="${c.title}" />`; } else { thumb.style.background = c.bg; thumb.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;width:100%;padding:20px;text-align:center"><span style="font-size:5rem">${c.emoji}</span><div style="font-size:.65rem;color:rgba(255,255,255,.45);letter-spacing:.1em;text-transform:uppercase;font-family:var(--ff-mono);line-height:1.6">Add your certificate<br/>image to see it here</div></div>` }
    const skills = (c.skills || []).map(s => `<span class="stack-tag">${s}</span>`).join('');
    document.getElementById('modalContent').innerHTML = `
    <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(74,240,176,.1);border:1px solid rgba(74,240,176,.3);padding:4px 12px;border-radius:100px;font-size:.72rem;font-weight:600;color:var(--accent);letter-spacing:.07em;text-transform:uppercase"><i class="fas fa-check-circle"></i> Verified Credential</div>
    <div class="modal-title">${c.title}</div>
    <div style="display:flex;gap:24px;flex-wrap:wrap">
      <div><div class="modal-features-title">Issued By</div><div style="font-size:.9rem;font-weight:600;margin-top:4px">${c.issuer}</div></div>
      <div><div class="modal-features-title">Year</div><div style="font-size:.9rem;font-weight:600;margin-top:4px">${c.issued}</div></div>
    </div>
    <p class="modal-desc">${c.desc}</p>
    <div class="modal-features-title">Skills Covered</div>
    <div class="modal-stack">${skills}</div>
    <div class="modal-actions">
      <a href="${c.verifyUrl || '#'}" target="_blank" class="verify-btn"><i class="fas fa-shield-alt"></i> Verify Certificate</a>
      <a href="${c.viewUrl || '#'}" target="_blank" class="btn-sm btn-sm-ghost"><i class="fas fa-external-link-alt"></i> View Online</a>
    </div>`;
    showModal();
}

// Reveal observer
const io = new IntersectionObserver((entries) => { entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 80); io.unobserve(e.target) } }); }, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// close modal on ESC
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal() });

