const ITEMS = [
  {id:1, emoji:'🍌', label:'موزة', type:'organic'},
  {id:2, emoji:'🍎', label:'تفاحة', type:'organic'},
  {id:3, emoji:'🥛', label:'علبة حليب', type:'recyclable'},
  {id:4, emoji:'📦', label:'علبة كرتون', type:'recyclable'},
  {id:5, emoji:'🍬', label:'غلاف حلوى', type:'trash'},
  {id:6, emoji:'🚬', label:'رماد سجائر', type:'trash'},
  {id:7, emoji:'🥤', label:'كوب بلاستيك', type:'recyclable'},
  {id:8, emoji:'🥕', label:'جزرة', type:'organic'},
  {id:9, emoji:'🧻', label:'منديل ورقي', type:'trash'},
  {id:10,emoji:'🧴', label:'زجاجة مستحضرات', type:'recyclable'},
];

let score = 0;
let lives = 5;
let remaining = ITEMS.length;
let currentLevel = 'سهل';

const itemsContainer = document.getElementById('items');
const bins = Array.from(document.querySelectorAll('.bin'));
const scoreEl = document.getElementById('score');
const scoreSmall = document.getElementById('scoreSmall');
const livesEl = document.getElementById('lives');
const feedback = document.getElementById('feedback');
const resetBtn = document.getElementById('resetBtn');
const hintBtn = document.getElementById('hintBtn');
const showAllBtn = document.getElementById('showAllBtn');
const levelEl = document.getElementById('level');

function shuffle(arr){ return arr.slice().sort(()=>Math.random()-0.5) }
function renderItems(){
  itemsContainer.innerHTML = '';
  const shuffled = shuffle(ITEMS);
  for(const it of shuffled){
    const el = document.createElement('button');
    el.className = 'item';
    el.setAttribute('draggable','true');
    el.setAttribute('data-id', it.id);
    el.setAttribute('data-type', it.type);
    el.setAttribute('aria-label', it.label);
    el.innerHTML = `<div class="emoji">${it.emoji}</div><div class="label">${it.label}</div>`;
    itemsContainer.appendChild(el);
  }
  attachItemEvents();
}
function updateUI(){
  scoreEl.textContent = score;
  scoreSmall.textContent = score;
  livesEl.textContent = lives;
  levelEl.textContent = currentLevel;
}

let dragged = null;

function attachItemEvents(){
  const itemEls = document.querySelectorAll('.item');
  itemEls.forEach(el=>{
    el.addEventListener('dragstart', e=>{
      dragged = el;
      setTimeout(()=>el.style.opacity = '0.4', 20);
    });
    el.addEventListener('dragend', e=>{
      dragged = null;
      el.style.opacity = '1';
    });

    el.addEventListener('click', e=>{
      document.querySelectorAll('.item').forEach(x=>x.classList.remove('focused'));
      el.classList.add('focused');
    });

    el.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        document.querySelectorAll('.item').forEach(x=>x.classList.remove('focused'));
        el.classList.add('focused');
        el.focus();
      }
    });
  });
}

bins.forEach(bin=>{
  bin.addEventListener('dragover', e=>{ e.preventDefault(); bin.classList.add('over'); });
  bin.addEventListener('dragleave', e=>{ bin.classList.remove('over'); });
  bin.addEventListener('drop', e=>{
    e.preventDefault();
    bin.classList.remove('over');
    if(!dragged) return;
    checkAnswer(dragged, bin.getAttribute('data-type'));
  });
  bin.addEventListener('click', e=>{
    const focused = document.querySelector('.item.focused');
    if(focused) checkAnswer(focused, bin.getAttribute('data-type'));
  });
  bin.addEventListener('keydown', e=>{
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      const focused = document.querySelector('.item.focused');
      if(focused) checkAnswer(focused, bin.getAttribute('data-type'));
    }
  });
});

function checkAnswer(itemEl, binType){
  const itemType = itemEl.getAttribute('data-type');
  if(!itemEl || itemEl.dataset.checked) return;
  if(itemType === binType){
    score += 1;
    remaining -= 1;
    itemEl.dataset.checked = 'true';
    itemEl.style.transform = 'scale(.92)';
    itemEl.style.opacity = '0.5';
    itemEl.setAttribute('aria-hidden','true');
    showFeedback(true, 'جيد إجابة صحيحة 🎉');
  } else {
    lives -= 1;
    showFeedback(false, 'خاطئ حاول مرة أخرى');
    itemEl.classList.add('shake');
    setTimeout(()=>itemEl.classList.remove('shake'), 500);
  }
  updateUI();
  checkGameOver();
}

let feedbackTimer = null;
function showFeedback(correct, text){
  feedback.className = 'feedback show ' + (correct ? 'correct':'wrong');
  feedback.textContent = text;
  if(feedbackTimer) clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(()=>{
    feedback.className = 'feedback';
  }, 1400);
}

function checkGameOver(){
  if(remaining <= 0){
    setTimeout(()=>showEndModal(true), 400);
  } else if(lives <= 0){
    setTimeout(()=>showEndModal(false), 400);
  }
}

function showEndModal(won){
  const msg = won ? `ممتاز! لقد رتبْت كل النفايات 🎉\nنقاطك: ${score}` : `انتهت المحاولات! نقاطك: ${score}\nحاول مرة أخرى.`;
  alert(msg);
}

resetBtn.addEventListener('click', startGame);
hintBtn.addEventListener('click', ()=>{
  const remainingItems = Array.from(document.querySelectorAll('.item')).filter(i=>!i.dataset.checked);
  if(remainingItems.length === 0) return;
  const item = remainingItems[Math.floor(Math.random()*remainingItems.length)];
  const type = item.getAttribute('data-type');
  const target = document.querySelector(`.bin[data-type="${type}"]`);
  target.classList.add('over');
  setTimeout(()=>target.classList.remove('over'), 900);
});
showAllBtn.addEventListener('click', ()=>{
  document.querySelectorAll('.item').forEach(it=>{
    if(it.dataset.checked) return;
    const t = it.getAttribute('data-type');
    const hint = document.createElement('div');
    hint.style.position='absolute';
    hint.style.transform='translateY(-8px)';
    hint.style.fontSize='12px';
    hint.style.padding='4px 8px';
    hint.style.borderRadius='8px';
    hint.style.background='rgba(0,0,0,0.06)';
    hint.style.color='#6b7280';
    hint.textContent = (t === 'organic') ? 'عضوية' : (t === 'recyclable' ? 'قابلة لإعادة التدوير' : 'نفاية عادية');
    it.style.position='relative';
    const old = it.querySelector('.hintTag');
    if(old) old.remove();
    hint.className='hintTag';
    it.appendChild(hint);
  });
  setTimeout(()=>document.querySelectorAll('.hintTag').forEach(h
