import { ipcRenderer } from "electron";
import React from "react";
import Radium from "radium";
import { connect } from "react-redux";
import AddDoi from "./AddDoi";
import GraphWithToolbar from "./GraphWithToolbar";
import HorizontallyMovable from "./HorizontallyMovable";
import Information from "./Information";
import Menu from "./Menu";
import PublicationsList from "./PublicationsList";
import Requests from "./Requests";
import Search from "./Search";
import SetGraphThreshold from "./SetGraphThreshold";
import SetRefractoryPeriod from "./SetRefractoryPeriod";
import Tabs from "./Tabs";
import Warnings from "./Warnings";
import Tab from "../components/Tab";
import { bibtexToPublications } from "../libraries/utilities";
import { stateToJson, jsonToState } from "../state";
import {
    reset,
    resolveSave,
    rejectSave,
    rejectOpen,
    resolveImportPublications,
    rejectImportPublications,
    resolveImportDois,
    rejectImportDois,
    resolveImportBibtex,
    rejectImportBibtex,
    selectGraphDisplay,
    selectListDisplay,
} from "../actions/manageMenu";
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_IN_COLLECTION,
    CROSSREF_REQUEST_TYPE_CITER_METADATA,
} from "../constants/enums";
import {
    MINIMUM_WINDOW_WIDTH,
    MINIMUM_LEFT_SIDE_WIDTH,
    MINIMUM_RIGHT_SIDE_WIDTH,
} from "../constants/styles";

const publicationsToBibtex = publications => {
    const keysAndBibtexs = publications
        .filter(publication => publication.bibtex != null)
        .map(publication => {
            const match = /@\w+\s*{\s*([^,]+?)\s*,/.exec(publication.bibtex);
            return [match ? match[1] : "", publication.bibtex];
        });
    const keyToDuplicated = new Map();
    const keyToIndex = new Map();
    for (const [key, _] of keysAndBibtexs) {
        const duplicated = keyToDuplicated.has(key);
        keyToDuplicated.set(key, duplicated);
        if (duplicated) {
            keyToIndex.set(key, 0);
        }
    }
    for (const keyAndBibtex of keysAndBibtexs) {
        if (keyToIndex.has(keyAndBibtex[0])) {
            const key = keyAndBibtex[0];
            const index = keyToIndex.get(key);
            keyAndBibtex[0] = `${key}_${index}`;
            keyToIndex.set(key, index + 1);
        }
    }
    return `${keysAndBibtexs
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([_, bibtex]) => bibtex)
        .join("\n")}\n`;
};

class Origami extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            leftPosition: MINIMUM_LEFT_SIDE_WIDTH,
            rightPosition: window.innerWidth - MINIMUM_RIGHT_SIDE_WIDTH - 1,
        };
    }

    render() {
        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateRows: "40px auto",
                    gridTemplateColumns: `${this.state.leftPosition}px 1px ${
                        this.state.rightPosition - this.state.leftPosition - 1
                    }px 1px ${
                        this.state.width - this.state.rightPosition - 1
                    }px`,
                    height: "100%",
                    backgroundColor: this.props.colors.background,
                }}
            >
                <div
                    style={{
                        gridRowStart: 1,
                        gridRowEnd: 2,
                        gridColumnStart: 1,
                        gridColumnEnd: 6,
                        borderBottom: `solid 1px ${this.props.colors.sideSeparator}`,
                        backgroundColor: this.props.colors.sideBackground,
                    }}
                >
                    <Menu
                        items={[
                            {
                                id: "collection-menu-item",
                                name: "Collection",
                                left: 0,
                                elements: [
                                    {
                                        name: "New",
                                        onClick: () => {
                                            if (this.props.savable) {
                                                ipcRenderer.once(
                                                    "saved-to-file-then-new",
                                                    (
                                                        event,
                                                        cancelled,
                                                        failed,
                                                        filename
                                                    ) => {
                                                        if (!cancelled) {
                                                            if (failed) {
                                                                this.props.dispatch(
                                                                    rejectSave(
                                                                        filename,
                                                                        new Date().getTime()
                                                                    )
                                                                );
                                                            } else {
                                                                this.props.dispatch(
                                                                    reset()
                                                                );
                                                            }
                                                        }
                                                    }
                                                );
                                                ipcRenderer.send(
                                                    "save-to-file-then-new",
                                                    this.props.saveFilename,
                                                    stateToJson(
                                                        this.props.state,
                                                        true
                                                    )
                                                );
                                            } else {
                                                this.props.dispatch(reset());
                                            }
                                        },
                                        shortcut: "n",
                                    },
                                    {
                                        name: "Open…",
                                        onClick: () => {
                                            if (this.props.savable) {
                                                ipcRenderer.once(
                                                    "saved-to-file-then-opened",
                                                    (
                                                        event,
                                                        cancelledSave,
                                                        cancelledOpen,
                                                        saveFailed,
                                                        openFailed,
                                                        saveFilename,
                                                        openFilename,
                                                        data
                                                    ) => {
                                                        if (!cancelledSave) {
                                                            if (saveFailed) {
                                                                this.props.dispatch(
                                                                    rejectSave(
                                                                        saveFilename,
                                                                        new Date().getTime()
                                                                    )
                                                                );
                                                            } else {
                                                                if (
                                                                    saveFilename !=
                                                                    null
                                                                ) {
                                                                    this.props.dispatch(
                                                                        resolveSave(
                                                                            saveFilename,
                                                                            version
                                                                        )
                                                                    );
                                                                }
                                                                if (
                                                                    !cancelledOpen
                                                                ) {
                                                                    if (
                                                                        openFailed
                                                                    ) {
                                                                        this.props.dispatch(
                                                                            rejectOpen(
                                                                                openFilename,
                                                                                "The file could not be open for reading"
                                                                            )
                                                                        );
                                                                    } else {
                                                                        const [
                                                                            error,
                                                                            modified,
                                                                            newState,
                                                                        ] = jsonToState(
                                                                            data,
                                                                            openFilename,
                                                                            this
                                                                                .props
                                                                                .state
                                                                        );
                                                                        if (
                                                                            error
                                                                        ) {
                                                                            this.props.dispatch(
                                                                                rejectOpen(
                                                                                    openFilename,
                                                                                    error.message
                                                                                )
                                                                            );
                                                                        } else if (
                                                                            modified
                                                                        ) {
                                                                            ipcRenderer.once(
                                                                                "backedup",
                                                                                (
                                                                                    event,
                                                                                    moveFailed,
                                                                                    saveFailed,
                                                                                    backupFilename
                                                                                ) => {
                                                                                    if (
                                                                                        moveFailed
                                                                                    ) {
                                                                                        this.props.dispatch(
                                                                                            reset(
                                                                                                {
                                                                                                    ...newState,
                                                                                                    warnings:
                                                                                                        {
                                                                                                            ...newState.warnings,
                                                                                                            list: [
                                                                                                                ...newState
                                                                                                                    .warnings
                                                                                                                    .list,
                                                                                                                {
                                                                                                                    title: "The save file was updated",
                                                                                                                    subtitle:
                                                                                                                        "Creating a backup failed",
                                                                                                                    level: "error",
                                                                                                                },
                                                                                                            ],
                                                                                                        },
                                                                                                    tabs: 2,
                                                                                                }
                                                                                            )
                                                                                        );
                                                                                    } else {
                                                                                        this.props.dispatch(
                                                                                            reset(
                                                                                                {
                                                                                                    ...newState,
                                                                                                    warnings:
                                                                                                        {
                                                                                                            ...newState.warnings,
                                                                                                            list: [
                                                                                                                ...newState
                                                                                                                    .warnings
                                                                                                                    .list,
                                                                                                                {
                                                                                                                    title: "The save file was updated",
                                                                                                                    subtitle: `A backup was saved to '${backupFilename}'`,
                                                                                                                    level: "warning",
                                                                                                                },
                                                                                                            ],
                                                                                                        },
                                                                                                }
                                                                                            )
                                                                                        );
                                                                                    }
                                                                                }
                                                                            );
                                                                            ipcRenderer.send(
                                                                                "backup",
                                                                                openFilename,
                                                                                stateToJson(
                                                                                    newState,
                                                                                    true
                                                                                )
                                                                            );
                                                                        } else {
                                                                            this.props.dispatch(
                                                                                reset(
                                                                                    newState
                                                                                )
                                                                            );
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                );
                                                ipcRenderer.send(
                                                    "save-to-file-then-open",
                                                    this.props.saveFilename,
                                                    stateToJson(
                                                        this.props.state,
                                                        true
                                                    )
                                                );
                                            } else {
                                                ipcRenderer.once(
                                                    "opened",
                                                    (
                                                        event,
                                                        cancelled,
                                                        failed,
                                                        filename,
                                                        data
                                                    ) => {
                                                        if (!cancelled) {
                                                            if (failed) {
                                                                this.props.dispatch(
                                                                    rejectOpen(
                                                                        filename,
                                                                        "The file could not be open for reading"
                                                                    )
                                                                );
                                                            } else {
                                                                const [
                                                                    error,
                                                                    modified,
                                                                    newState,
                                                                ] = jsonToState(
                                                                    data,
                                                                    filename,
                                                                    this.props
                                                                        .state
                                                                );
                                                                if (error) {
                                                                    this.props.dispatch(
                                                                        rejectOpen(
                                                                            filename,
                                                                            error.message
                                                                        )
                                                                    );
                                                                } else if (
                                                                    modified
                                                                ) {
                                                                    ipcRenderer.once(
                                                                        "backedup",
                                                                        (
                                                                            event,
                                                                            moveFailed,
                                                                            saveFailed,
                                                                            backupFilename
                                                                        ) => {
                                                                            if (
                                                                                moveFailed
                                                                            ) {
                                                                                this.props.dispatch(
                                                                                    reset(
                                                                                        {
                                                                                            ...newState,
                                                                                            warnings:
                                                                                                {
                                                                                                    ...newState.warnings,
                                                                                                    list: [
                                                                                                        ...newState
                                                                                                            .warnings
                                                                                                            .list,
                                                                                                        {
                                                                                                            title: "The save file was updated",
                                                                                                            subtitle:
                                                                                                                "Creating a backup failed",
                                                                                                            level: "error",
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                            tabs: 2,
                                                                                        }
                                                                                    )
                                                                                );
                                                                            } else {
                                                                                this.props.dispatch(
                                                                                    reset(
                                                                                        {
                                                                                            ...newState,
                                                                                            warnings:
                                                                                                {
                                                                                                    ...newState.warnings,
                                                                                                    list: [
                                                                                                        ...newState
                                                                                                            .warnings
                                                                                                            .list,
                                                                                                        {
                                                                                                            title: "The save file was updated",
                                                                                                            subtitle: `A backup was saved to '${backupFilename}'`,
                                                                                                            level: "warning",
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                        }
                                                                                    )
                                                                                );
                                                                            }
                                                                        }
                                                                    );
                                                                    ipcRenderer.send(
                                                                        "backup",
                                                                        filename,
                                                                        stateToJson(
                                                                            newState,
                                                                            true
                                                                        )
                                                                    );
                                                                } else {
                                                                    this.props.dispatch(
                                                                        reset(
                                                                            newState
                                                                        )
                                                                    );
                                                                }
                                                            }
                                                        }
                                                    }
                                                );
                                                ipcRenderer.send("open");
                                            }
                                        },
                                        shortcut: "o",
                                    },
                                    {
                                        name: "Save",
                                        onClick:
                                            this.props.savable ||
                                            this.props.saveFilename == null
                                                ? () => {
                                                      const version =
                                                          this.props.version;
                                                      ipcRenderer.once(
                                                          "saved-to-file",
                                                          (
                                                              event,
                                                              cancelled,
                                                              failed,
                                                              filename
                                                          ) => {
                                                              if (!cancelled) {
                                                                  if (failed) {
                                                                      this.props.dispatch(
                                                                          rejectSave(
                                                                              filename,
                                                                              new Date().getTime()
                                                                          )
                                                                      );
                                                                  } else {
                                                                      this.props.dispatch(
                                                                          resolveSave(
                                                                              filename,
                                                                              version
                                                                          )
                                                                      );
                                                                  }
                                                              }
                                                          }
                                                      );
                                                      ipcRenderer.send(
                                                          "save-to-file",
                                                          this.props
                                                              .saveFilename,
                                                          stateToJson(
                                                              this.props.state,
                                                              true
                                                          )
                                                      );
                                                  }
                                                : null,
                                        shortcut: "s",
                                    },
                                    {
                                        name: "Save as…",
                                        onClick: () => {
                                            const version = this.props.version;
                                            ipcRenderer.once(
                                                "saved-to-file",
                                                (
                                                    event,
                                                    cancelled,
                                                    failed,
                                                    filename
                                                ) => {
                                                    if (!cancelled) {
                                                        if (failed) {
                                                            this.props.dispatch(
                                                                rejectSave(
                                                                    filename,
                                                                    new Date().getTime()
                                                                )
                                                            );
                                                        } else {
                                                            this.props.dispatch(
                                                                resolveSave(
                                                                    filename,
                                                                    version
                                                                )
                                                            );
                                                        }
                                                    }
                                                }
                                            );
                                            ipcRenderer.send(
                                                "save-to-file",
                                                null,
                                                stateToJson(
                                                    this.props.state,
                                                    true
                                                )
                                            );
                                        },
                                        shortcut: "S",
                                        separator: true,
                                    },
                                    {
                                        name: "Import from save…",
                                        onClick: () => {
                                            ipcRenderer.once(
                                                "imported-publications",
                                                (
                                                    event,
                                                    cancelled,
                                                    failed,
                                                    filename,
                                                    data
                                                ) => {
                                                    if (!cancelled) {
                                                        if (failed) {
                                                            this.props.dispatch(
                                                                rejectImportPublications(
                                                                    filename,
                                                                    "The file could not be open for reading"
                                                                )
                                                            );
                                                        } else {
                                                            const [
                                                                error,
                                                                updated,
                                                                importedState,
                                                            ] = jsonToState(
                                                                data,
                                                                filename,
                                                                this.props.state
                                                            );
                                                            if (error) {
                                                                this.props.dispatch(
                                                                    rejectImportPublications(
                                                                        filename,
                                                                        error.message
                                                                    )
                                                                );
                                                            } else {
                                                                const fetchingDois =
                                                                    new Set([
                                                                        ...importedState.crossref.requests
                                                                            .filter(
                                                                                crossrefRequest =>
                                                                                    crossrefRequest.type ===
                                                                                    CROSSREF_REQUEST_TYPE_CITER_METADATA
                                                                            )
                                                                            .map(
                                                                                crossrefRequest =>
                                                                                    crossrefRequest.parentDoi
                                                                            ),
                                                                        ...importedState.doi.requests.map(
                                                                            doiRequest =>
                                                                                doiRequest.doi
                                                                        ),
                                                                        ...importedState.scholar.requests.map(
                                                                            request =>
                                                                                request.doi
                                                                        ),
                                                                    ]);
                                                                for (const [
                                                                    doi,
                                                                    publication,
                                                                ] of importedState.publications) {
                                                                    if (
                                                                        publication.status ===
                                                                            PUBLICATION_STATUS_UNVALIDATED ||
                                                                        (publication.status ===
                                                                            PUBLICATION_STATUS_IN_COLLECTION &&
                                                                            fetchingDois.has(
                                                                                doi
                                                                            ))
                                                                    ) {
                                                                        importedState.publications.delete(
                                                                            doi
                                                                        );
                                                                    }
                                                                }
                                                                if (
                                                                    importedState
                                                                        .publications
                                                                        .size >
                                                                    0
                                                                ) {
                                                                    this.props.dispatch(
                                                                        resolveImportPublications(
                                                                            importedState.publications
                                                                        )
                                                                    );
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            );
                                            ipcRenderer.send(
                                                "import-publications"
                                            );
                                        },
                                        shortcut: "i",
                                    },
                                    {
                                        name: "Import BibTeX…",
                                        onClick: () => {
                                            ipcRenderer.once(
                                                "imported-bibtex",
                                                (
                                                    event,
                                                    cancelled,
                                                    failed,
                                                    filename,
                                                    data
                                                ) => {
                                                    if (!cancelled) {
                                                        if (failed) {
                                                            this.props.dispatch(
                                                                rejectImportBibtex(
                                                                    filename,
                                                                    "The file could not be open for reading"
                                                                )
                                                            );
                                                        } else {
                                                            const [
                                                                error,
                                                                publications,
                                                            ] =
                                                                bibtexToPublications(
                                                                    data
                                                                );
                                                            if (error) {
                                                                this.props.dispatch(
                                                                    rejectImportBibtex(
                                                                        filename,
                                                                        `Parsing failed: ${error.message}`
                                                                    )
                                                                );
                                                            } else if (
                                                                publications.length >
                                                                0
                                                            ) {
                                                                this.props.dispatch(
                                                                    resolveImportBibtex(
                                                                        publications
                                                                    )
                                                                );
                                                            }
                                                        }
                                                    }
                                                }
                                            );
                                            ipcRenderer.send("import-bibtex");
                                        },
                                        shortcut: "b",
                                    },
                                    {
                                        name: "Import DOIs…",
                                        onClick: () => {
                                            ipcRenderer.once(
                                                "imported-dois",
                                                (
                                                    event,
                                                    cancelled,
                                                    failed,
                                                    filename,
                                                    data
                                                ) => {
                                                    if (!cancelled) {
                                                        if (failed) {
                                                            this.props.dispatch(
                                                                rejectImportDois(
                                                                    filename,
                                                                    "The file could not be open for reading"
                                                                )
                                                            );
                                                        } else {
                                                            try {
                                                                const dois =
                                                                    JSON.parse(
                                                                        data
                                                                    );
                                                                if (
                                                                    dois.constructor ===
                                                                    Array
                                                                ) {
                                                                    this.props.dispatch(
                                                                        resolveImportDois(
                                                                            dois,
                                                                            new Date().getTime()
                                                                        )
                                                                    );
                                                                } else {
                                                                    this.props.dispatch(
                                                                        rejectImportDois(
                                                                            filename,
                                                                            "The file does not contain a JSON array"
                                                                        )
                                                                    );
                                                                }
                                                            } catch (error) {
                                                                console.error(
                                                                    error
                                                                );
                                                                this.props.dispatch(
                                                                    rejectImportDois(
                                                                        filename,
                                                                        `Parsing failed: ${error.message}`
                                                                    )
                                                                );
                                                            }
                                                        }
                                                    }
                                                }
                                            );
                                            ipcRenderer.send("import-dois");
                                        },
                                        shortcut: "d",
                                        separator: true,
                                    },
                                    {
                                        name: "Export BibTeX…",
                                        onClick: () => {
                                            ipcRenderer.send(
                                                "export-bibtex",
                                                publicationsToBibtex(
                                                    Array.from(
                                                        this.props.state.publications.values()
                                                    )
                                                )
                                            );
                                        },
                                        shortcut: "e",
                                    },
                                ],
                            },
                            {
                                id: "display-menu-item",
                                name: "Display",
                                left: 83,
                                elements: [
                                    {
                                        name: "Graph",
                                        onClick:
                                            this.props.display === 0
                                                ? null
                                                : () => {
                                                      this.props.dispatch(
                                                          selectGraphDisplay()
                                                      );
                                                  },
                                        shortcut: "g",
                                    },
                                    {
                                        name: "List",
                                        onClick:
                                            this.props.display === 1
                                                ? null
                                                : () => {
                                                      this.props.dispatch(
                                                          selectListDisplay()
                                                      );
                                                  },
                                        shortcut: "l",
                                    },
                                ],
                            },
                        ]}
                        width={this.state.width}
                        height={this.state.height}
                    />
                    <span
                        style={{
                            height: "39px",
                            lineHeight: "39px",
                            color: this.props.colors.content,
                            fontSize: "14px",
                            fontFamily: "robotoLight",
                            textAlign: "center",
                            position: "absolute",
                            left: "159px",
                        }}
                    >
                        Threshold
                    </span>
                    <SetGraphThreshold
                        left={235}
                        width={100}
                        graphThreshold={1}
                        graphThresholdLimit={2}
                    />
                    <span
                        style={{
                            height: "39px",
                            lineHeight: "39px",
                            color: this.props.colors.content,
                            fontSize: "14px",
                            fontFamily: "robotoLight",
                            textAlign: "center",
                            position: "absolute",
                            left: "350px",
                            paddingLeft: "10px",
                            borderLeft: `1px solid ${this.props.colors.sideSeparator}`,
                        }}
                    >
                        Delay
                    </span>
                    <SetRefractoryPeriod
                        left={415}
                        width={100}
                        minimumRefractoryPeriod={2000}
                        maximumRefractoryPeriod={8000}
                        refractoryPeriodLimit={20000}
                    />
                </div>
                <div
                    style={{
                        gridRowStart: 2,
                        gridRowEnd: 3,
                        gridColumnStart: 1,
                        gridColumnEnd: 2,
                        backgroundColor: this.props.colors.sideBackground,
                    }}
                >
                    <AddDoi />
                    <Tabs>
                        <Tab
                            icon={
                                <svg viewBox="0 0 40 40">
                                    <circle
                                        fill="none"
                                        stroke={this.props.colors.link}
                                        strokeWidth="1.5"
                                        cx="20"
                                        cy="20"
                                        r="14.5"
                                    />
                                    <rect
                                        fill={this.props.colors.link}
                                        x="19"
                                        y="17"
                                        width="2"
                                        height="10"
                                    />
                                    <rect
                                        fill={this.props.colors.link}
                                        x="19"
                                        y="13"
                                        width="2"
                                        height="2"
                                    />
                                </svg>
                            }
                            activeIcon={
                                <svg viewBox="0 0 40 40">
                                    <circle
                                        fill="none"
                                        stroke={this.props.colors.active}
                                        strokeWidth="2.5"
                                        cx="20"
                                        cy="20"
                                        r="14.5"
                                    />
                                    <rect
                                        fill={this.props.colors.active}
                                        x="19"
                                        y="17"
                                        width="2"
                                        height="10"
                                    />
                                    <rect
                                        fill={this.props.colors.active}
                                        x="19"
                                        y="13"
                                        width="2"
                                        height="2"
                                    />
                                </svg>
                            }
                        >
                            <Information
                                style={{
                                    height: `${this.state.height - 120}px`,
                                    overflowY: "auto",
                                }}
                            />
                        </Tab>
                        <Tab
                            icon={
                                <svg viewBox="0 0 40 40">
                                    <circle
                                        fill="none"
                                        stroke={this.props.colors.link}
                                        strokeWidth="1.5"
                                        cx="20"
                                        cy="20"
                                        r="14.5"
                                    />
                                    <circle
                                        fill="none"
                                        stroke={this.props.colors.link}
                                        strokeWidth="2"
                                        cx="17.5"
                                        cy="17.5"
                                        r="4"
                                    />
                                    <path
                                        fill="none"
                                        stroke={this.props.colors.link}
                                        strokeWidth="2"
                                        strokeLinecap="square"
                                        d="M20.5,20.5 L26,26"
                                    />
                                </svg>
                            }
                            activeIcon={
                                <svg viewBox="0 0 40 40">
                                    <circle
                                        fill="none"
                                        stroke={this.props.colors.active}
                                        strokeWidth="2.5"
                                        cx="20"
                                        cy="20"
                                        r="14.5"
                                    />
                                    <circle
                                        fill="none"
                                        stroke={this.props.colors.active}
                                        strokeWidth="2"
                                        cx="17.5"
                                        cy="17.5"
                                        r="4"
                                    />
                                    <path
                                        fill="none"
                                        stroke={this.props.colors.active}
                                        strokeWidth="2"
                                        strokeLinecap="square"
                                        d="M20.5,20.5 L26,26"
                                    />
                                </svg>
                            }
                        >
                            <Search
                                style={{
                                    height: `${this.state.height - 120}px`,
                                    overflowY: "auto",
                                }}
                            />
                        </Tab>
                        <Tab
                            icon={
                                <svg viewBox="0 0 40 40">
                                    <rect
                                        fill={
                                            this.props.hasWarnings
                                                ? this.props.colors.warning
                                                : this.props.colors.link
                                        }
                                        x="19"
                                        y="16"
                                        width="2"
                                        height="10"
                                    />
                                    <rect
                                        fill={
                                            this.props.hasWarnings
                                                ? this.props.colors.warning
                                                : this.props.colors.link
                                        }
                                        x="19"
                                        y="28"
                                        width="2"
                                        height="2"
                                    />
                                    <path
                                        fill="none"
                                        d="M21.3010502,6.26754455 L36.2110222,32.2534958 L36.2110222,32.2534958 C36.6233051,32.972046 36.3750264,33.8887673 35.6564762,34.3010502 C35.4292805,34.4314084 35.1719094,34.5 34.909972,34.5 L5.09002796,34.5 L5.09002796,34.5 C4.26160084,34.5 3.59002796,33.8284271 3.59002796,33 C3.59002796,32.7380627 3.65861961,32.4806915 3.78897781,32.2534958 L18.6989498,6.26754455 L18.6989498,6.26754455 C19.1112327,5.54899439 20.027954,5.30071571 20.7465042,5.71299859 C20.9772594,5.84539911 21.1686496,6.03678936 21.3010502,6.26754455 Z"
                                        stroke={
                                            this.props.hasWarnings
                                                ? this.props.colors.warning
                                                : this.props.colors.link
                                        }
                                        strokeWidth="1.5"
                                    />
                                </svg>
                            }
                            activeIcon={
                                <svg viewBox="0 0 40 40">
                                    <rect
                                        fill={this.props.colors.active}
                                        x="19"
                                        y="16"
                                        width="2"
                                        height="10"
                                    />
                                    <rect
                                        fill={this.props.colors.active}
                                        x="19"
                                        y="28"
                                        width="2"
                                        height="2"
                                    />
                                    <path
                                        fill="none"
                                        d="M21.3010502,6.26754455 L36.2110222,32.2534958 L36.2110222,32.2534958 C36.6233051,32.972046 36.3750264,33.8887673 35.6564762,34.3010502 C35.4292805,34.4314084 35.1719094,34.5 34.909972,34.5 L5.09002796,34.5 L5.09002796,34.5 C4.26160084,34.5 3.59002796,33.8284271 3.59002796,33 C3.59002796,32.7380627 3.65861961,32.4806915 3.78897781,32.2534958 L18.6989498,6.26754455 L18.6989498,6.26754455 C19.1112327,5.54899439 20.027954,5.30071571 20.7465042,5.71299859 C20.9772594,5.84539911 21.1686496,6.03678936 21.3010502,6.26754455 Z"
                                        stroke={this.props.colors.active}
                                        strokeWidth="2.5"
                                    />
                                </svg>
                            }
                        >
                            <Warnings
                                style={{
                                    height: `${this.state.height - 120}px`,
                                    overflowY: "auto",
                                }}
                            />
                        </Tab>
                    </Tabs>
                </div>
                <div
                    style={{
                        gridRowStart: 2,
                        gridRowEnd: 3,
                        gridColumnStart: 2,
                        gridColumnEnd: 3,
                        backgroundColor: this.props.colors.sideSeparator,
                    }}
                />
                <div
                    style={{
                        position: "relative",
                        gridRowStart: 2,
                        gridRowEnd: 3,
                        gridColumnStart: 3,
                        gridColumnEnd: 4,
                    }}
                >
                    <GraphWithToolbar
                        width={
                            this.state.rightPosition -
                            this.state.leftPosition -
                            1
                        }
                        height={this.state.height - 40}
                        leftPosition={this.state.leftPosition}
                    />
                    {this.props.display === 1 && (
                        <PublicationsList
                            width={
                                this.state.rightPosition -
                                this.state.leftPosition -
                                1
                            }
                            height={this.state.height - 40}
                            zIndex="20"
                        />
                    )}
                </div>
                <div
                    style={{
                        gridRowStart: 2,
                        gridRowEnd: 3,
                        gridColumnStart: 4,
                        gridColumnEnd: 5,
                        backgroundColor: this.props.colors.sideSeparator,
                    }}
                />
                <div
                    style={{
                        gridRowStart: 2,
                        gridRowEnd: 3,
                        gridColumnStart: 5,
                        gridColumnEnd: 6,
                        backgroundColor: this.props.colors.sideBackground,
                    }}
                >
                    <Requests
                        height={this.state.height - 40}
                        leftPosition={this.state.leftPosition}
                        rightPosition={this.state.rightPosition}
                    />
                </div>
                <HorizontallyMovable
                    id="LeftSideHorizontallyMovable"
                    leftLimit={MINIMUM_RIGHT_SIDE_WIDTH}
                    position={this.state.leftPosition}
                    rightLimit={
                        this.state.rightPosition +
                        1 -
                        (MINIMUM_WINDOW_WIDTH -
                            1 -
                            MINIMUM_LEFT_SIDE_WIDTH -
                            MINIMUM_RIGHT_SIDE_WIDTH)
                    }
                    move={position =>
                        this.setState({
                            leftPosition: position,
                        })
                    }
                    style={{
                        width: "5px",
                        height: "calc(100% - 40px)",
                        position: "absolute",
                        top: "40px",
                        left: `${this.state.leftPosition - 2}px`,
                    }}
                />
                <HorizontallyMovable
                    id="RightSideHorizontallyMovable"
                    leftLimit={
                        this.state.leftPosition +
                        (MINIMUM_WINDOW_WIDTH -
                            1 -
                            MINIMUM_LEFT_SIDE_WIDTH -
                            MINIMUM_RIGHT_SIDE_WIDTH)
                    }
                    position={this.state.rightPosition}
                    rightLimit={this.state.width - MINIMUM_RIGHT_SIDE_WIDTH}
                    move={position =>
                        this.setState({
                            rightPosition: position,
                        })
                    }
                    style={{
                        width: "5px",
                        height: "calc(100% - 40px)",
                        position: "absolute",
                        top: "40px",
                        left: `${this.state.rightPosition - 2}px`,
                    }}
                />
            </div>
        );
    }

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    updateDimensions() {
        if (
            window.innerWidth >= this.state.width ||
            this.state.rightPosition - this.state.leftPosition - 1 >
                MINIMUM_WINDOW_WIDTH -
                    2 -
                    MINIMUM_LEFT_SIDE_WIDTH -
                    MINIMUM_RIGHT_SIDE_WIDTH
        ) {
            this.setState({
                rightPosition:
                    this.state.rightPosition +
                    window.innerWidth -
                    this.state.width,
            });
        } else if (
            this.state.width - this.state.rightPosition <=
            MINIMUM_RIGHT_SIDE_WIDTH
        ) {
            this.setState({
                leftPosition:
                    this.state.leftPosition +
                    window.innerWidth -
                    this.state.width,
                rightPosition:
                    this.state.rightPosition +
                    window.innerWidth -
                    this.state.width,
            });
        }
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
}

export default connect(state => {
    return {
        hasWarnings: state.warnings.list.length > 0,
        savable: state.menu.savedVersion < state.version,
        saveFilename: state.menu.saveFilename,
        version: state.version,
        display: state.menu.display,
        colors: state.colors,
        state,
    };
})(Radium(Origami));
