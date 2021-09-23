const fetch = require("node-fetch");
const express = require("express");
const schedule = require('node-schedule');
var cors = require('cors')
const { Octokit } = require("@octokit/rest");

const app = express();
app.use(cors());

require('dotenv').config();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("ready on port 3000");
})

let scores = {
    level0: 5,
    level1: 10,
    level2: 25,
    level3: 45
};
let leaderboard = {

}

let timestamp;

const octokit = new Octokit({ auth: `${process.env.TOKEN}` });

/*

const projects = [

    "Test-Tech-Matrix/Test-Repo-1",
    "Test-Tech-Matrix/Test-Repo-2"
];
*/


function updateleaderboard() {
    leaderboard = {};
    timestamp = new Date().toLocaleString();
    console.log("running");


let score=0;

      let scores = {
          level0: 5,
          level1: 10,
          level2: 25,
          level3: 45
      };

      octokit.request('GET /search/issues', {
        q: 'is:pr+org:Tech-Matrix+is:merged'
      })
        .then((res) => {

            if (res.data.items !== undefined) {
                if (res.data.items.length !== 0) {
                    let prs = res.data.items;
                    for (let i = 0; i < prs.length; i++) {
                        for (let j = 0; j < prs[i].labels.length; j++) {
                            if (prs[i].labels[j].name.toLowerCase() === "level0" || prs[i].labels[j].name.toLowerCase() === "level1" || prs[i].labels[j].name.toLowerCase() === "level2" || prs[i].labels[j].name.toLowerCase() === "level3") {
                                if (leaderboard[prs[i].user.login] === undefined) {
                                    leaderboard[prs[i].user.login] = {
                                        login: prs[i].user.login,
                                        id: prs[i].user.id,
                                        avatar_url: prs[i].user.avatar_url,
                                        profile_url: prs[i].user.html_url,
                                        pr_count: 1,
                                        level0: 0,
                                        level1: 0,
                                        level2: 0,
                                        level3: 0,
                                        pr_links: [],
                                        score: scores[prs[i].labels[j].name.toLowerCase()]
                                    }
                                } else {
                                    leaderboard[prs[i].user.login].score = leaderboard[prs[i].user.login].score + scores[prs[i].labels[j].name.toLowerCase()],
                                        leaderboard[prs[i].user.login].pr_count += 1
                                }
                                leaderboard[prs[i].user.login].pr_links.push(prs[i].html_url);
                                if (prs[i].labels[j].name.toLowerCase() === "level0") {
                                    leaderboard[prs[i].user.login].level0+= 1;
                                } else if (prs[i].labels[j].name.toLowerCase() === "level1") {
                                    leaderboard[prs[i].user.login].level1 += 1
                                } else if (prs[i].labels[j].name.toLowerCase() === "level2") {
                                   leaderboard[prs[i].user.login].level2 += 1
                               }  else if (prs[i].labels[j].name.toLowerCase() === "level3") {
                                    leaderboard[prs[i].user.login].level3 += 1
                                }
                            }
                        }
                    }
                }
            }

        });
    }


updateleaderboard();

const job = schedule.scheduleJob('*///10 * * * *', async function (fireDate) {
   updateleaderboard();
});

app.get('/', (req, res) => {
    res.json(
        {
            status: true,
            last_updated: timestamp,
            leaderboard: Object.values(leaderboard).sort(function (a, b) { return b.score - a.score })
        }

    )
});
