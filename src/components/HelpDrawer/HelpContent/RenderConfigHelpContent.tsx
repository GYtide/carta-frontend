import widgetButtonRenderConfig from "static/help/widgetButton_renderConfig.png";
import widgetButtonRenderConfig_d from "static/help/widgetButton_renderConfig_d.png";

import {ImageComponent} from "../ImageComponent";

export const RENDER_CONFIG_HELP_CONTENT = (
    <div>
        <p>
            <ImageComponent light={widgetButtonRenderConfig} dark={widgetButtonRenderConfig_d} width="90%" />
        </p>
        <p>
            The Render Configuration Widget controls how a raster image is rendered in the Image Viewer. The widget contains a set of <b>Clip levels</b> as buttons on the top. The clip boundaries are displayed in the <b>Clip min</b> and{" "}
            <b>Clip max</b> fields. If these fields are edited manually, the clip level will be switched to <b>Custom</b>. The clip boundaries are visualized as and linked to two red vertical lines (draggable) in the histogram. The green
            dashed line represents the mean value of the histogram. The green shaded area represents +/- one RMS.
        </p>
        <p>
            By default, a per-channel histogram is shown, and optionally a per-cube histogram can be displayed via the <b>Histogram</b> dropdown menu if the active image is a cube with a spectral axis.
        </p>
        <p>
            Different scaling functions and color maps can be chosen via the <b>Scaling</b> and <b>Colormap</b> dropdown menus, respectively. A colormap may be inverted via the <b>Invert colormap</b> toggle.
        </p>
        <p>
            Bias and contrast can be adjusted jointly with the <b>Interactive 2D box</b> (x as bias in [-1. 1] and y as contrast in [0, 2]). The effective scaling function is visualized as a gray curve between the two red vertical lines. By
            default, smoothed bias and contrast functions are applied so that the resulting scaling function is a smooth curve. You may disable this feature with the <b>Render Configuration</b> tab of the Preferences Dialog.
        </p>
        <p>
            The color for rendering pixels with NaN value can be modified with the <b>NaN color</b> color picker. Once it is changed, the <b>NaN color</b> selection in the <b>Render Configuration</b> tab of the Preferences Dialog is also
            updated.
        </p>
        <p>The appearance of the histogram plot can be configured through the Render Configuration Settings Dialog, including:</p>
        <ul>
            <li>color of the plot</li>
            <li>plot styles including steps (default), lines, and dots</li>
            <li>line width for steps or lines</li>
            <li>point size for dots</li>
            <li>display y in logarithmic scale (default)</li>
            <li>display mean and RMS</li>
            <li>display clip labels</li>
            <li>x and y ranges</li>
            <li>reset x and y ranges</li>
        </ul>
        <h3 id="interactivity-zoom-and-pan">Interactivity: zoom and pan</h3>
        <p>The x and y ranges of the histogram plot can be modified by</p>
        <ul>
            <li>
                <code>scrolling wheel</code> (up to zoom in and down to zoom out with respect to the cursor position)
            </li>
            <li>
                <code>drag-and-drop</code> horizontally to zoom in x
            </li>
            <li>
                <code>drag-and-drop</code> vertically to zoom in y
            </li>
            <li>
                <code>drag-and-drop</code> diagonally to zoom in both x and y
            </li>
            <li>
                <code>double-click</code> to reset x and y ranges
            </li>
            <li>
                <code>shift + drag-and-drop</code> to pan in x
            </li>
        </ul>
        <p>In addition, the x and y ranges can be explicitly set in the Render Configuration Settings Dialog.</p>
    </div>
);
