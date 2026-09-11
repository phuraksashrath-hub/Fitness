using FitnessCenter.Api.Domain.Entities;

namespace FitnessCenter.Api.Repositories;

public interface IUserRepository
{
    Task<Member?> GetMemberByEmailAsync(string email);
    Task<Member?> GetMemberByIdAsync(Guid id);
    Task<IEnumerable<Member>> GetAllMembersAsync();
    Task AddMemberAsync(Member member);
    Task UpdateMemberAsync(Member member);
}