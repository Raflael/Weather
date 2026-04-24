import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);
const API_KEY: string = process.env.API_KEY || "";

// Servir arquivos estáticos da pasta views
app.use(express.static(path.join(__dirname, "../views")));
app.use(express.json());

// Tipagem da resposta da OpenWeatherMap
interface WeatherResponse {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

// Tipagem do dado formatado retornado ao frontend
interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
}

// Rota principal – serve o frontend
app.get("/", (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

// Rota da API de clima
app.get("/api/weather", async (req: Request, res: Response): Promise<void> => {
  const city = req.query.city as string;

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
    const response = await axios.get<WeatherResponse>(url, {
      params: {
        q: city.trim(),
        appid: API_KEY,
        units: "metric",
        lang: "pt_br",
      },
    });

    const data = response.data;

    const weather: WeatherData = {
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    };

    res.json(weather);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        res.status(404).json({ error: "Cidade não encontrada. Verifique o nome e tente novamente." });
      } else if (error.response?.status === 401) {
        res.status(401).json({ error: "API Key inválida. Verifique suas configurações." });
      } else {
        res.status(500).json({ error: "Erro ao consultar a API de clima. Tente novamente." });
      }
    } else {
      res.status(500).json({ error: "Erro interno no servidor." });
    }
  }
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});