import {action, computed, observable} from "mobx";
import {CARTA} from "carta-protobuf";
import {RegionWidgetStore} from "./RegionWidgetStore";
import {FrameStore} from "stores/FrameStore";

export enum StokesCoordinate {
    CurrentZ = "z",
    TotalIntensity = "Iz",
    LinearPolarizationQ = "Qz",
    LinearPolarizationU = "Uz",
    CircularPolarization = "Vz",
    PolarizedIntensity = "PIz",
    PolarizationAngle = "PAz",
    PolarizationQU = "QvsU",
}

export class StokesAnalysisWidgetStore extends RegionWidgetStore {
    @observable sharedMinX: number;
    @observable sharedMaxX: number;
    @observable quMinY: number;
    @observable quMaxY: number;
    @observable polIntensityMinY: number;
    @observable polIntensityMaxY: number;
    @observable polAngleMinY: number;
    @observable polAngleMaxY: number;
    @observable quScatterMinX: number;
    @observable quScatterMaxX: number;
    @observable quScatterMinY: number;
    @observable quScatterMaxY: number;
    @observable cursorX: number;
    @observable channel: number;
    @observable useWcsValues: boolean;

    @observable statsType: CARTA.StatsType;
    @observable fractionalPolVisible: boolean;

    private static requestDataType = [StokesCoordinate.LinearPolarizationQ, StokesCoordinate.LinearPolarizationU];

    private static ValidStatsTypes = [
        CARTA.StatsType.Mean,
    ];

    // return regionRequirements spectralProfiles coordinate array
    private static requiredCoordinate(widgetStore: StokesAnalysisWidgetStore): Array<StokesCoordinate> {
        let requiredCoordinate = StokesAnalysisWidgetStore.requestDataType;

        if (widgetStore.fractionalPolVisible) {
            requiredCoordinate.push(StokesCoordinate.TotalIntensity);
        }
        return requiredCoordinate;
    }

    public static addToRequirementsMap(frame: FrameStore, updatedRequirements: Map<number, Map<number, CARTA.SetSpectralRequirements>>, widgetsMap: Map<string, StokesAnalysisWidgetStore>)
        : Map<number, Map<number, CARTA.SetSpectralRequirements>> {
        widgetsMap.forEach(widgetStore => {
            const fileId = frame.frameInfo.fileId;
            const regionId = widgetStore.regionIdMap.get(fileId) || 0;
            const coordinates = StokesAnalysisWidgetStore.requiredCoordinate(widgetStore);
            let statsType = widgetStore.statsType;

            if (!frame.regionSet) {
                return;
            }
            const region = frame.regionSet.regions.find(r => r.regionId === regionId);
            if (region) {
                // Point regions have no meaningful stats type, default to Sum
                if (region.regionType === CARTA.RegionType.POINT) {
                    statsType = CARTA.StatsType.Sum;
                }

                let frameRequirements = updatedRequirements.get(fileId);
                if (!frameRequirements) {
                    frameRequirements = new Map<number, CARTA.SetSpectralRequirements>();
                    updatedRequirements.set(fileId, frameRequirements);
                }

                let regionRequirements = frameRequirements.get(regionId);
                if (!regionRequirements) {
                    regionRequirements = new CARTA.SetSpectralRequirements({regionId, fileId});
                    frameRequirements.set(regionId, regionRequirements);
                }

                if (!regionRequirements.spectralProfiles) {
                    regionRequirements.spectralProfiles = [];
                }

                coordinates.forEach(coordinate => {
                    let spectralConfig = regionRequirements.spectralProfiles.find(profiles => profiles.coordinate === coordinate);
                    if (!spectralConfig) {
                        // create new spectral config
                        regionRequirements.spectralProfiles.push({coordinate, statsTypes: [statsType]});
                    } else if (spectralConfig.statsTypes.indexOf(statsType) === -1) {
                        // add to the stats type array
                        spectralConfig.statsTypes.push(statsType);
                    }
                });
            }
        });
        return updatedRequirements;
    }

    @action setStatsType = (statsType: CARTA.StatsType) => {
        if (StokesAnalysisWidgetStore.ValidStatsTypes.indexOf(statsType) !== -1) {
            this.statsType = statsType;
        }
    };

    @action setSharedXBounds = (minVal: number, maxVal: number) => {
        this.sharedMinX = minVal;
        this.sharedMaxX = maxVal;
    };

    @action clearSharedXBounds = () => {
        this.sharedMinX = undefined;
        this.sharedMaxX = undefined;
    };

    @action setPolIntensityYBounds = (minVal: number, maxVal: number) => {
        this.polIntensityMinY = minVal;
        this.polIntensityMaxY = maxVal;
    };

    @action clearPolIntensityYBounds = () => {
        this.polIntensityMinY = undefined;
        this.polIntensityMaxY = undefined;
    };

    @action setChannel = (channel: number) => {
        this.channel = channel;
    };

    @action setCursor = (cursorVal: number) => {
        this.cursorX = cursorVal;
    };

    @action setFractionalPolVisible = (val: boolean) => {
        this.fractionalPolVisible = val;
    };

    @action setRegionId = (fileId: number, regionId: number) => {
        this.regionIdMap.set(fileId, regionId);
        this.clearXYBounds();
    };

    @action setUseWcsValues = (val: boolean) => {
        if (val !== this.useWcsValues) {
            this.clearSharedXBounds();
        }
        this.useWcsValues = val;
    };

    constructor() {
        super();
        this.statsType = CARTA.StatsType.Mean;

        // Describes how the data is visualised
        this.fractionalPolVisible = false;
        this.useWcsValues = true;
    }

    @action setQUScatterPlotXBounds = (minVal: number, maxVal: number) => {
        this.quScatterMinX = minVal;
        this.quScatterMaxX = maxVal;
    };

    @action setPolAngleYBounds = (minVal: number, maxVal: number) => {
        this.polAngleMinY = minVal;
        this.polAngleMaxY = maxVal;
    };

    @action setQULinePlotYBounds = (minVal: number, maxVal: number) => {
        this.quMinY = minVal;
        this.quMaxY = maxVal;
    };

    @action setQUScatterPlotYBounds = (minVal: number, maxVal: number) => {
        this.quScatterMinY = minVal;
        this.quScatterMaxY = maxVal;
    };

    @action clearXYBounds = () => {
        this.sharedMinX = undefined;
        this.sharedMaxX = undefined;
        this.quMinY = undefined;
        this.quMaxY = undefined;
        this.polIntensityMinY = undefined;
        this.polIntensityMaxY = undefined;
        this.polAngleMinY = undefined;
        this.polAngleMaxY = undefined;
    };

    @action setQULinePlotsXYBounds = (minX: number, maxX: number, minY: number, maxY: number) => {
        this.sharedMinX = minX;
        this.sharedMaxX = maxX;
        this.quMinY = minY;
        this.quMaxY = maxY;
    };

    @action setPolIntensityXYBounds = (minX: number, maxX: number, minY: number, maxY: number) => {
        this.sharedMinX = minX;
        this.sharedMaxX = maxX;
        this.polIntensityMinY = minY;
        this.polIntensityMaxY = maxY;
    };

    @action setPolAngleXYBounds = (minX: number, maxX: number, minY: number, maxY: number) => {
        this.sharedMinX = minX;
        this.sharedMaxX = maxX;
        this.polAngleMinY = minY;
        this.polAngleMaxY = maxY;
    };

    @action setquScatterPlotXYBounds = (minX: number, maxX: number, minY: number, maxY: number) => {
        this.quScatterMinX = minX;
        this.quScatterMaxX = maxX;
        this.quScatterMinY = minY;
        this.quScatterMaxY = maxY;
    };

    @computed get isLinePlotsAutoScaledX() {
        return (this.sharedMinX === undefined || this.sharedMaxX === undefined);
    }

    @computed get isQUScatterPlotAutoScaledX() {
        return (this.quScatterMinX === undefined || this.quScatterMaxX === undefined);
    }

    @computed get isQUScatterPlotAutoScaledY() {
        return (this.quScatterMinY === undefined || this.quScatterMaxY === undefined);
    }

    @computed get isQULinePlotAutoScaledY() {
        return (this.quMinY === undefined || this.quMaxY === undefined);
    }

    @computed get isPolIntensityAutoScaledY() {
        return (this.polIntensityMinY === undefined || this.polIntensityMaxY === undefined);
    }

    @computed get isPolAngleAutoScaledY() {
        return (this.polAngleMinY === undefined || this.polAngleMaxY === undefined);
    }
}