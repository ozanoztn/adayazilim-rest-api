const { checkReservation } = require("../controller/controller");
const router = require("express").Router();

router.post("/rezarvasyonkontrol", checkReservation);

module.exports = router;
