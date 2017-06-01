/*
 *
 * Gravoscope v0.1.1
 *
 * Written by Chris North for the Planck Royal Society Summer Science Exhibition 2013 as an educational resource.
 *
 * This application requires Chromoscope v1.4.3. It will run locally or on a web server. To run locally you will need to download the appropriate tile sets and code.
 *
 * Functions in v0.0.1
 *   Based originally on Planckoscope v0.1.2
 */

function setupGravoscope(){
    $('#kiosk').disableTextSelect();
    chromo.gravversion='0.0.1 (BETA)';
    logging=false;
    if (logging) console.log(chromo.compact);
    $(chromo.body+' .grav_version').html(chromo.phrasebook.version+" "+chromo.gravversion);

    //add coordinates form
    // if (!(chromo.compact)){
	// $(chromo.body+" .chromo_helplink").append(' | <span id="coord_form"><button onclick="chromo.moveMap(parseInt(glong.value), parseInt(glat.value));">Center Map:</button><span>lon:</span><input type="text" name="glong" id="glong" value="0"><span>lat:</span><input type="text" name="glat" id="glat" value="0"> | <button onclick="chromo.reset();glat.value=0;glong.value=0">Reset</button></span>');
    // };
    //$(chromo.body+" .chromo_message").delay(50).fadeOut(700)
    //chromo.buildHelp(true);
    //animate options panel
    //process overlays
    //chromo.processOverlays();


    //*******************
    //re-register keys
    //*******************
    chromo.reregisterKey('.',function(){
	//reregister hide keys ton include kiosk and overlay
	$(this.body+" h1").toggle();
	$(this.body+" h2").toggle();
	$(this.body+" .chromo_message").hide();
	$(this.body+" .chromo_layerswitcher").toggle();
	$(this.body+" .chromo_helplink").toggle();
	$(this.body+" .chromo_help").hide();
	$(this.body+" .chromo_info").hide();
	$(this.body+" .chromo_pingroups_list").toggle();
	$(this.body+" .chromo_title").toggle();
	$(this.body+" #kiosk").toggle();
	$(this.body+" #overlay").toggle();
	$(this.body+" #coord_form").toggle();
    });

    chromo.registerKey(38,function(){ // user presses the down arrow key  (37 was left)
	this.changeWavelength(-this.wavelength_speed/2);
	this.checkTiles();
	this.changeWavelength(-this.wavelength_speed/2);
	this.checkTiles();
    }).registerKey(40,function(){ // user presses the up arrow key  (39 was right)
	this.changeWavelength(this.wavelength_speed/2);
	this.checkTiles();
	this.changeWavelength(this.wavelength_speed/2);
	this.checkTiles();
    })

    chromo.reregisterKey("[",function(){
	//decrease wavelength by one step
	this.changeWavelength(-0.25);
	this.checkTiles();
	this.changeWavelength(-0.25);
	this.checkTiles();
	if (logging) console.log('decrease wavelength by 1 step');
    }).reregisterKey("]",function(){
	//increase wavelength by one step
	this.changeWavelength(+0.25);
	this.checkTiles();
	this.changeWavelength(+0.25);
	this.checkTiles();
	if (logging) console.log('increase wavelength by 1 step');
    });

    chromo.reregisterKey(45,function(){ // user presses the - (45 for Firefox)
	//decrease magnification
	this.changeMagnification(-1);
    });
    chromo.reregisterKey('c',function(){
	//toggle constellation layers
	chromo.toggleAnnotationsByName('c');
	chromo.checkTiles(true)
	//console.log('toggled labels');
	if($('#kiosk #options #option-const .on-off').hasClass("off")){
	    $('#kiosk #options #option-const .on-off').removeClass("off").addClass("on");
    }else if($('#kiosk #options #option-const .on-off').hasClass("on")){
	    $('#kiosk #options #option-const .on-off').removeClass("on").addClass("off");};
    },'toggle constellation labels')

    chromo.reregisterKey('l',function(){
	//toggle grav labels
	chromo.toggleAnnotationsByName('l');
	chromo.checkTiles(true)
	//console.log('toggled grav');
	if($('#kiosk #options #option-labels .on-off').hasClass("off")){
	    $('#kiosk #options #option-labels .on-off').removeClass("off").addClass("on");
    }else if($('#kiosk #options #option-labels .on-off').hasClass("on")){
	    $('#kiosk #options #option-labels .on-off').removeClass("on").addClass("off");};
    },'toggle grav labels')


    chromo.reregisterKey('#',function(){
	//toggle overlay and options (for Wii stuff)
	if($('#kiosk .minmax').hasClass("max")){
	    toggleOptions('min');
	    toggleOverlay('off');
	}else{
	    toggleOptions('max');
	    toggleOverlay('max');
	};
    });

    //turn off annotations (normal labels already turned off)
    for(var i=0 ; i < chromo.annotations.length ; i++){
	var character = chromo.annotations[i].key;
	if (character != 'l') chromo.toggleAnnotationsByName(character)
	//console.log('turn off annotation ',character);
    };


    /*************************************/
    // Get kiosk size and placement etc.
    /*************************************/

    var kskow=Math.round(parseInt($(chromo.body+' #kiosk #options').width()));
    var kskh=Math.round(parseInt($(chromo.body+' #kiosk').height()));
    if (logging) console.log('kiosk options:',kskow,kskh);
    chromo.kskw=Math.round(parseInt($(chromo.body+' #kiosk').width()));

    //set left positions of kiosk based on width (in em units)
    chromo.ksklmn=-11.5;
    chromo.ksklmx=-1;

    if (logging) console.log('ksklmn,ksklmx:',chromo.ksklmn,chromo.ksklmx);
    lnk=$('.switch-link').attr("href");
    $('.switch-link').attr("href",lnk+"?showintro=false&compact="+chromo.compact);

    //********************************
    //make options buttons in overlay
    //********************************

    chromo.nann=0;
    for (var i=0 ; i < chromo.annotations.length ; i++){
	if (!isOverlay(chromo.annotations[i].key)) chromo.nann++ ;
    };
    chromo.nov = chromo.annotations.length - chromo.nann;
    //chromo.nov = 8;
    if (chromo.nov >0){


	//set up columns
	var colmax=2;
	var ovwid=Math.round(parseInt($(chromo.body+' #overlay').width()));
	if (chromo.nov > colmax) ncol=2;
	if (chromo.nov > 2*colmax) ncol=3;
	//console.log(chromo.nov/colmax,Math.ceil(chromo.nov/colmax));
	var ncol=Math.ceil(chromo.nov/colmax);

	//create columns
	var coll=0.
	for (var c=0;c<ncol;c++){
	    colid='col'+(c+1);
	    coll=0;
	    $(chromo.body+' #overlay #options').append('<div class="column" id="'+colid+'" style="top:0px"></div>');
	    coll=Math.round(parseInt($(chromo.body+' #overlay #options #'+colid).position().left));
	    colw=Math.round(parseInt($(chromo.body+' #overlay #options #'+colid).width()));
	    colpr=Math.round(parseInt($(chromo.body+' #overlay #options #'+colid).css('padding-right')));
	    coll=16+c*(9.5); //move column right (in em units)
	    $(chromo.body+' #overlay #options #'+colid).css({left:coll+'em'});
	};
	chromo.ovcolw=colw+colpr;

	//resize overlay box
	ovw=20+(ncol*9);//width in em
	$(chromo.body+' #overlay').css({width:ovw+'em'});
	if (logging) console.log('ovw',ovw);

	chromo.ovloff=-ovw-2;
	chromo.ovlmx=-1;
	chromo.ovlmn=-22.5;
	$(chromo.body+' #overlay').css({left:chromo.ovloff+'em'});

    //remove attribution and put inside wrapper
    $(chromo.body+' .chromo_attribution').remove();
    $(chromo.body).append('<div class="chromo_attribution_wrapper"><div class="chromo_attribution"></div></div>');
    chromo.updateCredit();

    //set overlay credits text
    chromo.overlaynumber={};
	//add overlay buttons
	var ovx=0;
	var colid='col1'
        for (var i=0 ; i < chromo.annotations.length ; i++){
	    if (isOverlay(chromo.annotations[i].key)){
		ovx++;
		colid='col'+Math.ceil(ovx/colmax);
		//console.log(ovx,colid);
		//if (ovx > colmax) colid='col2';
		divclass="option";
		divid="option-"+chromo.annotations[i].name;
		infoid="info-"+chromo.annotations[i].name;
		chromo.annotations[i].divid=divid;
		chromo.annotations[i].infoid=infoid;
		$(chromo.body+' #overlay #'+colid).append('<div id="'+divid+'" class="'+divclass+'">');
		$(chromo.body+' #overlay #'+colid+' #'+divid).append('<div class="on-off off"></div>');
		$(chromo.body+' #overlay #'+colid+' #'+divid).append('<div class="label">'+chromo.annotations[i].title+'</div>');
		$(chromo.body+' #overlay #'+colid+' #'+divid+' .label').disableTextSelect();
        //add overlay credit
        if( $(chromo.body+' .chromo_attribution_wrapper #credit_'+chromo.annotations[i].attribution).length == 0){
            $(chromo.body+' .chromo_attribution_wrapper').append('<div class="chromo_attribution_overlay" id="credit_'+chromo.annotations[i].attribution+'">'+chromo.overlaycredits[chromo.annotations[i].attribution]+' &amp;</div>');
        }
        chromo.overlaynumber[chromo.annotations[i].attribution]=0;
		//sort out what happens on clicking the button
		$(chromo.body+' #overlay #'+colid+' #'+divid).click(function(){
		    //var srchid=$(chromo.body+' #overlay #'+colid+' #'+divid).id;
		    var srchid=this.id;
		    //console.log('looking for:',srchid);
		    for (var j=0 ; j < chromo.annotations.length ; j++){
			if (chromo.annotations[j].divid == srchid){
			    chromo.simulateKeyPress(chromo.annotations[j].key);
			    if ($(chromo.body+' #overlay #'+srchid+' .on-off').hasClass("off")){
				    $(chromo.body+' #overlay #'+srchid+ ' .on-off').removeClass("off").addClass("on");
                    chromo.overlaynumber[chromo.annotations[j].attribution]++;
                    $(chromo.body+' #credit_'+chromo.annotations[j].attribution).show();
			    }else{
				    $(chromo.body+' #overlay #'+srchid+' .on-off').removeClass("on").addClass("off");
                    chromo.overlaynumber[chromo.annotations[j].attribution]--;
                    if (chromo.overlaynumber[chromo.annotations[j].attribution]==0){
                        $(chromo.body+' #credit_'+chromo.annotations[j].attribution).hide();
                    }
			    };
			};
		    };
		});

		//add info button
		$(chromo.body+' #overlay #'+colid).append('<div class="info" id="'+infoid+'">');
		$(chromo.body+' #overlay #'+colid+" #"+infoid).click(function(){
		    var srchid='more'+this.id;
		    //console.log('toggling',srchid,$(chromo.body+' #'+srchid).css('display'));
		    if ($(chromo.body+' #'+srchid).css('display')=='none'){
			$(chromo.body+' #'+srchid).show();
		    }else{
			$(chromo.body+' #'+srchid).hide();
		    }
		});

	    };
	};

	//add overlay info
	$(chromo.body+' .overlay_info').each(function(){
	    srchid=this.id;
	    //console.log(srchid);
	    $(this).prepend(chromo.createClose());
	    //$(this.body+" .chromo_close").bind('click',{id:'overlay_info'}, jQuery.proxy( this, "hide" ) );
        $(chromo.body+' #'+srchid+' .chromo_close').on('click',{id:srchid},function(event){$(chromo.body+' #'+event.data.id).hide();});
	    if (chromo.wide < $(this).width()) $(this).css("width",w-50+"px");
	    //console.log(this,$(this).width());
	    chromo.centreDiv("#"+srchid)

	});

	//********************************
	//make options buttons in overlay
	//********************************
	//add opacity changer
	$(chromo.body+' #overlay #options').append('<div id="opcol" class="column"></div>');
	//centre it wrt other columns
	opleft=16+9.5*(ncol-1)/2;
	if (logging) console.log(opleft);
	$(chromo.body+' #overlay #options #opcol').css({left:opleft+'em'});

	//add content
	$(chromo.body+' #overlay #options #opcol').append('<div class="option" id="opacity"></div>');
	$(chromo.body+' #overlay #options #opcol .option').append('<div class="on-off null"></div>');
	$(chromo.body+' #overlay #options #opcol .option').append('<div class="op-pm"><div class="op-plus">+</div><div class="op-minus">-</div></div>')
	$(chromo.body+' #overlay #options #opcol .option').append('<div class="label">Opacity: <span class="opval">40</span>%</div>');
	$(chromo.body+' #overlay #options #opcol #opacity .label').click(function(){
	    if (logging) console.log('opacity reset');
	    resetOpacity();
	});
	$(chromo.body+' #overlay #options #opcol .option .op-minus').click(function(){
	    if (logging) console.log('opacity minus');
	    changeOpacity(-10);
	});
	$(chromo.body+' #overlay #options #opcol .option .op-plus').click(function(){
	    if (logging) console.log('opacity plus');
	    changeOpacity(+10);
	});

	//toggleOverlay();


    }

    //toggleOverlay();
    chromo.defaultOpacity=60; //default opacity for overlays
    resetOpacity(); //reset opacities to default value


    //////////////////////////////////
    // ADDITIONAL OVERLAY FUNCTIONS
    //////////////////////////////////

    function isOverlay(key){
	//check if a layer is an overlay layer or an annotation layer
	//flase if key is 'c' or 'p', true otherwise
	if (key == 'l' || key == 'c') return false;
	return true;
    }
    //set mouse click events options

    function showOverlayInfo(infoid){
	//show info for overlay layer
	$(chromo.body+' #'+infoid).show();
	//console.log('showing info',infoid);
    }
    function hideOverlayInfo(infoid){
	$(chromo.body+' #'+infoid).hide();
	//console.log('hiding info',infoid);
    }

    function changeOpacity(dOp){
	//change the opacity of an overlay layer by dOp (in %)

	opLabel=$(chromo.body+' .opval').text();
	opVal=parseInt(opLabel)
	if (logging) console.log('label value: ',opVal);
	//calculate new opacity
	newOp=Math.round(opVal+dOp);
	//limit to range {0:1}
	if (newOp <= 10){newOp=10}
	if (newOp >= 100){newOp=100}
	for (var i=0; i < chromo.annotations.length; i++){
	    if (isOverlay(chromo.annotations[i].key)) {
		//get current opacity of layer (0 if not shown)
		var currOp=Math.round(parseFloat(getOpacity($(chromo.body+" ."+chromo.annotations[i].name)))*100);
		//get stored opacity of layer
		annOp=Math.round(parseFloat(chromo.annotations[i].opacity)*100)
		if (logging) console.log('current: ',chromo.annotations[i].name, annOp, currOp);
		//change opacity for all overlay layers
		//chromo.annotations[i].opacity=newOp;
		$(chromo.body+' .opval').text(newOp);
		if(Math.abs(currOp-annOp)<1){
		    //if overlay is shown, set opacity
		    setOpacity($(chromo.body+' .'+chromo.annotations[i].name),newOp/100);
		    chromo.annotations[i].opacity=newOp/100;
		    if (logging) console.log('changing: ',chromo.annotations[i].name,currOp,'->',newOp);
		}else{
		    if (logging) console.log('not shown')
		    //change anyway
		    chromo.annotations[i].opacity=newOp/100;
		};
	    };
	};
    }


    function resetOpacity(){
	//reset opacity to default
	defOp=chromo.defaultOpacity //default opacity
	for (var i=0; i < chromo.annotations.length; i++){
	    if (isOverlay(chromo.annotations[i].key)) {
		//get stored opacity of layer
		annOp=Math.round(parseFloat(chromo.annotations[i].opacity)*100)
		//get current opacity of layer (0 if not shown)
		var currOp=Math.round(parseFloat(getOpacity($(chromo.body+" ."+chromo.annotations[i].name)))*100);
		//change text in label
		$(chromo.body+' .opval').text(defOp);
		if (logging) console.log('reseting: ',chromo.annotations[i].name,currOp,'->',defOp);
		if(Math.abs(currOp-annOp)<1){
		    //if overlay is shown, set opacity
		    setOpacity($(chromo.body+' .'+chromo.annotations[i].name),defOp/100);
		    //set stored opacity
		    chromo.annotations[i].opacity=defOp/100;
		}else{
		    //change anyway
		    chromo.annotations[i].opacity=defOp/100;
		}
	    }
	}
    }

    //////////////////////////////////
    // ADDITIONAL TOGGLING FUNCTIONS
    //////////////////////////////////

    $('#kiosk .minmax').click(function(){
	toggleOptions();
    });
    $('#kiosk #menu-title').click(function(){
	toggleOptions();
    });

    $('#kiosk #option-overlay').click(function(){
	toggleOverlay();
    });

    $('#overlay .minmax').click(function(){
	toggleOverlay();
    });

    function toggleOptions(force){
	if (!force) force='none'
	//console.log(force);
        if($('#kiosk .minmax').hasClass("max") || force=='min'){
	    //minimize
	    $('#kiosk .minmax').removeClass("max").addClass("min");
	    $('#kiosk').animate({
                left:chromo.ksklmn+'em',
		opacity:0.6,
            });
	    toggleOverlay('off');
        }else if($('#kiosk .minmax').hasClass("min") || force=='max'){
	    //maximize
	    $('#kiosk .minmax').removeClass("min").addClass("max");
	    $('#kiosk').animate({
                left:chromo.ksklmx+'em',
		opacity:1.0,
	    });
	    if($('#overlay .minmax').hasClass("max")) toggleOverlay('max')
	    if($('#overlay .minmax').hasClass("min")) toggleOverlay('min')
        }
    }

    function toggleOverlay(force){
	if (!force) {
	    if($('#overlay .minmax').hasClass("max")) force='min'
	    if($('#overlay .minmax').hasClass("min")) force='max'
	}
        if(force=='min'){
	    //minimize
	    $('#overlay .minmax').removeClass("max").addClass("min");
	    $('#overlay').animate({
                left:chromo.ovlmn+'em',
		opacity:0.6,
            });
	    $('#kiosk .option .arrow-left').addClass("arrow-right").removeClass("arrow-left");
        }else if(force=='max'){
	    //maximize
	    $('#overlay .minmax').removeClass("min").addClass("max");
	    $('#overlay').animate({
                left:chromo.ovlmx+'em',
		opacity:1.0,
	    });
	    $('#kiosk .option .arrow-right').addClass("arrow-left").removeClass("arrow-right");
	}else if(force=='off'){
	    $('#overlay').animate({
                left:chromo.ovloff+'em',
            });
	};
	if (logging) console.log('overlay',force);
    }

    //toggle constellation labels on click
    $('#kiosk #options #option-const').click(function(){
        chromo.simulateKeyPress('c');
    });

    //toggle grav labels on click
    $('#kiosk #options #option-labels').click(function(){
	chromo.simulateKeyPress('l');
    });

    //toggle coordinates on click
    $('#kiosk #options .option-coord').click(function(){
	if($('#kiosk #options .option-coord .on-off').hasClass("gal")){
	    $('#kiosk #options .option-coord .on-off').removeClass("gal").addClass("eq");
	    $('#kiosk #options .option-coord .label').html("Equatorial");
	    //console.log('clicked coord')
	    //console.log($('#kiosk #options .option-coord .label').html())
	    chromo.switchCoordinateSystem('A')
	}else if($('#kiosk #options .option-coord .on-off').hasClass("eq")){
	    $('#kiosk #options .option-coord .on-off').removeClass("eq").addClass("gal");
	    $('#kiosk #options .option-coord .label').html("Galactic");
	    chromo.switchCoordinateSystem('G')
	}
    });


    chromo.intronew = "Gravoscope combines two distinct views of the Universe. You can explore our Galaxy (the Milky Way) and the distant Universe in <a href='http://blog.chromoscope.net/data/'>a range of wavelengths</a> from gamma-rays to the longest radio waves. Change the wavelength using the <em>slider</em> in the top right of the screen and explore space using your mouse.<br /><br />Gravoscope also allows you to overlay the projected possible locations of gravitational waves detected by <a href='http://www.ligo.org'>Advanced LIGO</a>. Use the options in the bottom left to turn them on and off. The positions cover large areas of sky because trangulation of gravitational wave signals is very difficult, and the location is only constrained to an area on the sky. The more likely regions are brighter.<br /><br />If you get stuck, click 'Help' in the bottom left.<br /><br /><a href='http://www.astro.cardiff.ac.uk/research/instr/'><img src='cardiffuni.png' style='border:0px;margin: 0px 5px 5px 0px;float:left;' /></a>Chromoscope is kindly funded by the Cardiff University <a href='http://www.astro.cardiff.ac.uk/research/egalactic/'>Astronomy</a> and <a href='http://www.astro.cardiff.ac.uk/research/instr/'>Astronomy Instrumentation</a> Groups.<br style='clear:both;' />";

    chromo.phrasebook.helpdesc = "NEW HELP"
    //chromo.phrasebook.helpdesc = "The Milky Way is shown across the middle. The north pole of the Galaxy is towards the top. Use the mouse to drag the sky around. Want more info? <a href=\"#\" class=\"videolink\">Watch a quick tour</a> (opens in this window). <span class=\"keyboard\">The keyboard controls are:<ul class=\"chromo_controlkeys\"></ul></span><span class=\"nokeyboard\"><ul class=\"chromo_controlbuttons\"></ul></span> <span class=\"keyboard\">Created by <a href=\"http://www.strudel.org.uk/\">Stuart Lowe</a>, <a href=\"http://orbitingfrog.com/blog/\">Rob Simpson</a>, and <a href=\"http://www.astro.cardiff.ac.uk/contactsandpeople/?page=full&id=493\">Chris North</a>. You can also <a href=\"http://blog.chromoscope.net/download/\">download it</a> to run locally.</span>";

    //Construct the splash screen
	function buildIntroAgain(delay){
		var w = 600;
		// iPhones have wide but not very tall screens so we make the intro a bit wider if the screen height is small.
		if(chromo.tall <= 640) w *= 1.2;
		if(w > 0.8*chromo.wide) w = 0.8*chromo.wide;
		$(chromo.body+" .chromo_message").css({width:w+"px",'max-width':''});
		chromo.message(chromo.createClose()+chromo.intronew,false,'left')
		$(chromo.body+" .videolink").bind('click',{me:chromo}, function(e){ e.preventDefault(); e.data.me.showVideoTour(); } );
		$(chromo.body+" .chromo_message .chromo_close").bind('click',{id:'.chromo_message'}, jQuery.proxy( chromo, "hide" ) );
		if(delay > 0) $(this.body+" .chromo_message").delay(delay).fadeOut(500)
	}

    buildIntroAgain(50);

    //recreate Close behaviour on Help window
    $(chromo.body+" .chromo_help .chromo_close").on('click',{id:srchid},function(event){$(chromo.body+' .chromo_help').hide();});
    toggleOptions("max");
    toggleOverlay("max");
//});
}
