"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "3000", 10);
const API_KEY = process.env.API_KEY || "";
// Servir arquivos estáticos da pasta views
app.use(express_1.default.static(path_1.default.join(__dirname, "../views")));
app.use(express_1.default.json());
// Rota principal – serve o frontend
app.get("/", (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../views/index.html"));
});
// Rota da API de clima
app.get("/api/weather", async (req, res) => {
    const city = req.query.city;
    // Validação: cidade não pode ser vazia
    if (!city || city.trim() === "") {
        res.status(400).json({ error: "Por favor, informe o nome de uma cidade." });
        return;
    }
    // Validação: API Key configurada
    if (!API_KEY) {
        res.status(500).json({ error: "API Key não configurada no servidor." });
        return;
    }
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather`;
        const response = await axios_1.default.get(url, {
            params: {
                q: city.trim(),
                appid: API_KEY,
                units: "metric",
                lang: "pt_br",
            },
        });
        const data = response.data;
        const weather = {
            city: data.name,
            country: data.sys.country,
            temp: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            description: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        };
        res.json(weather);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response?.status === 404) {
                res.status(404).json({ error: "Cidade não encontrada. Verifique o nome e tente novamente." });
            }
            else if (error.response?.status === 401) {
                res.status(401).json({ error: "API Key inválida. Verifique suas configurações." });
            }
            else {
                res.status(500).json({ error: "Erro ao consultar a API de clima. Tente novamente." });
            }
        }
        else {
            res.status(500).json({ error: "Erro interno no servidor." });
        }
    }
});
// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
