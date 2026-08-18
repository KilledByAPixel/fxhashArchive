# INDUSTRIAL DEVOLUTION

As the abandoned sewage planet Xnor lay seemingly dormant, aeons crept by. Erosion and oxidation recombined in plumbing, slowly causing the pipes to evolve sentience and grow to the horizon in a blooming chaos of rust, steel and concrete.

Industrial Devolution is the first long-form generative project using my rayhatching algorithm. It combines a raymarcher for SDFs with a surface orientation based flow field renderer in order to draw arbitrary 3D scenes as line art, with an organic, hatched drawing style. The SDF formulas were generatively designed and parametrized to form ancient landscapes of corroded industrial pipes and immense, ageless blocks of concrete.

The entire code of Industrial Devolution is 3930 characters, using no external libraries.

When done rendering, the output can be right-click saved as an SVG file and plotted using a plotter such as an Axidraw. The lines in the SVG are in random order, so it is recommended to use a path reordering/optimizing tool such as axicli or vpype before plotting. This will greatly reduce the plotting time. The output SVG is intended to be plotted at A3 (297x420mm) using a 0.4mm black pen (but feel free to experiment). You can change this by adding these options to the URL:

  &lw=.4 the linewidth in millimetres
  &d=.8 the line density (multiplier to the line width, density 0.6 recommended for plotter output)
  &h=420 how high the page is, in millimetres (width is always height * 0.707)
  &bg=1 set to 0 to remove background rectangle (bg=0 recommended for plotter output)

Industrial Devolution was released during a live minting event at Bright Moments Gallery, Venice Beach in collaboration with Bright Moments, fx(hash) and Tender.

