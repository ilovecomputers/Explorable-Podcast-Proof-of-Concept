'use strict';
document.addEventListener('DOMContentLoaded', function initializePage() {

	var audio = document.getElementById('excerpt');
	var MAX_TRANSITION_TIME = 0.4; //make sure transition time matches in index.html's styling

	cuesTrack.forEach(function setShortTransitionTimes(cue, index) {
		if (index + 1 === cuesTrack.length) {
			return;
		}
		var cueDuration = cuesTrack[index + 1].startTime - cue.startTime;
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
			})[0].startTime);
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

	var cueHighlightPosition = 0;
	var cueDullPosition = 0;
	var HIGHLIGHTED_CLASS = "highlighted";

	function updateHighlight() {
		if (audio.paused || audio.ended) {
			return;
		}

		while (cuesLeftToHighlight()) {
			$(cuePositionSelector(cuesTrack[cueHighlightPosition].cuePositionName)).forEach(addHighlightClass);
			cueHighlightPosition++;
		}

		while (cuesLeftToDull()) {
			$(cuePositionSelector(cuesTrackByEndTime[cueDullPosition].cuePositionName)).forEach(removeHighlightClass);
			cueDullPosition++;
		}

		requestAnimationFrame(updateHighlight);

		function cuesLeftToHighlight() {
			return cuesTrack[cueHighlightPosition] && audio.currentTime >= cuesTrack[cueHighlightPosition].startTime;
		}

		function cuesLeftToDull() {
			return cuesTrackByEndTime[cueDullPosition] && audio.currentTime >= cuesTrackByEndTime[cueDullPosition].endTime;
		}
	}

	function cuePositionSelector(id) {
		return "[data-cue-position='" + id + "']"
	}

	function addHighlightClass($cueElement) {
		$cueElement.classList.add(HIGHLIGHTED_CLASS);
	}

	function removeHighlightClass(highlightedElement) {
		highlightedElement.classList.remove(HIGHLIGHTED_CLASS);
	}

	function resetPlayer() {
		audio.currentTime = 0;
		cueHighlightPosition = 0;
		cueDullPosition = 0;
		$("." + HIGHLIGHTED_CLASS).forEach(removeHighlightClass);
	}

}, false);
