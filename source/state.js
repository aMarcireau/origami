import Ajv from "ajv";
import deepEqual from "deep-equal";
import crossrefQueue from "./queues/crossrefQueue";
import doiQueue from "./queues/doiQueue";
import scholarQueue from "./queues/scholarQueue";
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
    SCHOLAR_REQUEST_TYPE_INITIALIZE,
    SCHOLAR_REQUEST_TYPE_CITERS,
    SCHOLAR_STATUS_IDLE,
    SCHOLAR_STATUS_FETCHING,
    SCHOLAR_STATUS_BLOCKED_HIDDEN,
    SCHOLAR_STATUS_BLOCKED_VISIBLE,
    SCHOLAR_STATUS_UNBLOCKING,
    CROSSREF_REQUEST_TYPE_VALIDATION,
    CROSSREF_REQUEST_TYPE_CITER_METADATA,
    CROSSREF_REQUEST_TYPE_IMPORTED_METADATA,
} from "./constants/enums";

/// minimumValidate is the minimum schema validator for repairing.
const minimumValidate = new Ajv().compile({
    type: "object",
    properties: {
        publications: {
            type: "array",
            items: {
                type: "array",
                minItems: 2,
                maxItems: 2,
                items: [{ type: "string" }, { type: "object" }],
            },
        },
    },
    required: ["publications"],
});

/// validate is the schema validator for the current version's state.
const validate = new Ajv({ removeAdditional: true }).compile({
    type: "object",
    properties: {
        appVersion: { type: "string" },
        display: { type: "integer", minimum: 0, maximum: 1 },
        knownDois: {
            type: "array",
            items: { type: "string" },
        },
        crossref: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    type: { type: "string" },
                    doi: { type: "string" },
                    parentDoi: { type: "string" },
                    title: { type: "string" },
                    authors: {
                        type: "array",
                        items: { type: "string" },
                    },
                    dateAsString: { type: "string" },
                },
                additionalProperties: false,
                anyOf: [
                    {
                        properties: {
                            type: {
                                type: "string",
                                const: CROSSREF_REQUEST_TYPE_VALIDATION,
                            },
                            doi: { type: "string" },
                        },
                        required: ["type", "doi"],
                    },
                    {
                        properties: {
                            type: {
                                type: "string",
                                const: CROSSREF_REQUEST_TYPE_CITER_METADATA,
                            },
                            parentDoi: { type: "string" },
                            title: { type: "string" },
                            authors: {
                                type: "array",
                                items: { type: "string" },
                            },
                            dateAsString: { type: "string" },
                        },
                        required: [
                            "type",
                            "parentDoi",
                            "title",
                            "authors",
                            "dateAsString",
                        ],
                    },
                    {
                        properties: {
                            type: {
                                type: "string",
                                const: CROSSREF_REQUEST_TYPE_IMPORTED_METADATA,
                            },
                            title: { type: "string" },
                            authors: {
                                type: "array",
                                items: { type: "string" },
                            },
                            dateAsString: { type: "string" },
                        },
                        required: ["type", "title", "authors", "dateAsString"],
                    },
                ],
            },
        },
        doi: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    doi: { type: "string" },
                },
                additionalProperties: false,
                required: ["doi"],
            },
        },
        scholar: {
            type: "object",
            properties: {
                requests: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            type: {
                                type: "string",
                                const: SCHOLAR_REQUEST_TYPE_CITERS,
                            },
                            doi: { type: "string" },
                            url: { type: "string" },
                            number: { type: "integer", minimum: 1 },
                            total: { type: "integer", minimum: 1 },
                        },
                        additionalProperties: false,
                        anyOf: [
                            {
                                properties: {
                                    type: {
                                        type: "string",
                                        const: SCHOLAR_REQUEST_TYPE_INITIALIZE,
                                    },
                                    doi: { type: "string" },
                                    url: { type: "string" },
                                },
                                required: ["type", "doi", "url"],
                            },
                            {
                                properties: {
                                    type: {
                                        type: "string",
                                        const: SCHOLAR_REQUEST_TYPE_CITERS,
                                    },
                                    doi: { type: "string" },
                                    url: { type: "string" },
                                    number: { type: "integer", minimum: 1 },
                                    total: { type: "integer", minimum: 1 },
                                },
                                required: [
                                    "type",
                                    "doi",
                                    "url",
                                    "number",
                                    "total",
                                ],
                            },
                        ],
                    },
                },
                minimumRefractoryPeriod: {
                    type: "integer",
                    minimum: 0,
                    maximum: 20000,
                    multipleOf: 100,
                },
                maximumRefractoryPeriod: {
                    type: "integer",
                    minimum: 0,
                    maximum: 20000,
                    multipleOf: 100,
                },
            },
            additionalProperties: false,
            required: [
                "requests",
                "minimumRefractoryPeriod",
                "maximumRefractoryPeriod",
            ],
        },
        graph: {
            type: "object",
            properties: {
                threshold: { type: "integer", minimum: 1 },
                zoom: { type: "integer", minimum: -50, maximum: 50 },
                xOffset: { type: "number" },
                yOffset: { type: "number" },
                sticky: { type: "boolean" },
            },
            additionalProperties: false,
            required: ["threshold", "zoom", "xOffset", "yOffset", "sticky"],
        },
        publications: {
            type: "array",
            items: {
                type: "array",
                minItems: 2,
                maxItems: 2,
                items: [
                    { type: "string" },
                    {
                        type: "object",
                        properties: {
                            status: { type: "string" },
                            title: {
                                anyOf: [{ type: "null" }, { type: "string" }],
                            },
                            authors: {
                                anyOf: [
                                    { type: "null" },
                                    {
                                        type: "array",
                                        items: { type: "string" },
                                    },
                                ],
                            },
                            journal: {
                                anyOf: [{ type: "null" }, { type: "string" }],
                            },
                            date: {
                                anyOf: [
                                    { type: "null" },
                                    {
                                        type: "array",
                                        minItems: 1,
                                        maxItems: 3,
                                        items: { type: "integer" },
                                    },
                                ],
                            },
                            citers: {
                                type: "array",
                                items: { type: "string" },
                            },
                            updated: {
                                anyOf: [
                                    { type: "null" },
                                    { type: "integer", minimum: 0 },
                                ],
                            },
                            selected: { type: "boolean" },
                            bibtex: {
                                anyOf: [{ type: "null" }, { type: "string" }],
                            },
                            x: {
                                anyOf: [{ type: "null" }, { type: "number" }],
                            },
                            y: {
                                anyOf: [{ type: "null" }, { type: "number" }],
                            },
                            locked: { type: "boolean" },
                            tag: {
                                anyOf: [
                                    { type: "null" },
                                    { type: "integer", minimum: 0, maximum: 5 },
                                ],
                            },
                        },
                        additionalProperties: false,
                        anyOf: [
                            {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "string",
                                        const: PUBLICATION_STATUS_UNVALIDATED,
                                    },
                                    title: { type: "null" },
                                    authors: { type: "null" },
                                    journal: { type: "null" },
                                    date: { type: "null" },
                                    citers: { type: "array", maxItems: 0 },
                                    updated: { type: "null" },
                                    selected: { type: "boolean", const: false },
                                    bibtex: { type: "null" },
                                    x: { type: "null" },
                                    y: { type: "null" },
                                    locked: { type: "boolean", const: false },
                                    tag: { type: "null" },
                                },
                                required: [
                                    "status",
                                    "title",
                                    "authors",
                                    "journal",
                                    "date",
                                    "citers",
                                    "updated",
                                    "selected",
                                    "bibtex",
                                    "x",
                                    "y",
                                    "locked",
                                    "tag",
                                ],
                            },
                            {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "string",
                                        const: PUBLICATION_STATUS_DEFAULT,
                                    },
                                    title: { type: "string" },
                                    authors: {
                                        type: "array",
                                        items: { type: "string" },
                                    },
                                    journal: { type: "string" },
                                    date: {
                                        type: "array",
                                        minItems: 1,
                                        maxItems: 3,
                                        items: { type: "integer" },
                                    },
                                    citers: { type: "array", maxItems: 0 },
                                    updated: { type: "null" },
                                    selected: { type: "boolean" },
                                    bibtex: { type: "null" },
                                    x: {
                                        anyOf: [
                                            { type: "null" },
                                            { type: "number" },
                                        ],
                                    },
                                    y: {
                                        anyOf: [
                                            { type: "null" },
                                            { type: "number" },
                                        ],
                                    },
                                    locked: { type: "boolean", const: false },
                                    tag: { type: "null" },
                                },
                                required: [
                                    "status",
                                    "title",
                                    "authors",
                                    "journal",
                                    "date",
                                    "citers",
                                    "updated",
                                    "selected",
                                    "bibtex",
                                    "x",
                                    "y",
                                    "locked",
                                    "tag",
                                ],
                            },
                            {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "string",
                                        const: PUBLICATION_STATUS_IN_COLLECTION,
                                    },
                                    title: { type: "string" },
                                    authors: {
                                        type: "array",
                                        items: { type: "string" },
                                    },
                                    journal: { type: "string" },
                                    date: {
                                        type: "array",
                                        minItems: 1,
                                        maxItems: 3,
                                        items: { type: "integer" },
                                    },
                                    citers: {
                                        type: "array",
                                        items: { type: "string" },
                                    },
                                    updated: { type: "integer", minimum: 0 },
                                    selected: { type: "boolean" },
                                    bibtex: {
                                        anyOf: [
                                            { type: "null" },
                                            { type: "string" },
                                        ],
                                    },
                                    x: { type: "number" },
                                    y: { type: "number" },
                                    locked: { type: "boolean" },
                                    tag: {
                                        anyOf: [
                                            { type: "null" },
                                            {
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 5,
                                            },
                                        ],
                                    },
                                },
                                required: [
                                    "status",
                                    "title",
                                    "authors",
                                    "journal",
                                    "date",
                                    "citers",
                                    "updated",
                                    "selected",
                                    "bibtex",
                                    "x",
                                    "y",
                                    "locked",
                                    "tag",
                                ],
                            },
                        ],
                    },
                ],
            },
        },
        search: { type: "string" },
        tabs: { type: "integer", minimum: 0, maximum: 2 },
        warnings: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                    level: { type: "string", enum: ["warning", "error"] },
                },
                additionalProperties: false,
                required: ["title", "subtitle", "level"],
            },
        },
        saveFilename: {
            anyOf: [{ type: "null" }, { type: "string" }],
        },
    },
    required: [
        "appVersion",
        "display",
        "knownDois",
        "crossref",
        "doi",
        "scholar",
        "graph",
        "publications",
        "search",
        "tabs",
        "warnings",
    ],
});

/// stateToJson generates a JSON string from an app state.
/// expand must be a boolean:
///    if true, a user-save JSON is generated (pretty-printed)
///    otherwise, an auto-save JSON is generated
export function stateToJson(state, expand) {
    return `${JSON.stringify(
        {
            appVersion: state.appVersion,
            display: state.menu.display,
            knownDois: Array.from(state.knownDois),
            crossref: state.crossref.requests.filter(
                crossrefRequest =>
                    crossrefRequest.type !==
                        CROSSREF_REQUEST_TYPE_CITER_METADATA ||
                    state.publications.has(crossrefRequest.parentDoi)
            ),
            doi: state.doi.requests.filter(doiRequest =>
                state.publications.has(doiRequest.doi)
            ),
            graph: state.graph,
            saveFilename: expand ? undefined : state.menu.saveFilename,
            savable: expand
                ? undefined
                : state.menu.savedVersion < state.version,
            publications: Array.from(state.publications.entries()),
            scholar: {
                requests: state.scholar.requests.filter(request =>
                    state.publications.has(request.doi)
                ),
                minimumRefractoryPeriod: state.scholar.minimumRefractoryPeriod,
                maximumRefractoryPeriod: state.scholar.maximumRefractoryPeriod,
            },
            search: state.search,
            tabs: state.tabs.index,
            warnings: state.warnings.list,
        },
        null,
        expand ? "    " : null
    )}${expand ? "\n" : ""}`;
}

/// merge fills non-saved properties.
///     saveFilename (string): if null (auto-save JSON), the JSON's saveFilename is used
///     previousState (object): if null (auto-save JSON), some state parameters are left empty (and must be added manually)
function merge(state, saveFilename, previousState) {
    // fill properties
    state.appVersion = previousState ? previousState.appVersion : undefined;
    state.colors = previousState ? previousState.colors : undefined;
    state.connected = previousState ? previousState.connected : undefined;
    state.crossref = {
        status: crossrefQueue.status.IDLE,
        requests: state.crossref,
    };
    state.doi = {
        status: doiQueue.status.IDLE,
        requests: state.doi,
    };
    state.knownDois = new Set(state.knownDois);
    state.menu = {
        activeItem: null,
        hash: previousState ? previousState.menu.hash + 1 : 0,
        saveFilename: saveFilename ? saveFilename : state.saveFilename,
        savedVersion: previousState ? previousState.version + 1 : 0,
        display: state.display,
    };
    delete state.saveFilename;
    delete state.display;
    state.publications = new Map(state.publications);
    state.scholar.status = SCHOLAR_STATUS_IDLE;
    state.scholar.beginOfRefractoryPeriod = null;
    state.scholar.endOfRefractoryPeriod = null;
    state.scholar.url = null;
    state.tabs = {
        index: state.tabs,
        hash: previousState ? previousState.tabs.hash + 1 : 0,
    };
    state.version = previousState
        ? previousState.version + 1
        : state.savable
        ? 1
        : 0;
    delete state.savable;
    state.warnings = {
        list: state.warnings,
        hash: previousState ? previousState.warnings.hash + 1 : 0,
    };

    // verify integrity
    for (const [doi, publication] of state.publications.entries()) {
        publication.citers = publication.citers.filter(citer =>
            state.publications.has(citer)
        );
    }
    state.crossref.requests = state.crossref.requests.filter(
        request =>
            (request.type === CROSSREF_REQUEST_TYPE_VALIDATION &&
                state.publications.has(request.doi)) ||
            (request.type === CROSSREF_REQUEST_TYPE_CITER_METADATA &&
                state.publications.has(request.parentDoi)) ||
            request.type === CROSSREF_REQUEST_TYPE_IMPORTED_METADATA
    );
    state.doi.requests = state.doi.requests.filter(request =>
        state.publications.has(request.doi)
    );
    state.scholar.requests = state.scholar.requests.filter(request =>
        state.publications.has(request.doi)
    );
    state.warnings.list = state.warnings.list.filter(
        warning => warning.title !== ""
    );
    let selectedFound = false;
    for (const publication of state.publications.values()) {
        if (publication.selected) {
            if (selectedFound) {
                publication.selected = false;
            } else {
                selectedFound = true;
            }
        }
    }
    const citersCountByDoi = new Map();
    for (const [doi, publication] of state.publications.entries()) {
        if (publication.status === PUBLICATION_STATUS_IN_COLLECTION) {
            for (const citer of publication.citers) {
                if (
                    state.publications.get(citer).status ===
                    PUBLICATION_STATUS_DEFAULT
                ) {
                    if (citersCountByDoi.has(citer)) {
                        citersCountByDoi.set(
                            citer,
                            citersCountByDoi.get(citer) + 1
                        );
                    } else {
                        citersCountByDoi.set(citer, 1);
                    }
                }
            }
        }
    }
    state.graph.threshold = Math.min(
        state.graph.threshold,
        citersCountByDoi.size > 0
            ? Math.max(...citersCountByDoi.values()) + 1
            : 2
    );
    if (
        state.scholar.minimumRefractoryPeriod >
        state.scholar.maximumRefractoryPeriod
    ) {
        state.scholar.minimumRefractoryPeriod =
            state.scholar.maximumRefractoryPeriod;
    }

    return state;
}

/// jsonToState generates an app state from a JSON buffer.
///     saveFilename (string): if null (auto-save JSON), the JSON's saveFilename is used
///     previousState (object): if null (auto-save JSON), some state parameters are left empty (and must be added manually)
/// returned value ([error, modified, state]):
///     error (object): if not null, no state is generated
///     modified (boolean): if true, non-reversible modifications were applied
///     state (boolean): the parsed state
export function jsonToState(json, saveFilename, previousState) {
    const jsonAsString = new TextDecoder("utf-8").decode(json);
    let stateCandidate;
    try {
        stateCandidate = JSON.parse(jsonAsString);
    } catch (error) {
        return [new Error(`Parsing failed: ${error.message}`), false, null];
    }
    if (!minimumValidate(stateCandidate)) {
        return [
            new Error("The JSON file does not have the expected structure"),
            false,
            null,
        ];
    }
    if (validate(stateCandidate)) {
        return [
            null,
            !deepEqual(stateCandidate, JSON.parse(jsonAsString)),
            merge(stateCandidate, saveFilename, previousState),
        ];
    }
    for (;;) {
        let errors = validate.errors;

        console.log(errors); // @DEV

        console.error(
            errors.map(error => error.keyword).join(", "),
            errors,
            errors.map(error => eval(`stateCandidate${error.dataPath}`))
        );
        if (
            errors.length > 1 &&
            errors[errors.length - 1].keyword === "anyOf"
        ) {
            errors = errors
                .slice(0, errors.length - 1)
                .filter(error => error.keyword !== "const");
            if (errors.length === 0) {
                const match = /(^[\w\.]+)\[(\d+)\]/.exec(
                    validate.errors[validate.errors.length - 1].dataPath
                );
                if (!match) {
                    return [
                        new Error(
                            "The data path for an 'anyOf' constraint does not have the expected format"
                        ),
                        false,
                        null,
                    ];
                }
                eval(`stateCandidate${match[1]}.splice(${match[2]}, 1);`);
                continue;
            }
        }
        for (const error of errors) {
            switch (error.keyword) {
                case "required": {
                    eval(
                        `stateCandidate${error.dataPath}.${error.params.missingProperty} = null;`
                    );
                    break;
                }
                case "type": {
                    const types = [
                        "null",
                        "boolean",
                        "integer",
                        "number",
                        "string",
                        "array",
                        "object",
                    ].filter(type =>
                        error.params.type.split(",").includes(type)
                    );
                    if (types.length === 0) {
                        return [
                            new Error(`Unknown type '${error.params.type}'`),
                            false,
                            null,
                        ];
                    }
                    switch (types[0]) {
                        case "null":
                            eval(`stateCandidate${error.dataPath} = null;`);
                            break;
                        case "boolean":
                            eval(`stateCandidate${error.dataPath} = false;`);
                            break;
                        case "integer":
                            eval(`stateCandidate${error.dataPath} = 0;`);
                            break;
                        case "number":
                            eval(`stateCandidate${error.dataPath} = 0;`);
                            break;
                        case "string":
                            eval(`stateCandidate${error.dataPath} = '';`);
                            break;
                        case "array":
                            eval(`stateCandidate${error.dataPath} = [];`);
                            break;
                        case "object":
                            eval(`stateCandidate${error.dataPath} = {};`);
                            break;
                        default:
                            return [
                                new Error(`Unknown type '${types[0]}'`),
                                false,
                                null,
                            ];
                    }
                    break;
                }
                case "maximum":
                case "minimum": {
                    eval(
                        `stateCandidate${error.dataPath} = ${error.params.limit};`
                    );
                    break;
                }
                case "multipleOf": {
                    eval(
                        `stateCandidate${error.dataPath} = Math.round(stateCandidate${error.dataPath} / ${error.params.multipleOf}) * ${error.params.multipleOf};`
                    );
                    break;
                }
                default:
                    return [
                        new Error(`Unknown error keyword '${error.keyword}'`),
                        false,
                        null,
                    ];
            }
        }
        if (validate(stateCandidate)) {
            return [
                null,
                true,
                merge(stateCandidate, saveFilename, previousState),
            ];
        }
    }
}

/// resetState generates a reset state with incremented hashes.
/// state must be an app state.
export function resetState(state) {
    return {
        appVersion: state.appVersion,
        colors: state.colors,
        connected: state.connected,
        menu: {
            activeItem: null,
            hash: state.menu.hash + 1,
            saveFilename: null,
            savedVersion: state.version + 1,
            display: 0,
        },
        tabs: {
            index: 0,
            hash: state.tabs.hash + 1,
        },
        version: state.version + 1,
        warnings: {
            list: [],
            hash: state.warnings.hash + 1,
        },
    };
}
