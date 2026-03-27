"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    const frontendUrl = config.get('FRONTEND_URL', 'http://localhost:3000');
    app.enableCors({
        origin: [
            frontendUrl,
            'https://interngo.uz',
            'https://www.interngo.uz',
            /\.vercel\.app$/,
            'http://localhost:3000',
        ],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('InternGo API')
        .setDescription('Backend API for InternGo — internship & scholarship platform')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = config.get('PORT', 8080);
    await app.listen(port, '0.0.0.0');
    console.log(`InternGo API running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map