using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using MongoDB.Driver;
using Manager.Core.Entities;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Cors;

namespace Manager.Api.Controllers;

[ApiController]
[Route("api/public/leads")]
[EnableCors("LandingCors")]
public class PublicLeadsController : ControllerBase
{
    private readonly IMongoCollection<Lead> _leadsCollection;
    private readonly IMongoCollection<AnalyticsEvent> _eventsCollection;
    private readonly ILogger<PublicLeadsController> _logger;
    private readonly IMemoryCache _cache;

    public PublicLeadsController(
        IMongoCollection<Lead> leadsCollection,
        IMongoCollection<AnalyticsEvent> eventsCollection,
        ILogger<PublicLeadsController> logger,
        IMemoryCache cache)
    {
        _leadsCollection = leadsCollection;
        _eventsCollection = eventsCollection;
        _logger = logger;
        _cache = cache;
    }

    /// <summary>
    /// Endpoint público para captura de leads da Landing Page
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLeadRequest request)
    {
        // Rate limiting: 10 requests por minuto por IP
        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var cacheKey = $"lead_rate_limit_{clientIp}";
        
        if (_cache.TryGetValue(cacheKey, out int requestCount))
        {
            if (requestCount >= 10)
            {
                _logger.LogWarning("Rate limit exceeded for IP: {Ip}", clientIp);
                return StatusCode(429, new { ok = false, error = "Muitas tentativas. Tente novamente em alguns minutos." });
            }
        }
        
        // Incrementa contador
        _cache.Set(cacheKey, (requestCount + 1), TimeSpan.FromMinutes(1));

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var lead = new Lead
            {
                Nome = request.Name.Trim(),
                Email = request.Email.Trim().ToLowerInvariant(),
                Telefone = request.Phone.Trim(),
                Observacoes = request.Message?.Trim(),
                Origem = request.Source ?? "Landing",
                Status = "novo",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                // Novos campos de rastreamento
                UtmSource = request.UtmSource,
                UtmCampaign = request.UtmCampaign,
                UtmMedium = request.UtmMedium,
                PagePath = request.PagePath,
                Referrer = request.Referrer,
                ServiceInterest = request.ServiceInterest
            };

            await _leadsCollection.InsertOneAsync(lead);

            _logger.LogInformation(
                "Lead criado: {Email} - {Name} via {Source} - Service: {Service}",
                MaskEmail(lead.Email),
                lead.Nome,
                lead.Origem,
                lead.ServiceInterest
            );

            return Ok(new { ok = true, id = lead.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar lead público");
            return StatusCode(500, new { ok = false, error = "Erro interno do servidor" });
        }
    }

    private static string MaskEmail(string email)
    {
        if (string.IsNullOrEmpty(email) || !email.Contains('@'))
            return email;

        var parts = email.Split('@');
        var local = parts[0];
        var domain = parts[1];

        if (local.Length <= 2)
            return $"{local}***@{domain}";

        return $"{local.Substring(0, 2)}***@{domain}";
    }
}

/// <summary>
/// DTO para criação de lead público (Landing Page)
/// </summary>
public sealed class CreateLeadRequest
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [MinLength(2, ErrorMessage = "Nome deve ter pelo menos 2 caracteres")]
    [MaxLength(100, ErrorMessage = "Nome muito longo")]
    public string Name { get; set; } = "";

    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    [MaxLength(150, ErrorMessage = "Email muito longo")]
    public string Email { get; set; } = "";

    [Required(ErrorMessage = "Telefone é obrigatório")]
    [MinLength(8, ErrorMessage = "Telefone deve ter pelo menos 8 dígitos")]
    [MaxLength(20, ErrorMessage = "Telefone muito longo")]
    [Phone(ErrorMessage = "Formato de telefone inválido")]
    public string Phone { get; set; } = "";

    [MaxLength(500, ErrorMessage = "Mensagem muito longa")]
    public string? Message { get; set; }

    [MaxLength(50)]
    public string Source { get; set; } = "Landing";

    // Campos de rastreamento UTM
    [MaxLength(100)]
    public string? UtmSource { get; set; }

    [MaxLength(100)]
    public string? UtmCampaign { get; set; }

    [MaxLength(100)]
    public string? UtmMedium { get; set; }

    // Campos de contexto
    [MaxLength(500)]
    public string? PagePath { get; set; }

    [MaxLength(500)]
    public string? Referrer { get; set; }

    [MaxLength(200)]
    public string? ServiceInterest { get; set; }
}
