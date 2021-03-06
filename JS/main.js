$(function(){
  if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
    $('#ios-notice').removeClass('hidden');
    $("div#home").height($(window).height()*1.2);
    // $('.parallax-container').height( $(window).height() | 0 );
  } else {
    $(window).resize(function(){
      var parallaxHeight = Math.max($(window).height()*1.2, 200) | 0;
      $('.parallax-container').height(parallaxHeight);
    }).trigger('resize');
  }
});

$('#menu-toggle').click(function () {
  $(this).toggleClass('open');
  $(".menu").toggleClass('addmenuani');
});

$("a.mamama").click(function () {
  $('#menu-toggle').removeClass('open');
  $(".menu").removeClass('addmenuani');
})

$("section.menu nav.menunav ul li").hover(
  function () {
    $($(this).children()[1]).css("transform", "scaleX(15)");
  },
  function () {
    $($(this).children()[1]).css("transform", "scaleX(1)");
  }
)

$(".maindown").on("click", function () {})


/*SKILLS*/

var skills = [{
    "header": "INTERESTS",
    "captions": [
      "Compilers",
      "Web",
      "CN",
      "Design",
      "AI",
      "Competitve"
    ],
    "values": [
      0.80,
      0.80,
      0.80,
      0.60,
      0.90,
      0.85
    ]
  },
  {
    "header": "LANGUAGES",
    "captions": [
      "C",
      "C++",
      "Python",
      "JS",
      "MEAN",
      "MySQL"
    ],
    "values": [
      0.80,
      0.85,
      0.70,
      0.70,
      0.60,
      0.85
    ]
  },
  {
    "header": "MISC",
    "captions": [
      "Sketching",
      "Anime",
      "Gaming",
      "Origami",
      "Singing",
      "Reading"
    ],
    "values": [
      0.95,
      0.90,
      0.85,
      0.70,
      0.70,
      0.80
    ]
  }
];

var pentagonIndex = 0;
var valueIndex = 0;
var width = 0;
var height = 0;
var radOffset = Math.PI / 2
var sides = 6; // Number of sides in the polygon
var theta = 2 * Math.PI / sides; // radians per section

function getXY(i, radius) {
  return {
    "x": Math.cos(radOffset + theta * i) * radius * width + width / 2,
    "y": Math.sin(radOffset + theta * i) * radius * height + height / 2
  };
}

var hue = [];
var hueOffset = 25;

for (var s in skills) {
  $(".content").append('<div class="pentagon animated" id="interests"><div class="header"></div><canvas class="pentCanvas"/></div>');
  hue[s] = (hueOffset + s * 255 / skills.length) % 255;
}

$(".pentagon").each(function (index) {
  width = $(this).width();
  height = $(this).height();
  var ctx = $(this).find('canvas')[0].getContext('2d');
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.font = "bolder 20px 'Raleway'";
  if ($(window).width() < 1400) {
    ctx.font = "bolder 15px 'Raleway'";
  }
  ctx.textAlign = "center";

  /*** LABEL ***/
  color = "hsl(" + hue[pentagonIndex] + ", 100%, 50%)";
  ctx.fillStyle = color;
  ctx.fillText(skills[pentagonIndex].header, width / 2, 15);

  ctx.font = "bolder 15px Raleway";
  if ($(window).width() < 1400) {
    ctx.font = "bolder 12px 'Raleway'";
  }

  /*** PENTAGON BACKGROUND ***/
  for (var i = 0; i < sides; i++) {
    // For each side, draw two segments: the side, and the radius
    ctx.beginPath();
    xy = getXY(i, 0.3);
    colorJitter = 25 + theta * i * 2;
    color = "hsl(" + hue[pentagonIndex] + ",100%," + colorJitter + "%)";
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.moveTo(0.5 * width, 0.5 * height); //center
    ctx.lineTo(xy.x, xy.y);
    xy = getXY(i + 1, 0.3);
    ctx.lineTo(xy.x, xy.y);
    xy = getXY(i, 0.37);
    ctx.fillText(skills[pentagonIndex].captions[valueIndex], xy.x, xy.y + 5);
    valueIndex++;
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  valueIndex = 0;
  ctx.beginPath();
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = 5;
  var value = skills[pentagonIndex].values[valueIndex];
  xy = getXY(i, value * 0.3);
  ctx.moveTo(xy.x, xy.y);
  /*** SKILL GRAPH ***/
  for (var i = 0; i < sides; i++) {
    xy = getXY(i, value * 0.3);
    ctx.lineTo(xy.x, xy.y);
    valueIndex++;
    value = skills[pentagonIndex].values[valueIndex];
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  valueIndex = 0;
  pentagonIndex++;
});

/* MODAL */
var Modal = (function () {

  var trigger = $qsa('.modal__trigger'); // what you click to activate the modal
  var modals = $qsa('.modal'); // the entire modal (takes up entire window)
  var modalsbg = $qsa('.modal__bg'); // the entire modal (takes up entire window)
  var content = $qsa('.modal__content'); // the inner content of the modal
  var closers = $qsa('.modal__close'); // an element used to close the modal
  var w = window;
  var isOpen = false;
  var contentDelay = 400; // duration after you click the button and wait for the content to show
  var len = trigger.length;

  // make it easier for yourself by not having to type as much to select an element
  function $qsa(el) {
    return document.querySelectorAll(el);
  }

  var getId = function (event) {

    event.preventDefault();
    var self = this;
    // get the value of the data-modal attribute from the button
    var modalId = self.dataset.modal;
    var len = modalId.length;
    // remove the '#' from the string
    var modalIdTrimmed = modalId.substring(1, len);
    // select the modal we want to activate
    var modal = document.getElementById(modalIdTrimmed);
    // execute function that creates the temporary expanding div
    makeDiv(self, modal);
  };

  var makeDiv = function (self, modal) {

    var fakediv = document.getElementById('modal__temp');

    /**
     * if there isn't a 'fakediv', create one and append it to the button that was
     * clicked. after that execute the function 'moveTrig' which handles the animations.
     */

    if (fakediv === null) {
      var div = document.createElement('div');
      div.id = 'modal__temp';
      self.appendChild(div);
      moveTrig(self, modal, div);
    }
  };

  var moveTrig = function (trig, modal, div) {
    var trigProps = trig.getBoundingClientRect();
    var m = modal;
    var mProps = m.querySelector('.modal__content').getBoundingClientRect();
    var transX, transY, scaleX, scaleY;
    var xc = w.innerWidth / 2;
    var yc = w.innerHeight / 2;

    // this class increases z-index value so the button goes overtop the other buttons
    trig.classList.add('modal__trigger--active');

    // these values are used for scale the temporary div to the same size as the modal
    scaleX = mProps.width / trigProps.width;
    scaleY = mProps.height / trigProps.height;

    scaleX = scaleX.toFixed(3); // round to 3 decimal places
    scaleY = scaleY.toFixed(3);


    // these values are used to move the button to the center of the window
    transX = Math.round(xc - trigProps.left - trigProps.width / 2);
    transY = Math.round(yc - trigProps.top - trigProps.height / 2);

    // if the modal is aligned to the top then move the button to the center-y of the modal instead of the window
    if (m.classList.contains('modal--align-top')) {
      transY = Math.round(mProps.height / 2 + mProps.top - trigProps.top - trigProps.height / 2);
    }


    // translate button to center of screen
    trig.style.transform = 'translate(' + transX + 'px, ' + transY + 'px)';
    trig.style.webkitTransform = 'translate(' + transX + 'px, ' + transY + 'px)';
    // expand temporary div to the same size as the modal
    div.style.transform = 'scale(' + scaleX + ',' + scaleY + ')';
    div.style.webkitTransform = 'scale(' + scaleX + ',' + scaleY + ')';


    window.setTimeout(function () {
      window.requestAnimationFrame(function () {
        open(m, div);
      });
    }, contentDelay);

  };

  var open = function (m, div) {

    if (!isOpen) {
      // select the content inside the modal
      var content = m.querySelector('.modal__content');
      // reveal the modal
      m.classList.add('modal--active');
      // reveal the modal content
      content.classList.add('modal__content--active');

      /**
       * when the modal content is finished transitioning, fadeout the temporary
       * expanding div so when the window resizes it isn't visible ( it doesn't
       * move with the window).
       */

      content.addEventListener('transitionend', hideDiv, false);

      isOpen = true;
    }

    function hideDiv() {
      // fadeout div so that it can't be seen when the window is resized
      div.style.opacity = '0';
      $(".modal__trigger--active").css("opacity", "0");
      content.removeEventListener('transitionend', hideDiv, false);
    }
  };

  var close = function (event) {

    event.preventDefault();
    event.stopImmediatePropagation();

    var target = event.target;
    var div = document.getElementById('modal__temp');

    /**
     * make sure the modal__bg or modal__close was clicked, we don't want to be able to click
     * inside the modal and have it close.
     */

    if (isOpen && target.classList.contains('modal__bg') || target.classList.contains('modal__close')) {

      // make the hidden div visible again and remove the transforms so it scales back to its original size
      div.style.opacity = '1';
      $(".modal__trigger--active").css("opacity", "1");
      div.removeAttribute('style');

      /**
       * iterate through the modals and modal contents and triggers to remove their active classes.
       * remove the inline css from the trigger to move it back into its original position.
       */

      for (var i = 0; i < len; i++) {
        modals[i].classList.remove('modal--active');
        content[i].classList.remove('modal__content--active');
        trigger[i].style.transform = 'none';
        trigger[i].style.webkitTransform = 'none';
        trigger[i].classList.remove('modal__trigger--active');
      }

      // when the temporary div is opacity:1 again, we want to remove it from the dom
      div.addEventListener('transitionend', removeDiv, false);

      isOpen = false;

    }

    function removeDiv() {
      setTimeout(function () {
        window.requestAnimationFrame(function () {
          // remove the temp div from the dom with a slight delay so the animation looks good
          div.remove();
        });
      }, contentDelay - 50);
    }

  };

  var bindActions = function () {
    for (var i = 0; i < len; i++) {
      trigger[i].addEventListener('click', getId, false);
      closers[i].addEventListener('click', close, false);
      modalsbg[i].addEventListener('click', close, false);
    }
  };

  var init = function () {
    bindActions();
  };

  return {
    init: init
  };

}());

Modal.init();

/* Smooth Scroll */
// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function (event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        // console.log($(this).prop("href").split("#")[1]);

        setTimeout(() => {
          if ($(this).prop("href").split("#")[1] == "home") {
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 1000, function () {
              // Callback after animation
              // Must change focus!
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) { // Checking if the target was focused
                return false;
              } else {
                $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              };
            });
          } else {
            $('html, body').animate({
              scrollTop: target.offset().top + 100
            }, 1000, function () {
              // Callback after animation
              // Must change focus!
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) { // Checking if the target was focused
                return false;
              } else {
                $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              };
            });
          }

        }, 400);

      }
    }
  });

var scrollController = new ScrollMagic.Controller();
var about = new ScrollMagic.Scene({
  triggerElement: 'div.mypic',
  reverse:false,
  offset: -100
}).setClassToggle('div.mypic','fadeInLeft').addTo(scrollController);

var about1 = new ScrollMagic.Scene({
  triggerElement: 'div.mypic',
  reverse:false,
  offset: -100
}).setClassToggle('div.about div.myabout p.hi','fadeIn').addTo(scrollController);

var about2 = new ScrollMagic.Scene({
  triggerElement: 'div.mypic',
  reverse:false,
  offset: -100
}).setClassToggle('div.about div.myabout p.nanana','fadeIn').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: 'div.mypic',
  reverse:false,
  offset: -100
}).setClassToggle('div.about div.myabout div','fadeIn').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: '#edu',
  reverse:false,
}).setClassToggle('div.edulbl','fadeInLeft').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: '.timeline.exc',
  reverse:false,
}).setClassToggle('.timeline.exc','fadeIn').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: 'ul.timeline.exc li',
  reverse:false,
}).setClassToggle('ul.timeline.exc li','fadeInUp').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: '#skills',
  reverse:false,
}).setClassToggle('div.skllbl','fadeInLeft').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: 'div.skllbl',
  reverse:false,
}).setClassToggle('.pentagon:nth-child(1)','zoomIn').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: 'div.skllbl',
  reverse:false,
}).setClassToggle('.pentagon:nth-child(2)','zoomIn').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: 'div.skllbl',
  reverse:false,
}).setClassToggle('.pentagon:nth-child(3)','zoomIn').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: '#proje',
  reverse:false,
}).setClassToggle('div.projlbl','fadeInLeft').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: 'div.AniProj',
  reverse:false,
}).setClassToggle('.AniProj div.project div div.proj img','fadeInLeft').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: '#exp',
  reverse:false,
}).setClassToggle('div.explbl','fadeInLeft').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: '.timeline.ex',
  reverse:false,
}).setClassToggle('.timeline.ex','fadeIn').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: 'ul.timeline.ex li',
  reverse:false,
}).setClassToggle('ul.timeline.ex li','fadeInUp').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: '#contact',
  reverse:false,
}).setClassToggle('div.conlbl','fadeInLeft').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: 'div.conlbl',
  reverse:false,
}).setClassToggle('div.cont div i','rollIn').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: 'div.conlbl',
  reverse:false,
}).setClassToggle('table.aaaa2 i','rollIn').addTo(scrollController);

var about3 = new ScrollMagic.Scene({
  triggerElement: 'div.conlbl',
  reverse:false,
}).setClassToggle('table.aaaa2 h4','fadeInLeft').addTo(scrollController);

