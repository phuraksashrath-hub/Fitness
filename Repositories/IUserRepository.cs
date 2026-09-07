using FitnessCenter.Api.Domain.Entities;

namespace FitnessCenter.Api.Repositories;

public interface IUserRepository
{
    Task<Member?> GetMemberByEmailAsync(string email);
    Task AddMemberAsync(Member member);
}