(function () {

  "use strict";

  var initialized = false;


  /*
  =====================================================
  INITIALIZE ASSET FINDER
  =====================================================
  */

  function initializeAssetFinder() {

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
    -----------------------------------------------------
    STOP IF ELEMENTS DON'T EXIST YET
    -----------------------------------------------------
    */

    if (
      !searchInput ||
      !clearButton ||
      !resultsCount ||
      !assetGrid
    ) {
      return;
    }


    /*
    -----------------------------------------------------
    PREVENT DUPLICATE EVENT HANDLERS
    -----------------------------------------------------
    */

    if (initialized) {
      return;
    }

    initialized = true;


    /*
    =====================================================
    GET CURRENT ASSET CARDS
    =====================================================
    */

    function getCards() {

      return assetGrid.querySelectorAll(
        ".asset-card"
      );

    }


    /*
    =====================================================
    UPDATE TOTAL COUNT
    =====================================================
    */

    function updateCount() {

      var cards = getCards();

      var total = cards.length;

      resultsCount.textContent =
        total +
        (
          total === 1
            ? " asset"
            : " assets"
        );

    }


    /*
    =====================================================
    PERFORM SEARCH
    =====================================================
    */

    function performSearch() {

      /*
       * IMPORTANT:
       * Get cards every time.
       * Salesforce can render more cards later.
       */

      var cards = getCards();

      var query =
        searchInput.value
          .toLowerCase()
          .trim();

      var matchCount = 0;


      /*
      ---------------------------------------------------
      EMPTY SEARCH
      ---------------------------------------------------
      */

      if (query === "") {

        assetGrid.classList.remove(
          "asset-grid-active"
        );


        if (startMessage) {

          startMessage.style.display =
            "block";

        }


        if (noResults) {

          noResults.style.display =
            "none";

        }


        clearButton.style.display =
          "none";


        for (
          var i = 0;
          i < cards.length;
          i++
        ) {

          cards[i].classList.remove(
            "asset-search-match"
          );

        }


        updateCount();

        return 0;

      }


      /*
      ---------------------------------------------------
      SHOW GRID
      ---------------------------------------------------
      */

      assetGrid.classList.add(
        "asset-grid-active"
      );


      /*
      ---------------------------------------------------
      HIDE START MESSAGE
      ---------------------------------------------------
      */

      if (startMessage) {

        startMessage.style.display =
          "none";

      }


      /*
      ---------------------------------------------------
      SHOW CLEAR BUTTON
      ---------------------------------------------------
      */

      clearButton.style.display =
        "block";


      /*
      ---------------------------------------------------
      SEARCH CARDS
      ---------------------------------------------------
      */

      for (
        var i = 0;
        i < cards.length;
        i++
      ) {

        var card = cards[i];


        /*
         * Get extra searchable information
         */

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


        /*
         * Get all visible text
         */

        var cardText =
          card.textContent || "";


        /*
         * Build searchable string
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
         * Check match
         */

        var matched =
          searchableText.indexOf(
            query
          ) !== -1;


        if (matched) {

          card.classList.add(
            "asset-search-match"
          );

          matchCount++;

        }

        else {

          card.classList.remove(
            "asset-search-match"
          );

        }

      }


      /*
      ---------------------------------------------------
      RESULT COUNT
      ---------------------------------------------------
      */

      resultsCount.textContent =
        matchCount +
        (
          matchCount === 1
            ? " matching asset"
            : " matching assets"
        );


      /*
      ---------------------------------------------------
      NO RESULTS
      ---------------------------------------------------
      */

      if (noResults) {

        noResults.style.display =
          matchCount === 0
            ? "block"
            : "none";

      }


      return matchCount;

    }


    /*
    =====================================================
    ENTER KEY + SCROLL
    =====================================================
    */

    searchInput.addEventListener(
      "keydown",
      function (event) {

        /*
         * Detect Enter
         */

        if (
          event.key === "Enter" ||
          event.keyCode === 13
        ) {

          /*
           * Stop Salesforce/form submission
           */

          event.preventDefault();

          event.stopPropagation();


          /*
           * Execute search
           */

          var matchCount =
            performSearch();


          /*
           * If there are results,
           * scroll to first result.
           */

          if (matchCount > 0) {

            /*
             * Wait briefly for the browser
             * to display the matching cards.
             */

            setTimeout(
              function () {

                var firstMatch =
                  assetGrid.querySelector(
                    ".asset-card.asset-search-match"
                  );


                if (!firstMatch) {
                  return;
                }


                /*
                 * Scroll to the asset.
                 *
                 * "center" puts it roughly
                 * in the middle of the screen.
                 */

                firstMatch.scrollIntoView({
                  behavior: "smooth",
                  block: "center"
                });


                /*
                 * Optional temporary highlight
                 */

                firstMatch.classList.add(
                  "asset-search-highlight"
                );


                /*
                 * Remove highlight after
                 * 2 seconds.
                 */

                setTimeout(
                  function () {

                    firstMatch.classList.remove(
                      "asset-search-highlight"
                    );

                  },
                  2000
                );

              },
              100
            );

          }

        }

      },
      true
    );


    /*
    =====================================================
    LIVE SEARCH
    =====================================================
    */

    searchInput.addEventListener(
      "input",
      function () {

        performSearch();

      }
    );


    /*
    =====================================================
    CLEAR BUTTON
    =====================================================
    */

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


    /*
    =====================================================
    ESCAPE KEY
    =====================================================
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
    =====================================================
    INITIAL STATE
    =====================================================
    */

    assetGrid.classList.remove(
      "asset-grid-active"
    );


    if (startMessage) {

      startMessage.style.display =
        "block";

    }


    if (noResults) {

      noResults.style.display =
        "none";

    }


    clearButton.style.display =
      "none";


    updateCount();

  }


  /*
  =====================================================
  INITIALIZE
  =====================================================
  */

  function tryInitialize() {

    initializeAssetFinder();

  }


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
  =====================================================
  SALESFORCE LOAD SUPPORT
  =====================================================
  */

  window.addEventListener(
    "load",
    tryInitialize
  );


  /*
  Salesforce may render components
  asynchronously.
  */

  setTimeout(
    tryInitialize,
    500
  );

  setTimeout(
    tryInitialize,
    1500
  );

  setTimeout(
    tryInitialize,
    3000
  );

  setTimeout(
    tryInitialize,
    5000
  );


})();
