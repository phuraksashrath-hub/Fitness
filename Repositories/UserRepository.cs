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

    public async Task<Member?> GetMemberByIdAsync(Guid id)
        => await _db.Members.FirstOrDefaultAsync(x => x.Id == id);

    public async Task<IEnumerable<Member>> GetAllMembersAsync()
        => await _db.Members.OrderBy(x => x.FullName).ToListAsync();

    public async Task AddMemberAsync(Member member)
    {
        await _db.Members.AddAsync(member);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateMemberAsync(Member member)
    {
        _db.Members.Update(member);
        await _db.SaveChangesAsync();
    }
}