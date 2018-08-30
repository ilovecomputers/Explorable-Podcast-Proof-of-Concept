'use strict';
document.addEventListener('DOMContentLoaded', function initializePage() {

	var audio = document.getElementById('excerpt');

	// Ideally these transitions are applied directly to html
	var MAX_TRANSITION_TIME = 0.4; //make sure transition time matches in index.html's styling
	cuesTrack
		.filter(function isTextHighlight(cue) { return cue.isTextHighlight; })
		.forEach(function setShortTransitionTimes(cue, index, cuesTrack) {
		if (index + 1 === cuesTrack.length) {
			return;
		}
		var cueDuration = cuesTrack[index + 1].startTime - cue.startTime;
		if (cueDuration < MAX_TRANSITION_TIME) {
			$(cuePositionSelector(cue.cuePositionName))
				.filter(function applyOnlyToTextToPreventGlitch(cueElement) {
					return cueElement.tagName.toLowerCase() === "span";
				})
				.forEach(function setShortTransitionTimes(cueElement) {
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
			requestAnimationFrame(resetPlayer);
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
			$(cuePositionSelector(cuesTrack[cueDullPosition].cuePositionName)).forEach(removeHighlightClass);
			cueDullPosition++;
		}

		requestAnimationFrame(updateHighlight);

		function cuesLeftToHighlight() {
			return cuesTrack[cueHighlightPosition] && audio.currentTime >= cuesTrack[cueHighlightPosition].startTime;
		}

		function cuesLeftToDull() {
			return cuesTrack[cueDullPosition] && audio.currentTime >= cuesTrack[cueDullPosition].endTime;
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
		resetSVGTransforms();
	}

	// Doing this cause of a Safari bug: https://bugs.webkit.org/show_bug.cgi?id=183433
	function resetSVGTransforms() {
		$('svg').forEach(function resetSVGTransform(svg) {
			Array.from(svg.children).forEach(function applyTransform(element) {
				element.style.transform = "scale(1)";
				requestAnimationFrame(function removeTransform() {
					element.style.transform = "";
				})
			})

		});
	}

}, false);
