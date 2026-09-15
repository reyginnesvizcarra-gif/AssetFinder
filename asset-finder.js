(function () {
    "use strict";

    var initialized = false;

    function initializeAssetFinder() {

        /*
         * Prevent Salesforce from initializing
         * the same finder more than once.
         */
        if (initialized) {
            return;
        }

        var searchInput =
            document.getElementById("assetSearchInput");

        var clearButton =
            document.getElementById("assetClearButton");

        var resultsCount =
            document.getElementById("assetResultsCount");

        var assetGrid =
            document.getElementById("assetGrid");

        var startMessage =
            document.getElementById("assetSearchStart");

        var noResults =
            document.getElementById("assetNoResults");


        /*
         * If Salesforce hasn't rendered the
         * component yet, stop for now.
         */
        if (
            !searchInput ||
            !clearButton ||
            !resultsCount ||
            !assetGrid
        ) {
            return;
        }


        initialized = true;


        /*
         * Get all cards.
         */
        var cards =
            assetGrid.querySelectorAll(".asset-card");


        /*
         * Initial state.
         */
        assetGrid.classList.remove(
            "asset-grid-active"
        );


        if (startMessage) {
            startMessage.style.display = "block";
        }


        if (noResults) {
            noResults.style.display = "none";
        }


        clearButton.style.display = "none";


        resultsCount.textContent =
            cards.length +
            (
                cards.length === 1
                    ? " asset"
                    : " assets"
            );


        /*
         ============================================
         SEARCH
         ============================================
         */
        function performSearch() {

            var query =
                searchInput.value
                    .toLowerCase()
                    .trim();


            var matchCount = 0;


            /*
             * No search.
             */
            if (query === "") {

                assetGrid.classList.remove(
                    "asset-grid-active"
                );


                if (startMessage) {
                    startMessage.style.display = "block";
                }


                if (noResults) {
                    noResults.style.display = "none";
                }


                clearButton.style.display = "none";


                for (
                    var i = 0;
                    i < cards.length;
                    i++
                ) {

                    cards[i].classList.remove(
                        "asset-search-match"
                    );

                }


                resultsCount.textContent =
                    cards.length +
                    (
                        cards.length === 1
                            ? " asset"
                            : " assets"
                    );


                return;
            }


            /*
             * Search is active.
             */
            assetGrid.classList.add(
                "asset-grid-active"
            );


            if (startMessage) {
                startMessage.style.display = "none";
            }


            clearButton.style.display = "block";


            /*
             * Check every asset.
             */
            for (
                var i = 0;
                i < cards.length;
                i++
            ) {

                var card = cards[i];


                var assetName =
                    card.getAttribute(
                        "data-asset-name"
                    ) || "";


                var assetDate =
                    card.getAttribute(
                        "data-asset-date"
                    ) || "";


                var assetType =
                    card.getAttribute(
                        "data-asset-type"
                    ) || "";


                var cardText =
                    card.textContent || "";


                /*
                 * Everything searchable.
                 */
                var searchableText = (
                    assetName +
                    " " +
                    assetDate +
                    " " +
                    assetType +
                    " " +
                    cardText
                ).toLowerCase();


                /*
                 * Find match.
                 */
                var matched =
                    searchableText.indexOf(query) !== -1;


                if (matched) {

                    card.classList.add(
                        "asset-search-match"
                    );

                    matchCount++;

                } else {

                    card.classList.remove(
                        "asset-search-match"
                    );

                }

            }


            /*
             * Result count.
             */
            resultsCount.textContent =
                matchCount +
                (
                    matchCount === 1
                        ? " matching asset"
                        : " matching assets"
                );


            /*
             * No results.
             */
            if (noResults) {

                noResults.style.display =
                    matchCount === 0
                        ? "block"
                        : "none";

            }

        }


        /*
         ============================================
         TYPING
         ============================================
         */
        searchInput.addEventListener(
            "input",
            performSearch
        );


        /*
         ============================================
         ENTER
         ============================================
         */
        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    performSearch();

                }

            }
        );


        /*
         ============================================
         ESCAPE
         ============================================
         */
        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Escape") {

                    event.preventDefault();

                    searchInput.value = "";

                    performSearch();

                    searchInput.focus();

                }

            }
        );


        /*
         ============================================
         CLEAR
         ============================================
         */
        clearButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                searchInput.value = "";

                performSearch();

                searchInput.focus();

            }
        );

    }


    /*
     ================================================
     INITIAL LOAD
     ================================================
     */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAssetFinder
        );

    } else {

        initializeAssetFinder();

    }


    /*
     ================================================
     WINDOW LOAD
     ================================================
     */

    window.addEventListener(
        "load",
        initializeAssetFinder
    );


    /*
     ================================================
     SALESFORCE ASYNC FALLBACK
     ================================================
     *
     * Experience Cloud can render components
     * after DOMContentLoaded.
     *
     * Try again after a short delay.
     */

    setTimeout(
        initializeAssetFinder,
        1000
    );

    setTimeout(
        initializeAssetFinder,
        2500
    );

    setTimeout(
        initializeAssetFinder,
        5000
    );


})();
