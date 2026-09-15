(function () {
    "use strict";

    var initialized = false;

    function getElement(id) {
        return document.getElementById(id);
    }

    function initializeAssetFinder() {

        if (initialized) {
            return;
        }

        var searchInput = getElement("assetSearchInput");
        var clearButton = getElement("assetClearButton");
        var resultsCount = getElement("assetResultsCount");
        var assetGrid = getElement("assetGrid");
        var startMessage = getElement("assetSearchStart");
        var noResults = getElement("assetNoResults");

        if (!searchInput || !assetGrid) {
            return;
        }

        initialized = true;

        function getCards() {
            return assetGrid.querySelectorAll(".asset-card");
        }

        function updateInitialState() {

            var cards = getCards();
            var total = cards.length;

            assetGrid.classList.remove("asset-grid-active");

            for (var i = 0; i < cards.length; i++) {
                cards[i].classList.remove("asset-search-match");
            }

            if (startMessage) {
                startMessage.style.display = "block";
            }

            if (noResults) {
                noResults.style.display = "none";
            }

            if (clearButton) {
                clearButton.style.display = "none";
            }

            if (resultsCount) {
                resultsCount.textContent =
                    total + (total === 1 ? " asset" : " assets");
            }
        }

        function performSearch() {

            var cards = getCards();

            var query = searchInput.value
                .toLowerCase()
                .trim();

            var matchCount = 0;

            /*
             * EMPTY SEARCH
             */
            if (query === "") {

                assetGrid.classList.remove("asset-grid-active");

                for (var i = 0; i < cards.length; i++) {
                    cards[i].classList.remove("asset-search-match");
                }

                if (startMessage) {
                    startMessage.style.display = "block";
                }

                if (noResults) {
                    noResults.style.display = "none";
                }

                if (clearButton) {
                    clearButton.style.display = "none";
                }

                if (resultsCount) {
                    resultsCount.textContent =
                        cards.length +
                        (cards.length === 1 ? " asset" : " assets");
                }

                return 0;
            }

            /*
             * SEARCH ACTIVE
             */
            assetGrid.classList.add("asset-grid-active");

            if (startMessage) {
                startMessage.style.display = "none";
            }

            if (clearButton) {
                clearButton.style.display = "block";
            }

            /*
             * SEARCH ALL CURRENT CARDS
             */
            for (var i = 0; i < cards.length; i++) {

                var card = cards[i];

                var assetName =
                    card.getAttribute("data-asset-name") || "";

                var assetDate =
                    card.getAttribute("data-asset-date") || "";

                var assetType =
                    card.getAttribute("data-asset-type") || "";

                var cardText =
                    card.textContent || "";

                var searchableText = (
                    assetName +
                    " " +
                    assetDate +
                    " " +
                    assetType +
                    " " +
                    cardText
                ).toLowerCase();

                var matched =
                    searchableText.indexOf(query) !== -1;

                if (matched) {

                    card.classList.add("asset-search-match");

                    matchCount++;

                } else {

                    card.classList.remove("asset-search-match");

                }
            }

            /*
             * COUNT
             */
            if (resultsCount) {
                resultsCount.textContent =
                    matchCount +
                    (
                        matchCount === 1
                            ? " matching asset"
                            : " matching assets"
                    );
            }

            /*
             * NO RESULTS
             */
            if (noResults) {
                noResults.style.display =
                    matchCount === 0 ? "block" : "none";
            }

            return matchCount;
        }

        /*
         * LIVE SEARCH
         */
        searchInput.addEventListener("input", function () {
            performSearch();
        });

        /*
         * ENTER
         * Search + scroll to first matching asset
         */
        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.keyCode === 13
                ) {

                    event.preventDefault();
                    event.stopPropagation();

                    var matchCount = performSearch();

                    if (matchCount > 0) {

                        setTimeout(function () {

                            var firstMatch =
                                assetGrid.querySelector(
                                    ".asset-card.asset-search-match"
                                );

                            if (!firstMatch) {
                                return;
                            }

                            firstMatch.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });

                            firstMatch.classList.add(
                                "asset-search-highlight"
                            );

                            setTimeout(function () {

                                firstMatch.classList.remove(
                                    "asset-search-highlight"
                                );

                            }, 2000);

                        }, 150);

                    }
                }
            },
            true
        );

        /*
         * ESCAPE
         */
        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" ||
                    event.keyCode === 27
                ) {

                    event.preventDefault();
                    event.stopPropagation();

                    searchInput.value = "";

                    performSearch();

                    searchInput.focus();
                }
            },
            true
        );

        /*
         * CLEAR BUTTON
         */
        if (clearButton) {

            clearButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    searchInput.value = "";

                    performSearch();

                    searchInput.focus();
                }
            );

        }

        /*
         * INITIAL STATE
         */
        updateInitialState();

        /*
         * WATCH FOR SALESFORCE ADDING / REMOVING CARDS
         */
        if (window.MutationObserver) {

            var observer = new MutationObserver(
                function () {

                    /*
                     * Re-run the active search whenever
                     * Salesforce changes the asset grid.
                     */
                    if (
                        searchInput.value.trim() !== ""
                    ) {

                        performSearch();

                    } else {

                        updateInitialState();

                    }
                }
            );

            observer.observe(
                assetGrid,
                {
                    childList: true,
                    subtree: true
                }
            );
        }
    }


    /*
     * TRY INITIALIZATION
     */
    function tryInitialize() {

        initializeAssetFinder();

    }


    /*
     * DOM READY
     */
    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            tryInitialize
        );

    } else {

        tryInitialize();

    }


    /*
     * PAGE LOAD
     */
    window.addEventListener(
        "load",
        tryInitialize
    );


    /*
     * Salesforce can render the component later.
     */
    setTimeout(tryInitialize, 500);
    setTimeout(tryInitialize, 1500);
    setTimeout(tryInitialize, 3000);
    setTimeout(tryInitialize, 5000);


})();
