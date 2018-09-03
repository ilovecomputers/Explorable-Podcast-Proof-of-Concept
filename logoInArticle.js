"use strict";
(function bootStrapLogoAnimation() {
	const CONSTANTS = {
		SQUARE_SELECTOR: 'svg[data-cue-position="logo"] rect:not(:first-child)',
		HIGHLIGHTED: 'highlighted',
		ENTER_TRANSITION_TIME: 850,
		STAY_TRANSITION_TIME: 500,
		EXIT_TRANSITION_TIME: 850,
		INTERVAL: 250,
		CHANCE: 0.95,
	};

	document.addEventListener('DOMContentLoaded', function bootStrapLogoAnimation() {
		const squares = $(CONSTANTS.SQUARE_SELECTOR).map(element => new Square(element));
		applyCSSTransitionRules();
		setupHighlightedClassObservers(squares);
	});

	function applyCSSTransitionRules() {
		// language=CSS
		const styleText = `
		${CONSTANTS.SQUARE_SELECTOR}.highlighted {
			fill: #fd0;
			transition: fill linear ${CONSTANTS.ENTER_TRANSITION_TIME / 1000}s;
		}
		${CONSTANTS.SQUARE_SELECTOR} {
			transition: fill linear ${CONSTANTS.EXIT_TRANSITION_TIME / 1000}s;
		}
		`;
		const styleTag = document.createElement('style');

		styleTag.appendChild(document.createTextNode(styleText));
		document.head.appendChild(styleTag);
	}

	function setupHighlightedClassObservers(squares) {
		const mutationObserver = new MutationObserver(startStopAnimation.bind(null, squares));
		mutationObserver.observe($('svg[data-cue-position="logo"]')[0], {
			attributes: true,
			attributeFilter: ['class'],
			attributeOldValue: true
		})
	}


	let intervalHandle, cancelled = false;

	function startStopAnimation(squares, mutationList) {
		const oldValue = mutationList[0].oldValue;
		const target = mutationList[0].target;
		if (target.classList.contains(CONSTANTS.HIGHLIGHTED)
			&& (!oldValue || !oldValue.includes(CONSTANTS.HIGHLIGHTED))
			&& intervalHandle === undefined) {

			intervalHandle = requestInterval(animateSquares.bind(null, squares), CONSTANTS.INTERVAL);

		} else if (!target.classList.contains(CONSTANTS.HIGHLIGHTED)
			&& oldValue && oldValue.includes(CONSTANTS.HIGHLIGHTED)
			&& intervalHandle !== undefined) {

			cancelled = true;

		}
	}

	/**
	 * @param {Square[]} squares
	 * @param {DOMHighResTimeStamp} currentTime
	 */
	function animateSquares(squares, currentTime) {
		if (cancelled) {
			clearRequestInterval(intervalHandle);
			intervalHandle = undefined;
			cancelled = false;
			requestAnimationFrame(removeHighlights.bind(null, squares));
			return;
		}
		squares.forEach(square => {
			if (Math.random() < CONSTANTS.CHANCE) {
				return;
			}

			square.element.classList.add(CONSTANTS.HIGHLIGHTED);
			square.highlighted = true;
			square.addedHighlightTime = currentTime;
		});
		removeFinishedAnimatedHighlights(squares, currentTime);
	}

	/**
	 * @param {Square[]} squares
	 * @param {DOMHighResTimeStamp} currentTime
	 */
	function removeFinishedAnimatedHighlights(squares, currentTime) {
		const TIME_SINCE_HIGHLIGHT = CONSTANTS.ENTER_TRANSITION_TIME + CONSTANTS.STAY_TRANSITION_TIME;
		removeHighlights(squares
			.filter(square => square.highlighted
				&& currentTime - square.addedHighlightTime > TIME_SINCE_HIGHLIGHT
			))
		;
	}

	/**
	 * @param {Square[]} squares
	 */
	function removeHighlights(squares) {
		squares
			.forEach(square => {
				square.highlighted = false;
				square.element.classList.remove(CONSTANTS.HIGHLIGHTED);
			})
		;
	}

	class Square {

		/**
		 * @param {Element} element
		 */
		constructor(element) {
			this.highlighted = false;
			this.addedHighlightTime = 0;
			this.element = element;
		}
	}
})();