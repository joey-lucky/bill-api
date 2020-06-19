const moment = require("moment");

console.log(moment().diff(moment(),"day"))
console.log(moment("2020-05-01").add(1,"day").diff(moment("2020-05-01"),"day"))