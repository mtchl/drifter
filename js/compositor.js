function buildCompositor(next){

	//var window_h =  $(window).height();

	$(document).ready(function(){
		// console.log("setup");

		//  $('#xfader').on('input', function(){
		//  	console.log($(this).val());
		//  	$('#compositor #front').css('opacity',$(this).val()/100);
		//  })


	})






	$.getJSON('data/NLA-pics.json', function(data){
		 nlaPics = data;
		 $.getJSON('data/flickr-commons.json', function(data){
			 flickrPics = data;
			 buildDivs();
		});
	});

	var skyePics = [
		{filename: "wassens-images/AVAApr11 IMG_5514.JPG" , caption: "Avalon Swamp, Lowbidgee, April 2011"},
		{filename: "wassens-images/BJ7.JPG" , caption: "Berry Jerry Lagoon, Mid-Murrumbidgee, April 2013"},
		{filename: "wassens-images/drylake 2.JPG" , caption: "Dry Lake, Mid-Murrumbidgee, December 2011"},
		{filename: "wassens-images/EULApr11 IMG_5508.JPG" , caption: "Eulimbah Swamp, Lowbidgee, April 2011"},
		{filename: "wassens-images/eulimbah20408.jpg" , caption: "Eulimbah Swamp, Lowbidgee, April 2008"},
		{filename: "wassens-images/GOO1 Apr13 .JPG" , caption: "Gooragool, Mid-Murrumbidgee, April 2013"},
		{filename: "wassens-images/GOOsite.JPG" , caption: "Gooragool, Mid-Murrumbidgee, December 2013"},
		{filename: "wassens-images/GOOT1NOV 15  start.JPG" , caption: "Gooragool, Mid-Murrumbidgee, November 2015"},
		{filename: "wassens-images/GOOt2.JPG" , caption: "Gooragool, Mid-Murrumbidgee, December 2013"},
		{filename: "wassens-images/hardyhead WAG (1).JPG" , caption: "Unspecked Hardyhead, Waugorah Lagoon, December 2013"},
		{filename: "wassens-images/Hobblers scenic (1).JPG" , caption: "Hobblers Lakes, Western Lakes, December 2014"},
		{filename: "wassens-images/IMG_1058.jpg" , caption: "Southern Bell Frog, Yanga Lake, Lowbidgee, April 2008"},
		{filename: "wassens-images/IMG_2217.jpg" , caption: "Piggery Lake, Lowbidgee, July 2009"},
		{filename: "wassens-images/IMG_2222.jpg" , caption: "Piggery Lake, Lowbidgee, July 2009"},
		{filename: "wassens-images/IMG_2762.JPG" , caption: "Tadpole, Yanga Lake, Lowbidgee, July 2009"},
		{filename: "wassens-images/litper MER.JPG" , caption: "Peron's tree frog, Mercedes Swamp, Lowbidgee, April 2014"},
		{filename: "wassens-images/LPGARP11IMG_5676.JPG" , caption: "Little Piggery Lake, Lowbidgee, April 2011"},
		{filename: "wassens-images/mckennas (2).JPG" , caption: "McKennas Lagoon, mid-Murrumbidgee, June 2011"},
		{filename: "wassens-images/MD rainbow fish (2).JPG" , caption: "Rainbowfish, December 2011"},
		{filename: "wassens-images/MERAPR11IMG_5598.JPG" , caption: "Mercedes Swamp, Lowbidgee, April 2011"},
		{filename: "wassens-images/MERJan08.jpg" , caption: "Mercedes Swamp, Lowbidgee, January 2008"},
		{filename: "wassens-images/MERT2NOV15 senic.JPG" , caption: "Mercedes Swamp, Lowbidgee, November 2015"},
		{filename: "wassens-images/MERT2Q2.JPG" , caption: "Mercedes Swamp, Lowbidgee, November 2014"},
		{filename: "wassens-images/MERT2Q15MAR15diveristy.JPG" , caption: "Mercedes Swamp, Lowbidgee, March 2015"},
		{filename: "wassens-images/P1000038 NapNap  scenic (2).JPG" , caption: "Nap Nap Swamp, Lowbidgee, December 2013"},
		{filename: "wassens-images/Paika net setting fog (1).JPG" , caption: "Paika Lake, Western Lakes, April 2014"},
		{filename: "wassens-images/perons tree frog 3.JPG" , caption: "Peron's Tree Frog, December 2011"},
		{filename: "wassens-images/PiggeryJuly.JPG" , caption: "Piggery Lake, Lowbidgee, July 2009"},
		{filename: "wassens-images/PIGT2Q7MAR15.JPG" , caption: "Piggery Lake, Lowbidgee, March 2015"},
		{filename: "wassens-images/Pockocksdec2007.JPG" , caption: "Pococks Swamp, Lowbidgee, December 2007"},
		{filename: "wassens-images/rainbowfish WAG (2).JPG" , caption: "Rainbowfish, Waugorah Lagoon, December 2013"},
		{filename: "wassens-images/Riverleigh_1_April2010.JPG" , caption: "Riverleigh Swamp, Lowbidgee, April 2010"},
		{filename: "wassens-images/Riverleigh_2_April2010.JPG" , caption: "Riverleigh Swamp, Lowbidgee, April 2010"},
		{filename: "wassens-images/scorpion yarrada.JPG" , caption: "Scorpion, Yarrada Lagoon, December 2011"},
		{filename: "wassens-images/silverpine2.JPG" , caption: "Yanco Creek at Silver Pines, April 2013"},
		{filename: "wassens-images/snails eating egg mass 3.JPG" , caption: "Snails eating egg mass, Turkey Flat, Mid-Murrumbidgee, December 2011"},
		{filename: "wassens-images/STE6.JPG" , caption: "Steam Engine Swamp, Lowbidgee, April 2014"},
		{filename: "wassens-images/TBRT2Q1.JPG" , caption: "Two Bridges Swamp, Lowbidgee, September 2014"},
		{filename: "wassens-images/TELApr11.JPG" , caption: "Telephone Creek, Lowbidgee, April 2011"},
		{filename: "wassens-images/TUF4.JPG" , caption: "Turkey Flat, mid-Murrumbidgee, April 2013"},
		{filename: "wassens-images/turtle WAG (8).JPG" , caption: "Turtle, Waugorah Lagoon, Lowbidgee, December 2013"},
		{filename: "wassens-images/unspecked hardy head  fish 2 (2).JPG" , caption: "Unspecked Hardyhead, December 2011"},
		{filename: "wassens-images/UNSPECKED HARDY HEAD.JPG" , caption: "Unspecked Hardyhead, December 2011"},
		{filename: "wassens-images/WAGT2NOV15.JPG" , caption: "Waugorah Lagoon, Lowbidgee, November 2015"},
		{filename: "wassens-images/YAA2midw.JPG" , caption: "Yanco Agricultural, mid-Murrumbidgee, January 2015"},
		{filename: "wassens-images/YARMID2B.JPG" , caption: "Yarrada Lagoon, mid-Murrumbidgee, January 2015"},
		{filename: "wassens-images/YART1MAR15endS.JPG" , caption: "Yarrada Lagoon, mid-Murrumbidgee, March 2015"},
		{filename: "wassens-images/YART1Nov 15 Q20. milfoil.JPG" , caption: "Yarrada Lagoon, mid-Murrumbidgee, November 2015"}
	];

	var nlaPics = [];
	var flickrPics = [];


	function buildDivs(){

		console.log("retriggering");

		$("#front").remove();
		$("#back").remove();

		var back = $("<div id = 'back'>");
		var front = $("<div id = 'front'>");

		var n = pickOne(nlaPics);
		var nlaID = n.identifier[0].value.replace("http://nla.gov.au/","");
		n.src = "nla-pics/" + nlaID + '-v.jpg' ; // local files
		n.caption = n.title + " (" + n.issued + ")" + " - <a target='_blank' href='"+n.identifier[0].value+"'>National Library of Australia</a>";

		var f = pickOne(flickrPics);
		//f.src = "https://farm"+f.farm+".staticflickr.com/"+f.server+"/"+f.id+"_"+f.secret+"_b.jpg";
		f.src = "flickr-pics/"+f.id+"_"+f.secret+"_b.jpg"; // local files

		if (f.owner == "27331537@N06"){ // state records nsw hack
			f.src = "flickr-pics/"+f.id+"_"+f.secret+"_c.jpg";
		}
		f.caption = f.title + " - <a target='_blank' href='http://flickr.com/photos/" +f.owner +"/" + f.id + "'>Flickr Commons";

		var a = f;
		if (Math.random() < 0.9) a = n; // only 30 flickr pics

		var s = pickOne(skyePics);

		if (Math.random() < 0.5){
			back.css("background-image", "url('" + s.filename + "')");
			front.css("background-image", "url('" + a.src + "')");
			front.append("<div class='caption'>"+ a.caption +"</div>");
			back.append("<div class='caption'>"+ s.caption +"</div>");
		} else {
			back.css("background-image", "url('" + a.src + "')");
			front.css("background-image", "url('" + s.filename + "')");
			front.append("<div class='caption'>"+ s.caption +"</div>");
			back.append("<div class='caption'>"+ a.caption +"</div>");
		}

		front.one("animationend webkitAnimationEnd", function(e){
		 	console.log("front animation stopped");
		    // console.log("caught animation end: " + e.originalEvent.animationName);
		 	// e.stopPropagation();
			 	
		 	$('#compositor').children().remove();

		 	if (next){
		 		console.log("loading " + next);
		 		if (next == "map"){
		 			buildMap();
		 		}

		 		if (next == "sifter"){
		 			buildSifter();
		 		}

		 	} else {
		 		buildDivs();
		 	}


		 });

		$("#compositor").append(back);
		$("#compositor").append(front);

		var w = $('#compositor #back').width();
		console.log("width " + w);
		$('#compositor').css('height',(w*0.66) + 'px');
	}

	function pickOne(array){
		var idx = Math.floor(Math.random()*array.length);
		return array[idx];
	}

	var getQueryString = function ( field, url ) {
	    var href = url ? url : window.location.href;
	    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	    var string = reg.exec(href);
	    return string ? string[1] : null;
	};	


}