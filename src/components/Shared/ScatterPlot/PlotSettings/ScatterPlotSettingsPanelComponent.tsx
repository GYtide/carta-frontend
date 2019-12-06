import * as React from "react";
import {observer} from "mobx-react";
import {FormGroup, Switch, NumericInput} from "@blueprintjs/core";
import {ColormapComponent} from "../../../RenderConfig/ColormapConfigComponent/ColormapComponent";
import "./ScatterPlotSettingsPanelComponent.css";

export class ScatterPlotSettingsPanelComponentProps {
    colorMap: string;
    scatterPlotPointSize: number;
    pointTransparency: number;
    equalAxes: boolean;
    setPointTransparency: (val: number) => void;
    setScatterPlotPointSize: (val: number) => void;
    setColormap: (val: string) => void;
    handleEqualAxesValuesChanged: (changeEvent: React.ChangeEvent<HTMLInputElement>) => void;
}

export enum ScatterSettings {
     MIN_POINT_SIZE = 0.5,
     MAX_POINT_SIZE = 10,
     MIN_TRANSPARENCY = 0.1,
     MAX_TRANSPARENCY = 1,
     POINT_SIZE_STEP_SIZE = 0.5,
     TRANSPARENCY_STEP_SIZE = 0.1
}

@observer
export class ScatterPlotSettingsPanelComponent extends React.Component<ScatterPlotSettingsPanelComponentProps> {

    render() {
        const props = this.props;
        return (
            <div className="scatter-settings-panel">
                <React.Fragment>
                    <FormGroup inline={true} label="Color Map">
                        <ColormapComponent
                            inverted={false}
                            selectedItem={props.colorMap}
                            onItemSelect={(selected) => { props.setColormap(selected); }}
                        />
                    </FormGroup>
                    <FormGroup  inline={true} label="Symbol Size" labelInfo="(px)">
                        <NumericInput
                                placeholder="Symbol Size"
                                min={ScatterSettings.MIN_POINT_SIZE}
                                max={ScatterSettings.MAX_POINT_SIZE}
                                value={props.scatterPlotPointSize}
                                stepSize={ScatterSettings.POINT_SIZE_STEP_SIZE}
                                onValueChange={(value: number) => props.setScatterPlotPointSize(value)}
                        />
                    </FormGroup>
                    <FormGroup  inline={true} label="Transparency">
                        <NumericInput
                                placeholder="transparency"
                                min={ScatterSettings.MIN_TRANSPARENCY}
                                max={ScatterSettings.MAX_TRANSPARENCY}
                                value={props.pointTransparency}
                                stepSize={ScatterSettings.TRANSPARENCY_STEP_SIZE}
                                onValueChange={(value: number) => props.setPointTransparency(value)}
                        />
                    </FormGroup>
                    <FormGroup inline={true} label={"Equal Axes"}>
                        <Switch checked={props.equalAxes} onChange={props.handleEqualAxesValuesChanged}/>
                    </FormGroup>
                </React.Fragment>
            </div>
        );
    }
}