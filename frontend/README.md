# PerfilTurista-EngSoft

**Pré-requisitos**

Antes de executar o projeto, é necessário ter instalado: \
● Node.js versão 20 ou superior - https://nodejs.org

Para o _Windows_: \
powershell -c "irm bun.sh/install.ps1 | iex"

Para o _Linux_: \
sudo apt update \
sudo apt install nodejs npm 

Verifique a instalação: \
node -v \
npm -v 

**Instalar as dependências**

Após baixar e descompactar o projeto, abra o terminal dentro da pasta do projeto. \
Depois, execute no _Windows_: \
bun install \
Esse comando instala as dependências necessárias do projeto. 

Se estiver no _Linux_, como o projeto contém dependências geradas no Windows, é necessário remover os arquivos de dependências antes da instalação:

rm -rf node_modules \
rm package-lock.json \
npm install 

**Rodar o projeto**

Ainda no terminal, dentro da pasta do projeto, execute no _Windows_: \
bun run dev 

Se no _Linux_: \
npm run dev 

O terminal irá mostrar um endereço local, por exemplo: \
http://localhost:8080 

Abra esse endereço no navegador para visualizar o site.
