using FitnessCenter.Api.Data;
using FitnessCenter.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FitnessCenter.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;
    public UserRepository(AppDbContext db) => _db = db;

    public async Task<Member?> GetMemberByEmailAsync(string email)
        => await _db.Members.FirstOrDefaultAsync(x => x.Email == email);

    public async Task AddMemberAsync(Member member)
    {
        await _db.Members.AddAsync(member);
        await _db.SaveChangesAsync();
    }
}