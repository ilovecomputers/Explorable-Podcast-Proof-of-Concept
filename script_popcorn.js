document.addEventListener('DOMContentLoaded', function initializePage() {
  var h1 = document.querySelector('article h1');
  var fontStyle = window.getComputedStyle(h1).font;
  var canvas = document.createElement("canvas");
  var context = canvas.getContext('2d');
  context.font = fontStyle;
  var widthOfEntireText = context.measureText(h1.textContent).width;
  var widthSoFar = 0;
  Popcorn.plugin("subtitle", {
    start: function (event, track) {
      widthSoFar += context.measureText(track.text + " ").width;
//                this.pause();
//                debugger;
//                this.play();
      if (track === this.getTrackEvents()[this.getTrackEvents().length - 1]) {
        widthSoFar = widthOfEntireText;
      }
      h1.style.backgroundPosition = (-(widthSoFar / widthOfEntireText) * 100) + '%';
    },
    end: function (event, track) {
      if (track === this.getTrackEvents()[this.getTrackEvents().length - 1]) {
        this.pause(0);
      }
    }
  });
  var p = Popcorn("#excerpt", {
      frameAnimation: true
    })
    .parseSSA("testSub.ssa")
    ;
  h1.onclick = function () {
    widthSoFar = 0;
    h1.style.backgroundPosition = 0;
    p.play();
  };
}, false);
