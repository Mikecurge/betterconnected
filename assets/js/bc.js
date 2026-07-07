/* ============================================================
   Better Connected - shared behaviour
   Mode toggle, drawer, consent-gated analytics, scroll reveal,
   content protection, form handling.
   ============================================================ */

/* LIGHT / DARK MODE (persisted) */
(function(){
  try{
    if(localStorage.getItem('bc_mode')==='light'){document.documentElement.classList.add('light');}
  }catch(e){}
})();
function toggleMode(){
  var light=document.documentElement.classList.toggle('light');
  try{localStorage.setItem('bc_mode',light?'light':'dark');}catch(e){}
}

/* DRAWER */
function openDrawer(){document.getElementById('nav-drawer').classList.add('open');document.body.style.overflow='hidden';}
function closeDrawer(){document.getElementById('nav-drawer').classList.remove('open');document.body.style.overflow='';}

/* COOKIE CONSENT + GOOGLE CONSENT MODE v2
   Analytics loads only after explicit acceptance. */
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());
gtag('config','G-4YLLQJ19L4');
function loadAnalytics(){
  if(document.getElementById('ga-src'))return;
  var s=document.createElement('script');
  s.id='ga-src';s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id=G-4YLLQJ19L4';
  document.head.appendChild(s);
  gtag('consent','update',{analytics_storage:'granted'});
}
function initCookies(){
  var b=document.getElementById('cookie-banner');
  if(!b)return;
  var c=null;
  try{c=localStorage.getItem('bc_cookie_consent');}catch(e){}
  if(!c){b.style.display='block';}
  else if(c==='accepted'){loadAnalytics();}
}
function acceptCookies(){
  try{localStorage.setItem('bc_cookie_consent','accepted');}catch(e){}
  document.getElementById('cookie-banner').style.display='none';
  loadAnalytics();
}
function rejectCookies(){
  try{localStorage.setItem('bc_cookie_consent','essential');}catch(e){}
  document.getElementById('cookie-banner').style.display='none';
}
function showCookieSettings(){
  var b=document.getElementById('cookie-banner');
  if(b)b.style.display='block';
}

/* SCROLL REVEAL */
function initReveal(){
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}
    });
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
}

/* CONTENT PROTECTION
   Deters casual image theft and bulk copy of proprietary
   material. Documented limits: determined actors bypass
   client-side controls, so sensitive documents are never
   published to this site at all. */
function initProtection(){
  document.addEventListener('contextmenu',function(e){
    if(e.target.closest('img,svg,.protected')){e.preventDefault();}
  });
  document.addEventListener('dragstart',function(e){
    if(e.target.closest('img,svg')){e.preventDefault();}
  });
  document.addEventListener('copy',function(e){
    var sel=window.getSelection();
    if(!sel||sel.isCollapsed)return;
    var node=sel.anchorNode&&sel.anchorNode.parentElement;
    if(node&&node.closest('.protected')){
      e.preventDefault();
      return;
    }
    if(sel.toString().length>400&&e.clipboardData){
      e.preventDefault();
      e.clipboardData.setData('text/plain',
        sel.toString()+'\n\nSource: Better Connected, betterconnected.biz. '+
        'Copyright Better Connections Limited. All rights reserved.');
    }
  });
}

/* AJAX FORM SUBMIT (Formspree) */
function initForms(){
  document.querySelectorAll('form[data-bc-form]').forEach(function(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var data=new FormData(form);
      fetch(form.action,{method:'POST',body:data,headers:{'Accept':'application/json'}})
      .then(function(r){
        if(r.ok){
          form.style.display='none';
          var ok=document.getElementById(form.getAttribute('data-bc-form'));
          if(ok)ok.style.display='block';
          if(typeof gtag==='function'){gtag('event','form_submit',{form_id:form.id||'form'});}
        }else{
          alert('There was a problem sending your message. Please email info@bc-consultants.co.uk directly.');
        }
      }).catch(function(){
        alert('There was a problem sending your message. Please email info@bc-consultants.co.uk directly.');
      });
    });
  });
}

document.addEventListener('DOMContentLoaded',function(){
  initCookies();
  initReveal();
  initProtection();
  initForms();
});
