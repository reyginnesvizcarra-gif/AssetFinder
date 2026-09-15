(function () {

  "use strict";


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
    =====================================================
    STOP IF REQUIRED ELEMENTS ARE MISSING
    =====================================================
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
    =====================================================
    GET ALL ASSET CARDS
    =====================================================
    */

    var cards =
      assetGrid.querySelectorAll(".asset-card");


    /*
    =====================================================
    INITIAL STATE
    =====================================================
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
    =====================================================
    SEARCH FUNCTION
    =====================================================
    */

    function performSearch() {

      var query =
        searchInput.value
          .toLowerCase()
          .trim();


      var matchCount = 0;


      /*
      ===================================================
      EMPTY SEARCH
      ===================================================
      */

      if (query === "") {

        /*
         * Hide asset grid
         */

        assetGrid.classList.remove(
          "asset-grid-active"
        );


        /*
         * Show start message
         */

        if (startMessage) {
          startMessage.style.display = "block";
        }


        /*
         * Hide no-results message
         */

        if (noResults) {
          noResults.style.display = "none";
        }


        /*
         * Hide clear button
         */

        clearButton.style.display = "none";


        /*
         * Remove matching classes
         */

        for (
          var i = 0;
          i < cards.length;
          i++
        ) {

          cards[i].classList.remove(
            "asset-search-match"
          );

        }


        /*
         * Reset count
         */

        resultsCount.textContent =
          cards.length +
          (
            cards.length === 1
              ? " asset"
              : " assets"
          );


        return 0;
      }


      /*
      ===================================================
      SEARCH IS ACTIVE
      ===================================================
      */

      assetGrid.classList.add(
        "asset-grid-active"
      );


      /*
       * Hide starting message
       */

      if (startMessage) {
        startMessage.style.display = "none";
      }


      /*
       * Show clear button
       */

      clearButton.style.display = "block";


      /*
      ===================================================
      SEARCH EACH ASSET
      ===================================================
      */

      for (
        var i = 0;
        i < cards.length;
        i++
      ) {

        var card =
          cards[i];


        /*
         * Get data attributes
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
         * Get visible card text
         */

        var cardText =
          card.textContent || "";


        /*
         * Combine searchable values
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
         * Check for match
         */

        var matched =
          searchableText.indexOf(query) !== -1;


        /*
         * Matching card
         */

        if (matched) {

          card.classList.add(
            "asset-search-match"
          );

          matchCount++;

        }


        /*
         * Non-matching card
         */

        else {

          card.classList.remove(
            "asset-search-match"
          );

        }

      }


      /*
      ===================================================
      UPDATE RESULT COUNT
      ===================================================
      */

      resultsCount.textContent =
        matchCount +
        (
          matchCount === 1
            ? " matching asset"
            : " matching assets"
        );


      /*
      ===================================================
      NO RESULTS
      ===================================================
      */

      if (noResults) {

        if (matchCount === 0) {

          noResults.style.display =
            "block";

        }

        else {

          noResults.style.display =
            "none";

        }

      }


      /*
      Return number of matches
      */

      return matchCount;

    }


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
    ENTER KEY
    =====================================================
    */

    searchInput.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Enter") {

          /*
           * Prevent Enter from submitting
           * another Salesforce form.
           */

          event.preventDefault();

          event.stopPropagation();


          /*
           * Perform the search.
           */

          var matchCount =
            performSearch();


          /*
           * Find the first matching card.
           */

          if (matchCount > 0) {

            var firstMatch =
              assetGrid.querySelector(
                ".asset-card.asset-search-match"
              );


            /*
             * Scroll the first matching
             * asset into view.
             */

            if (firstMatch) {

              firstMatch.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });


              /*
               * Optional visual focus
               */

              firstMatch.setAttribute(
                "tabindex",
                "-1"
              );

              firstMatch.focus({
                preventScroll: true
              });

            }

          }

        }

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


        /*
         * Clear input
         */

        searchInput.value = "";


        /*
         * Reset search
         */

        performSearch();


        /*
         * Return focus to search
         */

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

        if (event.key === "Escape") {

          event.preventDefault();

          searchInput.value = "";

          performSearch();

          searchInput.focus();

        }

      }
    );

  }


  /*
  =====================================================
  INITIAL PAGE LOAD
  =====================================================
  */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initializeAssetFinder
    );

  }

  else {

    initializeAssetFinder();

  }


  /*
  =====================================================
  SALESFORCE / ASYNC LOAD SUPPORT
  =====================================================
  */

  window.addEventListener(
    "load",
    initializeAssetFinder
  );


})();
