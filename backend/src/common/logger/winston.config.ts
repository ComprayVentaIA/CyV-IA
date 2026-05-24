import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export function createWinstonLogger(context: string): winston.LoggerOptions {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    level: isProduction ? 'info' : 'debug',
    transports: [
      new winston.transports.Console({
        format: isProduction
          ? winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              winston.format.json(),
            )
          : winston.format.combine(
              winston.format.timestamp({ format: 'HH:mm:ss' }),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike(context, {
                colors: true,
                prettyPrint: true,
              }),
            ),
      }),
    ],
  };
}
