# Gravoscope v0.0.1

currently available at http://chromoscope.net/gravoscope/

Largely based on [Planckoscope](http://github.com/chrisnorth/Planckscope), which is in turn based on [Chromoscope](http://github.com/slowe/Chromoscope) 

This application requires Chromoscope v1.4.4.

## Data source
* LIGO data is from the "LALInference" maps (in HEALPix format), available on the [LIGO Open Science Centre](http://losc.ligo.org)

## Technical details

The relevant parts of the Chromoscope source code (1.4.4 subdirectory) are included in this repository but have not been altered.
It will run locally or on a web server. To run locally you will need to download this code, and either link to the online tilesets or download them from www.chromoscope.net/planck/download.

For more information on Chromoscope, see www.chromoscope.net and github.com/slowe/chromoscope

Functions in v0.0.1
 * Behaves more sensibly in "compact mode" (useful for embedding)
 * Version number displayed

Functions in v0.0.1 (beyond Chromoscope):
 * Adds a second label layer for 'Planck labels'
 * Allow the overlay of more than one layer
 * Add a hidable options box to the left side
 * Adds ability to change opacity of overlays
 * Displays info/help for overlay layers
 * Uses reregisterkey plugin to allow behaviour of keys to be changed
 * Regegisters '.' key to hide new displays
 
Future modifications planned:
 * More overlays?
 * Support for adding KML tags
 * Better language support (currently only native-Chromoscope text is translated)

