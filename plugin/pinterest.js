const axios = require("axios");

/**
 * Pinterest Search
 * Proxy ke docs-alip.clutch.web.id (global.apialip)
 */

const ALIP_API = "https://docs-alip.clutch.web.id";
const ALIP_APIKEY = "alipaiapikeybaru";

module.exports = {
  name: "Pinterest Search",
  desc: "Cari gambar di Pinterest berdasarkan kata kunci.",
  category: "Search",
  path: "/api/search/pinterest?apikey=&query=",
  async run(req, res) {
    const { query, apikey } = req.query;

    if (!apikey || !global.apikey.includes(apikey)) {
      return res.status(401).json({ status: false, error: "Apikey invalid atau tidak terdaftar" });
    }
    if (!query) {
      return res.status(400).json({ status: false, error: "Parameter 'query' wajib diisi" });
    }

    try {
      const { data } = await axios.get(`${ALIP_API}/search/pinterest`, {
        params: { apikey: ALIP_APIKEY, q: query },
        timeout: 60000,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      let results = (data.result || []).filter(v => typeof v === "string" && v.startsWith("http"));
      results = [...new Set(results)];

      if (results.length === 0) {
        return res.status(404).json({ status: false, error: "Tidak ditemukan hasil" });
      }

      return res.status(200).json({ status: true, result: results });
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message || String(error) });
    }
  }
};
