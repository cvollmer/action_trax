/**
 * @author cvollmer
 */
var scrollpos = 0;
$(document).ready(function(){
	$('.credits').width(($('li',$('.credits')).length * 140))
	$('.prev',$('.credit-pager')).click(function(){
		if(scrollpos > 0){
			scrollpos -= 140;
			$('.credits').animate({
				left: scrollpos * (-1)
			},'slow')
		}
	});
	$('.next',$('.credit-pager')).click(function(){
		var maxscroll = $('.credits').width() - 560;
		if(scrollpos < maxscroll){
			scrollpos += 140;
			$('.credits').animate({
				left: scrollpos * (-1)
			},'slow')
		}
	});
});
