/**
 * @author cvollmer
 */
$(document).ready(function(){
	$('ul.thumbs li img',$('.vehicle-gallery')).click(function(){
		var src = $(this).attr('src');
		$('#full-image img').attr('src',src);
	})
});
