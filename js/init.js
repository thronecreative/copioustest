
$( document ).ready(function() {

		// 	VARIABLES
		var	
				$win           = $(window),
				$slide_gallery = $('#slide-gallery'),
				image_folder = '/images/gallery/',
				win_w          = $win.width(),
				win_h          = $win.height(),
				col_num        = 3,
				images         = [],
				image_groups   = [],
				speeds     = [1.25, 1, 1.5],
				randomize      = true;

		
		// GET IMAGES
		$.ajax({
		  url: "images/gallery/",
		  success: function(data){
		     $(data).find("a:contains(.jpg)").each(function(){
		        images.push($(this).attr("href"));
		     });

		   initImageGroups();
		  }
		});


		function initImageGroups(){
			// randomize image
			images.sort(function() { return 0.5 - Math.random() });

			// find group size
			var group_size = Math.ceil(images.length / col_num);

			// split images into groups
			var split_images = chunkArray(images, group_size);

			// create groups
			for (var i = 0; i < split_images.length; i++) {
				buildImageGroup(split_images[i], i);
			}

			//console.log(image_groups[0]);
		}


		

		function buildImageGroup(imgs, index){
			// start image_group object
			var 	image_group = {};
					image_group.id = index,
					image_group.images = imgs,
					image_group.image_index = 0,
					image_group.pos_y = 0,
					image_group.speed = speeds[index];

			addImageGroup(image_group);
			addImage(image_group);

			image_group.move = setInterval(function(){moveGroup(image_group)}, 10);
			//addImage(image_group);
			// add image_group to image_groups array
			image_groups.push(image_group);
		}

		function addImageGroup(image_group){
			$slide_gallery.append('<div data-group-id="'+ image_group.id +'" class="image-group"><div class="image-slider"/>');

			image_group.image_holder = $('[data-group-id="'+ image_group.id +'"] .image-slider').hide();


		}

		function addImage(image_group){
			var 	index = image_group.image_index,
					image_url = image_folder + image_group.images[index],
					image_holder = image_group.image_holder;

			image_holder.append('<div class="image"><img src="' + image_url + '" />');

			if(index < image_group.images.length - 1){
				image_group.image_index++
			}else{
				image_group.image_index = 0;
			}

			//console.log(index)

			image_holder.imagesLoaded( function() {
				image_holder.fadeIn(2000);
			  checkGroupSize(image_group);
			});



		}

		function removeImage(){}

		function moveGroup(image_group){
			var 	speed = image_group.speed,
				new_pos = image_group.image_holder.offset().top - speed;

			image_group.image_holder.offset({top: new_pos});
			checkGroupSize(image_group);
		}

		function checkGroupPos(image_group){
			
		}

		function checkGroupSize(image_group){
			//check if the gorup is smaller than the window
			var 	image_holder = image_group.image_holder,
					pos = image_group.image_holder.offset().top,
					image_holder_h = image_holder.outerHeight(),
					top_image = $('.image', image_holder).first(),
					top_image_h = top_image.outerHeight(),
					win_h = $win.height();

			if(pos < -top_image_h){
				top_image.remove();
				image_holder.offset({top: pos + top_image_h})
			}

			if(image_holder_h + pos < win_h + 100){
				addImage(image_group)
			}

		}

		$win.click(function(event) {
			for (var i = 0; i < image_groups.length; i++) {
				clearInterval(image_groups[i].move);
			}
		});


		//		UTILITY FUNCTIONS
		//===========================
		
		// split array into chunks
		function chunkArray (arr, len) {

		  var chunks = [],
		      i = 0,
		      n = arr.length;

		  while (i < n) {
		    chunks.push(arr.slice(i, i += len));
		  }

		  return chunks;
		}

		// get random number
		function randBetween(low, high){
			Math.floor(Math.random() * high) + low;
		}
});
