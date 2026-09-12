using FitnessCenter.Api.Domain.Entities;

namespace FitnessCenter.Api.Repositories;

public interface IUserRepository
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<Member?> GetMemberByEmailAsync(string email);
    Task<Member?> GetMemberByIdAsync(Guid id);
    Task<IEnumerable<Member>> GetAllMembersAsync();
    Task AddMemberAsync(Member member);
    Task UpdateMemberAsync(Member member);
    Task<Trainer?> GetTrainerByIdAsync(Guid id);
    Task<IEnumerable<Trainer>> GetAllTrainersAsync();
    Task AddTrainerAsync(Trainer trainer);
    Task UpdateTrainerAsync(Trainer trainer);
}
