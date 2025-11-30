"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//Used for obsidian resources
var obsidian_1 = require("obsidian");
//Main plugin class
var DungeonBuddy = /** @class */ (function (_super) {
    __extends(DungeonBuddy, _super);
    function DungeonBuddy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.currentSourceType = null;
        return _this;
    }
    DungeonBuddy.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sources, _loop_1, this_1, _i, sources_1, type;
            var _this = this;
            return __generator(this, function (_a) {
                sources = ["campaign", "reference", "homebrew", "misc"];
                _loop_1 = function (type) {
                    this_1.addCommand({
                        id: "import-".concat(type),
                        name: "Import ".concat(type.charAt(0).toUpperCase() + type.slice(1), " Markdown"),
                        callback: function () { return _this.importMarkdown(type); }
                    });
                };
                this_1 = this;
                for (_i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
                    type = sources_1[_i];
                    _loop_1(type);
                }
                return [2 /*return*/];
            });
        });
    };
    //Import markdown function for different source types {campagin | reference | homebrew | misc}
    DungeonBuddy.prototype.importMarkdown = function (sourceType) {
        return __awaiter(this, void 0, void 0, function () {
            var file, filecontent, markdown, notes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //Save off the source type
                        this.currentSourceType = sourceType;
                        return [4 /*yield*/, this.openFilePicker()];
                    case 1:
                        file = _a.sent();
                        if (!file)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.readFileContent(file)];
                    case 2:
                        filecontent = _a.sent();
                        return [4 /*yield*/, this.normalizeLineEndings(filecontent)];
                    case 3:
                        markdown = _a.sent();
                        notes = this.splitMarkdownIntoNotes(markdown);
                        // 4. Write notes to vault
                        return [4 /*yield*/, this.writeNotesToVault(this, notes, (file.name.replace(/\.[^/.]+$/, "")))];
                    case 4:
                        // 4. Write notes to vault
                        _a.sent();
                        new obsidian_1.Notice("Imported ".concat(notes.length, " notes from ").concat(file.name));
                        return [2 /*return*/];
                }
            });
        });
    };
    // helper to read content
    DungeonBuddy.prototype.readFileContent = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, file.text()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DungeonBuddy.prototype.normalizeLineEndings = function (md) {
        if (obsidian_1.Platform.isWin) {
            // Convert CRLF → LF
            return md.replace(/\r\n/g, "\n");
        }
        // Non-Windows is already LF
        return md;
    };
    DungeonBuddy.prototype.getFolderPath = function (sourceName) {
        switch (this.currentSourceType) {
            case "campaign": return "Campaigns/".concat(sourceName);
            case "reference": return "Reference/".concat(sourceName);
            case "homebrew": return "Homebrew/".concat(sourceName);
            default: return "Misc/".concat(sourceName);
        }
    };
    DungeonBuddy.prototype.openFilePicker = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var input = document.createElement("input");
                        input.type = "file";
                        input.accept = ".md";
                        input.onchange = function () { var _a, _b; return resolve((_b = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null); };
                        input.click();
                    })];
            });
        });
    };
    DungeonBuddy.prototype.splitMarkdownIntoNotes = function (markdown) {
        var lines = markdown.split("\n");
        var notes = [];
        var currentNote = null;
        var currentContent = [];
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var headerMatch = line.match(/^(#+)\s+(.*)/);
            if (headerMatch) {
                var level = headerMatch[1].length;
                var title = headerMatch[2].trim();
                if (level === 1) {
                    // Save previous note
                    if (currentNote) {
                        currentNote.contentBuffer = currentContent;
                        notes.push(currentNote);
                    }
                    // Start new note
                    currentNote = { title: title, contentBuffer: [], level: level };
                    currentContent = [];
                }
                else if (currentNote) {
                    // Demote subheaders by 1
                    var demotedHeader = line.replace(/^(#+)\s+/, function (match, hashes) {
                        return "#".repeat(Math.max(0, hashes.length - 1)) + " ";
                    });
                    currentContent.push(demotedHeader);
                }
            }
            else if (currentNote) {
                currentContent.push(line);
            }
        }
        // Push the last note
        if (currentNote) {
            currentNote.contentBuffer = currentContent;
            notes.push(currentNote);
        }
        return notes;
    };
    DungeonBuddy.prototype.ensureFolderExists = function (plugin, folderPath) {
        return __awaiter(this, void 0, void 0, function () {
            var parts, currentPath, _i, parts_1, part, folder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parts = folderPath.split("/");
                        currentPath = "";
                        _i = 0, parts_1 = parts;
                        _a.label = 1;
                    case 1:
                        if (!(_i < parts_1.length)) return [3 /*break*/, 4];
                        part = parts_1[_i];
                        currentPath = currentPath ? "".concat(currentPath, "/").concat(part) : part;
                        folder = plugin.app.vault.getAbstractFileByPath(currentPath);
                        if (!!folder) return [3 /*break*/, 3];
                        return [4 /*yield*/, plugin.app.vault.createFolder(currentPath)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Helper to create YAML front matter safely
    DungeonBuddy.prototype.createFrontMatter = function (metadata) {
        var lines = ["---"];
        for (var _i = 0, _a = Object.entries(metadata); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            // Quote strings with special characters or spaces
            if (typeof value === "string") {
                lines.push("".concat(key, ": ").concat(JSON.stringify(value)));
            }
            else {
                lines.push("".concat(key, ": ").concat(value));
            }
        }
        lines.push("---");
        return lines.join("\n");
    };
    DungeonBuddy.prototype.writeNotesToVault = function (plugin, notes, seriesName) {
        return __awaiter(this, void 0, void 0, function () {
            var failed, folderPath, folder, _i, notes_1, note, fileNameBase, finalFileName, counter, filePath, metainfo, headerBlock, file, encoder, buffer, currentBytes, maxBytes, _a, _b, line, lineBytes, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        failed = [];
                        folderPath = plugin.getFolderPath(seriesName);
                        folder = plugin.app.vault.getAbstractFileByPath(folderPath);
                        if (!!folder) return [3 /*break*/, 2];
                        return [4 /*yield*/, plugin.ensureFolderExists(plugin, folderPath)];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        _i = 0, notes_1 = notes;
                        _c.label = 3;
                    case 3:
                        if (!(_i < notes_1.length)) return [3 /*break*/, 16];
                        note = notes_1[_i];
                        fileNameBase = note.title.replace(/[\/\\?%*:|"<>]/g, "_");
                        finalFileName = "".concat(fileNameBase, ".md");
                        counter = 1;
                        // Handle duplicates
                        while (plugin.app.vault.getAbstractFileByPath("".concat(folderPath, "/").concat(finalFileName))) {
                            finalFileName = "".concat(fileNameBase, "_").concat(counter, ".md");
                            counter++;
                        }
                        filePath = "".concat(folderPath, "/").concat(finalFileName);
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 14, , 15]);
                        metainfo = { series: seriesName,
                            header_level: note.level,
                            title: note.title
                        };
                        headerBlock = this.createFrontMatter(metainfo);
                        // Create file with frontmatter
                        return [4 /*yield*/, plugin.app.vault.create(filePath, headerBlock)];
                    case 5:
                        // Create file with frontmatter
                        _c.sent();
                        file = plugin.app.vault.getAbstractFileByPath(filePath);
                        if (!file || !(file instanceof obsidian_1.TFile)) {
                            throw new Error("Failed to get TFile for path: ".concat(filePath));
                        }
                        encoder = new TextEncoder();
                        buffer = [];
                        currentBytes = 0;
                        maxBytes = 64000;
                        _a = 0, _b = note.contentBuffer;
                        _c.label = 6;
                    case 6:
                        if (!(_a < _b.length)) return [3 /*break*/, 10];
                        line = _b[_a];
                        lineBytes = encoder.encode(line + "\n").length;
                        if (!(currentBytes + lineBytes > maxBytes)) return [3 /*break*/, 8];
                        return [4 /*yield*/, plugin.app.vault.append(file, buffer.join("\n") + "\n")];
                    case 7:
                        _c.sent();
                        buffer = [];
                        currentBytes = 0;
                        _c.label = 8;
                    case 8:
                        buffer.push(line);
                        currentBytes += lineBytes;
                        _c.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 6];
                    case 10:
                        if (!(buffer.length > 0)) return [3 /*break*/, 12];
                        return [4 /*yield*/, plugin.app.vault.append(file, buffer.join("\n") + "\n")];
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12: return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 20); })];
                    case 13:
                        _c.sent();
                        return [3 /*break*/, 15];
                    case 14:
                        e_1 = _c.sent();
                        failed.push(note.title);
                        console.error("Failed to create note:", note.title, e_1);
                        return [3 /*break*/, 15];
                    case 15:
                        _i++;
                        return [3 /*break*/, 3];
                    case 16:
                        if (failed.length > 0) {
                            new obsidian_1.Notice("Failed to import ".concat(failed.length, " notes"));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return DungeonBuddy;
}(obsidian_1.Plugin));
exports.default = DungeonBuddy;
