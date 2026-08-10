"use strict";
const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuButton=$('#menuButton'),siteNav=$('#siteNav');
menuButton.addEventListener('click',()=>{const open=siteNav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
$$('#siteNav a').forEach(a=>a.addEventListener('click',()=>{siteNav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}));

const progress=$('#scrollProgress'),trailFill=$('#trailFill');
function updateScroll(){const doc=document.documentElement;const max=doc.scrollHeight-innerHeight;const ratio=max>0?scrollY/max:0;progress.style.width=`${Math.min(100,Math.max(0,ratio*100))}%`;
 const realm=$('#realm');const r=realm.getBoundingClientRect();const h=realm.offsetHeight+innerHeight;const rr=(innerHeight-r.top)/h;trailFill.style.height=`${Math.min(100,Math.max(0,rr*100))}%`;}
addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll);updateScroll();

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.12});
$$('.reveal').forEach(el=>revealObserver.observe(el));

const berries={
 ruby:{name:'Ruby Razzleberry',title:'THE BOLD SPARK',traits:'Bold · Excitable · Passionate',region:'Razzle Ridge',power:'Razzle Blast',quote:'“Let’s light it up!”',description:'Fearless and full of momentum, Ruby turns pressure into action and leads with explosive confidence.',card:'assets/cards/ruby-card.jpg',color:'#ff405b',soft:'#ffe0e6'},
 bluebelle:{name:'Bubbly Bluebelle',title:'THE CLEVER CALM',traits:'Calm · Intelligent · Sweet',region:'Bluebelle Bay',power:'Bluebelle Brainwave',quote:'“Every puzzle has a bright side.”',description:'Bluebelle slows the chaos down, studies the board, and finds the thoughtful path through a tricky puzzle.',card:'assets/cards/bluebelle-card.jpg',color:'#3d8ff2',soft:'#deefff'},
 plumbleberry:{name:'Plumbleberry',title:'THE MOONLIT HEART',traits:'Shy · Sensitive · Mysterious',region:'Moonplum Hollow',power:'Moonplum Mystery',quote:'“Some secrets sparkle softly.”',description:'Quiet but perceptive, Plumbleberry notices hidden details and reveals secrets that everyone else might miss.',card:'assets/cards/plumbleberry-card.jpg',color:'#8650c9',soft:'#eee1ff'},
 gooseberry:{name:'Gooseberry Giggles',title:'THE WILD CARD',traits:'Goofy · Energetic · Playful',region:'Giggle Grove',power:'Giggle Bounce',quote:'“Oops… did I do that?”',description:'Gooseberry turns a stuck board into joyful chaos with bouncy, unpredictable energy and surprise opportunities.',card:'assets/cards/gooseberry-card.jpg',color:'#76b83d',soft:'#e8f6d9'},
 sunny:{name:'Sunny Goldenberry',title:'THE JOYFUL GLOW',traits:'Optimistic · Bubbly · Joyful',region:'Golden Glow Gardens',power:'Sunshine Burst',quote:'“Shine bright and keep going!”',description:'Sunny brings warmth to crowded boards, clearing space with a radiant burst and keeping the adventure bright.',card:'assets/cards/sunny-card.jpg',color:'#e8b320',soft:'#fff1bf'},
 tangerberry:{name:'Tangerberry',title:'THE CREATIVE TRAILBLAZER',traits:'Creative · Friendly · Adventurous',region:'Tangerine Trail',power:'Creative Spark',quote:'“Every idea opens a new path.”',description:'Tangerberry treats every puzzle like a blank page, inventing flexible solutions and creating special pieces.',card:'assets/cards/tangerberry-card.jpg',color:'#f48128',soft:'#ffe4c8'}
};
let activeBerry='ruby',charge=0;
function setBerry(key){activeBerry=key;charge=0;const b=berries[key];const consoleEl=$('#berryConsole');consoleEl.style.setProperty('--berry',b.color);consoleEl.style.setProperty('--berry-soft',b.soft);$('#berryCard').src=b.card;$('#berryCard').alt=`${b.name} character card`;$('#berryTitle').textContent=b.title;$('#berryName').textContent=b.name;$('#berryDescription').textContent=b.description;$('#berryTraits').textContent=b.traits;$('#berryRegion').textContent=b.region;$('#berryPower').textContent=b.power;$('#berryQuote').textContent=b.quote;$('#powerLabel').textContent=b.power.toUpperCase();$('#powerStatus').textContent=`Make matches to charge ${b.name.split(' ')[0]}’s ability.`;updateCharge();$$('.berry-chip').forEach(btn=>{const on=btn.dataset.berry===key;btn.classList.toggle('active',on);btn.setAttribute('aria-selected',String(on));});}
$$('.berry-chip').forEach(btn=>btn.addEventListener('click',()=>setBerry(btn.dataset.berry)));
function updateCharge(){const pct=Math.min(100,charge*10);$('#chargeFill').style.width=`${pct}%`;$('#chargeText').textContent=`${charge} / 10`;const ready=charge>=10;$('#activateButton').disabled=!ready;$('#activateButton').classList.toggle('ready',ready);if(ready)$('#powerStatus').textContent=`${berries[activeBerry].power} is READY!`}
$('#matchButton').addEventListener('click',()=>{if(charge<10){charge=Math.min(10,charge+2);updateCharge();smallBurst($('#matchButton'),berries[activeBerry].color,10);}});
$('#activateButton').addEventListener('click',()=>{if(charge<10)return;const b=berries[activeBerry];bigBurst($('#activateButton'),b.color);$('#powerStatus').textContent=`${b.power} ACTIVATED ✦`;charge=0;setTimeout(updateCharge,550);});

const boosters={
 rainbow:{name:'Heartberry Rainbow',type:'COLOR CONTROL',description:'Choose one color and clear every matching piece from the board at once, opening the door for huge cascades.',stars:'★★★★★',img:'assets/powerups/heartberry-rainbow.png'},
 mixup:{name:'Berry Mix-Up',type:'BOARD CONTROL',description:'Reshuffle every movable piece without spending a move. Perfect when the board has poor match options or needs a fresh layout.',stars:'★★★★☆',img:'assets/powerups/berry-mixup.png'},
 bonk:{name:'Berry Bonk',type:'PRECISION CONTROL',description:'Target one exact piece or blocker and remove it immediately. The tiny tool for that one tile ruining everything.',stars:'★★★☆☆',img:'assets/powerups/berry-bonk.png'},
 rocket:{name:'Berry Rocket',type:'LINE CONTROL',description:'Blast through an entire row or column in one sparkling launch, clearing long blocker lines and setting off cascades.',stars:'★★★★☆',img:'assets/powerups/berry-rocket.png'},
 boom:{name:'Berry Boom',type:'AREA CONTROL',description:'Detonate a heart-shaped burst around a selected tile to clear a dense cluster of pieces and obstacles.',stars:'★★★★☆',img:'assets/powerups/berry-boom.png'}
};
let activeBoost='rainbow';
function setBooster(key){activeBoost=key;const b=boosters[key];$('#boosterImage').src=b.img;$('#boosterImage').alt=`${b.name} booster`;$('#boosterType').textContent=b.type;$('#boosterName').textContent=b.name;$('#boosterDescription').textContent=b.description;$('#boosterStars').textContent=b.stars;$$('.booster-button').forEach(x=>x.classList.toggle('active',x.dataset.boost===key));}
$$('.booster-button').forEach(btn=>btn.addEventListener('click',()=>setBooster(btn.dataset.boost)));
$('#boosterDemo').addEventListener('click',()=>{bigBurst($('#boosterDemo'),'#ffd34a');const img=$('#boosterImage');if(!reduced){img.animate([{transform:'scale(1) rotate(0)'},{transform:'scale(1.2) rotate(8deg)'},{transform:'scale(.96) rotate(-5deg)'},{transform:'scale(1) rotate(0)'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)'});}});

function centerOf(el){const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
function smallBurst(el,color,count=12){const c=centerOf(el);for(let i=0;i<count;i++){const dot=document.createElement('i');dot.className='burst-dot';dot.style.left=`${c.x}px`;dot.style.top=`${c.y}px`;dot.style.setProperty('--dot',i%3===0?'#ffd34a':color);const a=Math.random()*Math.PI*2,d=35+Math.random()*75;dot.style.setProperty('--x',`${Math.cos(a)*d}px`);dot.style.setProperty('--y',`${Math.sin(a)*d}px`);$('#sparkleLayer').append(dot);setTimeout(()=>dot.remove(),900);}}
function bigBurst(el,color){smallBurst(el,color,34)}

if(!reduced){$$('[data-tilt]').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1000px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateY(-3px)`;});card.addEventListener('pointerleave',()=>card.style.transform='');});
 const hero=$('.hero-art');addEventListener('pointermove',e=>{if(innerWidth<900)return;const x=(e.clientX/innerWidth-.5)*12,y=(e.clientY/innerHeight-.5)*8;hero.style.translate=`${x}px ${y}px`;},{passive:true});}

addEventListener('keydown',e=>{if(e.key==='Escape'){siteNav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}});
