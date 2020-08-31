const express = require("express");
const bodyParser = require("body-parser");
const bunyan = require("bunyan-sfdx-no-dtrace");
const {
    join: joinPaths
} = require("path");
const {
    OpenApiValidator: OpenApiValidator
} = require("express-openapi-validator");
const passport = require("passport");
const {
    BasicStrategy: BasicStrategy
} = require("passport-http");
const log = bunyan.createLogger({
    name: "pupils-api",
    serializers: bunyan.stdSerializers
});
class Database extends Map {
    set(e, a) {
        if (typeof a === "string") {
            a = a.substr(0, 16)
        }
        return super.set(e, a)
    }
}
var db = new Database;

function populate() {
    var e = [
        {
          pupilId: "1420886",
          firstName: "Mcteam",
          infix: null,
          lastName: "Test1",
          classId: 88033,
          gradeId: 8,
          email: null,
          isDisabled: false
        },
        {
          pupilId: "1420887",
          firstName: "Newmcuser",
          infix: "NewMCUser",
          lastName: "Nu",
          classId: 88034,
          gradeId: 8,
          email: null,
          isDisabled: false
        },
        {
          pupilId: "1420888",
          firstName: "Zerdarovic",
          infix: null,
          lastName: "Biyikovskiy",
          classId: 88034,
          gradeId: 8,
          email: null,
          isDisabled: false
        },
        {
          pupilId: "1420889",
          firstName: "Mcteam",
          infix: null,
          lastName: "Test",
          classId: 88035,
          gradeId: 6,
          email: null,
          isDisabled: false
        },
        {
          pupilId: "1420886",
          firstName: "Ewout1",
          infix: null,
          lastName: "Ewouttest",
          classId: 88036,
          gradeId: 7,
          email: null,
          isDisabled: false
        },
        {
          pupilId: "1420896",
          firstName: "Warren",
          infix: null,
          lastName: "Barguil",
          classId: 88041,
          gradeId: 5,
          email: null,
          isDisabled: false
        },
        {
          pupilId: "1420897",
          firstName: "Lillian",
          infix: null,
          lastName: "Calmejean",
          classId: 88041,
          gradeId: 5,
          email: null,
          isDisabled: false
        },
        {
          pupilId: "1420893",
          firstName: "Wim",
          infix: null,
          lastName: "van der Horst",
          classId: 88042,
          gradeId: 4,
          email: null,
          isDisabled: false
        },
        {
          pupilId: "1420894",
          firstName: "Willen",
          infix: null,
          lastName: "Wever",
          classId: 88042,
          gradeId: 4,
          email: null,
          isDisabled: false
        }
      ];
    for (const a of e) {
        db.set(a.pupilId, a)
    }
}
populate();
const users = new Map;
users.set("testCandidate", {
    password: "P@ssw0rd",
    role: "admin"
});
const generateId = () => Math.floor((Math.random() * 899999) + 100000).toString();
const makeError = (e, a) => {
    const t = new Error(a);
    t.status = e;
    return t
};
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use((e, a, t) => {
    log.info({
        req: e
    });
    t()
});
new OpenApiValidator({
    apiSpec: joinPaths(__dirname, "api.yml"),
    validateRequests: false
}).install(app);
passport.use(new BasicStrategy((e, a, t) => {
    const s = users.get(e);
    const r = s && s.password === a ? s : false;
    return t(null, r)
}));
app.get("/pupils", (e, a) => {
    const t = Array.from(db.values());
    a.status(200).json(t.slice(1, t.length))
});
app.get("/pupils/:id", (e, a, t) => {
    const {
        id: s
    } = e.params;
    const r = db.get(s);
    if (!r) {
        return t(makeError(504, `Pupil with ID: "${s}" not found`))
    }
    a.status(200).json(r)
});
app.post("/pupils",
 passport.authenticate("basic", {
    session: false
}), 
(e, a, t) => {
    const s = e.body;
    if (s.pupilId) {
        return t(makeError(400, "Cannot set an ID when creating a pupil"))
    }
    Object.assign(s, {
        pupilId: generateId()
    });
    db.set(s.pupilId, s);
    a.set("Location", `/pupils/${s.pupilId}`);
    a.status(201).json(s)
});
app.delete("/pupils/:id",  passport.authenticate("basic", {
    session: false
}),(e, a, t) => {
    const {
        id: s
    } = e.params;
    db.delete(s);
    a.sendStatus(204)
});
app.use((e, a, t, s) => {
    log.warn({
        err: e
    });
    t.status(e.status || 500).json({
        status: e.status,
        massage: e.message
    })
});
const port = 3e3;
app.listen(port, () => {
    log.info(`Pupils API now running on ${port}`)
}).on("error", e => {
    if (e.code === "EADDRINUSE") {
        log.error(`Cannot start server. Something is already running on port http://localhost:${port}`);
        process.exit(1)
    } else {
        log.error({
            err: e
        }, "Cannot start server. :(")
    }
});