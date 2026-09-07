public interface ISubscriptionRepository : IRepository<Subscription>
{
    Task<Subscription?> GetActiveByMemberIdAsync(Guid memberId);
}