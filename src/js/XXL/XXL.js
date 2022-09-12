//-------------- GENERIC FUNCTIONS
var XXL = { 
	//cookies 
	createCookie: function(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/; samesite=lax";
	},
	readCookie: function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},
	eraseCookie: function(name) {
		XXL.createCookie(name,"",-1);
	},
  //HTML for loaders
  loaderHTML: '<div class="sk-circle"><div class="sk-circle1 sk-child"></div><div class="sk-circle2 sk-child"></div><div class="sk-circle3 sk-child"></div><div class="sk-circle4 sk-child"></div><div class="sk-circle5 sk-child"></div><div class="sk-circle6 sk-child"></div><div class="sk-circle7 sk-child"></div><div class="sk-circle8 sk-child"></div><div class="sk-circle9 sk-child"></div> <div class="sk-circle10 sk-child"></div><div class="sk-circle11 sk-child"></div><div class="sk-circle12 sk-child"></div></div>',
	//sanitize inputs
	sanitizeHTML: function (str) {
		var temp = document.createElement('div');
		temp.textContent = str;
		return temp.innerHTML;
	},
	//ajaxCall
	ajaxCall: function(url, params, method, callback){
		var xhr = new XMLHttpRequest();
		var hurle = (method.toLowerCase() === 'get') ? url + '?' + params : url;
		xhr.open(method, hurle);
		//xhr.responseType = 'document';
		var postparams = (method.toLowerCase() === 'post') ? params : null;
		xhr.send(postparams);
		xhr.onreadystatechange = function () {
			var DONE = 4; // readyState 4 means the request is done.
			var OK = 200; // status 200 is a successful return.
			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {
					//console.log(xhr.responseText); // 'This is the returned text.'
					callback(xhr.responseText);
				}
				else {
					console.log('Error: ' + xhr.status); // An error occurred during the request.
					callback(xhr.status);
				}
			}
		};
	},
  isJson: function (str) {
    try {
      JSON.parse(str);
    } 
    catch (e) {
      return false;
    }
    return true;
  },
  isInViewport: function(element) {
    var rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
	//valid forms
	validateEmail: function(email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},
	regExpressions: {
		'pwd': /^[a-zA-Z0-9]{5,}$/,      /* minimum 5 caractères alphanumériques */
		'zipcode' : /^[0-9]{5}$/,      /* 5 chiffres */
		'phoneNumber' : /^[0-9]{10,}$/,      /* minimum 10 chiffres */
		'integer': /^\d+$/,      /* pas de caractères alpha */
		'email': /\S+@\S+\.\S+/,      /* e-mail simplifié */
		'empty':/^\s*$/,
    'internationalPhoneNumber': /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g, ///^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
		//'date': /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/	/* dd/mm/yyy 01 à 31/01 à 12/ 1900 à 2099*/,
		'date': /^^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/	/* yyyy-mm-dd */,
    'euroPrice': /^[0-9]*[€]+$/ /*555€*/,
    'password': /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!()*]).*$/ /* at least 8 characters that contains at least one lowercase and one uppercase ASCII character and one number and also at least one character from the set @#$%^&+=!()* */
	},
  isValidPassword: function(string){
		//returns true if string is a number
		return regExpressions.password.test(string);
	},
	isEmail: function(string){
		//returns true if string is email
		//return regExpressions.email.test(string);
		return XXL.validateEmail(string);
	},
	isEmpty: function(string){
		//returns true if string is empty
		return XXL.regExpressions.empty.test(string);
	},
	isNumber: function(string){
		//returns true if string is a number
		return XXL.regExpressions.integer.test(string);
	},
	isDate: function(string){
		//returns true if string is a date
		return XXL.regExpressions.date.test(string);
	},
  isEuroPrice: function(string){
    return XXL.regExpressions.euroPrice.test(string);
  },
  isInternationalPhoneNumber: function(string){
    return XXL.regExpressions.internationalPhoneNumber.test(string);
  }, 
  isValidPhonenumber: function(value) {
    return (/^\d{7,}$/).test(value.replace(/[\s()+\-\.]|ext/gi, ''));
  },
	// Function to animate the scroll
	runScrollAnimation: false,
	smoothScroll: function (anchor, duration, delta) {
		// Calculate how far and how fast to scroll
		var startLocation = window.pageYOffset;
		var endLocation = anchor.getBoundingClientRect().top + startLocation - delta;
		var distance = endLocation - startLocation;
		var increments = distance/(duration/16);
		var checkAnimation;
		var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0];

		// Scroll the page by an increment, and check if it's time to stop
		var animateScroll = function () {
			window.scrollBy(0, increments);
			XXL.runScrollAnimation = requestAnimationFrame(animateScroll);
			checkAnimation();
		};
		var travelled;
		var docHeight = Math.max(g.scrollHeight, e.scrollHeight, g.offsetHeight, e.offsetHeight, g.clientHeight, e.clientHeight);
		var windowHeight = w.innerHeight||e.clientHeight||g.clientHeight;
		// If scrolling down
		if ( increments >= 0 ) {
			// Stop animation when you reach the anchor OR the bottom of the page
			checkAnimation = function () {
				travelled = window.pageYOffset;
				if ( (travelled >= (endLocation - increments)) || ((windowHeight + travelled) >= docHeight) ) {
					cancelAnimationFrame(XXL.runScrollAnimation);
					window.scrollTo(0, endLocation);
					scrollingFromClick = false;
				}
			};
		}
		// If scrolling up
		else {
			// Stop animation when you reach the anchor OR the top of the page
			checkAnimation = function () {
				travelled = window.pageYOffset;
				if ( travelled <= (endLocation + increments || 0) ) {
					cancelAnimationFrame(XXL.runScrollAnimation);
					window.scrollTo(0, endLocation);
					scrollingFromClick = false;
				}
			};
		}
		// Loop the animation function
		XXL.runScrollAnimation = requestAnimationFrame(animateScroll);
	},	
	//is mobile
	isMobile: { 
		Android: function() { return navigator.userAgent.match(/Android/i); }, 
		BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); }, 
		iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, 
		Opera: function() { return navigator.userAgent.match(/Opera Mini/i); }, 
		Windows: function() { return navigator.userAgent.match(/IEMobile/i); }, 
		any: function() { return (XXL.isMobile.Android() || XXL.isMobile.BlackBerry() || XXL.isMobile.iOS() || XXL.isMobile.Opera() || XXL.isMobile.Windows()); } 
	},
	//browsers detection
	isiPad: navigator.userAgent.match(/iPad/i) != null,
	isSafari: /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)),
	isMac: navigator.platform.indexOf('Mac') > -1,
	isIEorEDGE: navigator.appName == 'Microsoft Internet Explorer' || (navigator.appName == "Netscape" && navigator.appVersion.indexOf('Edge') > -1),
	//IntersectionObserver
	//XLObserver(elt, animTextRevealCallback, .1, onlyOnce);
	XLObserver: function(elt, callback, threshold, onlyOnce){
		var thresholdVal;
		var obs;
		elt.onlyOnce = onlyOnce;
    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>onlyOnce: ", onlyOnce);
    var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0];
    var mobileLimit = 992;
		function createXLObserver() {
      var windowWidth = w.innerWidth||e.clientWidth||g.clientWidth;
      //console.log("//////////////createXLObserver(), elt: ", elt);
      //console.log("//////////////createXLObserver(), callback: ", callback);
			thresholdVal = (threshold) ? threshold : 1; // 0 dès que l'elt atteint le viewport, 1: l'elt est entièrement dans le viewport, .5: à moitié visible
      //threshol / 3 pour les mobiles
      thresholdVal = (XXL.isMobile.any() || windowWidth < mobileLimit )? thresholdVal/4 : thresholdVal;
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
					//entry.boundingClientRect, entry.intersectionRatio, entry.intersectionRect, entry.isIntersecting, entry.rootBounds, entry.target, entry.time
          //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>entry.intersectionRatio: ", entry.intersectionRatio);
          //console.log("entry.isIntersecting: ", entry.isIntersecting);
					var elt = entry.target;
          //console.log("elt.prevRatio: ", elt.prevRatio);
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
	},
	//video html5/youtube/vimeo
	playVideo: function(that){
    //close all playing video if exist
    if(document.querySelectorAll('.videoIsPlaying')){
      document.querySelectorAll('.videoIsPlaying').forEach(function(elt){
        elt.classList.remove('videoIsPlaying');
        elt.querySelector('.close').removeEventListener('click', closeVideoPlayer);
        elt.removeChild(elt.querySelector('.embed'));
      });
    }
		var iframe = false;
		var emb = document.createElement('div');
		emb.classList.add('embed');
		var videoId = that.getAttribute('data-video');
		var videoPoz = that.getAttribute('data-video-poz');
		var class_list = (videoPoz) ? videoPoz : '';
		// test if youtube or vimeo url
		var id = videoId.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
		if(id){
			if (id[3].indexOf('youtu') > -1) {
				iframe = '<iframe src="https://www.youtube.com/embed/' + id[6] + '?rel=0&wmode=transparent&autoplay=1" frameborder="0" class="' + class_list + '" allowfullscreen></iframe>';
			} else if (id[3].indexOf('vimeo') > -1) {
				iframe = '<iframe src="https://player.vimeo.com/video/' + id[6] + '?autoplay=1" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" frameborder="0" class="' + class_list + '"></iframe>';
			}
			if(iframe){
				emb.innerHTML = iframe;
			}
		}
		//else local mp4 video
		else if(videoId.indexOf('.mp4') >= 0){
			var vid = document.createElement('video');
			vid.setAttribute('src', videoId);
			vid.setAttribute('controls', '');
			vid.setAttribute('autoplay', '');
			vid.setAttribute('playsinline', '');
			if(class_list) vid.classList.add(class_list);
			emb.appendChild(vid);
		}
		
		else{
			throw new Error('Video URL not supported.');
		}
		var cloz = document.createElement('a');
		cloz.classList.add('close-video');
		cloz.setAttribute('href', '#');
		cloz.innerHTML = '<span class="cross"><svg viewBox="0 0 24 24"><use xlink:href="#svg-close"></use></svg></div>';
		emb.prepend(cloz);
    var videoCont = document.body; //that.closest('.media');
		videoCont.style.position = 'relative';
		videoCont.appendChild(emb);
		videoCont.classList.add('videoIsPlaying');
		cloz.addEventListener('click', closeVideoPlayer);
    function closeVideoPlayer(e){
      e.preventDefault();
      if(e.currentTarget.closest('.videoIsPlaying')){
				var videoPlayer = e.currentTarget.closest('.videoIsPlaying');
				videoPlayer.classList.remove('videoIsPlaying');
				videoPlayer.removeChild(videoPlayer.querySelector('.embed'));
        e.currentTarget.removeEventListener('click', closeVideoPlayer);
			}
    }
	},
	//empty a node
	emptyNode: function(node){
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	},
	//remove an elt
	removeElt: function(elt){
		if (elt.parentNode) {
			elt.parentNode.removeChild(elt);
		}
	},
	openPopin: function(id){
		document.querySelector('#popin-mask').classList.remove('closed');
		document.querySelector('#popin-mask').classList.add('open');
		var zepop = document.querySelector(id);
		zepop.classList.remove('closed');
		zepop.classList.add('open');
		document.body.classList.add('no-overflow');
		//aspect-ratio
		if(zepop.getAttribute('data-aspect-ratio') && zepop.getAttribute('data-aspect-ratio') !== ''){
			var ratio = parseFloat(zepop.getAttribute('data-aspect-ratio'));
			var w = parseFloat(window.getComputedStyle(zepop).width);
			zepop.style.height =  (w * ratio) + 'px';
		}
		//close
		var cloz = document.querySelector(id).querySelectorAll('.js-close-popin');
		cloz.forEach(function(elt){
			elt.addEventListener('click', function(e){
				e.preventDefault();
				var pop = e.currentTarget.closest('.popin');
				if(pop.querySelector('.embed')){
					XXL.emptyNode(pop.querySelector('.embed'));
				}
				document.querySelector('#popin-mask').classList.remove('open');
				document.querySelector('#popin-mask').addEventListener(transitionEvent, maskCallback);
				function maskCallback(event) {
					document.querySelector('#popin-mask').removeEventListener(transitionEvent, maskCallback);
					document.querySelector('#popin-mask').classList.add('closed');
				}
				pop.classList.remove('open');
				pop.addEventListener(transitionEvent, popinCallback);
				function popinCallback(event) {
					pop.removeEventListener(transitionEvent, popinCallback);
					pop.classList.add('closed');
					pop.style.height = 'auto';
					document.body.classList.remove('no-overflow');
				}
			});
		});
	},
	closePopin: function(id){
		var zepop = document.querySelector(id);
		if(zepop.querySelector('.embed')){
			XXL.emptyNode(pop.querySelector('.embed'));
		}
		document.querySelector('#popin-mask').classList.remove('open');
		document.querySelector('#popin-mask').addEventListener(transitionEvent, maskCallback);
		function maskCallback(event) {
			document.querySelector('#popin-mask').removeEventListener(transitionEvent, maskCallback);
			document.querySelector('#popin-mask').classList.add('closed');
		}
		zepop.classList.remove('open');
		zepop.addEventListener(transitionEvent, popinCallback);
		function popinCallback(event) {
			zepop.removeEventListener(transitionEvent, popinCallback);
			zepop.classList.add('closed');
			zepop.style.height = 'auto';
			document.body.classList.remove('no-overflow');
		}
	}
}

//export default XXL;