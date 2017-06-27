document.addEventListener('DOMContentLoaded', function initializePage() {
	'use strict';

	var audio = document.getElementById('excerpt');

	var tracks = {};
	var cues = [0.330, 0.57, 0.71, 1.38, 2.17, 2.36, 2.64];
	var totalLength = 0;
	$('p span').forEach(function measureSpanWidths(element, index) {
		totalLength += element.getBoundingClientRect().width;
		tracks[cues[index] + ""] = {
			id: "cue-position-" + index,
			highlightWidth: totalLength
		};
	});

	var playing = false;
	$('article').on('click', function playAudio() {
		if (!playing) {
			audio.play().then(function () {
				requestAnimationFrame(updateHighlight);
				playing = true;
			});
		} else {
			audio.pause();
			resetPlayer();
		}
	});
	audio.on('ended', resetPlayer);

	var p = $('p')[0];
	var currentIndex = 0;

	function updateHighlight() {
		if (audio.paused && audio.ended) {
			return;
		}

		var currentCue = cues[currentIndex];
		if (audio.currentTime >= currentCue) {
			var currentTrack = tracks[currentCue + ""];
			p.style.backgroundPosition = ( -( currentTrack.highlightWidth / totalLength ) * 100 ) + '%';
			currentIndex++;
		}
		requestAnimationFrame(updateHighlight);
	}

	function resetPlayer() {
		audio.currentTime = 0;
		currentIndex = 0;
		p.style.backgroundPosition = '0%';
		playing = false;
	}

}, false);
