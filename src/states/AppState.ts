import {action, autorun, observable} from "mobx";
import {OverlayState} from "./OverlayState";
import {LayoutState} from "./LayoutState";
import {SpatialProfileState} from "./SpatialProfileState";
import {CursorInfo} from "../models/CursorInfo";
import {BackendService} from "../services/BackendService";
import {FileBrowserState} from "./FileBrowserState";
import {FrameInfo, FrameState} from "./FrameState";
import {AlertState} from "./AlertState";
import {CARTA} from "carta-protobuf";
import * as AST from "ast_wrapper";

export class AppState {
    // Backend service
    @observable backendService: BackendService;
    // WebAssembly Module status
    @observable astReady: boolean;

    // Frames
    @observable frames: FrameState[];
    @observable activeFrame: FrameState;

    // Error alerts
    @observable alertState: AlertState;

    // Cursor information
    @observable cursorInfo: CursorInfo;

    // Spatial profiles
    @observable spatialProfiles: Map<number, SpatialProfileState>;

    // Image view
    @observable viewWidth: number;
    @observable viewHeight: number;
    @action setImageViewDimensions = (w: number, h: number) => {
        this.viewWidth = w;
        this.viewHeight = h;
        this.overlayState.viewWidth = this.viewWidth;
        this.overlayState.viewHeight = this.viewHeight;
        console.log(`Full view: w=${w}, h=${h};`);
        console.log(this.overlayState.padding);
        const adjustedW = this.viewWidth - this.overlayState.padding[0] - this.overlayState.padding[1];
        const adjustedH = this.viewHeight - this.overlayState.padding[2] - this.overlayState.padding[3];
        console.log(`Adjusted view: w=${adjustedW}, h=${adjustedH};`);
        // TODO: update active frame's required FoV based on resized dimensions AND padding settings
        if (this.activeFrame) {
            this.activeFrame.setDimensions(adjustedW, adjustedH);
        }
    };

    dimensionsUpdater = autorun(() => {
        if (!this.overlayState || !this.overlayState.padding) {
            return;
        }
        const adjustedW = this.viewWidth - this.overlayState.padding[0] - this.overlayState.padding[1];
        const adjustedH = this.viewHeight - this.overlayState.padding[2] - this.overlayState.padding[3];
        console.log(`Autorun Adjusted view: w=${adjustedW}, h=${adjustedH};`);
        // TODO: update active frame's required FoV based on resized dimensions AND padding settings
        if (this.activeFrame) {
            this.activeFrame.setDimensions(adjustedW, adjustedH);
        }
    });

    // Overlay
    @observable overlayState: OverlayState;

    // Layout
    @observable layoutSettings: LayoutState;

    // File Browser
    @observable fileBrowserState: FileBrowserState;

    // Additional Dialogs
    @observable urlConnectDialogVisible: boolean;
    @action showURLConnect = () => {
        this.urlConnectDialogVisible = true;
    };
    @action hideURLConnect = () => {
        this.urlConnectDialogVisible = false;
    };

    // Frame actions
    @action loadFile = (directory: string, file: string, hdu: string) => {
        this.backendService.loadFile(directory, file, hdu, 0, CARTA.RenderMode.RASTER).subscribe(ack => {
            console.log("Loaded");
            let newFrame = new FrameState();
            newFrame.frameInfo = new FrameInfo();
            newFrame.frameInfo.fileId = ack.fileId;
            newFrame.frameInfo.fileInfo = ack.fileInfo as CARTA.FileInfo;
            newFrame.frameInfo.fileInfoExtended = ack.fileInfoExtended as CARTA.FileInfoExtended;
            newFrame.frameInfo.renderMode = CARTA.RenderMode.RASTER;
            newFrame.setDimensions(this.viewWidth, this.viewHeight);
            newFrame.fitZoom();
            newFrame.valid = true;

            this.loadWCS(newFrame);
            if (this.frames.length) {
                this.frames[0] = newFrame;
            }
            else {
                this.frames.push(newFrame);
            }
            this.activeFrame = newFrame;
            this.fileBrowserState.hideFileBrowser();
        }, err => {
            this.alertState.showAlert(`Error loading file: ${err}`);
        });
    };

    @action loadWCS = (frame: FrameState) => {
        let headerString = "";

        for (let entry of frame.frameInfo.fileInfoExtended.headerEntries) {
            // Skip empty header entries
            if (!entry.value.length) {
                continue;
            }

            // Skip higher dimensions
            if (entry.name.match(/(CTYPE|CDELT|CRPIX|CRVAL|NAXIS|CROTA)[3-9]/)) {
                continue;
            }

            let value = entry.value;
            if (entry.name.toUpperCase() === "NAXIS") {
                value = "2";
            }

            if (entry.entryType === CARTA.EntryType.STRING) {
                value = `'${value}'`;
            }

            let name = entry.name;
            while (name.length < 8) {
                name += " ";
            }

            let entryString = `${name}=  ${value}`;
            while (entryString.length < 80) {
                entryString += " ";
            }
            headerString += entryString;
        }

        const initResult = AST.initFrame(headerString);
        if (!initResult) {
            this.alertState.showAlert("Problem processing WCS info");
        }
        else {
            frame.wcsInfo = initResult;
            console.log("Initialised WCS info from frame");
        }
    };

    constructor() {
        this.astReady = false;
        this.spatialProfiles = new Map<number, SpatialProfileState>();
        this.frames = [];
        this.activeFrame = null;
        this.alertState = new AlertState();
        this.overlayState = new OverlayState();
        this.layoutSettings = new LayoutState();
        this.urlConnectDialogVisible = false;
        this.dimensionsUpdater();
    }
}
