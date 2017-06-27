document.addEventListener('DOMContentLoaded', function initializePage() {
	'use strict';

	var audio = document.getElementById('excerpt');
	var audioCtx = new AudioContext();
	var audioNode = audioCtx.createMediaElementSource(audio);
	var clock = new WAAClock(audioCtx);
	audioNode.connect(audioCtx.destination);

	var tracks = {};
	var cues = [0.330, 0.57, 0.71, 1.38, 2.17, 2.36, 2.64];
	var totalLength = 0;
	$('p span').forEach(function measureSpanWidths(element, index) {
		totalLength += element.getBoundingClientRect().width;
		tracks[cues[index] + ""] = {
			id: numberToLetter(index),
			highlightWidth: totalLength
		};
	});
	var p = $('p')[0];
	var currentIndex = 0;

	//TODO: switch to tone.js for scheduling
	$('article').on('click', function playAudio() {
		audio.play().then(function () {
			requestAnimationFrame(updateHighlight);
			clock.start();
			clock.setTimeout(function () {
				audio.pause();
				audio.currentTime = 0;
				clock.stop();
				currentIndex = 0;
				p.style.backgroundPosition = '0%';
			}, 3.3);
		});
	});

	//TODO: when on tone.js, schedule highlights, but make sure it happens on a frame and not the webworker
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

	function numberToLetter(number) {
		return String.fromCharCode(97 + number);
	}

}, false);
