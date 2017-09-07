document.addEventListener('DOMContentLoaded', function initializePage() {
	'use strict';

	var audio = document.getElementById('excerpt');

	var transcriptCuesTrack = [0.33, 0.57, 0.71, 1.38, 2.17, 2.36, 2.64, 3.88, 4.02, 4.32, 4.65, 5.1, 5.27, 5.52, 5.92, 6.28, 6.55, 7.37, 8.62, 9.48, 10.09, 10.36, 11.01, 11.82, 12.32, 13.15, 13.72, 14.01, 14.19, 14.65, 15.03, 15.37, 15.72, 16.14, 16.44, 16.74, 17.53, 17.91, 18.23, 18.9, 19.16, 19.52, 20.02, 21.29, 21.65, 21.94, 22.46, 23.28, 23.63, 23.88, 24.46, 24.75, 25.09, 25.59, 26.0, 26.48, 26.96, 27.26, 27.77, 28.21, 28.74, 29.58, 30.8, 31.58, 32.4, 32.77, 33.09, 33.82, 34.44, 34.68, 35.39, 35.89, 36.28, 37.03, 37.47, 37.97, 38.23, 38.63, 39.92, 40.18, 41.08, 42.11, 43.16, 43.64, 44.27, 45.1, 45.45, 46.09, 46.6, 46.87, 47.23, 48.06, 48.37, 48.91, 49.32, 49.76, 50.16, 50.52, 50.76, 51.04, 51.7, 52.44, 53.38, 54.3, 54.58, 55.04, 55.71, 56.16, 56.49, 57.02, 57.88, 58.46, 59.02, 59.45, 60.02];
	var visualCuesTrack = [
		{
			cueTime: 44.37,
			cuePositionName: "topWipe"
		},
		{
			cueTime: 45.14,
			cuePositionName: "bottomWipe"
		},
		{
			cueTime: 49,
			cuePositionName: "firstStar"
		},
		{
			cueTime: 49.25,
			cuePositionName: "secondStar"
		},
		{
			cueTime: 49.50,
			cuePositionName: "thirdStar"
		},
		{
			cueTime: 49.75,
			cuePositionName: "fourthStar"
		}
	];
	var MAX_TRANSITION_TIME = 0.4; //make sure transition time matches in index.html's styling

	transcriptCuesTrack.forEach(function setTransitionTimes(cue, index) {
		if (index + 1 === transcriptCuesTrack.length) {
			return;
		}
		var cueDuration = transcriptCuesTrack[index + 1] - cue;
		if (cueDuration < MAX_TRANSITION_TIME) {
			$(cue_position_selector(index)).forEach(function (cueElement) {
				cueElement.style.transitionDuration = cueDuration + "s";
			});
		}
	});

	$('article').on('click', function playAudio() {
		if (audio.paused || audio.ended) {
			audio.play().then(function () {
				requestAnimationFrame(updateHighlight);
			});
		} else {
			audio.pause();
			resetPlayer();
		}
	});
	audio.on('ended', resetPlayer);

	var currentTranscriptIndex = 0;
	var currentVisualIndex = 0;
	var HIGHLIGHTED_CLASS = "highlighted";

	function updateHighlight() {
		if (audio.paused || audio.ended) {
			return;
		}

		if (audio.currentTime >= transcriptCuesTrack[currentTranscriptIndex]) {
			$(cue_position_selector(currentTranscriptIndex)).forEach(addHighlightClass);
			currentTranscriptIndex++;
		}
		if (visualCuesTrack[currentVisualIndex] && audio.currentTime >= visualCuesTrack[currentVisualIndex].cueTime) {
			$(cue_position_selector(visualCuesTrack[currentVisualIndex].cuePositionName)).forEach(addHighlightClass);
			currentVisualIndex++;
		}

		requestAnimationFrame(updateHighlight);
	}

	function cue_position_selector(id) {
		return "[data-cue-position='" + id + "']"
	}

	function addHighlightClass($cueElement) {
		$cueElement.classList.add(HIGHLIGHTED_CLASS);
	}

	function resetPlayer() {
		audio.currentTime = 0;
		currentTranscriptIndex = 0;
		currentVisualIndex = 0;
		$("." + HIGHLIGHTED_CLASS).forEach(function removeHighlightClass(highlightedElement) {
			highlightedElement.classList.remove(HIGHLIGHTED_CLASS);
		});
	}

}, false);
