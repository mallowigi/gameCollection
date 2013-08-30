/**
 * Created by Elior on 24/07/13.
 */
(function ($) {
	$.fn.ratingStars = function (options) {

		/**
		 * Init the module: merge the settings with the given element's data attributes and set its settings
		 * @returns {object} the merged settings
		 */
		function initStars($stars) {
			var defOptions = {
				gold: 'star-gold',
				silver: 'star-silver',
				half: 'star-half',
				numStars: 5,
				size: 28,
				rating: 0,
				halving: true, // If we allow half rating
				method: 'local', // or ajax to update directly
				url: '', // if ajax here is the url to update
				isLocked: false,
				ajaxLock: false // If ajax and true, lock after the rate has been given
			};

			// Parse data attributes of $stars
			var starsOpts = $stars.data();

			// the final settings: data attributes > options > default
			var settings = $.extend({}, defOptions, options, starsOpts);
			protectSettings(settings);

			return settings;
		}

		/**
		 * Parse the settings and return true if there is no error.
		 * @returns {boolean} if there are no errors
		 */
		function protectSettings(settings) {
			if (isNaN(settings.rating) || settings.rating < 0 || settings.rating > 5) {
				settings.error = "Rating must be between 0 and 5";
			}
			else if (settings.method !== "local" && settings.method !== "ajax") {
				settings.error = "Method must be either 'local' or 'ajax'";
			}

			if (settings.error) {
				console.error(settings.error);
			}
			return settings.error !== "undefined";
		}

		/**
		 * Draw empty stars
		 */
		function drawStars($stars, settings) {
			for (var i = 0; i < settings.numStars; i++) {
				$stars.append('<i class="star" data-star="' + (i + 1) + '"/>');
			}
		}

		/**
		 * Fills a star with a given style
		 * @param i the star number
		 * @param fillStyle the style (gold/half)
		 * @param $stars the stars element
		 * @param settings the settings
		 */
		function fillStar($stars, settings, i, fillStyle) {
			var $star = $stars.find('i[data-star="' + (i + 1) + '"]'),
				classesToRemove = settings.silver + " " + settings.half;
			return $star &&
			       $star.removeClass(classesToRemove)
				       .addClass(fillStyle);
		}

		/**
		 * Clear the rating
		 */
		function clearRating($stars, settings) {
			var classesToRemove = settings.gold + " " + settings.half;
			$stars.find("i.star").each(function () {
				// foreach star remove the gold and half classes
				$(this).removeClass(classesToRemove)
					.addClass(settings.silver);
			});
		}

		/**
		 * Fill the stars with the current rating
		 */
		function fillStars($stars, settings) {
			// current rating (ex: 3.2)
			var rating = settings.rating,
				floorRating = Math.floor(rating),
				ratio = Math.round((rating - Math.floor(rating)) * 100) / 100;

			// Reset rating
			clearRating($stars, settings);

			// Fill full stars
			for (var i = 0; i < floorRating; i++) {
				fillStar($stars, settings, i, settings.gold);
			}
			// If not halving and ratio > 0.5, round to the upper
			if (!settings.halving && ratio >= 0.5) {
				fillStar($stars, settings, i, settings.gold);
			}

			// if ratio is in range [0.25, 0.75] round to the half if halving is true
			else if (settings.halving && ratio >= 0.25 && ratio <= 0.74) {
				fillStar($stars, settings, i, settings.half);
			}
			// Otherwise
			else if (settings.halving && ratio > 0.74) {
				fillStar($stars, settings, i, settings.gold);
			}

		}

		/**
		 * What to do when ajax response comes back
		 * @param event
		 */
		function ajaxRateSuccess(event) {
		}

		/**
		 * Updates the rating after clicking the star
		 * @param event
		 */
		function localRateSuccess(event) {

		}

		// Fills the stars on mouse over
		function fillOnMouseOver(event) {
			var star = this,
				$stars = event.data.$stars,
				settings = event.data.settings,
				currClass = settings.gold;

			clearRating($stars, settings);

			// Fills each star until the current one
			$stars.find("i").each(function () {
				var curStar = this,
					$curStar = $(this);
				$curStar.removeClass(settings.silver);
				$curStar.removeClass(settings.half);
				$curStar.addClass(currClass);

				// If we got to the current one
				if (curStar == star) {
					// if halving enabled:
					if (settings.halving) {
						var posX = (event.pageX - $curStar.offset().left);
						if (posX <= (settings.size / 2)) {
							$curStar.addClass(settings.half);
						}
						else {
							$curStar.addClass(settings.gold);
						}
					}

					// Next will be set to silver
					currClass = settings.silver;
				}
			});
		}

		function clearOnMouseLeave(event) {
			var star = this,
				$stars = event.data.$stars,

			settings = initStars($stars);
			clearRating($stars, settings);
			fillStars($stars, settings);
		}

		function rateOnClick(event) {
			var star = this,
				$curStar = $(this),
				$stars = event.data.$stars,
				settings = event.data.settings;

			if (settings.method == "ajax") {
				// do some ajax stuff
			}
			else {
				// get rating of cur star
				var rating = $curStar.data("star");
				// if we are giving an half star
				if (settings.halving) {
					var posX = (event.pageX - $curStar.offset().left);
					if (posX <= (settings.size / 2)) {
						rating -= 0.5
					}
				}

				// and sets the data
				$stars.data("rating", rating);
			}
		}

		return this.each(function () {
			var $stars = $(this),
				settings = initStars($stars);

			drawStars($stars, settings);

			// fill stars given rating from data attribute
			fillStars($stars, settings);

			// bind handlers
			if (!settings.isLocked) {
				var data = { $stars: $stars, settings: settings};
				// ajax binding
				if (settings.method === "ajax") {
					$stars.on("rateSuccess.ajax.ratingStars", ajaxRateSuccess, data);
				}
				else {
					$stars.on("rateSuccess.local.ratingStars", localRateSuccess, data)
				}

				// Bind hover, leave and click handlers on each star
				$stars.find("i.star").on({
					mousemove: fillOnMouseOver,
					mouseleave: clearOnMouseLeave,
					click: rateOnClick
				}, data);
			}
		});
	}
})
	(jQuery);