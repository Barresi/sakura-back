const fs = require('fs');
const path = require('path');

// Функция для замены меток в шаблоне на соответствующие значения
function replaceTemplateTags(template, entityName, apiPath){
  return template
    .replace(/{{ENTITY_NAME}}/g, entityName)
    .replace(/{{API_PATH}}/g, apiPath);
}

// Функция для создания нового файла с заменёнными значениями
function createFileFromTemplate(templatePath, outputPath, entityName, apiPath){
  const template = fs.readFileSync(templatePath, 'utf-8');
  const content = replaceTemplateTags(template, entityName, apiPath);

  // Убедиться, что директория для выходного файла существует
  const outputDir = path.dirname(outputPath);
  if(!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, {recursive:true});
  }

  fs.writeFileSync(outputPath, content);
}

const entityName = process.argv[2];
if(!entityName){
  console.error('Не указано имя сущности.');
  process.exit(1);
}

const apiPath = 'source/api/v1/';

if (!/^[a-zA-Z0-9_]+$/.test(entityName)){
  console.error('Имя сущности может содержать только буквы, цифры и символы подчёркивания.');
  process.exit(1);
}

const scriptDir = __dirname;
const entityDir = path.join(scriptDir, apiPath, entityName);

if (!fs.existsSync(entityDir)){
  fs.mkdirSync(entityDir, {recursive: true});
}

const files = ['controller', 'router', 'swagger'];
files.forEach(file => {
  const filePath = path.join(entityDir,`${entityName}.${file}.ts`);
  fs.writeFileSync(filePath, '');
  createFileFromTemplate(filePath, filePath, entityName, apiPath+entityName);

  if(file === 'router') {
    const codeRouterAdd =
      `import { Router } from 'express';
import {} from './${entityName}.controller';

const ${entityName} = Router();

export default ${entityName};`;

    fs.writeFileSync(filePath, codeRouterAdd, 'utf-8');
  }
});

const v1RouterPath = path.join(scriptDir, apiPath, 'v1.router.ts');
// Загружаем содержимое файла после создания каждого файла entityName.router.ts
let v1RouterContent = '';
if (fs.existsSync(v1RouterPath)) {
  v1RouterContent = fs.readFileSync(v1RouterPath, 'utf-8');
}

const importStatement = `import ${entityName} from './${entityName}/${entityName}.router';`;
if (v1RouterContent.includes(importStatement)) {
  console.log(`Импорт для сущности ${entityName} уже существует в файле v1.router.ts.`);
} else {
  v1RouterContent = v1RouterContent.replace(/(import swaggerDef from '.\/swaggerDef';)/, `${importStatement}\n$1`);
  fs.writeFileSync(v1RouterPath, v1RouterContent, 'utf-8');
  console.log(`Импорт для сущности ${entityName} успешно добавлен в файл v1.router.ts.`);
}

const entityStatement = `v1.use('/${entityName}', ${entityName});`;

if (v1RouterContent.includes(entityStatement)) {
  console.log(`Маршрут для сущности ${entityName} уже существует в файле v1.router.ts.`);
} else {
  // Look for the line containing v1.get('/api-docs', swaggerUi.setup(swaggerDef));
  // and add the entityStatement just before it
  v1RouterContent = v1RouterContent.replace(
    /(v1.get\('\/api-docs', swaggerUi.setup\(swaggerDef\)\);)/,
    `${entityStatement}\n$1`
  );

  fs.writeFileSync(v1RouterPath, v1RouterContent, 'utf-8');
  console.log(`Маршрут для сущности ${entityName} успешно добавлен в файл v1.router.ts.`);
}

console.log('Файлы успешно созданы и заполнены.');
