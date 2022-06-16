import queue from "../libraries/queue";
import { RESOLVE_BIBTEX_FROM_DOI } from "../constants/actionTypes";
import { resolveBibtexFromDoi } from "../actions/manageDoi";

const normalize = string =>
    string
        .normalize("NFKD")
        .replace(/[\u0300-\u036F]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();

const doiQueue = queue(
    "DOI",
    "doi",
    state => state.connected,
    (request, store) => {
        fetch(`https://dx.doi.org/${request.doi}`, {
            headers: new Headers({
                Accept: "text/bibliography; style=bibtex",
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response;
            })
            .then(response => response.text())
            .then(rawText => {
                const bibtex = rawText.trim();
                const nameToValue = new Map();
                const add = (name, value) => {
                    if (name.includes(",")) {
                        name = name.split(",")[1];
                    }
                    if (name.length > 0) {
                        nameToValue.set(name, value.trim());
                    }
                };
                let type = "";
                let name = "";
                let value = "";
                let state = 0;
                let depth = 0;
                for (const character of bibtex) {
                    switch (state) {
                        case 0: {
                            if (character === "{") {
                                state = 1;
                            } else if (!/\s/.test(character)) {
                                type += character;
                            }
                            break;
                        }
                        case 1: {
                            if (character === ",") {
                                state = 2;
                                name = "";
                            } else if (character === "}") {
                                state = 7;
                            }
                            break;
                        }
                        case 2: {
                            if (character === "=") {
                                state = 3;
                                value = "";
                            } else if (!/\s/.test(character)) {
                                name += character;
                            }
                            break;
                        }
                        case 3: {
                            if (character === "{") {
                                value += character;
                                state = 4;
                                depth = 1;
                            } else if (character === '"') {
                                value += character;
                                state = 5;
                            } else if (!/\s/.test(character)) {
                                value += character;
                                state = 6;
                            }
                            break;
                        }
                        case 4: {
                            if (character === "{") {
                                value += character;
                                ++depth;
                            } else if (character === "}") {
                                value += character;
                                --depth;
                                if (depth < 0) {
                                    add(name, value);
                                    state = 7;
                                } else if (depth === 0) {
                                    add(name, value);
                                    state = 1;
                                }
                            } else {
                                value += character;
                            }
                            break;
                        }
                        case 5: {
                            if (character === '"') {
                                value += character;
                                add(name, value);
                                state = 1;
                            } else {
                                value += character;
                            }
                            break;
                        }
                        case 6: {
                            if (character === ",") {
                                add(name, value);
                                state = 2;
                                name = "";
                            } else if (character === "}") {
                                add(name, value);
                                state = 7;
                            } else {
                                value += character;
                            }
                        }
                        case 7: {
                            break;
                        }
                        default: {
                            console.error(`unexpected state ${state}`);
                        }
                    }
                }
                let key = "";
                if (nameToValue.has("author")) {
                    const authors = nameToValue.get("author").split(" and ");
                    if (authors.length > 0) {
                        const author = authors[0].replace(/[{}\"]/g, "").trim();
                        if (author.includes(",")) {
                            key = normalize(author.split(",")[0]);
                        } else if (author.includes(" ")) {
                            key = normalize(author.split(" ")[1]);
                        }
                    }
                    if (key.length === 0) {
                        key = normalize(authors);
                    }
                }
                if (nameToValue.has("year")) {
                    key += `${key.length === 0 ? "" : "_"}${nameToValue
                        .get("year")
                        .replace(/[^\d]/g, "")}`;
                }
                const nameLength = Math.max(
                    ...Array.from(nameToValue.keys()).map(name => name.length)
                );
                store.dispatch(
                    resolveBibtexFromDoi(
                        request.doi,
                        `${type}{${key},\n${Array.from(nameToValue.entries())
                            .map(
                                ([name, value]) =>
                                    `    ${name.padEnd(
                                        nameLength,
                                        " "
                                    )} = ${value}`
                            )
                            .join(",\n")},\n}`
                    )
                );
            })
            .catch(error => {
                console.error(error);
                store.dispatch(doiQueue.actions.rejectConnection());
            });
    },
    [RESOLVE_BIBTEX_FROM_DOI]
);

export default doiQueue;
