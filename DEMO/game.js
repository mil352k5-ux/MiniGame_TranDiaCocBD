(()=>{'use strict';
const canvas=document.querySelector('#game'),c=canvas.getContext('2d'),CFG=GAME_CONFIG;
const ui={veil:document.querySelector('#veil'),title:document.querySelector('#modalTitle'),sub:document.querySelector('#modalSub'),btn:document.querySelector('#mainBtn'),rules:document.querySelector('#ruleRow'),foot:document.querySelector('#modalFoot'),over:document.querySelector('#overline'),seal:document.querySelector('#seal'),round:document.querySelector('#roundStat'),stake:document.querySelector('#stakeStat'),time:document.querySelector('#timerStat'),score:document.querySelector('#scoreStat'),tide:document.querySelector('#tideText'),tideBox:document.querySelector('#tideStat'),skip:document.querySelector('#skipBtn'),cap:document.querySelector('#battleCaption'),tip:document.querySelector('#canvasTip'),pause:document.querySelector('#pauseBtn'),audio:document.querySelector('#audioBtn'),tech:document.querySelector('#techStatus')};
const paths={bg:'../BG/river_scene.svg',shore:'../BG/shore_foreground.svg',wave:'../BG/wave_strip.svg',heroIdle:'../CHR/ngo_quyen_idle.svg',heroCommand:'../CHR/ngo_quyen_command.svg',heroVictory:'../CHR/ngo_quyen_victory.svg',boat:'../PROP/enemy_ship.svg',scout:'../PROP/scout_boat.svg',stake:'../PROP/stake.svg',splash:'../VFX/splash.svg',impact:'../VFX/impact.svg'};
const img={};let assetsLoaded=0;for(let k in paths){let im=new Image();im.onload=()=>{assetsLoaded++;ui.tech.textContent=`Đã tải ${assetsLoaded}/${Object.keys(paths).length} hình`;};im.onerror=()=>{ui.tech.textContent='Thiếu tài nguyên '+k;};im.src=paths[k];img[k]=im;}
const audioFiles={click:'../SFX/click.wav',drop:'../SFX/stake_drop.wav',high:'../SFX/water_rise.wav',hit:'../SFX/collision.wav',win:'../SFX/success.wav',lose:'../SFX/lose.wav',impact:'../SFX/ship_impact.wav'};
const bgm=new Audio('../BGM/ambient_original.mp3');bgm.loop=true;bgm.volume=.30;let soundOn=true;
function sound(k){if(!soundOn||!audioFiles[k])return;const a=new Audio(audioFiles[k]);a.volume=(k==='high'?.25:.54);a.play().catch(()=>{});}
function music(){if(!soundOn){bgm.pause();return;}bgm.play().catch(()=>{});}
const S={mode:'menu',paused:false,round:0,score:0,placements:[],x:450,dir:1,drop:null,remaining:45,world:0,tideHigh:false,particles:[],battleTime:0,totalTime:0,reason:'',won:false,flash:0,hitX:0,highTideSeen:false,lastTs:0};
const maxScore=CFG.scoring.max_total; const bounds=CFG.player_reef_area;let modalAction=()=>startGame();
function rnd(){return CFG.rounds[S.round]};
function tFmt(x){return Math.ceil(Math.max(0,x))+'s'}
function configModal({title,sub,btn,action,over='CHIẾN DỊCH BẠCH ĐẰNG · NĂM 938',seal='⚔',rules=false,foot=''}){S.paused=false;ui.veil.classList.remove('hidden');ui.title.textContent=title;ui.sub.textContent=sub;ui.btn.innerHTML=btn+' <span>➜</span>';ui.over.textContent=over;ui.seal.textContent=seal;ui.rules.style.display=rules?'flex':'none';ui.foot.textContent=foot;modalAction=action;ui.pause.textContent='Ⅱ';}
function hideModal(){ui.veil.classList.add('hidden');}
function hud(){ui.round.textContent=(S.round+1)+'/5';ui.stake.textContent=S.placements.length+'/'+rnd().required;ui.time.textContent=tFmt(S.remaining);ui.score.textContent=S.score.toLocaleString('vi-VN');ui.tide.textContent=S.tideHigh?'NƯỚC DÂNG':'NƯỚC RÚT';ui.tideBox.classList.toggle('high',S.tideHigh);}
function startGame(){Object.assign(S,{mode:'playing',round:0,score:0,totalTime:0,won:false});startRound();music();}
function startRound(){S.mode='playing';S.paused=false;S.placements=[];S.drop=null;S.dir=1;S.x=bounds.x_min+50;S.remaining=rnd().time_limit;S.world=0;S.tideHigh=false;S.flash=0;S.particles=[];S.highTideSeen=false;ui.tip.style.display='block';ui.cap.style.display='none';ui.skip.style.display='none';hideModal();hud();}
function speed(){return rnd().base_speed*Math.pow(1+rnd().growth,S.placements.length)}
function onDrop(){if(S.mode!=='playing'||S.paused||S.drop)return;S.drop={x:S.x,t:0};sound('click');ui.tip.style.display='none';}
function fail(reason,collidedX=0){S.mode='fail_fx';S.failTime=0;S.reason=reason;S.won=false;S.hitX=collidedX;S.flash=.65;sound('lose');ui.tip.style.display='none';let summary=`Bạn đã cắm thành công ${S.placements.length}/${rnd().required} cọc ở vòng ${S.round+1}. Tổng điểm: ${S.score.toLocaleString('vi-VN')}. `;summary+=reason==='trung'?'Cọc mới trùng vị trí cọc cũ.':'Chưa kịp hoàn thành số cọc trước khi hết giờ.';summary+=' Có thể thử lại từ vòng 1 để cải thiện.';
 S.pendingModal={title:'TRẬN ĐỊA CHƯA HOÀN CHỈNH',sub:summary,btn:'CHƠI LẠI TỪ VÒNG 1',action:startGame,over:`ĐÃ VƯỢT ${S.round}/5 VÒNG`,seal:'✕',foot:'Lưu ý: kết quả thử thách không thay đổi sự thật lịch sử về chiến thắng Bạch Đằng năm 938.'};}
function clearRound(){S.mode='battle';S.battleTime=0;S.score+=200;sound('win');ui.cap.style.display='block';ui.skip.style.display=S.round>0?'block':'none';ui.tip.style.display='none';ui.cap.textContent='THỦY TRIỀU RÚT – QUÂN TA PHẢN CÔNG!';hud();}
function finishBattle(){if(S.mode!=='battle')return;ui.cap.style.display='none';ui.skip.style.display='none';if(S.round===4){S.mode='finished';configModal({title:'ĐẠI THẮNG BẠCH ĐẰNG',sub:`Bạn đã hoàn thành cả 5 vòng, bố trí thành công 36 cọc và đạt ${S.score.toLocaleString('vi-VN')} / ${maxScore.toLocaleString('vi-VN')} điểm! Hãy nhớ: cọc ngầm, thủy triều, nghi binh và phản công là các yếu tố quan trọng trong chiến thắng năm 938.`,btn:'CHƠI LẠI',action:startGame,over:'HOÀN THÀNH 5/5 VÒNG',seal:'★',foot:'Mốc nhận quà vòng 3 hay vòng 4 do ban tổ chức chốt sau khi kiểm thử.'});}
 else{S.mode='between';configModal({title:'VƯỢT QUA VÒNG '+(S.round+1),sub:`Bạn đã cắm đủ ${rnd().required} cọc, được thưởng 200 điểm. Tổng điểm hiện tại: ${S.score.toLocaleString('vi-VN')}. Vòng tiếp theo có nhiều cọc và cọc di chuyển nhanh hơn.`,btn:'VÀO VÒNG '+(S.round+2),action:()=>{S.round++;startRound()},over:'CHUẨN BỊ TRẬN ĐỊA MỚI',seal:'✓',foot:'Hoạt cảnh đoàn thuyền chỉ minh họa lịch sử, không tính HP hoặc sát thương.'});}}
ui.btn.addEventListener('click',()=>{sound('click');modalAction();});ui.skip.addEventListener('click',()=>{sound('click');finishBattle();});
ui.audio.addEventListener('click',()=>{soundOn=!soundOn;ui.audio.textContent=soundOn?'♫':'♪̸';music();});ui.pause.addEventListener('click',()=>{if(S.mode!=='playing')return;S.paused=!S.paused;ui.pause.textContent=S.paused?'▶':'Ⅱ';ui.cap.textContent='TẠM DỪNG – BẤM ▶ ĐỂ TIẾP TỤC';ui.cap.style.display=S.paused?'block':'none';});
canvas.addEventListener('pointerdown',(e)=>{e.preventDefault();onDrop()});window.addEventListener('keydown',(e)=>{if(e.code==='Space'){e.preventDefault();onDrop();}if(e.code==='Escape'&&S.mode==='playing'){S.paused=!S.paused;ui.pause.textContent=S.paused?'▶':'Ⅱ';ui.cap.textContent='TẠM DỪNG';ui.cap.style.display=S.paused?'block':'none';}});
function drawImg(name,x,y,w,h,alpha=1){const a=img[name];if(!a||!a.complete||!a.naturalWidth)return;c.save();c.globalAlpha=alpha;c.drawImage(a,x,y,w,h);c.restore();}
function drawStake(x,y=411,scale=1,alpha=1){c.save();c.translate(x,y);c.scale(scale,scale);drawImg('stake',-23,0,46,114,alpha);c.restore();}
function wave(t,y){c.beginPath();for(let x=0;x<=1200;x+=8){let yy=y+2*Math.sin(x*.026+t*1.9)+3*Math.sin(x*.011+t*1.3);x===0?c.moveTo(x,yy):c.lineTo(x,yy);}c.strokeStyle='rgba(210,241,235,.62)';c.lineWidth=3;c.stroke();}
function glow(x,y,r,a,col='#ffe4a0'){let g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'transparent');c.globalAlpha=a;c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.globalAlpha=1;}
function drawScene(t){c.clearRect(0,0,1200,675);drawImg('bg',0,0,1200,675);let boatMode=S.mode==='battle';if(!boatMode){drawImg('boat',975,288,134,98,.58);drawImg('boat',1102,301,80,60,.33);}drawImg('shore',0,0,280,675);
 // character animated cloak via slight sway; pose changes only when commanded
 let heroKey=boatMode?'heroCommand':S.mode==='finished'?'heroVictory':'heroIdle';let bob=Math.sin(t*1.3)*2.1;drawImg(heroKey,15,205+bob,335,366);
 // target stage lanes without separate zones
 c.strokeStyle='rgba(245,220,155,.32)';c.lineWidth=3;c.setLineDash([8,9]);c.beginPath();c.moveTo(bounds.x_min,533);c.lineTo(bounds.x_max,533);c.stroke();c.setLineDash([]);
 let highAmount=tideBlend();let waterY=456-(456-390)*highAmount;
 for(let x of S.placements) drawStake(x,405);
 if(S.mode==='battle'){let bt=S.battleTime; if(bt<2.5){drawImg('scout',600-bt*215,365+Math.sin(bt*4)*3,140,90,Math.max(0,1-bt/2.5));}let p=Math.min(1,bt/2.0);let bx=1260-600*p,by=300+Math.sin(bt*5)*5;let sink=Math.max(0,Math.min(1,(bt-2.3)/1.7));c.save();c.translate(bx+118,by+120+sink*100);c.rotate(-sink*.55);drawImg('boat',-145,-111,290,212,1-sink*.1);c.restore();if(bt>2.1&&bt<4.6){drawImg('splash',650,385,165+sink*60,125+sink*40,.95);glow(685,456,80+sink*60,.15,'#d3f7fc');}waterY=420+68*Math.min(1,Math.max(0,(bt-1.7)/1.7));}
 // Tide water overlay: opaque at high water to hide previously placed stakes
 c.save();c.beginPath();c.rect(305,Math.min(400,waterY-2),895,675-Math.min(400,waterY-2));c.clip();let grad=c.createLinearGradient(0,waterY,0,675);grad.addColorStop(0,`rgba(42,135,166,${.18+.78*highAmount})`);grad.addColorStop(.3,`rgba(14,87,125,${.20+.73*highAmount})`);grad.addColorStop(1,`rgba(8,43,81,${.33+.60*highAmount})`);c.fillStyle=grad;c.fillRect(304,waterY,898,675-waterY);c.restore();wave(t,waterY);if(S.mode==='playing'&&highAmount>.68) {c.font='800 19px system-ui';c.textAlign='center';c.fillStyle='rgba(255,229,165,.75)';c.fillText('GHI NHỚ VỊ TRÍ CỌC!',741,377);}else if(S.mode==='playing'){c.font='700 17px system-ui';c.textAlign='center';c.fillStyle='rgba(253,229,175,.8)';c.fillText('QUAN SÁT BÃI CỌC',741,377);}
 // moving/drop stake always visible in front of tide
 if(S.mode==='playing'){if(S.drop){let f=Math.min(1,S.drop.t/.36);let y=145+260*f*f;drawStake(S.drop.x,y,1,1);if(f>.7)glow(S.drop.x,495,45,(f-.7)*1.3);}else{drawStake(S.x,145);glow(S.x,145,45,.17);c.strokeStyle='rgba(255,245,181,.55)';c.lineWidth=2;c.setLineDash([4,10]);c.beginPath();c.moveTo(S.x,270);c.lineTo(S.x,359);c.stroke();c.setLineDash([]);}}
 // particles
 for(let a of S.particles){c.globalAlpha=a.life/a.max;c.fillStyle=a.color;c.beginPath();c.arc(a.x,a.y,Math.max(1,a.r*a.life/a.max),0,Math.PI*2);c.fill();}c.globalAlpha=1;
 if(S.mode==='fail_fx'&&S.reason==='trung'&&S.failTime<.65){drawImg('impact',S.hitX-67,395,134,134,Math.max(0,1-S.failTime/.65));}if(S.flash>0){c.fillStyle=`rgba(232,64,58,${Math.min(.32,S.flash*.6)})`;c.fillRect(0,0,1200,675);}c.strokeStyle='rgba(251,219,154,.48)';c.lineWidth=3;c.strokeRect(2,2,1196,671);
}
function tideBlend(){if(S.mode==='battle')return 0;let z=S.world%6;if(z<3)return 0;if(z<3.45)return (z-3)/.45;if(z<5.55)return 1;return (6-z)/.45;}
function bursts(x,y,color='#e6f8ee',amount=14){for(let i=0;i<amount;i++){let a=(i/amount)*Math.PI*2,v=80+Math.random()*110;S.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-50,r:2+Math.random()*3,life:.48+Math.random()*.28,max:.7,color});}}
function update(dt){let t=performance.now()/1000;if(S.flash>0)S.flash=Math.max(0,S.flash-dt);
 S.particles=S.particles.filter(p=>p.life>0);for(let p of S.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=160*dt;p.life-=dt;}
 if(S.paused)return;
 if(S.mode==='playing'){S.world+=dt;S.totalTime+=dt;S.remaining=Math.max(0,S.remaining-dt);let high=(S.world%6)>=3;if(high!==S.tideHigh){S.tideHigh=high;if(high)sound('high');hud();}
 if(S.drop){S.drop.t+=dt;if(S.drop.t>=.36){let x=S.drop.x;S.drop=null;let hit=S.placements.some(e=>Math.abs(x-e)<bounds.collision_threshold_px);if(hit){bursts(x,477,'#ff8a61',23);sound('hit');fail('trung',x);return;} S.placements.push(x);S.score+=100;sound('drop');bursts(x,466);if(S.placements.length>=rnd().required){clearRound();return;}ui.tip.style.display='block';hud();}}
 else{S.x+=S.dir*speed()*dt;if(S.x>=bounds.x_max){S.x=bounds.x_max;S.dir=-1;}if(S.x<=bounds.x_min){S.x=bounds.x_min;S.dir=1;}}
 if(S.remaining<=0){fail('he t gio');return;}hud();}
 else if(S.mode==='fail_fx'){S.failTime+=dt;if(S.failTime>=.82){S.mode='ended';configModal(S.pendingModal);}}
 else if(S.mode==='battle'){const prev=S.battleTime;S.battleTime+=dt;if(prev<2.2&&S.battleTime>=2.2)sound('impact');if(S.battleTime>=4.7)finishBattle();}
}
let last=0;function loop(ts){if(!last)last=ts;const dt=Math.min(.045,(ts-last)/1000);last=ts;update(dt);drawScene(ts/1000);requestAnimationFrame(loop)}
// Main-menu art scene remains visible behind start dialog; demo intentionally uses local assets only.
ui.tech.textContent='Đang tải hình SVG...';ui.rules.style.display='flex';ui.pause.textContent='Ⅱ';requestAnimationFrame(loop);
})();
