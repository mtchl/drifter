function buildMap(){

		$("#container").height( $(window).height());
		$('#map').css('height','100%');

		var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

		if (iOS){
			//console.log("caught ios device");
			var iosalert = $("<div id='iosalert'>Using iOS? Tap to activate sound</div>");
			iosalert.on("click", function(){
				$(this).remove();
			})

			$('#map').append(iosalert);
		}
	
	 	var panPaths = [
	 		// balranald east-north-east to around griffith
	 		{start: [-34.56991, 144.45786], end:[-34.45562, 145.56953],  zoomLevel: 10},
	 		// near tumut north-north-east over gunagai and jugiong
	 		{start: [-35.51099, 148.10909], end:[-34.90283, 148.35697],  zoomLevel: 11},
	 		// cooma north west to wagga
	 		{start: [-36.10792, 149.53972], end:[-35.02662, 147.43824],  zoomLevel: 11},
	 		// yass south west to billabong creek
	 		{start: [-34.84988, 148.60588], end:[-35.21309, 145.0573],  zoomLevel: 10},
            // wagga to griffith, up close
			{start: [-35.13563, 147.34056], end:[-34.32104, 146.11662],  zoomLevel: 12},
			// for testing
			//{start: [-35.51099, 148.10909], end:[-35.2, 148.2],  zoomLevel: 11},

	 	];

	 	var autoPanSwitch = false;
	 	var panTime = 10.0;
	 	var panSpeed = 80 ; // pixels per interval

	 	var panPath = pickOne(panPaths);

	 	if (!map){
	 		var map = L.map('map',{zoomControl:false, attributionControl:false});
	 		new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);
	 	} 
		map.setView(panPath.start, panPath.zoomLevel);

	 	//console.log(panPaths);
	 	var startp = map.latLngToContainerPoint(panPath.start);
		var endp = map.latLngToContainerPoint(panPath.end); 
		//console.log(startp);
		var pixeldist = Math.sqrt(Math.pow(endp.x - startp.x, 2) + Math.pow(endp.y - startp.y,2));
		var panSteps = Math.floor(pixeldist / panSpeed);
		var currentPanStep = 0;
		var panDrift = [(endp.x - startp.x)/panSteps, (endp.y - startp.y)/panSteps ];

	 	
	 	// load fine grained rivers

	 	var allRivers = new L.geoJson().addTo(map);
		var osmRivers = new L.geoJson().addTo(map);
		var waterAreas = new L.geoJson().addTo(map);
		var osmTowns = new L.geoJson().addTo(map);
		var townData = [];
		var frogData = [];
		var frogs = new L.geoJson().addTo(map);


		var audioContext;


			// frog audio sources
			// anbg - http://www.anbg.gov.au/sounds/
			// nccma - http://www.nccma.vic.gov.au/Water/Waterwatch/Frogs/index.aspx
			// frogwatch act - https://audioboom.com/boos/2609638-pseudophryne-corroborree-corroborree-frog
			// bdvsnapshots - http://www.biodiversitysnapshots.net.au/bdrs-core/public/speciesInfo.htm?spid=308&mode=fieldguide
			// amphibiaweb - http://amphibiaweb.org/lists/sound.shtml

		var frogAudioMap = {
				"Spotted Grass Frog": "frog-audio/spotted-marsh-frog-nccma.mp3",
				"Banjo Frog":'frog-audio/banjo-frog-museumvic.mp3', 
				"Peron's Tree Frog": 'frog-audio/per-tree-frog-anbg.mp3', 
				"Common Eastern Froglet":"frog-audio/common-eastern-froglet-nccma.mp3", 
				"Eastern Sign-bearing Froglet":"frog-audio/east-froglet-anbg.mp3", 
				"Barking Frog":"frog-audio/barking-frog-nccma.mp3",
				"Giant Banjo Frog":"frog-audio/giant-banjo-frog.mp3",
				"Southern Bell Frog":"frog-audio/litoria-raniformis-softer-bdvsnapshots.mp3",
				"Spotted Marsh Frog":"frog-audio/spotted-marsh-frog-nccma.mp3",
				"Bibron's Toadlet":"frog-audio/bibrons-toadlet-nccma.mp3",
				"Sudell's Frog":"frog-audio/common-spadefoot-toad-nccma.mp3",
				"Sudell's Toad": "frog-audio/common-spadefoot-toad-nccma.mp3",
				"Brown Tree Frog":"frog-audio/southern-brown-tree-frog-frogsdotorg.mp3",
				"Alpine Tree Frog":"frog-audio/whist-tree-frog-anbg.mp3",
				"Verreaux's Tree Frog":"frog-audio/whist-tree-frog-anbg.mp3",
				"Verreaux's Frog":"frog-audio/whist-tree-frog-anbg.mp3",
				"Southern Corroboree Frog":"frog-audio/corroborree-frog-frogwatch-act.mp3",
				"Smooth Toadlet":"frog-audio/smooth-toadlet-frogwatch-act.mp3",
				"Broad-palmed Frog":"frog-audio/broad-palmed-rocket-frog-frogwatch-act.mp3",
				"Striped Marsh Frog":"frog-audio/limnodynastes-peronii-amphibiaweb.mp3",
				"Lesueur's Frog":"frog-audio/lesueurs-frog-bdvsnapshots.mp3",
				"Northern Corroboree Frog":"frog-audio/northern-corroboree-frog-arkive.mp3",
				"Dendy's Toadlet": "frog-audio/dendys-toadlet-museumvic.mp3",
				"Wrinkled Toadlet":"frog-audio/wrinkled-toadlet-oocities.wav"
			}

		var howlCalls = [];

		Object.keys(frogAudioMap).map(function(k){
			var url  = frogAudioMap[k];
			var call = new Howl({
					urls: [ url ],
					autoplay:false,
					onload:function(){ console.log("loaded audio " + k)},
					onloaderror:function(){ console.log("error loading " + k)},
					volume:0.2
				});
			howlCalls[k] = call;
		})
			

		var troveTitles = {};

		//window.setInterval(function(){console.log("center: " + map.getCenter() + " \n zoom: " + map.getZoom())},10000);
	 	
	 	$.getJSON('geojson/all-rivers.geojson',function(data) {
    		$(data.features).each(function(key, data) {
       	 		allRivers.addData(data);
    		});
    		allRivers.setStyle({color:'#666',weight:1,opacity:0.5});
		});


		$.getJSON('geojson/wetlands-compact.geojson',function(data) {
    		$(data.features).each(function(key, data) {
       	 		osmRivers.addData(data);
    		});
    		osmRivers.setStyle({color:'#dfa',weight:2,opacity:0.5,stroke:false});
		});

		$.getJSON('geojson/water-areas.geojson',function(data) {
    		$(data.features).each(function(key, data) {
       	 		waterAreas.addData(data);
    		});
    		waterAreas.setStyle({color:'#888',stroke:false,weight:2,opacity:0.5});
		});

		var townMarker = L.divIcon({className: 'town-marker'});

		$.getJSON('geojson/osm-towns.geojson',function(data) {
			townData = data.features;
    		$(data.features).each(function(key, data) {
    			var m = L.marker([data.geometry.coordinates[1],data.geometry.coordinates[0]],{icon:townMarker,title:data.properties.name}).addTo(osmTowns);
    		});
		});

		var frogMarker = L.divIcon({className: 'frog-marker'});

		$.getJSON('data/frogs.json', function(data){
			frogData = data;
			if (autoPanSwitch) window.setTimeout(function(){autoPan();},5000 );
			$("#map").css("opacity",1.0); // fade in

		})


		function autoPan(){
			console.log("autopan"); 
			map.panBy(panDrift,{animate:true, duration:panTime, easeLinearity:1.0,noMoveStart:true});
			currentPanStep++;

			map.on("moveend", autoPanCallback);
		}

		var autoPanCallback = function(){
			console.log("pan step " + currentPanStep + " of " + panSteps);
			if (currentPanStep == panSteps){
				finale();
				map.off("moveend", autoPanCallback);
				return;
			} 
			map.panBy(panDrift,{animate:true, duration:panTime, easeLinearity:1.0,noMoveStart:true});
			currentPanStep++;
		}


		function finale(){
			window.clearInterval(froginterval);
			window.clearInterval(towninterval);
			$("#map").css("opacity",0.0); // fade out
			window.setTimeout(function(){
				map.remove();
				$('#map').css("height",0);
				buildCompositor("sifter");	
			}, 5000);
		}


		function getPaddedBounds(pad){
			var bounds = map.getBounds();
			innermin = [bounds.getNorth() + (bounds.getSouth() - bounds.getNorth())*pad, bounds.getWest() + (bounds.getEast() - bounds.getWest())*pad];
			innermax = [bounds.getSouth() - (bounds.getSouth() - bounds.getNorth())*pad, bounds.getEast() - (bounds.getEast() - bounds.getWest())*pad];
			return L.latLngBounds( innermin, innermax);
		}



		function addRandomFrog(){

			var bounds = getPaddedBounds(0.1);
			//console.log(bounds);
			var localfrogs = frogData.filter(function(f){
				return bounds.contains([f.location[1],f.location[0]]);
			})

			if (localfrogs.length == 0) return; // no local frogs

			var rf = pickOne(localfrogs);
			while (!rf.vernacularName) rf = pickOne(localfrogs);

			if (rf.year == undefined) rf.year = "no date";

			$frogmarker = $("<div class='frog-marker'>"+
							"<div class='frogdot'></div>"+
							"<span class='froglabel'>"+
								"<a target='_blank' title='View record in Atlas of Living Australia' href='http://biocache.ala.org.au/occurrences/"+ rf.uuid +"'>"+rf.vernacularName+ " ("+ rf.year+")</span></div>");

			var markerpos = map.latLngToLayerPoint([rf.location[1],rf.location[0]]);

			$frogmarker.css("left",markerpos.x + "px");
			$frogmarker.css("top",markerpos.y + "px");//.delay(2000).css("opacity",0);;

			$("#map div.leaflet-map-pane").append($frogmarker);
			//console.log("added " + rf.vernacularName);

			$frogmarker.delay(15000).fadeOut(2000, function(){
			 	if ($(this)){
			 		//console.log("cleaning up");
			 		$(this).remove();
			 	}
			 });


			var pan = -1 + 2 * ((bounds.getWest() - rf.location[0]) / (bounds.getWest() - bounds.getEast())); // range 0 (left) - 1 (right)

			if (frogAudioMap.hasOwnProperty(rf.vernacularName)){
				console.log(" playing " + rf.vernacularName );
				howlCalls[rf.vernacularName].pos3d(pan,0,0);	
				howlCalls[rf.vernacularName].play();			
			} else {
				console.log("missing audio for " + rf.vernacularName + " ("+ rf.species+")");
			}

		}


		function loadTownArticles(){ // load stashed trove data from file
			var bounds = getPaddedBounds(0.1);
			var towns = townData.filter(function(t){
				return bounds.contains([t.geometry.coordinates[1],t.geometry.coordinates[0]]);	
			});

			if (towns.length == 0) return;

			var rtown = pickOne(towns);

			$.getJSON('data/towns/'+rtown.properties.name+'.json', function(data){

				var rwork =  pickOne(data);

				var snip = rwork.snippet.replace(/(<([^>]+)>)/ig,"");

				$townarticle = $("<div class='town-article leaflet-clickable'>"+
									"<h4>"+rtown.properties.name+", "+rwork.date.split('-')[0]+"</h4>"+
									"<h3>"+rwork.title+"</h3>"+
									"<p>"+snip+"</p>"+
									"<p class='papersource'><a title='View article in Trove' target='_blank' href='http://trove.nla.gov.au/ndp/del/article/"+rwork.id+"'>"+rwork.newspaper+"</a></p>"+
								"</div>");

				var pos = map.latLngToLayerPoint([rtown.geometry.coordinates[1],rtown.geometry.coordinates[0]]);

				$townarticle.css("left",pos.x + "px");
				$townarticle.css("top",pos.y + "px");//.delay(2000).css("opacity",0);;
				$townarticle.hide();

				$("#map div.leaflet-map-pane").append($townarticle);
				$townarticle.fadeIn(3000);

				$townarticle.delay(5000).fadeOut(5000, function(){$(this).remove()});

			});

		}


        var towninterval = window.setInterval(loadTownArticles, 12103);
		var froginterval = window.setInterval(addRandomFrog, 5500);

		

		function pickOne(array){
			var idx = Math.floor(Math.random()*array.length);
			return array[idx];
		}



}