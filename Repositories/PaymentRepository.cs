using FitnessCenter.Api.Data;
using FitnessCenter.Api.Domain.Entities;

namespace FitnessCenter.Api.Repositories;

public class PaymentRepository : Repository<Payment>, IPaymentRepository
{
    public PaymentRepository(AppDbContext db) : base(db) { }
}