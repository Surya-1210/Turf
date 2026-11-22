/* ---------------- Data ---------------- */
const COURT = {
    id: 'court',
    name: 'Badminton Court',
    sport: 'Badminton',
    loc: 'Chennai',
    price: 400,
    tags: ['Wooden court', 'Floodlit', 'Singles & doubles']
};

// Operating hours: Mon–Fri 7pm–11pm, Sat–Sun 11am–8pm
function slotTimesFor(d) {
    const day = d.getDay(); // 0=Sun ... 6=Sat
    const isWeekend = (day === 0 || day === 6);
    const times = [];
    if (isWeekend) {
        for (let h = 11; h < 20; h++) times.push(String(h).padStart(2, '0') + ':00'); // 11:00–19:00 (closes 8pm)
    } else {
        for (let h = 19; h < 23; h++) times.push(String(h).padStart(2, '0') + ':00'); // 19:00–22:00 (closes 11pm)
    }
    return times;
}

function hoursLabelFor(d) {
    const day = d.getDay();
    return (day === 0 || day === 6) ? '11:00 AM – 8:00 PM' : '7:00 PM – 11:00 PM';
}

const STORE_KEY = 'floodlight_bookings_v1';
let bookings = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');

function saveBookings() {
    localStorage.setItem(STORE_KEY, JSON.stringify(bookings));
}

let state = {
    turfId: COURT.id,
    dateIdx: 0,
    selectedSlots: []
};

/* ---------------- Date helpers ---------------- */
function nextDays(n) {
    const days = [];
    const today = new Date();
    for (let i = 0; i < n; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push(d);
    }
    return days;
}
const DATES = nextDays(7);

function dateKey(d) {
    return d.toISOString().slice(0, 10);
}

function dayLabel(d) {
    return d.toLocaleDateString('en-US', {
        weekday: 'short'
    });
}

function isTaken(turfId, dKey, time) {
    return bookings.some(b => b.turfId === turfId && b.date === dKey && b.slots.includes(time) && b.status !== 'cancelled');
}

/* ---------------- Render: hero mini grid (decorative, live-ish) ---------------- */
function renderHeroGrid() {
    const grid = document.getElementById('heroMiniGrid');
    grid.innerHTML = '';
    const d0 = DATES[0];
    const dKey = dateKey(d0);
    const times = slotTimesFor(d0);
    times.slice(0, 12).forEach((time) => {
        const taken = isTaken(COURT.id, dKey, time);
        const div = document.createElement('div');
        div.className = 'mini-cell ' + (taken ? 'taken' : 'open');
        div.textContent = time;
        grid.appendChild(div);
    });
}

/* ---------------- Render: single court info card ---------------- */
function renderCourtCard() {
    const wrap = document.getElementById('courtCard');
    wrap.innerHTML = `
    <div>
      <div class="sport">${COURT.sport}</div>
      <h3>${COURT.name}</h3>
      <div class="loc">${COURT.loc}</div>
      <div class="price">₹${COURT.price} <small>/ hour</small></div>
      <div class="tags">${COURT.tags.map(tag=>`<span class="tag">${tag}</span>`).join('')}</div>
    </div>
    <div class="hours-box">
      <div class="h-tag">Opening hours</div>
      <div class="hours-row"><span>Mon – Fri</span><b>7:00 PM – 11:00 PM</b></div>
      <div class="hours-row"><span>Sat – Sun</span><b>11:00 AM – 8:00 PM</b></div>
    </div>
  `;
}

/* ---------------- Render: date strip ---------------- */
function renderDateStrip(){
  const wrap = document.getElementById('dateStrip');
  wrap.innerHTML='';
  DATES.forEach((d,i)=>{
    const chip = document.createElement('div');
    chip.className = 'date-chip' + (state.dateIdx===i ? ' active':'');
    chip.innerHTML = `<div class="d">${dayLabel(d)}</div><div class="n">${d.getDate()}</div>`;
    chip.addEventListener('click', ()=>{
      state.dateIdx = i; state.selectedSlots = [];
      renderDateStrip(); renderSlots(); renderSummary();
    });
    wrap.appendChild(chip);
  });
}

/* ---------------- Render: scoreboard slot grid ---------------- */
function renderSlots(){
  const title = document.getElementById('scoreboardTitle');
  const grid = document.getElementById('slotGrid');
  grid.innerHTML='';
  const t = COURT;
  const d = DATES[state.dateIdx];
  const dKey = dateKey(d);
  const times = slotTimesFor(d);
  title.textContent = `${t.name} — ${d.toLocaleDateString('en-US',{weekday:'long', month:'short', day:'numeric'})} · ${hoursLabelFor(d)}`;

  times.forEach(time=>{
    const taken = isTaken(t.id, dKey, time);
    const selected = state.selectedSlots.includes(time);
    const cell = document.createElement('div');
    cell.className = 'slot ' + (taken ? 'taken' : (selected ? 'selected' : 'open'));
    cell.tabIndex = taken ? -1 : 0;
    cell.innerHTML = `<div class="t">${time}</div><div class="p">${taken?'Booked':'₹'+t.price}</div>`;
    if(!taken){
      cell.addEventListener('click', ()=> toggleSlot(time));
      cell.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleSlot(time);} });
    }
    grid.appendChild(cell);
  });
}
function toggleSlot(time){
  const idx = state.selectedSlots.indexOf(time);
  if(idx>-1) state.selectedSlots.splice(idx,1); else state.selectedSlots.push(time);
  renderSlots(); renderSummary();
}

/* ---------------- Render: summary bar ---------------- */
function renderSummary(){
  const bar = document.getElementById('summaryBar');
  const n = state.selectedSlots.length;
  if(n===0 || !state.turfId){ bar.classList.remove('show'); return; }
  bar.classList.add('show');
  const t = COURT;
  document.getElementById('sumCount').textContent = n;
  document.getElementById('sumSlots').textContent = [...state.selectedSlots].sort().join(', ');
  document.getElementById('sumTotal').textContent = n * t.price;
}

/* ---------------- Booking form ---------------- */
const formOverlay = document.getElementById('formOverlay');
document.getElementById('reviewBtn').addEventListener('click', ()=>{
  if(state.selectedSlots.length===0) return;
  const t = COURT;
  const d = DATES[state.dateIdx];
  const total = state.selectedSlots.length * t.price;
  document.getElementById('formRecap').innerHTML = `
    <div><span>Court</span><b>${t.name}</b></div>
    <div><span>Date</span><b>${d.toLocaleDateString('en-US',{weekday:'short', month:'short', day:'numeric'})}</b></div>
    <div><span>Slots</span><b>${[...state.selectedSlots].sort().join(', ')}</b></div>
    <div><span>Total</span><b>₹${total}</b></div>
  `;
  formOverlay.classList.add('show');
});
function closeFormModal(){ formOverlay.classList.remove('show'); }
document.getElementById('closeForm').addEventListener('click', closeFormModal);
document.getElementById('cancelForm').addEventListener('click', closeFormModal);

/* ---------------- Supabase backend ----------------
   Paste your Project URL and anon public key below (from Supabase Project Settings > API).
   Leave them as-is and the site just runs without saving/reading real bookings. */
const SUPABASE_URL = 'https://nnejuvqbmzwergahcjim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZWp1dnFibXp3ZXJnYWhjamltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMTk4MDYsImV4cCI6MjA5OTg5NTgwNn0.4qjF0pA-DBrkr-ChavDrvEOtjM2c1My3jD0cR6_XGR0';

let supabaseClient = null;
if (SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY.length > 10) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Load existing bookings from Supabase so slots show as "Taken" for every visitor
async function loadBookingsFromSupabase(){
  if(!supabaseClient) return;
  const { data, error } = await supabaseClient.from('bookings').select('date, slots');
  if(error){ console.warn('Could not load bookings from Supabase:', error); return; }
  bookings = data.map(row => ({
    turfId: COURT.id,
    date: row.date,
    slots: row.slots.split(',').map(s=>s.trim()),
    status: 'confirmed'
  }));
  renderSlots(); renderHeroGrid(); renderSummary();
}

document.getElementById('whatsappConfirm').addEventListener('click', async ()=>{
  const t = COURT;
  const d = DATES[state.dateIdx];
  const total = state.selectedSlots.length * t.price;
  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const errBox = document.getElementById('saveError');

  if(!name || !/^[0-9]{10}$/.test(phone)){
    errBox.style.display = 'block';
    return;
  }
  errBox.style.display = 'none';

  const dateLabel = d.toLocaleDateString('en-US',{weekday:'short', month:'short', day:'numeric'});
  const dKey = dateKey(d);
  const slotsArr = [...state.selectedSlots].sort();
  const slotsLabel = slotsArr.join(', ');

  if(supabaseClient){
    const { error } = await supabaseClient.from('bookings').insert({
      name, phone, date: dKey, slots: slotsArr.join(','), total
    });
    if(error){
      console.warn('Could not save booking to Supabase:', error);
    } else {
      bookings.push({ turfId: t.id, date: dKey, slots: slotsArr, status: 'confirmed' });
    }
  }

  const msg = `Hi! I'd like to book ${t.name} on ${dateLabel} for slot(s) ${slotsLabel} — total ₹${total}. Name: ${name}, Phone: ${phone}. I've paid via Google Pay, sharing the screenshot here.`;
  window.open('https://wa.me/917867879173?text=' + encodeURIComponent(msg), '_blank');

  closeFormModal();
  state.selectedSlots = [];
  renderSlots(); renderSummary(); renderHeroGrid();
  document.getElementById('fName').value = '';
  document.getElementById('fPhone').value = '';
});

/* ---------------- Nav scroll ---------------- */
document.querySelectorAll('[data-scroll]').forEach(el=>{
  el.addEventListener('click', ()=>{
    document.getElementById(el.getAttribute('data-scroll')).scrollIntoView({behavior:'smooth'});
  });
});

/* ---------------- Init ---------------- */
renderHeroGrid();
renderCourtCard();
renderDateStrip();
renderSlots();
loadBookingsFromSupabase();
