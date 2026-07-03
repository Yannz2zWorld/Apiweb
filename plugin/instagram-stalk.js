const axios = require("axios");

/**
 * Instagram Stalk
 * Sumber: global.btc (api.botcahx.eu.org) + global.btcApikey
 * Ganti nilai di bawah sesuai settings.js kamu jika berubah.
 */

const SOURCE_API = "https://api.botcahx.eu.org";
const SOURCE_APIKEY = "YannzSuperior";

module.exports = {
  name: "Instagram Stalk",
  desc: "Cek profil Instagram (followers, following, bio, dll) berdasarkan username.",
  category: "Tools",
  path: "/api/stalk/instagram?apikey=&username=",
  async run(req, res) {
    const { username, apikey } = req.query;

    if (!apikey || !global.apikey.includes(apikey)) {
      return res.status(401).json({ status: false, error: "Apikey invalid atau tidak terdaftar" });
    }
    if (!username) {
      return res.status(400).json({ status: false, error: "Parameter 'username' wajib diisi" });
    }

    try {
      const { data } = await axios.get(`${SOURCE_API}/api/stalk/ig`, {
        params: { username, apikey: SOURCE_APIKEY },
        timeout: 60000,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      if (!data.status || !data.result) {
        return res.status(404).json({ status: false, error: "Username tidak ditemukan atau terjadi kesalahan" });
      }

      return res.status(200).json({ status: true, result: data.result });
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message || String(error) });
    }
  }
};
