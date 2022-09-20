//MiniSlider
var MiniSlider = function(selector, options){
	var plugin = this;
	
	plugin.el = (typeof(selector) === 'object') ? selector : (selector.indexOf('#') >= 0) ? document.getElementById(selector.replace('#', '')) : document.querySelector(selector);
	
	if(plugin.el){
		var defaults = {
			nav: (plugin.el.getAttribute('data-nav') && plugin.el.getAttribute('data-nav') !== '') ? parseInt(plugin.el.getAttribute('data-nav')) : 0 ,
      activeSlide: (plugin.el.getAttribute('data-slide') && plugin.el.getAttribute('data-slide') !== '') ? parseInt(plugin.el.getAttribute('data-slide')) : 0 ,
      wheel: (plugin.el.getAttribute('data-wheel') && plugin.el.getAttribute('data-wheel') !== '') ? parseInt(plugin.el.getAttribute('data-wheel')) : 0 ,
      pad: (plugin.el.getAttribute('data-pad') && plugin.el.getAttribute('data-pad') !== '') ? parseInt(plugin.el.getAttribute('data-pad')) : 0 ,
      autoplay: (plugin.el.getAttribute('data-autoplay') && plugin.el.getAttribute('data-autoplay') !== '') ? parseInt(plugin.el.getAttribute('data-autoplay')) : 0 ,
      autoplayTempo: (plugin.el.getAttribute('data-autoplay-tempo') && plugin.el.getAttribute('data-autoplay-tempo') !== '') ? parseInt(plugin.el.getAttribute('data-autoplay-tempo')) : 4000 ,
      fade: (plugin.el.getAttribute('data-fade') && plugin.el.getAttribute('data-fade') !== '') ? parseInt(plugin.el.getAttribute('data-fade')) : 0 ,
		};
		
		if (typeof Object.assign != 'function') {
		  Object.assign = function(target, varArgs) { // .length of function is 2
        'use strict';
        if (target == null) { // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];
          if (nextSource != null) { // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
		  };
		}
		plugin.o = Object.assign({}, defaults, options);
    
    //animation and transition end event
    function whichAnimationEvent(){var n,i=document.createElement("fakeelement"),t={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"animationend",WebkitAnimation:"webkitAnimationEnd"};for(n in t)if(void 0!==i.style[n])return t[n]}function whichTransitionEvent(){var n,i=document.createElement("fakeelement"),t={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(n in t)if(void 0!==i.style[n])return t[n]}var animationEvent=whichAnimationEvent(),transitionEvent=whichTransitionEvent();
    // Test via a getter in the options object to see if the passive property is accessed
    var supportsPassive = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true;
        }
      });
      window.addEventListener("testPassive", null, opts);
      window.removeEventListener("testPassive", null, opts);
    } catch (e) {};
    
    var carousel = plugin.el.querySelector('.slider-carousel');
    (carousel.getAttribute('id')) ? '' : carousel.setAttribute('id', 'slider-' + Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9*Math.pow(10, 12)).toString(36));
    var carouselId = carousel.getAttribute('id');
    var curIndice;
    var nbSlide = carousel.querySelectorAll('.slide').length;
    var defaultSlide;
    var curIndex;
    var prevIndex = false;
    var autoplayInterv = false;
    var observer = false;
    
		function initConstructor() {
      plugin.o = Object.assign({}, defaults, options);
      plugin.el.querySelector('.slider').classList.add('active');
      defaultSlide = (plugin.o.activeSlide) ? plugin.o.activeSlide : 0;
      curIndex = defaultSlide;
      if(plugin.o.nav) {
        var nav = document.createElement('div');
        nav.classList.add('nav');
        nav.setAttribute('aria-label', 'Carousel navigation');
        plugin.el.appendChild(nav);
      }
      
      carousel.querySelectorAll('.slide').forEach(function(slide, index) {
        slide.setAttribute('data-index', index);
        if(plugin.o.nav) {
          var navItem = document.createElement('button');
          navItem.classList.add('nav-item');
          if(index === defaultSlide) {
            navItem.classList.add('active');
          }
          navItem.setAttribute('data-index', index);
          navItem.setAttribute('aria-controls', carouselId);
          navItem.setAttribute('aria-label', 'Carousel page ' + (index + 1));
          navItem.addEventListener('click', navClick);
          nav.appendChild(navItem);
        }
      });
      
      carousel.style.width = nbSlide * 100 + '%';
      
      if(plugin.o.fade) {
        //clone slides
        carousel.querySelectorAll('.slide').forEach(function(slide, index) {
          var clone = slide.cloneNode(true);
          clone.classList.add('slide-fade');
          clone.style.width = (100 / nbSlide) + '%';
          if(clone.getAttribute('id')) {
            clone.setAttribute('id', 'clone-' + clone.getAttribute('id'));
          }
          carousel.appendChild(clone);
          slide.style.visibility = 'hidden';
        });
        carousel.classList.add('fade');
      }
      
      gotoSlide(defaultSlide);
      majNav();
      
      var prev = document.createElement('button');
      prev.classList.add('arrow');
      prev.classList.add('prev');
      prev.setAttribute('aria-controls', carouselId);
      plugin.el.appendChild(prev);
      prev.addEventListener('click', prevBtn);
      var next = document.createElement('button');
      next.classList.add('arrow');
      next.classList.add('next');
      next.setAttribute('aria-controls', carouselId);
      plugin.el.appendChild(next);
      next.addEventListener('click', nextBtn);
      
      if(plugin.o.wheel  || plugin.o.pad) {
        plugin.el.addEventListener('wheel', sliderScrollNextPrev/*, supportsPassive ? { passive: true } : false*/);
        //plugin.el.addEventListener('wheel', noEvent);
      }
      
      plugin.el.addEventListener('touchstart', touchStart, supportsPassive ? { passive: true } : false);
      
      if(plugin.o.autoplay) {
        //autoplayInterv = setInterval(autoplay, plugin.o.autoplayTempo);
        observer = XLObserver(plugin.el, playPauseAutoplay, .1, 0); // this sets the autoplay interval
        plugin.el.addEventListener('mouseover', autoplayPause);
        plugin.el.addEventListener('mouseout', autoplayPlay);
      }
    };
    function playPauseAutoplay(elt, on, from){
      if(on){
        autoplayPlay();
      }
      else{
        autoplayPause();
      }
    };
    function autoplay() {
      plugin.nextSlide(true);
    };
    function autoplayStop() {
      if(plugin.o.autoplay) {
        clearInterval(autoplayInterv);
        autoplayInterv = false;
        plugin.o.autoplay = false;
      }
    };
    function autoplayPause() {
      clearInterval(autoplayInterv);
      autoplayInterv = false;
    };
    function autoplayPlay() {
      if(plugin.o.autoplay) {
        autoplayInterv = setInterval(autoplay, plugin.o.autoplayTempo);
      }
    };
    
    var startX;
    var moveX;
    function touchStart(e) {
      plugin.el.addEventListener('touchmove', touchMove, supportsPassive ? { passive: true } : false);
      startX = e.touches[0].clientX;
    };
    function touchMove(e) {
      moveX = e.touches[0].clientX;
      if(moveX < startX) {
        plugin.nextSlide();
        resetTouchMove();
      }
      else if(moveX > startX) {
        plugin.prevSlide();
        resetTouchMove();
      }
    };
    function resetTouchMove() {
      plugin.el.removeEventListener('touchmove', touchMove);
    };
    
    function prevBtn(e) {
      e.preventDefault();
      plugin.prevSlide();
    };
    function nextBtn(e) {
      e.preventDefault();
      plugin.nextSlide();
    };
    this.prevSlide = function() {
      curIndex --;
      if(curIndex < 0) {
        curIndex = nbSlide - 1;
      }
      majNav();
      if(plugin.o.fade) {
        if(carousel.querySelector('.slide-fade.cur')) {
          carousel.querySelector('.slide-fade.cur').classList.remove('cur');
        }
        carousel.querySelector('.slide-fade[data-index="' + curIndex +'"]').classList.add('cur');
      }
      else {
        var lg = carousel.querySelector('.slide').offsetWidth;
        //pas de transition
        carousel.style.transition = 'none';
        //translateX vers la gauche
        carousel.style.transform = 'translateX(-' + lg + 'px)';
        //déplacer last en first
        carousel.prepend(carousel.querySelector('li:last-child'));
        //transition
        setTimeout(function() {
          carousel.style.transition = '';
          carousel.style.transform = '';
          carousel.addEventListener(transitionEvent, endPrevAnim);
        }, 50);
      }
      prevIndex = curIndex;
      autoplayStop();
    };
    function endPrevAnim(event) {
      if(event.propertyName == 'transform'){
        carousel.removeEventListener(transitionEvent, endPrevAnim);
      }
    };
    this.nextSlide = function(automatic) {
      curIndex ++;
      if(curIndex >= nbSlide) {
        curIndex =  0;
      }
      majNav();
      if(plugin.o.fade) {
        if(carousel.querySelector('.slide-fade.cur')) {
          carousel.querySelector('.slide-fade.cur').classList.remove('cur');
        }
        carousel.querySelector('.slide-fade[data-index="' + curIndex +'"]').classList.add('cur');
      }
      else {
        var lg = carousel.querySelector('.slide').offsetWidth;
        //transition
        carousel.style.transition = '';
        carousel.style.transform = 'translateX(-' + lg + 'px)';
        carousel.addEventListener(transitionEvent, endNextAnim);
      }
      prevIndex = curIndex;
      if(!automatic) {
        autoplayStop();
      }
    };
    function endNextAnim(event) {
      if(event.propertyName == 'transform'){
        carousel.style.transition = 'none';
        carousel.style.transform = '';
        //déplacer last en first
        carousel.appendChild(carousel.querySelector('.slide:first-child'));
        carousel.removeEventListener(transitionEvent, endNextAnim);
      }
    };
    
    function navClick(e) {
      e.preventDefault();
      var indice = e.currentTarget.getAttribute('data-index');
      plugin.gotoSlide(indice);
    };
    
    this.gotoSlide = function(indice) {
      curIndex = parseInt(indice);
      majNav();
      carousel.querySelectorAll('.slide').forEach(function(slide, index) {
        if(slide.getAttribute('data-index') == indice) {
          gotoSlide(index);
          return;
        }
      });
      autoplayStop();
    };
    
    function gotoSlide(indice) {
      curIndice = indice;
      if(plugin.o.fade) {
        if(carousel.querySelector('.slide-fade.cur')) {
          carousel.querySelector('.slide-fade.cur').classList.remove('cur');
        }
        carousel.querySelector('.slide-fade[data-index="' + curIndex +'"]').classList.add('cur');
      }
      else {
        var lg = carousel.querySelector('.slide').offsetWidth * indice;
        //transition
        carousel.style.transition = '';
        carousel.style.transform = 'translateX(-' + lg + 'px)';
        carousel.addEventListener(transitionEvent, endGotoSlide);
      }
      prevIndex = curIndex;
    };
    function endGotoSlide(event) {
      if(event.propertyName == 'transform'){
        carousel.style.transition = 'none';
        carousel.style.transform = '';
        //replacer slides dans l'ordre
        carousel.querySelectorAll('.slide').forEach(function(slide, index) {
          var pozIndex = slide.getAttribute('data-index');
          if(index < curIndice) {
            carousel.appendChild(slide);
          }
        });
        carousel.removeEventListener(transitionEvent, endGotoSlide);
      }
    };

    function majNav() {
       if(plugin.o.nav) {
         var nav = plugin.el.querySelector('.nav');
         if(nav.querySelector('.active')) {
           nav.querySelector('.active').classList.remove('active');
         };
         nav.querySelectorAll('.nav-item').forEach(function(elt) {
           if(parseInt(elt.getAttribute('data-index')) === curIndex) {
             elt.classList.add('active');
           }
         });
       }
    };
    function sliderScrollNextPrev(e) {
      //no need e.preventDefault() cause addEventListener in passive mode
      //e.preventDefault();
      if(plugin.o.wheel) {
        //molette souris
        if (e.deltaY < 0) {
          e.preventDefault();
          plugin.prevSlide();
          sliderScrollNextPrevOnce(this);
        }
        if (e.deltaY > 0) {
          e.preventDefault();
          plugin.nextSlide();
          sliderScrollNextPrevOnce(this);
        }
      }
      if (plugin.o.pad) {
        //deux doigts sur le pad d'un ordi portable
        if (e.deltaX < 0) {
          e.preventDefault();
          plugin.prevSlide();
          sliderScrollNextPrevOnce(this);
        }
        if (e.deltaX > 0) {
          e.preventDefault();
          plugin.nextSlide();
          sliderScrollNextPrevOnce(this);
        }
      }
    };
    function noEvent(e) {
      //e.preventDefault();
    }
    function sliderScrollNextPrevOnce(that) {
      that.removeEventListener('wheel', sliderScrollNextPrev);
      setTimeout(function() {
        that.addEventListener('wheel', sliderScrollNextPrev/*, supportsPassive ? { passive: true } : false*/);
      }, 500);
    };
    initConstructor();
    
    // intersection Observer
    function XLObserver(elt, callback, threshold, onlyOnce){
      var thresholdVal;
      var obs;
      elt.onlyOnce = onlyOnce;
      function createXLObserver() {
        thresholdVal = (threshold) ? threshold : .5; // 0 dès que l'elt atteint le viewport, 1: l'elt est entièrement dans le viewport, .5: à moitié visible
        var options = {
          root: null,
          rootMargin: "0px",
          threshold: thresholdVal
        };
        obs = new IntersectionObserver(handleIntersect, options, onlyOnce);
        elt.prevRatio = 0;
        obs.observe(elt);
      }
      function killObserver(){
        obs.unobserve(elt);
      }
      createXLObserver();
      function handleIntersect(entries, observer, onlyOnce) {
        entries.forEach(
          function(entry) {
            var elt = entry.target;
            var from = (entry.boundingClientRect.top < 0) ? 'top' : 'bottom';
            callback(elt, entry.isIntersecting, from);
            if(entry.isIntersecting){
              if (entry.intersectionRatio > elt.prevRatio) {
                if(elt.onlyOnce){
                  killObserver();
                }
              }
            }
            elt.prevRatio = entry.intersectionRatio;
          }
        );
      }
      return obs;
    }
    
    //remove polyfill for IE
    [Element.prototype,CharacterData.prototype,DocumentType.prototype].forEach(function(e){e.hasOwnProperty("remove")||Object.defineProperty(e,"remove",{configurable:!0,enumerable:!0,writable:!0,value:function(){null!==this.parentNode&&this.parentNode.removeChild(this)}})});
    
    this.destroy = function() {
      //delete Events
      if(plugin.o.autoplay) {
        clearInterval(autoplayInterv);
        plugin.el.removeEventListener('mouseover', autoplayPause);
        plugin.el.removeEventListener('mouseout', autoplayPlay);
      }
      if(plugin.el.querySelector('.nav')) {
        plugin.el.querySelector('.nav').querySelectorAll('.nav-item').forEach(function(elt) {
          elt.removeEventListener('click', navClick);
        });
      }
      plugin.el.querySelector('.prev').removeEventListener('click', prevBtn);
      plugin.el.querySelector('.next').removeEventListener('click', nextBtn);
      plugin.el.removeEventListener('touchStart', touchStart);
      if(plugin.o.wheel || plugin.o.pad) {
        plugin.el.removeEventListener('wheel', sliderScrollNextPrev);
        //plugin.el.removeEventListener('wheel', noEvent);
      }
      if(observer) {
        observer.unobserve(plugin.el);
      }
      //remove elements
      plugin.el.querySelector('.prev').remove();
      plugin.el.querySelector('.next').remove();
      if(plugin.el.querySelector('.nav')) {
        plugin.el.querySelector('.nav').remove();
      }
      
      if(plugin.o.fade) {
        carousel.querySelectorAll('.slide-fade').forEach(function(f) {
          f.remove();
        });
        carousel.querySelectorAll('.slide').forEach(function(s) {
          s.style.visibility = '';
        });
      }
      //resize slider ul
      carousel.style.width = '';
      //remove active class
      plugin.el.querySelector('.slider').classList.remove('active');
      //remettre slides dans l'ordre original
      var stop = false;
      carousel.querySelectorAll('.slide').forEach(function(slide, index) {
        var pozIndex = slide.getAttribute('data-index');
        if(pozIndex > 0 && !stop) {
          carousel.appendChild(slide);
        }
        else if(pozIndex == 0) {
          stop = true;
        }
      });
    };
    
    this.restore = function() {
      initConstructor();
    }
	}
	else{
		console.log("no element declared");
	}
};

//export default RegalParallax; 
