function Events(){

	var defaultHTML;

    this.init = function(){

		// initKeyEvents();
        initHashEvents();
        this.initClickEvents();

        defaultHTML = $('#results').html();
    }

	var initHashEvents = function(){
		$( window ).on('hashchange',function() {
		    var hash = location.hash;
		    gEvents.loadFromHash(hash);
		});
	}

	this.initClickEvents = function(){
		$("#results a.img-hover").click(function(e) {
		    e.preventDefault();
		    var href=$(this).attr("href");
		    gEvents.updateHash(href.substr(1));
		    gEvents.loadFromHash(href);
		});

		$("#results .about-link, #home-link, #about-link").click(function(e) {
		    e.preventDefault();
		    gEvents.loadStartPage();
		    scrollToPos(0);
		    
			_paq.push(['trackEvent', 'HomeClick', 'at: '+$(this).attr('id') ]);
		});

		$("#show-all-link").click( function(e){
			e.preventDefault();
			$('#buddy-grid .hidden').slideToggle();
			$(this).fadeOut();

			_paq.push(['trackEvent', 'SlideToggle', 'Show Buddy List']);
		});

		$('#privacy-content').each (function() { $(this).css("height", $(this).height()); }).hide();

		$("#toggle-privacy-content").click( function(e){
			e.preventDefault();
			$('#privacy-content').slideToggle();
			$('#privacy-wrap').removeClass('gray');
			_paq.push(['trackEvent', 'SlideToggle', 'Toggle Privacy Content']);
		});
	
		// $('.share-buttons a').click(function(e){
		// 	e.preventDefault();
		// 	window.open (url);
		// });
	}

	this.updateHash = function(hash){
        history.pushState(null, null, '#'+hash);
	}

	this.removeHash = function(){
        //history.pushState(null, null, '');
        history.pushState("", document.title, window.location.pathname + window.location.search);
	}

	this.loadFromHash = function(hash) {
	    hash = hash.substr(1);

	    //special case 
	    if(hash == 'buddies') { toBuddyGrid(); return false;}

		_paq.push(['trackEvent', 'LoadingFromHash', 'hash: ' + hash ]);

	    //has hash
	    if(hash.length>1) $('#results .default').hide();
	    //no hash (or anchor)
	    else {gEvents.loadStartPage(); scrollToPos(0); return false;}
		
		var plantObj = $.grep(gPlantData, function(e){ return e.id == hash })[0];
		
		//plant not found -> startpage
		if(plantObj === undefined) {gEvents.loadStartPage(); scrollToPos(0); return false;}

		$('.typeahead').typeahead('val', plantObj.name);
		gPlants.load(plantObj);
		scrollToPos(0);
	}

	this.loadStartPage = function(keepHash) {
		if(!keepHash) this.removeHash();
		gInput.clearInput();
		gIsFront = true;
		gPlants.reload(defaultHTML);
	}

	var toBuddyGrid = function(){
		gEvents.loadStartPage();
		scrollToElem( '#buddy-grid-title' );
	}

	var scrollToElem = function(selector){
		var checkExist = setInterval(function() {
		   if ($(selector).length) {
		      clearInterval(checkExist);

		      $('html, body').stop().animate({
	        		scrollTop: $(selector).offset().top
	    	  }, 600);
		   }
		}, 100); // check every 100ms
	}

	var scrollToPos = function(pos) {
		$('html, body').stop().animate({
    		scrollTop: pos
		}, 600);    	
	}


	this.beforeReload = function(){
		$('body').toggleClass('front',gIsFront);
	}
	
	this.afterReload = function(){
		gEvents.initClickEvents();
		if(gIsFront) decodeMail();
	}	

	// var initKeyEvents = function(){
	// 	$(document).keydown(function(e) {
	// 		switch(e.which){    
	// 		// case 27: //esc // case 37: //left arrow // case 38: //up arrow // case 39: //right arrow // case 40: //down arrow // case  9: //fall through //case 32: //space
			
	// 		// case 13: //return
	// 		//     e.preventDefault();
	// 		//     // gInput.onEnter();
	// 		// break;

	// 		default:
	// 		break;
	// 		} //switch
	// 	});
	// }

}//Events