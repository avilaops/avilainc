# Email API v0.1.0

## Configuração Porkbun SMTP

**SMTP Server:** smtp.porkbun.com  
**Port:** 587 (TLS)  
**Versão:** 0.1.0

### Contas Configuradas

1. **nicolas@avila.inc**
   - Nome: Nicolas Ávila
   - Role: CEO & Founder
   - Uso: Emails oficiais, comunicados importantes

2. **dev@avila.inc**
   - Nome: Ávila Development Team
   - Role: Development
   - Uso: Notificações técnicas, alertas de sistema

---

## Endpoints

### Base URL
```
https://api.avila.inc/v0/email
```

### 1. POST `/send`
Envia email customizado.

**Body:**
```json
{
  "from": "nicolas@avila.inc",
  "to": "user@example.com",
  "subject": "Assunto do email",
  "text": "Conteúdo em texto",
  "html": "<p>Conteúdo em HTML</p>"
}
```

**Exemplo:**
```bash
curl -X POST https://api.avila.inc/v0/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "from": "nicolas@avila.inc",
    "to": "cliente@example.com",
    "subject": "Bem-vindo à Ávila Inc",
    "text": "Obrigado por se juntar!",
    "html": "<h1>Bem-vindo!</h1><p>Obrigado por se juntar à Ávila Inc</p>"
  }'
```

---

### 2. POST `/template`
Envia email usando template pré-configurado.

**Templates Disponíveis:**
- `welcome` - Boas-vindas
- `notification` - Notificação geral
- `alert` - Alerta de sistema
- `gravatar` - Notificação Gravatar

**Body:**
```json
{
  "template": "welcome",
  "to": "user@example.com",
  "data": {
    "name": "João Silva",
    "message": "Bem-vindo ao ecossistema Ávila Inc!",
    "ctaUrl": "https://avila.inc/dashboard",
    "ctaText": "Acessar Dashboard"
  }
}
```

**Exemplos por Template:**

#### Welcome Template
```json
{
  "template": "welcome",
  "to": "newuser@example.com",
  "data": {
    "name": "Maria Santos",
    "message": "Seu acesso foi criado com sucesso!",
    "ctaUrl": "https://avila.inc/login",
    "ctaText": "Fazer Login"
  }
}
```

#### Notification Template
```json
{
  "template": "notification",
  "to": "dev@avila.inc",
  "data": {
    "title": "Nova Feature Deployada",
    "message": "A integração com Gravatar foi deployada com sucesso.",
    "details": {
      "version": "0.1.0",
      "deployTime": "2025-11-16T10:30:00Z",
      "environment": "production"
    }
  }
}
```

#### Alert Template
```json
{
  "template": "alert",
  "to": "dev@avila.inc",
  "data": {
    "alertType": "High CPU Usage",
    "message": "Servidor Barbara API atingiu 95% de uso de CPU",
    "details": {
      "server": "barbara-api-prod",
      "cpu": "95%",
      "memory": "78%",
      "timestamp": "2025-11-16T10:30:00Z"
    }
  }
}
```

#### Gravatar Template
```json
{
  "template": "gravatar",
  "to": "dev@avila.inc",
  "data": {
    "email": "user@example.com",
    "product": "secreta",
    "theme": "dark",
    "version": "0.1.0",
    "action": "cadastrada"
  }
}
```

---

### 3. GET `/verify`
Verifica conexão SMTP.

**Resposta:**
```json
{
  "success": true,
  "version": "0.1.0",
  "data": {
    "connected": true,
    "smtp": "smtp.porkbun.com",
    "accounts": ["nicolas@avila.inc", "dev@avila.inc"]
  }
}
```

---

### 4. POST `/test`
Envia email de teste para dev@avila.inc.

**Resposta:**
```json
{
  "success": true,
  "version": "0.1.0",
  "message": "Email de teste enviado para dev@avila.inc",
  "data": {
    "messageId": "<abc123@smtp.porkbun.com>",
    "response": "250 OK"
  }
}
```

---

### 5. GET `/templates`
Lista templates disponíveis.

**Resposta:**
```json
{
  "success": true,
  "version": "0.1.0",
  "data": {
    "templates": ["welcome", "notification", "alert", "gravatar"],
    "details": {
      "welcome": {
        "subject": "Bem-vindo à Ávila Inc",
        "from": "nicolas@avila.inc"
      },
      "notification": {
        "subject": "Notificação Ávila Inc",
        "from": "dev@avila.inc"
      },
      "alert": {
        "subject": "Alerta do Sistema",
        "from": "dev@avila.inc"
      },
      "gravatar": {
        "subject": "Nova Integração Gravatar",
        "from": "dev@avila.inc"
      }
    }
  }
}
```

---

### 6. GET `/accounts`
Lista contas de email configuradas.

**Resposta:**
```json
{
  "success": true,
  "version": "0.1.0",
  "data": {
    "nicolas": {
      "email": "nicolas@avila.inc",
      "name": "Nicolas Ávila",
      "role": "CEO & Founder"
    },
    "dev": {
      "email": "dev@avila.inc",
      "name": "Ávila Development Team",
      "role": "Development"
    }
  }
}
```

---

### 7. POST `/notify/gravatar`
Notifica uso do Gravatar via email.

**Body:**
```json
{
  "email": "user@example.com",
  "product": "secreta",
  "theme": "dark"
}
```

---

## Uso em JavaScript

### Envio Simples
```javascript
async function sendEmail(to, subject, message) {
  const response = await fetch('https://api.avila.inc/v0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'nicolas@avila.inc',
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`
    })
  });
  
  return await response.json();
}

// Uso
await sendEmail('cliente@example.com', 'Olá!', 'Bem-vindo à Ávila Inc');
```

### Envio com Template
```javascript
async function sendWelcomeEmail(userEmail, userName) {
  const response = await fetch('https://api.avila.inc/v0/email/template', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      template: 'welcome',
      to: userEmail,
      data: {
        name: userName,
        message: 'Obrigado por se cadastrar!',
        ctaUrl: 'https://avila.inc/dashboard',
        ctaText: 'Acessar Dashboard'
      }
    })
  });
  
  return await response.json();
}

// Uso
await sendWelcomeEmail('novousuario@example.com', 'João Silva');
```

### Verificar Conexão
```javascript
async function checkEmailService() {
  const response = await fetch('https://api.avila.inc/v0/email/verify');
  const data = await response.json();
  
  if (data.data.connected) {
    console.log('✅ Email service online');
  } else {
    console.log('❌ Email service offline');
  }
}
```

---

## Integração com Produtos Ávila

### Secreta - Notificação de Login
```javascript
async function notifyLogin(userEmail, ip) {
  await fetch('https://api.avila.inc/v0/email/template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template: 'notification',
      to: userEmail,
      data: {
        title: 'Novo Login Detectado',
        message: `Login realizado de: ${ip}`,
        details: { ip, timestamp: new Date().toISOString() }
      }
    })
  });
}
```

### Pulse Monitor - Alertas
```javascript
async function sendSystemAlert(alertData) {
  await fetch('https://api.avila.inc/v0/email/template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template: 'alert',
      to: 'dev@avila.inc',
      data: {
        alertType: alertData.type,
        message: alertData.message,
        details: alertData.metrics
      }
    })
  });
}
```

---

## Configuração Local

### Instalar dependências
```bash
cd api
npm install nodemailer
```

### Testar conexão
```bash
npm run verify:smtp
```

### Enviar email de teste
```bash
npm run test:email
```

---

## Changelog

### v0.1.0 (2025-11-16)
- ✨ Integração com Porkbun SMTP
- ✨ Contas nicolas@avila.inc e dev@avila.inc
- ✨ 4 templates pré-configurados
- ✨ Endpoints REST completos
- ✨ Suporte a HTML e texto
- ✨ Verificação de conexão

---

## Próximas Versões

### v0.2.0 (Planejado)
- ⏳ Templates customizáveis
- ⏳ Anexos de arquivo
- ⏳ Queue de emails
- ⏳ Retry automático

### v0.3.0 (Planejado)
- ⏳ Tracking de abertura
- ⏳ Tracking de cliques
- ⏳ Estatísticas de envio
- ⏳ Webhooks

---

## Suporte

**Email:** dev@avila.inc  
**SMTP:** nicolas@avila.inc  
**Documentation:** https://docs.avila.inc/email
