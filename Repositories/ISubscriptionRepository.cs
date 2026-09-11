using FitnessCenter.Api.Domain.Entities;

namespace FitnessCenter.Api.Repositories;

public interface ISubscriptionRepository : IRepository<Subscription>
{
    Task<Subscription?> GetActiveByMemberIdAsync(Guid memberId);
}