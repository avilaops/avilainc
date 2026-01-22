using Manager.Contracts.DTOs;

namespace Manager.Integrations.Cnpj;

public interface ICnpjLookupProvider
{
    Task<CnpjLookupResultDto> LookupAsync(string cnpj);
}
