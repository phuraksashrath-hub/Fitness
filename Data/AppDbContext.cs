using FitnessCenter.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FitnessCenter.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Member> Members => Set<Member>();
    public DbSet<Trainer> Trainers => Set<Trainer>();
    public DbSet<MembershipPlan> MembershipPlans => Set<MembershipPlan>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<WorkoutSession> WorkoutSessions => Set<WorkoutSession>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Payment>()
            .HasDiscriminator<string>("payment_type")
            .HasValue<CreditCardPayment>("CREDIT_CARD")
            .HasValue<PromptPayPayment>("PROMPTPAY");

        modelBuilder.Entity<WorkoutSession>()
            .HasIndex(x => new { x.TrainerId, x.SessionDate, x.StartTime, x.EndTime })
            .IsUnique();
    }
}