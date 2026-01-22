using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Manager.Integrations.Cnpj;
using Manager.Contracts.DTOs;

namespace Manager.Api.Controllers;

[ApiController]
[Route("api/cnpj")]
[Authorize]
public class CnpjController : ControllerBase
{
    private readonly ICnpjLookupProvider _cnpjProvider;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CnpjController> _logger;
    private static readonly SemaphoreSlim _rateLimiter = new(1, 1); // 1 req por vez

    public CnpjController(
        ICnpjLookupProvider cnpjProvider,
        IMemoryCache cache,
        ILogger<CnpjController> logger)
    {
        _cnpjProvider = cnpjProvider;
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Buscar dados cadastrais por CNPJ
    /// </summary>
    [HttpGet("{cnpj}")]
    public async Task<IActionResult> Lookup(string cnpj)
    {
        try
        {
            var cleanCnpj = NormalizeCnpj(cnpj);
            
            // Verifica cache (10 minutos)
            var cacheKey = $"cnpj_{cleanCnpj}";
            if (_cache.TryGetValue<CnpjLookupResultDto>(cacheKey, out var cached))
            {
                _logger.LogInformation("CNPJ {Cnpj} retornado do cache", MaskCnpj(cleanCnpj));
                return Ok(new { success = true, cached = true, data = cached });
            }

            // Rate limit: 1 req/seg
            await _rateLimiter.WaitAsync();
            try
            {
                var result = await _cnpjProvider.LookupAsync(cleanCnpj);
                
                // Cache por 10 minutos
                _cache.Set(cacheKey, result, TimeSpan.FromMinutes(10));

                return Ok(new { success = true, cached = false, data = result });
            }
            finally
            {
                await Task.Delay(1000); // Rate limit: 1/seg
                _rateLimiter.Release();
            }
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "CNPJ inválido: {Cnpj}", cnpj);
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao consultar CNPJ");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    private static string NormalizeCnpj(string cnpj)
    {
        return new string(cnpj.Where(char.IsDigit).ToArray());
    }

    private static string MaskCnpj(string cnpj)
    {
        if (cnpj.Length == 14)
        {
            return $"{cnpj.Substring(0, 2)}.{cnpj.Substring(2, 3)}.{cnpj.Substring(5, 3)}/{cnpj.Substring(8, 4)}-{cnpj.Substring(12, 2)}";
        }
        return cnpj;
    }
}