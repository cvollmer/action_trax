(function($) {
// It takes a simple transparent image with 4 rounded corners and makes it simple to add them to any image or div.
$.fn.rcorner = function(options) {
  var opts = $.extend({}, $.fn.rcorner.defaults, options);

  return this.each(function(i) {
    var $this = $(this);

    // Support for the Metadata Plugin.
    var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
    
    $this.wrap('<div class="rcorner_wrapper writer'+i+'"></div>');
    $('.writer'+i).append('<div class="top_left"></div><div class="top_right"></div><div class="bottom_left"></div><div class="bottom_right"></div>');
  });

  // private function for debugging
  function debug($obj) {
    if (window.console && window.console.log) {
      window.console.log($obj);
    }
  }
};

// default options
$.fn.rcorner.defaults = {
  defaultOne:true,
  defaultTwo:false,
  defaultThree:'yay!'
};

})(jQuery);