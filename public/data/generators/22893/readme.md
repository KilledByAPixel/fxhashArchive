GEOMORPHISM

A 4444 character magic spell for my rayhatching framework to render thinking rocks.

This piece may take some time to render (about 1-3 minutes, depending on hardware). The rendering time is symbolic of the vastness and agelessness of these rock structures, it is recommended to use the rendering time to contemplate deeply the concept of time spans so incredibly long, that to experience them they would have to overwrite your memories several times and thus are impossible to truly comprehend.

To ponder how, if they are so old, how come some of them float? Are these rocks the fixtures and has time and space itself eroded around them?

This project uses an approach called "rejection sampling". This means the program generates a random set of parameters, and then checks/previews how the resulting image would look. It measures the amount of visible objects, light and shadows, and then determines whether these fall into acceptable ranges. If not, it generates a new set of parameters. For certain hashes over a 100 parameter sets may be checked before it accepts the image.

The features of this project are "cliff", "ground", "thing" and "sky". These are not parameters, they are actual measurements of the resulting image, indicating what percentage of the view is occupied.

This piece can be saved as an SVG and plotted. It is recommended to run a path order optimization tool such as vpype or axicli, this will greatly reduce plotting time.

Some options can be changed via the URL:

&w=.25 : The line width in millimetres.
&d=.4 : Line density (multiplier to linewidth).
&h=235 : Page height in millimetres. The aspect ratio is 16:9, for a width of 420mm, suitable for A3 plotting.

The line width is set to 0.25 millimetres to suit most common fine liner pen stroke widths when plotting. 

If you don't intend to plot this piece, perhaps also try rendering it at 0.2 or even 0.1 millimetres line width, for an even more detailed image (it will also take longer to render).

(c) 2022 by Piter Pasma