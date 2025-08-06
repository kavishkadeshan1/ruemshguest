$(document).ready(function(){
  // Example: Animate hero text on load
  $('.hero h1').addClass('animate__fadeInDown');

});

// Dynamically add favicon to the document head
(function() {
  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = 'images/favicon.png'; // Path to your favicon image
  document.head.appendChild(link);
})();
