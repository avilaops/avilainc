# 🏛️ Ávila Inc - Site Institucional

> Framework empresarial auto-sustentável com 18 produtos SaaS e sistema de IA que aprende e evolui sozinho.

[![Deploy](https://img.shields.io/badge/deploy-azure-0078D4?style=flat-square&logo=microsoftazure)](https://salmon-island-0f049391e.3.azurestaticapps.net)
[![Status](https://img.shields.io/badge/status-production-success?style=flat-square)](https://salmon-island-0f049391e.3.azurestaticapps.net)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

## 🌐 Acesso

**Produção:** https://salmon-island-0f049391e.3.azurestaticapps.net

## 📋 Sobre

Site institucional da Ávila Inc, desenvolvido com design minimalista e elegante para apresentar nosso ecossistema completo de soluções empresariais.

### ✨ Características

- 🎨 Design minimalista e sofisticado
- 📱 100% responsivo
- ⚡ Performance otimizada
- 🔒 Deploy seguro no Azure
- 🚀 CI/CD automatizado com GitHub Actions

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Animações e transições suaves
- **JavaScript** - Interatividade vanilla (zero dependências)
- **Azure Static Web Apps** - Hospedagem e CDN global

## 🏗️ Estrutura do Projeto

```
.
├── index.html              # Página principal
├── assets/                 # Assets estáticos
│   ├── images/            # Imagens e logos
│   └── icons/             # Favicons e ícones
├── .github/
│   └── workflows/         # GitHub Actions CI/CD
└── README.md              # Este arquivo
```

## 🚀 Deploy

O site possui deploy automático configurado via GitHub Actions. Todo push na branch `main` dispara um novo deploy.

### Deploy Manual (Opcional)

```bash
# Instalar Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Fazer deploy
swa deploy
```

## 💻 Desenvolvimento Local

Para testar localmente:

```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js
npx serve

# Opção 3: VS Code Live Server
# Instalar extensão Live Server e clicar com botão direito no index.html
```

## 📦 Produtos Apresentados

1. **Shancrys BIM** - Gestão de construção civil
2. **Secreta** - Segurança empresarial avançada
3. **Barbara API** - Backend .NET de alta performance
4. **On Dashboard** - Dashboards operacionais inteligentes
5. **Archivus AI** - Agente bibliotecário com IA
6. **Pulse Monitor** - Monitoramento em tempo real

E mais 12 produtos integrados no ecossistema Ávila.

## 🎨 Design System

### Cores

```css
--primary: #1a1a1a          /* Preto elegante */
--primary-accent: #2d2d2d   /* Cinza escuro */
--secondary: #666666        /* Cinza médio */
--bg-main: #ffffff          /* Branco puro */
--bg-secondary: #f8f9fa     /* Off-white */
--text: #1a1a1a             /* Texto principal */
--text-secondary: #666666   /* Texto secundário */
--border: #e5e5e5           /* Bordas sutis */
```

### Tipografia

- **Font:** Inter, -apple-system, BlinkMacSystemFont, Segoe UI
- **Weights:** 400 (regular), 500 (medium), 600 (semibold)
- **Letter spacing:** -0.01em a -0.03em para elegância

## 📊 Performance

- ✅ Lighthouse Score: 95+
- ✅ First Contentful Paint: < 1s
- ✅ Time to Interactive: < 2s
- ✅ Cumulative Layout Shift: < 0.1

## 🔐 Segurança

- HTTPS obrigatório
- Content Security Policy configurado
- Headers de segurança otimizados
- Deploy isolado por branch

## 📱 Redes Sociais

- [LinkedIn](https://linkedin.com/company/avila-inc)
- [GitHub](https://github.com/avilaops)
- [Discord Community](https://discord.gg/avila)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre nosso código de conduta e processo de submissão de pull requests.

## 📞 Suporte

- **Email:** suporte@avila.inc
- **Documentação:** [docs.avila.inc](https://docs.avila.inc)
- **Issues:** [GitHub Issues](https://github.com/avilaops/AvilaInc/issues)

---

<p align="center">
  Desenvolvido com ❤️ pela equipe <strong>Ávila Inc</strong>
</p>

<p align="center">
  <sub>© 2025 Ávila Inc. Todos os direitos reservados.</sub>
</p>
