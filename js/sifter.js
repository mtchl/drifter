
function buildSifter(){

	var rivernames = ["Numeralla","Gudgenby","Cotter","Molonglo","Yass","Bredbo","Goodradigbee","Tumut","Murrumbidgee"]; 
	
	var speciesMap = {"Numeralla": {species: "Callocephalon fimbriatum" , common: "Gang-gang Cockatoo" },
					  "Bredbo": {species: "Galaxias olidus", common: "Mountain Galaxias" },
					  "Gudgenby": {species: "Swainsona recta" , common: "Mountain Swainson-pea"},
					  "Cotter": {species:"Gadopsis bispinosus" , common: "Two-spined Blackfish" },
					  "Molonglo": {species: "Prasophylum petilum"  , common: "Tarengo Leek Orchid"},
					  "Goodradigbee": {species: "Macquaria australasica", common: "Macquarie Perch"},
					  "Tumut": {species: "Maccullochella macquariensis", common: "Trout Cod" },
					  "Yass": {species: "Eucalyptus recurva", common: "Mongarlowe Mallee" },
					  "Murrumbidgee": {species: "Crinia Sloanei", common: "Sloane's Froglet" }					  
					}

	var on_duration = 4000; //5500; // time each element is on
	var char_delay = 300;//240;

	var itemlimit = 7;
	var drift_base = 0.5; // base value
	var drift_scale = 0.0; // random scale

	var fontsize_min = 18;
	var fontsize_max = 48;

	var siftDuration = 5000; // time between sift operations

	// set up the hidden species name

	var randomseed = Math.floor(Math.random()* rivernames.length);
	var river = rivernames[randomseed];
	console.log(river);

	var speciesName = speciesMap[river].species;  //"Prasophylum petilum";
	var commonName = speciesMap[river].common; //"Tarengo Leek Orchid";

	var nameArray = speciesName.split("").map(function(c){ 
		if (c == " "){
			return '\u00A0';
		} else {
			return c;
		}
	});

	//console.log(nameArray);
	$('#sifter').append('<p id="linkinfo"></p><ul id="trovelinks"></ul>');
	$('#sifter').append("<div id='hiddenName'></div>");

	nameArray.forEach(function(c){
		$("#hiddenName").append("<span class='hidden'>"+c+"</span>");
	});

	$("#hiddenName").append("<div id='commonName' >&middot; " + commonName + " &middot;</div>");


	var globalMode = "play";

	//var audioContext;
	//audioContext = new AudioContext();

	var articles = [];

	$.getJSON('data/rivers/'+river+'.json',function(data){
		articles = data;
		addRandomArticle();
	});


	var ambience = new Howl({
					urls: [ 'molonglo-looped.mp3'],
					volume:0.0,
					loop:true,
					autoplay:true
				});

	ambience.fadeIn(0.4, 5000);
	

	

	var addRandomArticle = function(){

		// first remove any not playing

		var inactive = $('#sifter ul.item').not('.playing');

		inactive.each(function(idx){
			console.log("removing id " + $(this).attr("data-troveid"));
			$matchinglink = $("#trovelinks li[data-troveid='"+$(this).attr("data-troveid")+"']");
			$matchinglink.addClass("hide");
			window.setTimeout(function(){$matchinglink.remove()},1000);
			//"input[value='Hot Fuzz']"
		});

		inactive.remove();

		if ($('ul.item').size() >= itemlimit) return;

		console.log($('ul.item').size() + " in playlist - adding");

		var randomindex = Math.floor(Math.random()*articles.length);
		var a = articles[randomindex];

		var snip = a.snippet.replace(/(<([^>]+)>)/ig,"");
		snip = snip.replace("&amp;","&"); // replace with ampersands
		snip = snip.replace("nbsp;"," "); // strip the weird nbsps
		var snipchars = snip.split(""); 

		snipchars = snipchars.map(function(t){
			if (t == " ") return '\u00A0';  
			else return t;
			}); // replace spaces with nbsp

		topOffset = 60 + Math.floor(Math.random()*240); // randomise y pos
		leftOffset = 40 + Math.floor(Math.random()*800);
		fontsize = Math.floor(fontsize_min + Math.random()*(fontsize_max-fontsize_min));

		//displayList.push(a); // add it to the displaylist

		var $article = $("<ul class='item' data-troveid='"+a.id+"'></ul>");
		$article.css("top", topOffset + "px");
		$article.css("font-size", fontsize + "px");

		var $pad = $("<li class='char' style='width: " + leftOffset + "px'></li>"); // first li is padding
		$article.append($pad);

		var sinfreq = 5 + Math.random()*15; // scale factor for freq

		snipchars.forEach(function(c,idx,arr){
			var ysin = Math.sin(sinfreq * idx / arr.length)*0.5;
			var $t = $("<li class='char off' style='top: " + ysin + "em'>" + c + "</li>");
			//var $t = $("<li class='char off' style='translate: (0," + ysin + "em)'>" + c + "</li>");
			//var $t = $("<li class='char off'>" + c + "</li>");
			$article.append($t);
		});

		$('#sifter').append($article); // to the DOM
		$link = $("<li data-troveid="+a.id+"><a target='_blank' href='http://trove.nla.gov.au/ndp/del/article/"+a.id+"'><img src='css/document-icon.svg'></a></li>")
		$('#trovelinks').append($link);
		
		$link.on('mouseenter', function(){
			var t = a.title;
			if (t.length > 60) t = t.substring(0,60)+ '...';
			linkinfo = t + " | " + a.newspaper.replace(/ *\([^)]*\) */g, "")+", " + a.date.substring(0,4);
			$('#linkinfo').text(linkinfo);
			$("ul.item[data-troveid='"+$(this).attr("data-troveid")+"']").addClass("linkhover");
		});

		$link.on('mouseleave', function(){
			$('#linkinfo').text("");
			$("ul.item[data-troveid='"+$(this).attr("data-troveid")+"']").removeClass("linkhover");
		});

		flipOn($article,0,snipchars.length,char_delay,on_duration); // trigger

		if ($('#sifter ul.item').size() < itemlimit) addRandomArticle();


	}


	var flipOn = function($article,index,len,delay,duration){
		//console.log("switching on " + index);
		if (index == 0) $article.addClass("playing");
		var $el = $article.children().eq(index);
		$el.addClass("on");
		$el.removeClass("off");
		//var sinfreq = 5 + Math.random()*15; // scale factor for freq
		//var ysin = Math.sin(sinfreq * index / len)*0.5;
		$el.css("transform","translate3d(" + drift_base + "em, 0,0)"); //add base drift
			
		window.setTimeout(function(){flipOff($el)}, duration);

		if (index < len-1 && globalMode == "play"){ // turn the next word on after a delay
			window.setTimeout(function(){flipOn($article,index+1,len,delay,duration)},delay);
		} else { // wait then loop 
			window.setTimeout(function(){ 
				$article.removeClass("playing");
				if (globalMode == "play") addRandomArticle();
			}, 5000); // switch off after fade out
		}
	}

	var flipOff = function($el){
		if ($el.hasClass("sifted")){
			$el.removeClass("sifted");
			$el.addClass("sifted-off");
			ydrift = 2 + Math.random()*2;
			$el.css("transform", "translate3d(-1.0em," + ydrift  + "em,0)");
		} else {
			$el.removeClass("on");
			$el.addClass("off");
			ydrift = -0.5 + Math.random()*1;
			//console.log(xdrift);
			$el.css("transform", "translate3d(-2.0em," + ydrift  + "em,0)");
			//$el.on("transitionend", function(){ $el.remove()});
		}
	}


	var sift = function(){

		var onchars = $("li.char.on");
		var ontext = onchars.text();
		var found = false;
		
		var $hiddenChars = $("#hiddenName span.hidden"); // are we complete?
		var numHidden = $hiddenChars.length;
		if (numHidden == 0){
			console.log("completed the name")
			finale();
			return;
		} 

		var $targetChar = $hiddenChars.eq(Math.floor(Math.random()*numHidden));


		//console.log("searching for " + $targetChar.text());

		for (var c=0; c<ontext.length; c++){
			if (ontext[c] == $targetChar.text()){
				onchars.eq(c).addClass("sifted");
				window.setTimeout(function(){
					$targetChar.addClass("visible");
					$targetChar.removeClass("hidden");
				},2000 );
				//console.log("matched - switching on char " + $targetChar.text());
				break;
			}
		}	
	}

	function finale(){
		globalMode = "finale";
		window.clearInterval(siftInterval); // stop the sift timer
		
		window.setTimeout(function(){$("#commonName").addClass("show") }, 3000); // fade in the common name 
		window.setTimeout(function(){
			$("#hiddenName").addClass("fadeout");
			ambience.fadeOut(0.0, 5000);
			$("#trovelinks").fadeOut();
		}, 10000); // fade out the name

		
		
		window.setTimeout(function(){ 
			$('#sifter').children().remove();
			//buildCompositor("map");
			buildSifter();
		},15000 );
	}

	var siftInterval = window.setInterval(function(){ sift() }, siftDuration);


}