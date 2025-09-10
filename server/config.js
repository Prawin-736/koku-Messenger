import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({ path: path.resolve(__dirname, envFile) });

console.log(`Loaded environment: ${process.env.NODE_ENV || 'development'} from ${envFile}`);
console.log("checking aws region 1 : "+process.env.AWS_REGION);


export const config = {
    env: process.env.NODE_ENV || 'development',
    port:process.env.PORT,
    jwt: {
        secretKey: process.env.JWT_SECRETKEY
    },

    aws: {
        bucketName: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_REGION,
        accessKey: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },

    mongodb: {
        dbUrl: process.env.DB_URL,
        dbName: process.env.DB_NAME
    }
};
