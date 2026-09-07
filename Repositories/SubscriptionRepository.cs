using FitnessCenter.Api.Data;
using FitnessCenter.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FitnessCenter.Api.Repositories;

public class SubscriptionRepository : Repository<Subscription>, ISubscriptionRepository
{
    public SubscriptionRepository(AppDbContext db) : base(db) { }

    public async Task<Subscription?> GetActiveByMemberIdAsync(Guid memberId)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        return await _db.Subscriptions
            .Where(x => x.MemberId == memberId && x.Status == "ACTIVE" && x.EndDate >= today)
            .OrderByDescending(x => x.EndDate)
            .FirstOrDefaultAsync();
    }
}