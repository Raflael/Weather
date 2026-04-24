"use strict";
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
var express_1 = require("express");
var axios_1 = require("axios");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = parseInt(process.env.PORT || "3000", 10);
var API_KEY = process.env.API_KEY || "";
// Servir arquivos estáticos da pasta views
app.use(express_1.default.static(path_1.default.join(__dirname, "../views")));
app.use(express_1.default.json());
// Rota principal – serve o frontend
app.get("/", function (_req, res) {
    res.sendFile(path_1.default.join(__dirname, "../views/index.html"));
});
// Rota da API de clima
app.get("/api/weather", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var city, url, response, data, weather, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                city = req.query.city;
                // Validação: cidade não pode ser vazia
                if (!city || city.trim() === "") {
                    res.status(400).json({ error: "Por favor, informe o nome de uma cidade." });
                    return [2 /*return*/];
                }
                // Validação: API Key configurada
                if (!API_KEY) {
                    res.status(500).json({ error: "API Key não configurada no servidor." });
                    return [2 /*return*/];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                url = "https://api.openweathermap.org/data/2.5/weather";
                return [4 /*yield*/, axios_1.default.get(url, {
                        params: {
                            q: city.trim(),
                            appid: API_KEY,
                            units: "metric",
                            lang: "pt_br",
                        },
                    })];
            case 2:
                response = _c.sent();
                data = response.data;
                weather = {
                    city: data.name,
                    country: data.sys.country,
                    temp: Math.round(data.main.temp),
                    feels_like: Math.round(data.main.feels_like),
                    humidity: data.main.humidity,
                    description: data.weather[0].description,
                    icon: "https://openweathermap.org/img/wn/".concat(data.weather[0].icon, "@2x.png"),
                };
                res.json(weather);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                if (axios_1.default.isAxiosError(error_1)) {
                    if (((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                        res.status(404).json({ error: "Cidade não encontrada. Verifique o nome e tente novamente." });
                    }
                    else if (((_b = error_1.response) === null || _b === void 0 ? void 0 : _b.status) === 401) {
                        res.status(401).json({ error: "API Key inválida. Verifique suas configurações." });
                    }
                    else {
                        res.status(500).json({ error: "Erro ao consultar a API de clima. Tente novamente." });
                    }
                }
                else {
                    res.status(500).json({ error: "Erro interno no servidor." });
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Inicialização do servidor
app.listen(PORT, function () {
    console.log("\u2705 Servidor rodando em http://localhost:".concat(PORT));
});
