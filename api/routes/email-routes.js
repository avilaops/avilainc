/**
 * Email Routes v0.1.0
 * Endpoints para envio de emails via Porkbun SMTP
 * 
 * @version 0.1.0
 * @date 2025-11-16
 */

const express = require('express');
const router = express.Router();
const email = require('../email');

/**
 * POST /api/v0/email/send
 * Envia email customizado
 * 
 * @body {string} from - Email remetente (nicolas@avila.inc ou dev@avila.inc)
 * @body {string|string[]} to - Destinatário(s)
 * @body {string} subject - Assunto
 * @body {string} text - Conteúdo texto
 * @body {string} html - Conteúdo HTML (opcional)
 * @body {object[]} attachments - Anexos (opcional)
 * @returns {object} Resultado do envio
 */
router.post('/send', async (req, res) => {
    try {
        const { from, to, subject, text, html, attachments } = req.body;

        if (!to || !subject || !text) {
            return res.status(400).json({
                success: false,
                error: 'Campos obrigatórios: to, subject, text'
            });
        }

        const result = await email.sendEmail({
            from,
            to,
            subject,
            text,
            html,
            attachments
        });

        res.json({
            success: true,
            version: '0.1.0',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/v0/email/template
 * Envia email usando template pré-configurado
 * 
 * @body {string} template - Nome do template (welcome, notification, alert, gravatar)
 * @body {string|string[]} to - Destinatário(s)
 * @body {object} data - Dados para o template
 * @returns {object} Resultado do envio
 */
router.post('/template', async (req, res) => {
    try {
        const { template, to, data } = req.body;

        if (!template || !to) {
            return res.status(400).json({
                success: false,
                error: 'Campos obrigatórios: template, to'
            });
        }

        const result = await email.sendTemplateEmail(template, to, data);

        res.json({
            success: true,
            version: '0.1.0',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/v0/email/verify
 * Verifica conexão SMTP
 * 
 * @returns {object} Status da conexão
 */
router.get('/verify', async (req, res) => {
    try {
        const isConnected = await email.verifyConnection();

        res.json({
            success: true,
            version: '0.1.0',
            data: {
                connected: isConnected,
                smtp: 'smtp.porkbun.com',
                accounts: ['nicolas@avila.inc', 'dev@avila.inc']
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/v0/email/test
 * Envia email de teste
 * 
 * @returns {object} Resultado do envio
 */
router.post('/test', async (req, res) => {
    try {
        const result = await email.sendTestEmail();

        res.json({
            success: true,
            version: '0.1.0',
            message: 'Email de teste enviado para dev@avila.inc',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/v0/email/templates
 * Lista templates disponíveis
 * 
 * @returns {object} Templates disponíveis
 */
router.get('/templates', (req, res) => {
    res.json({
        success: true,
        version: '0.1.0',
        data: {
            templates: Object.keys(email.EMAIL_CONFIG.templates),
            details: email.EMAIL_CONFIG.templates
        }
    });
});

/**
 * GET /api/v0/email/accounts
 * Lista contas de email configuradas
 * 
 * @returns {object} Contas disponíveis
 */
router.get('/accounts', (req, res) => {
    res.json({
        success: true,
        version: '0.1.0',
        data: email.EMAIL_CONFIG.accounts
    });
});

/**
 * POST /api/v0/email/notify/gravatar
 * Notifica uso do Gravatar via email
 * 
 * @body {string} email - Email do usuário
 * @body {string} product - Produto que está usando
 * @body {string} theme - Tema (light/dark)
 * @returns {object} Resultado do envio
 */
router.post('/notify/gravatar', async (req, res) => {
    try {
        const { email: userEmail, product, theme } = req.body;

        if (!userEmail || !product) {
            return res.status(400).json({
                success: false,
                error: 'Campos obrigatórios: email, product'
            });
        }

        const result = await email.notifyGravatarUsage(userEmail, product, theme);

        res.json({
            success: true,
            version: '0.1.0',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
