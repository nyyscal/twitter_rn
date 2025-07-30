import arctjet, {tokenBucket, shield, detectBot} from "@arcjet/node"
import {ENV} from "./env.js"
import arcjet from "@arcjet/node"

export const aj = arcjet({
  key: ENV.ARCJET_KEY,
  characteristics:["ip.src"],
  rules:[
    //shield protects your app from common attacks eg: SQL injecton, XSS, CSRF attacks
    shield({mode:"LIVE"}),

    //bot detection - block all bots except searhc engines
    detectBot({
      mode:"LIVE",
      allow:[
        "CATEGORY:SEARCH_ENGINE"
      ]
    }),
    //rate limiting with token bucket algo
    tokenBucket({
      mode:"LIVE",
      refillRate:10, // tokens added per intervals
      interval:10, // interval in seconds
      capacity:15, //max token in bucket
    })
]
})