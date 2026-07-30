# -AWS-Developer-

Projeto para estudos e exercícios relativos ao conteúdo de desenvolvimento e preparação para certificações AWS. Contém páginas estáticas (HTML/CSS/JS), exemplos, quizzes e flashcards organizados para estudo prático.

## Sumário

- **Descrição**: visão geral do projeto
- **Estrutura**: organização dos arquivos e pastas
- **Pré-requisitos**: ferramentas necessárias
- **Instalação & Uso**: como rodar localmente
- **Contribuição**: como ajudar no projeto
- **Licença & Contato**: informações de licença e contato

## Descrição

Este repositório reúne materiais práticos para estudo — páginas interativas, questionários, flashcards e dashboards — criados para apoiar quem está se preparando para provas e práticas de desenvolvimento na AWS.

## Estrutura do repositório

- `index.html` — página inicial do projeto
- `aws-exam/` — material específico do exame (páginas, estilos e scripts)
- `css/` — estilos compartilhados
- `js/` — scripts do frontend (app, quizzes, flashcards, dashboards)
- `data/` — dados estáticos usados pelas páginas (ex: `developer.json`)

Estrutura completa:

```
index.html
README.md
aws-exam/
	index.html
	login.html
	css/
	js/
css/
data/
js/
```

## Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge)
- (Opcional) Node.js ou Python para servir os arquivos localmente

## Instalação e execução local

1. Clone o repositório:

```
git clone https://github.com/grasielip/-AWS-Developer-.git
cd -AWS-Developer-
```

2. Execute um servidor HTTP simples (exemplos):

Com Python 3:

```
python3 -m http.server 8000
```

Com Node (serve):

```
npx serve .
```

3. Abra no navegador:

```
http://localhost:8000/
```

Ou abra `index.html` diretamente para testes rápidos.

## Uso

- Acesse `index.html` para a página principal.
- Explore `aws-exam/` para conteúdos e quizzes relacionados ao exame.
- Os dados usados pelas páginas estão em `data/developer.json`.

## Contribuição

- Abra issues para relatar bugs ou sugerir melhorias.
- Envie pull requests com pequenas mudanças e descrições claras.
- Siga o padrão já presente nas pastas `css/` e `js/` para manter consistência.

## Licença

Este projeto está sob licença MIT — veja o arquivo `LICENSE` (se aplicável) ou adicione uma licença conforme desejar.

## Contato

Para dúvidas ou colaboração: abra uma issue ou contate o mantenedor do repositório.

---

Se quiser, eu adapto o README com mais detalhes (comandos npm, testes, screenshots, etc.).