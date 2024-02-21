"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationManager = void 0;
const path_1 = __importDefault(require("path"));
const defaultConfiguration = __importStar(require("../../service.config.json"));
const localConfiguration = __importStar(require("../../service.config.local.json"));
////////////////////////////////////////////////////////////////////////////////////////////////////////
class ConfigurationManager {
    static get BaseUrl() {
        return ConfigurationManager._config.BaseUrl;
    }
    static get SystemIdentifier() {
        return ConfigurationManager._config.SystemIdentifier;
    }
    static get Authentication() {
        return ConfigurationManager._config.Auth.Authentication;
    }
    static get Authorization() {
        return ConfigurationManager._config.Auth.Authorization;
    }
    static get MaxUploadFileSize() {
        return ConfigurationManager._config.MaxUploadFileSize;
    }
    static get Processor() {
        var _a;
        return (_a = ConfigurationManager._config) === null || _a === void 0 ? void 0 : _a.Processor;
    }
    static get Logger() {
        var _a;
        return (_a = ConfigurationManager._config) === null || _a === void 0 ? void 0 : _a.Logger;
    }
    static get UseHTTPLogging() {
        var _a;
        return (_a = ConfigurationManager._config) === null || _a === void 0 ? void 0 : _a.UseHTTPLogging;
    }
    static get JwtExpiresIn() {
        return ConfigurationManager._config.JwtExpiresIn;
    }
    static get FileStorageProvider() {
        return ConfigurationManager._config.FileStorage.Provider;
    }
    static get UploadTemporaryFolder() {
        var location = ConfigurationManager._config.TemporaryFolders.Upload;
        return path_1.default.join(process.cwd(), location);
    }
    static get DownloadTemporaryFolder() {
        var location = ConfigurationManager._config.TemporaryFolders.Download;
        return path_1.default.join(process.cwd(), location);
    }
    static get TemporaryFolderCleanupBefore() {
        return ConfigurationManager._config.TemporaryFolders.CleanupFolderBeforeMinutes;
    }
}
exports.ConfigurationManager = ConfigurationManager;
ConfigurationManager._config = null;
ConfigurationManager.loadConfigurations = () => {
    var _a;
    const configuration = process.env.NODE_ENV === 'local' ? localConfiguration : defaultConfiguration;
    ConfigurationManager._config = {
        SystemIdentifier: configuration.SystemIdentifier,
        BaseUrl: process.env.BASE_URL,
        Auth: {
            Authentication: configuration.Auth.Authentication,
            Authorization: configuration.Auth.Authorization,
        },
        Processor: {
            Provider: (_a = configuration.Processor) === null || _a === void 0 ? void 0 : _a.Provider,
        },
        FileStorage: {
            Provider: configuration.FileStorage.Provider,
        },
        TemporaryFolders: {
            Upload: configuration.TemporaryFolders.Upload,
            Download: configuration.TemporaryFolders.Download,
            CleanupFolderBeforeMinutes: configuration.TemporaryFolders.CleanupFolderBeforeMinutes,
        },
        MaxUploadFileSize: configuration.MaxUploadFileSize,
        JwtExpiresIn: configuration.JwtExpiresIn,
        Logger: configuration.Logger,
        UseHTTPLogging: configuration.UseHTTPLogging,
    };
};
ConfigurationManager.loadConfigurations();
