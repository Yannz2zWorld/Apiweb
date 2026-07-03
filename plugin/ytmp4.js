const axios = require("axios");

/**
 * YouTube Video Downloader (MP4)
 * Sumber: api.covenant.sbs (butuh x-api-key)
 * Mengembalikan link download langsung (tidak stream/kirim file),
 * biar konsumen API (bot/aplikasi lain) yang menentukan cara pakainya.
 */

const COV_API_KEY = "cov_live_4952f36ac5a68c15567e74a3d8816266b8829fed8c7f7eb3";

module.exports = {
  name: "YouTube MP4",
  desc: "Download video YouTube dalam format MP4.",
  category: "Downloader",
  path: "/api/download/ytmp4?apikey=&url=&quality=",
  async run(req, res) {
    const { url, apikey, quality } = req.query;

    if (!apikey || !global.apikey.includes(apikey)) {
      return res.status(401).json({ status: false, error: "Apikey invalid atau tidak terdaftar" });
    }
    if (!url) {
      return res.status(400).json({ status: false, error: "Parameter 'url' wajib diisi" });
    }
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      return res.status(400).json({ status: false, error: "Link YouTube tidak valid" });
    }

    try {
      const apiUrl = `https://api.covenant.sbs/api/downloader/youtube?url=${encodeURIComponent(url)}&quality=${encodeURIComponent(quality || "360")}&audio_only=false`;

      const response = await axios.get(apiUrl, {
        timeout: 180000,
        headers: { "x-api-key": COV_API_KEY }
      });

      const data = response.data;

      if (!data.status || !data.data || !data.data.download_url) {
        return res.status(404).json({ status: false, error: "Gagal mengambil data video" });
      }

      const result = data.data;

      return res.status(200).json({
        status: true,
        result: {
          title: result.title || "-",
          channel: result.channel || "-",
          duration: result.duration || null,
          quality: result.quality || quality || "360",
          downloadUrl: result.download_url
        }
      });
    } catch (error) {
      let errorMsg = error.message || "Gagal mengambil video";
      if (error.code === "ECONNABORTED") errorMsg = "Timeout, coba lagi nanti";
      else if (error.response?.status === 401) errorMsg = "API key tidak valid";
      else if (error.response?.status === 429) errorMsg = "Terlalu banyak request, coba lagi nanti";

      return res.status(500).json({ status: false, error: errorMsg });
    }
  }
};
