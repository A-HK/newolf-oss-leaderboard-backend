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
    l1: 10,
    level2: 25,
    level3: 45
};
let leaderboard = {

}

let timestamp;

const octokit = new Octokit({ auth: `${process.env.TOKEN}` });



const projects = [

    "Test-Tech-Matrix/Test-Repo-1",
    "Test-Tech-Matrix/Test-Repo-2"
];



function updateleaderboard() {
    leaderboard = {};
    timestamp = new Date().toLocaleString();
    console.log("running");

/*

/search/issues?q=is:pr+repo:Test-Tech-Matrix/Test-Repo-2
/search/issues?q=is:pr+repo:Test-Tech-Matrix/Test-Repo-2

/issues?q=repo:Test-Tech-Matrix/Test-Repo-2+is:merged

/repos/{owner}/{repo}/pulls?state=closed", {
  owner: "Test-Tech-Matrix",
  repo: "Test-Repo-2",
}

octokit
  .paginate("GET /search/issues?q=is:pr+repo:Test-Tech-Matrix/Test-Repo-2", {
    owner: "Test-Tech-Matrix",
    repo: "Test-Repo-2",
  })
  .then((data) => {

await octokit.request('GET /search/code', {
  q: 'q'
})
*/
//const q="is:pr+repo:`${projects[m]}`";

let score=0;
//    for (let m = 0; m < projects.length; m++) {
      //console.log("hell");
      let scores = {
          level0: 5,
          l1: 10,
          level2: 25,
          level3: 45
      };
    //  console.log(m);
      octokit.request('GET /search/issues', {
        q: 'is:pr+org:Test-Tech-Matrix+is:merged'
      })
        .then((res) => {
        //  console.log(data);
        console.log(res.data.items);
          console.log("then");
        //  console.log(data.items);
          //console.log(`Your token is ${process.env.TOKEN}`);
            if (res.data.items !== undefined) {
               //console.log("hell"); no return
               console.log("Does this work?");
               console.log(res.data.items.length);
                if (res.data.items.length !== 0) {
                    let prs = res.data.items;
                    console.log(res);
                    console.log("hello from the inside!!");
                    console.log(prs.length);
                    for (let i = 0; i < prs.length; i++) {
                      console.log("hello from the inside number 2");
                        for (let j = 0; j < prs[i].labels.length; j++) {
                          console.log("hello from the inside number 3");
                            if (prs[i].labels[j].name.toLowerCase() === "level0" || prs[i].labels[j].name.toLowerCase() === "l1" || prs[i].labels[j].name.toLowerCase() === "level2" || prs[i].labels[j].name.toLowerCase() === "level3") {
                              console.log("hello from the inside number 4");
                                if (leaderboard[prs[i].user.login] === undefined) {
                                    leaderboard[prs[i].user.login] = {
                                        login: prs[i].user.login,
                                        id: prs[i].user.id,
                                        avatar_url: prs[i].user.avatar_url,
                                        profile_url: prs[i].user.html_url,
                                        pr_count: 1,
                                        level0: 0,
                                        l1: 0,
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
                                console.log("url"+prs[i].html_url);
                                console.log(leaderboard[prs[i].user.login].pr_links);
                                //console.log();
                                console.log(leaderboard[prs[i].user.login]);
                                //console.log(scores.level0);
                               console.log(prs[i].labels[j].name.toLowerCase());
                            //  console.log(leaderboard[prs[i].user.login][scores.level0]);
                                if (prs[i].labels[j].name.toLowerCase() === "level0") {
                                    //console.log(leaderboard[prs[i].user.login].level0);
                                    leaderboard[prs[i].user.login].level0+= 1;
                                    //console.log(leaderboard[prs[i].user.login].level0);
                                } else if (prs[i].labels[j].name.toLowerCase() === "l1") {
                                    leaderboard[prs[i].user.login].l1 += 1
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
//      }
    }
/*octokit.request("GET /repos/:owner/:repo" , {// /search/issues?q=is:pr+label:newoss+is:merged
  owner: "Test-Tech-Matrix",
  repo: `${projects[m]}`
})
//q=label:newoss+is:merged;
//}///search?q=type:pr+author:${contributor}+is:merged
//octokit.rest.search.issuesAndPullRequests({
  //q,
//});
.then(
data => {
  console.log(data);
  //console.log(`Your token is ${process.env.TOKEN}`);
    if (data.items !== undefined) {
       //console.log("hell"); no return
        if (data.items.length !== 0) {
            let prs = data.items;
            console.log(data.items);
            console.log("hello");
            for (let i = 0; i < prs.length; i++) {
                for (let j = 0; j < prs[i].labels.length; j++) {
                    if (prs[i].labels[j].name.toLowerCase() === "level0" || prs[i].labels[j].name.toLowerCase() === "l1" || prs[i].labels[j].name.toLowerCase() === "level2" || prs[i].labels[j].name.toLowerCase() === "level3") {
                        if (leaderboard[prs[i].user.login] === undefined) {
                            leaderboard[prs[i].user.login] = {
                                login: prs[i].user.login,
                                id: prs[i].user.id,
                                avatar_url: prs[i].user.avatar_url,
                                profile_url: prs[i].user.html_url,
                                pr_count: 1,
                                level0: 0,
                                l1: 0,
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
                            leaderboard[prs[i].user.login][level0] += 1
                        } else if (prs[i].labels[j].name.toLowerCase() === "l1") {
                            leaderboard[prs[i].user.login][l1] += 1
                        } else if (prs[i].labels[j].name.toLowerCase() === "level2") {
                            leaderboard[prs[i].user.login][level2] += 1
                        } else if (prs[i].labels[j].name.toLowerCase() === "level3") {
                            leaderboard[prs[i].user.login][level3] += 1
                        }
                    }
                }
            }
        }
    }
})

}

}

let scores = {
    level0: 5,
    l1: 10,
    level2: 25,
    level3: 45
};
let leaderboard = {

}

let timestamp;

function updateleaderboard() {
    leaderboard = {1: "A-HK"};
    timestamp = new Date().toLocaleString();
    console.log("running");

    for (let m = 0; m < projects.length; m++) {
        fetch(`'Authorization: token ${process.env.TOKEN}' https://api.github.com/search/issues?q=repo:${projects[m]}+is:merged`).then(response => response.json())
            .then(data => {
              console.log(data);
              //console.log(`Your token is ${process.env.TOKEN}`);
                if (data.items !== undefined) {
                   //console.log("hell"); no return
                    if (data.items.length !== 0) {
                        let prs = data.items;
                        console.log(data.items);
                        console.log("hello");
                        for (let i = 0; i < prs.length; i++) {
                            for (let j = 0; j < prs[i].labels.length; j++) {
                                if (prs[i].labels[j].name.toLowerCase() === "level0" || prs[i].labels[j].name.toLowerCase() === "l1" || prs[i].labels[j].name.toLowerCase() === "level2" || prs[i].labels[j].name.toLowerCase() === "level3") {
                                    if (leaderboard[prs[i].user.login] === undefined) {
                                        leaderboard[prs[i].user.login] = {
                                            login: prs[i].user.login,
                                            id: prs[i].user.id,
                                            avatar_url: prs[i].user.avatar_url,
                                            profile_url: prs[i].user.html_url,
                                            pr_count: 1,
                                            level0: 0,
                                            l1: 0,
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
                                        leaderboard[prs[i].user.login][level0] += 1
                                    } else if (prs[i].labels[j].name.toLowerCase() === "l1") {
                                        leaderboard[prs[i].user.login][l1] += 1
                                    } else if (prs[i].labels[j].name.toLowerCase() === "level2") {
                                        leaderboard[prs[i].user.login][level2] += 1
                                    } else if (prs[i].labels[j].name.toLowerCase() === "level3") {
                                        leaderboard[prs[i].user.login][level3] += 1
                                    }
                                }
                            }
                        }
                    }
                }
            })
    }
}*/

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
