using FitnessCenter.Api.Data;
using FitnessCenter.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FitnessCenter.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;
    public UserRepository(AppDbContext db) => _db = db;

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        var member = await _db.Members.FirstOrDefaultAsync(x => x.Email == email);
        if (member is not null) return member;

        return await _db.Trainers.FirstOrDefaultAsync(x => x.Email == email);
    }

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

    public async Task<Trainer?> GetTrainerByIdAsync(Guid id)
        => await _db.Trainers.FirstOrDefaultAsync(x => x.Id == id);

    public async Task<IEnumerable<Trainer>> GetAllTrainersAsync()
        => await _db.Trainers.OrderBy(x => x.FullName).ToListAsync();

    public async Task AddTrainerAsync(Trainer trainer)
    {
        await _db.Trainers.AddAsync(trainer);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateTrainerAsync(Trainer trainer)
    {
        _db.Trainers.Update(trainer);
        await _db.SaveChangesAsync();
    }
}
