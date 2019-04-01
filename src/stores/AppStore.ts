import * as _ from "lodash";
import * as AST from "ast_wrapper";
import {action, autorun, computed, observable, ObservableMap} from "mobx";
import {CARTA} from "carta-protobuf";
import {AlertStore, AnimationState, AnimatorStore, dayPalette, FileBrowserStore, FrameInfo, FrameStore, LogEntry, LogStore, nightPalette, OverlayStore, RegionStore, SpatialProfileStore, SpectralProfileStore, WidgetsStore} from ".";
import {BackendService} from "services";
import {CursorInfo, FrameView} from "models";
import {smoothStepOffset} from "utilities";

export class AppStore {
    // Backend service
    @observable backendService: BackendService;
    @observable compressionQuality: number;
    // WebAssembly Module status
    @observable astReady: boolean;
    // Frames
    @observable frames: FrameStore[];
    @observable activeFrame: FrameStore;
    // Animation
    @observable animatorStore: AnimatorStore;
    // Error alerts
    @observable alertStore: AlertStore;
    // Logs
    @observable logStore: LogStore;

    // Cursor information
    @observable cursorInfo: CursorInfo;
    @observable cursorFrozen: boolean;
    // Profiles and region data
    @observable spatialProfiles: Map<string, SpatialProfileStore>;
    @observable spectralProfiles: Map<number, ObservableMap<number, SpectralProfileStore>>;
    @observable regionStats: Map<number, ObservableMap<number, CARTA.RegionStatsData>>;
    @observable regionHistograms: Map<number, ObservableMap<number, CARTA.IRegionHistogramData>>;

    // Image view
    @action setImageViewDimensions = (w: number, h: number) => {
        this.overlayStore.viewWidth = w;
        this.overlayStore.viewHeight = h;
    };

    // Image toolbar
    @observable imageToolbarVisible: boolean;
    @action showImageToolbar = () => {
        this.imageToolbarVisible = true;
    };
    @action hideImageToolbar = () => {
        this.imageToolbarVisible = false;
    };

    // Region dialog
    @observable regionDialogVisible: boolean;
    @action showRegionDialog = () => {
        console.log(`Showing dialog for ${this.activeFrame.regionSet.selectedRegion}`);
        this.regionDialogVisible = true;
    };
    @action hideRegionDialog = () => {
        this.regionDialogVisible = false;
    };

    // Overlay
    @observable overlayStore: OverlayStore;
    // File Browser
    @observable fileBrowserStore: FileBrowserStore;
    // Additional Dialogs
    @observable urlConnectDialogVisible: boolean;
    @action showURLConnect = () => {
        this.urlConnectDialogVisible = true;
    };
    @action hideURLConnect = () => {
        this.urlConnectDialogVisible = false;
    };

    @observable hotkeyDialogVisible: boolean;
    @action showHotkeyDialog = () => {
        this.hotkeyDialogVisible = true;
    };
    @action hideHotkeyDialog = () => {
        this.hotkeyDialogVisible = false;
    };

    @observable aboutDialogVisible: boolean;
    @action showAboutDialog = () => {
        this.aboutDialogVisible = true;
    };
    @action hideAboutDialog = () => {
        this.aboutDialogVisible = false;
    };

    @observable apiKey;
    @action applyApiKey = (newKey: string, forceReload: boolean = true) => {
        if (newKey) {
            localStorage.setItem("API_KEY", newKey);
            this.apiKey = newKey;
        } else {
            localStorage.removeItem("API_KEY");
        }
        if (forceReload) {
            location.reload();
        }
    };
    @observable apiKeyDialogVisible: boolean;
    @action showApiKeyDialog = () => {
        this.apiKeyDialogVisible = true;
    };
    @action hideApiKeyDialog = () => {
        this.apiKeyDialogVisible = false;
    };

    // Tasks
    @observable taskProgress: number;
    @observable taskStartTime: number;
    @observable taskCurrentTime: number;
    @observable fileLoading: boolean;

    @action restartTaskProgress = () => {
        this.taskProgress = 0;
        this.taskStartTime = performance.now();
    };

    @action updateTaskProgress = (progress: number) => {
        this.taskProgress = progress;
        this.taskCurrentTime = performance.now();
    };

    @computed get estimatedTaskRemainingTime(): number {
        if (this.taskProgress <= 0 || this.taskProgress >= 1) {
            return undefined;
        }
        const dt = this.taskCurrentTime - this.taskStartTime;
        const estimatedFinishTime = dt / this.taskProgress;
        return estimatedFinishTime - dt;
    }

    // Keyboard shortcuts
    @computed get modifierString() {
        // Modifier string for shortcut keys.
        // - OSX/iOS use '⌘'
        // - Windows/Linux uses 'Ctrl + '
        // - Browser uses 'alt +' for compatibility reasons
        let modString = "alt + ";
        if (process.env.REACT_APP_TARGET === "linux") {
            modString = "ctrl + ";
        } else if (process.env.REACT_APP_TARGET === "darwin") {
            modString = "cmd +";
        }
        return modString;
    }

    // Widgets
    @observable widgetsStore: WidgetsStore;

    // Dark theme
    @observable darkTheme: boolean;

    // Frame actions
    @action addFrame = (directory: string, file: string, hdu: string, fileId: number) => {
        this.fileLoading = true;
        this.backendService.loadFile(directory, file, hdu, fileId, CARTA.RenderMode.RASTER).subscribe(ack => {
            this.fileLoading = false;
            let dimensionsString = `${ack.fileInfoExtended.width}\u00D7${ack.fileInfoExtended.height}`;
            if (ack.fileInfoExtended.dimensions > 2) {
                dimensionsString += `\u00D7${ack.fileInfoExtended.depth}`;
                if (ack.fileInfoExtended.dimensions > 3) {
                    dimensionsString += ` (${ack.fileInfoExtended.stokes} Stokes cubes)`;
                }
            }
            this.logStore.addInfo(`Loaded file ${ack.fileInfo.name} with dimensions ${dimensionsString}`, ["file"]);
            const frameInfo: FrameInfo = {
                fileId: ack.fileId,
                fileInfo: new CARTA.FileInfo(ack.fileInfo),
                fileInfoExtended: new CARTA.FileInfoExtended(ack.fileInfoExtended),
                renderMode: CARTA.RenderMode.RASTER
            };

            let newFrame = new FrameStore(this.overlayStore, frameInfo, this.backendService);
            newFrame.fitZoom();
            this.loadWCS(newFrame);

            // clear existing requirements for the frame
            this.spectralRequirements.delete(ack.fileId);
            this.statsRequirements.delete(ack.fileId);
            this.histogramRequirements.delete(ack.fileId);

            // Place frame in frame array (replace frame with the same ID if it exists)
            const existingFrameIndex = this.frames.findIndex(f => f.frameInfo.fileId === fileId);
            if (existingFrameIndex !== -1) {
                this.frames[existingFrameIndex] = newFrame;
            } else {
                this.frames.push(newFrame);
            }
            this.setActiveFrame(newFrame.frameInfo.fileId);
            this.fileBrowserStore.hideFileBrowser();
        }, err => {
            this.alertStore.showAlert(`Error loading file: ${err}`);
        });
    };
    @action appendFile = (directory: string, file: string, hdu: string) => {
        const currentIdList = this.frames.map(frame => frame.frameInfo.fileId).sort((a, b) => a - b);
        const newId = currentIdList.pop() + 1;
        this.addFrame(directory, file, hdu, newId);
    };
    @action openFile = (directory: string, file: string, hdu: string) => {
        this.removeAllFrames();
        this.addFrame(directory, file, hdu, 0);
    };
    @action removeFrame = (fileId: number) => {
        if (this.frames.find(f => f.frameInfo.fileId === fileId)) {
            // adjust requirements for stores
            this.widgetsStore.statsWidgets.forEach(widgetStore => {
                widgetStore.clearFrameEntry(fileId);
            });
            this.widgetsStore.histogramWidgets.forEach(widgetStore => {
                widgetStore.clearFrameEntry(fileId);
            });

            if (this.backendService.closeFile(fileId)) {
                if (this.activeFrame.frameInfo.fileId === fileId) {
                    this.activeFrame = null;
                }
                this.frames = this.frames.filter(f => f.frameInfo.fileId !== fileId);
            }
        }
    };
    @action removeAllFrames = () => {
        if (this.backendService.closeFile(-1)) {
            this.activeFrame = null;
            this.frames = [];
            // adjust requirements for stores
            this.widgetsStore.statsWidgets.forEach(widgetStore => {
                widgetStore.clearRegionMap();
            });
            this.widgetsStore.histogramWidgets.forEach(widgetStore => {
                widgetStore.clearRegionMap();
            });
        }
    };

    @action loadWCS = (frame: FrameStore) => {
        let headerString = "";

        for (let entry of frame.frameInfo.fileInfoExtended.headerEntries) {
            // Skip empty header entries
            if (!entry.value.length) {
                continue;
            }

            // Skip higher dimensions
            if (entry.name.match(/(CTYPE|CDELT|CRPIX|CRVAL|CUNIT|NAXIS|CROTA)[3-9]/)) {
                continue;
            }

            let value = entry.value;
            if (entry.name.toUpperCase() === "NAXIS") {
                value = "2";
            }

            if (entry.name.toUpperCase() === "WCSAXES") {
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
            this.logStore.addWarning(`Problem processing WCS info in file ${frame.frameInfo.fileInfo.name}`, ["ast"]);
            frame.wcsInfo = AST.initDummyFrame();
        } else {
            frame.wcsInfo = initResult;
            frame.validWcs = true;
            this.overlayStore.setDefaultsFromAST(frame);
            console.log("Initialised WCS info from frame");
        }
    };

    @action shiftFrame = (delta: number) => {
        if (this.activeFrame && this.frames.length > 1) {
            const frameIds = this.frames.map(f => f.frameInfo.fileId).sort();
            const currentIndex = frameIds.indexOf(this.activeFrame.frameInfo.fileId);
            const requiredIndex = (this.frames.length + currentIndex + delta) % this.frames.length;
            this.setActiveFrame(frameIds[requiredIndex]);
        }
    };

    @action nextFrame = () => {
        this.shiftFrame(+1);
    };

    @action prevFrame = () => {
        this.shiftFrame(-1);
    };

    @action requestCubeHistogram = (fileId: number = -1) => {
        const frame = this.getFrame(fileId);
        if (frame && frame.renderConfig.cubeHistogramProgress < 1.0) {
            this.backendService.setHistogramRequirements({fileId: frame.frameInfo.fileId, regionId: -2, histograms: [{channel: -2, numBins: -1}]});
            this.restartTaskProgress();
        }
    };

    @action cancelCubeHistogramRequest = (fileId: number = -1) => {
        const frame = this.getFrame(fileId);
        if (frame && frame.renderConfig.cubeHistogramProgress < 1.0) {
            frame.renderConfig.updateCubeHistogram(null, 0);
            this.backendService.setHistogramRequirements({fileId: frame.frameInfo.fileId, regionId: -2, histograms: []});
        }
    };

    @action setDarkTheme = () => {
        this.darkTheme = true;
    };

    @action setLightTheme = () => {
        this.darkTheme = false;
    };

    @action setCursorInfo = (cursorInfo: CursorInfo) => {
        this.cursorInfo = cursorInfo;
    };

    @action setCursorFrozen = (frozen: boolean) => {
        this.cursorFrozen = frozen;
    };

    @action toggleCursorFrozen = () => {
        this.cursorFrozen = !this.cursorFrozen;
    };

    private spectralRequirements: Map<number, Map<number, CARTA.SetSpectralRequirements>>;
    private statsRequirements: Map<number, Array<number>>;
    private histogramRequirements: Map<number, Array<number>>;
    private static readonly DEFAULT_STATS_TYPES = [CARTA.StatsType.NumPixels, CARTA.StatsType.Sum, CARTA.StatsType.Mean, CARTA.StatsType.RMS, CARTA.StatsType.Sigma, CARTA.StatsType.SumSq, CARTA.StatsType.Min, CARTA.StatsType.Max];

    constructor() {
        const existingKey = localStorage.getItem("API_KEY");
        if (existingKey) {
            this.apiKey = existingKey;
        }

        this.logStore = new LogStore();
        this.backendService = new BackendService(this.logStore);
        this.astReady = false;
        this.spatialProfiles = new Map<string, SpatialProfileStore>();
        this.spectralProfiles = new Map<number, ObservableMap<number, SpectralProfileStore>>();
        this.regionStats = new Map<number, ObservableMap<number, CARTA.RegionStatsData>>();
        this.regionHistograms = new Map<number, ObservableMap<number, CARTA.IRegionHistogramData>>();
        this.frames = [];
        this.activeFrame = null;
        this.animatorStore = new AnimatorStore(this);
        this.alertStore = new AlertStore();
        this.overlayStore = new OverlayStore();
        this.widgetsStore = new WidgetsStore(this);
        this.urlConnectDialogVisible = false;
        this.compressionQuality = 11;
        this.darkTheme = false;
        this.spectralRequirements = new Map<number, Map<number, CARTA.SetSpectralRequirements>>();
        this.statsRequirements = new Map<number, Array<number>>();
        this.histogramRequirements = new Map<number, Array<number>>();

        const throttledSetView = _.throttle((fileId: number, view: FrameView, quality: number) => {
            this.backendService.setImageView(fileId, Math.floor(view.xMin), Math.ceil(view.xMax), Math.floor(view.yMin), Math.ceil(view.yMax), view.mip, quality);
        }, 200);

        const throttledSetChannels = _.throttle((fileId: number, channel: number, stokes: number) => {
            this.backendService.setChannels(fileId, channel, stokes);
        }, 200);

        const debouncedSetCursor = _.debounce((fileId: number, x: number, y: number) => {
            const frame = this.getFrame(fileId);
            if (frame && frame.regionSet.regions[0]) {
                frame.regionSet.regions[0].setControlPoint(0, {x, y});
            }
        }, 200);

        // Update frame view
        autorun(() => {
            if (this.activeFrame) {
                // Calculate new required frame view (cropped to file size)
                const reqView = this.activeFrame.requiredFrameView;
                const currentView = this.activeFrame.currentFrameView;

                const croppedReq: FrameView = {
                    xMin: Math.max(0, reqView.xMin),
                    xMax: Math.min(this.activeFrame.frameInfo.fileInfoExtended.width, reqView.xMax),
                    yMin: Math.max(0, reqView.yMin),
                    yMax: Math.min(this.activeFrame.frameInfo.fileInfoExtended.height, reqView.yMax),
                    mip: reqView.mip
                };

                let adjustedQuality = smoothStepOffset(this.activeFrame.zoomLevel, 0.9, 4, 11, 21);
                adjustedQuality = Math.round(adjustedQuality);

                // Calculate if new data is required
                const updateRequiredChannels = this.activeFrame.requiredChannel !== this.activeFrame.channel || this.activeFrame.requiredStokes !== this.activeFrame.stokes;
                // Don't auto-update when animation is playing
                if (this.animatorStore.animationState === AnimationState.STOPPED && updateRequiredChannels) {
                    throttledSetChannels(this.activeFrame.frameInfo.fileId, this.activeFrame.requiredChannel, this.activeFrame.requiredStokes);
                }

                const updateRequiredView = (croppedReq.mip < currentView.mip) || (croppedReq.xMin < currentView.xMin || croppedReq.xMax > currentView.xMax || croppedReq.yMin < currentView.yMin || croppedReq.yMax > currentView.yMax);
                const updateCompressionQuality = (adjustedQuality > this.activeFrame.currentCompressionQuality);
                if (updateRequiredView || updateCompressionQuality) {
                    const reqWidth = reqView.xMax - reqView.xMin;
                    const reqHeight = reqView.yMax - reqView.yMin;
                    // Add an extra padding on either side to avoid spamming backend
                    const padFraction = 0.05;
                    const paddedView = {
                        xMin: Math.max(0, reqView.xMin - padFraction * reqWidth),
                        xMax: Math.min(reqView.xMax + padFraction * reqWidth, this.activeFrame.frameInfo.fileInfoExtended.width),
                        yMin: Math.max(0, reqView.yMin - padFraction * reqHeight),
                        yMax: Math.min(reqView.yMax + padFraction * reqHeight, this.activeFrame.frameInfo.fileInfoExtended.height),
                        mip: reqView.mip
                    };
                    throttledSetView(this.activeFrame.frameInfo.fileId, paddedView, adjustedQuality);
                }
            }
        });

        // Update cursor profiles
        autorun(() => {
            if (this.activeFrame && this.cursorInfo && this.cursorInfo.posImageSpace) {
                const pos = {x: Math.round(this.cursorInfo.posImageSpace.x), y: Math.round(this.cursorInfo.posImageSpace.y)};
                if (pos.x >= 0 && pos.x <= this.activeFrame.frameInfo.fileInfoExtended.width - 1 && pos.y >= 0 && pos.y < this.activeFrame.frameInfo.fileInfoExtended.height - 1) {
                    debouncedSetCursor(this.activeFrame.frameInfo.fileId, pos.x, pos.y);

                    let keyStruct = {fileId: this.activeFrame.frameInfo.fileId, regionId: 0};
                    const key = `${keyStruct.fileId}-${keyStruct.regionId}`;
                    const profileStore = this.spatialProfiles.get(key);
                    if (profileStore) {
                        profileStore.x = pos.x;
                        profileStore.y = pos.y;
                        profileStore.approximate = true;
                    }
                }
            }
        }, {delay: 33});

        // Set spatial and spectral requirements of cursor region on file load
        autorun(() => {
            if (this.activeFrame) {
                this.backendService.setSpatialRequirements(this.activeFrame.frameInfo.fileId, 0, ["x", "y"]);
            }
        });

        // Set overlay defaults from current frame
        autorun(() => {
            if (this.activeFrame) {
                this.overlayStore.setDefaultsFromAST(this.activeFrame);
            }
        });

        autorun(() => {
            if (this.astReady) {
                this.logStore.addInfo("AST library loaded", ["ast"]);
            }
        });

        // Set palette if theme changes
        autorun(() => {
            AST.setPalette(this.darkTheme ? nightPalette : dayPalette);
        });

        // Update requirements every 200 ms
        setInterval(this.recalculateSpectralRequirements, 200);
        setInterval(this.recalculateStatsRequirements, 200);
        setInterval(this.recalculateHistogramRequirements, 200);

        // Subscribe to frontend streams
        this.backendService.getSpatialProfileStream().subscribe(this.handleSpatialProfileStream);
        this.backendService.getSpectralProfileStream().subscribe(this.handleSpectralProfileStream);
        this.backendService.getRegionHistogramStream().subscribe(this.handleRegionHistogramStream);
        this.backendService.getRasterStream().subscribe(this.handleRasterImageStream);
        this.backendService.getErrorStream().subscribe(this.handleErrorStream);
        this.backendService.getRegionStatsStream().subscribe(this.handleRegionStatsStream);
    }

    // region Subscription handlers
    handleSpatialProfileStream = (spatialProfileData: CARTA.SpatialProfileData) => {
        if (this.frames.find(frame => frame.frameInfo.fileId === spatialProfileData.fileId)) {
            const key = `${spatialProfileData.fileId}-${spatialProfileData.regionId}`;
            let profileStore = this.spatialProfiles.get(key);
            if (!profileStore) {
                profileStore = new SpatialProfileStore(spatialProfileData.fileId, spatialProfileData.regionId);
                this.spatialProfiles.set(key, profileStore);
            }

            profileStore.channel = spatialProfileData.channel;
            profileStore.stokes = spatialProfileData.stokes;
            profileStore.x = spatialProfileData.x;
            profileStore.y = spatialProfileData.y;
            profileStore.approximate = false;
            const profileMap = new Map<string, CARTA.SpatialProfile>();
            for (let profile of spatialProfileData.profiles) {
                profileMap.set(profile.coordinate, profile as CARTA.SpatialProfile);
            }
            profileStore.setProfiles(profileMap);
        }
    };

    handleSpectralProfileStream = (spectralProfileData: CARTA.SpectralProfileData) => {
        if (this.frames.find(frame => frame.frameInfo.fileId === spectralProfileData.fileId)) {
            let frameMap = this.spectralProfiles.get(spectralProfileData.fileId);
            if (!frameMap) {
                frameMap = new ObservableMap<number, SpectralProfileStore>();
                this.spectralProfiles.set(spectralProfileData.fileId, frameMap);
            }
            let profileStore = frameMap.get(spectralProfileData.regionId);
            if (!profileStore) {
                profileStore = new SpectralProfileStore(spectralProfileData.fileId, spectralProfileData.regionId);
                frameMap.set(spectralProfileData.regionId, profileStore);
            }

            profileStore.channelValues = spectralProfileData.channelVals;
            profileStore.stokes = spectralProfileData.stokes;
            for (let profile of spectralProfileData.profiles) {
                profileStore.setProfile(profile);
            }
        }
    };

    handleRegionHistogramStream = (regionHistogramData: CARTA.RegionHistogramData) => {
        if (!regionHistogramData) {
            return;
        }

        let frameHistogramMap = this.regionHistograms.get(regionHistogramData.fileId);
        if (!frameHistogramMap) {
            frameHistogramMap = new ObservableMap<number, CARTA.IRegionHistogramData>();
            this.regionHistograms.set(regionHistogramData.fileId, frameHistogramMap);
        }

        frameHistogramMap.set(regionHistogramData.regionId, regionHistogramData);

        const updatedFrame = this.getFrame(regionHistogramData.fileId);
        if (updatedFrame && regionHistogramData.stokes === updatedFrame.requiredStokes && regionHistogramData.histograms && regionHistogramData.histograms.length) {
            if (regionHistogramData.regionId === -1) {
                // Update channel histograms
                const channelHist = regionHistogramData.histograms.find(hist => hist.channel === updatedFrame.requiredChannel);
                if (channelHist) {
                    updatedFrame.renderConfig.updateChannelHistogram(channelHist as CARTA.Histogram);
                }
            } else if (regionHistogramData.regionId === -2) {
                // Update cube histogram if it is still required
                const cubeHist = regionHistogramData.histograms[0];
                if (cubeHist && updatedFrame.renderConfig.useCubeHistogram) {
                    updatedFrame.renderConfig.updateCubeHistogram(cubeHist as CARTA.Histogram, regionHistogramData.progress);
                    this.updateTaskProgress(regionHistogramData.progress);
                }
            }
        }
    };

    handleRegionStatsStream = (regionStatsData: CARTA.RegionStatsData) => {
        if (!regionStatsData) {
            return;
        }

        let frameStatsMap = this.regionStats.get(regionStatsData.fileId);
        if (!frameStatsMap) {
            frameStatsMap = new ObservableMap<number, CARTA.RegionStatsData>();
            this.regionStats.set(regionStatsData.fileId, frameStatsMap);
        }

        frameStatsMap.set(regionStatsData.regionId, regionStatsData);
    };

    handleRasterImageStream = (rasterImageData: CARTA.RasterImageData) => {
        const updatedFrame = this.getFrame(rasterImageData.fileId);
        if (updatedFrame) {
            updatedFrame.updateFromRasterData(rasterImageData);
            if (this.animatorStore.animationState === AnimationState.PLAYING) {
                this.animatorStore.removeFromRequestQueue(updatedFrame.channel, updatedFrame.stokes);
            }
        }
    };

    handleErrorStream = (errorData: CARTA.ErrorData) => {
        if (errorData) {
            const logEntry: LogEntry = {
                level: errorData.severity,
                message: errorData.message,
                tags: errorData.tags.concat(["server-sent"]),
                title: null
            };
            this.logStore.addLog(logEntry);
        }
    };

    // endregion

    @computed get zfpReady() {
        return (this.backendService && this.backendService.zfpReady);
    }

    @action setActiveFrame(fileId: number) {
        const requiredFrame = this.getFrame(fileId);
        if (requiredFrame) {
            this.activeFrame = requiredFrame;
            this.widgetsStore.updateImageWidgetTitle();
            this.setCursorFrozen(false);
        } else {
            console.log(`Can't find required frame ${fileId}`);
        }
    }

    @action setActiveFrameByIndex(index: number) {
        if (index >= 0 && this.frames.length > index) {
            this.activeFrame = this.frames[index];
            this.widgetsStore.updateImageWidgetTitle();
            this.setCursorFrozen(false);
        } else {
            console.log(`Invalid frame index ${index}`);
        }
    }

    getFrame(fileId: number) {
        if (fileId === -1) {
            return this.activeFrame;
        }
        return this.frames.find(f => f.frameInfo.fileId === fileId);
    }

    @action deleteSelectedRegion = () => {
        if (this.activeFrame && this.activeFrame.regionSet) {
            const fileId = this.activeFrame.frameInfo.fileId;
            let region: RegionStore;
            region = this.activeFrame.regionSet.selectedRegion;
            if (region) {
                const regionId = region.regionId;
                // adjust requirements for stores
                this.widgetsStore.statsWidgets.forEach(widgetStore => {
                    const selectedRegionId = widgetStore.regionIdMap.get(fileId);
                    // remove entry from map if it matches the deleted region
                    if (isFinite(selectedRegionId) && selectedRegionId === regionId) {
                        widgetStore.clearFrameEntry(fileId);
                    }
                });
                this.widgetsStore.histogramWidgets.forEach(widgetStore => {
                    const selectedRegionId = widgetStore.regionIdMap.get(fileId);
                    // remove entry from map if it matches the deleted region
                    if (isFinite(selectedRegionId) && selectedRegionId === regionId) {
                        widgetStore.clearFrameEntry(fileId);
                    }
                });

                // delete region
                this.activeFrame.regionSet.deleteRegion(region);
            }
        }
    };

    // region requirements calculations

    recalculateStatsRequirements = () => {
        if (!this.activeFrame) {
            return;
        }

        const updatedRequirements = new Map<number, Array<number>>();
        this.widgetsStore.statsWidgets.forEach(widgetStore => {
            const frame = this.activeFrame;
            const fileId = frame.frameInfo.fileId;
            const regionId = widgetStore.regionIdMap.get(fileId) || -1;
            if (!frame.regionSet) {
                return;
            }
            const region = frame.regionSet.regions.find(r => r.regionId === regionId);
            if (regionId === -1 || region && region.isClosedRegion) {
                let frameRequirementsArray = updatedRequirements.get(fileId);
                if (!frameRequirementsArray) {
                    frameRequirementsArray = [];
                    updatedRequirements.set(fileId, frameRequirementsArray);
                }
                if (frameRequirementsArray.indexOf(regionId) === -1) {
                    frameRequirementsArray.push(regionId);
                }
            }
        });

        const diffList = this.diffStatsRequirements(updatedRequirements);
        this.statsRequirements = updatedRequirements;

        if (diffList.length) {
            for (const requirements of diffList) {
                this.backendService.setStatsRequirements(requirements);
            }
        }
    };

    private diffStatsRequirements = (updatedRequirements: Map<number, Array<number>>) => {
        const diffList: CARTA.SetStatsRequirements[] = [];

        // Three possible scenarios:
        // 1. Existing array, no new array => diff should be empty stats requirements for each element of existing array
        // 2. No existing array, new array => diff should be full stats requirements for each element of new array
        // 3. Existing array and new array => diff should be empty stats for those missing in new array, full stats for those missing in old array

        // (1) & (3) handled first
        this.statsRequirements.forEach((statsArray, fileId) => {
            const updatedStatsArray = updatedRequirements.get(fileId);
            // If there's no new array, remove requirements for all existing regions
            if (!updatedStatsArray) {
                for (const regionId of statsArray) {
                    diffList.push(CARTA.SetStatsRequirements.create({fileId, regionId, stats: []}));
                }
            } else {
                // If regions in the new array are missing, remove requirements for those regions
                for (const regionId of statsArray) {
                    if (updatedStatsArray.indexOf(regionId) === -1) {
                        diffList.push(CARTA.SetStatsRequirements.create({fileId, regionId, stats: []}));
                    }
                }
                // If regions in the existing array are missing, add requirements for those regions
                for (const regionId of updatedStatsArray) {
                    if (statsArray.indexOf(regionId) === -1) {
                        diffList.push(CARTA.SetStatsRequirements.create({fileId, regionId, stats: AppStore.DEFAULT_STATS_TYPES}));
                    }
                }
            }
        });

        updatedRequirements.forEach((updatedStatsArray, fileId) => {
            const statsArray = this.statsRequirements.get(fileId);
            // If there's no existing array, add requirements for all new regions
            if (!statsArray) {
                for (const regionId of updatedStatsArray) {
                    diffList.push(CARTA.SetStatsRequirements.create({fileId, regionId, stats: AppStore.DEFAULT_STATS_TYPES}));
                }
            }
        });

        return diffList;
    };

    recalculateHistogramRequirements = () => {
        if (!this.activeFrame) {
            return;
        }

        const updatedRequirements = new Map<number, Array<number>>();
        this.widgetsStore.histogramWidgets.forEach(widgetStore => {
            const frame = this.activeFrame;
            const fileId = frame.frameInfo.fileId;
            const regionId = widgetStore.regionIdMap.get(fileId) || -1;
            if (!frame.regionSet) {
                return;
            }
            const region = frame.regionSet.regions.find(r => r.regionId === regionId);
            if (regionId === -1 || region && region.isClosedRegion) {
                let frameRequirementsArray = updatedRequirements.get(fileId);
                if (!frameRequirementsArray) {
                    frameRequirementsArray = [];
                    updatedRequirements.set(fileId, frameRequirementsArray);
                }
                if (frameRequirementsArray.indexOf(regionId) === -1) {
                    frameRequirementsArray.push(regionId);
                }
            }
        });

        const diffList = this.diffHistogramRequirements(updatedRequirements);
        this.histogramRequirements = updatedRequirements;

        if (diffList.length) {
            for (const requirements of diffList) {
                this.backendService.setHistogramRequirements(requirements);
            }
        }
    };

    private diffHistogramRequirements = (updatedRequirements: Map<number, Array<number>>) => {
        const diffList: CARTA.ISetHistogramRequirements[] = [];

        // Three possible scenarios:
        // 1. Existing array, no new array => diff should be empty stats requirements for each element of existing array
        // 2. No existing array, new array => diff should be full stats requirements for each element of new array
        // 3. Existing array and new array => diff should be empty stats for those missing in new array, full stats for those missing in old array

        // (1) & (3) handled first
        this.histogramRequirements.forEach((statsArray, fileId) => {
            const updatedStatsArray = updatedRequirements.get(fileId);
            // If there's no new array, remove requirements for all existing regions
            if (!updatedStatsArray) {
                for (const regionId of statsArray) {
                    diffList.push({fileId, regionId, histograms: []});
                }
            } else {
                // If regions in the new array are missing, remove requirements for those regions
                for (const regionId of statsArray) {
                    if (updatedStatsArray.indexOf(regionId) === -1) {
                        diffList.push({fileId, regionId, histograms: []});
                    }
                }
                // If regions in the existing array are missing, add requirements for those regions
                for (const regionId of updatedStatsArray) {
                    if (statsArray.indexOf(regionId) === -1) {
                        diffList.push({fileId, regionId, histograms: [{channel: -1, numBins: -1}]});
                    }
                }
            }
        });

        updatedRequirements.forEach((updatedStatsArray, fileId) => {
            const statsArray = this.histogramRequirements.get(fileId);
            // If there's no existing array, add requirements for all new regions
            if (!statsArray) {
                for (const regionId of updatedStatsArray) {
                    diffList.push({fileId, regionId, histograms: [{channel: -1, numBins: -1}]});
                }
            }
        });

        return diffList;
    };

    recalculateSpectralRequirements = () => {
        if (!this.activeFrame) {
            return;
        }

        const updatedRequirements = new Map<number, Map<number, CARTA.SetSpectralRequirements>>();
        this.widgetsStore.spectralProfileWidgets.forEach(widgetStore => {
            const frame = this.activeFrame;
            const fileId = frame.frameInfo.fileId;
            const regionId = widgetStore.regionIdMap.get(fileId) || 0;
            const coordinate = widgetStore.coordinate;
            let statsType = widgetStore.statsType;

            if (!frame.regionSet) {
                return;
            }
            const region = frame.regionSet.regions.find(r => r.regionId === regionId);
            if (region) {
                // Point regions have no meaningful stats type
                if (region.regionType === CARTA.RegionType.POINT) {
                    statsType = CARTA.StatsType.None;
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

                let spectralConfig = regionRequirements.spectralProfiles.find(profiles => profiles.coordinate === coordinate);
                if (!spectralConfig) {
                    // create new spectral config
                    regionRequirements.spectralProfiles.push({coordinate, statsTypes: [statsType]});
                } else if (spectralConfig.statsTypes.indexOf(statsType) === -1) {
                    // add to the stats type array
                    spectralConfig.statsTypes.push(statsType);
                }
            }
        });

        const diffList = this.diffSpectralRequirements(updatedRequirements);
        this.spectralRequirements = updatedRequirements;

        if (diffList.length) {
            diffList.forEach(requirements => this.backendService.setSpectralRequirements(requirements));
        }
    };

    // This function diffs the updated requirements map with the existing requirements map, and reacts to changes
    // Three diff cases are checked:
    // 1. The old map has an entry, but the new one does not => send an "empty" SetSpectralRequirements message
    // 2. The old and new maps both have entries, but they are different => send the new SetSpectralRequirements message
    // 3. The new map has an entry, but the old one does not => send the new SetSpectralRequirements message
    // The easiest way to check all three is to first add any missing entries to the new map (as empty requirements), and then check the updated maps entries
    diffSpectralRequirements = (updatedRequirements: Map<number, Map<number, CARTA.SetSpectralRequirements>>) => {
        const diffList: CARTA.SetSpectralRequirements[] = [];

        // Fill updated requirements with missing entries
        this.spectralRequirements.forEach((frameRequirements, fileId) => {
            let updatedFrameRequirements = updatedRequirements.get(fileId);
            if (!updatedFrameRequirements) {
                updatedFrameRequirements = new Map<number, CARTA.SetSpectralRequirements>();
                updatedRequirements.set(fileId, updatedFrameRequirements);
            }
            frameRequirements.forEach((regionRequirements, regionId) => {
                let updatedRegionRequirements = updatedFrameRequirements.get(regionId);
                if (!updatedRegionRequirements) {
                    updatedRegionRequirements = new CARTA.SetSpectralRequirements({fileId, regionId, spectralProfiles: []});
                    updatedFrameRequirements.set(regionId, updatedRegionRequirements);
                }
            });
        });

        // Go through updated requirements entries and find differences
        updatedRequirements.forEach((updatedFrameRequirements, fileId) => {
            let frameRequirements = this.spectralRequirements.get(fileId);
            if (!frameRequirements) {
                // If there are no existing requirements for this fileId, all entries for this file are new
                updatedFrameRequirements.forEach(regionRequirements => diffList.push(regionRequirements));
            } else {
                updatedFrameRequirements.forEach((updatedRegionRequirements, regionId) => {
                    let regionRequirements = frameRequirements.get(regionId);
                    if (!regionRequirements) {
                        // If there are no existing requirements for this regionId, this is a new entry
                        diffList.push(updatedRegionRequirements);
                    } else {
                        // Deep equality comparison with sorted arrays
                        const configCount = regionRequirements.spectralProfiles ? regionRequirements.spectralProfiles.length : 0;
                        const updatedConfigCount = updatedRegionRequirements.spectralProfiles ? updatedRegionRequirements.spectralProfiles.length : 0;

                        if (configCount !== updatedConfigCount) {
                            diffList.push(updatedRegionRequirements);
                            return;
                        }

                        if (configCount === 0) {
                            return;
                        }
                        const sortedUpdatedConfigs = updatedRegionRequirements.spectralProfiles.sort(((a, b) => a.coordinate > b.coordinate ? 1 : -1));
                        const sortedConfigs = regionRequirements.spectralProfiles.sort(((a, b) => a.coordinate > b.coordinate ? 1 : -1));

                        for (let i = 0; i < updatedConfigCount; i++) {
                            const updatedConfig = sortedUpdatedConfigs[i];
                            const config = sortedConfigs[i];
                            if (updatedConfig.coordinate !== config.coordinate) {
                                diffList.push(updatedRegionRequirements);
                                return;
                            }

                            const statsCount = config.statsTypes ? config.statsTypes.length : 0;
                            const updatedStatsCount = updatedConfig.statsTypes ? updatedConfig.statsTypes.length : 0;

                            if (statsCount !== updatedStatsCount) {
                                diffList.push(updatedRegionRequirements);
                                return;
                            }

                            if (statsCount === 0) {
                                return;
                            }

                            const sortedUpdatedStats = updatedConfig.statsTypes.sort();
                            const sortedStats = config.statsTypes.sort();
                            for (let j = 0; j < updatedStatsCount; j++) {
                                if (sortedUpdatedStats[j] !== sortedStats[j]) {
                                    diffList.push(updatedRegionRequirements);
                                    return;
                                }
                            }
                        }
                    }
                });
            }

        });
        // Sort list so that requirements clearing occurs first
        return diffList.sort((a, b) => a.spectralProfiles.length > b.spectralProfiles.length ? 1 : -1);
    };

    // endregion
}