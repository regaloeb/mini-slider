var MiniSlider=function(e,l){var s=this;if(s.el="object"==typeof e?e:0<=e.indexOf("#")?document.getElementById(e.replace("#","")):document.querySelector(e),s.el){var d={nav:s.el.getAttribute("data-nav")&&""!==s.el.getAttribute("data-nav")?parseInt(s.el.getAttribute("data-nav")):0,activeSlide:s.el.getAttribute("data-slide")&&""!==s.el.getAttribute("data-slide")?parseInt(s.el.getAttribute("data-slide")):0,wheel:s.el.getAttribute("data-wheel")&&""!==s.el.getAttribute("data-wheel")?parseInt(s.el.getAttribute("data-wheel")):0,pad:s.el.getAttribute("data-pad")&&""!==s.el.getAttribute("data-pad")?parseInt(s.el.getAttribute("data-pad")):0,autoplay:s.el.getAttribute("data-autoplay")&&""!==s.el.getAttribute("data-autoplay")?parseInt(s.el.getAttribute("data-autoplay")):0,autoplayTempo:s.el.getAttribute("data-autoplay-tempo")&&""!==s.el.getAttribute("data-autoplay-tempo")?parseInt(s.el.getAttribute("data-autoplay-tempo")):4e3,fade:s.el.getAttribute("data-fade")&&""!==s.el.getAttribute("data-fade")?parseInt(s.el.getAttribute("data-fade")):0};"function"!=typeof Object.assign&&(Object.assign=function(e,t){"use strict";if(null==e)throw new TypeError("Cannot convert undefined or null to object");for(var r=Object(e),n=1;n<arguments.length;n++){var a=arguments[n];if(null!=a)for(var i in a)Object.prototype.hasOwnProperty.call(a,i)&&(r[i]=a[i])}return r}),s.o=Object.assign({},d,l);(function(){var e,t=document.createElement("fakeelement"),r={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"animationend",WebkitAnimation:"webkitAnimationEnd"};for(e in r)if(void 0!==t.style[e])return})();var r=(function(){var e,t=document.createElement("fakeelement"),r={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(e in r)if(void 0!==t.style[e])return r[e]})(),c=!1;try{var t=Object.defineProperty({},"passive",{get:function(){c=!0}});window.addEventListener("testPassive",null,t),window.removeEventListener("testPassive",null,t)}catch(e){}var n,u,v,a,i,f=s.el.querySelector(".slider-carousel"),p=(f.getAttribute("id")||f.setAttribute("id","slider-"+Date.now().toString(36)+Math.floor(Math.pow(10,12)+9*Math.random()*Math.pow(10,12)).toString(36)),f.getAttribute("id")),y=f.querySelectorAll(".slide").length,o=!1,m=!1;function h(){s.o=Object.assign({},d,l),s.el.querySelector(".slider").classList.add("active"),u=s.o.activeSlide||0,v=u,s.o.nav&&((r=document.createElement("div")).classList.add("nav"),r.setAttribute("aria-label","Carousel navigation"),s.el.appendChild(r)),f.querySelectorAll(".slide").forEach((function(e,t){e.setAttribute("data-index",t),s.o.nav&&((e=document.createElement("button")).classList.add("nav-item"),t===u&&e.classList.add("active"),e.setAttribute("data-index",t),e.setAttribute("aria-controls",p),e.setAttribute("aria-label","Carousel page "+(t+1)),e.addEventListener("click",k),r.appendChild(e))})),f.style.width=100*y+"%",s.o.fade&&(f.querySelectorAll(".slide").forEach((function(e,t){var r=e.cloneNode(!0);r.classList.add("slide-fade"),r.style.width=100/y+"%",r.getAttribute("id")&&r.setAttribute("id","clone-"+r.getAttribute("id")),f.appendChild(r),e.style.visibility="hidden"})),f.classList.add("fade")),T(u),D();var r,n,a,e,i,t=document.createElement("button"),t=(t.classList.add("arrow"),t.classList.add("prev"),t.setAttribute("aria-controls",p),s.el.appendChild(t),t.addEventListener("click",x),document.createElement("button"));function o(e,t,r){e.forEach((function(e){var t=e.target,r=e.boundingClientRect.top<0?"top":"bottom";a(t,e.isIntersecting,r),e.isIntersecting&&e.intersectionRatio>t.prevRatio&&t.onlyOnce&&i.unobserve(n),t.prevRatio=e.intersectionRatio}))}t.classList.add("arrow"),t.classList.add("next"),t.setAttribute("aria-controls",p),s.el.appendChild(t),t.addEventListener("click",I),(s.o.wheel||s.o.pad)&&s.el.addEventListener("wheel",M),s.el.addEventListener("touchstart",L,!!c&&{passive:!0}),s.o.autoplay&&(n=s.el,a=b,t=.1,e=0,n.onlyOnce=e,i=new IntersectionObserver(o,{root:null,rootMargin:"0px",threshold:t||.5},e),n.prevRatio=0,i.observe(n),m=i,s.el.addEventListener("mouseover",g),s.el.addEventListener("mouseout",E))}function b(e,t,r){(t?E:g)()}function S(){s.nextSlide(!0)}function A(){s.o.autoplay&&(clearInterval(o),o=!1,s.o.autoplay=!1)}function g(){clearInterval(o),o=!1}function E(){s.o.autoplay&&(o=setInterval(S,s.o.autoplayTempo))}function L(e){s.el.addEventListener("touchmove",q,!!c&&{passive:!0}),a=e.touches[0].clientX}function q(e){(i=e.touches[0].clientX)<a?(s.nextSlide(),w()):a<i&&(s.prevSlide(),w())}function w(){s.el.removeEventListener("touchmove",q)}function x(e){e.preventDefault(),s.prevSlide()}function I(e){e.preventDefault(),s.nextSlide()}function O(e){"transform"==e.propertyName&&f.removeEventListener(r,O)}function C(e){"transform"==e.propertyName&&(f.style.transition="none",f.style.transform="",f.appendChild(f.querySelector(".slide:first-child")),f.removeEventListener(r,C))}function k(e){e.preventDefault();e=e.currentTarget.getAttribute("data-index");s.gotoSlide(e)}function T(e){n=e,s.o.fade?(f.querySelector(".slide-fade.cur")&&f.querySelector(".slide-fade.cur").classList.remove("cur"),f.querySelector('.slide-fade[data-index="'+v+'"]').classList.add("cur")):(e=f.querySelector(".slide").offsetWidth*e,f.style.transition="",f.style.transform="translateX(-"+e+"px)",f.addEventListener(r,j)),0}function j(e){"transform"==e.propertyName&&(f.style.transition="none",f.style.transform="",f.querySelectorAll(".slide").forEach((function(e,t){e.getAttribute("data-index");t<n&&f.appendChild(e)})),f.removeEventListener(r,j))}function D(){var e;s.o.nav&&((e=s.el.querySelector(".nav")).querySelector(".active")&&e.querySelector(".active").classList.remove("active"),e.querySelectorAll(".nav-item").forEach((function(e){parseInt(e.getAttribute("data-index"))===v&&e.classList.add("active")})))}function M(e){s.o.wheel&&(e.deltaY<0&&(e.preventDefault(),s.prevSlide(),X(this)),0<e.deltaY&&(e.preventDefault(),s.nextSlide(),X(this))),s.o.pad&&(e.deltaX<0&&(e.preventDefault(),s.prevSlide(),X(this)),0<e.deltaX&&(e.preventDefault(),s.nextSlide(),X(this)))}function X(e){e.removeEventListener("wheel",M),setTimeout((function(){e.addEventListener("wheel",M)}),500)}this.prevSlide=function(){var e;--v<0&&(v=y-1),D(),s.o.fade?(f.querySelector(".slide-fade.cur")&&f.querySelector(".slide-fade.cur").classList.remove("cur"),f.querySelector('.slide-fade[data-index="'+v+'"]').classList.add("cur")):(e=f.querySelector(".slide").offsetWidth,f.style.transition="none",f.style.transform="translateX(-"+e+"px)",f.prepend(f.querySelector("li:last-child")),setTimeout((function(){f.style.transition="",f.style.transform="",f.addEventListener(r,O)}),50)),A()},this.nextSlide=function(e){var t;y<=++v&&(v=0),D(),s.o.fade?(f.querySelector(".slide-fade.cur")&&f.querySelector(".slide-fade.cur").classList.remove("cur"),f.querySelector('.slide-fade[data-index="'+v+'"]').classList.add("cur")):(t=f.querySelector(".slide").offsetWidth,f.style.transition="",f.style.transform="translateX(-"+t+"px)",f.addEventListener(r,C)),e||A()},this.gotoSlide=function(r){v=parseInt(r),D(),f.querySelectorAll(".slide").forEach((function(e,t){e.getAttribute("data-index")==r&&T(t)})),A()},h(),[Element.prototype,CharacterData.prototype,DocumentType.prototype].forEach((function(e){e.hasOwnProperty("remove")||Object.defineProperty(e,"remove",{configurable:!0,enumerable:!0,writable:!0,value:function(){null!==this.parentNode&&this.parentNode.removeChild(this)}})})),this.destroy=function(){s.o.autoplay&&(clearInterval(o),s.el.removeEventListener("mouseover",g),s.el.removeEventListener("mouseout",E)),s.el.querySelector(".nav")&&s.el.querySelector(".nav").querySelectorAll(".nav-item").forEach((function(e){e.removeEventListener("click",k)})),s.el.querySelector(".prev").removeEventListener("click",x),s.el.querySelector(".next").removeEventListener("click",I),s.el.removeEventListener("touchStart",L),(s.o.wheel||s.o.pad)&&s.el.removeEventListener("wheel",M),m&&m.unobserve(s.el),s.el.querySelector(".prev").remove(),s.el.querySelector(".next").remove(),s.el.querySelector(".nav")&&s.el.querySelector(".nav").remove(),s.o.fade&&(f.querySelectorAll(".slide-fade").forEach((function(e){e.remove()})),f.querySelectorAll(".slide").forEach((function(e){e.style.visibility=""}))),f.style.width="",s.el.querySelector(".slider").classList.remove("active");var n=!1;f.querySelectorAll(".slide").forEach((function(e,t){var r=e.getAttribute("data-index");0<r&&!n?f.appendChild(e):0==r&&(n=!0)}))},this.restore=function(){h()}}else console.log("no element declared")};
