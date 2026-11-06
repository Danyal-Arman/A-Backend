import { Queue } from "bullmq";
import Redis from "ioredis";

const connection=new Redis("redis://redis:6379",{
    maxRetriesPerRequest:null
})

const emailQueue=new Queue("emailQueue",{connection})

export default emailQueue