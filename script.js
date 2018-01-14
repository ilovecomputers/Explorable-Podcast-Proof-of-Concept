'use strict';
document.addEventListener('DOMContentLoaded', function initializePage() {

	var audio = document.getElementById('excerpt');
	var MAX_TRANSITION_TIME = 0.4; //make sure transition time matches in index.html's styling

	cuesTrack.forEach(function setShortTransitionTimes(cue, index) {
		if (index + 1 === cuesTrack.length) {
			return;
		}
		var cueDuration = cuesTrack[index + 1].cueTime - cue.cueTime;
		if (cueDuration < MAX_TRANSITION_TIME) {
			$(cuePositionSelector(cue.cuePositionName)).forEach(function (cueElement) {
				cueElement.style.transitionDuration = cueDuration + "s";
			});
		}
	});

	$('article').on('click', function playFromCue(event) {
		var target = event.target;
		var cuePositionName = target.dataset.cuePosition;
		if (cuePositionName) {
			playAudio(cuesTrack.filter(function (cueTrack) {
				return cueTrack.cuePositionName.localeCompare(cuePositionName) === 0;
			})[0].cueTime);
		}
	});
	audio.on('ended', resetPlayer);

	function playAudio(startTime) {
		if (startTime) {
			audio.currentTime = startTime;
		}
		if (audio.paused || audio.ended) {
			audio.play().then(function () {
				requestAnimationFrame(updateHighlight);
			});
		} else {
			audio.pause();
			resetPlayer();
		}
	}

	var cuePosition = 0;
	var HIGHLIGHTED_CLASS = "highlighted";

	function updateHighlight() {
		if (audio.paused || audio.ended) {
			return;
		}

		while (cuesLeftToHighlight()) {
			$(cuePositionSelector(cuesTrack[cuePosition].cuePositionName)).forEach(addHighlightClass);
			cuePosition++;
		}

		requestAnimationFrame(updateHighlight);

		function cuesLeftToHighlight() {
			return cuesTrack[cuePosition] && audio.currentTime >= cuesTrack[cuePosition].cueTime;
		}
	}

	function cuePositionSelector(id) {
		return "[data-cue-position='" + id + "']"
	}

	function addHighlightClass($cueElement) {
		$cueElement.classList.add(HIGHLIGHTED_CLASS);
	}

	function resetPlayer() {
		audio.currentTime = 0;
		cuePosition = 0;
		$("." + HIGHLIGHTED_CLASS).forEach(function removeHighlightClass(highlightedElement) {
			highlightedElement.classList.remove(HIGHLIGHTED_CLASS);
		});
	}

}, false);
