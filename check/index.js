var countdown = require('./../source/index')

countdown(
    ({at}) => console.log(`Ended at ${at}`),
    1e3,
    ({at, cycle}) => {
        console.log({cycle, at})
        if (cycle > 5) throw new Error("this is an error")
    },
    100
)
.onErr(({ error }) => console.log("ERRORX", error))
.run();