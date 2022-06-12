// connecting the main styles file
import "../scss/style.scss";

// The main modules ========================================================================================================================================================================================================================================================
import * as flsFunctions from "./files/functions.js";

/* Webp support checking, adding Webp or No-WebP class for html */
/* (i) is necessary for the correct display of Webp from CSS  */
flsFunctions.isWebp();
/* Adding a Touch class for html if a mobile browser */
flsFunctions.addTouchClass();
/* Adding Loaded for HTML after full loading of the page */
flsFunctions.addLoadedClass();
/* Module for working with menu (burger) */
flsFunctions.menuOpen();

/*
Module for working with spoilers
Documentation:
SNIPPET (HTML): Spollers
*/
flsFunctions.spollers();


// Work with forms ========================================================================================================================================================================================================================================================
import * as flsForms from "./files/forms/forms.js";

/* Work with form fields.Adding classes, working with PLACEHOLDER */
flsForms.formFieldsInit();

/* We connect a file with your code */
import "./files/script.js";