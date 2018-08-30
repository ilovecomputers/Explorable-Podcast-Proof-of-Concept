"use strict";
(function bootStrapLogoAnimation() {
	const CONSTANTS = {
		SQUARE_SELECTOR: 'rect:not(:first-child)',
		ENTER_TRANSITION_TIME: 850,
		STAY_TRANSITION_TIME: 500,
		EXIT_TRANSITION_TIME: 850,
		INTERVAL: 250,
		CHANCE: 0.95,
	};

	document.addEventListener('DOMContentLoaded', function bootStrapLogoAnimation() {
		const squares = $(CONSTANTS.SQUARE_SELECTOR).map(element => new Square(element));
		applyCSSTransitionRules();
		$('#start').on('click', startStopAnimation.bind(null, squares));
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
		const $style = $('#transition');

		if ($style.length !== 0) {
			$style[0].firstChild.textContent = styleText;
			return;
		}

		const styleTag = document.createElement('style');
		styleTag.appendChild(document.createTextNode(styleText));
		styleTag.id = "transition";
		document.head.appendChild(styleTag);
	}


	let gui, intervalHandle;

	function startStopAnimation(squares, event) {
		const $button = event.target;
		switch ($button.textContent) {
			case 'Start':
				intervalHandle = requestInterval(animateSquares.bind(null, squares), CONSTANTS.INTERVAL);
				setupGUI(squares);
				$button.textContent = 'Stop';
				break;
			case 'Stop':
				clearRequestInterval(intervalHandle);
				requestAnimationFrame(removeHighlights.bind(null, squares));
				gui.destroy();
				$button.textContent = 'Start';
				break;
		}
	}

	function setupGUI(squares) {
		gui = new dat.GUI();
		gui.add(CONSTANTS, 'ENTER_TRANSITION_TIME', 0, 2000).onFinishChange(() => applyCSSTransitionRules());
		gui.add(CONSTANTS, 'STAY_TRANSITION_TIME', 0, 2000);
		gui.add(CONSTANTS, 'EXIT_TRANSITION_TIME', 0, 2000).onFinishChange(() => applyCSSTransitionRules());
		gui.add(CONSTANTS, 'INTERVAL', 0, 2000).onFinishChange(() => {
			clearRequestInterval(intervalHandle);
			intervalHandle = requestInterval(animateSquares.bind(null, squares), CONSTANTS.INTERVAL);
		});
		gui.add(CONSTANTS, 'CHANCE', 0, 1);
	}

	/**
	 * @param {Square[]} squares
	 * @param {DOMHighResTimeStamp} currentTime
	 */
	function animateSquares(squares, currentTime) {
		squares.forEach(square => {
			if (Math.random() < CONSTANTS.CHANCE) {
				return;
			}

			square.element.classList.add('highlighted');
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
				square.element.classList.remove('highlighted');
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