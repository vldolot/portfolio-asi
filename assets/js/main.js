/*
	Photon by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1140px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 320px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 250);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Dropdowns.
			$('#nav > ul').dropotron({
				offsetY: -22,
				mode: 'fade',
				noOpenerFade: true,
				speed: 300,
				detach: false
			});

		// Prioritize "important" elements on mobile.
			skel.on('+mobile -mobile', function() {
				$.prioritize(
					'.important\\28 mobile\\29',
					skel.breakpoint('mobile').active
				);
			});

		// Scrolly.
			$('.scrolly').scrolly();

      var wrap = $("#page-wrapper");
      var headerNav = $(".header-nav");
      // if ($window.innerWidth() > 736) {
        $window.scroll(function(e) {
          // console.log($window.scrollTop());
          if ($window.scrollTop() > $('#one').offset().top - 90) { //615
            wrap.addClass("fix-header-nav");
          } else {
            wrap.removeClass("fix-header-nav");
          }
          if ($window.scrollTop() > $('#footer').offset().top - 90) { //5500
            headerNav.hide("fade",500);
          } else {
            headerNav.show("fade",200);
          }
        });
      // }
      $window.resize(function(){
        if ($window.innerWidth() > 736) {
          headerNav.css('display', 'block');
        } else {
          headerNav.css('display', 'none');
        }
      });

		// Off-Canvas Navigation.
		var logoImg = '<img src="images/allstar_logo_white-red.svg" alt="All Star Interactive">';

			// Title Bar.
				$(
					'<div id="titleBar">' +
						'<a href="#navPanel" class="toggle"></a>' +
						'<span class="title"><a href="index.html">' + logoImg + '</a></span>' +
					'</div>'
				)
					.appendTo($body);

			// Navigation Panel.
				$(
					'<div id="navPanel">' +
						'<nav>' +
							$('#nav').navList() +
						'</nav>' +
					'</div>'
				)
					.appendTo($body)
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						side: 'left',
						target: $body,
						visibleClass: 'navPanel-visible'
					});

      $('.prevent-hash').click(function (ev) {
        if (ev.target.classList.contains('prevent-hash')) {
          ev.preventDefault();
          ev.stopPropagation();
          // console.log($('body')[0].classList);
          if ($body[0].classList.contains("navPanel-visible")) {
            $body.removeClass("navPanel-visible");            
          }
          $body.animate({
            scrollTop: $(ev.target.hash).position().top - 40,
            easing: 'swing',
            duration: 5000
          });
        }   
      });

			// Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
				if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
					$('#titleBar, #navPanel, #page-wrapper')
						.css('transition', 'none');
	});

	$(function() {

    if (window.location.pathname.indexOf("index.html") > -1 || window.location.pathname === "/") {
      var width, height, largeHeader, canvas, stars, ctx, points, target, animateHeader = true;

      // Main
      initHeader();
      initAnimation();
      addListeners();

      function initHeader() {
          width = window.innerWidth;
          target = {x: width/2, y: height/2};

          largeHeader = document.getElementById('header');
          height = largeHeader.offsetHeight;
          // largeHeader.style.height = height+'px';

          canvas = document.getElementById('animation-canvas');
          canvas.width = width;
          canvas.height = height;
          ctx = canvas.getContext('2d');

          // create points
          points = [];
          for(var x = 0; x < width; x = x + width/10) {
              for(var y = 0; y < height; y = y + height/20) {
                  var px = x + Math.random()*width/20;
                  var py = y + Math.random()*height/20;
                  var p = {x: px, originX: px, y: py, originY: py };
                  points.push(p);
              }
          }

          // for each point find the 5 closest points
          for(var i = 0; i < points.length; i++) {
              var closest = [];
              var p1 = points[i];
              for(var j = 0; j < points.length; j++) {
                  var p2 = points[j]
                  if(!(p1 == p2)) {
                      var placed = false;
                      for(var k = 0; k < 5; k++) {
                          if(!placed) {
                              if(closest[k] == undefined) {
                                  closest[k] = p2;
                                  placed = true;
                              }
                          }
                      }

                      for(var k = 0; k < 5; k++) {
                          if(!placed) {
                              if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                  closest[k] = p2;
                                  placed = true;
                              }
                          }
                      }
                  }
              }
              p1.closest = closest;
          }

          // assign a circle to each point
          for(var i in points) {
              var c = new Star(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
              points[i].circle = c;
          }

          // create star particles
          stars = [];
          for(var x = 0; x < width*0.15; x++) {
              var c = new Star2();
              stars.push(c);
          }
      }

      // Event handling
      function addListeners() {
          if(!('ontouchstart' in window)) {
              window.addEventListener('mousemove', mouseMove);
          }
          window.addEventListener('scroll', scrollCheck);
          window.addEventListener('resize', resize);
      }

      function mouseMove(e) {
          var posx = posy = 0;
          if (e.pageX || e.pageY) {
              posx = e.pageX;
              posy = e.pageY;
          }
          else if (e.clientX || e.clientY)    {
              posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
              posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
          }
          target.x = posx;
          target.y = posy;
      }

      function scrollCheck() {
          if(document.body.scrollTop > height) animateHeader = false;
          else animateHeader = true;
      }

      function resize() {
          width = window.innerWidth;
          height = largeHeader.offsetHeight; //window.innerHeight;

          // largeHeader.style.height = height+'px';
          canvas.width = width;
          canvas.height = height;
      }

      // animation
      function initAnimation() {
          animate();
          for(var i in points) {
              shiftPoint(points[i]);
          }
      }

      function animate() {
          if(animateHeader) {
              ctx.clearRect(0,0,width,height);
              for(var i in points) {
                  // detect points in range
                  if(Math.abs(getDistance(target, points[i])) < 4000) {
                      points[i].active = 0.3;
                      points[i].circle.active = 0.6;
                  } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                      points[i].active = 0.1;
                      points[i].circle.active = 0.3;
                  } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                      points[i].active = 0.02;
                      points[i].circle.active = 0.1;
                  } else {
                      points[i].active = 0;
                      points[i].circle.active = 0;
                  }

                  drawLines(points[i]);
                  points[i].circle.draw();
              }
              for(var i in stars) {
                  stars[i].draw();
              }
          }
          requestAnimationFrame(animate);
      }

      function shiftPoint(p) {
        TweenLite.to(p, 1.5*Math.random(), {
              x:p.originX-50+Math.random()*100,
              y: p.originY-50+Math.random()*100, 
              ease:Circ.easeInOut,
              onComplete: function() {
                  shiftPoint(p);
              }
            });
      }

      // Canvas manipulation
      function drawLines(p) {
          if(!p.active) return;
          for(var i in p.closest) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p.closest[i].x, p.closest[i].y);
              ctx.strokeStyle = 'rgba(218,218,218,'+ p.active+')';
              ctx.stroke();
          }
      }

      function Star(pos,rad,color) {
          var _this = this;

          // constructor
          (function() {
              _this.pos = pos || null;
              _this.radius = rad || null;
              _this.color = color || null;
          })();

          this.draw = function() {
              if(!_this.active) return;
              // ctx.beginPath();
              // ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
              // ctx.fillStyle = 'rgba(218,218,218,'+ _this.active+')';
              // ctx.fill();
              var cx = _this.pos.x, 
                  cy = _this.pos.y, 
                  spikes = 5, 
                  outerRadius = _this.radius*2.5, 
                  innerRadius = _this.radius*1.25;

              var rot=Math.PI/2*3;
              var x=cx;
              var y=cy;
              var step=Math.PI/spikes;

              ctx.beginPath();
              ctx.moveTo(cx,cy-outerRadius)
              for(i=0;i<spikes;i++){
                x=cx+Math.cos(rot)*outerRadius;
                y=cy+Math.sin(rot)*outerRadius;
                ctx.lineTo(x,y)
                rot+=step

                x=cx+Math.cos(rot)*innerRadius;
                y=cy+Math.sin(rot)*innerRadius;
                ctx.lineTo(x,y)
                rot+=step
              }
              ctx.lineTo(cx,cy-outerRadius);
              ctx.closePath();
              ctx.fillStyle='rgba(220,220,220,'+ _this.active+')';
              ctx.fill();
          };
      }

      // Canvas manipulation
      function Star2() {
          var _this = this;

          // constructor
          (function() {
              _this.pos = {};
              init();
              // console.log(_this);
          })();

          function init() {
              _this.pos.x = Math.random()*width;
              _this.pos.y = Math.random()*height; //height+Math.random()*100;
              _this.alpha = 0.1+Math.random()*0.3;
              _this.scale = 0.1+Math.random()*0.3;
              // _this.velocity = Math.random();
          }

          this.draw = function() {
              if(_this.alpha <= 0) {
                  init();
              }
              // _this.pos.y -= _this.velocity;
              _this.alpha -= 0.0005;
              var cx = _this.pos.x, 
                  cy = _this.pos.y, 
                  spikes = 5, 
                  outerRadius = _this.scale*30, 
                  innerRadius = _this.scale*15;

              var rot=Math.PI/2*3;
              var x=cx;
              var y=cy;
              var step=Math.PI/spikes;

              ctx.beginPath();
              ctx.moveTo(cx,cy-outerRadius)
              for(i=0;i<spikes;i++){
                x=cx+Math.cos(rot)*outerRadius;
                y=cy+Math.sin(rot)*outerRadius;
                ctx.lineTo(x,y)
                rot+=step

                x=cx+Math.cos(rot)*innerRadius;
                y=cy+Math.sin(rot)*innerRadius;
                ctx.lineTo(x,y)
                rot+=step
              }
              ctx.lineTo(cx,cy-outerRadius);
              ctx.closePath();
              ctx.fillStyle='rgba(255,255,255,'+ _this.alpha+')';
              ctx.fill();
          };
      }

      // Util
      function getDistance(p1, p2) {
          return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
      }
    }

	});

})(jQuery);