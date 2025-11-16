/**
 * Email Configuration - Porkbun SMTP v0.1.0
 * Configuração de email para Ávila Inc
 *
 * @version 0.1.0
 * @date 2025-11-16
 */

const nodemailer = require('nodemailer');

// Configuração SMTP Porkbun
const EMAIL_CONFIG = {
    version: '0.1.0',
    smtp: {
        host: 'smtp.porkbun.com',
        port: 587, // TLS
        secure: false, // true para 465, false para outras portas
        auth: {
            user: 'nicolas@avila.inc',
            pass: '7Aciqgr7@3278579'
        },
        tls: {
            rejectUnauthorized: false
        }
    },
    accounts: {
        nicolas: {
            email: 'nicolas@avila.inc',
            name: 'Nicolas Ávila',
            role: 'CEO & Founder'
        },
        dev: {
            email: 'dev@avila.inc',
            name: 'Ávila Development Team',
            role: 'Development'
        }
    },
    templates: {
        welcome: {
            subject: 'Bem-vindo à Ávila Inc',
            from: 'nicolas@avila.inc'
        },
        notification: {
            subject: 'Notificação Ávila Inc',
            from: 'dev@avila.inc'
        },
        alert: {
            subject: 'Alerta do Sistema',
            from: 'dev@avila.inc'
        },
        gravatar: {
            subject: 'Nova Integração Gravatar',
            from: 'dev@avila.inc'
        }
    }
};

/**
 * Cria transporter do Nodemailer
 * @returns {object} Transporter configurado
 */
function createTransporter() {
    return nodemailer.createTransport(EMAIL_CONFIG.smtp);
}

/**
 * POST: Envia email
 * @param {object} options - Opções do email
 * @param {string} options.from - Email do remetente (nicolas@avila.inc ou dev@avila.inc)
 * @param {string|string[]} options.to - Email(s) do(s) destinatário(s)
 * @param {string} options.subject - Assunto
 * @param {string} options.text - Conteúdo texto
 * @param {string} options.html - Conteúdo HTML
 * @param {object[]} options.attachments - Anexos (opcional)
 * @returns {Promise<object>} Resultado do envio
 */
async function sendEmail(options) {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${EMAIL_CONFIG.accounts.nicolas.name}" <${options.from || EMAIL_CONFIG.accounts.nicolas.email}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments || []
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado:', info.messageId);
        return {
            success: true,
            messageId: info.messageId,
            response: info.response
        };
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        throw error;
    }
}

/**
 * POST: Envia email com template pré-configurado
 * @param {string} templateName - Nome do template (welcome, notification, alert, gravatar)
 * @param {string|string[]} to - Destinatário(s)
 * @param {object} data - Dados para o template
 * @returns {Promise<object>} Resultado do envio
 */
async function sendTemplateEmail(templateName, to, data = {}) {
    const template = EMAIL_CONFIG.templates[templateName];

    if (!template) {
        throw new Error(`Template '${templateName}' não encontrado`);
    }

    let html = '';
    let text = '';

    // Templates predefinidos
    switch (templateName) {
        case 'welcome':
            html = `
                <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="color: #1a1a1a; font-size: 32px; margin: 0;">Bem-vindo à Ávila Inc</h1>
                    </div>
                    <div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 30px;">
                        <p style="color: #1a1a1a; font-size: 16px; line-height: 1.7;">
                            Olá ${data.name || 'usuário'},
                        </p>
                        <p style="color: #666666; font-size: 16px; line-height: 1.7;">
                            ${data.message || 'Obrigado por se juntar ao ecossistema Ávila Inc. Estamos felizes em tê-lo conosco!'}
                        </p>
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${data.ctaUrl || 'https://salmon-island-0f049391e.3.azurestaticapps.net'}"
                               style="background: #1a1a1a; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 500;">
                                ${data.ctaText || 'Acessar Plataforma'}
                            </a>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 30px; color: #999999; font-size: 14px;">
                        <p>© ${new Date().getFullYear()} Ávila Inc. Todos os direitos reservados.</p>
                    </div>
                </div>
            `;
            text = `Bem-vindo à Ávila Inc\n\n${data.message || 'Obrigado por se juntar ao ecossistema Ávila Inc.'}`;
            break;

        case 'notification':
            html = `
                <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #1a1a1a;">${data.title || 'Notificação'}</h2>
                    <p style="color: #666666; line-height: 1.7;">${data.message}</p>
                    ${data.details ? `<pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(data.details, null, 2)}</pre>` : ''}
                </div>
            `;
            text = `${data.title || 'Notificação'}\n\n${data.message}`;
            break;

        case 'alert':
            html = `
                <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #fee; border-left: 4px solid #c00; padding: 15px; margin-bottom: 20px;">
                        <h2 style="color: #c00; margin: 0 0 10px 0;">⚠️ Alerta do Sistema</h2>
                        <p style="margin: 0; color: #666;">${data.alertType || 'Sistema'}</p>
                    </div>
                    <p style="color: #1a1a1a; font-weight: 500;">${data.message}</p>
                    ${data.details ? `<pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(data.details, null, 2)}</pre>` : ''}
                    <p style="color: #999; font-size: 13px; margin-top: 20px;">Timestamp: ${new Date().toISOString()}</p>
                </div>
            `;
            text = `⚠️ ALERTA DO SISTEMA\n\n${data.message}\n\nTimestamp: ${new Date().toISOString()}`;
            break;

        case 'gravatar':
            html = `
                <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #1a1a1a;">🎨 Nova Integração Gravatar</h2>
                    <p style="color: #666666; line-height: 1.7;">
                        A integração com Gravatar foi ${data.action || 'configurada'} com sucesso!
                    </p>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
                        <p style="margin: 5px 0;"><strong>Produto:</strong> ${data.product || 'N/A'}</p>
                        <p style="margin: 5px 0;"><strong>Tema:</strong> ${data.theme || 'light'}</p>
                        <p style="margin: 5px 0;"><strong>Versão API:</strong> ${data.version || '0.1.0'}</p>
                    </div>
                </div>
            `;
            text = `Nova Integração Gravatar\n\nEmail: ${data.email}\nProduto: ${data.product}\nTema: ${data.theme}`;
            break;
    }

    return sendEmail({
        from: template.from,
        to,
        subject: data.subject || template.subject,
        text,
        html
    });
}

/**
 * POST: Envia notificação de novo usuário Gravatar
 * @param {string} email - Email do usuário
 * @param {string} product - Produto que está usando
 * @param {string} theme - Tema (light/dark)
 * @returns {Promise<object>} Resultado do envio
 */
async function notifyGravatarUsage(email, product, theme = 'light') {
    return sendTemplateEmail('gravatar', 'dev@avila.inc', {
        email,
        product,
        theme,
        version: '0.1.0',
        action: 'utilizada'
    });
}

/**
 * GET: Verifica conexão SMTP
 * @returns {Promise<boolean>} Status da conexão
 */
async function verifyConnection() {
    const transporter = createTransporter();

    try {
        await transporter.verify();
        console.log('✅ Conexão SMTP verificada com sucesso');
        return true;
    } catch (error) {
        console.error('❌ Erro na conexão SMTP:', error);
        return false;
    }
}

/**
 * POST: Envia email de teste
 * @returns {Promise<object>} Resultado do envio
 */
async function sendTestEmail() {
    return sendEmail({
        from: 'nicolas@avila.inc',
        to: 'dev@avila.inc',
        subject: '✅ Teste de Email - Ávila Inc',
        text: 'Este é um email de teste do sistema Ávila Inc.',
        html: `
            <div style="font-family: Inter, system-ui, sans-serif; padding: 20px;">
                <h2 style="color: #1a1a1a;">✅ Teste de Email</h2>
                <p style="color: #666;">Este é um email de teste do sistema Ávila Inc.</p>
                <p style="color: #999; font-size: 13px;">Enviado em: ${new Date().toISOString()}</p>
            </div>
        `
    });
}

module.exports = {
    EMAIL_CONFIG,
    sendEmail,
    sendTemplateEmail,
    notifyGravatarUsage,
    verifyConnection,
    sendTestEmail,
    createTransporter
};
