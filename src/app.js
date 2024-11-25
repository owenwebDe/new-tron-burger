"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var path_1 = require("path");
var index_1 = require("./routes/index");
var referral_1 = require("./routes/referral");
var app = (0, express_1.default)();
var PORT = 3000;
// Connect to MongoDB
mongoose_1.default.connect("mongodb://localhost:27017/turger-game");
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/", index_1.default);
app.use("/referral", referral_1.default);
app.listen(PORT, function () {
    return console.log("Server running on http://localhost:".concat(PORT));
});
