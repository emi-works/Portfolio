(()=>{const D=window.SITE,$=s=>document.querySelector(s),E=(t,c)=>{const e=document.createElement(t);if(c)e.className=c;return e};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const IC='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>';
const im=u=>u?`<i style="background-image:url('${esc(u)}')"></i>`:'Coming soon';
const S=[],C=[],app=$('#app');
const add=(n,h,raw)=>{const e=E('section','s');e.innerHTML=raw?h:`<div class="sc"><div class="in">${h}</div></div>`;e.querySelectorAll('.rv').forEach((r,i)=>r.style.setProperty('--i',i));app.appendChild(e);S.push({n,e})};
add('TOP',`<div class="nmw"><h1 class="nm rv">${esc(D.name)}</h1></div><div class="tl"><p class="ct rv">${esc(D.catch)}</p><p class="ld rv">${esc(D.lead)}</p></div>`,1);
add('PROFILE',`<p class="pf rv">${esc(D.profile)}</p>`);
let w='';D.works.forEach(g=>{w+=`<h3 class="h rv">${esc(g.g)}</h3><div class="gr rv">`;g.c.forEach(c=>{c.rm=g.rm;w+=`<button class="card" data-i="${C.length}"><span class="im">${im(c.imgs[0])}${g.rm?'<em class="rm">再現イメージ</em>':''}</span><span class="t">${esc(c.title)}</span></button>`;C.push(c)});w+='</div>';if(g.note)w+=`<p class="note rv">${esc(g.note)}</p>`});
add('WORKS',w);
add('STRENGTH',`<div class="g3">${D.strengths.map(s=>`<div class="rv"><h3 class="h">${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('')}</div>`);
add('SKILL',`<div class="sk">${D.skills.map(([a,b])=>`<div class="rv"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}</div><h3 class="h rv" style="margin-top:40px">書けるコード</h3><p class="cd rv">${D.code.map(esc).join('　／　')}</p><p class="ai rv">${esc(D.ai)}</p>`);
const F=D.form;add('CONTACT',`<form id="f" method="post" target="hf" class="rv"><input name="${F.e.name}" required aria-label="名前" placeholder="名前"><input type="email" name="${F.e.email}" required aria-label="メールアドレス" placeholder="メールアドレス"><select name="${F.e.type}" required aria-label="依頼の種類"><option value="" disabled selected>依頼の種類</option>${F.types.map(t=>`<option>${esc(t)}</option>`).join('')}</select><textarea name="${F.e.msg}" required aria-label="内容" placeholder="内容"></textarea><button class="sb" type="submit">送信する</button></form><iframe name="hf" hidden></iframe><p class="pr rv" id="st" role="status">${esc(D.privacy)}</p><p class="pr rv">© 2026 ${esc(D.name)}</p>`);
const f=$('#f');f.action=F.action;f.addEventListener('submit',e=>{if(!F.action){e.preventDefault();$('#st').textContent='【追記】送信先（GoogleフォームのURL）が未設定です。';return}setTimeout(()=>{f.reset();$('#st').textContent='送信しました。'},400)});
const ul=$('#nav ul'),mk=$('.mk'),L=$('#loc');let cur=-1,lock=0;
S.forEach((s,i)=>{const l=E('li');l.innerHTML=`<button aria-label="${s.n}"></button><span class="lb">${s.n}</span>`;l.firstChild.onclick=()=>go(i);ul.appendChild(l)});
const lis=ul.children;
function loc(t,d){const o=L.querySelector('span');if(o){o.style.transform=`translateY(${d>0?-100:100}%)`;o.style.opacity=0;setTimeout(()=>o.remove(),700)}if(!t)return;const s=E('span');s.textContent=t;s.style.transform=`translateY(${d>0?100:-100}%)`;s.style.opacity=0;L.appendChild(s);requestAnimationFrame(()=>requestAnimationFrame(()=>{s.style.transform='none';s.style.opacity=1}))}
function go(n){n=Math.max(0,Math.min(S.length-1,n));if(n===cur||lock)return;lock=1;setTimeout(()=>lock=0,1000);const d=n>cur?1:-1;cur=n;
S.forEach((s,i)=>{s.e.classList.toggle('cur',i===n);s.e.classList.toggle('up',i<n);s.e.inert=i!==n});
const sc=S[n].e.querySelector('.sc');if(sc)sc.scrollTop=0;mk.style.transform=`translateY(${n*38}px)`;[...lis].forEach((l,i)=>l.classList.toggle('cur',i===n));loc(n?S[n].n:'',d)}
go(0);
let last=0;addEventListener('wheel',e=>{if(!M.hidden)return;const t=Date.now(),fresh=t-last>200;last=t;const sc=e.target.closest('.sc'),dy=e.deltaY;
if(sc){const m=sc.scrollHeight-sc.clientHeight;if(m>2&&((dy>0&&sc.scrollTop<m-2)||(dy<0&&sc.scrollTop>2)))return}
e.preventDefault();if(fresh&&Math.abs(dy)>3)go(cur+(dy>0?1:-1))},{passive:false});
let ty=0,s0=null,st=0;addEventListener('touchstart',e=>{ty=e.touches[0].clientY;s0=e.target.closest('.sc');st=s0?s0.scrollTop:0},{passive:true});
addEventListener('touchend',e=>{if(!M.hidden)return;const dy=ty-e.changedTouches[0].clientY;if(Math.abs(dy)<60)return;
if(s0){const m=s0.scrollHeight-s0.clientHeight;if(m>2&&(Math.abs(s0.scrollTop-st)>2||(dy>0&&s0.scrollTop<m-2)||(dy<0&&s0.scrollTop>2)))return}go(cur+(dy>0?1:-1))});
const M=$('#modal');let mc,mi=0,lb=null;
function draw(fs){const c=mc,n=c.imgs.length,u=c.url,a=`href="${esc(u)}" target="_blank" rel="noopener"`;
M.innerHTML=`<div class="bx" role="dialog" aria-modal="true" aria-label="${esc(c.title)}"><button class="x" aria-label="閉じる">×</button><div class="sl"><div class="im">${im(c.imgs[mi])}${c.rm?'<em class="rm">再現イメージ</em>':''}</div>${n>1?'<button class="ar l" aria-label="前へ">‹</button><button class="ar r" aria-label="次へ">›</button>':''}</div>${n>1?`<div class="th">${c.imgs.map((x,j)=>`<button class="${j===mi?'on':''}" data-k="${j}" aria-label="${j+1}枚目"${x?` style="background-image:url('${esc(x)}')"`:''}></button>`).join('')}</div>`:'<div style="height:24px"></div>'}<h3>${u?`<a ${a}>${esc(c.name)}</a><a ${a} aria-label="開く">${IC}</a>`:esc(c.name)}</h3><h4>概要</h4><p>${esc(c.sum)}</p><h4>使った技術</h4><p>${esc(c.tech)}</p><h4>詳細</h4>${['課題','やったこと','工夫'].map((x,j)=>`<p><b>${x}</b>　${esc(c.detail[j])}</p>`).join('')}</div>`;
const q=fs&&M.querySelector(fs);if(q)q.focus()}
const close=()=>{M.hidden=true;if(lb)lb.focus()},step=d=>{mi=(mi+d+mc.imgs.length)%mc.imgs.length;draw(d>0?'.ar.r':'.ar.l')};
app.addEventListener('click',e=>{const b=e.target.closest('.card');if(b){lb=b;mc=C[+b.dataset.i];mi=0;draw('.x');M.hidden=false;M.querySelector('.x').focus()}});
M.addEventListener('click',e=>{const t=e.target;if(t===M||t.closest('.x'))return close();const a=t.closest('.ar');if(a)return step(a.classList.contains('r')?1:-1);const h=t.closest('.th button');if(h){mi=+h.dataset.k;draw(`.th [data-k="${mi}"]`)}});
addEventListener('keydown',e=>{if(!M.hidden){if(e.key==='Escape')close();else if(mc.imgs.length>1&&(e.key==='ArrowRight'||e.key==='ArrowLeft'))step(e.key==='ArrowRight'?1:-1);return}
if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
if(e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();go(cur+1)}else if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();go(cur-1)}});
})();
