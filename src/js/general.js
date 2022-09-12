(function () {
	var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0];
 
	var windowHeight = w.innerHeight||e.clientHeight||g.clientHeight;
	var windowWidth = w.innerWidth||e.clientWidth||g.clientWidth;
	var mobileLimit = 650;
	var tabletLimit = 1000;
	var desktopLimit = 1024;
	var isMobileContext = (windowWidth < mobileLimit) ? true : false;
	var isMobileTabletContext = (windowWidth < tabletLimit) ? true : false;
	var isTabletContext = (windowWidth < tabletLimit) && (windowWidth > mobileLimit)? true : false;
	
	// No action on empty links :
	document.querySelectorAll('a[href="#"]').forEach(function(elt){
		elt.addEventListener('click',function(e) {
			e.preventDefault();
		});
	});
	
	//------------DOMLOAD		
	document.addEventListener("DOMContentLoaded", function () {
		//flag body for safari
		if(XXL.isSafari){
			document.body.classList.add('safari');
		}
    
		//wait for page to be fully loaded 
		window.addEventListener("load", function () {
			//console.log("document loaded");
		});
		
		//resizeEnd
		window.addEventListener('resizeEnd', function() {
			windowHeight = w.innerHeight||e.clientHeight||g.clientHeight;
			windowWidth = w.innerWidth||e.clientWidth||g.clientWidth;
			isMobileContext = (windowWidth < mobileLimit) ? true : false;
			isMobileTabletContext = (windowWidth < tabletLimit) ? true : false;
			isTabletContext = (windowWidth < tabletLimit) && (windowWidth > mobileLimit)? true : false;
		});
	});
})();
