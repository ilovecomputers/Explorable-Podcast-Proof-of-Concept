document.addEventListener('DOMContentLoaded', function initializePage() {
	'use strict';

	var audio = document.getElementById('excerpt');
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
	var HIGHLIGHTED_CLASS = "highlighted";

	function updateHighlight() {
		if (audio.paused || audio.ended) {
			return;
		}

		if (transcriptCuesTrack[currentTranscriptIndex] && audio.currentTime >= transcriptCuesTrack[currentTranscriptIndex].cueTime) {
			$(cue_position_selector(transcriptCuesTrack[currentTranscriptIndex].cuePositionName)).forEach(addHighlightClass);
			currentTranscriptIndex++;
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
		$("." + HIGHLIGHTED_CLASS).forEach(function removeHighlightClass(highlightedElement) {
			highlightedElement.classList.remove(HIGHLIGHTED_CLASS);
		});
	}

}, false);
