"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs = require("fs");
const path = require("path");
const s3flags_1 = require("s3flags");
const ASSETS_DIR = path.resolve(__dirname, "assets");
s3flags_1.S3Flags.prototype.ui = function (userTracker) {
    const assetsHandler = express.static(ASSETS_DIR, { index: false });
    return (req, res, next) => {
        let user;
        try {
            user = userTracker(req);
        }
        catch (err) {
            return res.sendStatus(401);
        }
        if (req.method === "GET" && req.path === "/api/config") {
            res.json(this.config);
        }
        else if (req.method === "GET" && req.path === "/api/user") {
            res.json(user);
        }
        else if (req.method === "GET" && req.path === "/api/flags") {
            _list(this, req, res, next);
        }
        else if (req.method === "GET" && req.path.match(/^\/api\/flags\/[^/]+$/)) {
            _get(this, req, res, next);
        }
        else if (req.method === "POST" && req.path === "/api/flags") {
            _create(this, user, req, res, next);
        }
        else if (req.method === "PUT" && req.path.match(/^\/api\/flags\/[^/]+$/)) {
            _update(this, user, req, res, next);
        }
        else if (req.method === "DELETE" && req.path.match(/^\/api\/flags\/[^/]+$/)) {
            _delete(this, user, req, res, next);
        }
        else if (req.method === "GET") {
            assetsHandler(req, res, () => _sendIndexHtml(req, res, next));
        }
        else {
            res.sendStatus(404);
        }
    };
};
function _list(s3flags, req, res, next) {
    const bypassCache = req.query.bypassCache;
    Promise.resolve(s3flags.all({ bypassCache }))
        .then(flags => {
        const flagsArray = Object.keys(flags)
            .map(name => Object.assign({ name }, flags[name]));
        res.send(flagsArray);
    })
        .catch(next);
}
function _get(s3flags, req, res, next) {
    const name = decodeURIComponent(req.path.slice("/api/flags/".length));
    const info = s3flags.get(name, { info: true });
    if (info) {
        res.send(Object.assign({ name }, info));
    }
    else {
        res.status(404).send({ message: "Not Found" });
    }
}
// TODO: validate request body
function _create(s3flags, user, req, res, next) {
    s3flags.create(req.body.name, req.body, user)
        .then(() => res.status(202).send({ message: "Accepted" }))
        .catch(next);
}
// TODO: validate request body
function _update(s3flags, user, req, res, next) {
    const name = decodeURIComponent(req.path.slice("/api/flags/".length));
    s3flags.update(name, req.body, user)
        .then(() => res.status(202).send({ message: "Accepted" }))
        .catch(next);
}
function _delete(s3flags, user, req, res, next) {
    const name = decodeURIComponent(req.path.slice("/api/flags/".length));
    if (req.query.permanent === "true") {
        s3flags.delete(name, { permanent: true })
            .then(() => res.status(202).send({ message: "Accepted" }))
            .catch(next);
    }
    else {
        s3flags.delete(name, user)
            .then(() => res.status(202).send({ message: "Accepted" }))
            .catch(next);
    }
}
let _indexHtml;
function _sendIndexHtml(req, res, next) {
    Promise.resolve(_indexHtml)
        .then(html => {
        if (!html) {
            return new Promise((resolve, reject) => {
                fs.readFile(path.resolve(ASSETS_DIR, "index.html"), { encoding: "utf8" }, function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        // _indexHtml = data;
                        resolve(data);
                    }
                });
            });
        }
        else {
            return html;
        }
    })
        .then(html => {
        return html.replace("{{baseUrl}}", req.baseUrl + "/");
    })
        .then(html => {
        res.send(html);
    })
        .catch(next);
}
