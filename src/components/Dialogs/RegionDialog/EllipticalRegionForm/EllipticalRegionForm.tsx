import * as React from "react";
import * as AST from "ast_wrapper";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {H5, InputGroup, NumericInput, Classes} from "@blueprintjs/core";
import {CARTA} from "carta-protobuf";
import {RegionStore} from "stores";
import {Point2D} from "models";
import "./EllipticalRegionForm.css";

@observer
export class EllipticalRegionForm extends React.Component<{ region: RegionStore, wcsInfo: number }> {
    @observable displayColorPicker: boolean;

    private handleNameChange = (ev) => {
        this.props.region.setName(ev.currentTarget.value);
    };

    private handleCenterXChange = (ev) => {
        if (ev.type === "keydown" && ev.keyCode !== 13) {
            return;
        }
        const valueString = ev.currentTarget.value;
        const value = parseFloat(valueString);
        if (isFinite(value)) {
            this.props.region.setControlPoint(0, {x: value, y: this.props.region.controlPoints[0].y});
        }
    };

    private handleCenterYChange = (ev) => {
        if (ev.type === "keydown" && ev.keyCode !== 13) {
            return;
        }
        const valueString = ev.currentTarget.value;
        const value = parseFloat(valueString);
        if (isFinite(value)) {
            this.props.region.setControlPoint(0, {x: this.props.region.controlPoints[0].x, y: value});
        }
    };

    private handleMajorAxisChange = (ev) => {
        if (ev.type === "keydown" && ev.keyCode !== 13) {
            return;
        }
        const valueString = ev.currentTarget.value;
        const value = parseFloat(valueString);
        if (isFinite(value)) {
            this.props.region.setControlPoint(1, {x: value, y: this.props.region.controlPoints[1].y});
        }
    };

    private handleMinorAxisChange = (ev) => {
        if (ev.type === "keydown" && ev.keyCode !== 13) {
            return;
        }
        const valueString = ev.currentTarget.value;
        const value = parseFloat(valueString);
        if (isFinite(value)) {
            this.props.region.setControlPoint(1, {x: this.props.region.controlPoints[1].x, y: value});
        }
    };

    private handleRotationChange = (ev) => {
        if (ev.type === "keydown" && ev.keyCode !== 13) {
            return;
        }
        const valueString = ev.currentTarget.value;
        const value = parseFloat(valueString);
        if (isFinite(value)) {
            this.props.region.setRotation(value);
        }
    };

    private getFormattedString(wcsInfo: number, pixelCoords: Point2D) {
        if (wcsInfo) {
            const pointWCS = AST.pixToWCS(this.props.wcsInfo, pixelCoords.x, pixelCoords.y);
            const normVals = AST.normalizeCoordinates(this.props.wcsInfo, pointWCS.x, pointWCS.y);
            const wcsCoords = AST.getFormattedCoordinates(this.props.wcsInfo, normVals.x, normVals.y);
            if (wcsCoords) {
                return `WCS: (${wcsCoords.x}, ${wcsCoords.y})`;
            }
        }
        return null;
    }

    private getSizeString(wcsInfo: number, centerPixel: Point2D, cornerPixel: Point2D) {
        if (wcsInfo) {
            const centerWCS = AST.pixToWCS(this.props.wcsInfo, centerPixel.x, centerPixel.y);
            const horizontalEdgeWCS = AST.pixToWCS(this.props.wcsInfo, cornerPixel.x, centerPixel.y);
            const verticalEdgeWCS = AST.pixToWCS(this.props.wcsInfo, centerPixel.x, cornerPixel.y);
            const hDist = Math.abs(AST.axDistance(this.props.wcsInfo, 1, centerWCS.x, horizontalEdgeWCS.x));
            const vDist = Math.abs(AST.axDistance(this.props.wcsInfo, 2, centerWCS.y, verticalEdgeWCS.y));
            const wcsDistStrings = AST.getFormattedCoordinates(this.props.wcsInfo, hDist, vDist, "Format(1)=m.5, Format(2)=m.5", true);
            return `maj: ${wcsDistStrings.y}; min: ${wcsDistStrings.x}'`;
        }
        return null;
    }

    public render() {
        const region = this.props.region;
        if (!region || region.controlPoints.length !== 2 || region.regionType !== CARTA.RegionType.ELLIPSE) {
            return null;
        }

        const centerPoint = region.controlPoints[0];
        const sizeDims = region.controlPoints[1];
        // CRTF uses north/south for major axis
        const topRightPoint = {x: centerPoint.x + sizeDims.y, y: centerPoint.y + sizeDims.x};
        const wcsStringCenter = this.getFormattedString(this.props.wcsInfo, centerPoint);
        const wcsStringSize = this.getSizeString(this.props.wcsInfo, centerPoint, topRightPoint);

        const commonProps = {
            selectAllOnFocus: true,
            allowNumericCharactersOnly: true
        };

        const pxUnitSpan = <span className={Classes.TEXT_MUTED}>(px)</span>;
        return (
            <div className="form-section elliptical-region-form">
                <H5>Properties</H5>
                <div className="form-contents">
                    <table>
                        <tbody>
                        <tr>
                            <td>Region Name</td>
                            <td colSpan={2}>
                                <InputGroup placeholder="Enter a region name" value={region.name} onChange={this.handleNameChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Center {pxUnitSpan}</td>
                            <td>
                                <NumericInput {...commonProps} buttonPosition="none" placeholder="X Coordinate" value={centerPoint.x} onBlur={this.handleCenterXChange} onKeyDown={this.handleCenterXChange}/>
                            </td>
                            <td>
                                <NumericInput {...commonProps} buttonPosition="none" placeholder="Y Coordinate" value={centerPoint.y} onBlur={this.handleCenterYChange} onKeyDown={this.handleCenterYChange}/>
                            </td>
                            <td>
                                <span className="wcs-string">{wcsStringCenter}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Axes {pxUnitSpan}</td>
                            <td>
                                <NumericInput {...commonProps} buttonPosition="none" placeholder="Semi-Major Axis" value={sizeDims.x} onBlur={this.handleMajorAxisChange} onKeyDown={this.handleMajorAxisChange}/>
                            </td>
                            <td>
                                <NumericInput{...commonProps} buttonPosition="none" placeholder="Semi-Minor Axis" value={sizeDims.y} onBlur={this.handleMinorAxisChange} onKeyDown={this.handleMinorAxisChange}/>
                            </td>
                            <td>
                                <span className="wcs-string">{wcsStringSize}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Rotation <span className={Classes.TEXT_MUTED}>(deg)</span></td>
                            <td>
                                <NumericInput {...commonProps} buttonPosition="none" placeholder="Rotation" value={region.rotation} onBlur={this.handleRotationChange} onKeyDown={this.handleRotationChange}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}